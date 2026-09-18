"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import HomeHeader from "@/components/home/HomeHeader"
import CareerOverview from "@/components/home/CareerOverview"
import ReadinessCard from "@/components/home/ReadinessCard"
import StatsOverview from "@/components/home/StatsOverview"
import RoadmapSnapshot from "@/components/home/RoadmapSnapshot"
import NextActionCard from "@/components/home/NextActionCard"
import SkillEvidence from "@/components/home/SkillEvidence"
import AssessmentCard from "@/components/home/AssessmentCard"
import InterviewCard from "@/components/home/InterviewCard"
import JourneyOverview from "@/components/home/JourneyOverview"

import {
  DashboardLoading,
  DashboardError,
  NoCareers,
} from "@/components/home/DashboardStates"


export default function Home() {

  // ==========================================
  // STATE
  // ==========================================

  const [data, setData] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  const [
    selectedCareerId,
    setSelectedCareerId,
  ] = useState(null)


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard =
    async () => {

      try {

        setLoading(true)
        setError(null)


        const response =
          await fetch(
            "/api/dashboard"
          )


        const result =
          await response.json()


        if (!response.ok) {

          throw new Error(
            result.error ||
            "Failed to load your dashboard."
          )

        }


        setData(result)


        if (
          result.careers?.length >
          0
        ) {

          setSelectedCareerId(
            (current) =>
              current ||
              result.careers[0].id
          )

        }

      } catch (error) {

        setError(
          error.message ||
          "Something went wrong while loading your dashboard."
        )

      } finally {

        setLoading(false)

      }

    }


  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {

    fetchDashboard()

  }, [])


  // ==========================================
  // SELECTED CAREER
  // ==========================================

  const career =
    useMemo(() => {

      if (
        !data?.careers?.length
      ) {
        return null
      }


      return (

        data.careers.find(
          (item) =>
            item.id ===
            selectedCareerId
        ) ||

        data.careers[0]

      )

    }, [
      data,
      selectedCareerId,
    ])


  // ==========================================
  // STATES
  // ==========================================

  if (loading) {

    return (
      <DashboardLoading />
    )

  }


  if (error) {

    return (
      <DashboardError
        error={error}
        onRetry={
          fetchDashboard
        }
      />
    )

  }


  if (!career) {

    return (
      <NoCareers />
    )

  }


  // ==========================================
  // CAREER DATA
  // ==========================================

  const roadmap =
    career.roadmap

  const assessment =
    career.assessment

  const readiness =
    career.readiness


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 lg:px-10">


        {/* HEADER */}

        <HomeHeader
          careers={
            data.careers
          }
          career={
            career
          }
          onCareerChange={
            setSelectedCareerId
          }
        />


        {/* CAREER + READINESS */}

        <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

          <CareerOverview
            career={
              career
            }
            roadmap={
              roadmap
            }
          />

          <ReadinessCard
            readiness={
              readiness
            }
          />

        </section>


        {/* MAIN STATS */}

        <StatsOverview
          roadmap={
            roadmap
          }
          assessment={
            assessment
          }
          readiness={
            readiness
          }
        />


        {/* ROADMAP + ACTIONS */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">

          <RoadmapSnapshot
            roadmap={
              roadmap
            }
          />


          <div className="space-y-5">

            <NextActionCard
              nextAction={
                career.nextAction
              }
            />

            <SkillEvidence
              roadmap={
                roadmap
              }
              assessment={
                assessment
              }
              readiness={
                readiness
              }
            />

          </div>

        </section>


        {/* ASSESSMENT + INTERVIEW */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          <AssessmentCard
            assessment={
              assessment
            }
          />

          <InterviewCard
            readiness={
              readiness
            }
          />

        </section>


        {/* OVERALL JOURNEY */}

        <JourneyOverview
          overview={
            data.overview
          }
        />


      </div>

    </main>

  )
}