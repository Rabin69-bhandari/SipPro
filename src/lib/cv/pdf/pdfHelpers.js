import {
  rgb,
} from "pdf-lib"


// ============================================================
// A4
// ============================================================

export const PDF_PAGE = {
  width: 595.28,
  height: 841.89,

  marginLeft: 48,
  marginRight: 48,
  marginTop: 48,
  marginBottom: 48,
}


// ============================================================
// COLORS
// ============================================================

export const PDF_COLORS = {

  text:
    rgb(
      0.10,
      0.11,
      0.14
    ),

  muted:
    rgb(
      0.38,
      0.40,
      0.45
    ),

  primary:
    rgb(
      0.31,
      0.22,
      0.96
    ),

  border:
    rgb(
      0.87,
      0.88,
      0.91
    ),

  light:
    rgb(
      0.96,
      0.96,
      0.98
    ),

  white:
    rgb(
      1,
      1,
      1
    ),
}


// ============================================================
// SAFE TEXT
// ============================================================

export function safePDFText(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return ""

  }


  return String(value)

    // Smart quotes
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')

    // Long dashes
    .replace(/[–—]/g, "-")

    // Bullets
    .replace(/[•●▪]/g, "-")

    // Ellipsis
    .replace(/…/g, "...")

    // Non-breaking spaces
    .replace(/\u00A0/g, " ")

    // Tabs
    .replace(/\t/g, " ")

    // Multiple spaces
    .replace(/[ ]{2,}/g, " ")

    // Standard Helvetica in pdf-lib
    // cannot safely encode arbitrary Unicode.
    .replace(/[^\x20-\x7E\n]/g, "")

    .trim()
}


// ============================================================
// CREATE PAGE
// ============================================================

export function addPDFPage(
  pdfDoc
) {

  return pdfDoc.addPage([
    PDF_PAGE.width,
    PDF_PAGE.height,
  ])
}


// ============================================================
// CREATE DRAWING CONTEXT
// ============================================================

export function createPDFContext({
  pdfDoc,
  regularFont,
  boldFont,
}) {

  const page =
    addPDFPage(
      pdfDoc
    )


  return {

    pdfDoc,

    page,

    regularFont,
    boldFont,

    x:
      PDF_PAGE.marginLeft,

    y:
      PDF_PAGE.height -
      PDF_PAGE.marginTop,

    contentWidth:
      PDF_PAGE.width -
      PDF_PAGE.marginLeft -
      PDF_PAGE.marginRight,

  }
}


// ============================================================
// NEW PAGE
// ============================================================

export function newPage(
  context
) {

  context.page =
    addPDFPage(
      context.pdfDoc
    )


  context.x =
    PDF_PAGE.marginLeft


  context.y =
    PDF_PAGE.height -
    PDF_PAGE.marginTop


  return context.page
}


// ============================================================
// ENSURE SPACE
// ============================================================

export function ensureSpace(
  context,
  requiredHeight = 40
) {

  if (
    context.y -
    requiredHeight <
    PDF_PAGE.marginBottom
  ) {

    newPage(
      context
    )

    return true

  }


  return false
}


// ============================================================
// WRAP TEXT
// ============================================================

export function wrapText({
  text,
  font,
  size,
  maxWidth,
}) {

  const safeText =
    safePDFText(
      text
    )


  if (!safeText) {
    return []
  }


  const paragraphs =
    safeText.split("\n")


  const lines = []


  for (
    const paragraph
    of paragraphs
  ) {

    if (!paragraph.trim()) {

      lines.push("")

      continue

    }


    const words =
      paragraph
        .trim()
        .split(/\s+/)


    let currentLine = ""


    for (
      const word
      of words
    ) {

      const testLine =
        currentLine
          ? `${currentLine} ${word}`
          : word


      const width =
        font.widthOfTextAtSize(
          testLine,
          size
        )


      if (
        width <= maxWidth
      ) {

        currentLine =
          testLine

        continue

      }


      if (currentLine) {

        lines.push(
          currentLine
        )

      }


      // Handle extremely long values such as URLs.

      if (
        font.widthOfTextAtSize(
          word,
          size
        ) > maxWidth
      ) {

        let fragment = ""


        for (
          const character
          of word
        ) {

          const testFragment =
            fragment +
            character


          const fragmentWidth =
            font.widthOfTextAtSize(
              testFragment,
              size
            )


          if (
            fragmentWidth >
            maxWidth &&
            fragment
          ) {

            lines.push(
              fragment
            )

            fragment =
              character

          } else {

            fragment =
              testFragment

          }

        }


        currentLine =
          fragment

      } else {

        currentLine =
          word

      }

    }


    if (currentLine) {

      lines.push(
        currentLine
      )

    }

  }


  return lines
}


