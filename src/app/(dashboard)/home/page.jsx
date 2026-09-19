"use client"

import {
  useCallback,
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

  const [data, setData] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [
    selectedCareerId,
    setSelectedCareerId,
  ] = useState(null)


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "/api/dashboard",
        {
          method: "GET",
          cache: "no-store",
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to load your dashboard."
        )
      }

      setData(result)


      // ======================================
      // SELECT CAREER
      // ======================================

      if (result.careers?.length > 0) {
        setSelectedCareerId((current) => {
          const careerStillExists =
            result.careers.some(
              (career) =>
                career.id === current
            )

          if (careerStillExists) {
            return current
          }

          return result.careers[0].id
        })
      } else {
        setSelectedCareerId(null)
      }
    } catch (err) {
      console.error(
        "Dashboard fetch error:",
        err
      )

      setError(
        err.message ||
          "Something went wrong while loading your dashboard."
      )
    } finally {
      setLoading(false)
    }
  }, [])


  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])


  // ==========================================
  // SELECTED CAREER
  // ==========================================

  const career = useMemo(() => {
    if (!data?.careers?.length) {
      return null
    }

    return (
      data.careers.find(
        (item) =>
          item.id === selectedCareerId
      ) ||
      data.careers[0]
    )
  }, [
    data,
    selectedCareerId,
  ])


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <DashboardLoading />
    )
  }


  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <DashboardError
        error={error}
        onRetry={fetchDashboard}
      />
    )
  }


  // ==========================================
  // NO CAREERS
  // ==========================================

  if (!career) {
    return (
      <NoCareers />
    )
  }


  // ==========================================
  // CAREER DATA
  // ==========================================

  const roadmap =
    career.roadmap ?? null

  const assessment =
    career.assessment ?? null

  const interview =
    career.interview ?? null


  // ==========================================
  // READINESS
  // ==========================================

  const readiness =
    career.readiness ?? {
      score: 0,
      learning: 0,
      assessment: 0,
      interview: 0,
    }


  // ==========================================
  // SKILL EVIDENCE
  // ==========================================

  const evidence =
    career.evidence ?? {
      claimedSkills:
        career.skills ?? [],

      demonstratedSkills: [],

      roadmapCompleted: false,

      assessmentCompleted: false,

      interviewCompleted: false,
    }


  // ==========================================
  // ASSESSMENT STATS
  // ==========================================

  const assessmentStats =
    career.assessmentStats ?? {
      attempts: 0,
    }


  // ==========================================
  // INTERVIEW STATS
  // ==========================================

  const interviewStats =
    career.interviewStats ?? {
      attempts: 0,
    }


  // ==========================================
  // OVERALL JOURNEY DATA
  // ==========================================

  const overview =
    data?.overview ?? {
      totalCareers: 0,

      totalRoadmaps: 0,

      completedTopics: 0,

      assessmentsTaken: 0,

      assessmentsPassed: 0,

      interviewsTaken: 0,

      averageInterviewScore: 0,

      demonstratedSkills: 0,
    }


  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 md:py-7 lg:px-8">


        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <HomeHeader
          careers={data.careers}
          career={career}
          onCareerChange={
            setSelectedCareerId
          }
        />


        {/* ================================== */}
        {/* CAREER OVERVIEW + READINESS */}
        {/* ================================== */}

        <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">

          <CareerOverview
            career={career}
            roadmap={roadmap}
          />

          <ReadinessCard
            readiness={readiness}
          />

        </section>


        {/* ================================== */}
        {/* READINESS STATS + SKILL EVIDENCE */}
        {/* ================================== */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">

          <StatsOverview
            readiness={readiness}
          />

          <SkillEvidence
            evidence={evidence}
          />

        </section>


        {/* ================================== */}
        {/* ROADMAP + NEXT ACTION */}
        {/* ================================== */}

        <section className="mt-5 ">

          <RoadmapSnapshot
            roadmap={roadmap}
          />

       

        </section>


        {/* ================================== */}
        {/* ASSESSMENT + INTERVIEW */}
        {/* ================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          <AssessmentCard
            assessment={assessment}
            stats={assessmentStats}
          />

          <InterviewCard
            interview={interview}
            stats={interviewStats}
            readiness={readiness}
          />

        </section>


        {/* ================================== */}
        {/* OVERALL JOURNEY */}
        {/* ================================== */}

        <JourneyOverview
          overview={overview}
        />


      </div>

    </main>
  )
}