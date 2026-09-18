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
    // FETCH ALL DASHBOARD DATA IN PARALLEL
    // ==========================================

    const [
      careerResponse,
      roadmapResponse,
      progressResponse,
      assessmentResponse,
      interviewResponse,
    ] = await Promise.all([

      // ----------------------------------------
      // CAREER GOALS
      // ----------------------------------------

      supabase
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
        ),


      // ----------------------------------------
      // ROADMAPS
      // ----------------------------------------

      supabase
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
        ),


      // ----------------------------------------
      // ROADMAP PROGRESS
      // ----------------------------------------

      supabase
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
        ),


      // ----------------------------------------
      // ASSESSMENTS
      // ----------------------------------------

      supabase
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
        ),


      // ----------------------------------------
      // INTERVIEWS
      // ----------------------------------------

      supabase
        .from("interview_results")
        .select(`
          id,
          career_goal_id,
          technical_score,
          problem_solving_score,
          communication_score,
          practical_reasoning_score,
          total_score,
          feedback,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),

    ])


    // ==========================================
    // HANDLE QUERY ERRORS
    // ==========================================

    if (careerResponse.error) {

      console.error(
        "Career goals error:",
        careerResponse.error
      )

      throw careerResponse.error

    }


    if (roadmapResponse.error) {

      console.error(
        "Roadmaps error:",
        roadmapResponse.error
      )

      throw roadmapResponse.error

    }


    if (progressResponse.error) {

      console.error(
        "Roadmap progress error:",
        progressResponse.error
      )

      throw progressResponse.error

    }


    if (assessmentResponse.error) {

      console.error(
        "Assessment results error:",
        assessmentResponse.error
      )

      throw assessmentResponse.error

    }


    if (interviewResponse.error) {

      console.error(
        "Interview results error:",
        interviewResponse.error
      )

      throw interviewResponse.error

    }


    // ==========================================
    // NORMALIZE DATA
    // ==========================================

    const careerGoals =
      careerResponse.data ?? []


    const roadmaps =
      roadmapResponse.data ?? []


    const topicProgress =
      progressResponse.data ?? []


    const assessmentResults =
      assessmentResponse.data ?? []


    const interviewResults =
      interviewResponse.data ?? []


    // ==========================================
    // BUILD CAREER DASHBOARD DATA
    // ==========================================

    const careers =
      careerGoals.map((career) => {


        // ======================================
        // ROADMAP
        // ======================================

        const roadmap =
          roadmaps.find(
            (item) =>
              item.career_goal_id ===
              career.id
          ) || null


        // ======================================
        // ROADMAP PROGRESS ITEMS
        // ======================================

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


        // ======================================
        // ROADMAP MODULES
        // ======================================

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


        // ======================================
        // COMPLETED TOPIC IDS
        // ======================================

        const completedTopicIds =
          new Set(
            completedTopics.map(
              (item) =>
                item.topic_id
            )
          )


        // ======================================
        // NEXT TOPIC
        // ======================================

        const nextTopic =
          allTopics.find(
            (topic) =>
              !completedTopicIds.has(
                topic.id
              )
          ) || null


        // ======================================
        // LATEST ASSESSMENT
        // ======================================

        // Results are already ordered newest first,
        // so find() gives the latest result.

        const assessment =
          assessmentResults.find(
            (item) =>
              item.career_goal_id ===
              career.id
          ) || null


        // ======================================
        // ASSESSMENT HISTORY
        // ======================================

        const assessmentHistory =
          assessmentResults.filter(
            (item) =>
              item.career_goal_id ===
              career.id
          )


        // ======================================
        // ASSESSMENT PERCENTAGE
        // ======================================

        const assessmentPercentage =
          assessment
            ? Math.round(
                (
                  assessment.total_score /
                  30
                ) * 100
              )
            : 0


        // ======================================
        // LATEST INTERVIEW
        // ======================================

        // Results are ordered newest first,
        // so find() gives latest interview.

        const interview =
          interviewResults.find(
            (item) =>
              item.career_goal_id ===
              career.id
          ) || null


        // ======================================
        // INTERVIEW HISTORY
        // ======================================

        const interviewHistory =
          interviewResults.filter(
            (item) =>
              item.career_goal_id ===
              career.id
          )


        // ======================================
        // INTERVIEW SCORE
        // ======================================

        // Interview is already scored /100.

        const interviewPercentage =
          interview?.total_score ?? 0


        // ======================================
        // ROADMAP PERCENTAGE
        // ======================================

        const roadmapProgress =
          roadmap?.progress ??
          career.progress ??
          0


        // ======================================
        // READINESS SCORE
        // ======================================
        //
        // Learning   = 40%
        // Assessment = 30%
        // Interview  = 30%
        //
        // This is a product-defined readiness
        // indicator based on available evidence.
        // ======================================

        const readinessScore =
          Math.round(
            roadmapProgress * 0.4 +
            assessmentPercentage * 0.3 +
            interviewPercentage * 0.3
          )


        // ======================================
        // DEMONSTRATED SKILLS
        // ======================================

        const demonstratedSkills =
          Array.isArray(
            interview?.feedback
              ?.demonstratedSkills
          )
            ? interview.feedback
                .demonstratedSkills
            : []


        // ======================================
        // NEXT ACTION
        // ======================================

        let nextAction = null


        // --------------------------------------
        // NO ROADMAP
        // --------------------------------------

        if (!roadmap) {

          nextAction = {

            type:
              "roadmap",

            title:
              "Create Your Roadmap",

            description:
              `Generate your ${career.title} learning roadmap.`,

            href:
              "/roadmap",

          }

        }


        // --------------------------------------
        // LEARNING NOT COMPLETE
        // --------------------------------------

        else if (
          roadmapProgress < 100
        ) {

          nextAction = {

            type:
              "learning",

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


        // --------------------------------------
        // NO ASSESSMENT
        // --------------------------------------

        else if (!assessment) {

          nextAction = {

            type:
              "assessment",

            title:
              "Verify Your Skills",

            description:
              "Complete your career assessment.",

            href:
              "/assessment",

          }

        }


        // --------------------------------------
        // NO INTERVIEW
        // --------------------------------------

        else if (!interview) {

          nextAction = {

            type:
              "interview",

            title:
              "Practice Your Interview",

            description:
              `Complete your ${career.title} AI interview.`,

            href:
              "/interview/practice",

          }

        }


        // --------------------------------------
        // EVERYTHING COMPLETED
        // --------------------------------------

        else {

          nextAction = {

            type:
              "profile",

            title:
              "Review Your Career Readiness",

            description:
              "Review your verified learning, assessment, and interview evidence.",

            href:
              "/home",

          }

        }


        // ======================================
        // RETURN CAREER
        // ======================================

        return {

          // ------------------------------------
          // CAREER
          // ------------------------------------

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

                  createdAt:
                    roadmap.created_at,

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
          // ASSESSMENT HISTORY INFO
          // ====================================

          assessmentStats: {

            attempts:
              assessmentHistory.length,

          },


          // ====================================
          // INTERVIEW
          // ====================================

          interview:
            interview
              ? {

                  id:
                    interview.id,

                  technicalScore:
                    interview.technical_score,

                  problemSolvingScore:
                    interview.problem_solving_score,

                  communicationScore:
                    interview.communication_score,

                  practicalReasoningScore:
                    interview.practical_reasoning_score,

                  totalScore:
                    interview.total_score,

                  percentage:
                    interviewPercentage,

                  feedback:
                    interview.feedback,

                  demonstratedSkills,

                  createdAt:
                    interview.created_at,

                }
              : null,


          // ====================================
          // INTERVIEW HISTORY INFO
          // ====================================

          interviewStats: {

            attempts:
              interviewHistory.length,

          },


          // ====================================
          // EVIDENCE
          // ====================================

          evidence: {

            claimedSkills:
              career.skills ?? [],

            demonstratedSkills,

            roadmapCompleted:
              roadmapProgress === 100,

            assessmentCompleted:
              Boolean(assessment),

            interviewCompleted:
              Boolean(interview),

          },


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
              interviewPercentage,

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
    // INTERVIEW STATS
    // ==========================================

    const interviewsTaken =
      interviewResults.length


    const averageInterviewScore =
      interviewsTaken > 0
        ? Math.round(
            interviewResults.reduce(
              (total, interview) =>
                total +
                interview.total_score,
              0
            ) /
            interviewsTaken
          )
        : 0


    // ==========================================
    // VERIFIED / DEMONSTRATED SKILLS
    // ==========================================

    const allDemonstratedSkills =
      [
        ...new Set(

          interviewResults.flatMap(
            (interview) => {

              const skills =
                interview.feedback
                  ?.demonstratedSkills

              return Array.isArray(
                skills
              )
                ? skills
                : []

            }
          )

        ),
      ]


    // ==========================================
    // RESPONSE
    // ==========================================

    return Response.json({

      success: true,


      // ========================================
      // OVERVIEW
      // ========================================

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

        interviewsTaken,

        averageInterviewScore,

        demonstratedSkills:
          allDemonstratedSkills.length,

      },


      // ========================================
      // CAREERS
      // ========================================

      careers,

    })


  } catch (error) {

    // ==========================================
    // ERROR
    // ==========================================

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