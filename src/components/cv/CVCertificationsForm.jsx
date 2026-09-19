import {
  Award,
  Plus,
  Trash2,
} from "lucide-react"


const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"


export default function CVCertificationsForm({
  items = [],
  onChange,
}) {

  const addItem = () => {

    onChange([
      ...items,
      {
        name: "",
        issuer: "",
        date: "",
        url: "",
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

            <Award className="size-4 text-primary" />

          </div>

          <h2 className="font-semibold">
            Certifications
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
          Add relevant certifications if you have any.
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
                    placeholder="Certification"
                    value={
                      item.name ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "name",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Issuer"
                    value={
                      item.issuer ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "issuer",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Date"
                    value={
                      item.date ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "date",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Credential URL"
                    value={
                      item.url ?? ""
                    }
                    onChange={
                      (event) =>
                        updateItem(
                          index,
                          "url",
                          event.target.value
                        )
                    }
                    className={inputClass}
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