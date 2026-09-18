import { Brain } from "lucide-react"


export default function AssessmentCard({
  assessment,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="font-semibold">
            Latest Assessment
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Evidence from your skill assessment.
          </p>

        </div>

        <Brain className="size-5 text-primary" />

      </div>


      {!assessment ? (

        <EmptyBlock />

      ) : (

        <>

          <div className="mt-6 grid grid-cols-3 gap-3">

            <ScoreBox
              label="Question"
              score={
                assessment.questionScore
              }
            />

            <ScoreBox
              label="Scenario"
              score={
                assessment.scenarioScore
              }
            />

            <ScoreBox
              label="Practical"
              score={
                assessment.practicalScore
              }
            />

          </div>


          <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary/60 p-4">

            <div>

              <p className="text-xs text-muted-foreground">
                Total Score
              </p>

              <p className="mt-1 text-xl font-semibold">
                {assessment.totalScore}/30
              </p>

            </div>

            <span className="rounded-full bg-background px-3 py-1.5 text-xs font-medium">
              {getStatusLabel(
                assessment.status
              )}
            </span>

          </div>

        </>

      )}

    </div>
  )
}


function ScoreBox({
  label,
  score,
}) {
  return (
    <div className="rounded-xl bg-secondary/60 p-4">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {score}/10
      </p>

    </div>
  )
}


function EmptyBlock() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">

      <p className="text-sm text-muted-foreground">
        You haven't completed an assessment for this career yet.
      </p>

    </div>
  )
}


function getStatusLabel(status) {
  if (status === "passed") {
    return "Passed"
  }

  if (status === "needs_improvement") {
    return "Needs Improvement"
  }

  return status ?? "Unknown"
}