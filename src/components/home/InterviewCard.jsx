"use client"

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Mic,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react"

import { useRouter } from "next/navigation"


export default function InterviewCard({
  interview,
  stats,
  readiness,
}) {

  const router = useRouter()


  // ==========================================
  // NO INTERVIEW YET
  // ==========================================

  if (!interview) {

    return (

      <div className="rounded-2xl border border-border bg-card p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="font-semibold">
              AI Interview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Practice explaining your knowledge in real time.
            </p>

          </div>


          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">

            <Mic className="size-5 text-primary" />

          </div>

        </div>


        {/* EMPTY STATE */}

        <div className="mt-6 rounded-xl border border-dashed border-border p-6">

          <div className="flex size-10 items-center justify-center rounded-xl bg-muted">

            <BrainCircuit className="size-5 text-muted-foreground" />

          </div>


          <p className="mt-4 text-sm font-medium">
            No interview evidence yet
          </p>


          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">

            Complete an AI interview to evaluate your
            technical knowledge, problem solving,
            communication and practical reasoning.

          </p>


          <button
            onClick={() =>
              router.push(
                "/interview/practice"
              )
            }
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
          >

            Start Interview

            <ArrowRight className="size-4" />

          </button>

        </div>

      </div>

    )

  }


  // ==========================================
  // INTERVIEW DATA
  // ==========================================

  const feedback =
    interview.feedback ?? {}


  const demonstratedSkills =
    interview.demonstratedSkills ??
    feedback.demonstratedSkills ??
    []


  const scoreItems = [

    {
      label:
        "Technical Knowledge",

      shortLabel:
        "Technical",

      value:
        interview.technicalScore ?? 0,
    },

    {
      label:
        "Problem Solving",

      shortLabel:
        "Problem Solving",

      value:
        interview.problemSolvingScore ?? 0,
    },

    {
      label:
        "Communication",

      shortLabel:
        "Communication",

      value:
        interview.communicationScore ?? 0,
    },

    {
      label:
        "Practical Reasoning",

      shortLabel:
        "Practical",

      value:
        interview.practicalReasoningScore ?? 0,
    },

  ]


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="rounded-2xl border border-border bg-card p-6">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-semibold">
              AI Interview
            </h2>


            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">

              <CheckCircle2 className="size-3" />

              Completed

            </span>

          </div>


          <p className="mt-1 text-sm text-muted-foreground">

            Latest interview performance and evidence.

          </p>

        </div>


        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

          <Mic className="size-5 text-primary" />

        </div>

      </div>


      {/* ================================== */}
      {/* MAIN SCORE */}
      {/* ================================== */}

      <div className="mt-6 flex items-end justify-between gap-4">

        <div>

          <p className="text-sm text-muted-foreground">
            Interview Score
          </p>


          <div className="mt-1 flex items-baseline">

            <span className="text-4xl font-semibold tracking-tight">
              {interview.totalScore ?? 0}
            </span>

            <span className="ml-1 text-sm text-muted-foreground">
              /100
            </span>

          </div>

        </div>


        <div className="text-right">

          <p className="text-xs text-muted-foreground">
            Career readiness contribution
          </p>

          <p className="mt-1 text-sm font-semibold">
            {readiness?.interview ?? interview.totalScore ?? 0}%
          </p>

        </div>

      </div>


      {/* ================================== */}
      {/* SCORE BREAKDOWN */}
      {/* ================================== */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        {scoreItems.map((item) => {

          const percentage =
            Math.min(
              100,
              Math.max(
                0,
                (item.value / 25) * 100
              )
            )


          return (

            <div
              key={item.label}
              className="rounded-xl bg-muted/40 p-3"
            >

              <div className="flex items-center justify-between gap-3">

                <p
                  className="truncate text-xs text-muted-foreground"
                  title={item.label}
                >
                  {item.shortLabel}
                </p>


                <p className="shrink-0 text-sm font-semibold">
                  {item.value}/25
                </p>

              </div>


              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">

                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width:
                      `${percentage}%`,
                  }}
                />

              </div>

            </div>

          )

        })}

      </div>


      {/* ================================== */}
      {/* AI SUMMARY */}
      {/* ================================== */}

      {feedback.summary && (

        <div className="mt-5 rounded-xl border border-border bg-background p-4">

          <div className="flex items-center gap-2">

            <Sparkles className="size-4 text-primary" />

            <p className="text-sm font-medium">
              AI Evaluation
            </p>

          </div>


          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">

            {feedback.summary}

          </p>

        </div>

      )}


      {/* ================================== */}
      {/* DEMONSTRATED SKILLS */}
      {/* ================================== */}

      {demonstratedSkills.length > 0 && (

        <div className="mt-5">

          <div className="flex items-center gap-2">

            <Target className="size-3.5 text-primary" />

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demonstrated Skills
            </p>

          </div>


          <div className="mt-3 flex flex-wrap gap-2">

            {demonstratedSkills
              .slice(0, 5)
              .map((skill) => (

                <span
                  key={skill}
                  className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                </span>

              ))}


            {demonstratedSkills.length > 5 && (

              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">

                +
                {
                  demonstratedSkills.length -
                  5
                } more

              </span>

            )}

          </div>

        </div>

      )}


      {/* ================================== */}
      {/* RECOMMENDATION */}
      {/* ================================== */}

      {feedback.recommendation && (

        <div className="mt-5 rounded-xl bg-primary/5 p-4">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">

              <Lightbulb className="size-3.5 text-primary" />

            </div>


            <div>

              <p className="text-xs font-medium">
                Recommended Next Step
              </p>


              <p className="mt-1 text-xs leading-5 text-muted-foreground">

                {feedback.recommendation}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">

        <div>

          <p className="text-xs text-muted-foreground">

            {
              stats?.attempts ?? 1
            }{" "}

            {
              (stats?.attempts ?? 1) === 1
                ? "interview attempt"
                : "interview attempts"
            }

          </p>


          {interview.createdAt && (

            <p className="mt-1 text-[11px] text-muted-foreground">

              Latest:{" "}

              {
                new Date(
                  interview.createdAt
                ).toLocaleDateString(
                  undefined,
                  {
                    year:
                      "numeric",

                    month:
                      "short",

                    day:
                      "numeric",
                  }
                )
              }

            </p>

          )}

        </div>


        <button
          onClick={() =>
            router.push(
              "/interview/practice"
            )
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
        >

          <RefreshCw className="size-4" />

          Practice Again

        </button>

      </div>

    </div>

  )
}