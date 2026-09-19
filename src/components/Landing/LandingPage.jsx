"use client"

import Navbar from "./LandingComponent/Navbar"
import HeroSection from "./LandingComponent/HeroSection"
import AboutSection from "./LandingComponent/AboutSection"
import JourneySection from "./LandingComponent/JourneySection"
import AIInterviewSection from "./LandingComponent/AIInterviewSection"
import CTA from "./LandingComponent/CTA"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {

  useGSAP(() => {
    gsap.to(".robot", {
      x: 280,
      y: 880,
      scale: 0.6,

      scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "center+=10% center",
        scrub: true,

      
      },
    })

    const journeyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".journey-section",

        start: "top bottom",
        end: "center+=10% center",

        scrub: true,

 
      },
    })

    journeyTimeline.to(".robot", {
      x: 700,
      y: 1050,

      opacity: 0,

      scale: 0.5,

      rotate: 15,

      ease: "power2.in",
    })

 

    journeyTimeline.to(".robot", {
      x: -1260,
      y: 1350,

      opacity: 1,

      scale: 0.7,

      rotate: -8,
      duration : 0,

    })

    journeyTimeline.to(".robot", {
      x: -1120,
      y: 1640,

      opacity: 1,

      scale: 0.5,

      rotate: 35,

      ease: "power3.out",
    })


    const interviewTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".ai-interview-section",

        start: "top bottom",
        end: "center+=10% center",

        scrub: true,
        
      },
    })


    // ------------------------------------------
    // PHASE 1
    // Leave Journey
    // ------------------------------------------

    interviewTimeline.to(".robot", {
      x: -850,
      y: 1850,

      scale: 0.4,
      rotate: 0,

      ease: "power2.in",
    })


    // ------------------------------------------
    // PHASE 2
    // Teleport while invisible
    // ------------------------------------------



    // ------------------------------------------
    // PHASE 3
    // Enter AI Interview from right
  

    // ------------------------------------------
    // PHASE 4
    // Settle into final position
    // ------------------------------------------

    interviewTimeline.to(".robot", {
      x: -770,
      y: 2370,

      scale: 0.35,
      opacity : 1,

      ease: "power2.out",
    })
  }, [])

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <main className="relative">
        <HeroSection />

        <AboutSection />

        <JourneySection />

        <AIInterviewSection />

        <CTA />
      </main>
    </div>
  )
}