import { auth, clerkClient } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getPlanLimits } from "@/lib/billings/limits"


export async function GET() {
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
    // 2. GET USER PLAN FROM CLERK
    // ==========================================

    const client =
      await clerkClient()

    const user =
      await client.users.getUser(userId)

    const plan =
      user.publicMetadata?.userPlan ||
      "free"


    // ==========================================
    // 3. GET PLAN LIMITS
    // ==========================================

    const limits =
      getPlanLimits(plan)


    // ==========================================
    // 4. SUPABASE
    // ==========================================

    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // 5. COUNT USAGE
    // ==========================================

    const [
      roadmapResult,
      assessmentResult,
      interviewResult,
    ] = await Promise.all([

      supabase
        .from("career_roadmaps")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId),

      supabase
        .from("assessment_results")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId),

      supabase
        .from("interview_results")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId),

    ])


    // ==========================================
    // 6. CHECK DATABASE ERRORS
    // ==========================================

    if (roadmapResult.error) {
      throw roadmapResult.error
    }

    if (assessmentResult.error) {
      throw assessmentResult.error
    }

    if (interviewResult.error) {
      throw interviewResult.error
    }


    // ==========================================
    // 7. CURRENT USAGE
    // ==========================================

    const roadmapUsage =
      roadmapResult.count ?? 0

    const assessmentUsage =
      assessmentResult.count ?? 0

    const interviewUsage =
      interviewResult.count ?? 0


    // ==========================================
    // 8. FORMAT FEATURE
    // ==========================================

    const formatFeature = (
      usage,
      limit
    ) => {

      const unlimited =
        limit === Infinity


      return {
        usage,

        // JSON cannot safely represent Infinity.
        // null means unlimited.
        limit:
          unlimited
            ? null
            : limit,

        unlimited,

        remaining:
          unlimited
            ? null
            : Math.max(
                0,
                limit - usage
              ),

        allowed:
          unlimited
            ? true
            : usage < limit,
      }
    }


    // ==========================================
    // 9. RESPONSE
    // ==========================================

    return Response.json({
      success: true,

      plan,

      usage: {

        roadmaps:
          formatFeature(
            roadmapUsage,
            limits.roadmaps
          ),

        assessments:
          formatFeature(
            assessmentUsage,
            limits.assessments
          ),

        interviews:
          formatFeature(
            interviewUsage,
            limits.interviews
          ),

      },
    })


  } catch (error) {

    console.error(
      "Billing usage error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Could not fetch billing usage",
      },
      {
        status: 500,
      }
    )

  }
}