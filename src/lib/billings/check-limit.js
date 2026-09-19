import { clerkClient } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

import {
  getPlanLimits,
  hasReachedLimit,
} from "@/lib/billings/limits"


// ==========================================
// TABLE USED BY EACH FEATURE
// ==========================================

const FEATURE_TABLES = {
  roadmaps: "career_roadmaps",
  assessments: "assessment_results",
  interviews: "interview_results",
}


// ==========================================
// CHECK FEATURE LIMIT
// ==========================================

export async function checkFeatureLimit({
  userId,
  feature,
}) {

  if (!userId) {
    throw new Error("User ID is required")
  }


  // ========================================
  // VALIDATE FEATURE
  // ========================================

  const table = FEATURE_TABLES[feature]

  if (!table) {
    throw new Error(
      `Unknown billing feature: ${feature}`
    )
  }


  // ========================================
  // GET USER PLAN FROM CLERK
  // ========================================

  const client = await clerkClient()

  const user = await client.users.getUser(userId)


  const plan =
    user.publicMetadata?.userPlan || "free"


  // ========================================
  // GET PLAN LIMIT
  // ========================================

  const limits = getPlanLimits(plan)

  const limit = limits[feature]


  // ========================================
  // UNLIMITED PLAN
  // ========================================

  if (limit === Infinity) {

    return {
      allowed: true,
      plan,
      feature,
      usage: 0,
      limit: null,
      remaining: null,
      unlimited: true,
    }

  }


  // ========================================
  // COUNT USER'S EXISTING USAGE
  // ========================================

  const supabase =
    createServerSupabaseClient()


  const {
    count,
    error,
  } = await supabase
    .from(table)
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)


  if (error) {

    console.error(
      `Failed to check ${feature} usage:`,
      error
    )

    throw new Error(
      `Could not check ${feature} usage`
    )

  }


  const currentUsage = count ?? 0


  // ========================================
  // CHECK LIMIT
  // ========================================

  const reached =
    hasReachedLimit({
      plan,
      feature,
      currentUsage,
    })


  const remaining =
    Math.max(
      0,
      limit - currentUsage
    )


  // ========================================
  // RETURN RESULT
  // ========================================

  return {

    allowed: !reached,

    plan,

    feature,

    usage:
      currentUsage,

    limit,

    remaining,

    unlimited: false,

  }

}