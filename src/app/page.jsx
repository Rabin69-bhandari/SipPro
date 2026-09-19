"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import LandingPage from "@/components/Landing/LandingPage"
import SmoothScrolling from "@/components/Landing/SmoothScrolling"
import AppLoader from "@/components/ui/AppLoader"


export default function Home() {
  const { user, isLoaded } = useUser()
  const router = useRouter()


  // ============================================================
  // AUTH REDIRECT
  // ============================================================

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/home")
    }
  }, [isLoaded, user, router])


  // ============================================================
  // CLERK LOADING
  // ============================================================

  if (!isLoaded) {
    return <AppLoader />
  }


  // ============================================================
  // AUTHENTICATED USER
  // Keep loader visible while redirecting to /home
  // ============================================================

  if (user) {
    return <AppLoader />
  }


  // ============================================================
  // LANDING PAGE
  // ============================================================

  return (
    <SmoothScrolling>
      <LandingPage />
    </SmoothScrolling>
  )
}