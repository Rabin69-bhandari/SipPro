import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const roadmapSchema = {
  type: "object",

  properties: {
    // =========================================================
    // ROADMAP BASIC INFO
    // =========================================================

    title: {
      type: "string",
    },

    description: {
      type: "string",
    },

    // =========================================================
    // ROADMAP VISUAL TYPE
    // Used by frontend to choose the correct card image/sign
    // =========================================================

    type: {
      type: "string",
      enum: [
        "coding",
        "web",
        "app",
        "design",
        "ai",
        "data",
        "math",
        "cybersecurity",
        "cloud",
        "business",
        "general",
      ],
    },

    // =========================================================
    // ROADMAP MODULES
    // =========================================================

    modules: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "string",
          },

          title: {
            type: "string",
          },

          description: {
            type: "string",
          },

          estimatedHours: {
            type: "number",
          },

          topics: {
            type: "array",

            items: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                },

                title: {
                  type: "string",
                },

                description: {
                  type: "string",
                },

                estimatedMinutes: {
                  type: "number",
                },
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

  required: [
    "title",
    "description",
    "type",
    "modules",
  ],
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

ROADMAP TYPE:

Classify the roadmap into exactly ONE of these types:

- coding
- web
- app
- design
- ai
- data
- math
- cybersecurity
- cloud
- business
- general

Choose the type based primarily on the career being pursued.

Examples:

Frontend Developer -> web
Full Stack Developer -> web
Web Developer -> web

Android Developer -> app
iOS Developer -> app
Flutter Developer -> app
Mobile App Developer -> app

UI/UX Designer -> design
Product Designer -> design
Graphic Designer -> design

Java Developer -> coding
C++ Developer -> coding
Software Engineer -> coding

AI Engineer -> ai
Machine Learning Engineer -> ai
NLP Engineer -> ai

Data Scientist -> data
Data Analyst -> data
Data Engineer -> data

Mathematician -> math
Statistics-focused career -> math

Cybersecurity Analyst -> cybersecurity
Penetration Tester -> cybersecurity
Security Engineer -> cybersecurity

DevOps Engineer -> cloud
Cloud Engineer -> cloud
AWS Engineer -> cloud

Business Analyst -> business
Product Manager -> business

If the career does not clearly match one of these categories,
use "general".

ROADMAP RULES:

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