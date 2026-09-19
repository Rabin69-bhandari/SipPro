import RoadmapCard from "./RoadmapCard"

const RoadmapGrid = ({
  roadmaps,
  onRoadmapClick,
}) => {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your collection
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Explore your roadmaps
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            onClick={onRoadmapClick}
          />
        ))}
      </div>
    </section>
  )
}

export default RoadmapGrid