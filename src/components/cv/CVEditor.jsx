"use client"

import CVProfileForm from "@/components/cv/CVProfileForm"
import CVEducationForm from "@/components/cv/CVEducationForm"
import CVExperienceForm from "@/components/cv/CVExperienceForm"
import CVProjectsForm from "@/components/cv/CVProjectsForm"
import CVCertificationsForm from "@/components/cv/CVCertificationsForm"
import CVEvidence from "@/components/cv/CVEvidence"


export default function CVEditor({
  profile,
  career,
  onProfileChange,
}) {

  return (

    <div className="space-y-5">

      <CVProfileForm
        profile={profile}
        onChange={
          onProfileChange
        }
      />


      <CVEducationForm
        items={
          profile.education
        }
        onChange={
          (value) =>
            onProfileChange(
              "education",
              value
            )
        }
      />


      <CVExperienceForm
        items={
          profile.experience
        }
        onChange={
          (value) =>
            onProfileChange(
              "experience",
              value
            )
        }
      />


      <CVProjectsForm
        items={
          profile.projects
        }
        onChange={
          (value) =>
            onProfileChange(
              "projects",
              value
            )
        }
      />


      <CVCertificationsForm
        items={
          profile.certifications
        }
        onChange={
          (value) =>
            onProfileChange(
              "certifications",
              value
            )
        }
      />


      <CVEvidence
        career={career}
      />

    </div>

  )
}