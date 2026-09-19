import { auth } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { generateCareerRoadmap } from "@/lib/gemini/server"
import { checkFeatureLimit } from "@/lib/billings/check-limit"


// ============================================================
// POST — CREATE ROADMAP
// ============================================================

export async function POST(request) {
  try {
    // --------------------------------------------------------
    // 1. Authenticate
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // 2. Check subscription / roadmap limit
    // --------------------------------------------------------

    const access = await checkFeatureLimit({
      userId,
      feature: "roadmaps",
    })


    if (!access.allowed) {
      return Response.json(
        {
          success: false,

          code: "PLAN_LIMIT_REACHED",

          error:
            "Your current plan has reached its roadmap limit.",

          billing: {
            plan: access.plan,
            usage: access.usage,
            limit: access.limit,
            remaining: access.remaining,
          },
        },
        {
          status: 403,
        }
      )
    }


    // --------------------------------------------------------
    // 3. Get form data
    // --------------------------------------------------------

    const formData = await request.json()

    const {
      title,
      experience,
      goal,
      skills = [],
      hoursPerWeek,
    } = formData


    // --------------------------------------------------------
    // 4. Validate
    // --------------------------------------------------------

    if (
      !title ||
      !experience ||
      !goal ||
      !hoursPerWeek
    ) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      )
    }


    // --------------------------------------------------------
    // 5. Supabase
    // --------------------------------------------------------

    const supabase =
      createServerSupabaseClient()


    // --------------------------------------------------------
    // 6. Store career goal
    // --------------------------------------------------------

    const {
      data: careerGoal,
      error: goalError,
    } = await supabase
      .from("career_goals")
      .insert({
        title,
        experience,
        goal,
        skills,
        hours_per_week:
          Number(hoursPerWeek),
      })
      .select()
      .single()


    if (goalError) {
      throw goalError
    }


    // --------------------------------------------------------
    // 7. Generate AI roadmap
    // --------------------------------------------------------

    const roadmapData =
      await generateCareerRoadmap(
        formData
      )


    // --------------------------------------------------------
    // 8. Store AI roadmap
    // --------------------------------------------------------

    const {
      data: roadmap,
      error: roadmapError,
    } = await supabase
      .from("career_roadmaps")
      .insert({
        career_goal_id:
          careerGoal.id,

        roadmap_data:
          roadmapData,
      })
      .select()
      .single()


    if (roadmapError) {
      throw roadmapError
    }


    // --------------------------------------------------------
    // 9. Response
    // --------------------------------------------------------

    return Response.json({
      success: true,
      careerGoal,
      roadmap,
    })

  } catch (error) {
    console.error(
      "Create roadmap error:",
      error
    )

    return Response.json(
      {
        success: false,
        error:
          error.message ||
          "Could not create roadmap",
      },
      {
        status: 500,
      }
    )
  }
}



// ============================================================
// GET — FETCH ROADMAPS
// ============================================================

export async function GET() {
  try {
    // --------------------------------------------------------
    // 1. Authenticate user
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // 2. Supabase client
    // --------------------------------------------------------

    const supabase =
      createServerSupabaseClient()


    // --------------------------------------------------------
    // 3. Fetch roadmaps + career goal + progress
    // --------------------------------------------------------

    const {
      data,
      error,
    } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        progress,
        roadmap_data,
        created_at,

        career_goal:career_goals (
          id,
          title,
          experience,
          goal,
          skills,
          hours_per_week,
          progress
        ),

        topic_progress:roadmap_progress (
          topic_id,
          status,
          started_at,
          completed_at
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )


    if (error) {
      throw error
    }


    // --------------------------------------------------------
    // 4. Format completed topic IDs
    // --------------------------------------------------------

    const roadmaps =
      data.map(
        (roadmap) => {

          const completedTopics =
            roadmap.topic_progress
              ?.filter(
                (topic) =>
                  topic.status ===
                  "completed"
              )
              .map(
                (topic) =>
                  topic.topic_id
              ) ?? []


          return {
            ...roadmap,
            completedTopics,
          }

        }
      )


    // --------------------------------------------------------
    // 5. Response
    // --------------------------------------------------------

    return Response.json({
      success: true,
      roadmaps,
    })

  } catch (error) {
    console.error(
      "Fetch roadmaps error:",
      error
    )


    return Response.json(
      {
        success: false,
        error:
          error.message ||
          "Could not fetch roadmaps",
      },
      {
        status: 500,
      }
    )
  }
}