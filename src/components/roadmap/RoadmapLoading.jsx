const RoadmapLoading = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div className="aspect-[16/10] animate-pulse bg-muted" />

          <div className="space-y-3 p-6">
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />

            <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />

            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoadmapLoading