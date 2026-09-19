"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  Send,
  Loader2,
} from "lucide-react"


import AssessmentSection from "@/components/assessment/AssessmentSection"
import AssessmentHeader from "@/components/assessment/AssessmentHeader"
import CareerSelection from "@/components/assessment/CareerSelection"
import AssessmentResult from "@/components/assessment/AssessmentResult"


export default function AssessmentPage() {

  // ==========================================
  // STATE
  // ==========================================

  const [roadmaps, setRoadmaps] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [
    generatingId,
    setGeneratingId,
  ] = useState(null)


  const [
    assessment,
    setAssessment,
  ] = useState(null)

  const [
    careerGoal,
    setCareerGoal,
  ] = useState(null)


  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    result,
    setResult,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState(null)


  // ==========================================
  // TEXT ANSWERS
  // ==========================================

  const [
    answers,
    setAnswers,
  ] = useState({

    question: "",

    scenario: "",

    practical: "",

  })


  // ==========================================
  // PRACTICAL IMAGE
  //
  // {
  //   file: File,
  //   previewUrl: "blob:..."
  // }
  // ==========================================

  const [
    practicalImage,
    setPracticalImage,
  ] = useState(null)


  // ==========================================
  // FETCH CAREER ROADMAPS
  // ==========================================

  useEffect(() => {

    const fetchRoadmaps =
      async () => {

        try {

          setLoading(true)

          setError(null)


          const response =
            await fetch(
              "/api/roadmaps"
            )


          const result =
            await response.json()


          if (!response.ok) {

            throw new Error(
              result.error ||
                "Failed to load career goals"
            )

          }


          const formattedRoadmaps =

            result.roadmaps?.map(
              (item) => ({

                id:
                  item.id,

                careerGoalId:
                  item.career_goal
                    ?.id,

                title:
                  item.career_goal
                    ?.title,

                goal:
                  item.career_goal
                    ?.goal,

                skills:
                  item.career_goal
                    ?.skills ?? [],

                experience:
                  item.career_goal
                    ?.experience,

                progress:
                  item.progress ??
                  0,

              })
            ) ?? []


          setRoadmaps(
            formattedRoadmaps
          )

        } catch (error) {

          console.error(
            "Roadmap fetch error:",
            error
          )


          setError(
            error.message
          )

        } finally {

          setLoading(false)

        }

      }


    fetchRoadmaps()

  }, [])


  // ==========================================
  // CLEAN CURRENT PRACTICAL IMAGE
  // ==========================================

  const clearPracticalImage = () => {

    if (
      practicalImage
        ?.previewUrl
        ?.startsWith("blob:")
    ) {

      URL.revokeObjectURL(
        practicalImage.previewUrl
      )

    }


    setPracticalImage(null)

  }


  // ==========================================
  // GENERATE ASSESSMENT
  // ==========================================

  const handleCareerClick =
    async (roadmap) => {

      try {

        setGeneratingId(
          roadmap.id
        )

        setError(null)

        setResult(null)


        // Reset old answers

        setAnswers({

          question: "",

          scenario: "",

          practical: "",

        })


        // Reset old image

        clearPracticalImage()


        const response =
          await fetch(
            "/api/assesstments/generate",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  careerGoalId:
                    roadmap.careerGoalId,

                }),

            }
          )


        const result =
          await response.json()


        if (!response.ok) {

          throw new Error(

            result.error ||

              "Failed to generate assessment"

          )

        }


        setCareerGoal(
          result.careerGoal
        )

        setAssessment(
          result.assessment
        )

      } catch (error) {

        console.error(
          "Assessment generation error:",
          error
        )


        setError(
          error.message
        )

      } finally {

        setGeneratingId(null)

      }

    }


  // ==========================================
  // UPDATE TEXT ANSWER
  // ==========================================

  const updateAnswer = (
    field,
    value
  ) => {

    setAnswers(
      (prev) => ({

        ...prev,

        [field]: value,

      })
    )

  }


  // ==========================================
  // CONVERT FILE TO BASE64
  // ==========================================

  const fileToBase64 = (
    file
  ) => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const reader =
          new FileReader()


        reader.onload = () => {

          try {

            const result =
              reader.result


            if (
              typeof result !==
              "string"
            ) {

              reject(
                new Error(
                  "Invalid image data."
                )
              )

              return

            }


            // Result looks like:
            //
            // data:image/png;base64,iVBOR...
            //
            // We only send the Base64 portion
            // because Gemini inlineData expects it.

            const commaIndex =
              result.indexOf(",")


            if (
              commaIndex === -1
            ) {

              reject(
                new Error(
                  "Could not process the selected image."
                )
              )

              return

            }


            const base64 =
              result.substring(
                commaIndex + 1
              )


            resolve({

              data:
                base64,

              mimeType:
                file.type,

            })

          } catch (error) {

            reject(error)

          }

        }


        reader.onerror = () => {

          reject(
            new Error(
              "Failed to read the practical image."
            )
          )

        }


        reader.readAsDataURL(
          file
        )

      }
    )

  }


  // ==========================================
  // SUBMIT ASSESSMENT
  // ==========================================

  const handleSubmit =
    async () => {

      setError(null)


      // ========================================
      // KNOWLEDGE VALIDATION
      // ========================================

      if (
        !answers.question.trim()
      ) {

        setError(
          "Please answer the knowledge question."
        )

        return

      }


      // ========================================
      // SCENARIO VALIDATION
      // ========================================

      if (
        !answers.scenario.trim()
      ) {

        setError(
          "Please answer the scenario question."
        )

        return

      }


      // ========================================
      // PRACTICAL VALIDATION
      //
      // Practical can contain:
      //
      // text only
      // image only
      // text + image
      // ========================================

      if (
        !answers.practical.trim() &&
        !practicalImage?.file
      ) {

        setError(
          "Please complete the practical task or upload practical evidence."
        )

        return

      }


      try {

        setSubmitting(true)


        // ======================================
        // PREPARE IMAGE
        // ======================================

        let practicalImageData =
          null


        if (
          practicalImage?.file
        ) {

          practicalImageData =
            await fileToBase64(
              practicalImage.file
            )

        }


        // ======================================
        // EVALUATE
        // ======================================

        const response =
          await fetch(
            "/api/assesstments/evaluate",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  careerGoalId:
                    careerGoal?.id,

                  assessment,

                  answers,

                  practicalImage:
                    practicalImageData,

                }),

            }
          )


        // ======================================
        // SAFELY READ RESPONSE
        // ======================================

        const contentType =
          response.headers.get(
            "content-type"
          ) || ""


        if (
          !contentType.includes(
            "application/json"
          )
        ) {

          const text =
            await response.text()


          console.error(
            "Assessment API returned non-JSON:",
            text
          )


          throw new Error(
            "The assessment server returned an invalid response."
          )

        }


        const data =
          await response.json()


        if (!response.ok) {

          throw new Error(

            data.error ||

              "We couldn't evaluate your assessment. Please try again."

          )

        }


        // ======================================
        // SUCCESS
        // ======================================

        setResult(
          data.result
        )

      } catch (error) {

        console.error(
          "Assessment submission error:",
          error
        )


        setError(

          error.message ||

            "Something went wrong while evaluating your assessment."

        )

      } finally {

        setSubmitting(false)

      }

    }


  // ==========================================
  // BACK / RESET
  // ==========================================

  const handleBack = () => {

    setAssessment(null)

    setCareerGoal(null)

    setResult(null)

    setError(null)


    setAnswers({

      question: "",

      scenario: "",

      practical: "",

    })


    clearPracticalImage()

  }


  // ==========================================
  // RESULT VIEW
  // ==========================================

  if (result) {

    return (

      <main className="min-h-full bg-background">

        <AssessmentResult

          result={
            result
          }

          careerGoal={
            careerGoal
          }

          onBack={
            handleBack
          }

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

        <div className="mx-auto w-full max-w-5xl lg:px-10">


          {/* HEADER */}

          <AssessmentHeader

            careerGoal={
              careerGoal
            }

            assessment={
              assessment
            }

            onBack={
              handleBack
            }

          />


          {/* ================================= */}
          {/* 01 — KNOWLEDGE */}
          {/* ================================= */}

          <AssessmentSection

            number="01"

            title="Knowledge Question"

            data={
              assessment.question
            }

            value={
              answers.question
            }

            placeholder="Write your answer..."

            onChange={(
              value
            ) =>
              updateAnswer(
                "question",
                value
              )
            }

          />


          {/* ================================= */}
          {/* 02 — SCENARIO */}
          {/* ================================= */}

          <AssessmentSection

            number="02"

            title="Scenario"

            data={
              assessment.scenario
            }

            value={
              answers.scenario
            }

            placeholder="Explain how you would handle this scenario..."

            onChange={(
              value
            ) =>
              updateAnswer(
                "scenario",
                value
              )
            }

          />


          {/* ================================= */}
          {/* 03 — PRACTICAL */}
          {/* ================================= */}

          <AssessmentSection

            number="03"

            title="Practical Task"

            data={
              assessment.practical
            }

            value={
              answers.practical
            }

            placeholder="Provide your solution, code, explanation, or practical work..."

            onChange={(
              value
            ) =>
              updateAnswer(
                "practical",
                value
              )
            }

            allowImage={true}

            image={
              practicalImage
            }

            onImageChange={
              setPracticalImage
            }

          />


          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}

          {error && (

            <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">

              {error}

            </div>

          )}


          {/* ================================= */}
          {/* SUBMIT */}
          {/* ================================= */}

          <div className="flex justify-end pb-10">

            <button

              type="button"

              onClick={
                handleSubmit
              }

              disabled={
                submitting
              }

              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"

            >

              {submitting ? (

                <>

                  <Loader2 className="size-4 animate-spin" />

                  {practicalImage
                    ? "Analyzing evidence..."
                    : "Evaluating..."}

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

        roadmaps={
          roadmaps
        }

        loading={
          loading
        }

        generatingId={
          generatingId
        }

        error={
          error
        }

        onCareerClick={
          handleCareerClick
        }

      />

    </main>

  )

}