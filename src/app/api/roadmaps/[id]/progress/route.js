import { auth } from "@clerk/nextjs/server"

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server"


export async function POST(request, { params }) {
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
    // 2. GET ROADMAP ID
    // ==========================================

    const { id: roadmapId } = await params


    if (!roadmapId) {
      return Response.json(
        {
          success: false,
          error: "Roadmap ID is required",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 3. GET TOPIC ID
    // ==========================================

    const body = await request.json()

    const { topicId } = body


    if (!topicId) {
      return Response.json(
        {
          success: false,
          error: "Topic ID is required",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 4. SUPABASE
    // ==========================================

    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // 5. GET ROADMAP
    // ==========================================
    //
    // IMPORTANT:
    // We also get career_goal_id because
    // we need to update career_goals.progress.
    // ==========================================

    const {
      data: roadmap,
      error: roadmapError,
    } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        career_goal_id,
        roadmap_data,
        progress
      `)
      .eq("id", roadmapId)
      .single()


    if (roadmapError || !roadmap) {

      console.error(
        "Roadmap fetch error:",
        roadmapError
      )


      return Response.json(
        {
          success: false,
          error: "Roadmap not found",
        },
        {
          status: 404,
        }
      )
    }


    // ==========================================
    // 6. GET ALL ROADMAP TOPICS
    // ==========================================

    const modules =
      roadmap.roadmap_data?.modules ?? []


    const allTopics =
      modules.flatMap(
        (module) =>
          module.topics ?? []
      )


    // ==========================================
    // 7. VERIFY TOPIC EXISTS
    // ==========================================

    const topicExists =
      allTopics.some(
        (topic) =>
          topic.id === topicId
      )


    if (!topicExists) {
      return Response.json(
        {
          success: false,
          error:
            "Topic does not exist in this roadmap",
        },
        {
          status: 400,
        }
      )
    }


    // ==========================================
    // 8. SAVE TOPIC AS COMPLETED
    // ==========================================

    const {
      error: topicProgressError,
    } = await supabase
      .from("roadmap_progress")
      .upsert(
        {
          roadmap_id: roadmapId,

          topic_id: topicId,

          status: "completed",

          completed_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "user_id,roadmap_id,topic_id",
        }
      )


    if (topicProgressError) {

      console.error(
        "Topic progress error:",
        topicProgressError
      )


      throw topicProgressError
    }


    // ==========================================
    // 9. FETCH COMPLETED TOPICS
    // ==========================================

    const {
      data: completedRows,
      error: completedError,
    } = await supabase
      .from("roadmap_progress")
      .select("topic_id")
      .eq(
        "roadmap_id",
        roadmapId
      )
      .eq(
        "status",
        "completed"
      )


    if (completedError) {
      throw completedError
    }


    // ==========================================
    // 10. REMOVE DUPLICATES
    // ==========================================

    const completedTopics = [
      ...new Set(
        completedRows.map(
          (row) =>
            row.topic_id
        )
      ),
    ]


    // ==========================================
    // 11. CALCULATE PROGRESS
    // ==========================================

    const totalTopics =
      allTopics.length


    const completedCount =
      completedTopics.length


    const progress =
      totalTopics === 0
        ? 0
        : Math.round(
            (
              completedCount /
              totalTopics
            ) * 100
          )


    console.log(
      "Progress calculation:",
      {
        completedCount,
        totalTopics,
        progress,
      }
    )


    // ==========================================
    // 12. UPDATE career_roadmaps.progress
    // ==========================================

    const {
      error: roadmapUpdateError,
    } = await supabase
      .from("career_roadmaps")
      .update({
        progress,
      })
      .eq(
        "id",
        roadmapId
      )


    if (roadmapUpdateError) {

      console.error(
        "Roadmap update error:",
        roadmapUpdateError
      )


      throw roadmapUpdateError
    }


    // ==========================================
    // 13. UPDATE career_goals.progress
    // ==========================================

    const {
      error: careerGoalUpdateError,
    } = await supabase
      .from("career_goals")
      .update({
        progress,
      })
      .eq(
        "id",
        roadmap.career_goal_id
      )


    if (careerGoalUpdateError) {

      console.error(
        "Career goal update error:",
        careerGoalUpdateError
      )


      throw careerGoalUpdateError
    }


    // ==========================================
    // 14. RETURN UPDATED DATA
    // ==========================================

    return Response.json({

      success: true,

      roadmapId,

      careerGoalId:
        roadmap.career_goal_id,

      topicId,

      completedTopics,

      completedCount,

      totalTopics,

      progress,

    })


  } catch (error) {

    console.error(
      "Save topic progress error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to save progress",
      },
      {
        status: 500,
      }
    )

  }
}