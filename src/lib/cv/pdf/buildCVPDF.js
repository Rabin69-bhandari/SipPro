import {
  PDFDocument,
  StandardFonts,
} from "pdf-lib"

import {
  buildCVEvidence,
} from "@/lib/cv/pdf/cvDataHelpers"

import {
  PDF_COLORS,
  createPDFContext,
  drawBullet,
  drawItemHeading,
  drawKeyValue,
  drawMutedText,
  drawPageNumbers,
  drawParagraph,
  drawRule,
  drawSectionTitle,
  drawSkillList,
  drawSubtitle,
  drawText,
  drawTitle,
  safePDFText,
} from "@/lib/cv/pdf/pdfHelpers"


// ============================================================
// ARRAY
// ============================================================

function safeArray(value) {

  return Array.isArray(value)
    ? value
    : []
}


// ============================================================
// FIRST VALUE
// ============================================================

function firstValue(
  object,
  keys,
  fallback = ""
) {

  if (
    !object ||
    typeof object !== "object"
  ) {

    return fallback
  }


  for (const key of keys) {

    const value =
      object[key]


    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {

      return value

    }

  }


  return fallback
}


// ============================================================
// STRING ARRAY
// ============================================================

function toStringArray(value) {

  if (Array.isArray(value)) {

    return value
      .map((item) => {

        if (
          typeof item === "string"
        ) {

          return item.trim()
        }


        if (
          item &&
          typeof item === "object"
        ) {

          return firstValue(
            item,
            [
              "text",
              "description",
              "value",
              "title",
            ]
          )
        }


        return ""

      })
      .filter(Boolean)

  }


  if (
    typeof value === "string"
  ) {

    return value
      .split(/\n|;/)
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean)

  }


  return []
}


// ============================================================
// DATE RANGE
// ============================================================

function buildDateRange(
  start,
  end,
  current = false
) {

  const startText =
    safePDFText(start)


  const endText =
    current
      ? "Present"
      : safePDFText(end)


  if (
    startText &&
    endText
  ) {

    return (
      `${startText} - ${endText}`
    )
  }


  return (
    startText ||
    endText ||
    ""
  )
}


// ============================================================
// CONTACT LINE
// ============================================================

function getContactItems(
  data
) {

  const items = []


  if (data?.user?.email) {

    items.push(
      data.user.email
    )
  }


  if (data?.profile?.phone) {

    items.push(
      data.profile.phone
    )
  }


  if (data?.profile?.location) {

    items.push(
      data.profile.location
    )
  }


  return items
}


// ============================================================
// LINK LINE
// ============================================================

function getLinkItems(
  data
) {

  const items = []


  if (
    data?.profile?.linkedinUrl
  ) {

    items.push(
      `LinkedIn: ${data.profile.linkedinUrl}`
    )
  }


  if (
    data?.profile?.githubUrl
  ) {

    items.push(
      `GitHub: ${data.profile.githubUrl}`
    )
  }


  if (
    data?.profile?.portfolioUrl
  ) {

    items.push(
      `Portfolio: ${data.profile.portfolioUrl}`
    )
  }


  return items
}


// ============================================================
// SUMMARY
// ============================================================

function buildProfessionalSummary(
  data,
  evidence
) {

  const careerTitle =
    safePDFText(
      data?.career?.title ||
      "career professional"
    )


  const experience =
    safePDFText(
      data?.career?.experience
    )


  const goal =
    safePDFText(
      data?.career?.goal
    )


  const demonstrated =
    evidence
      .demonstratedSkills
      .slice(0, 4)


  const pieces = []


  if (experience) {

    pieces.push(
      `${experience} candidate pursuing ${careerTitle}.`
    )

  } else {

    pieces.push(
      `Candidate pursuing a career as ${careerTitle}.`
    )

  }


  if (
    demonstrated.length > 0
  ) {

    pieces.push(
      `Demonstrated skills include ${demonstrated.join(", ")} through career assessments and interview evidence.`
    )

  }


  if (goal) {

    pieces.push(
      `Career goal: ${goal}.`
    )

  }


  return pieces.join(" ")
}


// ============================================================
// EDUCATION
// ============================================================