// ============================================================
// DRAW TEXT
// ============================================================

export function drawText(
  context,
  text,
  options = {}
) {

  const {
    size = 10,

    font =
      context.regularFont,

    color =
      PDF_COLORS.text,

    x =
      context.x,

    maxWidth =
      context.contentWidth,

    lineHeight =
      size * 1.4,

    gapAfter = 0,

    allowPageBreak = true,
  } = options


  const lines =
    wrapText({
      text,
      font,
      size,
      maxWidth,
    })


  if (
    lines.length === 0
  ) {

    return

  }


  for (
    const line
    of lines
  ) {

    if (
      allowPageBreak
    ) {

      ensureSpace(
        context,
        lineHeight
      )

    }


    if (line) {

      context.page.drawText(
        line,
        {
          x,
          y:
            context.y -
            size,

          size,
          font,
          color,
        }
      )

    }


    context.y -=
      lineHeight

  }


  context.y -=
    gapAfter
}


// ============================================================
// SPACING
// ============================================================

export function addSpace(
  context,
  amount = 10
) {

  ensureSpace(
    context,
    amount
  )


  context.y -=
    amount
}


// ============================================================
// HORIZONTAL RULE
// ============================================================

export function drawRule(
  context,
  options = {}
) {

  const {
    color =
      PDF_COLORS.border,

    thickness = 0.8,

    gapBefore = 4,

    gapAfter = 12,
  } = options


  ensureSpace(
    context,
    gapBefore +
    gapAfter +
    thickness
  )


  context.y -=
    gapBefore


  context.page.drawLine({

    start: {
      x:
        PDF_PAGE.marginLeft,

      y:
        context.y,
    },

    end: {
      x:
        PDF_PAGE.width -
        PDF_PAGE.marginRight,

      y:
        context.y,
    },

    thickness,

    color,

  })


  context.y -=
    gapAfter
}


// ============================================================
// SECTION TITLE
// ============================================================

export function drawSectionTitle(
  context,
  title
) {

  ensureSpace(
    context,
    42
  )


  context.y -=
    8


  drawText(
    context,
    safePDFText(
      title
    ).toUpperCase(),
    {
      font:
        context.boldFont,

      size: 10,

      color:
        PDF_COLORS.primary,

      lineHeight: 14,

      gapAfter: 3,
    }
  )


  context.page.drawLine({

    start: {
      x:
        PDF_PAGE.marginLeft,

      y:
        context.y,
    },

    end: {
      x:
        PDF_PAGE.width -
        PDF_PAGE.marginRight,

      y:
        context.y,
    },

    thickness: 0.7,

    color:
      PDF_COLORS.border,

  })


  context.y -=
    10
}


// ============================================================
// TITLE
// ============================================================

export function drawTitle(
  context,
  text,
  options = {}
) {

  const {
    size = 24,

    color =
      PDF_COLORS.text,

    gapAfter = 5,
  } = options


  drawText(
    context,
    text,
    {
      font:
        context.boldFont,

      size,

      color,

      lineHeight:
        size * 1.15,

      gapAfter,
    }
  )
}


// ============================================================
// SUBTITLE
// ============================================================

export function drawSubtitle(
  context,
  text
) {

  drawText(
    context,
    text,
    {
      font:
        context.boldFont,

      size: 11,

      color:
        PDF_COLORS.primary,

      lineHeight: 15,

      gapAfter: 3,
    }
  )
}


// ============================================================
// MUTED TEXT
// ============================================================

export function drawMutedText(
  context,
  text,
  options = {}
) {

  drawText(
    context,
    text,
    {
      size:
        options.size ??
        9,

      color:
        PDF_COLORS.muted,

      lineHeight:
        options.lineHeight ??
        13,

      gapAfter:
        options.gapAfter ??
        2,
    }
  )
}


// ============================================================
// PARAGRAPH
// ============================================================

export function drawParagraph(
  context,
  text,
  options = {}
) {

  if (!text) {
    return
  }


  drawText(
    context,
    text,
    {
      size:
        options.size ??
        9.5,

      color:
        options.color ??
        PDF_COLORS.text,

      lineHeight:
        options.lineHeight ??
        14,

      gapAfter:
        options.gapAfter ??
        7,
    }
  )
}


