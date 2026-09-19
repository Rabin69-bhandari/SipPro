"use client"

import {
  useCallback,
  useState,
} from "react"

import {
  CV_ENDPOINTS,
} from '../../constant/data'


export function useCVDownload({
  profile,
  career,
  handleSave,
  showError,
}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    downloading,
    setDownloading,
  ] = useState(false)

  const [
    showDownloadModal,
    setShowDownloadModal,
  ] = useState(false)


  // ==========================================================
  // OPEN MODAL
  // ==========================================================

  const openDownloadModal =
    useCallback(() => {

      if (!career?.id) {

        showError?.(
          "Please select a career before downloading your CV."
        )

        return
      }


      setShowDownloadModal(true)

    }, [
      career,
      showError,
    ])


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeDownloadModal =
    useCallback(() => {

      if (downloading) {
        return
      }


      setShowDownloadModal(false)

    }, [downloading])


  // ==========================================================
  // BUILD SAFE FILE NAME
  // ==========================================================

  const createSafeFileName =
    useCallback(() => {

      const safeName =
        (
          profile?.fullName ||
          "career"
        )
          .trim()
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          )


      const safeCareer =
        (
          career?.title ||
          "cv"
        )
          .trim()
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          )


      return (
        `${safeName || "career"}-` +
        `${safeCareer || "cv"}-CV.pdf`
      )

    }, [
      profile,
      career,
    ])


  // ==========================================================
  // SAVE + DOWNLOAD
  // ==========================================================

  const saveAndDownload =
    useCallback(
      async () => {

        if (!career?.id) {

          showError?.(
            "Please select a career before downloading your CV."
          )

          setShowDownloadModal(false)

          return
        }


        try {

          setDownloading(true)


          // ==================================================
          // SAVE CV FIRST
          // ==================================================

          const saved =
            await handleSave()


          if (!saved) {

            return

          }


          // ==================================================
          // GENERATE PDF
          // ==================================================

          const response =
            await fetch(
              CV_ENDPOINTS.pdf,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    careerGoalId:
                      career.id,
                  }),
              }
            )


          // ==================================================
          // HANDLE API ERROR
          // ==================================================

          if (!response.ok) {

            const contentType =
              response.headers.get(
                "content-type"
              ) || ""


            let message =
              "Failed to generate PDF."


            if (
              contentType.includes(
                "application/json"
              )
            ) {

              const result =
                await response.json()

              message =
                result.error ||
                message

            } else {

              const text =
                await response.text()

              if (text) {
                message = text
              }

            }


            throw new Error(
              message
            )

          }


          // ==================================================
          // GET PDF
          // ==================================================

          const blob =
            await response.blob()


          if (
            !blob ||
            blob.size === 0
          ) {

            throw new Error(
              "Generated PDF was empty."
            )

          }


          // ==================================================
          // TEMP URL
          // ==================================================

          const url =
            window.URL.createObjectURL(
              blob
            )


          // ==================================================
          // DOWNLOAD
          // ==================================================

          const link =
            document.createElement(
              "a"
            )


          link.href = url

          link.download =
            createSafeFileName()


          document.body.appendChild(
            link
          )


          link.click()


          document.body.removeChild(
            link
          )


          // ==================================================
          // CLEANUP
          // ==================================================

          window.setTimeout(
            () => {

              window.URL.revokeObjectURL(
                url
              )

            },
            1000
          )


          setShowDownloadModal(
            false
          )


        } catch (error) {

          console.error(
            "CV download error:",
            error
          )


          showError?.(
            error.message ||
            "Failed to download CV."
          )


        } finally {

          setDownloading(false)

        }

      },
      [
        career,
        handleSave,
        showError,
        createSafeFileName,
      ]
    )


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    downloading,
    showDownloadModal,

    openDownloadModal,
    closeDownloadModal,
    saveAndDownload,
  }
}