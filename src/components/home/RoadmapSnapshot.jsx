"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"


export default function RoadmapSnapshot({
  roadmap,
}) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="font-semibold">
            Learning Roadmap
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your learning journey at a glance.
          </p>

        </div>


        {roadmap && (

          <button
            onClick={() =>
              router.push(
                `/roadmap/${roadmap.id}`
              )
            }
            className="text-sm font-medium text-primary"
          >
            View Roadmap
          </button>

        )}

      </div>


      {!roadmap ? (

        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">

          <p className="text-sm text-muted-foreground">
            Create a roadmap to begin your learning journey.
          </p>

        </div>

      ) : (

        <div className="mt-6 space-y-3">

          {roadmap.modules
            ?.slice(0, 5)
            .map((module, index) => {

              const topics =
                module.topics ?? []

              return (
                <div
                  key={
                    module.id ??
                    index
                  }
                  className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
                >

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {module.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {topics.length} topics
                    </p>

                  </div>

                  <ArrowRight className="size-4 text-muted-foreground" />

                </div>
              )
            })}

        </div>

      )}

    </div>
  )
}