function drawEducation(
  context,
  education
) {

  const items =
    safeArray(
      education
    )


  if (
    items.length === 0
  ) {

    return
  }


  drawSectionTitle(
    context,
    "Education"
  )


  items.forEach(
    (item) => {

      const degree =
        firstValue(
          item,
          [
            "degree",
            "qualification",
            "course",
            "program",
            "title",
          ],
          "Education"
        )


      const institution =
        firstValue(
          item,
          [
            "institution",
            "school",
            "college",
            "university",
            "organization",
          ]
        )


      const field =
        firstValue(
          item,
          [
            "field",
            "fieldOfStudy",
            "major",
            "specialization",
          ]
        )


      const start =
        firstValue(
          item,
          [
            "startDate",
            "startYear",
            "from",
          ]
        )


      const end =
        firstValue(
          item,
          [
            "endDate",
            "endYear",
            "to",
          ]
        )


      const current =
        Boolean(
          item?.current ||
          item?.currentlyStudying
        )


      const location =
        firstValue(
          item,
          [
            "location",
            "city",
          ]
        )


      const description =
        firstValue(
          item,
          [
            "description",
            "details",
            "summary",
          ]
        )


      const heading =
        field
          ? `${degree} - ${field}`
          : degree


      const meta =
        [
          institution,
          location,
          buildDateRange(
            start,
            end,
            current
          ),
        ]
          .filter(Boolean)
          .join(" | ")


      drawItemHeading(
        context,
        heading,
        meta
      )


      if (description) {

        drawParagraph(
          context,
          description,
          {
            gapAfter: 8,
          }
        )

      } else {

        context.y -= 7

      }

    }
  )
}


// ============================================================
// EXPERIENCE
// ============================================================

function drawExperience(
  context,
  experience
) {

  const items =
    safeArray(
      experience
    )


  if (
    items.length === 0
  ) {

    return
  }


  drawSectionTitle(
    context,
    "Experience"
  )


  items.forEach(
    (item) => {

      const role =
        firstValue(
          item,
          [
            "role",
            "position",
            "jobTitle",
            "title",
          ],
          "Experience"
        )


      const company =
        firstValue(
          item,
          [
            "company",
            "organization",
            "employer",
          ]
        )


      const location =
        firstValue(
          item,
          [
            "location",
            "city",
          ]
        )


      const start =
        firstValue(
          item,
          [
            "startDate",
            "startYear",
            "from",
          ]
        )


      const end =
        firstValue(
          item,
          [
            "endDate",
            "endYear",
            "to",
          ]
        )


      const current =
        Boolean(
          item?.current ||
          item?.currentlyWorking
        )


      const meta =
        [
          company,
          location,
          buildDateRange(
            start,
            end,
            current
          ),
        ]
          .filter(Boolean)
          .join(" | ")


      drawItemHeading(
        context,
        role,
        meta
      )


      const bullets =
        toStringArray(
          item?.bullets ||
          item?.responsibilities ||
          item?.achievements
        )


      const description =
        firstValue(
          item,
          [
            "description",
            "summary",
            "details",
          ]
        )


      if (
        bullets.length > 0
      ) {

        bullets.forEach(
          (bullet) => {

            drawBullet(
              context,
              bullet
            )

          }
        )

      } else if (
        description
      ) {

        drawParagraph(
          context,
          description
        )

      }


      context.y -= 5

    }
  )
}


// ============================================================
// PROJECTS
// ============================================================

function drawProjects(
  context,
  projects
) {

  const items =
    safeArray(
      projects
    )


  if (
    items.length === 0
  ) {

    return
  }


  drawSectionTitle(
    context,
    "Projects"
  )


  items.forEach(
    (item) => {

      const title =
        firstValue(
          item,
          [
            "name",
            "title",
            "projectName",
          ],
          "Project"
        )


      const technologies =
        firstValue(
          item,
          [
            "technologies",
            "techStack",
            "stack",
            "skills",
          ]
        )


      const techText =
        Array.isArray(
          technologies
        )
          ? technologies.join(", ")
          : technologies


      const url =
        firstValue(
          item,
          [
            "url",
            "link",
            "projectUrl",
            "githubUrl",
          ]
        )


      const meta =
        [
          techText,
          url,
        ]
          .filter(Boolean)
          .join(" | ")


      drawItemHeading(
        context,
        title,
        meta
      )


      const bullets =
        toStringArray(
          item?.bullets ||
          item?.features ||
          item?.highlights
        )


      const description =
        firstValue(
          item,
          [
            "description",
            "summary",
            "details",
          ]
        )


      if (
        bullets.length > 0
      ) {

        bullets.forEach(
          (bullet) => {

            drawBullet(
              context,
              bullet
            )

          }
        )

      } else if (
        description
      ) {

        drawParagraph(
          context,
          description
        )

      }


      context.y -= 5

    }
  )
}


