import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Mic,
} from "lucide-react"


export default function StatsOverview({
  roadmap,
  assessment,
  readiness,
}) {
  return (
    <section className="mt-5 grid gap-5 md:grid-cols-3">

      <StatCard
        icon={BookOpen}
        title="Learning"
        value={`${roadmap?.progress ?? 0}%`}
        description={
          roadmap
            ? `${roadmap.completedTopics} of ${roadmap.totalTopics} topics completed`
            : "No roadmap created yet"
        }
      />


      <StatCard
        icon={ClipboardCheck}
        title="Assessment"
        value={
          assessment
            ? `${assessment.totalScore}/30`
            : "—"
        }
        description={
          assessment
            ? getStatusLabel(assessment.status)
            : "No assessment taken"
        }
      />


      <StatCard
        icon={Mic}
        title="AI Interview"
        value={
          readiness?.interview != null
            ? `${readiness.interview}%`
            : "—"
        }
        description={
          readiness?.interview != null
            ? "Latest interview score"
            : "Not completed yet"
        }
      />

    </section>
  )
}


function StatCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">

      <div className="flex items-center justify-between">

        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>

        <ArrowRight className="size-4 text-muted-foreground" />

      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>

    </div>
  )
}


function getStatusLabel(status) {
  if (status === "passed") {
    return "Passed"
  }

  if (status === "needs_improvement") {
    return "Needs Improvement"
  }

  if (!status) {
    return "Not completed"
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  )
}