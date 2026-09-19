import React from 'react'
import Navbar from './LandingComponent/Navbar'
import HeroSection from './LandingComponent/HeroSection'
import AboutSection from './LandingComponent/AboutSection'
import JourneySection from './LandingComponent/JourneySection'
import AIInterviewSection from './LandingComponent/AIInterviewSection'
import CTASection from './LandingComponent/CTA'

const LandingPage = () => {
  return (
    <div>

       <Navbar />
       <HeroSection />
       <AboutSection />
       <JourneySection />
       <AIInterviewSection />
       <CTASection />
    </div>
  )
}

export default LandingPage