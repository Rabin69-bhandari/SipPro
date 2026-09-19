import Image from "next/image";
import { features } from "@/constant/data";
import { useEffect } from "react";
import { useGSAP } from "@gsap/react";


const AboutSection = () => {



  

     
  

  


  return (
    <section
      id="about"
      className="
      about-section
        relative
        flex
        min-h-[100svh]
        items-center
        overflow-hidden
        bg-background
        py-14
        sm:py-16
        lg:py-10
      "
    >
      {/* About anchor */}
      <span id="about" className="absolute top-0" />

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[180px]
          -top-[180px]
          h-[360px]
          w-[360px]
          rounded-full
          bg-secondary/30
          lg:h-[420px]
          lg:w-[420px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[220px]
          -right-[200px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-brand-soft/30
          lg:h-[480px]
          lg:w-[480px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
          xl:px-14
        "
      >
        {/* ===================================================
            SECTION HEADING
        =================================================== */}

        <div className="max-w-[760px]">
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-foreground
              sm:text-[12px]
            "
          >
            The LearnChen Way
          </p>

          <h2
            className="
              mt-3
              text-[30px]
              font-medium
              leading-[1.16]
              tracking-[0.005em]
              text-foreground
              sm:text-[34px]
              md:text-[38px]
              lg:text-[40px]
              xl:text-[42px]
            "
          >
            A smarter way to{" "}
            <span className="text-brand">
              Learn and Grow.
            </span>
          </h2>
        </div>

        {/* ===================================================
            FEATURE CARDS
        =================================================== */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:mt-9
            lg:grid-cols-3
            lg:gap-6
            xl:gap-7
          "
        >
          {features.map((feature) => (
            <article
              key={feature.number}
              className="
                card
                group
                relative
                flex
                min-h-[255px]
                flex-col
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-primary/20
                hover:shadow-lg

                sm:p-6

                lg:min-h-[270px]
              "
            >
              {/* =============================================
                  NUMBER
              ============================================= */}

              <span
                className="
                  text-[11px]
                  font-medium
                  tracking-[0.08em]
                  text-muted-foreground
                "
              >
                {feature.number}
              </span>

              {/* =============================================
                  ICON
              ============================================= */}

              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  py-4
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                {feature.icon}
              </div>

              {/* =============================================
                  CONTENT
              ============================================= */}

              <div className="text-center">
                <h3
                  className="
                    text-[18px]
                    font-semibold
                    tracking-[0.005em]
                    text-card-foreground
                    sm:text-[19px]
                    lg:text-[20px]
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-[300px]
                    text-[12px]
                    font-normal
                    leading-[1.65]
                    tracking-[0.005em]
                    text-muted-foreground
                    sm:text-[13px]
                  "
                >
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* ===================================================
            BOTTOM DESCRIPTION
        =================================================== */}

        <div
          className="
            relative
            mt-8
            px-4
            text-center
            lg:mt-9
          "
        >
          <p
            className="
              mx-auto
              max-w-[700px]
              text-[13px]
              font-normal
              leading-[1.65]
              tracking-[0.005em]
              text-muted-foreground
              sm:text-[14px]
            "
          >
            LearnChen brings learning, guidance, and progress together in one
            place — helping you build knowledge with clarity and confidence.
          </p>

          {/* =============================================
              DECORATIVE ROBOT
          ============================================= */}

          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;