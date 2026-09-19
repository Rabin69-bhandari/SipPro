"use client";

import Image from "next/image";

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        {/* Logo animation */}
        <div className="relative flex size-24 items-center justify-center">
          {/* Outer pulse */}
          <div className="absolute size-24 animate-ping rounded-full bg-primary/10" />

          {/* Middle pulse */}
          <div className="absolute size-20 animate-pulse rounded-full bg-primary/10" />

          {/* Logo container */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
            <Image
              src="/images/mdi_leaf.png"
              alt="LearnChen"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Brand */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            LearnChen
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Preparing your learning space
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-6 h-1 w-36 overflow-hidden rounded-full bg-muted">
          <div className="learnchen-loader h-full w-1/3 rounded-full bg-primary" />
        </div>
      </div>

      <style jsx>{`
        @keyframes learnchenLoading {
          0% {
            transform: translateX(-150%);
          }

          100% {
            transform: translateX(450%);
          }
        }

        .learnchen-loader {
          animation: learnchenLoading 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}