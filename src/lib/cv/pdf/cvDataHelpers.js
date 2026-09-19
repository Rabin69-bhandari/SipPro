// ============================================================
// NUMBER HELPERS
// ============================================================

function clamp(value, min, max) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return min
  }

  return Math.min(
    Math.max(number, min),
    max
  )
}


export function roundScore(value) {
  return Math.round(
    Number(value) || 0
  )
}


// ============================================================
// ROADMAP PROGRESS
// ============================================================

export function getRoadmapProgress(data) {

  // Prefer the stored roadmap progress.

  const roadmapProgress =
    Number(
      data?.roadmap?.progress
    )


  if (
    Number.isFinite(
      roadmapProgress
    )
  ) {

    return clamp(
      roadmapProgress,
      0,
      100
    )

  }


  // Fallback to career goal progress.

  const careerProgress =
    Number(
      data?.career?.progress
    )


  if (
    Number.isFinite(
      careerProgress
    )
  ) {

    return clamp(
      careerProgress,
      0,
      100
    )

  }


  // Final fallback:
  // calculate from topic progress.

  const topics =
    data?.roadmap?.topicProgress


  if (
    !Array.isArray(topics) ||
    topics.length === 0
  ) {

    return 0

  }


  const completed =
    topics.filter(
      (topic) =>
        topic.status ===
        "completed"
    ).length


  return Math.round(
    (
      completed /
      topics.length
    ) * 100
  )
}


// ============================================================
// ASSESSMENT
// ============================================================

export function getAssessmentEvidence(
  assessment
) {

  if (!assessment) {

    return {
      exists: false,

      questionScore: 0,
      scenarioScore: 0,
      practicalScore: 0,

      totalScore: 0,
      maxScore: 30,

      percentage: 0,

      status: null,
      feedback: null,
    }

  }


  const questionScore =
    clamp(
      assessment.question_score,
      0,
      10
    )


  const scenarioScore =
    clamp(
      assessment.scenario_score,
      0,
      10
    )


  const practicalScore =
    clamp(
      assessment.practical_score,
      0,
      10
    )


  const totalScore =
    clamp(
      assessment.total_score,
      0,
      30
    )


  const percentage =
    Math.round(
      (
        totalScore /
        30
      ) * 100
    )


  return {

    exists: true,

    questionScore,
    scenarioScore,
    practicalScore,

    totalScore,
    maxScore: 30,

    percentage,

    status:
      assessment.status ??
      null,

    feedback:
      assessment.feedback ??
      null,

  }
}


// ============================================================
// INTERVIEW
// ============================================================

export function getInterviewEvidence(
  interview
) {

  if (!interview) {

    return {
      exists: false,

      technicalScore: 0,
      problemSolvingScore: 0,
      communicationScore: 0,
      practicalReasoningScore: 0,

      totalScore: 0,
      maxScore: 100,

      percentage: 0,

      feedback: null,
    }

  }


  const technicalScore =
    clamp(
      interview.technical_score,
      0,
      25
    )


  const problemSolvingScore =
    clamp(
      interview.problem_solving_score,
      0,
      25
    )


  const communicationScore =
    clamp(
      interview.communication_score,
      0,
      25
    )


  const practicalReasoningScore =
    clamp(
      interview.practical_reasoning_score,
      0,
      25
    )


  const totalScore =
    clamp(
      interview.total_score,
      0,
      100
    )


  return {

    exists: true,

    technicalScore,

    problemSolvingScore,

    communicationScore,

    practicalReasoningScore,

    totalScore,

    maxScore: 100,

    percentage:
      Math.round(
        totalScore
      ),

    feedback:
      interview.feedback ??
      null,

  }
}


// ============================================================
// NORMALIZE SKILL
// ============================================================

function normalizeSkill(skill) {

  if (
    typeof skill !==
    "string"
  ) {

    return ""

  }


  return skill
    .trim()
    .replace(
      /\s+/g,
      " "
    )
}


// ============================================================
// UNIQUE SKILLS
// ============================================================

function uniqueSkills(skills) {

  const result = []

  const seen =
    new Set()


  for (
    const rawSkill
    of skills
  ) {

    const skill =
      normalizeSkill(
        rawSkill
      )


    if (!skill) {
      continue
    }


    const key =
      skill.toLowerCase()


    if (
      seen.has(key)
    ) {

      continue

    }


    seen.add(key)

    result.push(skill)

  }


  return result
}


// ============================================================
// EXTRACT ARRAY FROM FEEDBACK
// ============================================================

function extractFeedbackArray(
  feedback,
  possibleKeys
) {

  if (
    !feedback ||
    typeof feedback !==
    "object"
  ) {

    return []

  }


  for (
    const key
    of possibleKeys
  ) {

    const value =
      feedback[key]


    if (
      Array.isArray(value)
    ) {

      return value

    }

  }


  return []
}


// ============================================================
// DEMONSTRATED SKILLS
// ============================================================

export function getDemonstratedSkills(
  data
) {

  const interviewFeedback =
    data?.interview?.feedback


  const skills =
    extractFeedbackArray(
      interviewFeedback,
      [
        "demonstratedSkills",
        "demonstrated_skills",
        "verifiedSkills",
        "verified_skills",
        "skillsDemonstrated",
        "skills_demonstrated",
      ]
    )


  return uniqueSkills(
    skills
  )
}


// ============================================================
// CLAIMED SKILLS
// ============================================================

export function getClaimedSkills(
  data
) {

  const skills =
    data?.career?.skills


  if (
    !Array.isArray(skills)
  ) {

    return []

  }


  return uniqueSkills(
    skills
  )
}


// ============================================================
// ADDITIONAL SKILLS
// ============================================================

export function getAdditionalSkills(
  data
) {

  const claimed =
    getClaimedSkills(
      data
    )


  const demonstrated =
    getDemonstratedSkills(
      data
    )


  const demonstratedSet =
    new Set(
      demonstrated.map(
        (skill) =>
          skill.toLowerCase()
      )
    )


  return claimed.filter(
    (skill) =>
      !demonstratedSet.has(
        skill.toLowerCase()
      )
  )
}


// ============================================================
// CAREER READINESS
// ============================================================

export function calculateCareerReadiness(
  data
) {

  const roadmap =
    getRoadmapProgress(
      data
    )


  const assessment =
    getAssessmentEvidence(
      data?.assessment
    )


  const interview =
    getInterviewEvidence(
      data?.interview
    )


  // Product-defined hackathon metric:
  //
  // Roadmap     = 40%
  // Assessment  = 30%
  // Interview   = 30%

  const readiness =
    (
      roadmap * 0.4
    ) +
    (
      assessment.percentage *
      0.3
    ) +
    (
      interview.percentage *
      0.3
    )


  return clamp(
    Math.round(
      readiness
    ),
    0,
    100
  )
}


// ============================================================
// BUILD COMPLETE EVIDENCE
// ============================================================

export function buildCVEvidence(
  data
) {

  const roadmapProgress =
    getRoadmapProgress(
      data
    )


  const assessment =
    getAssessmentEvidence(
      data?.assessment
    )


  const interview =
    getInterviewEvidence(
      data?.interview
    )


  const demonstratedSkills =
    getDemonstratedSkills(
      data
    )


  const claimedSkills =
    getClaimedSkills(
      data
    )


  const additionalSkills =
    getAdditionalSkills(
      data
    )


  const careerReadiness =
    calculateCareerReadiness(
      data
    )


  return {

    roadmapProgress,

    assessment,

    interview,

    careerReadiness,

    demonstratedSkills,

    claimedSkills,

    additionalSkills,

  }
}