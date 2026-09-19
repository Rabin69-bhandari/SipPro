import {
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react"


const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"


export default function CVEducationForm({
  items = [],
  onChange,
}) {

  const addEducation = () => {

    onChange([
      ...items,
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ])

  }


  const updateEducation =
    (index, field, value) => {

      const updated =
        [...items]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      onChange(updated)

    }


  const removeEducation =
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

      <SectionHeader
        title="Education"
        icon={GraduationCap}
        onAdd={addEducation}
      />


      {items.length === 0 ? (

        <EmptyState
          text="Add your education history."
        />

      ) : (

        <div className="mt-5 space-y-4">

          {items.map(
            (item, index) => (

              <div
                key={index}
                className="rounded-xl border border-border p-4"
              >

                <div className="flex justify-between">

                  <p className="text-xs font-medium text-muted-foreground">
                    Education {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeEducation(
                        index
                      )
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>

                </div>


                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <input
                    placeholder="Institution"
                    value={
                      item.institution ?? ""
                    }
                    onChange={
                      (event) =>
                        updateEducation(
                          index,
                          "institution",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Degree"
                    value={
                      item.degree ?? ""
                    }
                    onChange={
                      (event) =>
                        updateEducation(
                          index,
                          "degree",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <input
                    placeholder="Field of study"
                    value={
                      item.field ?? ""
                    }
                    onChange={
                      (event) =>
                        updateEducation(
                          index,
                          "field",
                          event.target.value
                        )
                    }
                    className={inputClass}
                  />


                  <div className="grid grid-cols-2 gap-2">

                    <input
                      placeholder="Start"
                      value={
                        item.startDate ?? ""
                      }
                      onChange={
                        (event) =>
                          updateEducation(
                            index,
                            "startDate",
                            event.target.value
                          )
                      }
                      className={inputClass}
                    />

                    <input
                      placeholder="End"
                      value={
                        item.endDate ?? ""
                      }
                      onChange={
                        (event) =>
                          updateEducation(
                            index,
                            "endDate",
                            event.target.value
                          )
                      }
                      className={inputClass}
                    />

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>

  )
}


function SectionHeader({
  title,
  icon: Icon,
  onAdd,
}) {

  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>

        <h2 className="font-semibold">
          {title}
        </h2>

      </div>


      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
      >
        <Plus className="size-4" />
        Add
      </button>

    </div>

  )
}


function EmptyState({
  text,
}) {

  return (

    <div className="mt-5 rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
      {text}
    </div>

  )
}