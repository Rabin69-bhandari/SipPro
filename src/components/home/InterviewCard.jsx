"use client"

import {
  ArrowRight,
  Mic,
} from "lucide-react"

import { useRouter } from "next/navigation"


export default function InterviewCard({
  readiness,
}) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="font-semibold">
            AI Interview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Practice explaining your knowledge in real time.
          </p>

        </div>

        <Mic className="size-5 text-primary" />

      </div>


      {readiness?.interview == null ? (

        <div className="mt-6 rounded-xl border border-dashed border-border p-6">

          <p className="text-sm font-medium">
            No interview evidence yet
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Complete an AI interview to add another
            layer of evidence to your career readiness.
          </p>

          <button
            onClick={() =>
              router.push(
                "/interview/practice"
              )
            }
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >

            Start Interview

            <ArrowRight className="size-4" />

          </button>

        </div>

      ) : (

        <div className="mt-6">

          <p className="text-4xl font-semibold">
            {readiness.interview}%
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Latest interview performance
          </p>

        </div>

      )}

    </div>
  )
}