"use client";

import { useEffect, useMemo, useState } from "react";

const MAXIMUM_IMAGES = 5;
const MAXIMUM_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function createOptimizedUrl(url) {
  return url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto/"
  );
}

async function getCloudinarySignature() {
  const response = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create Cloudinary signature"
    );
  }

  return data;
}

async function uploadSingleImage(file) {
  const signatureData = await getCloudinarySignature();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append(
    "timestamp",
    String(signatureData.timestamp)
  );
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  // Important:
  // Do not append transformation here unless it was also signed.

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/` +
    `${signatureData.cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Cloudinary upload failed"
    );
  }

  return {
    publicId: data.public_id,
    originalUrl: data.secure_url,
    optimizedUrl: createOptimizedUrl(data.secure_url),
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

export default function CloudinaryTestPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [completedUploads, setCompletedUploads] = useState(0);

  const previewImages = useMemo(() => {
    return selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      previewImages.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previewImages]);

  function handleFileChange(event) {
    setError("");
    setUploadedImages([]);
    setCompletedUploads(0);

    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      setSelectedFiles([]);
      return;
    }

    if (files.length > MAXIMUM_IMAGES) {
      setError(
        `You can upload a maximum of ${MAXIMUM_IMAGES} images.`
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    const invalidType = files.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidType) {
      setError(
        `${invalidType.name} is not supported. Use JPG, PNG, or WebP.`
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAXIMUM_FILE_SIZE
    );

    if (oversizedFile) {
      setError(
        `${oversizedFile.name} is larger than 10 MB.`
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(files);
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) {
      setError("Select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setUploadedImages([]);
      setCompletedUploads(0);

      const results = [];

      // Upload sequentially so we can update progress reliably.
      for (const file of selectedFiles) {
        const result = await uploadSingleImage(file);

        results.push(result);
        setCompletedUploads(results.length);
      }

      setUploadedImages(results);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Image upload error:", error);

      setError(
        error.message || "Something went wrong during upload."
      );
    } finally {
      setUploading(false);
    }
  }

  function removeSelectedImage(indexToRemove) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );

    setError("");
  }

  function clearEverything() {
    setSelectedFiles([]);
    setUploadedImages([]);
    setCompletedUploads(0);
    setError("");
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-indigo-600">
              SIP Assessment Evidence
            </p>

            <h1 className="text-2xl font-bold md:text-3xl">
              Upload evidence images
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload up to {MAXIMUM_IMAGES} JPG, PNG, or
              WebP images. Each image must be below 10 MB.
            </p>
          </div>

          <label
            className={[
              "flex min-h-48 cursor-pointer flex-col",
              "items-center justify-center rounded-2xl",
              "border-2 border-dashed border-border",
              "bg-secondary/30 px-6 text-center",
              "transition hover:border-indigo-500",
              "hover:bg-indigo-500/5",
              uploading
                ? "pointer-events-none opacity-60"
                : "",
            ].join(" ")}
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-indigo-600 text-xl text-white">
              +
            </div>

            <p className="font-semibold">
              Select assessment images
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Click here to select files from your device
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {previewImages.length > 0 && (
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">
                  Selected images
                </h2>

                <span className="text-sm text-muted-foreground">
                  {previewImages.length}/{MAXIMUM_IMAGES}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {previewImages.map((preview, index) => (
                  <article
                    key={`${preview.name}-${index}`}
                    className="overflow-hidden rounded-2xl border border-border bg-background"
                  >
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="h-48 w-full object-cover"
                    />

                    <div className="flex items-center justify-between gap-3 p-3">
                      <p className="truncate text-sm">
                        {preview.name}
                      </p>

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() =>
                          removeSelectedImage(index)
                        }
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {uploading && (
            <div className="mt-6 rounded-xl bg-indigo-500/10 p-4">
              <p className="text-sm font-medium text-indigo-600">
                Uploading {completedUploads} of{" "}
                {selectedFiles.length} images...
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${
                      selectedFiles.length > 0
                        ? (completedUploads /
                            selectedFiles.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={uploadImages}
              disabled={
                selectedFiles.length === 0 || uploading
              }
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading images..."
                : "Upload to Cloudinary"}
            </button>

            <button
              type="button"
              onClick={clearEverything}
              disabled={uploading}
              className="rounded-xl border border-border px-6 py-3 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Upload successful
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                These original Cloudinary URLs can now be
                saved in Supabase or sent to your AI route.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {uploadedImages.map((image) => (
                <article
                  key={image.publicId}
                  className="overflow-hidden rounded-2xl border border-border"
                >
                  <img
                    src={image.optimizedUrl}
                    alt="Uploaded assessment evidence"
                    className="h-64 w-full object-cover"
                  />

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Public ID
                      </p>

                      <p className="break-all text-sm">
                        {image.publicId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Original URL
                      </p>

                      <a
                        href={image.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-sm text-indigo-600 hover:underline"
                      >
                        {image.originalUrl}
                      </a>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {image.width} × {image.height} ·{" "}
                      {image.format?.toUpperCase()}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-secondary/60 p-4">
              <p className="mb-2 text-sm font-semibold">
                URLs ready for Gemini:
              </p>

              <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
                {JSON.stringify(
                  uploadedImages.map(
                    (image) => image.originalUrl
                  ),
                  null,
                  2
                )}
              </pre>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}