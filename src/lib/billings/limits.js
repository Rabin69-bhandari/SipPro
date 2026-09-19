export const PLAN_LIMITS = {
  free: {
    roadmaps: 1,
    assessments: 1,
    interviews: 1,
  },

  pro: {
    roadmaps: 5,
    assessments: Infinity,
    interviews: 10,
  },

  career_plus: {
    roadmaps: Infinity,
    assessments: Infinity,
    interviews: Infinity,
  },
}


export function getPlanLimits(plan = "free") {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}


export function hasReachedLimit({
  plan = "free",
  feature,
  currentUsage = 0,
}) {
  const limits = getPlanLimits(plan)

  const limit = limits[feature]

  if (limit === undefined) {
    return false
  }

  if (limit === Infinity) {
    return false
  }

  return currentUsage >= limit
}