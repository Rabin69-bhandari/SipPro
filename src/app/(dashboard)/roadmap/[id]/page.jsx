"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import RoadmapHeader from "@/components/roadmap/RoadmapHeader"
import RoadmapContent from "@/components/roadmap/RoadmapContent"
import VoiceTutor from "@/components/roadmap/VoiceTutor"


export default function Roadmap() {

    const params = useParams()

    const roadmapId = params.id


    // =============================================
    // STATE
    // =============================================

    const [roadmap, setRoadmap] =
        useState(null)

    const [selectedTopic, setSelectedTopic] =
        useState(null)

    const [completedTopics, setCompletedTopics] =
        useState([])

    const [sessionActive, setSessionActive] =
        useState(false)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState(null)


    // =============================================
    // FETCH ROADMAP
    // =============================================

    useEffect(() => {

        if (!roadmapId) return


        const fetchRoadmap = async () => {

            try {

                setLoading(true)

                setError(null)


                // -----------------------------------------
                // Fetch all user's roadmaps
                // -----------------------------------------

                const response =
                    await fetch("/api/roadmaps")


                const result =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Failed to fetch roadmap"
                    )

                }


                // -----------------------------------------
                // Find roadmap matching URL ID
                // -----------------------------------------

                const selectedRoadmap =
                    result.roadmaps.find(
                        (item) =>
                            item.id === roadmapId
                    )


                if (!selectedRoadmap) {

                    throw new Error(
                        "Roadmap not found"
                    )

                }


                // -----------------------------------------
                // AI generated roadmap JSON
                // -----------------------------------------

                const roadmapData =
                    selectedRoadmap.roadmap_data


                // -----------------------------------------
                // Format roadmap
                // -----------------------------------------

                const formattedRoadmap = {

                    id:
                        selectedRoadmap.id,

                    title:
                        roadmapData.title,

                    description:
                        roadmapData.description,

                    modules:
                        roadmapData.modules ?? [],

                    progress:
                        selectedRoadmap.progress ?? 0,

                    careerGoal:
                        selectedRoadmap.career_goal,

                }


                // -----------------------------------------
                // Save roadmap
                // -----------------------------------------

                setRoadmap(
                    formattedRoadmap
                )


                // =========================================
                // LOAD COMPLETED TOPICS FROM DATABASE
                // =========================================

                setCompletedTopics(
                    selectedRoadmap.completedTopics ?? []
                )


                console.log(
                    "Completed topics from database:",
                    selectedRoadmap.completedTopics
                )


                // -----------------------------------------
                // Select first topic
                // -----------------------------------------

                const firstTopic =
                    formattedRoadmap
                        .modules?.[0]
                        ?.topics?.[0]


                if (firstTopic) {

                    setSelectedTopic(
                        firstTopic
                    )

                }


            } catch (error) {

                console.error(
                    "Failed to fetch roadmap:",
                    error
                )


                setError(
                    error.message
                )


            } finally {

                setLoading(false)

            }

        }


        fetchRoadmap()


    }, [roadmapId])


    // =============================================
    // TOPIC COMPLETED
    // =============================================
    //
    // VoiceTutor calls this after:
    //
    // POST /api/roadmaps/[id]/progress
    //
    // succeeds.
    // =============================================

    const handleTopicCompleted = ({
        topicId,
        completedTopics: serverCompletedTopics,
        progress,
    }) => {


        console.log(
            "Topic completed:",
            topicId
        )


        console.log(
            "New progress:",
            progress
        )


        // -----------------------------------------
        // Prefer database truth
        // -----------------------------------------

        if (serverCompletedTopics) {

            setCompletedTopics(
                serverCompletedTopics
            )

        } else {

            // Fallback in case VoiceTutor
            // doesn't send completedTopics yet

            setCompletedTopics(
                (previous) => {

                    if (
                        previous.includes(topicId)
                    ) {

                        return previous

                    }


                    return [
                        ...previous,
                        topicId,
                    ]

                }
            )

        }


        // -----------------------------------------
        // Update progress bar immediately
        // -----------------------------------------

        setRoadmap(
            (previous) => {

                if (!previous) {
                    return previous
                }


                return {
                    ...previous,

                    progress:
                        progress ??
                        previous.progress,
                }

            }
        )

    }


    // =============================================
    // LOADING
    // =============================================

    if (loading) {

        return (

            <main className="flex min-h-[70vh] items-center justify-center bg-background">

                <div className="text-center">

                    <div className="mx-auto size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading roadmap...
                    </p>

                </div>

            </main>

        )

    }


    // =============================================
    // ERROR
    // =============================================

    if (error) {

        return (

            <main className="flex min-h-[70vh] items-center justify-center bg-background">

                <div className="text-center">

                    <h2 className="text-lg font-semibold text-foreground">
                        Unable to load roadmap
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error}
                    </p>

                </div>

            </main>

        )

    }


    // =============================================
    // NO ROADMAP
    // =============================================

    if (!roadmap) {
        return null
    }


    // =============================================
    // UI
    // =============================================

    return (

        <main className="min-h-full bg-background">

            <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <RoadmapHeader
                    roadmap={roadmap}
                    progress={roadmap.progress}
                />


                {/* ================================= */}
                {/* CONTENT */}
                {/* ================================= */}

                <div className="grid items-start gap-6 lg:grid-cols-[0.72fr_1.28fr]">


                    {/* Roadmap */}

                    <RoadmapContent

                        modules={
                            roadmap.modules
                        }

                        selectedTopic={
                            selectedTopic
                        }

                        setSelectedTopic={
                            setSelectedTopic
                        }

                        completedTopics={
                            completedTopics
                        }

                        sessionActive={
                            sessionActive
                        }

                    />


                    {/* Voice AI */}

                    <VoiceTutor

                    roadmap={
                        roadmap
                    }
                    selectedTopic={
                        selectedTopic
                    }

                    sessionActive={
                        sessionActive
                    }

                    setSessionActive={
                        setSessionActive
                    }

                    onTopicCompleted={
                        handleTopicCompleted
                    }

                    />


                </div>

            </div>

        </main>

    )

}