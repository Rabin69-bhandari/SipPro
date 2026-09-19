import Image from "next/image";
import Link from "next/link";

/* =========================================================
   ICONS
========================================================= */

const BookIcon = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-[52px] w-[52px] sm:h-[56px] sm:w-[56px]"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M24 20h47c5 0 9 4 9 9v5H33c-5 0-9-4-9-9v-5Z"
      className="fill-primary"
    />

    <path
      d="M19 35h53c5 0 9 4 9 9v5H28c-5 0-9-4-9-9v-5Z"
      className="fill-[#f6a623]"
    />

    <path
      d="M23 50h48c5 0 9 4 9 9v5H32c-5 0-9-4-9-9v-5Z"
      className="fill-[#8b50b5]"
    />

    <path
      d="M30 23h42v8H34c-2 0-4-2-4-4v-4Z"
      className="fill-brand-soft"
    />

    <path
      d="M25 38h47v8H29c-2 0-4-2-4-4v-4Z"
      className="fill-[#f7d08a]"
    />

    <path
      d="M29 53h43v8H33c-2 0-4-2-4-4v-4Z"
      className="fill-[#c7a6dd]"
    />
  </svg>
);

const ProblemSolvingIcon = () => (
  <svg
    viewBox="0 0 100 100"
    className="
      h-[54px]
      w-[54px]
      text-foreground
      sm:h-[58px]
      sm:w-[58px]
    "
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.3"
    aria-hidden="true"
  >
    <path d="M39 82V62c-8-5-13-14-13-25 0-17 13-30 30-30 16 0 29 12 30 28l10 17-11 5v13c0 5-4 9-9 9H66l-2 11" />

    <rect
      x="38"
      y="21"
      width="26"
      height="26"
      rx="4"
    />

    <path d="M51 13v8" />
    <path d="M51 47v8" />
    <path d="M30 34h8" />
    <path d="M64 34h8" />
  </svg>
);

const AiIcon = () => (
  <svg
    viewBox="0 0 100 100"
    className="
      h-[52px]
      w-[52px]
      text-primary
      sm:h-[56px]
      sm:w-[56px]
    "
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="6"
    aria-hidden="true"
  >
    <rect
      x="22"
      y="22"
      width="56"
      height="56"
      rx="10"
    />

    <path d="M35 12v10" />
    <path d="M50 12v10" />
    <path d="M65 12v10" />

    <path d="M35 78v10" />
    <path d="M50 78v10" />
    <path d="M65 78v10" />

    <path d="M12 35h10" />
    <path d="M12 50h10" />
    <path d="M12 65h10" />

    <path d="M78 35h10" />
    <path d="M78 50h10" />
    <path d="M78 65h10" />

    <path
      d="M38 65 48 36h4l10 29"
      strokeWidth="4"
    />

    <path
      d="M42 54h16"
      strokeWidth="4"
    />
  </svg>
);

/* =========================================================
   JOURNEY DATA
========================================================= */

const steps = [
  {
    number: "01",
    title: "Choose Your RoadMap",
    description:
      "Start with what interests you. Choose a course that matches your goals and curiosity.",
    icon: <BookIcon />,
  },

  {
    number: "02",
    title: "Focus on Problem Solving",
    description:
      "Strengthen your understanding through practical challenges and meaningful exercises.",
    icon: <ProblemSolvingIcon />,
  },

  {
    number: "03",
    title: "Learn With Your AI Partner",
    description:
      "Receive personalized guidance, helpful feedback, and support whenever you need it.",
    icon: <AiIcon />,
  },
];

/* =========================================================
   JOURNEY SECTION
========================================================= */

const JourneySection = () => {
  return (
    <section
      id="journey"
      className="
      journey-section
        relative
        overflow-hidden
        bg-background
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* DECORATIVE ROBOT */}



      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
          xl:px-14
        "
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mx-auto max-w-[760px] text-center">

          <p
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-primary
              sm:text-[13px]
            "
          >
            How LearnChen Works
          </p>

          <h2
            className="
              mt-4
              text-[30px]
              font-medium
              leading-[1.18]
              tracking-[0.005em]
              text-foreground
              sm:text-[35px]
              md:text-[39px]
              lg:text-[42px]
              xl:text-[44px]
            "
          >
            Your learning journey{" "}
            <span className="text-brand">
              with AI.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[590px]
              text-[14px]
              font-normal
              leading-[1.7]
              tracking-[0.005em]
              text-muted-foreground
              sm:text-[15px]
              lg:text-[16px]
            "
          >
            Begin with your interests, develop practical skills, and receive
            personalized support throughout your learning journey.
          </p>

        </div>

        {/* =================================================
            JOURNEY CARDS
        ================================================= */}

        <div
          className="
            relative
            mt-12
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:mt-14
            lg:grid-cols-3
            lg:gap-6
            xl:gap-8
          "
        >

          {/* DESKTOP CONNECTING LINE */}

          <div
            className="
              absolute
              left-[16%]
              right-[16%]
              top-[52px]
              hidden
              border-t
              border-dashed
              border-border
              lg:block
            "
          />

          {steps.map((step) => (
            <article
              key={step.number}
              className="
                group
                relative
                z-10
                flex
                min-h-[290px]
                flex-col
                items-center
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-primary/20
                hover:shadow-lg
                sm:p-7
                lg:min-h-[305px]
              "
            >

              {/* STEP NUMBER */}

              <span
                className="
                  absolute
                  right-5
                  top-5
                  text-[11px]
                  font-semibold
                  tracking-[0.16em]
                  text-muted-foreground
                "
              >
                {step.number}
              </span>

              {/* ICON */}

              <div
                className="
                  flex
                  h-[92px]
                  w-[92px]
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary
                  transition-transform
                  duration-300
                  group-hover:scale-105
                  sm:h-[100px]
                  sm:w-[100px]
                "
              >
                {step.icon}
              </div>

              {/* TITLE */}

              <h3
                className="
                  mt-6
                  text-[18px]
                  font-semibold
                  leading-snug
                  tracking-[0.005em]
                  text-card-foreground
                  sm:text-[19px]
                  lg:text-[20px]
                "
              >
                {step.title}
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-[300px]
                  text-[13px]
                  font-normal
                  leading-[1.7]
                  tracking-[0.005em]
                  text-muted-foreground
                  sm:text-[14px]
                "
              >
                {step.description}
              </p>

              {/* STEP INDICATOR */}

              <div
                className="
                  mt-auto
                  flex
                  items-center
                  gap-2.5
                  pt-6
                "
              >
                <span className="h-px w-7 bg-border" />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    tracking-[0.18em]
                    text-primary
                  "
                >
                  STEP {step.number}
                </span>

                <span className="h-px w-7 bg-border" />
              </div>

            </article>
          ))}
        </div>

  
      </div>
    </section>
  );
};

export default JourneySection;