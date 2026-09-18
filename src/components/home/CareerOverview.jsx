"use client"

import {
  ArrowRight,
  Target,
} from "lucide-react"

import { useRouter } from "next/navigation"


function capitalize(value) {
  if (!value) return "Not specified"

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}


export default function CareerOverview({
  career,
  roadmap,
}) {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">

      <div className="absolute -right-16 -top-16 size-52 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between gap-5">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Current Career Goal
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {career.title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {capitalize(career.experience)}
              </span>

              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {capitalize(career.goal)}
              </span>

              {career.hoursPerWeek && (

                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {career.hoursPerWeek} hrs/week
                </span>

              )}

            </div>

          </div>


          <div className="hidden size-12 items-center justify-center rounded-2xl bg-primary/10 md:flex">
            <Target className="size-5 text-primary" />
          </div>

        </div>


        {career.skills?.length > 0 && (

          <div className="mt-7">

            <p className="text-xs text-muted-foreground">
              Target skills
            </p>

            <div className="mt-2 flex flex-wrap gap-2">

              {career.skills
                .slice(0, 6)
                .map((skill, index) => (

                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                  >
                    {skill}
                  </span>

                ))}

            </div>

          </div>

        )}


        <div className="mt-8">

          <div className="mb-2 flex items-center justify-between text-sm">

            <span className="text-muted-foreground">
              Roadmap progress
            </span>

            <span className="font-semibold">
              {roadmap?.progress ?? 0}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-secondary">

            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${roadmap?.progress ?? 0}%`,
              }}
            />

          </div>

        </div>


        <button
          onClick={() =>
            router.push(
              roadmap
                ? `/roadmap/${roadmap.id}`
                : "/roadmap"
            )
          }
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
        >

          {roadmap
            ? "Continue Roadmap"
            : "Create Roadmap"}

          <ArrowRight className="size-4" />

        </button>

      </div>

    </div>
  )
}