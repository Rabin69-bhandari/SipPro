"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import CVHeader from "@/components/cv/CVHeader"
import CVCareerSelector from "@/components/cv/CVCareerSelector"
import CVProfileForm from "@/components/cv/CVProfileForm"
import CVEducationForm from "@/components/cv/CVEducationForm"
import CVExperienceForm from "@/components/cv/CVExperienceForm"
import CVProjectsForm from "@/components/cv/CVProjectsForm"
import CVCertificationsForm from "@/components/cv/CVCertificationsForm"
import CVEvidence from "@/components/cv/CVEvidence"
import CVPreview from "@/components/cv/CVPreview"

import {
  LoaderCircle,
  RefreshCw,
} from "lucide-react"


const emptyProfile = {
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


export default function CVPage() {

  // ==========================================
  // STATE
  // ==========================================

  const [data, setData] =
    useState(null)

  const [profile, setProfile] =
    useState(emptyProfile)

  const [
    selectedCareerId,
    setSelectedCareerId,
  ] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState(null)

  const [saveMessage, setSaveMessage] =
    useState("")


  // ==========================================
  // FETCH CV DATA
  // ==========================================

  const fetchCVData =
    useCallback(async () => {

      try {

        setLoading(true)
        setError(null)


        const response =
          await fetch(
            "/api/cv/data",
            {
              method: "GET",
              cache: "no-store",
            }
          )


        const result =
          await response.json()


        if (!response.ok) {

          throw new Error(
            result.error ||
            "Failed to load CV data."
          )

        }


        setData(result)


        setProfile({
          ...emptyProfile,
          ...(result.profile ?? {}),
        })


        if (
          result.careers?.length > 0
        ) {

          setSelectedCareerId(
            (current) => {

              const exists =
                result.careers.some(
                  (career) =>
                    career.id === current
                )


              return exists
                ? current
                : result.careers[0].id

            }
          )

        }


      } catch (error) {

        console.error(
          "CV fetch error:",
          error
        )


        setError(
          error.message ||
          "Failed to load CV builder."
        )


      } finally {

        setLoading(false)

      }

    }, [])


  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {

    fetchCVData()

  }, [fetchCVData])


  // ==========================================
  // SELECTED CAREER
  // ==========================================

  const career =
    useMemo(() => {

      if (
        !data?.careers?.length
      ) {
        return null
      }


      return (
        data.careers.find(
          (item) =>
            item.id ===
            selectedCareerId
        ) ??
        data.careers[0]
      )

    }, [
      data,
      selectedCareerId,
    ])


  // ==========================================
  // PROFILE FIELD CHANGE
  // ==========================================

  const handleProfileChange =
    (field, value) => {

      setProfile(
        (current) => ({
          ...current,
          [field]: value,
        })
      )


      if (saveMessage) {
        setSaveMessage("")
      }

    }


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave =
    async () => {

      try {

        setSaving(true)
        setError(null)
        setSaveMessage("")


        const response =
          await fetch(
            "/api/cv/profile",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                phone:
                  profile.phone,

                location:
                  profile.location,

                linkedinUrl:
                  profile.linkedinUrl,

                githubUrl:
                  profile.githubUrl,

                portfolioUrl:
                  profile.portfolioUrl,

                education:
                  profile.education,

                experience:
                  profile.experience,

                projects:
                  profile.projects,

                certifications:
                  profile.certifications,

              }),
            }
          )


        const result =
          await response.json()


        if (!response.ok) {

          throw new Error(
            result.error ||
            "Failed to save CV."
          )

        }


        setProfile(
          (current) => ({
            ...current,
            ...result.profile,
          })
        )


        setSaveMessage(
          "CV information saved."
        )


      } catch (error) {

        console.error(
          "CV save error:",
          error
        )


        setError(
          error.message ||
          "Failed to save CV."
        )


      } finally {

        setSaving(false)

      }

    }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <main className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <LoaderCircle className="mx-auto size-7 animate-spin text-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Preparing your CV workspace...
          </p>

        </div>

      </main>

    )

  }


  // ==========================================
  // ERROR WITHOUT DATA
  // ==========================================

  if (
    error &&
    !data
  ) {

    return (

      <main className="flex min-h-[70vh] items-center justify-center px-5">

        <div className="max-w-md text-center">

          <p className="font-medium">
            Could not load your CV
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            onClick={fetchCVData}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >

            <RefreshCw className="size-4" />

            Try Again

          </button>

        </div>

      </main>

    )

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="min-h-full bg-background">

      <div className="mx-auto w-full max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">


        {/* HEADER */}

        <CVHeader
          career={career}
          saving={saving}
          saveMessage={saveMessage}
          onSave={handleSave}
        />


        {/* CAREER SELECTOR */}

        <div className="mt-6">

          <CVCareerSelector
            careers={
              data?.careers ?? []
            }
            selectedCareerId={
              career?.id ?? null
            }
            onChange={
              setSelectedCareerId
            }
          />

        </div>


        {/* ERROR */}

        {error && (

          <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>

        )}


        {/* ================================== */}
        {/* BUILDER */}
        {/* ================================== */}

        <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(600px,1.1fr)]">


          {/* ================================== */}
          {/* LEFT EDITOR */}
          {/* ================================== */}

          <div className="space-y-5">

            <CVProfileForm
              profile={profile}
              onChange={
                handleProfileChange
              }
            />


            <CVEducationForm
              items={
                profile.education
              }
              onChange={
                (value) =>
                  handleProfileChange(
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
                  handleProfileChange(
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
                  handleProfileChange(
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
                  handleProfileChange(
                    "certifications",
                    value
                  )
              }
            />


            <CVEvidence
              career={career}
            />

          </div>


          {/* ================================== */}
          {/* RIGHT PREVIEW */}
          {/* ================================== */}

          <div className="xl:sticky xl:top-6">

            <CVPreview
              profile={profile}
              career={career}
            />

          </div>

        </section>


        {/* MOBILE SAVE */}

        <div className="mt-6 xl:hidden">

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >

            {
              saving
                ? "Saving..."
                : "Save CV Information"
            }

          </button>

        </div>


      </div>

    </main>

  )
}