import { auth } from "@clerk/nextjs/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { generateCareerRoadmap } from "@/lib/gemini/server"


export async function POST(request) {
  try {
    // Authenticate
    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }


    // Get form data
    const formData = await request.json()

    const {
      title,
      experience,
      goal,
      skills = [],
      hoursPerWeek,
    } = formData


    // Validate
    if (!title || !experience || !goal || !hoursPerWeek) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }


    const supabase = createServerSupabaseClient()


    // Store career goal
    const { data: careerGoal, error: goalError } = await supabase
      .from("career_goals")
      .insert({
        title,
        experience,
        goal,
        skills,
        hours_per_week: Number(hoursPerWeek),
      })
      .select()
      .single()

    if (goalError) throw goalError


    // Generate AI roadmap
    const roadmapData = await generateCareerRoadmap(formData)


    // Store AI roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from("career_roadmaps")
      .insert({
        career_goal_id: careerGoal.id,
        roadmap_data: roadmapData,
      })
      .select()
      .single()

    if (roadmapError) throw roadmapError


    // Response
    return Response.json({
      success: true,
      careerGoal,
      roadmap,
    })

  } catch (error) {
    console.error("Create roadmap error:", error)

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}


export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("career_roadmaps")
      .select(`
        id,
        progress,
        roadmap_data,
        created_at,
        career_goal:career_goals (
          id,
          title,
          experience,
          goal,
          skills,
          hours_per_week
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return Response.json({
      success: true,
      roadmaps: data,
    })

  } catch (error) {
    console.error("Fetch roadmaps error:", error)

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}