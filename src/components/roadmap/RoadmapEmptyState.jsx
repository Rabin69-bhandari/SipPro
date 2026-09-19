import { Map } from "lucide-react"

const RoadmapEmptyState = () => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Map className="size-6 text-primary" />
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        Your first path starts here
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Create a career goal and LearnChen will build a personalized learning
        path around your experience, goals, and skills.
      </p>
    </div>
  )
}

export default RoadmapEmptyState