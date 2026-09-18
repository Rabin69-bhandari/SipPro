"use client"

import { useEffect, useState } from "react"
import { Send, Loader2 } from "lucide-react"


import AssessmentSection from "@/components/assessment/AssessmentSection"
import AssessmentHeader from "@/components/assessment/AssessmentHeader"
import CareerSelection from "@/components/assessment/CareerSelection"
import AssessmentResult from "@/components/assessment/AssessmentResult"


export default function AssessmentPage() {
    // ==========================================
    // STATE
    // ==========================================

    const [roadmaps, setRoadmaps] = useState([])
    const [loading, setLoading] = useState(true)
    const [generatingId, setGeneratingId] = useState(null)

    const [assessment, setAssessment] = useState(null)
    const [careerGoal, setCareerGoal] = useState(null)

    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    const [error, setError] = useState(null)

    const [answers, setAnswers] = useState({
        question: "",
        scenario: "",
        practical: "",
    })


    // ==========================================
    // FETCH CAREER ROADMAPS
    // ==========================================

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch("/api/roadmaps")
                const result = await response.json()

                if (!response.ok) {
                    throw new Error(
                        result.error || "Failed to load career goals"
                    )
                }

                const formattedRoadmaps =
                    result.roadmaps?.map((item) => ({
                        id: item.id,

                        careerGoalId:
                            item.career_goal?.id,

                        title:
                            item.career_goal?.title,

                        goal:
                            item.career_goal?.goal,

                        skills:
                            item.career_goal?.skills ?? [],

                        experience:
                            item.career_goal?.experience,

                        progress:
                            item.progress ?? 0,
                    })) ?? []

                setRoadmaps(formattedRoadmaps)

            } catch (error) {
                console.error(
                    "Roadmap fetch error:",
                    error
                )

                setError(error.message)

            } finally {
                setLoading(false)
            }
        }

        fetchRoadmaps()
    }, [])


    // ==========================================
    // GENERATE ASSESSMENT
    // ==========================================

    const handleCareerClick = async (roadmap) => {
        try {
            setGeneratingId(roadmap.id)
            setError(null)

            setAnswers({
                question: "",
                scenario: "",
                practical: "",
            })

            const response = await fetch(
                "/api/assesstments/generate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        careerGoalId: roadmap.careerGoalId,
                    }),
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "Failed to generate assessment"
                )
            }

            setCareerGoal(result.careerGoal)
            setAssessment(result.assessment)

        } catch (error) {
            console.error(
                "Assessment generation error:",
                error
            )

            setError(error.message)

        } finally {
            setGeneratingId(null)
        }
    }


    // ==========================================
    // UPDATE ANSWER
    // ==========================================

    const updateAnswer = (field, value) => {
        setAnswers((prev) => ({
            ...prev,
            [field]: value,
        }))
    }


    // ==========================================
    // SUBMIT ASSESSMENT
    // ==========================================

    const handleSubmit = async () => {
        setError(null)

        if (!answers.question.trim()) {
            setError("Please answer the knowledge question.")
            return
        }

        if (!answers.scenario.trim()) {
            setError("Please answer the scenario question.")
            return
        }

        if (!answers.practical.trim()) {
            setError("Please complete the practical task.")
            return
        }

        try {
            setSubmitting(true)

            const response = await fetch(
                "/api/assesstments/evaluate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        careerGoalId: careerGoal?.id,
                        assessment,
                        answers,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "We couldn't evaluate your assessment. Please try again."
                )
            }

            setResult(data.result)

        } catch (error) {
            setError(
                error.message ||
                "Something went wrong while evaluating your assessment."
            )

        } finally {
            setSubmitting(false)
        }
    }


    // ==========================================
    // BACK
    // ==========================================

    const handleBack = () => {
        setAssessment(null)
        setCareerGoal(null)
        setError(null)

        setAnswers({
            question: "",
            scenario: "",
            practical: "",
        })
    }

    if (result) {
        return (
            <main className="min-h-full bg-background">
                <AssessmentResult
                    result={result}
                    careerGoal={careerGoal}
                    onBack={handleBack}
                />
            </main>
        )
    }


    // ==========================================
    // ASSESSMENT VIEW
    // ==========================================

    if (assessment) {
        return (
            <main className="min-h-full bg-background">
                <div className="mx-auto w-full max-w-5xl  lg:px-10">

                    <AssessmentHeader
                        careerGoal={careerGoal}
                        assessment={assessment}
                        onBack={handleBack}
                    />


                    <AssessmentSection
                        number="01"
                        title="Knowledge Question"
                        data={assessment.question}
                        value={answers.question}
                        placeholder="Write your answer..."
                        onChange={(value) =>
                            updateAnswer("question", value)
                        }
                    />


                    <AssessmentSection
                        number="02"
                        title="Scenario"
                        data={assessment.scenario}
                        value={answers.scenario}
                        placeholder="Explain how you would handle this scenario..."
                        onChange={(value) =>
                            updateAnswer("scenario", value)
                        }
                    />


                    <AssessmentSection
                        number="03"
                        title="Practical Task"
                        data={assessment.practical}
                        value={answers.practical}
                        placeholder="Provide your solution, code, explanation, or practical work..."
                        onChange={(value) =>
                            updateAnswer("practical", value)
                        }
                    />


                    {error && (
                        <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}


                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Evaluating...
                                </>
                            ) : (
                                <>
                                    Submit Assessment
                                    <Send className="size-4" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </main>
        )
    }


    // ==========================================
    // CAREER SELECTION VIEW
    // ==========================================

    return (
        <main className="min-h-full bg-background">

            <CareerSelection
                roadmaps={roadmaps}
                loading={loading}
                generatingId={generatingId}
                error={error}
                onCareerClick={handleCareerClick}
            />

        </main>
    )
}