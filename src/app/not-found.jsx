import Link from "next/link"
import {
  ArrowLeft,
  Home,
  Map,
  SearchX,
  Sparkles,
} from "lucide-react"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full border border-primary/10" />

        <div className="absolute bottom-[15%] right-[15%] h-48 w-48 rounded-full border border-primary/10" />
      </div>


      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">

        {/* Icon */}
        <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-sm">
          <SearchX className="size-7 text-primary" />
        </div>


        {/* 404 */}
        <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          <Sparkles className="size-4" />
          Error 404
        </div>


        {/* Heading */}
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          This path isn't on
          <span className="text-primary"> your roadmap.</span>
        </h1>


        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          The page you're looking for may have moved, been deleted,
          or never existed. Your career journey is still right where
          you left it.
        </p>


        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="/home"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
          >
            <Home className="size-4" />
            Back to Dashboard
          </Link>


          <Link
            href="/roadmap"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            <Map className="size-4" />
            View Roadmap
          </Link>

        </div>


        {/* Small footer message */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ArrowLeft className="size-3.5" />
          Every wrong turn is just another route to explore.
        </div>

      </div>

    </main>
  )
}