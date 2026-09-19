const RoadmapHeader = ({ roadmapCount = 0 }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Career Journey
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Your learning paths
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore your personalized career roadmaps and continue building
            toward the career you want.
          </p>
        </div>

        {roadmapCount > 0 && (
          <p className="shrink-0 text-sm text-muted-foreground">
            {roadmapCount}{" "}
            {roadmapCount === 1 ? "roadmap" : "roadmaps"}
          </p>
        )}
      </div>
    </header>
  )
}

export default RoadmapHeader