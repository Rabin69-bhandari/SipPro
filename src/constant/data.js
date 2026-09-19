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


export const features = [
  {
    number: "01",
    title: "Learn Your Way",
    description:
      "Explore lessons and resources that fit your interests, goals, and learning pace.",
    icon: (
      <svg
        viewBox="0 0 100 100"
        className="h-[52px] w-[52px] text-primary sm:h-[56px] sm:w-[56px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="9" fill="currentColor" />
        <path d="M50 10V25" />
        <path d="M50 75V90" />
        <path d="M10 50H25" />
        <path d="M75 50H90" />
      </svg>
    ),
  },

  {
    number: "02",
    title: "Build Real Skills",
    description:
      "Go beyond memorizing concepts with practical knowledge you can actually use.",
    icon: (
      <svg
        viewBox="0 0 100 100"
        className="h-[52px] w-[52px] text-primary sm:h-[56px] sm:w-[56px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        aria-hidden="true"
      >
        <path d="M39 88c-3-13-13-15-18-22-8-11-8-28 0-39 7-10 19-16 33-16 20 0 36 16 36 36 0 16-10 29-24 34-6 2-9 6-10 11" />
        <path d="M38 52c-8-2-13-8-13-15 0-10 8-17 18-17 3 0 6 1 8 2 3-4 8-6 13-6 10 0 18 8 18 18 0 8-5 14-12 17-2 7-7 12-14 15" />
        <path d="M48 33c-1 8 3 14 11 16" />
      </svg>
    ),
  },

  {
    number: "03",
    title: "See Your Progress",
    description:
      "Track your growth, stay motivated, and know exactly how far you've come.",
    icon: (
      <svg
        viewBox="0 0 100 100"
        className="h-[52px] w-[52px] text-primary sm:h-[56px] sm:w-[56px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        aria-hidden="true"
      >
        <path d="M15 82V64c0-6 4-10 10-10h8c6 0 10-4 10-10v-8c0-6 4-10 10-10h8c6 0 10-4 10-10v-5" />
        <path d="M55 81 82 54" />
        <path d="M64 54h18v18" />
      </svg>
    ),
  },
];
