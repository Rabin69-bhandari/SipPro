import {
  Code2,
  Globe,
  Link,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"


export default function CVPreview({
  profile,
  career,
}) {

  const demonstratedSkills =
    career?.skills?.demonstrated ?? []

  const additionalSkills =
    career?.skills?.additional ?? []


  return (

    <div>

      {/* PREVIEW HEADER */}

      <div className="mb-3 flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold">
            Live Preview
          </p>

          <p className="text-xs text-muted-foreground">
            Updates as you edit
          </p>
        </div>


        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          A4 Preview
        </span>

      </div>


      {/* CV PAPER */}

      <article className="min-h-[900px] overflow-hidden rounded-sm border border-border bg-white text-slate-900 shadow-sm">


        {/* HEADER */}

        <header className="border-b border-slate-200 px-8 py-8 md:px-10">

          <h1 className="text-3xl font-bold tracking-tight">

            {
              profile?.fullName ||
              "Your Name"
            }

          </h1>


          <p className="mt-1 text-base font-medium text-slate-600">

            {
              career?.title ||
              "Professional Title"
            }

          </p>


          {/* CONTACT */}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

            {profile?.email && (
              <Contact
                icon={Mail}
                text={profile.email}
              />
            )}


            {profile?.phone && (
              <Contact
                icon={Phone}
                text={profile.phone}
              />
            )}


            {profile?.location && (
              <Contact
                icon={MapPin}
                text={profile.location}
              />
            )}


            {profile?.linkedinUrl && (
              <Contact
                icon={Link}
                text={profile.linkedinUrl}
              />
            )}


            {profile?.githubUrl && (
              <Contact
                icon={Code2}
                text={profile.githubUrl}
              />
            )}


            {profile?.portfolioUrl && (
              <Contact
                icon={Globe}
                text={profile.portfolioUrl}
              />
            )}

          </div>

        </header>


        {/* BODY */}

        <div className="space-y-7 px-8 py-7 md:px-10">


          {/* PROFESSIONAL SUMMARY */}

          <CVSection title="Professional Summary">

            <p className="text-sm leading-6 text-slate-600">

              {
                career
                  ? `${
                      career.experience
                        ? `${capitalize(
                            career.experience
                          )} `
                        : ""
                    }candidate targeting opportunities as a ${
                      career.title
                    }. Building practical capability through structured learning, assessment and interview-based skill evidence.`
                  : "Your professional summary will appear here."
              }

            </p>

          </CVSection>


          {/* DEMONSTRATED SKILLS */}

          {demonstratedSkills.length > 0 && (

            <CVSection title="Demonstrated Skills">

              <div className="flex flex-wrap gap-2">

                {demonstratedSkills.map(
                  (skill) => (

                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </CVSection>

          )}


          {/* ADDITIONAL SKILLS */}

          {additionalSkills.length > 0 && (

            <CVSection title="Additional Skills">

              <p className="text-sm leading-6 text-slate-600">
                {additionalSkills.join(" • ")}
              </p>

            </CVSection>

          )}


          {/* EXPERIENCE */}

          {profile?.experience?.length > 0 && (

            <CVSection title="Experience">

              <div className="space-y-5">

                {profile.experience.map(
                  (item, index) => (

                    <div key={index}>

                      <div className="flex justify-between gap-4">

                        <div>

                          <p className="text-sm font-semibold">
                            {item.role || "Role"}
                          </p>


                          {item.company && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {item.company}
                            </p>
                          )}

                        </div>


                        <p className="shrink-0 text-xs text-slate-500">

                          {
                            formatRange(
                              item.startDate,
                              item.endDate
                            )
                          }

                        </p>

                      </div>


                      {item.description && (

                        <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">
                          {item.description}
                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </CVSection>

          )}


          {/* PROJECTS */}

          {profile?.projects?.length > 0 && (

            <CVSection title="Projects">

              <div className="space-y-5">

                {profile.projects.map(
                  (project, index) => (

                    <div key={index}>

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm font-semibold">
                            {project.name || "Project"}
                          </p>


                          {project.technologies && (

                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {project.technologies}
                            </p>

                          )}

                        </div>


                        {project.url && (

                          <span className="max-w-[220px] truncate text-[10px] text-slate-500">
                            {project.url}
                          </span>

                        )}

                      </div>


                      {project.description && (

                        <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">
                          {project.description}
                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </CVSection>

          )}


          {/* EDUCATION */}

          {profile?.education?.length > 0 && (

            <CVSection title="Education">

              <div className="space-y-4">

                {profile.education.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex justify-between gap-4"
                    >

                      <div>

                        <p className="text-sm font-semibold">

                          {
                            [
                              item.degree,
                              item.field,
                            ]
                              .filter(Boolean)
                              .join(" — ") ||
                            "Education"
                          }

                        </p>


                        {item.institution && (

                          <p className="mt-1 text-xs text-slate-500">
                            {item.institution}
                          </p>

                        )}

                      </div>


                      <p className="shrink-0 text-xs text-slate-500">

                        {
                          formatRange(
                            item.startDate,
                            item.endDate
                          )
                        }

                      </p>

                    </div>

                  )
                )}

              </div>

            </CVSection>

          )}


          {/* CERTIFICATIONS */}

          {profile?.certifications?.length > 0 && (

            <CVSection title="Certifications">

              <div className="space-y-3">

                {profile.certifications.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex justify-between gap-4"
                    >

                      <div>

                        <p className="text-sm font-semibold">
                          {item.name || "Certification"}
                        </p>


                        {item.issuer && (
                          <p className="mt-1 text-xs text-slate-500">
                            {item.issuer}
                          </p>
                        )}


                        {item.url && (
                          <p className="mt-1 max-w-[320px] truncate text-[10px] text-slate-400">
                            {item.url}
                          </p>
                        )}

                      </div>


                      {item.date && (
                        <p className="shrink-0 text-xs text-slate-500">
                          {item.date}
                        </p>
                      )}

                    </div>

                  )
                )}

              </div>

            </CVSection>

          )}


          {/* CAREER EVIDENCE */}

          {career && (

            <CVSection title="Career Evidence">

              <div className="rounded-lg border border-slate-200 p-4">

                <div className="flex items-center gap-2">

                  <ShieldCheck className="size-4 text-slate-700" />

                  <p className="text-xs font-semibold">
                    Evidence-backed learning profile
                  </p>

                </div>


                <div className="mt-4 grid grid-cols-3 gap-3">

                  <EvidenceValue
                    label="Learning"
                    value={`${career.learning?.progress ?? 0}%`}
                  />


                  <EvidenceValue
                    label="Assessment"
                    value={
                      career.assessment
                        ? `${career.assessment.totalScore}/30`
                        : "—"
                    }
                  />


                  <EvidenceValue
                    label="Interview"
                    value={
                      career.interview
                        ? `${career.interview.totalScore}/100`
                        : "—"
                    }
                  />

                </div>


                <div className="mt-4 border-t border-slate-200 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-500">
                      Career Readiness
                    </span>

                    <span className="text-sm font-bold">
                      {career.readiness?.score ?? 0}%
                    </span>

                  </div>


                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            career.readiness?.score ?? 0
                          )
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </CVSection>

          )}

        </div>

      </article>

    </div>

  )
}


// ==========================================
// CV SECTION
// ==========================================

function CVSection({
  title,
  children,
}) {

  return (

    <section>

      <h2 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-800">
        {title}
      </h2>

      <div className="mt-3">
        {children}
      </div>

    </section>

  )
}


// ==========================================
// CONTACT
// ==========================================

function Contact({
  icon: Icon,
  text,
}) {

  return (

    <span className="flex items-center gap-1.5">

      <Icon className="size-3 shrink-0" />

      <span className="break-all">
        {text}
      </span>

    </span>

  )
}


// ==========================================
// EVIDENCE VALUE
// ==========================================

function EvidenceValue({
  label,
  value,
}) {

  return (

    <div>

      <p className="text-base font-bold">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-500">
        {label}
      </p>

    </div>

  )
}


// ==========================================
// FORMAT RANGE
// ==========================================

function formatRange(
  start,
  end
) {

  if (!start && !end) {
    return ""
  }

  if (start && !end) {
    return start
  }

  if (!start && end) {
    return end
  }

  return `${start} — ${end}`

}


// ==========================================
// CAPITALIZE
// ==========================================

function capitalize(value) {

  if (!value) {
    return ""
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )

}