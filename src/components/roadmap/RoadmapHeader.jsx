import {
  BookOpen,
} from "lucide-react"

export default function RoadmapHeader({
  roadmap,
  progress = 0,
}) {
  return (
    <div className="mb-8">

      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">

        <BookOpen className="size-4" />

        Career Roadmap

      </div>


      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

        {/* Information */}

        <div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {roadmap.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {roadmap.description}
          </p>

        </div>


        {/* Progress */}

        <div className="w-full lg:w-56">

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="text-muted-foreground">
              Overall progress
            </span>

            <span className="font-medium text-foreground">
              {progress}%
            </span>

          </div>


          <div className="h-2 overflow-hidden rounded-full bg-secondary">

            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  )
}