import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-surface-soft pt-20"
    >
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1400px] grid-cols-1 items-center gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-12 xl:px-14">

        {/* LEFT CONTENT */}
        <div className="relative z-10 pt-12 text-center lg:pt-0 lg:text-left">

          <h1
            className="
              mx-auto
              max-w-[580px]
              text-[32px]
              font-medium
              leading-[1.22]
              tracking-[0.01em]
              text-foreground
              sm:text-[36px]
              md:text-[39px]
              lg:mx-0
              lg:text-[42px]
              xl:text-[44px]
            "
          >
            Learn at{" "}
            <span className="text-brand">
              Your Pace.
            </span>

            <br />

            Grow at{" "}
            <span className="text-brand">
              Your Potential.
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-[520px]
              text-[14px]
              font-normal
              leading-[1.7]
              tracking-[0.01em]
              text-muted-foreground
              sm:text-[15px]
              lg:mx-0
              lg:text-[16px]
            "
          >
            LearnChen is a smart learning platform helping students discover
            courses, personalize learning, track progress and grow.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row lg:justify-start">

            <Link
              href="/sign-up"
              className="
                rounded-lg
                bg-primary
                px-6
                py-2.5
                text-center
                text-[14px]
                font-medium
                text-primary-foreground
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-primary/90
                hover:shadow-md
                sm:text-[15px]
              "
            >
              Start Learning
            </Link>

            <Link
              href="#courses"
              className="
                rounded-lg
                border
                border-border
                bg-card
                px-6
                py-2.5
                text-center
                text-[14px]
                font-medium
                text-card-foreground
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-accent
                sm:text-[15px]
              "
            >
              Explore Courses
            </Link>

          </div>
        </div>

        {/* RIGHT ROBOT AREA */}
        <div
          className="
            relative
            flex
            min-h-[400px]
            items-center
            justify-center
            lg:min-h-[540px]
            lg:justify-end
          "
        >

          {/* ROBOT MESSAGE */}
          <div
            className="
              absolute
              left-[5%]
              top-[12%]
              z-20
              rounded-xl
              border
              border-border
              bg-card
              px-4
              py-2.5
              shadow-md
              sm:left-[12%]
              lg:left-[5%]
              lg:top-[18%]
              xl:left-[8%]
            "
          >
            <p className="text-[13px] font-medium leading-[1.5] text-card-foreground sm:text-[14px]">
              Hi! I am LearnChen
              <br />
              Your AI Partner
            </p>
          </div>

          {/* ROBOT */}
          <Image
            src="/images/robot.png"
            alt="LearnChen AI learning assistant"
            width={700}
            height={700}
            priority
            className="
              relative
              z-10
              h-auto
              w-full
              max-w-[420px]
              object-contain
              sm:max-w-[460px]
              lg:max-w-[500px]
              xl:max-w-[530px]
            "
          />

        </div>
      </div>

      {/* EXPLORE MORE */}
      <a
        href="#about"
        className="
          absolute
          bottom-5
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-1.5
          text-[13px]
          font-medium
          text-foreground
          lg:flex
        "
      >
        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-primary
            text-lg
            text-primary-foreground
            transition-transform
            duration-300
            hover:translate-y-1
          "
        >
          ↓
        </span>

        <span>Explore More</span>
      </a>

    </section>
  );
};

export default HeroSection;