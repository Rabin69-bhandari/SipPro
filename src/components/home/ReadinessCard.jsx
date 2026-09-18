import { Trophy } from "lucide-react"


export default function ReadinessCard({
  readiness,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium">
            Career Readiness
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Based on your current evidence
          </p>

        </div>

        <Trophy className="size-5 text-primary" />

      </div>


      <div className="my-7 flex items-end gap-2">

        <span className="text-6xl font-semibold tracking-tight">
          {readiness?.score ?? 0}
        </span>

        <span className="mb-2 text-lg text-muted-foreground">
          %
        </span>

      </div>


      <div className="space-y-4">

        <ProgressRow
          label="Learning"
          value={readiness?.learning ?? 0}
        />

        <ProgressRow
          label="Assessment"
          value={readiness?.assessment ?? 0}
        />

        <ProgressRow
          label="Interview"
          value={readiness?.interview}
          unavailable={
            readiness?.interview == null
          }
        />

      </div>

    </div>
  )
}


function ProgressRow({
  label,
  value,
  unavailable = false,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between text-xs">

        <span className="text-muted-foreground">
          {label}
        </span>

        <span className="font-medium">
          {unavailable
            ? "Not completed"
            : `${value}%`}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">

        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{
            width: unavailable
              ? "0%"
              : `${value}%`,
          }}
        />

      </div>

    </div>
  )
}