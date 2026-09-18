
import {
  Settings,
  LogOut,
  Home,
  Heart,
  Search,
  Wallet,
  CreditCardPlus,
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  MessageCircle,
  Bell,
  User,
  BarChart3,
  Bookmark,
  History,
  HelpCircle,
} from "lucide-react"

const navItems = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },

  {
    title: "Learning",
    href: "/learning",
    icon: BookOpen,
    subitems: [
      {
        title: "Courses",
        href: "/learning/courses",
        icon: BookOpen,
      },
      {
        title: "My Learning",
        href: "/learning/my-learning",
        icon: GraduationCap,
      },
      {
        title: "Bookmarks",
        href: "/learning/bookmarks",
        icon: Bookmark,
      },
    ],
  },

  {
    title: "Favourite",
    href: "/favourite",
    icon: Heart,
  },

  {
    title: "Search",
    href: "/search",
    icon: Search,
  },

  {
    title: "Community",
    href: "/community",
    icon: Users,
    subitems: [
      {
        title: "Posts",
        href: "/community/posts",
        icon: MessageCircle,
      },
      {
        title: "Competitions",
        href: "/community/competitions",
        icon: Trophy,
      },
      {
        title: "Leaderboard",
        href: "/community/leaderboard",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "Payment",
    href: "/payment",
    icon: Wallet,
    subitems: [
      {
        title: "eSewa",
        href: "/payment/esewa",
        icon: CreditCardPlus,
      },
      {
        title: "Bank",
        href: "/payment/bank",
        icon: CreditCardPlus,
      },
    ],
  },

  {
    title: "Achievements",
    href: "/achievements",
    icon: Trophy,
  },

  {
    title: "History",
    href: "/history",
    icon: History,
  },
]

const footerItems = [
  {
    title: "Settings",
    href: "/settings",
    icons: <Settings />,
  },
  {
    title: "LogOut",
    href: "/logout",
    icons: <LogOut />,
  },
]

export { footerItems, navItems }

