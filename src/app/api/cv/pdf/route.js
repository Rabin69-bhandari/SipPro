import {
  auth,
} from "@clerk/nextjs/server"

import {
  getCVPDFData,
} from "@/lib/cv/pdf/getCVPDFData"

import {
  buildCVPDF,
} from "@/lib/cv/pdf/buildCVPDF"


// ============================================================
// NODE RUNTIME
// ============================================================

export const runtime = "nodejs"


// ============================================================
// SAFE FILE NAME
// ============================================================

function createFileName({
  fullName,
  careerTitle,
}) {

  const safeName =
    String(
      fullName ||
      "career"
    )
      .trim()
      .replace(
        /[^a-zA-Z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )


  const safeCareer =
    String(
      careerTitle ||
      "cv"
    )
      .trim()
      .replace(
        /[^a-zA-Z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )


  return (
    `${safeName || "career"}-` +
    `${safeCareer || "cv"}-CV.pdf`
  )
}


// ============================================================
// POST /api/cv/pdf
// ============================================================

export async function POST(
  request
) {

  try {

    // ========================================================
    // AUTH
    // ========================================================

    const {
      userId,
    } = await auth()


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


    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await request.json()


    const {
      careerGoalId,
    } = body


    if (
      !careerGoalId ||
      typeof careerGoalId !==
        "string"
    ) {

      return Response.json(
        {
          success: false,
          error:
            "Career goal is required.",
        },
        {
          status: 400,
        }
      )

    }


    // ========================================================
    // LOAD TRUSTED CV DATA
    // ========================================================

    const cvData =
      await getCVPDFData({
        userId,
        careerGoalId,
      })


    // ========================================================
    // GENERATE PDF
    // ========================================================

    const {
      pdfBytes,
    } = await buildCVPDF(
      cvData
    )


    if (
      !pdfBytes ||
      pdfBytes.length === 0
    ) {

      throw new Error(
        "PDF generation returned an empty file."
      )

    }


    // ========================================================
    // FILE NAME
    // ========================================================

    const fileName =
      createFileName({

        fullName:
          cvData.user
            ?.fullName,

        careerTitle:
          cvData.career
            ?.title,

      })


    // ========================================================
    // RETURN PDF
    // ========================================================

    return new Response(
      pdfBytes,
      {
        status: 200,

        headers: {

          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${fileName}"`,

          "Content-Length":
            String(
              pdfBytes.length
            ),

          "Cache-Control":
            "no-store",

        },
      }
    )


  } catch (error) {

    console.error(
      "CV PDF generation error:",
      error
    )


    return Response.json(
      {
        success: false,

        error:
          error?.message ||
          "Failed to generate CV PDF.",
      },
      {
        status: 500,
      }
    )

  }
}