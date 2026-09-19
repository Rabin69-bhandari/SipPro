"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import {
  Loader2,
  Lock,
  Mic,
} from "lucide-react"

import CareerCard from "@/components/roadmap/CareerCard"


export default function Practice() {

  // ==========================================
  // STATE
  // ==========================================

  const [roadmaps, setRoadmaps] =
    useState([])

  const [billing, setBilling] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  const router = useRouter()


  // ==========================================
  // FETCH ROADMAPS
  // ==========================================

  const fetchRoadmaps =
    useCallback(async () => {

      const response =
        await fetch(
          "/api/roadmaps",
          {
            cache: "no-store",
          }
        )

      const data =
        await response.json()


      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to load career goals"
        )
      }


      // ------------------------------------------
      // Format API data for CareerCard
      // ------------------------------------------

      const formattedRoadmaps =
        data.roadmaps?.map(
          (item) => ({

            id:
              item.id,

            careerGoalId:
              item.career_goal?.id,

            title:
              item.career_goal?.title,

            goal:
              item.career_goal?.goal,

            experience:
              item.career_goal
                ?.experience,

            skills:
              item.career_goal
                ?.skills ?? [],

            progress:
              item.progress ?? 0,

            completedTopics:
              item.completedTopics ?? [],

            roadmapData:
              item.roadmap_data,

          })
        ) ?? []


      setRoadmaps(
        formattedRoadmaps
      )

    }, [])


  // ==========================================
  // FETCH BILLING USAGE
  // ==========================================

  const fetchBilling =
    useCallback(async () => {

      const response =
        await fetch(
          "/api/billing/usage",
          {
            cache: "no-store",
          }
        )


      const data =
        await response.json()


      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to load plan information"
        )
      }


      setBilling(data)

    }, [])


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    const loadPage =
      async () => {

        try {

          setLoading(true)
          setError(null)


          await Promise.all([
            fetchRoadmaps(),
            fetchBilling(),
          ])

        } catch (error) {

          console.error(
            "Interview page load error:",
            error
          )


          setError(
            error.message ||
            "Something went wrong while loading your careers."
          )

        } finally {

          setLoading(false)

        }

      }


    loadPage()

  }, [
    fetchRoadmaps,
    fetchBilling,
  ])


  // ==========================================
  // INTERVIEW ACCESS
  // ==========================================

  const interviewAccess =
    billing?.usage?.interviews


  const canStartInterview =
    interviewAccess?.allowed ??
    false


  const isUnlimited =
    interviewAccess?.unlimited ??
    false


  const interviewUsage =
    interviewAccess?.usage ?? 0


  const interviewLimit =
    interviewAccess?.limit


  const remaining =
    interviewAccess?.remaining


  // ==========================================
  // PLAN NAME
  // ==========================================

  const planName =
    billing?.plan === "free"
      ? "Free"
      : billing?.plan === "pro"
        ? "Pro"
        : billing?.plan ===
            "career_plus"
          ? "Career+"
          : "Free"


  // ==========================================
  // SELECT CAREER
  // ==========================================

  const handleCareerClick =
    (roadmap) => {

      // ------------------------------------------
      // Prevent interview if plan limit reached
      // ------------------------------------------

      if (!canStartInterview) {
        return
      }


      const topics =
        roadmap.roadmapData
          ?.modules
          ?.flatMap(
            (module) =>
              module.topics?.map(
                (topic) =>
                  topic.title
              ) ?? []
          )
          .join(",") ?? ""


      const query =
        new URLSearchParams({
          title:
            roadmap.title || "",

          topics,
        })


      router.push(
        `/interview/practice/${roadmap.id}?${query.toString()}`
      )

    }


  // ==========================================
  // UPGRADE
  // ==========================================

  const handleUpgrade = () => {

    router.push(
      "/payment"
    )

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">

            <Mic className="size-4" />

            AI Interview

          </div>


          <h1 className="text-3xl font-semibold tracking-tight">

            Practice Your Interview

          </h1>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">

            Choose one of your career goals and
            practice a personalized AI interview
            based on your skills, experience and
            learning progress.

          </p>

        </div>


        {/* =====================================
            PLAN STATUS
        ====================================== */}

        {!loading &&
          billing &&
          interviewAccess && (

          <div
            className={`mb-8 rounded-2xl border p-5 ${
              canStartInterview
                ? "border-border bg-card"
                : "border-primary/20 bg-primary/5"
            }`}
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


              {/* LEFT */}

              <div className="flex items-start gap-4">

                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    canStartInterview
                      ? "bg-secondary"
                      : "bg-primary/10"
                  }`}
                >

                  {canStartInterview ? (

                    <Mic className="size-5" />

                  ) : (

                    <Lock className="size-5 text-primary" />

                  )}

                </div>


                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="font-medium text-foreground">

                      {planName} Plan

                    </p>


                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">

                      {isUnlimited
                        ? `${interviewUsage} interviews completed`
                        : `${interviewUsage} / ${interviewLimit} interviews`}

                    </span>

                  </div>


                  <p className="mt-1 text-sm text-muted-foreground">

                    {isUnlimited
                      ? "Your plan includes unlimited AI interviews."
                      : canStartInterview
                        ? `You can complete ${remaining} more AI interview${remaining === 1 ? "" : "s"}.`
                        : "You have reached the AI interview limit for your current plan."}

                  </p>

                </div>

              </div>


              {/* UPGRADE */}

              {!canStartInterview &&
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

          </div>

        )}


        {/* =====================================
            LIMIT REACHED MESSAGE
        ====================================== */}

        {!loading &&
          interviewAccess &&
          !canStartInterview &&
          !isUnlimited && (

          <div className="mb-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-8 text-center">

            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">

              <Lock className="size-5 text-primary" />

            </div>


            <h2 className="mt-4 text-lg font-semibold">

              Interview limit reached

            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">

              You&apos;ve used all AI interviews
              included in your {planName} plan.
              Upgrade your plan to continue
              practicing interviews.

            </p>


            <button
              type="button"
              onClick={
                handleUpgrade
              }
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >

              View Upgrade Options →

            </button>

          </div>

        )}


        {/* =====================================
            ERROR
        ====================================== */}

        {error && (

          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">

            {error}

          </div>

        )}


        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="flex min-h-64 flex-col items-center justify-center gap-3">

            <Loader2 className="size-6 animate-spin text-primary" />

            <p className="text-sm text-muted-foreground">

              Loading your career goals...

            </p>

          </div>

        )}


        {/* =====================================
            EMPTY STATE
        ====================================== */}

        {!loading &&
          roadmaps.length === 0 && (

          <div className="rounded-2xl border border-dashed border-border p-12 text-center">

            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-secondary">

              <Mic className="size-5" />

            </div>


            <h2 className="mt-4 font-semibold">

              No career goals found

            </h2>


            <p className="mt-2 text-sm text-muted-foreground">

              Create a career roadmap before
              starting an AI interview.

            </p>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/roadmap"
                )
              }
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
            >

              Create Roadmap →

            </button>

          </div>

        )}


        {/* =====================================
            CAREER SECTION
        ====================================== */}

        {!loading &&
          roadmaps.length > 0 && (

          <div>

            <div className="mb-4 flex items-center justify-between gap-4">

              <div>

                <h2 className="font-semibold text-foreground">

                  Choose a career

                </h2>


                <p className="mt-1 text-sm text-muted-foreground">

                  {canStartInterview
                    ? "Select a roadmap to begin your personalized interview."
                    : "Your career roadmaps are still available, but starting another interview requires an upgrade."}

                </p>

              </div>

            </div>


            {/* =====================================
                CAREER CARDS
            ====================================== */}

            <div
              className={`grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${
                !canStartInterview
                  ? "opacity-60"
                  : ""
              }`}
            >

              {roadmaps.map(
                (roadmap) => (

                <div
                  key={
                    roadmap.id
                  }
                  className="relative"
                >

                  <CareerCard
                    roadmap={
                      roadmap
                    }
                    onClick={
                      handleCareerClick
                    }
                  />


                  {/* Locked overlay */}

                  {!canStartInterview && (

                    <button
                      type="button"
                      onClick={
                        handleUpgrade
                      }
                      className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-2xl bg-background/20 backdrop-blur-[1px]"
                      aria-label="Upgrade plan to start another interview"
                    >

                      <span className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm">

                        <Lock className="size-3.5" />

                        Interview locked

                      </span>

                    </button>

                  )}

                </div>

              ))}

            </div>

          </div>

        )}


      </div>

    </main>

  )
}