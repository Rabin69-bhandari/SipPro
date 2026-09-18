import { Sparkles } from "lucide-react"

export default function EvaluatingInterview() {

  return (

    <div className="w-full">

      <div className="rounded-2xl border border-border bg-card px-6 py-16">

        <div className="mx-auto flex max-w-md flex-col items-center text-center">


          <div className="relative">

            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />

            <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">

              <Sparkles className="size-6 animate-pulse text-primary" />

            </div>

          </div>


          <h2 className="mt-6 text-xl font-semibold">
            Evaluating your interview
          </h2>


          <p className="mt-2 text-sm leading-6 text-muted-foreground">

            AI is reviewing your answers,
            technical knowledge, reasoning
            and communication.

          </p>


          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">

            <span className="size-2 animate-bounce rounded-full bg-primary" />

            <span
              className="size-2 animate-bounce rounded-full bg-primary"
              style={{
                animationDelay:
                  "150ms",
              }}
            />

            <span
              className="size-2 animate-bounce rounded-full bg-primary"
              style={{
                animationDelay:
                  "300ms",
              }}
            />

          </div>

        </div>

      </div>

    </div>

  )
}