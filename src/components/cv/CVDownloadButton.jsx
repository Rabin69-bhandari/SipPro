"use client"

import {
  Download,
  LoaderCircle,
} from "lucide-react"


export default function CVDownloadButton({
  downloading,
  disabled,
  onClick,
  fullWidth = false,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      disabled={
        disabled ||
        downloading
      }
      className={`
        inline-flex h-11 items-center
        justify-center gap-2
        rounded-xl
        bg-primary
        px-5
        text-sm
        font-medium
        text-primary-foreground
        transition
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${fullWidth ? "w-full" : ""}
      `}
    >

      {downloading ? (

        <>
          <LoaderCircle className="size-4 animate-spin" />

          Preparing PDF...
        </>

      ) : (

        <>
          <Download className="size-4" />

          Download PDF
        </>

      )}

    </button>

  )
}