"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

const SmoothScrolling = ({ children }) => {
  useEffect(() => {
    // ==========================================
    // LENIS
    // ==========================================

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: (t) =>
        1 - Math.pow(1 - t, 3),
    })


    // ==========================================
    // SYNC LENIS WITH SCROLLTRIGGER
    // ==========================================

    lenis.on("scroll", ScrollTrigger.update)


    // ==========================================
    // GSAP TICKER
    // ==========================================

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)


    // Prevent GSAP from trying to compensate
    // for dropped frames.
    gsap.ticker.lagSmoothing(0)


    // ==========================================
    // REFRESH SCROLLTRIGGER
    // ==========================================

    ScrollTrigger.refresh()


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      lenis.off(
        "scroll",
        ScrollTrigger.update
      )

      gsap.ticker.remove(update)

      lenis.destroy()
    }
  }, [])


  // ==========================================
  // UI
  // ==========================================

  return children
}

export default SmoothScrolling