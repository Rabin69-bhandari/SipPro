import { auth } from "@clerk/nextjs/server"
import { GoogleGenAI } from "@google/genai"

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server"


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})


export async function POST(request) {

  try {

    // ==========================================
    // 1. AUTHENTICATE USER
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
    // 2. GET CAREER GOAL ID
    // ==========================================

    const body = await request.json()

    const {
      careerGoalId,
    } = body


    if (!careerGoalId) {

      return Response.json(
        {
          success: false,
          error: "Career goal ID is required",
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
      error: careerGoalError,
    } = await supabase
      .from("career_goals")
      .select(`
        id,
        title,
        experience,
        goal,
        skills,
        hours_per_week,
        progress
      `)
      .eq(
        "id",
        careerGoalId
      )
      .single()


    if (
      careerGoalError ||
      !careerGoal
    ) {

      console.error(
        "Career goal fetch error:",
        careerGoalError
      )


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
    // 5. FETCH CAREER ROADMAP
    // ==========================================

    const {
      data: roadmap,
      error: roadmapError,
    } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        roadmap_data,
        progress
      `)
      .eq(
        "career_goal_id",
        careerGoalId
      )
      .maybeSingle()


    if (roadmapError) {

      console.error(
        "Roadmap fetch error:",
        roadmapError
      )


      throw roadmapError

    }


    // ==========================================
    // 6. FETCH COMPLETED TOPICS
    // ==========================================

    let completedTopics = []


    if (roadmap) {

      const {
        data: progressRows,
        error: progressError,
      } = await supabase
        .from("roadmap_progress")
        .select(`
          topic_id,
          status
        `)
        .eq(
          "roadmap_id",
          roadmap.id
        )
        .eq(
          "status",
          "completed"
        )


      if (progressError) {

        console.error(
          "Progress fetch error:",
          progressError
        )


        throw progressError

      }


      completedTopics =
        progressRows?.map(
          (row) =>
            row.topic_id
        ) ?? []

    }


    // ==========================================
    // 7. PREPARE ROADMAP CONTEXT
    // ==========================================

    const roadmapModules =
      roadmap?.roadmap_data?.modules ?? []


    const roadmapContext =
      roadmapModules.map(
        (module) => ({

          title:
            module.title,

          topics:
            module.topics?.map(
              (topic) => ({
                id:
                  topic.id,

                title:
                  topic.title,

                description:
                  topic.description,
              })
            ) ?? [],

        })
      )


    // ==========================================
    // 8. BUILD GEMINI PROMPT
    // ==========================================

    const prompt = `
You are creating a short career skill assessment.

The assessment is for this learner:

CAREER:
${careerGoal.title}

EXPERIENCE LEVEL:
${careerGoal.experience}

CAREER GOAL:
${careerGoal.goal}

CLAIMED SKILLS:
${careerGoal.skills?.join(", ") || "None provided"}

WEEKLY LEARNING HOURS:
${careerGoal.hours_per_week}

CAREER PROGRESS:
${careerGoal.progress ?? 0}%

ROADMAP PROGRESS:
${roadmap?.progress ?? 0}%

ROADMAP:
${JSON.stringify(roadmapContext)}

COMPLETED TOPIC IDS:
${JSON.stringify(completedTopics)}


Create exactly THREE assessment sections.


SECTION 1 — QUESTION

Create one intermediate-level knowledge question.

The question should test genuine understanding,
not simple memorization.

Maximum marks: 10.


SECTION 2 — SCENARIO

Create one realistic career-specific scenario.

The learner must explain how they would approach,
analyze, or solve the situation.

Maximum marks: 10.


SECTION 3 — PRACTICAL TASK

Create one practical task appropriate for the career.

The learner must be able to provide their work using:

- text
- data
- code when appropriate
- an image or screenshot

Maximum marks: 10.


IMPORTANT RULES:

- Do NOT assume the career involves programming.
- Adapt all three sections to the learner's career.
- Use the roadmap to determine relevant skills.
- Consider the learner's experience level.
- Claimed skills are NOT automatically verified skills.
- Prefer topics the learner has actually studied.
- Do not ask impossible tasks that require special software
  or equipment.
- Keep the assessment practical enough to complete inside
  a web application.
- Do not include answers or solutions.
- Do not provide scoring to the learner yet.
- Do not generate more than three sections.
`


    // ==========================================
    // 9. GENERATE ASSESSMENT
    // ==========================================

    const response =
      await ai.models.generateContent({

        model:
          "gemini-3.5-flash-lite",

        contents:
          prompt,

        config: {

          responseMimeType:
            "application/json",

          responseJsonSchema: {

            type: "object",

            properties: {

              title: {
                type: "string",
              },

              difficulty: {
                type: "string",
              },

              question: {

                type: "object",

                properties: {

                  marks: {
                    type: "integer",
                  },

                  prompt: {
                    type: "string",
                  },

                },

                required: [
                  "marks",
                  "prompt",
                ],

              },


              scenario: {

                type: "object",

                properties: {

                  marks: {
                    type: "integer",
                  },

                  prompt: {
                    type: "string",
                  },

                },

                required: [
                  "marks",
                  "prompt",
                ],

              },


              practical: {

                type: "object",

                properties: {

                  marks: {
                    type: "integer",
                  },

                  prompt: {
                    type: "string",
                  },

                },

                required: [
                  "marks",
                  "prompt",
                ],

              },

            },

            required: [
              "title",
              "difficulty",
              "question",
              "scenario",
              "practical",
            ],

          },

        },

      })


    // ==========================================
    // 10. PARSE GEMINI RESPONSE
    // ==========================================

    const assessment =
      JSON.parse(
        response.text
      )


    // ==========================================
    // 11. FORCE OUR MARK STRUCTURE
    // ==========================================
    //
    // Gemini generates CONTENT.
    // Our application controls MARKS.
    //
    // ==========================================

    assessment.question.marks = 10

    assessment.scenario.marks = 10

    assessment.practical.marks = 10

    assessment.difficulty =
      "intermediate"


    // ==========================================
    // 12. RETURN ASSESSMENT
    // ==========================================

    return Response.json({

      success: true,

      careerGoal: {

        id:
          careerGoal.id,

        title:
          careerGoal.title,

        experience:
          careerGoal.experience,

      },

      assessment,

    })


  } catch (error) {

    console.error(
      "Generate assessment error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to generate assessment",
      },
      {
        status: 500,
      }
    )

  }

}