"use client"

import { useState } from "react"

import {
  Check,
  ChevronDown,
  Clock3,
  Lock,
  Target,
} from "lucide-react"


export default function RoadmapContent({
  modules,
  selectedTopic,
  setSelectedTopic,
  completedTopics = [],
  sessionActive = false,
}) {

  // --------------------------------------------------
  // First module open by default
  // --------------------------------------------------

  const [openModules, setOpenModules] = useState(() => {
    return modules?.[0]?.id
      ? [modules[0].id]
      : []
  })


  // --------------------------------------------------
  // Toggle module
  // --------------------------------------------------

  const toggleModule = (moduleId) => {

    setOpenModules((previous) => {

      const isOpen =
        previous.includes(moduleId)


      if (isOpen) {

        return previous.filter(
          (id) => id !== moduleId
        )

      }


      return [
        ...previous,
        moduleId,
      ]

    })

  }


  // --------------------------------------------------
  // Select topic
  // --------------------------------------------------

  const handleTopicSelect = (topic) => {

    // Prevent changing topic while AI session is active
    if (sessionActive) {
      return
    }


    setSelectedTopic(topic)

  }


  return (

    <section className="overflow-hidden rounded-2xl border border-border bg-card">


      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="border-b border-border px-5 py-4">


        <div className="flex items-center justify-between gap-3">


          <div className="flex items-center gap-2">

            <Target className="size-4 text-primary" />


            <h2 className="text-sm font-semibold text-card-foreground">
              Learning Roadmap
            </h2>

          </div>


          {/* Session lock indicator */}

          {sessionActive && (

            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">

              <Lock className="size-3" />

              Topic locked

            </div>

          )}


        </div>


        <p className="mt-1 text-xs text-muted-foreground">

          {sessionActive
            ? "End your current voice session to switch topics."
            : "Select a topic to start learning."
          }

        </p>


      </div>


      {/* ============================================= */}
      {/* MODULES */}
      {/* ============================================= */}

      <div className="space-y-3 p-4">


        {modules.map((module, moduleIndex) => {


          const isOpen =
            openModules.includes(module.id)


          const completedCount =
            module.topics.filter(
              (topic) =>
                completedTopics.includes(topic.id)
            ).length


          return (

            <div
              key={module.id}
              className="overflow-hidden rounded-xl border border-border"
            >


              {/* ================================= */}
              {/* MODULE HEADER */}
              {/* ================================= */}

              <button
                type="button"
                onClick={() =>
                  toggleModule(module.id)
                }
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/50"
              >


                {/* Module number */}

                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">

                  {moduleIndex + 1}

                </div>


                {/* Module information */}

                <div className="min-w-0 flex-1">


                  <h3 className="truncate text-sm font-semibold text-card-foreground">

                    {module.title}

                  </h3>


                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">


                    {/* Duration */}

                    <span className="flex items-center gap-1">

                      <Clock3 className="size-3" />

                      {module.estimatedHours}h

                    </span>


                    {/* Completed topics */}

                    <span>

                      {completedCount}/
                      {module.topics.length} completed

                    </span>


                  </div>


                </div>


                {/* Dropdown */}

                <ChevronDown
                  className={`
                    size-4 shrink-0
                    text-muted-foreground
                    transition-transform
                    duration-300

                    ${
                      isOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  `}
                />


              </button>


              {/* ================================= */}
              {/* TOPIC DROPDOWN */}
              {/* ================================= */}

              <div
                className={`
                  grid
                  transition-all
                  duration-300
                  ease-in-out

                  ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >


                <div className="overflow-hidden">


                  <div className="border-t border-border px-3 py-2">


                    <div className="space-y-1">


                      {module.topics.map((topic) => {


                        const completed =
                          completedTopics.includes(
                            topic.id
                          )


                        const selected =
                          selectedTopic?.id ===
                          topic.id


                        // Other topics are locked.
                        // Current topic remains visually active.
                        const locked =
                          sessionActive &&
                          !selected


                        return (

                          <button
                            type="button"
                            key={topic.id}

                            disabled={locked}

                            onClick={() =>
                              handleTopicSelect(topic)
                            }

                            className={`
                              group flex w-full
                              items-center gap-2.5
                              rounded-lg border
                              px-3 py-3
                              text-left
                              transition-all
                              duration-200

                              ${
                                locked
                                  ? "cursor-not-allowed opacity-40"
                                  : "cursor-pointer"
                              }

                              ${
                                selected
                                  ? "border-primary bg-primary/5"
                                  : locked
                                    ? "border-transparent"
                                    : "border-transparent hover:bg-secondary/60"
                              }
                            `}
                          >


                            {/* ============================= */}
                            {/* STATUS */}
                            {/* ============================= */}

                            <div
                              className={`
                                flex size-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                transition-all

                                ${
                                  completed
                                    ? "bg-primary text-primary-foreground"

                                    : selected
                                      ? "border-2 border-primary"

                                      : "border border-border"
                                }
                              `}
                            >


                              {completed && (

                                <Check className="size-3" />

                              )}


                            </div>


                            {/* ============================= */}
                            {/* TOPIC */}
                            {/* ============================= */}

                            <div className="min-w-0 flex-1">


                              <div className="flex items-center gap-2">


                                <p className="truncate text-xs font-medium text-card-foreground">

                                  {topic.title}

                                </p>


                                {/* Show lock */}

                                {locked && (

                                  <Lock className="size-3 shrink-0 text-muted-foreground" />

                                )}


                              </div>


                              <p className="mt-0.5 text-[11px] text-muted-foreground">

                                {topic.estimatedMinutes} min

                              </p>


                            </div>


                            {/* Active session */}

                            {selected &&
                              sessionActive && (

                                <span className="shrink-0 text-[10px] font-medium text-primary">

                                  Active

                                </span>

                              )}


                          </button>

                        )

                      })}


                    </div>


                  </div>


                </div>


              </div>


            </div>

          )

        })}


      </div>


    </section>

  )

}