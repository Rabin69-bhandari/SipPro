export default function AssessmentSection({
  number,
  title,
  data,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div className="mb-5 rounded-2xl border border-border bg-card p-6">


      {/* ================================= */}
      {/* SECTION HEADER */}
      {/* ================================= */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-semibold">

            {number}

          </div>


          <h2 className="font-semibold text-foreground">

            {title}

          </h2>

        </div>


        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">

          {data.marks} marks

        </span>

      </div>


      {/* ================================= */}
      {/* QUESTION */}
      {/* ================================= */}

      <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-foreground">

        {data.prompt}

      </p>


      {/* ================================= */}
      {/* ANSWER */}
      {/* ================================= */}

      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-foreground">

          Your Answer

        </label>


        <textarea

          value={
            value
          }

          onChange={(event) =>
            onChange(
              event.target.value
            )
          }

          placeholder={
            placeholder
          }

          rows={6}

          className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"

        />

      </div>

    </div>

  )

}