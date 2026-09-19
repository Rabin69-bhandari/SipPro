import {
  BriefcaseBusiness,
  Plus,
  Trash2,
} from "lucide-react"


const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"


export default function CVExperienceForm({
  items = [],
  onChange,
}) {

  const addItem = () => {

    onChange([
      ...items,
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])

  }


  const updateItem =
    (index, field, value) => {

      const updated =
        [...items]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      onChange(updated)

    }


  const removeItem =
    (index) => {

      onChange(
        items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
      )

    }


  return (

    <section className="rounded-2xl border border-border bg-card p-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <BriefcaseBusiness className="size-4 text-primary" />
          </div>

          <h2 className="font-semibold">
            Experience
          </h2>

        </div>


        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus className="size-4" />
          Add
        </button>

      </div>


      {items.length === 0 ? (

        <div className="mt-5 rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          No work experience? That's okay. Projects and demonstrated skills can still strengthen your CV.
        </div>

      ) : (

        <div className="mt-5 space-y-4">

          {items.map(
            (item, index) => (

              <div
                key={index}
                className="rounded-xl border border-border p-4"
              >

                <div className="flex justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>

                </div>


                <div className="grid gap-3 sm:grid-cols-2">

                  <input
                    placeholder="Job title"
                    value={
                      item.role ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "role",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Company"
                    value={
                      item.company ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "company",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Start date"
                    value={
                      item.startDate ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "startDate",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="End date / Present"
                    value={
                      item.endDate ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "endDate",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <textarea
                    placeholder="What did you work on? Mention responsibilities and outcomes."
                    rows={4}
                    value={
                      item.description ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "description",
                          event.target.value
                        )
                    }
                    className={`${inputClass} resize-none sm:col-span-2`}
                  />

                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>

  )
}