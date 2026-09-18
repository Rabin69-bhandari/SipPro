export default function JourneyOverview({
  overview,
}) {
  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-6">

      <div>

        <h2 className="font-semibold">
          Your Journey
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Progress across your entire account.
        </p>

      </div>


      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <OverviewItem
          value={
            overview?.totalCareers ?? 0
          }
          label="Career Goals"
        />

        <OverviewItem
          value={
            overview?.totalRoadmaps ?? 0
          }
          label="Roadmaps"
        />

        <OverviewItem
          value={
            overview?.completedTopics ?? 0
          }
          label="Topics Completed"
        />

        <OverviewItem
          value={
            overview?.assessmentsTaken ?? 0
          }
          label="Assessments"
        />

        <OverviewItem
          value={
            overview?.assessmentsPassed ?? 0
          }
          label="Passed"
        />

      </div>

    </section>
  )
}


function OverviewItem({
  value,
  label,
}) {
  return (
    <div className="rounded-xl bg-secondary/50 p-4">

      <p className="text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>

    </div>
  )
}