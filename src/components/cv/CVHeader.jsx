import {
  Check,
  FileText,
  Save,
} from "lucide-react"


export default function CVHeader({
  career,
  saving,
  saveMessage,
  onSave,
}) {

  return (

    <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>

        <div className="flex items-center gap-2 text-sm font-medium text-primary">

          <FileText className="size-4" />

          Career CV

        </div>


        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Build your evidence-backed CV
        </h1>


        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">

          Combine your professional information with
          learning, assessment and interview evidence.

        </p>

      </div>


      <div className="hidden items-center gap-3 xl:flex">

        {saveMessage && (

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">

            <Check className="size-3.5 text-primary" />

            {saveMessage}

          </span>

        )}


        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >

          <Save className="size-4" />

          {
            saving
              ? "Saving..."
              : "Save CV"
          }

        </button>

      </div>

    </header>

  )
}