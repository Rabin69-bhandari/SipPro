"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import SheetForm from "@/components/roadmap/SheetForm"
import RoadmapHeader from "@/components/roadmap/RoadmapHeader"
import RoadmapPlanStatus from "@/components/roadmap/RoadmapPlanStatus"
import RoadmapGrid from "@/components/roadmap/RoadmapGrid"
import RoadmapLoading from "@/components/roadmap/RoadmapLoading"
import RoadmapError from "@/components/roadmap/RoadmapError"
import RoadmapEmptyState from "@/components/roadmap/RoadmapEmptyState"
import RoadmapCreatingOverlay from "@/components/roadmap/RoadmapCreatingOverlay"


export default function Roadmap() {
  const router = useRouter()


  // ============================================================
  // STATE
  // ============================================================

  const [roadmaps, setRoadmaps] = useState([])
  const [billing, setBilling] = useState(null)

  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(true)

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)


  // ============================================================
  // FETCH ROADMAPS
  // ============================================================

  const fetchRoadmaps = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/roadmaps",
        {
          cache: "no-store",
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to fetch roadmaps"
        )
      }

      const formattedRoadmaps =
        result.roadmaps.map((item) => ({
          id: item.id,

          title:
            item.career_goal.title,

          experience:
            item.career_goal.experience,

          goal:
            item.career_goal.goal,

          skills:
            item.career_goal.skills,

          hoursPerWeek:
            item.career_goal.hours_per_week,

          progress:
            item.progress,

          roadmapData:
            item.roadmap_data,
        }))

      setRoadmaps(formattedRoadmaps)
    } catch (error) {
      console.error(
        "Failed to fetch roadmaps:",
        error
      )

      setError(error.message)
    }
  }, [])


  // ============================================================
  // FETCH BILLING
  // ============================================================

  const fetchBillingUsage =
    useCallback(async () => {
      try {
        setBillingLoading(true)

        const response = await fetch(
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
    const loadData = async () => {
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
    roadmapAccess?.allowed ?? false

  const isUnlimited =
    roadmapAccess?.unlimited ?? false


  // ============================================================
  // CREATE ROADMAP
  // ============================================================

  const handleCreateRoadmap =
    async (formData) => {
      if (!canCreateRoadmap) {
        const limitError = new Error(
          "Your current plan has reached its roadmap limit."
        )

        limitError.code =
          "PLAN_LIMIT_REACHED"

        throw limitError
      }

      try {
        setCreating(true)
        setError(null)

        const response = await fetch(
          "/api/roadmaps",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(formData),
          }
        )

        const result =
          await response.json()


        // ======================================================
        // PLAN LIMIT
        // ======================================================

        if (
          response.status === 403 &&
          result.code ===
            "PLAN_LIMIT_REACHED"
        ) {
          await fetchBillingUsage()

          const limitError = new Error(
            result.error ||
              "Your roadmap limit has been reached."
          )

          limitError.code =
            "PLAN_LIMIT_REACHED"

          throw limitError
        }


        // ======================================================
        // OTHER ERRORS
        // ======================================================

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to create roadmap"
          )
        }


        // ======================================================
        // FORMAT NEW ROADMAP
        // ======================================================

        const newRoadmap = {
          id:
            result.roadmap.id,

          title:
            result.careerGoal.title,

          experience:
            result.careerGoal.experience,

          goal:
            result.careerGoal.goal,

          skills:
            result.careerGoal.skills,

          hoursPerWeek:
            result.careerGoal.hours_per_week,

          progress:
            result.roadmap.progress,

          roadmapData:
            result.roadmap.roadmap_data,
        }


        // ======================================================
        // UPDATE UI
        // ======================================================

        setRoadmaps((previous) => [
          newRoadmap,
          ...previous,
        ])

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
        setCreating(false)
      }
    }


  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleRoadmapClick =
    (roadmap) => {
      router.push(
        `/roadmap/${roadmap.id}`
      )
    }

  const handleUpgrade = () => {
    router.push("/payment")
  }


  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-full bg-background">
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-5
          py-8
          sm:px-7
          lg:px-10
          lg:py-10
        "
      >
        {/* HEADER */}

        <RoadmapHeader
          roadmapCount={roadmaps.length}
        />


        {/* PLAN */}

        {!billingLoading && (
          <RoadmapPlanStatus
            billing={billing}
            roadmapAccess={roadmapAccess}
            canCreateRoadmap={
              canCreateRoadmap
            }
            isUnlimited={isUnlimited}
            onUpgrade={handleUpgrade}
          />
        )}


        {/* ERROR */}

        <RoadmapError
          message={error}
        />


        {/* LOADING */}

        {loading && (
          <RoadmapLoading />
        )}


        {/* EMPTY */}

        {!loading &&
          roadmaps.length === 0 && (
            <RoadmapEmptyState />
          )}


        {/* ROADMAPS */}

        {!loading &&
          roadmaps.length > 0 && (
            <RoadmapGrid
              roadmaps={roadmaps}
              onRoadmapClick={
                handleRoadmapClick
              }
            />
          )}
      </div>


      {/* ========================================================
          CREATE ROADMAP
      ======================================================== */}

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


      {/* ========================================================
          PLAN LIMIT
      ======================================================== */}

      {!loading &&
        !billingLoading &&
        !canCreateRoadmap &&
        !creating && (
          <button
            type="button"
            onClick={handleUpgrade}
            className="
              fixed
              bottom-6
              right-6
              z-40
              rounded-full
              bg-primary
              px-5
              py-3
              text-sm
              font-medium
              text-primary-foreground
              shadow-lg
              transition
              hover:scale-[1.02]
            "
          >
            Upgrade to create more
          </button>
        )}


      {/* ========================================================
          CREATING ROADMAP
      ======================================================== */}

      {creating && (
        <RoadmapCreatingOverlay />
      )}
    </main>
  )
}