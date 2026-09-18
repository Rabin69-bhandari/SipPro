import { Brain, Loader2 } from "lucide-react"
import CareerCard from "@/components/roadmap/CareerCard"

export default function CareerSelection({
  roadmaps,
  loading,
  generatingId,
  error,
  onCareerClick,
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Brain className="size-4" />
          Skill Assessment
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Choose your career assessment
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Select one of your career goals. Your assessment will be
          generated based on your career and learning progress.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-60 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Brain className="mx-auto size-6 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">
            No career roadmap found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create a career roadmap before taking an assessment.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className={
                generatingId === roadmap.id
                  ? "pointer-events-none opacity-60"
                  : ""
              }
            >
              <CareerCard
                roadmap={roadmap}
                onClick={onCareerClick}
              />

              {generatingId === roadmap.id && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating assessment...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}