"use client"

import {
  BriefcaseBusiness,
  ChevronDown,
  Sparkles,
} from "lucide-react"


export default function HomeHeader({
  careers,
  career,
  onCareerChange,
}) {
  return (
    <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

      <div>

        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Career Command Center
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Your Career Readiness
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track what you've learned, what you've proven,
          and what you should work on next.
        </p>

      </div>


      {careers.length > 1 && (

        <div className="relative">

          <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <select
            value={career.id}
            onChange={(event) =>
              onCareerChange(event.target.value)
            }
            className="h-11 min-w-60 appearance-none rounded-xl border border-border bg-card pl-10 pr-10 text-sm font-medium outline-none transition focus:border-primary"
          >

            {careers.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
              </option>

            ))}

          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        </div>

      )}

    </section>
  )
}