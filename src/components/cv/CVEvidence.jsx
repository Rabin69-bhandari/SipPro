import {
  BadgeCheck,
  BookOpenCheck,
  BrainCircuit,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react"


export default function CVEvidence({
  career,
}) {

  if (!career) {

    return null

  }


  const learning =
    career.learning


  const assessment =
    career.assessment


  const interview =
    career.interview


  const demonstratedSkills =
    career.skills
      ?.demonstrated ?? []


  return (

    <section className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">

      <div className="flex items-center gap-3">

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">

          <ShieldCheck className="size-4 text-primary" />

        </div>


        <div>

          <h2 className="font-semibold">
            Career Evidence
          </h2>

          <p className="text-xs text-muted-foreground">
            Evidence collected throughout your learning journey
          </p>

        </div>

      </div>


      <div className="mt-5 grid gap-3 sm:grid-cols-3">

        <Evidence
          icon={BookOpenCheck}
          label="Learning"
          value={
            `${learning?.progress ?? 0}%`
          }
          completed={
            (learning?.progress ?? 0) ===
            100
          }
        />


        <Evidence
          icon={ClipboardCheck}
          label="Assessment"
          value={
            assessment
              ? `${assessment.totalScore}/30`
              : "Pending"
          }
          completed={
            Boolean(assessment)
          }
        />


        <Evidence
          icon={BrainCircuit}
          label="Interview"
          value={
            interview
              ? `${interview.totalScore}/100`
              : "Pending"
          }
          completed={
            Boolean(interview)
          }
        />

      </div>


      {demonstratedSkills.length > 0 && (

        <div className="mt-5 border-t border-primary/10 pt-5">

          <div className="flex items-center gap-2">

            <BadgeCheck className="size-4 text-primary" />

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demonstrated Skills
            </p>

          </div>


          <div className="mt-3 flex flex-wrap gap-2">

            {demonstratedSkills.map(
              (skill) => (

                <span
                  key={skill}
                  className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                </span>

              )
            )}

          </div>

        </div>

      )}

    </section>

  )
}


function Evidence({
  icon: Icon,
  label,
  value,
  completed,
}) {

  return (

    <div className="rounded-xl border border-border bg-background p-3">

      <div className="flex items-center justify-between">

        <Icon className="size-4 text-primary" />

        {completed && (
          <BadgeCheck className="size-4 text-primary" />
        )}

      </div>


      <p className="mt-3 text-lg font-semibold">
        {value}
      </p>


      <p className="text-xs text-muted-foreground">
        {label}
      </p>

    </div>

  )
}