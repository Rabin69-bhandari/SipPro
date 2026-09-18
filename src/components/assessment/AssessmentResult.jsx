import {
  ArrowLeft,
  Award,
  CheckCircle2,
  CircleAlert,
  Target,
} from "lucide-react"

export default function AssessmentResult({
  result,
  careerGoal,
  onBack,
}) {
  const passed = result.status === "passed"

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-10">

      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Assessments
      </button>


      {/* SUCCESS HEADER */}

      <div className="rounded-2xl border border-border bg-card p-8 text-center">

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          {passed ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <CircleAlert className="size-7" />
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Assessment successfully evaluated
        </p>

        <h1 className="mt-1 text-2xl font-semibold">
          {careerGoal?.title}
        </h1>


        {/* TOTAL SCORE */}

        <div className="mt-6">
          <span className="text-5xl font-bold">
            {result.totalScore}
          </span>

          <span className="text-xl text-muted-foreground">
            /30
          </span>
        </div>


        <div className="mt-4">
          <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            {passed
              ? "Assessment Passed"
              : "Needs Improvement"}
          </span>
        </div>

      </div>


      {/* SCORES */}

      <div className="mt-5 grid gap-4 md:grid-cols-3">

        <ScoreCard
          title="Knowledge"
          score={result.questionScore}
        />

        <ScoreCard
          title="Scenario"
          score={result.scenarioScore}
        />

        <ScoreCard
          title="Practical"
          score={result.practicalScore}
        />

      </div>


      {/* OVERALL FEEDBACK */}

      <div className="mt-5 rounded-2xl border border-border bg-card p-6">

        <div className="flex items-center gap-2">
          <Award className="size-5" />

          <h2 className="font-semibold">
            Overall Feedback
          </h2>
        </div>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {result.feedback?.overallFeedback ||
            "No feedback was provided."}
        </p>

      </div>


      {/* STRENGTHS + IMPROVEMENTS */}

      <div className="mt-5 grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border border-border bg-card p-6">

          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />

            <h2 className="font-semibold">
              Strengths
            </h2>
          </div>

          <div className="mt-4 space-y-3">

            {result.feedback?.strengths?.length ? (
              result.feedback.strengths.map(
                (strength, index) => (
                  <p
                    key={index}
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    • {strength}
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No strengths identified.
              </p>
            )}

          </div>

        </div>


        <div className="rounded-2xl border border-border bg-card p-6">

          <div className="flex items-center gap-2">
            <Target className="size-5" />

            <h2 className="font-semibold">
              Areas to Improve
            </h2>
          </div>

          <div className="mt-4 space-y-3">

            {result.feedback?.weakAreas?.length ? (
              result.feedback.weakAreas.map(
                (area, index) => (
                  <p
                    key={index}
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    • {area}
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No major improvement areas identified.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* DETAILED SECTION FEEDBACK */}

      <div className="mt-5 space-y-4">

        <FeedbackCard
          title="Knowledge Question"
          score={result.questionScore}
          feedback={result.feedback?.question?.feedback}
        />

        <FeedbackCard
          title="Scenario"
          score={result.scenarioScore}
          feedback={result.feedback?.scenario?.feedback}
        />

        <FeedbackCard
          title="Practical Task"
          score={result.practicalScore}
          feedback={result.feedback?.practical?.feedback}
        />

      </div>


      <div className="mt-6 flex justify-end">
        <button
          onClick={onBack}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Done
        </button>
      </div>

    </div>
  )
}


function ScoreCard({ title, score }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <div className="mt-2">
        <span className="text-3xl font-semibold">
          {score}
        </span>

        <span className="text-sm text-muted-foreground">
          /10
        </span>
      </div>


      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">

        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${score * 10}%`,
          }}
        />

      </div>

    </div>
  )
}


function FeedbackCard({
  title,
  score,
  feedback,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-center justify-between">

        <h3 className="font-medium">
          {title}
        </h3>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
          {score}/10
        </span>

      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {feedback || "No feedback provided."}
      </p>

    </div>
  )
}