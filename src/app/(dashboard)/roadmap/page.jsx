"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import CareerCard from "@/components/roadmap/CareerCard"
import SheetForm from "@/components/roadmap/SheetForm"


export default function Roadmap() {
  const router = useRouter()

  const [roadmaps, setRoadmaps] =
    useState([])

  const [billing, setBilling] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [
    billingLoading,
    setBillingLoading,
  ] = useState(true)

  const [creating, setCreating] =
    useState(false)

  const [error, setError] =
    useState(null)


  // ============================================================
  // FETCH ROADMAPS
  // ============================================================

  const fetchRoadmaps =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/roadmaps",
            {
              cache: "no-store",
            }
          )

        const result =
          await response.json()


        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to fetch roadmaps"
          )
        }


        const formattedRoadmaps =
          result.roadmaps.map(
            (item) => ({
              id:
                item.id,

              title:
                item.career_goal.title,

              experience:
                item.career_goal
                  .experience,

              goal:
                item.career_goal.goal,

              skills:
                item.career_goal.skills,

              hoursPerWeek:
                item.career_goal
                  .hours_per_week,

              progress:
                item.progress,

              roadmapData:
                item.roadmap_data,
            })
          )


        setRoadmaps(
          formattedRoadmaps
        )

      } catch (error) {
        console.error(
          "Failed to fetch roadmaps:",
          error
        )

        setError(
          error.message
        )
      }
    }, [])


  // ============================================================
  // FETCH BILLING USAGE
  // ============================================================

  const fetchBillingUsage =
    useCallback(async () => {
      try {
        setBillingLoading(true)

        const response =
          await fetch(
            "/api/billing/usage",
            {
              cache: "no-store",
            }
          )


        const result =
          await response.json()


        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to fetch plan usage"
          )
        }


        setBilling(result)

      } catch (error) {
        console.error(
          "Failed to fetch billing usage:",
          error
        )

      } finally {
        setBillingLoading(false)
      }
    }, [])


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const loadData =
      async () => {
        setLoading(true)

        await Promise.all([
          fetchRoadmaps(),
          fetchBillingUsage(),
        ])

        setLoading(false)
      }


    loadData()
  }, [
    fetchRoadmaps,
    fetchBillingUsage,
  ])


  // ============================================================
  // ROADMAP ACCESS
  // ============================================================

  const roadmapAccess =
    billing?.usage?.roadmaps


  const canCreateRoadmap =
    roadmapAccess?.allowed ??
    false


  const isUnlimited =
    roadmapAccess?.unlimited ??
    false


  // ============================================================
  // CREATE ROADMAP
  // ============================================================

  const handleCreateRoadmap =
    async (formData) => {

      // Frontend protection
      if (!canCreateRoadmap) {
        const limitError =
          new Error(
            "Your current plan has reached its roadmap limit."
          )

        limitError.code =
          "PLAN_LIMIT_REACHED"

        throw limitError
      }


      try {
        // ----------------------------------------
        // SHOW LOADING OVERLAY
        // ----------------------------------------

        setCreating(true)
        setError(null)


        // ----------------------------------------
        // CREATE ROADMAP
        // ----------------------------------------

        const response =
          await fetch(
            "/api/roadmaps",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  formData
                ),
            }
          )


        const result =
          await response.json()


        // ----------------------------------------
        // PLAN LIMIT
        // ----------------------------------------

        if (
          response.status === 403 &&
          result.code ===
            "PLAN_LIMIT_REACHED"
        ) {
          await fetchBillingUsage()


          const limitError =
            new Error(
              result.error ||
                "Your roadmap limit has been reached."
            )

          limitError.code =
            "PLAN_LIMIT_REACHED"

          throw limitError
        }


        // ----------------------------------------
        // OTHER ERROR
        // ----------------------------------------

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to create roadmap"
          )
        }


        // ----------------------------------------
        // FORMAT NEW ROADMAP
        // ----------------------------------------

        const newRoadmap = {
          id:
            result.roadmap.id,

          title:
            result.careerGoal.title,

          experience:
            result.careerGoal
              .experience,

          goal:
            result.careerGoal.goal,

          skills:
            result.careerGoal.skills,

          hoursPerWeek:
            result.careerGoal
              .hours_per_week,

          progress:
            result.roadmap.progress,

          roadmapData:
            result.roadmap
              .roadmap_data,
        }


        // ----------------------------------------
        // UPDATE ROADMAP LIST
        // ----------------------------------------

        setRoadmaps(
          (previous) => [
            newRoadmap,
            ...previous,
          ]
        )


        // ----------------------------------------
        // REFRESH PLAN USAGE
        // ----------------------------------------

        await fetchBillingUsage()


        return {
          success: true,
        }

      } catch (error) {
        console.error(
          "Roadmap creation failed:",
          error
        )

        throw error

      } finally {
        // ----------------------------------------
        // ALWAYS REMOVE LOADING
        // ----------------------------------------

        setCreating(false)
      }
    }


  // ============================================================
  // ROADMAP CLICK
  // ============================================================

  const handleRoadmapClick =
    (roadmap) => {
      router.push(
        `/roadmap/${roadmap.id}`
      )
    }


  // ============================================================
  // UPGRADE
  // ============================================================

  const handleUpgrade = () => {
    router.push(
      "/payment"
    )
  }


  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Career Journey
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Career Roadmaps
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            Create a career goal and follow a
            personalized path toward the skills
            you need.
          </p>

        </div>


        {/* ================================================== */}
        {/* PLAN STATUS */}
        {/* ================================================== */}

        {!billingLoading &&
          billing &&
          roadmapAccess && (

            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <p className="font-medium text-card-foreground">
                    {billing.plan === "free"
                      ? "Free Plan"
                      : billing.plan === "pro"
                        ? "Pro Plan"
                        : "Career+ Plan"}
                  </p>


                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">

                    {isUnlimited
                      ? `${roadmapAccess.usage} roadmaps created`
                      : `${roadmapAccess.usage} / ${roadmapAccess.limit} roadmaps`}

                  </span>

                </div>


                <p className="mt-1 text-sm text-muted-foreground">

                  {isUnlimited
                    ? "Your plan includes unlimited career roadmaps."
                    : canCreateRoadmap
                      ? `You can create ${roadmapAccess.remaining} more career roadmap${roadmapAccess.remaining === 1 ? "" : "s"}.`
                      : "You have reached the roadmap limit for your current plan."}

                </p>

              </div>


              {!canCreateRoadmap &&
                !isUnlimited && (

                  <button
                    type="button"
                    onClick={
                      handleUpgrade
                    }
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Upgrade Plan →
                  </button>

                )}

            </div>

          )}


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (

          <div className="mb-8 rounded-xl border border-destructive/20 bg-destructive/5 p-4">

            <p className="text-sm text-destructive">
              {error}
            </p>

          </div>

        )}


        {/* ================================================== */}
        {/* INITIAL LOADING */}
        {/* ================================================== */}

        {loading && (

          <div className="py-12 text-center">

            <div className="mx-auto mb-3 size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading your roadmaps...
            </p>

          </div>

        )}


        {/* ================================================== */}
        {/* EMPTY STATE */}
        {/* ================================================== */}

        {!loading &&
          roadmaps.length === 0 && (

            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">

              <h2 className="text-lg font-semibold text-card-foreground">
                No career roadmaps yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Create your first career goal
                and let AI build a personalized
                learning roadmap for you.
              </p>

            </div>

          )}


        {/* ================================================== */}
        {/* ROADMAP CARDS */}
        {/* ================================================== */}

        {!loading &&
          roadmaps.length > 0 && (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {roadmaps.map(
                (roadmap) => (

                  <CareerCard
                    key={
                      roadmap.id
                    }
                    roadmap={
                      roadmap
                    }
                    onClick={
                      handleRoadmapClick
                    }
                  />

                )
              )}

            </div>

          )}

      </div>


      {/* ==================================================== */}
      {/* CREATE ROADMAP */}
      {/* ==================================================== */}

      {!loading &&
        !billingLoading &&
        canCreateRoadmap &&
        !creating && (

          <SheetForm
            onSubmit={
              handleCreateRoadmap
            }
          />

        )}


      {/* ==================================================== */}
      {/* LOCKED CREATE BUTTON */}
      {/* ==================================================== */}

      {!loading &&
        !billingLoading &&
        !canCreateRoadmap &&
        !creating && (

          <button
            type="button"
            onClick={
              handleUpgrade
            }
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:scale-[1.02]"
          >
            <span>
              🔒
            </span>

            Upgrade to create more
          </button>

        )}


      {/* ==================================================== */}
      {/* AI ROADMAP CREATION OVERLAY */}
      {/* ==================================================== */}

      {creating && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-5 backdrop-blur-md">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">


            {/* ---------------------------------------------- */}
            {/* TOP */}
            {/* ---------------------------------------------- */}

            <div className="px-8 pb-6 pt-8 text-center">


              {/* AI animation */}

              <div className="relative mx-auto flex size-20 items-center justify-center">

                <div className="absolute size-20 animate-ping rounded-full bg-primary/10" />

                <div className="absolute size-16 animate-pulse rounded-full bg-primary/15" />

                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-lg">

                  ✦

                </div>

              </div>


              {/* Heading */}

              <h2 className="mt-6 text-xl font-semibold tracking-tight text-card-foreground">
                Building your roadmap...
              </h2>


              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                AI is designing a personalized
                learning journey based on your
                career goal, experience and skills.
              </p>


              {/* Animated progress */}

              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">

                <div className="roadmap-progress h-full w-1/3 rounded-full bg-primary" />

              </div>

            </div>


            {/* ---------------------------------------------- */}
            {/* GENERATION STEPS */}
            {/* ---------------------------------------------- */}

            <div className="border-t border-border bg-muted/20 px-8 py-6">

              <div className="space-y-5">


                {/* Step 1 */}

                <div className="flex items-center gap-4">

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Analyzing career goal
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Understanding your target
                      career and experience
                    </p>
                  </div>

                </div>


                {/* Connector */}

                <div className="ml-4 h-3 border-l border-border" />


                {/* Step 2 */}

                <div className="flex items-center gap-4">

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">

                    <div className="size-2.5 animate-pulse rounded-full bg-primary" />

                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Mapping required skills
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Finding the knowledge you
                      need to develop
                    </p>
                  </div>

                </div>


                {/* Connector */}

                <div className="ml-4 h-3 border-l border-border" />


                {/* Step 3 */}

                <div className="flex items-center gap-4 opacity-60">

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-muted-foreground">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Creating learning modules
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Organizing topics into a
                      structured path
                    </p>
                  </div>

                </div>


                {/* Connector */}

                <div className="ml-4 h-3 border-l border-border" />


                {/* Step 4 */}

                <div className="flex items-center gap-4 opacity-40">

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-muted-foreground">
                    4
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Preparing your roadmap
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Finalizing your personalized
                      learning journey
                    </p>
                  </div>

                </div>

              </div>


              {/* Footer */}

              <p className="mt-7 text-center text-xs text-muted-foreground">
                This may take a few seconds.
                Please don&apos;t close this page.
              </p>

            </div>


            {/* ---------------------------------------------- */}
            {/* LOCAL ANIMATION CSS */}
            {/* ---------------------------------------------- */}

            <style jsx>{`
              @keyframes roadmapProgress {
                0% {
                  transform: translateX(-120%);
                }

                50% {
                  transform: translateX(120%);
                }

                100% {
                  transform: translateX(320%);
                }
              }

              .roadmap-progress {
                animation:
                  roadmapProgress
                  1.6s
                  ease-in-out
                  infinite;
              }
            `}</style>

          </div>

        </div>

      )}

    </main>
  )
}