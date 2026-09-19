import {
  BriefcaseBusiness,
  ChevronDown,
  Target,
} from "lucide-react"


export default function CVCareerSelector({
  careers,
  selectedCareerId,
  onChange,
}) {

  if (!careers.length) {

    return (

      <div className="rounded-2xl border border-dashed border-border bg-card p-5">

        <p className="text-sm font-medium">
          No career goal available
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a career goal before generating an evidence-backed CV.
        </p>

      </div>

    )

  }


  const career =
    careers.find(
      (item) =>
        item.id ===
        selectedCareerId
    ) ?? careers[0]


  return (

    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-3">

        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">

          <BriefcaseBusiness className="size-5 text-primary" />

        </div>


        <div>

          <p className="text-xs text-muted-foreground">
            CV Target
          </p>

          <p className="font-semibold">
            {career.title}
          </p>

        </div>

      </div>


      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">

          <Target className="size-4 text-primary" />

          <span className="text-sm font-medium">
            {career.readiness?.score ?? 0}%
          </span>

          <span className="text-xs text-muted-foreground">
            readiness
          </span>

        </div>


        <div className="relative">

          <select
            value={
              career.id
            }
            onChange={
              (event) =>
                onChange(
                  event.target.value
                )
            }
            className="appearance-none rounded-xl border border-border bg-background py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
          >

            {careers.map(
              (item) => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.title}
                </option>

              )
            )}

          </select>


          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        </div>

      </div>

    </div>

  )
}