// ============================================================
// CERTIFICATIONS
// ============================================================

function drawCertifications(
  context,
  certifications
) {

  const items =
    safeArray(
      certifications
    )


  if (
    items.length === 0
  ) {

    return
  }


  drawSectionTitle(
    context,
    "Certifications"
  )


  items.forEach(
    (item) => {

      if (
        typeof item ===
        "string"
      ) {

        drawBullet(
          context,
          item
        )

        return
      }


      const title =
        firstValue(
          item,
          [
            "name",
            "title",
            "certification",
          ],
          "Certification"
        )


      const issuer =
        firstValue(
          item,
          [
            "issuer",
            "organization",
            "provider",
          ]
        )


      const date =
        firstValue(
          item,
          [
            "date",
            "issueDate",
            "year",
          ]
        )


      const meta =
        [
          issuer,
          date,
        ]
          .filter(Boolean)
          .join(" | ")


      drawItemHeading(
        context,
        title,
        meta
      )


      const url =
        firstValue(
          item,
          [
            "url",
            "credentialUrl",
            "link",
          ]
        )


      if (url) {

        drawMutedText(
          context,
          url,
          {
            gapAfter: 5,
          }
        )

      } else {

        context.y -= 5

      }

    }
  )
}


// ============================================================
// SKILLS
// ============================================================

function drawSkills(
  context,
  evidence
) {

  const hasDemonstrated =
    evidence
      .demonstratedSkills
      .length > 0


  const hasAdditional =
    evidence
      .additionalSkills
      .length > 0


  if (
    !hasDemonstrated &&
    !hasAdditional
  ) {

    return
  }


  drawSectionTitle(
    context,
    "Skills"
  )


  if (hasDemonstrated) {

    drawSubtitle(
      context,
      "Demonstrated Skills"
    )


    drawSkillList(
      context,
      evidence
        .demonstratedSkills
    )

  }


  if (hasAdditional) {

    drawSubtitle(
      context,
      "Additional Skills"
    )


    drawSkillList(
      context,
      evidence
        .additionalSkills
    )

  }
}


// ============================================================
// CAREER EVIDENCE
// ============================================================

function drawCareerEvidence(
  context,
  data,
  evidence
) {

  drawSectionTitle(
    context,
    "Career Evidence"
  )


  drawSubtitle(
    context,
    data?.career?.title ||
    "Career Goal"
  )


  drawKeyValue(
    context,
    "Roadmap Progress",
    `${Math.round(
      evidence.roadmapProgress
    )}%`
  )


  if (
    evidence
      .assessment
      .exists
  ) {

    drawKeyValue(
      context,
      "Skill Assessment",
      `${Math.round(
        evidence
          .assessment
          .totalScore
      )}/30`
    )

  } else {

    drawKeyValue(
      context,
      "Skill Assessment",
      "Not completed"
    )

  }


  if (
    evidence
      .interview
      .exists
  ) {

    drawKeyValue(
      context,
      "AI Interview",
      `${Math.round(
        evidence
          .interview
          .totalScore
      )}/100`
    )

  } else {

    drawKeyValue(
      context,
      "AI Interview",
      "Not completed"
    )

  }


  drawKeyValue(
    context,
    "Career Readiness",
    `${Math.round(
      evidence
        .careerReadiness
    )}%`
  )


  if (
    evidence
      .assessment
      .exists
  ) {

    drawSubtitle(
      context,
      "Assessment Breakdown"
    )


    drawKeyValue(
      context,
      "Knowledge Question",
      `${evidence.assessment.questionScore}/10`
    )


    drawKeyValue(
      context,
      "Scenario",
      `${evidence.assessment.scenarioScore}/10`
    )


    drawKeyValue(
      context,
      "Practical Task",
      `${evidence.assessment.practicalScore}/10`
    )

  }


  if (
    evidence
      .interview
      .exists
  ) {

    drawSubtitle(
      context,
      "Interview Breakdown"
    )


    drawKeyValue(
      context,
      "Technical Knowledge",
      `${evidence.interview.technicalScore}/25`
    )


    drawKeyValue(
      context,
      "Problem Solving",
      `${evidence.interview.problemSolvingScore}/25`
    )


    drawKeyValue(
      context,
      "Communication",
      `${evidence.interview.communicationScore}/25`
    )


    drawKeyValue(
      context,
      "Practical Reasoning",
      `${evidence.interview.practicalReasoningScore}/25`
    )

  }


  if (
    evidence
      .demonstratedSkills
      .length > 0
  ) {

    drawSubtitle(
      context,
      "Evidence-backed Skills"
    )


    drawSkillList(
      context,
      evidence
        .demonstratedSkills
    )

  }
}


