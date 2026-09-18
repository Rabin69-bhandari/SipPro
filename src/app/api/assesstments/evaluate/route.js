import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from "@google/genai"

import { createServerSupabaseClient } from "@/lib/supabase/server"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})


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
    // 2. REQUEST BODY
    // ==========================================

    const body = await request.json()

    const {
      careerGoalId,
      assessment,
      answers,
    } = body


    if (
      !careerGoalId ||
      !assessment ||
      !answers
    ) {
      return Response.json(
        {
          success: false,
          error: "Missing assessment data",
        },
        {
          status: 400,
        }
      )
    }


    if (
      !answers.question?.trim() ||
      !answers.scenario?.trim() ||
      !answers.practical?.trim()
    ) {
      return Response.json(
        {
          success: false,
          error: "All assessment sections must be completed",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 3. SUPABASE
    // ==========================================

    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // 4. FETCH CAREER GOAL
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
      .eq("id", careerGoalId)
      .single()


    if (careerError || !careerGoal) {
      return Response.json(
        {
          success: false,
          error: "Career goal not found",
        },
        {
          status: 404,
        }
      )
    }


    // ==========================================
    // 5. BUILD GEMINI PROMPT
    // ==========================================

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

Candidate Submission:
${answers.practical}


EVALUATION RULES

Evaluate each section independently.

Each section must receive an integer score from 0 to 10.

Use these general standards:

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

Judge correctness, relevance, reasoning, practical usefulness,
and how well the candidate satisfies the actual question.

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
    // 6. GEMINI EVALUATION
    // ==========================================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: prompt,

        config: {
          responseMimeType: "application/json",
        },
      })


    const rawText = response.text


    if (!rawText) {
      throw new Error(
        "Gemini returned an empty response"
      )
    }


    const evaluation =
      JSON.parse(rawText)


    // ==========================================
    // 7. VALIDATE SCORES
    // ==========================================

    const normalizeScore = (score) => {
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
    // 8. SERVER CALCULATES TOTAL
    // ==========================================

    const totalScore =
      questionScore +
      scenarioScore +
      practicalScore


    // ==========================================
    // 9. STATUS
    // ==========================================

    const status =
      totalScore >= 21
        ? "passed"
        : "needs_improvement"


    // ==========================================
    // 10. CLEAN FEEDBACK
    // ==========================================

    const feedback = {
      question: {
        score: questionScore,
        feedback:
          evaluation.question?.feedback || "",
      },

      scenario: {
        score: scenarioScore,
        feedback:
          evaluation.scenario?.feedback || "",
      },

      practical: {
        score: practicalScore,
        feedback:
          evaluation.practical?.feedback || "",
      },

      strengths:
        Array.isArray(evaluation.strengths)
          ? evaluation.strengths
          : [],

      weakAreas:
        Array.isArray(evaluation.weakAreas)
          ? evaluation.weakAreas
          : [],

      overallFeedback:
        evaluation.overallFeedback || "",
    }


    // ==========================================
    // 11. SAVE RESULT
    // ==========================================

    const {
      data: savedResult,
      error: saveError,
    } = await supabase
      .from("assessment_results")
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
    // 12. RETURN RESULT
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