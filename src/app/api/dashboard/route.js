import { auth } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"


export async function GET() {

  try {

    // ==========================================
    // AUTH
    // ==========================================

    const { userId } = await auth()


    if (!userId) {

      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )

    }


    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // CAREER GOALS
    // ==========================================

    const {
      data: careerGoals,
      error: careerError,
    } = await supabase
      .from("career_goals")
      .select(`
        id,
        title,
        experience,
        goal,
        skills,
        hours_per_week,
        progress,
        created_at,
        updated_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )


    if (careerError) {
      throw careerError
    }


    // ==========================================
    // ROADMAPS
    // ==========================================

    const {
      data: roadmaps,
      error: roadmapError,
    } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        career_goal_id,
        roadmap_data,
        progress,
        created_at,
        updated_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )


    if (roadmapError) {
      throw roadmapError
    }


    // ==========================================
    // ROADMAP PROGRESS
    // ==========================================

    const {
      data: topicProgress,
      error: progressError,
    } = await supabase
      .from("roadmap_progress")
      .select(`
        id,
        roadmap_id,
        topic_id,
        status,
        started_at,
        completed_at,
        created_at,
        updated_at
      `)
      .order(
        "updated_at",
        {
          ascending: false,
        }
      )


    if (progressError) {
      throw progressError
    }


    // ==========================================
    // ASSESSMENT RESULTS
    // ==========================================

    const {
      data: assessmentResults,
      error: assessmentError,
    } = await supabase
      .from("assessment_results")
      .select(`
        id,
        career_goal_id,
        question_score,
        scenario_score,
        practical_score,
        total_score,
        status,
        feedback,
        created_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )


    if (assessmentError) {
      throw assessmentError
    }


    // ==========================================
    // BUILD CAREER DASHBOARD DATA
    // ==========================================

    const careers =
      careerGoals.map((career) => {

        // --------------------------------------
        // ROADMAP
        // --------------------------------------

        const roadmap =
          roadmaps.find(
            (item) =>
              item.career_goal_id ===
              career.id
          ) || null


        // --------------------------------------
        // TOPIC PROGRESS
        // --------------------------------------

        const progressItems =
          roadmap
            ? topicProgress.filter(
                (item) =>
                  item.roadmap_id ===
                  roadmap.id
              )
            : []


        const completedTopics =
          progressItems.filter(
            (item) =>
              item.status ===
              "completed"
          )


        // --------------------------------------
        // ROADMAP TOPICS
        // --------------------------------------

        const modules =
          roadmap?.roadmap_data
            ?.modules ?? []


        const allTopics =
          modules.flatMap(
            (module) =>
              module.topics ?? []
          )


        const totalTopics =
          allTopics.length


        const completedTopicIds =
          new Set(
            completedTopics.map(
              (item) =>
                item.topic_id
            )
          )


        // --------------------------------------
        // NEXT TOPIC
        // --------------------------------------

        const nextTopic =
          allTopics.find(
            (topic) =>
              !completedTopicIds.has(
                topic.id
              )
          ) || null


        // --------------------------------------
        // LATEST ASSESSMENT
        // --------------------------------------

        const assessment =
          assessmentResults.find(
            (item) =>
              item.career_goal_id ===
              career.id
          ) || null


        // --------------------------------------
        // ASSESSMENT %
        // --------------------------------------

        const assessmentPercentage =
          assessment
            ? Math.round(
                (
                  assessment.total_score /
                  30
                ) * 100
              )
            : 0


        // --------------------------------------
        // ROADMAP %
        // --------------------------------------

        const roadmapProgress =
          roadmap?.progress ??
          career.progress ??
          0


        // ======================================
        // READINESS
        // ======================================
        //
        // Temporary MVP formula.
        //
        // Currently:
        // Learning   = 60%
        // Assessment = 40%
        //
        // Later, when interview_results exists:
        //
        // Learning   = 40%
        // Assessment = 30%
        // Interview  = 30%
        //
        // ======================================

        const readinessScore =
          Math.round(
            roadmapProgress * 0.6 +
            assessmentPercentage * 0.4
          )


        // --------------------------------------
        // NEXT ACTION
        // --------------------------------------

        let nextAction = null


        if (!roadmap) {

          nextAction = {
            type: "roadmap",
            title:
              "Create Your Roadmap",

            description:
              `Generate your ${career.title} learning roadmap.`,

            href:
              "/roadmap",
          }

        }

        else if (
          roadmapProgress < 100
        ) {

          nextAction = {
            type: "learning",

            title:
              "Continue Learning",

            description:
              nextTopic
                ? `Continue with ${nextTopic.title}`
                : `Continue your ${career.title} roadmap`,

            href:
              `/roadmap/${roadmap.id}`,
          }

        }

        else if (!assessment) {

          nextAction = {
            type: "assessment",

            title:
              "Verify Your Skills",

            description:
              "Complete your career assessment.",

            href:
              "/assessment",
          }

        }

        else {

          nextAction = {
            type: "interview",

            title:
              "Practice Your Interview",

            description:
              `Practice a ${career.title} AI interview.`,

            href:
              "/interview/practice",
          }

        }


        // ======================================
        // RETURN CAREER
        // ======================================

        return {

          id:
            career.id,

          title:
            career.title,

          experience:
            career.experience,

          goal:
            career.goal,

          skills:
            career.skills ?? [],

          hoursPerWeek:
            career.hours_per_week,

          createdAt:
            career.created_at,


          // ====================================
          // ROADMAP
          // ====================================

          roadmap:
            roadmap
              ? {

                  id:
                    roadmap.id,

                  title:
                    roadmap.roadmap_data
                      ?.title ??
                    career.title,

                  description:
                    roadmap.roadmap_data
                      ?.description ??
                    "",

                  progress:
                    roadmapProgress,

                  totalTopics,

                  completedTopics:
                    completedTopics.length,

                  nextTopic,

                  modules,

                }
              : null,


          // ====================================
          // ASSESSMENT
          // ====================================

          assessment:
            assessment
              ? {

                  id:
                    assessment.id,

                  questionScore:
                    assessment.question_score,

                  scenarioScore:
                    assessment.scenario_score,

                  practicalScore:
                    assessment.practical_score,

                  totalScore:
                    assessment.total_score,

                  percentage:
                    assessmentPercentage,

                  status:
                    assessment.status,

                  feedback:
                    assessment.feedback,

                  createdAt:
                    assessment.created_at,

                }
              : null,


          // ====================================
          // READINESS
          // ====================================

          readiness: {

            score:
              readinessScore,

            learning:
              roadmapProgress,

            assessment:
              assessmentPercentage,

            interview:
              null,

          },


          // ====================================
          // NEXT ACTION
          // ====================================

          nextAction,

        }

      })


    // ==========================================
    // OVERALL STATS
    // ==========================================

    const totalCompletedTopics =
      topicProgress.filter(
        (item) =>
          item.status ===
          "completed"
      ).length


    const passedAssessments =
      assessmentResults.filter(
        (item) =>
          item.status ===
          "passed"
      ).length


    // ==========================================
    // RESPONSE
    // ==========================================

    return Response.json({

      success: true,

      overview: {

        totalCareers:
          careerGoals.length,

        totalRoadmaps:
          roadmaps.length,

        completedTopics:
          totalCompletedTopics,

        assessmentsTaken:
          assessmentResults.length,

        assessmentsPassed:
          passedAssessments,

      },

      careers,

    })


  } catch (error) {

    console.error(
      "Dashboard API error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to load dashboard",
      },
      {
        status: 500,
      }
    )

  }

}