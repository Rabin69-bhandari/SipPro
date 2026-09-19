import { auth } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"


// ==========================================
// GET CV PROFILE
// ==========================================

export async function GET() {

  try {

    // ========================================
    // AUTH
    // ========================================

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


    // ========================================
    // SUPABASE
    // ========================================

    const supabase =
      createServerSupabaseClient()


    // ========================================
    // FETCH PROFILE
    // ========================================

    const {
      data,
      error,
    } = await supabase
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
      .maybeSingle()


    if (error) {

      throw error

    }


    // ========================================
    // EMPTY PROFILE
    // ========================================

    if (!data) {

      return Response.json({

        success: true,

        profile: {

          phone: "",
          location: "",

          linkedinUrl: "",
          githubUrl: "",
          portfolioUrl: "",

          education: [],
          experience: [],
          projects: [],
          certifications: [],

        },

      })

    }


    // ========================================
    // RESPONSE
    // ========================================

    return Response.json({

      success: true,

      profile: {

        id:
          data.id,

        phone:
          data.phone ?? "",

        location:
          data.location ?? "",

        linkedinUrl:
          data.linkedin_url ?? "",

        githubUrl:
          data.github_url ?? "",

        portfolioUrl:
          data.portfolio_url ?? "",

        education:
          data.education ?? [],

        experience:
          data.experience ?? [],

        projects:
          data.projects ?? [],

        certifications:
          data.certifications ?? [],

        createdAt:
          data.created_at,

        updatedAt:
          data.updated_at,

      },

    })


  } catch (error) {

    console.error(
      "Fetch CV profile error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to fetch CV profile.",
      },
      {
        status: 500,
      }
    )

  }

}


// ==========================================
// SAVE / UPDATE CV PROFILE
// ==========================================

export async function PUT(request) {

  try {

    // ========================================
    // AUTH
    // ========================================

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


    // ========================================
    // BODY
    // ========================================

    const body =
      await request.json()


    const {

      phone = "",

      location = "",

      linkedinUrl = "",

      githubUrl = "",

      portfolioUrl = "",

      education = [],

      experience = [],

      projects = [],

      certifications = [],

    } = body


    // ========================================
    // VALIDATE ARRAYS
    // ========================================

    if (!Array.isArray(education)) {

      return Response.json(
        {
          success: false,
          error:
            "Education must be an array.",
        },
        {
          status: 400,
        }
      )

    }


    if (!Array.isArray(experience)) {

      return Response.json(
        {
          success: false,
          error:
            "Experience must be an array.",
        },
        {
          status: 400,
        }
      )

    }


    if (!Array.isArray(projects)) {

      return Response.json(
        {
          success: false,
          error:
            "Projects must be an array.",
        },
        {
          status: 400,
        }
      )

    }


    if (!Array.isArray(certifications)) {

      return Response.json(
        {
          success: false,
          error:
            "Certifications must be an array.",
        },
        {
          status: 400,
        }
      )

    }


    // ========================================
    // CLEAN STRINGS
    // ========================================

    const cleanText =
      (value) => {

        if (
          typeof value !==
          "string"
        ) {

          return ""

        }

        return value.trim()

      }


    // ========================================
    // SUPABASE
    // ========================================

    const supabase =
      createServerSupabaseClient()


    // ========================================
    // UPSERT
    //
    // user_id is included here because
    // Supabase needs the conflict column
    // for upsert.
    //
    // This is NOT trusting a browser userId.
    // userId comes from Clerk on the server.
    // ========================================

    const {
      data,
      error,
    } = await supabase
      .from("cv_profiles")
      .upsert(
        {

          user_id:
            userId,

          phone:
            cleanText(phone),

          location:
            cleanText(location),

          linkedin_url:
            cleanText(linkedinUrl),

          github_url:
            cleanText(githubUrl),

          portfolio_url:
            cleanText(portfolioUrl),

          education,

          experience,

          projects,

          certifications,

          updated_at:
            new Date().toISOString(),

        },
        {
          onConflict:
            "user_id",
        }
      )
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
      .single()


    if (error) {

      throw error

    }


    // ========================================
    // RESPONSE
    // ========================================

    return Response.json({

      success: true,

      message:
        "CV profile saved successfully.",

      profile: {

        id:
          data.id,

        phone:
          data.phone ?? "",

        location:
          data.location ?? "",

        linkedinUrl:
          data.linkedin_url ?? "",

        githubUrl:
          data.github_url ?? "",

        portfolioUrl:
          data.portfolio_url ?? "",

        education:
          data.education ?? [],

        experience:
          data.experience ?? [],

        projects:
          data.projects ?? [],

        certifications:
          data.certifications ?? [],

        createdAt:
          data.created_at,

        updatedAt:
          data.updated_at,

      },

    })


  } catch (error) {

    console.error(
      "Save CV profile error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error.message ||
          "Failed to save CV profile.",
      },
      {
        status: 500,
      }
    )

  }

}