import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from "@google/genai"

import { createServerSupabaseClient } from "@/lib/supabase/server"


// ==========================================
// GEMINI
// ==========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})


// ==========================================
// POST
// ==========================================

export async function POST(request) {

  try {

    // ========================================
    // AUTH
    // ========================================

    const { userId } =
      await auth()


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


    // ========================================
    // BODY
    // ========================================

    const body =
      await request.json()


    const {
      roadmapId,
      title,
      topics,
      transcript,
    } = body


    // ========================================
    // VALIDATION
    // ========================================

    if (!roadmapId) {

      return Response.json(
        {
          success: false,
          error: "Roadmap ID is required.",
        },
        {
          status: 400,
        }
      )

    }


    if (
      !Array.isArray(transcript) ||
      transcript.length === 0
    ) {

      return Response.json(
        {
          success: false,
          error:
            "Interview transcript is required.",
        },
        {
          status: 400,
        }
      )

    }


    // ========================================
    // SUPABASE
    // ========================================

    const supabase =
      createServerSupabaseClient()


    // ========================================
    // GET ROADMAP + CAREER
    // ========================================

    const {
      data: roadmap,
      error: roadmapError,
    } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        career_goal_id,

        career_goal:career_goals (
          id,
          title,
          experience,
          goal,
          skills
        )
      `)
      .eq(
        "id",
        roadmapId
      )
      .single()


    if (
      roadmapError ||
      !roadmap
    ) {

      console.error(
        "Roadmap error:",
        roadmapError
      )


      return Response.json(
        {
          success: false,
          error:
            "Career roadmap not found.",
        },
        {
          status: 404,
        }
      )

    }


    const career =
      roadmap.career_goal


    // ========================================
    // CLEAN TRANSCRIPT
    // ========================================

    const cleanTranscript =
      transcript.filter(
        (item) =>
          item &&
          typeof item.text === "string" &&
          item.text.trim()
      )


    if (
      cleanTranscript.length === 0
    ) {

      return Response.json(
        {
          success: false,
          error:
            "Interview transcript is empty.",
        },
        {
          status: 400,
        }
      )

    }


    // ========================================
    // FORMAT TRANSCRIPT
    // ========================================

    const formattedTranscript =
      cleanTranscript
        .map((item) => {

          const speaker =
            item.role === "user"
              ? "Candidate"
              : "Interviewer"


          return `${speaker}: ${item.text.trim()}`

        })
        .join("\n\n")


    // ========================================
    // PROMPT
    // ========================================

    const prompt = `
You are evaluating a completed professional interview.

Evaluate ONLY the evidence demonstrated by the candidate in the interview transcript.

Do not assume that a skill is demonstrated simply because it appears in the candidate's listed skills.

Do not infer personality, emotions, confidence, intelligence, mental state, or psychological characteristics.

Evaluate observable evidence only.


==================================================
CANDIDATE CONTEXT
==================================================

Career:
${career?.title || title || "Career"}

Experience Level:
${career?.experience || "Not specified"}

Career Goal:
${career?.goal || "Not specified"}

Listed Skills:
${
  career?.skills?.length
    ? career.skills.join(", ")
    : "Not specified"
}

Learning Topics:
${
  topics?.length
    ? topics.join(", ")
    : "General career knowledge"
}


==================================================
INTERVIEW TRANSCRIPT
==================================================

${formattedTranscript}


==================================================
EVALUATION CRITERIA
==================================================

Evaluate the candidate in exactly four dimensions.


1. TECHNICAL KNOWLEDGE — 0 to 25

Evaluate:
- correctness of technical/domain knowledge
- understanding of concepts
- ability to explain concepts accurately
- depth appropriate to their stated experience


2. PROBLEM SOLVING — 0 to 25

Evaluate:
- reasoning through problems
- identifying relevant information
- logical decision making
- ability to approach unfamiliar situations


3. COMMUNICATION — 0 to 25

Evaluate ONLY observable communication qualities:
- clarity
- organization
- relevance
- ability to explain reasoning
- completeness of answers

Do NOT evaluate psychological confidence or personality.


4. PRACTICAL REASONING — 0 to 25

Evaluate:
- ability to apply knowledge
- practical decision making
- understanding of trade-offs
- scenario-based reasoning
- connection between theory and real-world application


==================================================
SCORING RULES
==================================================

Each category must be an integer between 0 and 25.

The total score must be between 0 and 100.

The total score MUST equal:

technicalScore
+
problemSolvingScore
+
communicationScore
+
practicalReasoningScore


==================================================
DEMONSTRATED SKILLS
==================================================

Only include a skill in demonstratedSkills when the candidate's interview answers provide reasonable evidence for that skill.

Do NOT simply copy the candidate's listed skills.

Use concise professional skill names.

Examples:

JavaScript
React
Problem Solving
API Design
Database Design
Technical Communication


==================================================
FEEDBACK
==================================================

summary:

Write a short professional summary based only on the candidate's demonstrated interview performance.


strengths:

Provide specific strengths supported by the transcript.


improvements:

Provide specific areas where the candidate could improve.


recommendation:

Provide one practical next step appropriate for the candidate.


==================================================
OUTPUT
==================================================

Return exactly one JSON object.

Use exactly this structure:

{
  "technicalScore": 0,
  "problemSolvingScore": 0,
  "communicationScore": 0,
  "practicalReasoningScore": 0,
  "totalScore": 0,

  "feedback": {

    "summary": "Short overall evaluation.",

    "strengths": [
      "Specific strength"
    ],

    "improvements": [
      "Specific improvement"
    ],

    "demonstratedSkills": [
      "Skill"
    ],

    "recommendation":
      "One useful next step."

  }
}
`


    // ========================================
    // GEMINI GENERATION
    // ========================================

    const response =
      await ai.models.generateContent({

        model:
          "gemini-3.5-flash-lite",

        contents:
          prompt,

        config: {

          responseMimeType:
            "application/json",

          temperature:
            0.2,

        },

      })


    // ========================================
    // GET RESPONSE TEXT
    // ========================================

    const text =
      response.text


    if (!text) {

      throw new Error(
        "Gemini returned an empty response."
      )

    }


    // ========================================
    // PARSE JSON
    // ========================================

    let evaluation


    try {

      evaluation =
        JSON.parse(text)

    } catch (error) {

      console.error(
        "Gemini raw response:",
        text
      )


      throw new Error(
        "AI returned an invalid interview evaluation."
      )

    }


    // ========================================
    // VALIDATE SCORE VALUES
    // ========================================

    const scores = [

      evaluation.technicalScore,

      evaluation.problemSolvingScore,

      evaluation.communicationScore,

      evaluation.practicalReasoningScore,

    ]


    const validScores =
      scores.every(
        (score) =>

          Number.isInteger(score) &&

          score >= 0 &&

          score <= 25
      )


    if (!validScores) {

      console.error(
        "Invalid Gemini scores:",
        evaluation
      )


      throw new Error(
        "AI returned invalid interview scores."
      )

    }


    // ========================================
    // CALCULATE TOTAL OURSELVES
    // ========================================

    const calculatedTotal =
      scores.reduce(
        (total, score) =>
          total + score,
        0
      )


    // ========================================
    // CLEAN FEEDBACK
    // ========================================

    const feedback = {

      summary:
        typeof evaluation.feedback
          ?.summary === "string"

          ? evaluation.feedback
              .summary.trim()

          : "Interview evaluation completed.",


      strengths:
        Array.isArray(
          evaluation.feedback
            ?.strengths
        )

          ? evaluation.feedback
              .strengths
              .filter(
                (item) =>
                  typeof item ===
                    "string"
              )

          : [],


      improvements:
        Array.isArray(
          evaluation.feedback
            ?.improvements
        )

          ? evaluation.feedback
              .improvements
              .filter(
                (item) =>
                  typeof item ===
                    "string"
              )

          : [],


      demonstratedSkills:
        Array.isArray(
          evaluation.feedback
            ?.demonstratedSkills
        )

          ? evaluation.feedback
              .demonstratedSkills
              .filter(
                (item) =>
                  typeof item ===
                    "string"
              )

          : [],


      recommendation:
        typeof evaluation.feedback
          ?.recommendation === "string"

          ? evaluation.feedback
              .recommendation.trim()

          : "",

    }


    // ========================================
    // SAVE TO SUPABASE
    // ========================================

    const {
      data: savedResult,
      error: saveError,
    } = await supabase
      .from(
        "interview_results"
      )
      .insert({

        career_goal_id:
          roadmap.career_goal_id,

        technical_score:
          evaluation.technicalScore,

        problem_solving_score:
          evaluation.problemSolvingScore,

        communication_score:
          evaluation.communicationScore,

        practical_reasoning_score:
          evaluation.practicalReasoningScore,

        total_score:
          calculatedTotal,

        feedback,

      })
      .select()
      .single()


    // ========================================
    // SAVE ERROR
    // ========================================

    if (saveError) {

      console.error(
        "Save interview result error:",
        saveError
      )


      throw new Error(
        "Interview was evaluated but could not be saved."
      )

    }


    // ========================================
    // SUCCESS RESPONSE
    // ========================================

    return Response.json({

      success: true,

      result: {

        id:
          savedResult.id,

        careerGoalId:
          savedResult.career_goal_id,

        technicalScore:
          savedResult.technical_score,

        problemSolvingScore:
          savedResult.problem_solving_score,

        communicationScore:
          savedResult.communication_score,

        practicalReasoningScore:
          savedResult.practical_reasoning_score,

        totalScore:
          savedResult.total_score,

        feedback:
          savedResult.feedback,

        createdAt:
          savedResult.created_at,

      },

    })


  } catch (error) {

    // ========================================
    // SERVER ERROR
    // ========================================

    console.error(
      "Interview evaluation error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to evaluate interview.",
      },
      {
        status: 500,
      }
    )

  }

}