// ============================================================
// BUILD PDF
// ============================================================

export async function buildCVPDF(
  data
) {

  // ==========================================================
  // DOCUMENT
  // ==========================================================

  const pdfDoc =
    await PDFDocument.create()


  pdfDoc.setTitle(
    `${data?.user?.fullName || "Career"} CV`
  )


  pdfDoc.setAuthor(
    data?.user?.fullName ||
    "Career Candidate"
  )


  pdfDoc.setSubject(
    `${
      data?.career?.title ||
      "Career"
    } CV`
  )


  pdfDoc.setCreator(
    "Career Readiness Platform"
  )


  // ==========================================================
  // FONTS
  // ==========================================================

  const regularFont =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    )


  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    )


  // ==========================================================
  // CONTEXT
  // ==========================================================

  const context =
    createPDFContext({
      pdfDoc,
      regularFont,
      boldFont,
    })


  // ==========================================================
  // EVIDENCE
  // ==========================================================

  const evidence =
    buildCVEvidence(
      data
    )


  // ==========================================================
  // HEADER
  // ==========================================================

  drawTitle(
    context,
    data?.user?.fullName ||
    "Career Candidate",
    {
      size: 25,
      gapAfter: 2,
    }
  )


  drawText(
    context,
    data?.career?.title ||
    "Career Professional",
    {
      font:
        boldFont,

      size: 12,

      color:
        PDF_COLORS.primary,

      lineHeight: 16,

      gapAfter: 5,
    }
  )


  const contactItems =
    getContactItems(
      data
    )


  if (
    contactItems.length > 0
  ) {

    drawMutedText(
      context,
      contactItems.join(
        " | "
      ),
      {
        gapAfter: 2,
      }
    )

  }


  const linkItems =
    getLinkItems(
      data
    )


  if (
    linkItems.length > 0
  ) {

    linkItems.forEach(
      (item) => {

        drawMutedText(
          context,
          item,
          {
            size: 8.5,
            gapAfter: 1,
          }
        )

      }
    )

  }


  drawRule(
    context,
    {
      gapBefore: 7,
      gapAfter: 8,
    }
  )


  // ==========================================================
  // SUMMARY
  // ==========================================================

  drawSectionTitle(
    context,
    "Professional Summary"
  )


  drawParagraph(
    context,
    buildProfessionalSummary(
      data,
      evidence
    ),
    {
      lineHeight: 14,
      gapAfter: 5,
    }
  )


  // ==========================================================
  // SKILLS
  // ==========================================================

  drawSkills(
    context,
    evidence
  )


  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  drawExperience(
    context,
    data?.profile?.experience
  )


  // ==========================================================
  // PROJECTS
  // ==========================================================

  drawProjects(
    context,
    data?.profile?.projects
  )


  // ==========================================================
  // EDUCATION
  // ==========================================================

  drawEducation(
    context,
    data?.profile?.education
  )


  // ==========================================================
  // CERTIFICATIONS
  // ==========================================================

  drawCertifications(
    context,
    data?.profile
      ?.certifications
  )


  // ==========================================================
  // CAREER EVIDENCE
  // ==========================================================

  drawCareerEvidence(
    context,
    data,
    evidence
  )


  // ==========================================================
  // FOOTER
  // ==========================================================

  drawPageNumbers({
    pdfDoc,
    regularFont,
  })


  // ==========================================================
  // SAVE
  // ==========================================================

  const pdfBytes =
    await pdfDoc.save()


  return {
    pdfBytes,
    evidence,
  }
}