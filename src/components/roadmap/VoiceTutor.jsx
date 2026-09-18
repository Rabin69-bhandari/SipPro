"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import { Mic, MicOff } from "lucide-react"
import { Lottie } from "lottie-react"

import vapi from "@/lib/vapi/vapi"
import { configureAssistant } from "@/lib/utils"

import sounds from "@/constant/sounds.json"

import { Button } from "@/components/ui/button"


const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISH: "FINISH",
}


export default function VoiceTutor({
  roadmap,
  selectedTopic,

  sessionActive,
  setSessionActive,

  onTopicCompleted,
}) {

  const [callStatus, setCallStatus] =
    useState(CallStatus.INACTIVE)

  const [isMuted, setIsMuted] =
    useState(false)

  const [isSpeaking, setIsSpeaking] =
    useState(false)

  const [savingProgress, setSavingProgress] =
    useState(false)


  const lottieRef = useRef(null)

  // Freeze the topic belonging to the current call
  const activeTopicRef = useRef(null)


  // =============================================
  // LOTTIE
  // =============================================

  useEffect(() => {

    if (isSpeaking) {
      lottieRef.current?.play()
    } else {
      lottieRef.current?.stop()
    }

  }, [isSpeaking])


  // =============================================
  // SAVE PROGRESS
  // =============================================

  const saveTopicProgress = async (topic) => {

    if (!topic || !roadmap?.id) return

    try {

      setSavingProgress(true)

      const response = await fetch(
        `/api/roadmaps/${roadmap.id}/progress`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            topicId: topic.id,
          }),
        }
      )


      const result = await response.json()


      if (!response.ok) {
        throw new Error(
          result.error ||
          "Failed to save topic progress"
        )
      }


      onTopicCompleted?.({
        topicId: topic.id,
        progress: result.progress,
      })


      console.log(
        "Topic progress saved:",
        result
      )

    } catch (error) {

      console.error(
        "Failed to save progress:",
        error
      )

    } finally {

      setSavingProgress(false)

    }
  }


  // =============================================
  // VAPI EVENTS
  // =============================================

  useEffect(() => {

    const onCallStart = () => {

      setCallStatus(
        CallStatus.ACTIVE
      )

      setSessionActive(true)

      setIsMuted(false)

      console.log(
        "Vapi call started"
      )
    }


    const onCallEnd = async () => {

      console.log(
        "Vapi call ended"
      )


      const completedTopic =
        activeTopicRef.current


      // UI state

      setCallStatus(
        CallStatus.FINISH
      )

      setSessionActive(false)

      setIsSpeaking(false)

      setIsMuted(false)


      // Save topic progress

      if (completedTopic) {

        await saveTopicProgress(
          completedTopic
        )

      }


      activeTopicRef.current = null


      // Return to ready state

      setCallStatus(
        CallStatus.INACTIVE
      )
    }


    const onMessage = (message) => {

      console.log(
        "Vapi message:",
        message
      )

    }


    const onError = (error) => {

      console.error(
        "Vapi error:",
        error
      )

      setCallStatus(
        CallStatus.INACTIVE
      )

      setSessionActive(false)

      setIsSpeaking(false)

      activeTopicRef.current = null
    }


    const onSpeechStart = () => {
      setIsSpeaking(true)
    }


    const onSpeechEnd = () => {
      setIsSpeaking(false)
    }


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

  }, [
    roadmap?.id,
    setSessionActive,
  ])


  // =============================================
  // START CALL
  // =============================================

  const handleCall = async () => {

    if (!selectedTopic) return


    // Freeze topic for this session

    activeTopicRef.current = {
      ...selectedTopic,
    }


    const assistantOverrides = {

      variableValues: {

        // Career context
        career:
          roadmap?.careerGoal?.title ||
          roadmap?.title,

        experience:
          roadmap?.careerGoal?.experience ||
          "Not specified",

        goal:
          roadmap?.careerGoal?.goal ||
          "Learn this topic",


        // Lesson context
        subject:
          roadmap?.title,

        topic:
          selectedTopic.title,

        topicDescription:
          selectedTopic.description,

        duration:
          `${selectedTopic.estimatedMinutes} minutes`,

        style: "friendly",
      },


      clientMessages: [
        "transcript",
      ],

      serverMessages: [],
    }


    try {

      setCallStatus(
        CallStatus.CONNECTING
      )


      await vapi.start(

        configureAssistant(
          "female",
          "friendly"
        ),

        assistantOverrides
      )


    } catch (error) {

      console.error(
        "Failed to start call:",
        error
      )


      activeTopicRef.current = null

      setCallStatus(
        CallStatus.INACTIVE
      )

      setSessionActive(false)
    }
  }


  // =============================================
  // END CALL
  // =============================================

  const handleDisCall = () => {

    if (
      callStatus !==
      CallStatus.ACTIVE
    ) {
      return
    }


    vapi.stop()

    setCallStatus(
      CallStatus.FINISH
    )
  }


  // =============================================
  // MICROPHONE
  // =============================================

  const toggleMicrophone = () => {

    const muted =
      vapi.isMuted()


    vapi.setMuted(
      !muted
    )


    setIsMuted(
      !muted
    )
  }


  // =============================================
  // NO TOPIC
  // =============================================

  if (!selectedTopic) {

    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-border bg-card">

        <p className="text-sm text-muted-foreground">
          Select a topic to begin.
        </p>

      </div>
    )
  }


  // =============================================
  // UI
  // =============================================

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
                AI Learning Session
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-tight">
                Your Voice Tutor
              </h1>

            </div>


            {/* Status */}

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


              {callStatus ===
              CallStatus.ACTIVE

                ? "Live"

                : callStatus ===
                    CallStatus.CONNECTING

                  ? "Connecting"

                  : callStatus ===
                      CallStatus.FINISH

                    ? "Finishing"

                    : "Ready"}

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* VISUALIZER */}
        {/* ================================= */}

        <div className="flex flex-col items-center justify-center px-6 py-8">

          <div className="relative flex size-52 items-center justify-center">


            {/* Glow */}

            {isSpeaking && (

              <>

                <div className="absolute size-44 animate-ping rounded-full bg-primary/10" />

                <div className="absolute size-36 rounded-full bg-primary/10 blur-2xl" />

              </>

            )}


            {/* Lottie */}

            <div
              className={`
                relative z-10 flex size-36
                items-center justify-center
                overflow-hidden rounded-full
                border bg-background shadow-lg
                transition-all duration-500

                ${
                  isSpeaking

                    ? "scale-110 border-primary/40"

                    : "scale-100"
                }
              `}
            >

              <Lottie
                lottieRef={lottieRef}
                src={sounds}
                autoplay={false}
                loop
                className="size-full"
              />

            </div>

          </div>


          {/* Status text */}

          <div className="mt-2 text-center">

            <h2 className="text-lg font-semibold">

              {callStatus ===
              CallStatus.CONNECTING

                ? "Connecting to your tutor..."

                : isSpeaking

                  ? "Your tutor is speaking"

                  : callStatus ===
                      CallStatus.ACTIVE

                    ? "Listening..."

                    : savingProgress

                      ? "Saving your progress..."

                      : "Ready to learn"}

            </h2>


            <p className="mt-1 text-sm text-muted-foreground">

              {callStatus ===
              CallStatus.ACTIVE

                ? "Speak naturally. Your tutor is listening."

                : "Start a session to begin your lesson."}

            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* LESSON INFO */}
        {/* ================================= */}

        <div className="grid grid-cols-3 gap-3 border-y border-border bg-muted/30 p-4">


          <div className="rounded-xl bg-background p-3">

            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Career
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {roadmap?.careerGoal?.title ||
                roadmap?.title}
            </p>

          </div>


          <div className="rounded-xl bg-background p-3">

            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Topic
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {selectedTopic.title}
            </p>

          </div>


          <div className="rounded-xl bg-background p-3">

            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Duration
            </p>

            <p className="mt-1 text-sm font-semibold">
              {selectedTopic.estimatedMinutes} min
            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* CONTROLS */}
        {/* ================================= */}

        <div className="flex items-center justify-center gap-3 px-6 py-6">

          <Button
            size="lg"
            className="min-w-40 rounded-xl"

            onClick={
              callStatus ===
              CallStatus.ACTIVE

                ? handleDisCall

                : handleCall
            }

            disabled={
              callStatus ===
                CallStatus.CONNECTING ||
              callStatus ===
                CallStatus.FINISH ||
              savingProgress
            }
          >

            {callStatus ===
            CallStatus.CONNECTING

              ? "Connecting..."

              : callStatus ===
                  CallStatus.ACTIVE

                ? "End Session"

                : callStatus ===
                    CallStatus.FINISH ||
                    savingProgress

                  ? "Finishing..."

                  : "Start Session"}

          </Button>


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