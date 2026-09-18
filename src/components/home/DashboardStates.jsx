"use client"

import {
  ArrowRight,
  Loader2,
  RefreshCw,
  Target,
} from "lucide-react"

import { useRouter } from "next/navigation"


export function DashboardLoading() {
  return (
    <main className="min-h-full bg-background">

      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <Loader2 className="mx-auto size-7 animate-spin text-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Preparing your career dashboard...
          </p>

        </div>

      </div>

    </main>
  )
}


export function DashboardError({
  error,
  onRetry,
}) {
  return (
    <main className="min-h-full bg-background">

      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">

        <div className="w-full rounded-2xl border border-destructive/20 bg-card p-8 text-center">

          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10">
            <RefreshCw className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-lg font-semibold">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            onClick={onRetry}
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try Again
          </button>

        </div>

      </div>

    </main>
  )
}


export function NoCareers() {
  const router = useRouter()

  return (
    <main className="min-h-full bg-background">

      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">

        <div className="w-full rounded-2xl border border-dashed border-border bg-card p-10 text-center">

          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="size-6 text-primary" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Start your career journey
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Create a career goal and we'll build your learning,
            assessment and interview journey.
          </p>

          <button
            onClick={() =>
              router.push("/roadmap")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Create Career Goal

            <ArrowRight className="size-4" />
          </button>

        </div>

      </div>

    </main>
  )
}