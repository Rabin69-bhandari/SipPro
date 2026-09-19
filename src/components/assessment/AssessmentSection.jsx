"use client"

import { useEffect, useRef, useState } from "react"
import {
  ImagePlus,
  Trash2,
  Upload,
} from "lucide-react"


export default function AssessmentSection({
  number,
  title,
  data,
  value,
  onChange,
  placeholder,

  // Only used by Practical Task
  allowImage = false,
  image = null,
  onImageChange,
}) {

  const inputRef = useRef(null)

  const [imageError, setImageError] =
    useState(null)


  // ==========================================
  // CLEAN BLOB URL WHEN COMPONENT UNMOUNTS
  // ==========================================

  useEffect(() => {
    return () => {
      if (image?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(
          image.previewUrl
        )
      }
    }
  }, [])


  // ==========================================
  // SELECT IMAGE
  // ==========================================

  const handleImageSelect = (event) => {

    const file =
      event.target.files?.[0]


    if (!file) {
      return
    }


    setImageError(null)


    // ==========================================
    // VALIDATE IMAGE TYPE
    // ==========================================

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ]


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setImageError(
        "Please upload a PNG, JPG, JPEG, or WEBP image."
      )

      event.target.value = ""

      return
    }


    // ==========================================
    // VALIDATE SIZE
    // 5 MB MAX
    // ==========================================

    const maxSize =
      5 * 1024 * 1024


    if (file.size > maxSize) {

      setImageError(
        "Image must be smaller than 5 MB."
      )

      event.target.value = ""

      return
    }


    // ==========================================
    // REMOVE OLD PREVIEW
    // ==========================================

    if (
      image?.previewUrl?.startsWith(
        "blob:"
      )
    ) {

      URL.revokeObjectURL(
        image.previewUrl
      )

    }


    // ==========================================
    // CREATE LOCAL PREVIEW
    // ==========================================

    const previewUrl =
      URL.createObjectURL(file)


    onImageChange?.({
      file,
      previewUrl,
    })

  }


  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = () => {

    if (
      image?.previewUrl?.startsWith(
        "blob:"
      )
    ) {

      URL.revokeObjectURL(
        image.previewUrl
      )

    }


    if (inputRef.current) {
      inputRef.current.value = ""
    }


    setImageError(null)

    onImageChange?.(null)

  }


  return (

    <div className="mb-5 rounded-2xl border border-border bg-card p-6">


      {/* ================================= */}
      {/* SECTION HEADER */}
      {/* ================================= */}

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold">

            {number}

          </div>


          <h2 className="font-semibold text-foreground">

            {title}

          </h2>

        </div>


        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium">

          {data?.marks ?? 0} marks

        </span>

      </div>


      {/* ================================= */}
      {/* QUESTION / TASK */}
      {/* ================================= */}

      <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-foreground">

        {data?.prompt}

      </p>


      {/* ================================= */}
      {/* TEXT ANSWER */}
      {/* ================================= */}

      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-foreground">

          Your Answer

        </label>


        <textarea

          value={
            value ?? ""
          }

          onChange={(event) =>
            onChange(
              event.target.value
            )
          }

          placeholder={
            placeholder
          }

          rows={6}

          className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"

        />

      </div>


      {/* ================================= */}
      {/* PRACTICAL IMAGE */}
      {/* ================================= */}

      {allowImage && (

        <div className="mt-6 border-t border-border pt-6">


          {/* HEADER */}

          <div className="mb-4 flex items-start justify-between gap-4">

            <div>

              <h3 className="text-sm font-medium text-foreground">

                Supporting Evidence

              </h3>


              <p className="mt-1 text-xs leading-5 text-muted-foreground">

                Upload a screenshot or image showing your practical work.

              </p>

            </div>


            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">

              Optional

            </span>

          </div>


          {/* ================================= */}
          {/* HIDDEN FILE INPUT */}
          {/* ================================= */}

          <input

            ref={inputRef}

            type="file"

            accept="image/png,image/jpeg,image/webp"

            onChange={
              handleImageSelect
            }

            className="hidden"

          />


          {/* ================================= */}
          {/* UPLOAD AREA */}
          {/* ================================= */}

          {!image ? (

            <button

              type="button"

              onClick={() =>
                inputRef.current?.click()
              }

              className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 py-10 text-center transition duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"

            >

              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">

                <ImagePlus className="size-5" />

              </div>


              <p className="mt-4 text-sm font-medium text-foreground">

                Upload practical screenshot

              </p>


              <p className="mt-1 text-xs text-muted-foreground">

                PNG, JPG or WEBP • Maximum 5 MB

              </p>


              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">

                <Upload className="size-3.5" />

                Choose image

              </div>

            </button>

          ) : (

            // =================================
            // IMAGE PREVIEW
            // =================================

            <div className="overflow-hidden rounded-xl border border-border bg-background">


              {/* PREVIEW */}

              <div className="flex min-h-[220px] items-center justify-center bg-muted/30 p-4">

                <img

                  src={
                    image.previewUrl
                  }

                  alt="Practical submission preview"

                  className="max-h-[420px] w-auto max-w-full rounded-lg object-contain"

                />

              </div>


              {/* FILE DETAILS */}

              <div className="flex flex-col gap-4 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">


                <div className="min-w-0">

                  <p className="truncate text-sm font-medium text-foreground">

                    {image.file?.name ||
                      "Practical evidence"}

                  </p>


                  {image.file?.size && (

                    <p className="mt-1 text-xs text-muted-foreground">

                      {(
                        image.file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB

                    </p>

                  )}

                </div>


                {/* ACTIONS */}

                <div className="flex shrink-0 items-center gap-2">


                  <button

                    type="button"

                    onClick={() =>
                      inputRef.current?.click()
                    }

                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary"

                  >

                    Replace

                  </button>


                  <button

                    type="button"

                    onClick={
                      handleRemoveImage
                    }

                    className="flex size-9 items-center justify-center rounded-lg border border-destructive/20 text-destructive transition hover:bg-destructive/5"

                    aria-label="Remove practical image"

                  >

                    <Trash2 className="size-4" />

                  </button>

                </div>

              </div>

            </div>

          )}


          {/* ================================= */}
          {/* IMAGE ERROR */}
          {/* ================================= */}

          {imageError && (

            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">

              <p className="text-xs text-destructive">

                {imageError}

              </p>

            </div>

          )}

        </div>

      )}

    </div>

  )

}