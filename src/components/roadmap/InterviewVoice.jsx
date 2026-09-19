"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  CheckCircle2,
  Mic,
  MicOff,
  PhoneOff,
  RotateCcw,
  Sparkles,
} from "lucide-react"

import {Lottie} from "lottie-react"
import EvaluatingInterview from "./EvaluatingInterview"
import InterviewResult from "./InterviewResult"

import vapi from "@/lib/vapi/vapi"
import { configureAssistant2 } from "@/lib/utils"

import sounds from "@/constant/sounds.json"

import { Button } from "@/components/ui/button"


// ==========================================
// INTERVIEW STATUS
// ==========================================

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISH: "FINISH",
  EVALUATING: "EVALUATING",
  COMPLETED: "COMPLETED",
}


// ==========================================
// COMPONENT
// ==========================================

export default function InterviewVoice({
  title,
  topics,
  roadmapId,
}) {

  // ==========================================
  // STATE
  // ==========================================

  const [callStatus, setCallStatus] =
    useState(CallStatus.INACTIVE)

  const [isMuted, setIsMuted] =
    useState(false)

  const [isSpeaking, setIsSpeaking] =
    useState(false)

  const [error, setError] =
    useState(null)

  const [result, setResult] =
    useState(null)


  // ==========================================
  // REFS
  // ==========================================

  const lottieRef =
    useRef(null)

  const transcriptRef =
    useRef([])

  const interviewDataRef =
    useRef({
      roadmapId,
      title,
      topics,
    })


  // ==========================================
  // KEEP LATEST PROPS
  // ==========================================

  useEffect(() => {

    interviewDataRef.current = {
      roadmapId,
      title,
      topics,
    }

  }, [
    roadmapId,
    title,
    topics,
  ])


  // ==========================================
  // LOTTIE
  // ==========================================

  useEffect(() => {

    if (isSpeaking) {

      lottieRef.current?.play()

    } else {

      lottieRef.current?.stop()

    }

  }, [isSpeaking])


  // ==========================================
  // EVALUATE INTERVIEW
  // ==========================================

  const evaluateInterview =
    async (transcript) => {

      try {

        if (
          !transcript ||
          transcript.length === 0
        ) {

          throw new Error(
            "No interview transcript was captured."
          )

        }


        setCallStatus(
          CallStatus.EVALUATING
        )

        setError(null)


        const {
          roadmapId,
          title,
          topics,
        } = interviewDataRef.current


        const response =
          await fetch(
            "/api/interviews/evaluate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                roadmapId,

                title,

                topics,

                transcript,

              }),

            }
          )


        const data =
          await response.json()


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Failed to evaluate interview."
          )

        }


        setResult(
          data.result
        )


        setCallStatus(
          CallStatus.COMPLETED
        )


      } catch (error) {

        console.error(
          "Interview evaluation error:",
          error
        )


        setError(
          error.message ||
          "Something went wrong while evaluating your interview."
        )


        setCallStatus(
          CallStatus.INACTIVE
        )

      }

    }


  // ==========================================
  // STORE FUNCTION IN REF
  // ==========================================

  const evaluateRef =
    useRef(evaluateInterview)


  useEffect(() => {

    evaluateRef.current =
      evaluateInterview

  })


  // ==========================================
  // VAPI EVENTS
  // ==========================================

  useEffect(() => {

    // ------------------------------------------
    // CALL START
    // ------------------------------------------

    const onCallStart = () => {

      setCallStatus(
        CallStatus.ACTIVE
      )

      setIsMuted(false)

      setIsSpeaking(false)

      setError(null)

    }


    // ------------------------------------------
    // CALL END
    // ------------------------------------------

    const onCallEnd = async () => {

      setIsSpeaking(false)

      setIsMuted(false)


      const transcript =
        transcriptRef.current


      if (
        !transcript ||
        transcript.length === 0
      ) {

        setError(
          "No interview transcript was captured."
        )

        setCallStatus(
          CallStatus.INACTIVE
        )

        return

      }


      await evaluateRef.current(
        transcript
      )

    }


    // ------------------------------------------
    // TRANSCRIPT
    // ------------------------------------------

    const onMessage = (message) => {

      if (
        message.type === "transcript" &&
        message.transcriptType === "final"
      ) {

        const text =
          message.transcript?.trim()


        if (!text) {
          return
        }


        const transcriptItem = {

          role:
            message.role,

          text,

        }


        transcriptRef.current = [
          ...transcriptRef.current,
          transcriptItem,
        ]


        console.log(
          "Transcript:",
          transcriptItem
        )

      }

    }


    // ------------------------------------------
    // ERROR
    // ------------------------------------------

    const onError = (error) => {

      console.error(
        "Vapi error:",
        error
      )


      setError(
        "Something went wrong with the interview. Please try again."
      )


      setCallStatus(
        CallStatus.INACTIVE
      )

      setIsSpeaking(false)

      setIsMuted(false)

    }


    // ------------------------------------------
    // SPEECH START
    // ------------------------------------------

    const onSpeechStart = () => {

      setIsSpeaking(true)

    }


    // ------------------------------------------
    // SPEECH END
    // ------------------------------------------

    const onSpeechEnd = () => {

      setIsSpeaking(false)

    }


    // ==========================================
    // REGISTER
    // ==========================================

    vapi.on(
      "call-start",
      onCallStart
    )

    vapi.on(
      "call-end",
      onCallEnd
    )

    vapi.on(
      "message",
      onMessage
    )

    vapi.on(
      "error",
      onError
    )

    vapi.on(
      "speech-start",
      onSpeechStart
    )

    vapi.on(
      "speech-end",
      onSpeechEnd
    )


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      vapi.off(
        "call-start",
        onCallStart
      )

      vapi.off(
        "call-end",
        onCallEnd
      )

      vapi.off(
        "message",
        onMessage
      )

      vapi.off(
        "error",
        onError
      )

      vapi.off(
        "speech-start",
        onSpeechStart
      )

      vapi.off(
        "speech-end",
        onSpeechEnd
      )

    }

  }, [])


  // ==========================================
  // START INTERVIEW
  // ==========================================

  const handleCall =
    async () => {

      try {

        setError(null)

        setResult(null)

        setIsMuted(false)

        setIsSpeaking(false)


        // Clear previous interview

        transcriptRef.current = []


        setCallStatus(
          CallStatus.CONNECTING
        )


        // ======================================
        // ASSISTANT VARIABLES
        // ======================================

        const assistantOverrides = {

          variableValues: {

            career:
              title ||
              "Career",

            experience:
              "Not specified",

            goal:
              "Improve career readiness",

            skills:
              "Not specified",

            topics:
              topics?.length
                ? topics.join(", ")
                : "General career knowledge",

          },


          clientMessages: [
            "transcript",
          ],


          serverMessages: [],

        }


        // ======================================
        // START VAPI
        // ======================================

        await vapi.start(

          configureAssistant2(
            "female",
            "friendly"
          ),

          assistantOverrides

        )


      } catch (error) {

        console.error(
          "Start interview error:",
          error
        )


        setError(
          "Unable to start the interview. Please check your microphone and try again."
        )


        setCallStatus(
          CallStatus.INACTIVE
        )

        setIsSpeaking(false)

      }

    }


  // ==========================================
  // END INTERVIEW
  // ==========================================

  const handleEndCall = () => {

    if (
      callStatus !==
      CallStatus.ACTIVE
    ) {
      return
    }


    setCallStatus(
      CallStatus.FINISH
    )


    setIsSpeaking(false)


    vapi.stop()

  }


  // ==========================================
  // MICROPHONE
  // ==========================================

  const toggleMicrophone = () => {

    if (
      callStatus !==
      CallStatus.ACTIVE
    ) {
      return
    }


    const muted =
      vapi.isMuted()


    vapi.setMuted(
      !muted
    )


    setIsMuted(
      !muted
    )

  }


  // ==========================================
  // RESET
  // ==========================================

  const resetInterview = () => {

    transcriptRef.current = []

    setResult(null)

    setError(null)

    setIsMuted(false)

    setIsSpeaking(false)

    setCallStatus(
      CallStatus.INACTIVE
    )

  }


  // ==========================================
  // RESULT SCREEN
  // ==========================================

  if (
    callStatus ===
      CallStatus.COMPLETED &&
    result
  ) {

    return (

      <InterviewResult
        result={result}
        onRetry={resetInterview}
      />

    )

  }


  // ==========================================
  // EVALUATING SCREEN
  // ==========================================

  if (
    callStatus ===
    CallStatus.EVALUATING
  ) {

    return (

      <EvaluatingInterview />

    )

  }


  // ==========================================
  // MAIN INTERVIEW UI
  // ==========================================

  return (

    <div className="w-full">

      <div className="overflow-hidden rounded-2xl border border-border bg-card">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="border-b border-border px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-muted-foreground">
                AI Interview Session
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-tight">
                Your AI Interviewer
              </h1>

            </div>


            {/* STATUS */}

            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">

              <span
                className={`
                  size-2 rounded-full

                  ${
                    callStatus ===
                    CallStatus.ACTIVE

                      ? "animate-pulse bg-primary"

                      : callStatus ===
                          CallStatus.CONNECTING

                        ? "animate-pulse bg-primary/50"

                        : "bg-muted-foreground"
                  }
                `}
              />


              {
                callStatus ===
                CallStatus.ACTIVE

                  ? "Live"

                  : callStatus ===
                      CallStatus.CONNECTING

                    ? "Connecting"

                    : callStatus ===
                        CallStatus.FINISH

                      ? "Finishing"

                      : "Ready"
              }

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* VOICE VISUALIZER */}
        {/* ================================= */}

        <div className="flex flex-col items-center justify-center px-6 py-10">

          <div className="relative flex size-52 items-center justify-center">


            {/* GLOW */}

            {isSpeaking && (

              <>

                <div className="absolute size-44 animate-ping rounded-full bg-primary/10" />

                <div className="absolute size-36 rounded-full bg-primary/10 blur-2xl" />

              </>

            )}


            {/* LOTTIE */}

            <div
              className={`
                relative z-10
                flex size-36
                items-center justify-center
                overflow-hidden
                rounded-full
                border
                bg-background
                shadow-lg
                transition-all
                duration-500

                ${
                  isSpeaking
                    ? "scale-110 border-primary/40"
                    : "scale-100"
                }
              `}
            >

              <Lottie
                lottieRef={
                  lottieRef
                }
                src={
                  sounds
                }
                autoplay={false}
                loop
                className="size-full"
              />

            </div>

          </div>


          {/* ================================= */}
          {/* VOICE STATE */}
          {/* ================================= */}

          <div className="mt-2 text-center">

            <h2 className="text-lg font-semibold">

              {
                callStatus ===
                CallStatus.CONNECTING

                  ? "Connecting to your interviewer..."

                  : callStatus ===
                      CallStatus.FINISH

                    ? "Finishing interview..."

                    : isSpeaking

                      ? "Interviewer is speaking"

                      : callStatus ===
                          CallStatus.ACTIVE

                        ? isMuted

                          ? "Microphone muted"

                          : "Listening to your answer..."

                        : "Ready for your interview"
              }

            </h2>


            <p className="mt-1 max-w-md text-sm text-muted-foreground">

              {
                callStatus ===
                CallStatus.ACTIVE

                  ? isSpeaking

                    ? "Listen carefully to the question."

                    : isMuted

                      ? "Unmute your microphone when you're ready to answer."

                      : "Answer naturally and explain your reasoning."

                  : "Start the session when you're ready to begin."
              }

            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* INTERVIEW INFO */}
        {/* ================================= */}

        <div className="grid gap-3 border-y border-border bg-muted/30 p-4 sm:grid-cols-2">


          {/* CAREER */}

          <div className="rounded-xl bg-background p-4">

            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Interview
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {title}
            </p>

          </div>


          {/* TOPICS */}

          <div className="rounded-xl bg-background p-4">

            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Topics
            </p>

            <p className="mt-1 truncate text-sm font-semibold">

              {
                topics?.length
                  ? `${topics.length} learning topics`
                  : "General"
              }

            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (

          <div className="mx-6 mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">

            {error}

          </div>

        )}


        {/* ================================= */}
        {/* CONTROLS */}
        {/* ================================= */}

        <div className="flex items-center justify-center gap-3 px-6 py-6">


          {/* START / END */}

          <Button
            size="lg"
            className="min-w-44 rounded-xl"
            onClick={
              callStatus ===
              CallStatus.ACTIVE

                ? handleEndCall

                : handleCall
            }
            disabled={
              callStatus ===
                CallStatus.CONNECTING ||

              callStatus ===
                CallStatus.FINISH
            }
          >

            {
              callStatus ===
              CallStatus.CONNECTING

                ? "Connecting..."

                : callStatus ===
                    CallStatus.ACTIVE

                  ? (
                    <>
                      <PhoneOff className="size-4" />
                      End Interview
                    </>
                  )

                  : callStatus ===
                      CallStatus.FINISH

                    ? "Finishing..."

                    : (
                      <>
                        <Mic className="size-4" />
                        Start Interview
                      </>
                    )
            }

          </Button>


          {/* MICROPHONE */}

          <Button
            size="lg"
            variant="outline"
            className="size-11 rounded-xl p-0"
            onClick={
              toggleMicrophone
            }
            disabled={
              callStatus !==
              CallStatus.ACTIVE
            }
          >

            {isMuted ? (

              <MicOff className="size-5" />

            ) : (

              <Mic className="size-5" />

            )}

          </Button>

        </div>

      </div>

    </div>

  )
}
