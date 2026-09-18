import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  Target,
} from "lucide-react"

export default function CareerCard({ roadmap, onClick }) {
  return (
    <div
      onClick={() => onClick?.(roadmap)}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-8 flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <BriefcaseBusiness className="size-5" />
        </div>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {roadmap.goal}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-card-foreground">
        {roadmap.title}
      </h2>

      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Target className="size-4" />
          {roadmap.skills?.length ?? 0} skills
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 className="size-4" />
          In progress
        </span>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress
          </span>

          <span className="font-medium text-foreground">
            {roadmap.progress ?? 0}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${roadmap.progress ?? 0}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-7 flex items-center gap-2 text-sm font-medium text-foreground transition-all group-hover:gap-3">
        Continue Roadmap
        <ArrowRight className="size-4" />
      </div>
    </div>
  )
}