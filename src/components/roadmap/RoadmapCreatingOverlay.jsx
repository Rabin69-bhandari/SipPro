const steps = [
  {
    number: "01",
    title: "Understanding your goal",
    description: "Looking at your career direction and experience.",
  },
  {
    number: "02",
    title: "Mapping the skills",
    description: "Finding the knowledge needed for your path.",
  },
  {
    number: "03",
    title: "Building your modules",
    description: "Turning those skills into a structured learning journey.",
  },
]

const RoadmapCreatingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-5 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[28px] border border-border bg-card p-7 shadow-2xl sm:p-9">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="relative z-10 text-sm">✦</span>

            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Creating your path
          </span>
        </div>

        <h2 className="mt-7 text-2xl font-semibold tracking-tight text-card-foreground">
          Turning your goal into a roadmap.
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          LearnChen is organizing the skills and topics that matter for your
          career.
        </p>

        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-4"
            >
              <span className="pt-0.5 text-xs font-semibold text-muted-foreground">
                {step.number}
              </span>

              <div>
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {index === 0 && (
                <span className="ml-auto mt-1 size-2 animate-pulse rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-full bg-muted">
          <div className="roadmap-loading-bar h-1 w-1/3 rounded-full bg-primary" />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          This may take a few seconds.
        </p>

        <style jsx>{`
          @keyframes roadmapLoading {
            0% {
              transform: translateX(-130%);
            }

            100% {
              transform: translateX(400%);
            }
          }

          .roadmap-loading-bar {
            animation: roadmapLoading 1.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  )
}

export default RoadmapCreatingOverlay