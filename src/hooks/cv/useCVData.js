"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  CV_ENDPOINTS,
  EMPTY_CV_PROFILE} from '../../constant/data'

export function useCVData() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [data, setData] =
    useState(null)

  const [profile, setProfile] =
    useState(EMPTY_CV_PROFILE)

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

  const [
    saveMessage,
    setSaveMessage,
  ] = useState("")


  // ==========================================================
  // FETCH CV DATA
  // ==========================================================

  const fetchCVData =
    useCallback(async () => {

      try {

        setLoading(true)
        setError(null)


        const response =
          await fetch(
            CV_ENDPOINTS.data,
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
          ...EMPTY_CV_PROFILE,
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


  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {

    fetchCVData()

  }, [fetchCVData])


  // ==========================================================
  // SELECTED CAREER
  // ==========================================================

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


  // ==========================================================
  // PROFILE CHANGE
  // ==========================================================

  const handleProfileChange =
    useCallback(
      (field, value) => {

        setProfile(
          (current) => ({
            ...current,
            [field]: value,
          })
        )


        setSaveMessage("")

      },
      []
    )


  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave =
    useCallback(
      async () => {

        try {

          setSaving(true)
          setError(null)
          setSaveMessage("")


          const response =
            await fetch(
              CV_ENDPOINTS.profile,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({

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


          return true


        } catch (error) {

          console.error(
            "CV save error:",
            error
          )


          setError(
            error.message ||
            "Failed to save CV."
          )


          return false


        } finally {

          setSaving(false)

        }

      },
      [profile]
    )


  // ==========================================================
  // MANUAL ERROR CONTROL
  // ==========================================================

  const clearError =
    useCallback(() => {

      setError(null)

    }, [])


  const showError =
    useCallback((message) => {

      setError(message)

    }, [])


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    data,
    profile,
    career,

    selectedCareerId,

    loading,
    saving,

    error,
    saveMessage,

    setSelectedCareerId,

    handleProfileChange,
    handleSave,

    fetchCVData,

    clearError,
    showError,
  }
}