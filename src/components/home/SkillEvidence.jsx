import {
  CheckCircle2,
  Circle,
} from "lucide-react"


export default function SkillEvidence({
  roadmap,
  assessment,
  readiness,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-center gap-2">

        <CheckCircle2 className="size-4 text-primary" />

        <h2 className="font-semibold">
          Skill Evidence
        </h2>

      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Evidence collected for this career.
      </p>


      <div className="mt-5 space-y-3">

        <EvidenceItem
          label="Learning Progress"
          complete={
            (roadmap?.progress ?? 0) > 0
          }
        />

        <EvidenceItem
          label="Skill Assessment"
          complete={assessment != null}
        />

        <EvidenceItem
          label="AI Interview"
          complete={
            readiness?.interview != null
          }
        />

      </div>

    </div>
  )
}


function EvidenceItem({
  label,
  complete,
}) {
  return (
    <div className="flex items-center gap-3">

      {complete ? (

        <CheckCircle2 className="size-4 shrink-0 text-primary" />

      ) : (

        <Circle className="size-4 shrink-0 text-muted-foreground" />

      )}

      <span
        className={
          complete
            ? "text-sm font-medium"
            : "text-sm text-muted-foreground"
        }
      >
        {label}
      </span>

    </div>
  )
}