import { Brain } from "lucide-react"

export default function AssessmentHeader({
  careerGoal,
  assessment,
  onBack,
}) {
  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Back to career goals
      </button>

      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
            <Brain className="size-5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {careerGoal?.title}
            </p>

            <h1 className="text-2xl font-semibold text-foreground">
              {assessment.title}
            </h1>
          </div>
        </div>

        <div className="mt-5 flex gap-2 text-sm text-muted-foreground">
          <span className="capitalize">
            {assessment.difficulty}
          </span>

          <span>•</span>

          <span>30 Marks</span>
        </div>
      </div>
    </>
  )
}