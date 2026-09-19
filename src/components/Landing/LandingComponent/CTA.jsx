import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
   <section
  className="
    relative
    flex
    min-h-[100svh]
    items-center
    overflow-hidden
    bg-surface-soft
    py-16
  "
>
      {/* =====================================================
          TOP RIGHT DECORATIVE CIRCLE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[120px]
          -top-[160px]

          h-[330px]
          w-[330px]

          rounded-full
          bg-secondary/70

          sm:-right-[140px]
          sm:-top-[190px]
          sm:h-[400px]
          sm:w-[400px]

          lg:-right-[150px]
          lg:-top-[210px]
          lg:h-[470px]
          lg:w-[470px]
        "
      />

      {/* =====================================================
          BOTTOM LEFT DECORATIVE CIRCLE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[180px]
          -left-[150px]

          h-[330px]
          w-[330px]

          rounded-full
          bg-secondary/70

          sm:-bottom-[210px]
          sm:-left-[170px]
          sm:h-[400px]
          sm:w-[400px]

          lg:-bottom-[240px]
          lg:-left-[190px]
          lg:h-[470px]
          lg:w-[470px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-[1400px]
          flex-col
          items-center
          px-5
          text-center
          sm:px-8
          lg:px-12
          xl:px-14
        "
      >
        {/* EYEBROW */}

        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.2em]
            text-foreground/70

            sm:text-[11px]
            lg:text-[12px]
          "
        >
          Your learning starts here
        </p>

        {/* =====================================================
            MAIN HEADING
        ===================================================== */}

        <h2
          className="
            mt-6
            max-w-[1000px]

            text-[34px]
            font-normal
            leading-[1.18]
            tracking-[0.04em]
            text-foreground

            sm:text-[42px]
            md:text-[48px]
            lg:text-[54px]
          "
        >
          Don&apos;t just learn.
          <br />

          <span className="text-brand">
            Learn what moves you forward.
          </span>
        </h2>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <p
          className="
            mx-auto
            mt-7
            max-w-[760px]

            text-[13px]
            leading-[1.8]
            tracking-[0.08em]
            text-muted-foreground

            sm:text-[14px]
            lg:text-[15px]
          "
        >
          Discover personalized learning, practice with AI, build real skills,
          and grow with guidance designed around you.
        </p>

        {/* =====================================================
            CTA BUTTON
        ===================================================== */}

        <Link
          href="/sign-up"
          className="
            group

            mt-10
            inline-flex
            h-[48px]
            items-center
            justify-center
            gap-3

            rounded-[8px]
            bg-primary
            px-7

            text-[12px]
            font-medium
            tracking-[0.12em]
            text-primary-foreground

            shadow-sm

            transition-all
            duration-300

            hover:-translate-y-[2px]
            hover:shadow-lg

            sm:h-[50px]
            sm:px-8
            sm:text-[13px]
          "
        >
          Start Learning

          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>
      </div>
    </section>
  );
}