// ============================================================
// BULLET
// ============================================================

export function drawBullet(
  context,
  text,
  options = {}
) {

  if (!text) {
    return
  }


  const size =
    options.size ??
    9.5


  const indent =
    options.indent ??
    12


  const bulletX =
    PDF_PAGE.marginLeft


  const textX =
    PDF_PAGE.marginLeft +
    indent


  const maxWidth =
    context.contentWidth -
    indent


  const lines =
    wrapText({

      text,

      font:
        context.regularFont,

      size,

      maxWidth,

    })


  if (
    lines.length === 0
  ) {

    return

  }


  const lineHeight =
    options.lineHeight ??
    14


  let firstLine = true


  for (
    const line
    of lines
  ) {

    ensureSpace(
      context,
      lineHeight
    )


    if (firstLine) {

      context.page.drawText(
        "-",
        {
          x:
            bulletX,

          y:
            context.y -
            size,

          size,

          font:
            context.boldFont,

          color:
            PDF_COLORS.primary,
        }
      )


      firstLine = false

    }


    context.page.drawText(
      line,
      {
        x:
          textX,

        y:
          context.y -
          size,

        size,

        font:
          context.regularFont,

        color:
          PDF_COLORS.text,
      }
    )


    context.y -=
      lineHeight

  }


  context.y -=
    options.gapAfter ??
    2
}


// ============================================================
// ITEM HEADING
// ============================================================

export function drawItemHeading(
  context,
  title,
  subtitle = ""
) {

  if (!title) {
    return
  }


  ensureSpace(
    context,
    40
  )


  drawText(
    context,
    title,
    {
      font:
        context.boldFont,

      size: 10.5,

      lineHeight: 14,

      gapAfter: 0,
    }
  )


  if (subtitle) {

    drawMutedText(
      context,
      subtitle,
      {
        gapAfter: 3,
      }
    )

  }
}


// ============================================================
// KEY / VALUE ROW
// ============================================================

export function drawKeyValue(
  context,
  label,
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return

  }


  ensureSpace(
    context,
    20
  )


  const labelText =
    safePDFText(
      label
    )


  const valueText =
    safePDFText(
      value
    )


  const labelSize = 9
  const valueSize = 9


  context.page.drawText(
    labelText,
    {
      x:
        PDF_PAGE.marginLeft,

      y:
        context.y -
        labelSize,

      size:
        labelSize,

      font:
        context.boldFont,

      color:
        PDF_COLORS.text,
    }
  )


  const valueWidth =
    context.regularFont
      .widthOfTextAtSize(
        valueText,
        valueSize
      )


  const rightEdge =
    PDF_PAGE.width -
    PDF_PAGE.marginRight


  context.page.drawText(
    valueText,
    {
      x:
        Math.max(
          PDF_PAGE.marginLeft +
          180,

          rightEdge -
          valueWidth
        ),

      y:
        context.y -
        valueSize,

      size:
        valueSize,

      font:
        context.regularFont,

      color:
        PDF_COLORS.text,
    }
  )


  context.y -=
    17
}


// ============================================================
// SKILL LIST
// ============================================================

export function drawSkillList(
  context,
  skills
) {

  if (
    !Array.isArray(skills) ||
    skills.length === 0
  ) {

    return
  }


  const cleanSkills =
    skills
      .map(
        safePDFText
      )
      .filter(Boolean)


  if (
    cleanSkills.length === 0
  ) {

    return
  }


  drawParagraph(
    context,
    cleanSkills.join(" | "),
    {
      gapAfter: 5,
    }
  )
}


// ============================================================
// PAGE FOOTERS
// ============================================================

export function drawPageNumbers({
  pdfDoc,
  regularFont,
}) {

  const pages =
    pdfDoc.getPages()


  pages.forEach(
    (page, index) => {

      const text =
        `Page ${index + 1} of ${pages.length}`


      const size = 8


      const width =
        regularFont
          .widthOfTextAtSize(
            text,
            size
          )


      page.drawText(
        text,
        {
          x:
            (
              PDF_PAGE.width -
              width
            ) / 2,

          y: 22,

          size,

          font:
            regularFont,

          color:
            PDF_COLORS.muted,
        }
      )

    }
  )
}