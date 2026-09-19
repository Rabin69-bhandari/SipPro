import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { getRoadmapVisual } from "@/lib/utils"

const RoadmapCard = ({ roadmap, onClick }) => {
  // =========================================================
  // ROADMAP DATA
  // =========================================================

  const type =
    roadmap?.roadmapData?.type || "general"

  const title =
    roadmap?.title || "Career Roadmap"

  const description =
    roadmap?.roadmapData?.description ||
    "Explore a personalized learning path designed around your career goals."

  const experience =
    roadmap?.experience || "Beginner"


  // =========================================================
  // ROADMAP VISUAL
  // =========================================================

  const visual = getRoadmapVisual(type)


  // =========================================================
  // CLICK
  // =========================================================

  const handleClick = () => {
    onClick?.(roadmap)
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <article
      onClick={handleClick}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-[24px]
        border
        border-border
        bg-card
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/20
        hover:shadow-xl
      "
    >

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        className="
          relative
          aspect-[16/10]
          w-full
          overflow-hidden
          bg-muted
        "
      >
        <Image
          src={visual.image}
          alt={visual.imageAlt}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.04]
          "
          style={{
            objectPosition: visual.imagePosition,
          }}
        />

        {/* Soft image overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/15
            via-transparent
            to-transparent
          "
        />


        {/* CATEGORY */}

        <div
          className="
            absolute
            left-4
            top-4
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/30
              bg-white/85
              px-3
              py-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-neutral-800
              shadow-sm
              backdrop-blur-md
            "
          >
            {visual.label}
          </span>
        </div>
      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5 sm:p-6">

        {/* TITLE */}

        <h3
          className="
            text-[20px]
            font-semibold
            leading-[1.3]
            tracking-[-0.01em]
            text-card-foreground
            sm:text-[21px]
          "
        >
          {title}
        </h3>


        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            line-clamp-2
            text-[13px]
            leading-[1.65]
            text-muted-foreground
          "
        >
          {description}
        </p>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            border-t
            border-border
            pt-4
          "
        >

          {/* EXPERIENCE */}

          <span
            className="
              text-[12px]
              font-medium
              capitalize
              text-muted-foreground
            "
          >
            {experience}
          </span>


          {/* EXPLORE */}

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[13px]
              font-medium
              text-foreground
            "
          >
            <span>
              Explore
            </span>

            <ArrowUpRight
              className="
                size-4
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </div>

        </div>

      </div>

    </article>
  )
}

export default RoadmapCard