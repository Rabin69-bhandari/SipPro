const RoadmapPlanStatus = ({
  billing,
  roadmapAccess,
  canCreateRoadmap,
  isUnlimited,
  onUpgrade,
}) => {
  if (!billing || !roadmapAccess) {
    return null
  }

  const planName =
    billing.plan === "free"
      ? "Free"
      : billing.plan === "pro"
        ? "Pro"
        : "Career+"

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {planName} plan
          </span>

          <span className="text-xs text-muted-foreground">
            ·
          </span>

          <span className="text-xs text-muted-foreground">
            {isUnlimited
              ? `${roadmapAccess.usage} roadmaps`
              : `${roadmapAccess.usage} of ${roadmapAccess.limit} used`}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {isUnlimited
            ? "Create as many career paths as you need."
            : canCreateRoadmap
              ? `${roadmapAccess.remaining} roadmap${
                  roadmapAccess.remaining === 1 ? "" : "s"
                } remaining on your plan.`
              : "You've used all roadmaps available on your current plan."}
        </p>
      </div>

      {!canCreateRoadmap && !isUnlimited && (
        <button
          type="button"
          onClick={onUpgrade}
          className="
            shrink-0
            text-sm
            font-medium
            text-primary
            transition-opacity
            hover:opacity-70
          "
        >
          Upgrade plan →
        </button>
      )}
    </div>
  )
}

export default RoadmapPlanStatus