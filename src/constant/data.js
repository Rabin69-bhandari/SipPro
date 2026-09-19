import {
  ArrowRight,
  Check,
  Crown,
  LoaderCircle,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react"


export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};


export const plans = [
  {
    id: "free",
    name: "Free",
    description: "Start building your career path.",
    price: 0,
    period: "forever",
    icon: Rocket,
    buttonText: "Start Free",
    popular: false,
    features: [
      "1 Career Roadmap",
      "AI-powered learning roadmap",
      "Basic progress tracking",
      "Limited AI Tutor sessions",
      "1 Skill Assessment",
      "Basic career dashboard",
    ],
  },

  {
    id: "pro",
    name: "Pro",
    description:
      "Learn, prove your skills, and get job-ready.",
    price: 499,
    period: "month",
    icon: Zap,
    buttonText: "Pay with eSewa",
    popular: true,
    features: [
      "Multiple Career Roadmaps",
      "More AI Tutor sessions",
      "Unlimited Skill Assessments",
      "AI Mock Interviews",
      "Career Readiness Score",
      "Evidence-backed Skills",
      "AI CV Generation",
      "Professional CV Export",
    ],
  },

  {
    id: "career_plus",
    name: "Career+",
    description:
      "Complete career preparation for serious learners.",
    price: 999,
    period: "month",
    icon: Crown,
    buttonText: "Pay with eSewa",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited Career Roadmaps",
      "Unlimited AI Tutor sessions",
      "Advanced AI Interviews",
      "Detailed Interview Feedback",
      "Advanced Skill Evidence",
      "Multiple CV Versions",
      "Priority AI Generation",
      "Career Readiness Insights",
    ],
  },
]


export const EMPTY_CV_PROFILE = {
  fullName: "",
  email: "",
  imageUrl: null,

  phone: "",
  location: "",

  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",

  education: [],
  experience: [],
  projects: [],
  certifications: [],
}


export const CV_ENDPOINTS = {
  data: "/api/cv/data",
  profile: "/api/cv/profile",
  pdf: "/api/cv/pdf",
}