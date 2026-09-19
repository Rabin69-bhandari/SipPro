"use client"

import CVHeader from "@/components/cv/CVHeader"
import CVCareerSelector from "@/components/cv/CVCareerSelector"
import CVEditor from "@/components/cv/CVEditor"
import CVPreview from "@/components/cv/CVPreview"
import CVDownloadButton from "@/components/cv/CVDownloadButton"
import CVDownloadModal from "@/components/cv/CVDownloadModal"

import { LoaderCircle, RefreshCw } from "lucide-react"

import { useCVData } from "@/hooks/cv/useCVData"
import { useCVDownload } from "@/hooks/cv/useCVDownload"


export default function CVPage() {
  // ==========================================================
  // CV DATA
  // ==========================================================

  const {
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
    showError,
  } = useCVData()


  // ==========================================================
  // PDF DOWNLOAD
  // ==========================================================

  const {
    downloading,
    showDownloadModal,
    openDownloadModal,
    closeDownloadModal,
    saveAndDownload,
  } = useCVDownload({
    profile,
    career,
    handleSave,
    showError,
  })


  // ==========================================================
  // LOADING
  // ==========================================================

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


  // ==========================================================
  // INITIAL LOAD ERROR
  // ==========================================================

  if (error && !data) {
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
            type="button"
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


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <CVHeader
          career={career}
          saving={saving}
          saveMessage={saveMessage}
          onSave={handleSave}
        />


        {/* ================================================== */}
        {/* DOWNLOAD */}
        {/* ================================================== */}

        <div className="mt-5 hidden justify-end xl:flex">
          <CVDownloadButton
            downloading={downloading}
            disabled={saving || !career}
            onClick={openDownloadModal}
          />
        </div>


        {/* ================================================== */}
        {/* CAREER SELECTOR */}
        {/* ================================================== */}

        <div className="mt-6">
          <CVCareerSelector
            careers={data?.careers ?? []}
            selectedCareerId={selectedCareerId}
            onChange={setSelectedCareerId}
          />
        </div>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}


        {/* ================================================== */}
        {/* CV BUILDER */}
        {/* ================================================== */}

        <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(600px,1.1fr)]">

          {/* EDITOR */}

          <CVEditor
            profile={profile}
            career={career}
            onProfileChange={handleProfileChange}
          />


          {/* PREVIEW */}

          <div className="xl:sticky xl:top-6">
            <CVPreview
              profile={profile}
              career={career}
            />
          </div>

        </section>


        {/* ================================================== */}
        {/* MOBILE ACTIONS */}
        {/* ================================================== */}

        <div className="mt-6 grid gap-3 xl:hidden">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || downloading}
            className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save CV Information"}
          </button>


          <CVDownloadButton
            downloading={downloading}
            disabled={saving || !career}
            onClick={openDownloadModal}
            fullWidth
          />

        </div>

      </div>


      {/* ==================================================== */}
      {/* DOWNLOAD MODAL */}
      {/* ==================================================== */}

      <CVDownloadModal
        open={showDownloadModal}
        career={career}
        downloading={downloading}
        onClose={closeDownloadModal}
        onConfirm={saveAndDownload}
      />

    </main>
  )
}