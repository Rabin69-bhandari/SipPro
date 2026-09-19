import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function InterviewResult({
  result,
  onRetry,
}) {
  const feedback = result?.feedback || {}

  const scores = [
    {
      label: "Technical Knowledge",
      value: result?.technicalScore ?? 0,
    },
    {
      label: "Problem Solving",
      value: result?.problemSolvingScore ?? 0,
    },
    {
      label: "Communication",
      value: result?.communicationScore ?? 0,
    },
    {
      label: "Practical Reasoning",
      value: result?.practicalReasoningScore ?? 0,
    },
  ]

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">

        {/* HEADER */}
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Interview Complete
              </p>

              <h2 className="text-xl font-semibold">
                Your Interview Result
              </h2>
            </div>

          </div>
        </div>

        {/* OVERALL SCORE */}
        <div className="border-b border-border px-6 py-10 text-center">

          <p className="text-sm text-muted-foreground">
            Overall Score
          </p>

          <div className="mt-2">
            <span className="text-6xl font-semibold tracking-tight">
              {result?.totalScore ?? 0}
            </span>

            <span className="text-xl text-muted-foreground">
              /100
            </span>
          </div>

          {feedback.summary && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              {feedback.summary}
            </p>
          )}

        </div>

        {/* SCORE BREAKDOWN */}
        <div className="border-b border-border p-6">

          <h3 className="font-semibold">
            Score Breakdown
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {scores.map((score) => {
              const value = Number(score.value) || 0

              const percentage = Math.min(
                100,
                Math.max(0, (value / 25) * 100)
              )

              return (
                <div
                  key={score.label}
                  className="rounded-xl bg-muted/40 p-4"
                >
                  <div className="flex items-center justify-between">

                    <span className="text-sm text-muted-foreground">
                      {score.label}
                    </span>

                    <span className="font-semibold">
                      {value}/25
                    </span>

                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">

                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>
                </div>
              )
            })}

          </div>
        </div>

        {/* FEEDBACK */}
        <div className="grid gap-6 p-6 md:grid-cols-2">

          {/* STRENGTHS */}
          <div>

            <h3 className="font-semibold">
              Strengths
            </h3>

            <div className="mt-4 space-y-3">

              {feedback.strengths?.length ? (
                feedback.strengths.map(
                  (strength, index) => (
                    <div
                      key={`${strength}-${index}`}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

                      <p className="text-sm leading-5 text-muted-foreground">
                        {strength}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  No strengths were provided.
                </p>
              )}

            </div>
          </div>

          {/* IMPROVEMENTS */}
          <div>

            <h3 className="font-semibold">
              Areas to Improve
            </h3>

            <div className="mt-4 space-y-3">

              {feedback.improvements?.length ? (
                feedback.improvements.map(
                  (improvement, index) => (
                    <div
                      key={`${improvement}-${index}`}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />

                      <p className="text-sm leading-5 text-muted-foreground">
                        {improvement}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  No improvement areas were provided.
                </p>
              )}

            </div>
          </div>

        </div>

        {/* DEMONSTRATED SKILLS */}
        {feedback.demonstratedSkills?.length > 0 && (
          <div className="border-t border-border p-6">

            <h3 className="font-semibold">
              Demonstrated Skills
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">

              {feedback.demonstratedSkills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          </div>
        )}

        {/* RECOMMENDATION */}
        {feedback.recommendation && (
          <div className="border-t border-border p-6">

            <div className="rounded-xl bg-primary/5 p-4">

              <div className="flex items-center gap-2">

                <Sparkles className="size-4 text-primary" />

                <p className="text-sm font-semibold">
                  Recommended Next Step
                </p>

              </div>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feedback.recommendation}
              </p>

            </div>
          </div>
        )}

        {/* RETRY */}
        <div className="flex justify-center border-t border-border p-6">

          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className="size-4" />

            Practice Again
          </Button>

        </div>

      </div>
    </div>
  )
}