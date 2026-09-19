"use client";

import Image from "next/image";
import {
  Check,
  Mic,
  Sparkles,
  TrendingUp,
  Volume2,
} from "lucide-react";

const waveform = [
  10, 18, 28, 20, 38, 25, 46, 32, 18, 40, 52, 30,
  22, 44, 34, 20, 28, 42, 24, 14,
];

const scores = [
  { label: "Confidence", value: 84 },
  { label: "Clarity", value: 76 },
  { label: "Relevance", value: 91 },
  { label: "Technical", value: 82 },
];

function Score({ label, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {label}
        </span>

        <span className="text-[10px] font-semibold text-foreground">
          {value}%
        </span>
      </div>

      <div className="h-[4px] overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function AIInterviewSection() {
  return (
    <section
      id="ai-interview"
      className="
      ai-interview-section
        relative
        overflow-hidden
        bg-background
        py-12
        sm:py-14
        lg:py-16
      "
    >
      {/* background glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-brand-soft/50 blur-[100px]" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-secondary/60 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-14">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mx-auto max-w-[700px] text-center">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-card
              px-3
              py-1.5
              shadow-sm
            "
          >
            <Sparkles
              size={12}
              className="text-primary"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
              AI Interview Practice
            </span>
          </div>

          <h2
            className="
              mt-4
              text-[28px]
              font-medium
              leading-[1.15]
              text-foreground
              sm:text-[32px]
              lg:text-[38px]
            "
          >
            Practice like it&apos;s the{" "}
            <span className="text-brand">
              real interview.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[580px]
              text-[13px]
              leading-[1.65]
              text-muted-foreground
              sm:text-[14px]
            "
          >
            Personalized questions, real voice conversations, and instant AI
            feedback designed to help you improve.
          </p>
        </div>

        {/* =================================================
            INTERVIEW APP
        ================================================= */}

        <div
          className="
            mx-auto
            mt-8
            max-w-[1050px]
            overflow-hidden
            rounded-[20px]
            border
            border-border
            bg-card
            shadow-[0_18px_60px_rgba(31,51,64,0.10)]
          "
        >

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div
            className="
              flex
              h-[52px]
              items-center
              justify-between
              border-b
              border-border
              px-4
              sm:px-5
            "
          >

            <div className="flex items-center gap-2.5">

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary
                  text-primary-foreground
                "
              >
                <Mic size={14} />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-foreground">
                  AI Interview
                </p>

                <p className="text-[9px] text-muted-foreground">
                  Frontend Developer · Intermediate
                </p>
              </div>

            </div>

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-border
                bg-surface-soft
                px-2.5
                py-1
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Live
              </span>
            </div>

          </div>

          {/* =================================================
              MAIN INTERVIEW AREA
          ================================================= */}

          <div className="grid lg:grid-cols-[1fr_270px]">

            {/* =================================================
                VOICE ASSISTANT
            ================================================= */}

            <div
              className="
                relative
                flex
                min-h-[390px]
                flex-col
                overflow-hidden
                bg-[#15242d]
                px-5
                py-5
                sm:px-7
              "
            >

              {/* background glow behind robot */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[48%]
                  h-[260px]
                  w-[260px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#77a6c2]/10
                  blur-[60px]
                "
              />

              {/* top controls */}

              <div className="relative z-20 flex items-center justify-between">

                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.05]
                    px-2.5
                    py-1
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-white/55
                  "
                >
                  Question 04 of 12
                </span>

                <div className="flex items-center gap-1.5 text-white/45">
                  <Volume2 size={12} />

                  <span className="text-[8px]">
                    Voice enabled
                  </span>
                </div>

              </div>

              {/* =================================================
                  ROBOT + QUESTION
              ================================================= */}

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-1
                  items-center
                  justify-center
                "
              >

                <div className="grid w-full max-w-[700px] items-center gap-5 sm:grid-cols-[180px_1fr]">

                  {/* =============================================
                      CUTE ROBOT
                  ============================================= */}

                  <div className="relative mx-auto">

                    {/* glow */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[150px]
                        w-[150px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border
                        border-[#77a6c2]/15
                      "
                    />

                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[125px]
                        w-[125px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#77a6c2]/10
                        blur-xl
                      "
                    />


                    {/* listening status */}

                    <div
                      className="
                        absolute
                        -bottom-2
                        left-1/2
                        z-20
                        flex
                        -translate-x-1/2
                        items-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        border
                        border-white/10
                        bg-[#203640]
                        px-2.5
                        py-1
                        shadow-lg
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9fc0d3]" />

                      <span className="text-[8px] font-medium text-white/70">
                        Listening...
                      </span>
                    </div>

                  </div>

                  {/* =============================================
                      QUESTION SIDE
                  ============================================= */}

                  <div className="text-center sm:text-left">

                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#9fc0d3]
                      "
                    >
                      Your AI Interviewer
                    </p>

                    <h3
                      className="
                        mt-2.5
                        max-w-[470px]
                        text-[17px]
                        font-medium
                        leading-[1.45]
                        text-white
                        sm:text-[19px]
                        lg:text-[20px]
                      "
                    >
                      “How would you optimize the performance of a large React
                      application?”
                    </h3>

                    {/* waveform */}

                    <div
                      className="
                        mt-5
                        flex
                        h-[34px]
                        items-center
                        justify-center
                        gap-[3px]
                        sm:justify-start
                      "
                    >
                      {waveform.map((height, index) => (
                        <span
                          key={index}
                          className="
                            w-[3px]
                            rounded-full
                            bg-[#77a6c2]
                          "
                          style={{
                            height: `${height}px`,
                            opacity:
                              0.4 +
                              (height / 60) * 0.6,
                          }}
                        />
                      ))}
                    </div>

                    {/* transcription */}

                    <div
                      className="
                        mt-4
                        max-w-[460px]
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.05]
                        px-3
                        py-2.5
                      "
                    >
                      <p className="text-[9px] leading-[1.6] text-white/50">
                        “I&apos;d start by identifying unnecessary re-renders
                        using React Profiler, then optimize expensive
                        components...”
                      </p>
                    </div>

                    {/* button */}

                    <button
                      type="button"
                      className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-white
                        px-4
                        py-2
                        text-[9px]
                        font-semibold
                        text-[#15242d]
                        transition-transform
                        hover:scale-[1.03]
                      "
                    >
                      <Mic size={12} />

                      End Answer
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                COMPACT INSIGHTS
            ================================================= */}

            <aside
              className="
                border-t
                border-border
                bg-card
                p-5
                lg:border-l
                lg:border-t-0
              "
            >

              {/* heading */}

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="text-[12px] font-semibold text-foreground">
                    Live Insights
                  </h3>

                  <p className="mt-1 text-[9px] text-muted-foreground">
                    AI analysis of your answer
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-brand-soft
                    text-primary
                  "
                >
                  <TrendingUp size={13} />
                </div>

              </div>

              {/* scores */}

              <div className="mt-5 space-y-3.5">

                {scores.map((score) => (
                  <Score
                    key={score.label}
                    label={score.label}
                    value={score.value}
                  />
                ))}

              </div>

              {/* overall */}

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-border
                  bg-surface-soft
                  p-3.5
                "
              >

                <div className="flex items-center justify-between">

                  <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Overall
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-brand-soft
                      px-2
                      py-1
                      text-[8px]
                      font-semibold
                      text-primary
                    "
                  >
                    <TrendingUp size={9} />

                    Improving
                  </span>

                </div>

                <div className="mt-2 flex items-end gap-1">

                  <span className="text-[25px] font-semibold leading-none text-foreground">
                    84
                  </span>

                  <span className="pb-[2px] text-[9px] text-muted-foreground">
                    / 100
                  </span>

                </div>

              </div>

              {/* feedback */}

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-border
                  p-3.5
                "
              >

                <div className="flex items-center gap-1.5">

                  <Sparkles
                    size={11}
                    className="text-primary"
                  />

                  <span className="text-[10px] font-semibold text-foreground">
                    AI Feedback
                  </span>

                </div>

                <div className="mt-3 flex gap-2">

                  <div
                    className="
                      flex
                      h-4
                      w-4
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-brand-soft
                      text-primary
                    "
                  >
                    <Check size={9} />
                  </div>

                  <p className="text-[9px] leading-[1.55] text-muted-foreground">
                    Strong technical answer. Add a real project example to make
                    your explanation more convincing.
                  </p>

                </div>

              </div>

            </aside>

          </div>

          {/* =================================================
              BOTTOM FEATURE STRIP
          ================================================= */}

          <div
            className="
              grid
              border-t
              border-border
              bg-surface-soft
              sm:grid-cols-3
            "
          >

            <div className="border-b border-border px-5 py-3 sm:border-b-0 sm:border-r">

              <p className="text-[10px] font-semibold text-foreground">
                Personalized
              </p>

              <p className="mt-0.5 text-[9px] text-muted-foreground">
                Questions tailored to your goals
              </p>

            </div>

            <div className="border-b border-border px-5 py-3 sm:border-b-0 sm:border-r">

              <p className="text-[10px] font-semibold text-foreground">
                Voice-powered
              </p>

              <p className="mt-0.5 text-[9px] text-muted-foreground">
                Practice speaking naturally
              </p>

            </div>

            <div className="px-5 py-3">

              <p className="text-[10px] font-semibold text-foreground">
                Improve continuously
              </p>

              <p className="mt-0.5 text-[9px] text-muted-foreground">
                Feedback after every answer
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}