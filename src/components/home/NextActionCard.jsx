"use client"

import {
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { useRouter } from "next/navigation"


export default function NextActionCard({
  nextAction,
}) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">

      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-primary">
        Next Best Action
      </p>

      <h2 className="mt-2 text-lg font-semibold">
        {nextAction?.title ??
          "Keep progressing"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {nextAction?.description ??
          "Continue building evidence toward your career goal."}
      </p>


      {nextAction?.href && (

        <button
          onClick={() =>
            router.push(
              nextAction.href
            )
          }
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >

          Continue

          <ArrowRight className="size-4" />

        </button>

      )}

    </div>
  )
}