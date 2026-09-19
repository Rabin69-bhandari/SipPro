import {
  Code2,
  Globe,
  Link,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react"


const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"


export default function CVProfileForm({
  profile,
  onChange,
}) {

  return (

    <section className="rounded-2xl border border-border bg-card p-5">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="flex items-center gap-3">

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">

          <UserRound className="size-4 text-primary" />

        </div>

        <div>

          <h2 className="font-semibold">
            Personal Information
          </h2>

          <p className="text-xs text-muted-foreground">
            Contact and professional links
          </p>

        </div>

      </div>


      {/* ================================== */}
      {/* FORM */}
      {/* ================================== */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">


        {/* FULL NAME */}

        <Field
          icon={UserRound}
          label="Full Name"
        >

          <input
            value={
              profile?.fullName ?? ""
            }
            disabled
            placeholder="Your name"
            className={`${inputClass} cursor-not-allowed bg-muted/40 text-muted-foreground`}
          />

        </Field>


        {/* EMAIL */}

        <Field
          icon={Mail}
          label="Email"
        >

          <input
            value={
              profile?.email ?? ""
            }
            disabled
            placeholder="you@example.com"
            className={`${inputClass} cursor-not-allowed bg-muted/40 text-muted-foreground`}
          />

        </Field>


        {/* PHONE */}

        <Field
          icon={Phone}
          label="Phone"
        >

          <input
            type="tel"
            value={
              profile?.phone ?? ""
            }
            onChange={
              (event) =>
                onChange(
                  "phone",
                  event.target.value
                )
            }
            placeholder="+977 98XXXXXXXX"
            className={inputClass}
          />

        </Field>


        {/* LOCATION */}

        <Field
          icon={MapPin}
          label="Location"
        >

          <input
            value={
              profile?.location ?? ""
            }
            onChange={
              (event) =>
                onChange(
                  "location",
                  event.target.value
                )
            }
            placeholder="Kathmandu, Nepal"
            className={inputClass}
          />

        </Field>


        {/* LINKEDIN */}

        <Field
          icon={Link}
          label="LinkedIn"
        >

          <input
            value={
              profile?.linkedinUrl ?? ""
            }
            onChange={
              (event) =>
                onChange(
                  "linkedinUrl",
                  event.target.value
                )
            }
            placeholder="linkedin.com/in/username"
            className={inputClass}
          />

        </Field>


        {/* GITHUB */}

        <Field
          icon={Code2}
          label="GitHub"
        >

          <input
            value={
              profile?.githubUrl ?? ""
            }
            onChange={
              (event) =>
                onChange(
                  "githubUrl",
                  event.target.value
                )
            }
            placeholder="github.com/username"
            className={inputClass}
          />

        </Field>


        {/* PORTFOLIO */}

        <div className="sm:col-span-2">

          <Field
            icon={Globe}
            label="Portfolio"
          >

            <input
              value={
                profile?.portfolioUrl ?? ""
              }
              onChange={
                (event) =>
                  onChange(
                    "portfolioUrl",
                    event.target.value
                  )
              }
              placeholder="yourportfolio.com"
              className={inputClass}
            />

          </Field>

        </div>

      </div>

    </section>

  )
}


// ==========================================
// FIELD COMPONENT
// ==========================================

function Field({
  icon: Icon,
  label,
  children,
}) {

  return (

    <label className="block">

      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">

        <Icon className="size-3.5" />

        {label}

      </span>

      {children}

    </label>

  )
}