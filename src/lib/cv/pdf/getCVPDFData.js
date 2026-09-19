import { currentUser } from "@clerk/nextjs/server"

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server"


// ============================================================
// GET LATEST RESULT
// ============================================================

async function getLatestResult({
  supabase,
  table,
  careerGoalId,
  userId,
}) {

  const {
    data,
    error,
  } = await supabase
    .from(table)
    .select("*")
    .eq(
      "career_goal_id",
      careerGoalId
    )
    .eq(
      "user_id",
      userId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(1)
    .maybeSingle()


  if (error) {

    console.error(
      `Failed loading ${table}:`,
      error
    )

    return null
  }


  return data ?? null
}


// ============================================================
// MAIN DATA LOADER
// ============================================================

export async function getCVPDFData({
  userId,
  careerGoalId,
}) {

  if (!userId) {
    throw new Error(
      "User ID is required."
    )
  }


  if (!careerGoalId) {
    throw new Error(
      "Career goal ID is required."
    )
  }


  const supabase =
    createServerSupabaseClient()


  // ==========================================================
  // CLERK USER
  // ==========================================================

  const clerkUser =
    await currentUser()


  if (!clerkUser) {
    throw new Error(
      "User account could not be loaded."
    )
  }


  const fullName =
    [
      clerkUser.firstName,
      clerkUser.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim()


  const email =
    clerkUser
      .primaryEmailAddress
      ?.emailAddress ??
    clerkUser
      .emailAddresses?.[0]
      ?.emailAddress ??
    ""


  // ==========================================================
  // CV PROFILE
  // ==========================================================

  const {
    data: cvProfile,
    error: cvProfileError,
  } = await supabase
    .from("cv_profiles")
    .select("*")
    .eq(
      "user_id",
      userId
    )
    .maybeSingle()


  if (cvProfileError) {

    console.error(
      "CV profile error:",
      cvProfileError
    )

    throw new Error(
      "Could not load CV profile."
    )
  }


  // ==========================================================
  // CAREER GOAL
  // ==========================================================

  const {
    data: careerGoal,
    error: careerGoalError,
  } = await supabase
    .from("career_goals")
    .select("*")
    .eq(
      "id",
      careerGoalId
    )
    .eq(
      "user_id",
      userId
    )
    .maybeSingle()


  if (careerGoalError) {

    console.error(
      "Career goal error:",
      careerGoalError
    )

    throw new Error(
      "Could not load career goal."
    )
  }


  if (!careerGoal) {

    throw new Error(
      "Career goal was not found."
    )
  }


  // ==========================================================
  // ROADMAP
  // ==========================================================

  const {
    data: roadmap,
    error: roadmapError,
  } = await supabase
    .from("career_roadmaps")
    .select("*")
    .eq(
      "career_goal_id",
      careerGoalId
    )
    .eq(
      "user_id",
      userId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(1)
    .maybeSingle()


  if (roadmapError) {

    console.error(
      "Roadmap error:",
      roadmapError
    )

  }


  // ==========================================================
  // ROADMAP PROGRESS
  // ==========================================================

  let roadmapProgress = []


  if (roadmap?.id) {

    const {
      data: progressData,
      error: progressError,
    } = await supabase
      .from("roadmap_progress")
      .select("*")
      .eq(
        "roadmap_id",
        roadmap.id
      )
      .eq(
        "user_id",
        userId
      )


    if (progressError) {

      console.error(
        "Roadmap progress error:",
        progressError
      )

    } else {

      roadmapProgress =
        progressData ?? []

    }

  }


  // ==========================================================
  // LATEST ASSESSMENT + INTERVIEW
  // ==========================================================

  const [
    assessment,
    interview,
  ] = await Promise.all([

    getLatestResult({
      supabase,
      table:
        "assessment_results",
      careerGoalId,
      userId,
    }),

    getLatestResult({
      supabase,
      table:
        "interview_results",
      careerGoalId,
      userId,
    }),

  ])


  // ==========================================================
  // RETURN CLEAN DATA
  // ==========================================================

  return {

    user: {

      fullName:
        fullName ||
        "Career Candidate",

      email,

      imageUrl:
        clerkUser.imageUrl ??
        null,

    },


    profile: {

      phone:
        cvProfile?.phone ??
        "",

      location:
        cvProfile?.location ??
        "",

      linkedinUrl:
        cvProfile?.linkedin_url ??
        "",

      githubUrl:
        cvProfile?.github_url ??
        "",

      portfolioUrl:
        cvProfile?.portfolio_url ??
        "",

      education:
        Array.isArray(
          cvProfile?.education
        )
          ? cvProfile.education
          : [],

      experience:
        Array.isArray(
          cvProfile?.experience
        )
          ? cvProfile.experience
          : [],

      projects:
        Array.isArray(
          cvProfile?.projects
        )
          ? cvProfile.projects
          : [],

      certifications:
        Array.isArray(
          cvProfile?.certifications
        )
          ? cvProfile.certifications
          : [],

    },


    career: {

      id:
        careerGoal.id,

      title:
        careerGoal.title ??
        "Career Goal",

      experience:
        careerGoal.experience ??
        "",

      goal:
        careerGoal.goal ??
        "",

      skills:
        Array.isArray(
          careerGoal.skills
        )
          ? careerGoal.skills
          : [],

      progress:
        Number(
          careerGoal.progress ?? 0
        ),

    },


    roadmap:
      roadmap
        ? {
            id:
              roadmap.id,

            progress:
              Number(
                roadmap.progress ?? 0
              ),

            data:
              roadmap.roadmap_data ??
              null,

            topicProgress:
              roadmapProgress,
          }
        : null,


    assessment:
      assessment ?? null,


    interview:
      interview ?? null,

  }
}