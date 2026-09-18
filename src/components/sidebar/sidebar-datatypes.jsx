import {
  Settings,
  Home,
  Map,
  ShieldCheck,
  Mic,
  BarChart3,
  FileText,
  User,
  History,
  BrainCircuit,
  Target,
} from "lucide-react"

const navItems = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },

  {
    title: "Career Roadmap",
    href: "/roadmap",
    icon: Map,
    
  },

  {
    title: "Skill Verification",
    href: "/skills",
    icon: ShieldCheck,
    subitems: [
      {
        title: "My Skills",
        href: "/skills",
        icon: BrainCircuit,
      },
      {
        title: "Assessments",
        href: "/skills/assessments",
        icon: ShieldCheck,
      },
    ],
  },

  {
    title: "AI Interview",
    href: "/interview",
    icon: Mic,
    subitems: [
      {
        title: "Practice Interview",
        href: "/interview/practice",
        icon: Mic,
      },
      {
        title: "Verified Interview",
        href: "/interview/verified",
        icon: ShieldCheck,
      },
    ],
  },

  {
    title: "Career Readiness",
    href: "/readiness",
    icon: BarChart3,
  },

  {
    title: "Verified CV",
    href: "/cv",
    icon: FileText,
  },

  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },

  {
    title: "Activity",
    href: "/activity",
    icon: History,
  },
]

const footerItems = [
  {
    title: "Settings",
    href: "/settings",
    icons: <Settings />,
  },
]

export { footerItems, navItems }