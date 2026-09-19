"use client"

import {
  Download,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react"


export default function CVDownloadModal({
  open,
  career,
  downloading,
  onClose,
  onConfirm,
}) {

  if (!open) {
    return null
  }


  return (

    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-background/80
        px-5
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full max-w-md
          rounded-3xl
          border border-border
          bg-card
          p-6
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div
            className="
              flex size-12
              shrink-0
              items-center justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >

            <FileText className="size-6" />

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={downloading}
            aria-label="Close"
            className="
              flex size-9
              items-center justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              disabled:opacity-40
            "
          >

            <X className="size-4" />

          </button>

        </div>


        {/* CONTENT */}

        <div className="mt-5">

          <h2
            className="
              text-xl
              font-semibold
              tracking-tight
              text-card-foreground
            "
          >

            Save before downloading?

          </h2>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-muted-foreground
            "
          >

            Your latest CV information
            will be saved first. Then
            we&apos;ll generate your PDF
            using the selected career
            and download it automatically.

          </p>


          {career && (

            <div
              className="
                mt-5
                rounded-xl
                border border-border
                bg-muted/30
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >

                Selected Career

              </p>


              <p
                className="
                  mt-1
                  font-medium
                  text-foreground
                "
              >

                {career.title}

              </p>

            </div>

          )}

        </div>


        {/* ACTIONS */}

        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-end
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={downloading}
            className="
              inline-flex h-11
              items-center justify-center
              rounded-xl
              border border-border
              bg-background
              px-5
              text-sm
              font-medium
              text-foreground
              transition
              hover:bg-muted
              disabled:opacity-50
            "
          >

            Cancel

          </button>


          <button
            type="button"
            onClick={onConfirm}
            disabled={downloading}
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-xl
              bg-primary
              px-5
              text-sm
              font-medium
              text-primary-foreground
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {downloading ? (

              <>
                <LoaderCircle className="size-4 animate-spin" />

                Saving & Generating...
              </>

            ) : (

              <>
                <Download className="size-4" />

                Save & Download PDF
              </>

            )}

          </button>

        </div>

      </div>

    </div>

  )
}