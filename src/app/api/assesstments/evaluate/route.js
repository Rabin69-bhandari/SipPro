import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from "@google/genai"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkFeatureLimit } from "@/lib/billings/check-limit"


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})


// ============================================================
// HELPERS
// ============================================================

function normalizeScore(score) {
  const number = Number(score)

  if (!Number.isFinite(number)) {
    return 0
  }

  return Math.max(
    0,
    Math.min(
      10,
      Math.round(number)
    )
  )
}


function isValidPracticalImage(image) {
  if (!image) {
    return true
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
  ]

  if (
    !image.data ||
    typeof image.data !== "string"
  ) {
    return false
  }

  if (
    !allowedTypes.includes(
      image.mimeType
    )
  ) {
    return false
  }

  return true
}


// ============================================================
// POST — EVALUATE ASSESSMENT
// ============================================================

export async function POST(request) {
  try {

    // ==========================================
    // 1. AUTH
    // ==========================================

    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }


    // ==========================================
    // 2. CHECK PLAN LIMIT
    // ==========================================

    const access =
      await checkFeatureLimit({
        userId,
        feature: "assessments",
      })


    if (!access.allowed) {
      return Response.json(
        {
          success: false,

          code:
            "PLAN_LIMIT_REACHED",

          error:
            "Your current plan has reached its assessment limit.",

          billing: {
            plan: access.plan,
            usage: access.usage,
            limit: access.limit,
            remaining:
              access.remaining,
          },
        },
        {
          status: 403,
        }
      )
    }


    // ==========================================
    // 3. REQUEST BODY
    // ==========================================

    const body =
      await request.json()


    const {
      careerGoalId,
      assessment,
      answers,
      practicalImage,
    } = body


    if (
      !careerGoalId ||
      !assessment ||
      !answers
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Missing assessment data",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 4. VALIDATE ANSWERS
    // ==========================================

    if (
      !answers.question?.trim()
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Knowledge question must be completed",
        },
        {
          status: 400,
        }
      )
    }


    if (
      !answers.scenario?.trim()
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Scenario must be completed",
        },
        {
          status: 400,
        }
      )
    }


    if (
      !answers.practical?.trim() &&
      !practicalImage?.data
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Practical task must include a written solution or image evidence",
        },
        {
          status: 400,
        }
      )
    }


    if (
      !isValidPracticalImage(
        practicalImage
      )
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Invalid practical image",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 5. SUPABASE
    // ==========================================

    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // 6. FETCH TRUSTED CAREER GOAL
    // ==========================================

    const {
      data: careerGoal,
      error: careerError,
    } = await supabase
      .from("career_goals")
      .select(`
        id,
        title,
        experience,
        goal,
        skills,
        progress
      `)
      .eq(
        "id",
        careerGoalId
      )
      .single()


    if (
      careerError ||
      !careerGoal
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Career goal not found",
        },
        {
          status: 404,
        }
      )
    }


    // ==========================================
    // 7. BUILD PROMPT
    // ==========================================

    const hasPracticalImage =
      Boolean(
        practicalImage?.data
      )


    const prompt = `
You are evaluating a candidate's career skill assessment.

Evaluate the candidate fairly and consistently.

CAREER INFORMATION

Career:
${careerGoal.title}

Experience Level:
${careerGoal.experience}

Career Goal:
${careerGoal.goal}

Claimed Skills:
${careerGoal.skills?.join(", ") || "None provided"}


ASSESSMENT


SECTION 1 — KNOWLEDGE QUESTION

Maximum marks: 10

Question:
${assessment.question?.prompt}

Candidate Answer:
${answers.question}


SECTION 2 — SCENARIO

Maximum marks: 10

Scenario:
${assessment.scenario?.prompt}

Candidate Answer:
${answers.scenario}


SECTION 3 — PRACTICAL TASK

Maximum marks: 10

Task:
${assessment.practical?.prompt}

Candidate Written Submission:
${answers.practical?.trim() || "No written submission provided."}

Practical Image Evidence:
${
  hasPracticalImage
    ? "An image submitted by the candidate is attached after this instruction."
    : "No image was submitted."
}


PRACTICAL IMAGE EVALUATION RULES

If practical image evidence is attached:

- Inspect the image carefully.
- Treat the image as supporting evidence for the practical task.
- Evaluate only information that is actually visible in the image.
- Do not assume hidden functionality.
- Do not assume code works merely because an interface is visible.
- Consider whether the image is relevant to the requested practical task.
- Combine the written submission and visible image evidence when determining the practical score.

If the practical task requires implementation details that cannot be verified from a screenshot, do not assume those details are correct.

If no image is attached, evaluate the practical task using the written submission only.


GENERAL EVALUATION RULES

Evaluate each section independently.

Each section must receive an integer score from 0 to 10.

Use these standards:

0-2:
Incorrect, irrelevant, or shows very little understanding.

3-4:
Partial understanding but major concepts or requirements are missing.

5-6:
Reasonable understanding and partially correct solution.

7-8:
Strong answer with good reasoning and mostly correct execution.

9:
Excellent answer with strong understanding and only minor issues.

10:
Exceptional answer that fully satisfies the task with accurate reasoning.

Do not give marks simply because the response is long.

Judge:

- correctness
- relevance
- reasoning
- practical usefulness
- fulfillment of the requested task

For each section provide concise constructive feedback.

Also identify:

- strengths demonstrated by the candidate
- areas that need improvement
- concise overall feedback


Return ONLY valid JSON.

Use exactly this structure:

{
  "question": {
    "score": 0,
    "feedback": ""
  },
  "scenario": {
    "score": 0,
    "feedback": ""
  },
  "practical": {
    "score": 0,
    "feedback": ""
  },
  "strengths": [],
  "weakAreas": [],
  "overallFeedback": ""
}
`


    // ==========================================
    // 8. BUILD GEMINI CONTENT
    // ==========================================

    const parts = [
      {
        text: prompt,
      },
    ]


    if (hasPracticalImage) {
      parts.push({
        inlineData: {
          mimeType:
            practicalImage.mimeType,

          data:
            practicalImage.data,
        },
      })
    }


    // ==========================================
    // 9. GEMINI EVALUATION
    // ==========================================

    const response =
      await ai.models.generateContent({
        model:
          "gemini-3.5-flash-lite",

        contents: [
          {
            role: "user",
            parts,
          },
        ],

        config: {
          responseMimeType:
            "application/json",

          temperature: 0.2,
        },
      })


    const rawText =
      response.text


    if (!rawText) {
      throw new Error(
        "Gemini returned an empty response"
      )
    }


    let evaluation


    try {
      evaluation =
        JSON.parse(rawText)
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        rawText
      )

      throw new Error(
        "Gemini returned an invalid evaluation"
      )
    }


    // ==========================================
    // 10. VALIDATE SCORES
    // ==========================================

    const questionScore =
      normalizeScore(
        evaluation.question?.score
      )


    const scenarioScore =
      normalizeScore(
        evaluation.scenario?.score
      )


    const practicalScore =
      normalizeScore(
        evaluation.practical?.score
      )


    // ==========================================
    // 11. SERVER CALCULATES TOTAL
    // ==========================================

    const totalScore =
      questionScore +
      scenarioScore +
      practicalScore


    // ==========================================
    // 12. STATUS
    // ==========================================

    const status =
      totalScore >= 21
        ? "passed"
        : "needs_improvement"


    // ==========================================
    // 13. CLEAN FEEDBACK
    // ==========================================

    const feedback = {

      question: {
        score:
          questionScore,

        feedback:
          evaluation.question
            ?.feedback || "",
      },


      scenario: {
        score:
          scenarioScore,

        feedback:
          evaluation.scenario
            ?.feedback || "",
      },


      practical: {
        score:
          practicalScore,

        feedback:
          evaluation.practical
            ?.feedback || "",

        imageEvidenceUsed:
          hasPracticalImage,
      },


      strengths:
        Array.isArray(
          evaluation.strengths
        )
          ? evaluation.strengths
          : [],


      weakAreas:
        Array.isArray(
          evaluation.weakAreas
        )
          ? evaluation.weakAreas
          : [],


      overallFeedback:
        evaluation.overallFeedback ||
        "",
    }


    // ==========================================
    // 14. SAVE RESULT
    // ==========================================

    const {
      data: savedResult,
      error: saveError,
    } = await supabase
      .from(
        "assessment_results"
      )
      .insert({

        career_goal_id:
          careerGoalId,

        question_score:
          questionScore,

        scenario_score:
          scenarioScore,

        practical_score:
          practicalScore,

        total_score:
          totalScore,

        status,

        feedback,

      })
      .select()
      .single()


    if (saveError) {
      console.error(
        "Assessment save error:",
        saveError
      )

      throw new Error(
        "Failed to save assessment result"
      )
    }


    // ==========================================
    // 15. RETURN RESULT
    // ==========================================

    return Response.json({
      success: true,

      result: {

        id:
          savedResult.id,

        careerGoalId,

        questionScore,

        scenarioScore,

        practicalScore,

        totalScore,

        maxScore: 30,

        status,

        practicalImageUsed:
          hasPracticalImage,

        feedback,

        createdAt:
          savedResult.created_at,
      },
    })


  } catch (error) {

    console.error(
      "Assessment evaluation error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to evaluate assessment",
      },
      {
        status: 500,
      }
    )

  }
}