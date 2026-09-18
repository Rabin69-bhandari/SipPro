"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mic } from "lucide-react"

import CareerCard from "@/components/roadmap/CareerCard"


export default function Practice() {

  // ==========================================
  // STATE
  // ==========================================

  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const router = useRouter()


  // ==========================================
  // FETCH ROADMAPS
  // ==========================================

  useEffect(() => {

    const fetchRoadmaps = async () => {

      try {

        setLoading(true)
        setError(null)


        const response = await fetch("/api/roadmaps")

        const data = await response.json()


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
          data.roadmaps?.map((item) => ({

            id: item.id,

            careerGoalId:
              item.career_goal?.id,

            title:
              item.career_goal?.title,

            goal:
              item.career_goal?.goal,

            experience:
              item.career_goal?.experience,

            skills:
              item.career_goal?.skills ?? [],

            progress:
              item.progress ?? 0,

            completedTopics:
              item.completedTopics ?? [],

            roadmapData:
              item.roadmap_data,

          })) ?? []


        setRoadmaps(formattedRoadmaps)

      } catch (error) {

        setError(
          error.message ||
          "Something went wrong while loading your careers."
        )

      } finally {

        setLoading(false)

      }

    }


    fetchRoadmaps()

  }, [])


  // ==========================================
  // SELECT CAREER
  // ==========================================

 const handleCareerClick = (roadmap) => {
  const topics =
    roadmap.roadmapData?.modules
      ?.flatMap((module) =>
        module.topics?.map((topic) => topic.title) ?? []
      )
      .join(",") ?? ""

  const query = new URLSearchParams({
    title: roadmap.title || "",
    topics,
  })

  router.push(
    `/interview/practice/${roadmap.id}?${query.toString()}`
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

            Choose one of your career goals and practice a
            personalized AI interview based on your skills,
            experience and learning progress.

          </p>

        </div>


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

        {!loading && roadmaps.length === 0 && (

          <div className="rounded-2xl border border-dashed border-border p-12 text-center">


            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-secondary">

              <Mic className="size-5" />

            </div>


            <h2 className="mt-4 font-semibold">

              No career goals found

            </h2>


            <p className="mt-2 text-sm text-muted-foreground">

              Create a career roadmap before starting
              an AI interview.

            </p>


          </div>

        )}


        {/* =====================================
            CAREER CARDS
        ====================================== */}

        {!loading && roadmaps.length > 0 && (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {roadmaps.map((roadmap) => (

              <CareerCard

                key={roadmap.id}

                roadmap={roadmap}

                onClick={handleCareerClick}

              />

            ))}

          </div>

        )}


      </div>

    </main>

  )
}