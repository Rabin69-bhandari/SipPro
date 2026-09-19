import { auth, currentUser } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"


export async function GET() {

  try {

    // ==========================================
    // AUTH
    // ==========================================

    const { userId } =
      await auth()


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


    // ==========================================
    // CLERK USER
    // ==========================================

    const user =
      await currentUser()


    // ==========================================
    // SUPABASE
    // ==========================================

    const supabase =
      createServerSupabaseClient()


    // ==========================================
    // FETCH ALL CV DATA
    // ==========================================

    const [
      profileResult,
      careerGoalsResult,
      roadmapsResult,
      progressResult,
      assessmentsResult,
      interviewsResult,
    ] = await Promise.all([


      // ------------------------------------------
      // CV PROFILE
      // ------------------------------------------

      supabase
        .from("cv_profiles")
        .select(`
          id,
          phone,
          location,
          linkedin_url,
          github_url,
          portfolio_url,
          education,
          experience,
          projects,
          certifications,
          created_at,
          updated_at
        `)
        .maybeSingle(),


      // ------------------------------------------
      // CAREER GOALS
      // ------------------------------------------

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


      // ------------------------------------------
      // ROADMAPS
      // ------------------------------------------

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


      // ------------------------------------------
      // ROADMAP PROGRESS
      // ------------------------------------------

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
          "created_at",
          {
            ascending: false,
          }
        ),


      // ------------------------------------------
      // ASSESSMENTS
      // ------------------------------------------

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


      // ------------------------------------------
      // INTERVIEWS
      // ------------------------------------------

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
    // CHECK DATABASE ERRORS
    // ==========================================

    if (profileResult.error) {

      throw new Error(
        profileResult.error.message
      )

    }


    if (careerGoalsResult.error) {

      throw new Error(
        careerGoalsResult.error.message
      )

    }


    if (roadmapsResult.error) {

      throw new Error(
        roadmapsResult.error.message
      )

    }


    if (progressResult.error) {

      throw new Error(
        progressResult.error.message
      )

    }


    if (assessmentsResult.error) {

      throw new Error(
        assessmentsResult.error.message
      )

    }


    if (interviewsResult.error) {

      throw new Error(
        interviewsResult.error.message
      )

    }


    // ==========================================
    // NORMALIZE
    // ==========================================

    const careerGoals =
      careerGoalsResult.data ?? []


    const roadmaps =
      roadmapsResult.data ?? []


    const progressRows =
      progressResult.data ?? []


    const assessments =
      assessmentsResult.data ?? []


    const interviews =
      interviewsResult.data ?? []


    // ==========================================
    // CLERK PROFILE
    // ==========================================

    const fullName =
      [
        user?.firstName,
        user?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()


    const email =
      user?.primaryEmailAddress
        ?.emailAddress ?? ""


    const imageUrl =
      user?.imageUrl ?? null


    // ==========================================
    // CV PROFILE
    // ==========================================

    const profile = {

      fullName,

      email,

      imageUrl,

      phone:
        profileResult.data?.phone ??
        "",

      location:
        profileResult.data?.location ??
        "",

      linkedinUrl:
        profileResult.data
          ?.linkedin_url ?? "",

      githubUrl:
        profileResult.data
          ?.github_url ?? "",

      portfolioUrl:
        profileResult.data
          ?.portfolio_url ?? "",

      education:
        profileResult.data
          ?.education ?? [],

      experience:
        profileResult.data
          ?.experience ?? [],

      projects:
        profileResult.data
          ?.projects ?? [],

      certifications:
        profileResult.data
          ?.certifications ?? [],

    }


    // ==========================================
    // BUILD CAREER CV DATA
    // ==========================================

    const careers =
      careerGoals.map(
        (career) => {

          // ======================================
          // ROADMAP
          // ======================================

          const roadmap =
            roadmaps.find(
              (item) =>
                item.career_goal_id ===
                career.id
            ) ?? null


          // ======================================
          // ROADMAP TOPICS
          // ======================================

          const modules =
            roadmap?.roadmap_data
              ?.modules ?? []


          const allTopics =
            modules.flatMap(
              (module) =>
                module.topics ?? []
            )


          const roadmapProgressRows =
            roadmap
              ? progressRows.filter(
                  (item) =>
                    item.roadmap_id ===
                    roadmap.id
                )
              : []


          const completedRows =
            roadmapProgressRows.filter(
              (item) =>
                item.status ===
                "completed"
            )


          const completedTopicIds =
            new Set(
              completedRows.map(
                (item) =>
                  item.topic_id
              )
            )


          const completedTopics =
            allTopics
              .filter(
                (topic) =>
                  completedTopicIds.has(
                    topic.id
                  )
              )
              .map(
                (topic) => ({
                  id:
                    topic.id,

                  title:
                    topic.title,

                  description:
                    topic.description ??
                    "",
                })
              )


          const totalTopics =
            allTopics.length


          const completedTopicsCount =
            completedTopics.length


          const learningProgress =
            roadmap?.progress ??
            career.progress ??
            0


          // ======================================
          // LATEST ASSESSMENT
          // ======================================

          const assessment =
            assessments.find(
              (item) =>
                item.career_goal_id ===
                career.id
            ) ?? null


          const assessmentAttempts =
            assessments.filter(
              (item) =>
                item.career_goal_id ===
                career.id
            ).length


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

          const interview =
            interviews.find(
              (item) =>
                item.career_goal_id ===
                career.id
            ) ?? null


          const interviewAttempts =
            interviews.filter(
              (item) =>
                item.career_goal_id ===
                career.id
            ).length


          const interviewPercentage =
            interview?.total_score ??
            0


          // ======================================
          // DEMONSTRATED SKILLS
          // ======================================

          const demonstratedSkills =
            Array.isArray(
              interview
                ?.feedback
                ?.demonstratedSkills
            )
              ? interview.feedback
                  .demonstratedSkills
              : []


          // ======================================
          // CLAIMED SKILLS
          // ======================================

          const claimedSkills =
            Array.isArray(
              career.skills
            )
              ? career.skills
              : []


          // ======================================
          // ADDITIONAL SKILLS
          // ======================================

          const demonstratedSet =
            new Set(
              demonstratedSkills.map(
                (skill) =>
                  String(skill)
                    .trim()
                    .toLowerCase()
              )
            )


          const additionalSkills =
            claimedSkills.filter(
              (skill) =>
                !demonstratedSet.has(
                  String(skill)
                    .trim()
                    .toLowerCase()
                )
            )


          // ======================================
          // READINESS
          // Same formula as dashboard
          // ======================================

          const readinessScore =
            Math.round(
              learningProgress *
                0.4 +

              assessmentPercentage *
                0.3 +

              interviewPercentage *
                0.3
            )


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

            hoursPerWeek:
              career.hours_per_week,


            // ====================================
            // SKILLS
            // ====================================

            skills: {

              claimed:
                claimedSkills,

              demonstrated:
                demonstratedSkills,

              additional:
                additionalSkills,

            },


            // ====================================
            // LEARNING EVIDENCE
            // ====================================

            learning: {

              roadmapId:
                roadmap?.id ??
                null,

              roadmapTitle:
                roadmap
                  ?.roadmap_data
                  ?.title ??
                career.title,

              progress:
                learningProgress,

              completedTopics:
                completedTopicsCount,

              totalTopics,

              topics:
                completedTopics,

            },


            // ====================================
            // ASSESSMENT EVIDENCE
            // ====================================

            assessment:
              assessment
                ? {

                    id:
                      assessment.id,

                    questionScore:
                      assessment
                        .question_score,

                    scenarioScore:
                      assessment
                        .scenario_score,

                    practicalScore:
                      assessment
                        .practical_score,

                    totalScore:
                      assessment
                        .total_score,

                    maxScore:
                      30,

                    percentage:
                      assessmentPercentage,

                    status:
                      assessment.status,

                    feedback:
                      assessment.feedback,

                    attempts:
                      assessmentAttempts,

                    createdAt:
                      assessment
                        .created_at,

                  }
                : null,


            // ====================================
            // INTERVIEW EVIDENCE
            // ====================================

            interview:
              interview
                ? {

                    id:
                      interview.id,

                    technicalScore:
                      interview
                        .technical_score,

                    problemSolvingScore:
                      interview
                        .problem_solving_score,

                    communicationScore:
                      interview
                        .communication_score,

                    practicalReasoningScore:
                      interview
                        .practical_reasoning_score,

                    totalScore:
                      interview
                        .total_score,

                    maxScore:
                      100,

                    feedback:
                      interview.feedback,

                    demonstratedSkills,

                    attempts:
                      interviewAttempts,

                    createdAt:
                      interview
                        .created_at,

                  }
                : null,


            // ====================================
            // CAREER READINESS
            // ====================================

            readiness: {

              score:
                readinessScore,

              learning:
                learningProgress,

              assessment:
                assessmentPercentage,

              interview:
                interviewPercentage,

            },

          }

        }
      )


    // ==========================================
    // RESPONSE
    // ==========================================

    return Response.json({

      success: true,

      profile,

      careers,

    })


  } catch (error) {

    console.error(
      "CV data error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to load CV data.",
      },
      {
        status: 500,
      }
    )

  }

}