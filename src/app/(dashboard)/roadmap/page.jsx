"use client"

import { useEffect, useState } from "react"

import CareerCard from "@/components/roadmap/CareerCard"
import SheetForm from "@/components/roadmap/SheetForm"
import { useRouter } from "next/navigation"

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // --------------------------------------------------
  // Fetch user's roadmaps
  // --------------------------------------------------

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch("/api/roadmaps")

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to fetch roadmaps"
          )
        }

        // Convert database response into CareerCard format
        const formattedRoadmaps = result.roadmaps.map((item) => ({
          id: item.id,

          title: item.career_goal.title,
          experience: item.career_goal.experience,
          goal: item.career_goal.goal,
          skills: item.career_goal.skills,
          hoursPerWeek: item.career_goal.hours_per_week,

          progress: item.progress,

          // Gemini generated roadmap
          roadmapData: item.roadmap_data,
        }))

        setRoadmaps(formattedRoadmaps)

      } catch (error) {
        console.error(
          "Failed to fetch roadmaps:",
          error
        )

      } finally {
        setLoading(false)
      }
    }

    fetchRoadmaps()
  }, [])


  // --------------------------------------------------
  // Create new roadmap
  // --------------------------------------------------

  const handleCreateRoadmap = async (formData) => {
    try {
    

      const response = await fetch("/api/roadmaps", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to create roadmap"
        )
      }


      // Convert response into CareerCard format
      const newRoadmap = {
        id: result.roadmap.id,

        title: result.careerGoal.title,
        experience: result.careerGoal.experience,
        goal: result.careerGoal.goal,
        skills: result.careerGoal.skills,
        hoursPerWeek: result.careerGoal.hours_per_week,

        progress: result.roadmap.progress,

        // Gemini generated roadmap
        roadmapData: result.roadmap.roadmap_data,
      }

      // Add new roadmap to beginning of cards
      setRoadmaps((previous) => [
        newRoadmap,
        ...previous,
      ])


    } catch (error) {
      console.error(
        "Roadmap creation failed:",
        error
      )

      // Important because SheetForm awaits onSubmit()
      throw error
    }
  }


  // --------------------------------------------------
  // Handle roadmap click
  // --------------------------------------------------

  const handleRoadmapClick = (roadmap) => {
    console.log("Selected roadmap:", roadmap)

    // Next step:
    router.push(`/roadmap/${roadmap.id}`)
  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">

        {/* Header */}
        <div className="mb-10">

          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Career Journey
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Career Roadmaps
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            Create a career goal and follow a personalized path toward the
            skills you need.
          </p>

        </div>


        {/* Loading */}
        {loading && (
          <div className="py-12 text-center">

            <p className="text-sm text-muted-foreground">
              Loading your roadmaps...
            </p>

          </div>
        )}


        {/* Empty state */}
        {!loading && roadmaps.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">

            <h2 className="text-lg font-semibold text-card-foreground">
              No career roadmaps yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create your first career goal and let AI build a personalized
              learning roadmap for you.
            </p>

          </div>
        )}


        {/* Roadmap cards */}
        {!loading && roadmaps.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {roadmaps.map((roadmap) => (
              <CareerCard
                key={roadmap.id}
                roadmap={roadmap}
                onClick={handleRoadmapClick}
              />
            ))}

          </div>
        )}

      </div>


      {/* Create Roadmap */}
      <SheetForm
        onSubmit={handleCreateRoadmap}
      />

    </main>
  )
}