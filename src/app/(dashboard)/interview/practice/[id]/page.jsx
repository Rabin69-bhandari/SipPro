"use client"

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation"

import { ArrowLeft } from "lucide-react"

import InterviewVoice from "@/components/roadmap/InterviewVoice"

export default function InterviewPracticePage() {

  // ==========================================
  // ROUTER
  // ==========================================

  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()


  // ==========================================
  // ROUTE DATA
  // ==========================================

  const id = params.id

  const title =
    searchParams.get("title") ||
    "Career Interview"


  const topics =
    searchParams
      .get("topics")
      ?.split(",")
      .filter(Boolean) ?? []


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10">


        {/* ================================= */}
        {/* BACK */}
        {/* ================================= */}

        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >

          <ArrowLeft className="size-4" />

          Back to Interviews

        </button>


        {/* ================================= */}
        {/* PAGE HEADER */}
        {/* ================================= */}

        <div className="mb-6">

          <p className="text-sm font-medium text-primary">
            AI Mock Interview
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Practice answering career-specific questions in a
            real-time AI interview. Explain your reasoning naturally
            as you would in a real interview.
          </p>

        </div>


        {/* ================================= */}
        {/* TOPICS */}
        {/* ================================= */}

        {topics.length > 0 && (

          <div className="mb-6">

            <p className="mb-3 text-sm font-medium">
              Interview Topics
            </p>

            <div className="flex flex-wrap gap-2">

              {topics.map(
                (topic, index) => (

                  <span
                    key={`${topic}-${index}`}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {topic}
                  </span>

                )
              )}

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* VOICE INTERVIEW */}
        {/* ================================= */}

        <InterviewVoice
          roadmapId={id}
          title={title}
          topics={topics}
        />


      </div>

    </main>

  )
}