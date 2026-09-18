import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const roadmapSchema = {
  type: "object",

  properties: {
    title: { type: "string" },
    description: { type: "string" },

    modules: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          estimatedHours: { type: "number" },

          topics: {
            type: "array",

            items: {
              type: "object",

              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                estimatedMinutes: { type: "number" },
              },

              required: [
                "id",
                "title",
                "description",
                "estimatedMinutes",
              ],
            },
          },
        },

        required: [
          "id",
          "title",
          "description",
          "estimatedHours",
          "topics",
        ],
      },
    },
  },

  required: ["title", "description", "modules"],
}


function createPrompt({
  title,
  experience,
  goal,
  skills,
  hoursPerWeek,
}) {
  return `
You are a career roadmap planner.

Create a personalized learning roadmap for this user.

Career: ${title}
Experience: ${experience}
Career objective: ${goal}
Claimed skills: ${skills?.length ? skills.join(", ") : "None"}
Study time: ${hoursPerWeek} hours per week.

Rules:
- Personalize the roadmap to the user's experience and career goal.
- Claimed skills are not verified skills.
- Include necessary foundations.
- Organize learning into ordered modules and topics.
- Keep each topic focused enough for an interactive AI tutoring session.
- Do not generate full lessons.
- Keep descriptions short and useful.
- Estimate learning time.
- Use unique lowercase hyphenated IDs for modules and topics.
`
}


export async function generateCareerRoadmap(userData) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: createPrompt(userData),

    config: {
      responseMimeType: "application/json",
      responseJsonSchema: roadmapSchema,
    },
  })

  return JSON.parse(response.text)
}