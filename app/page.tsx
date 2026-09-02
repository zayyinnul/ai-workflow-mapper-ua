import { Brain, Clock, ShieldCheck, Sparkles, Target } from "lucide-react"
import { WorkflowMapper } from "@/components/workflow-mapper"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="size-5" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">AI Workflow Mapper</p>
              <p className="text-xs text-muted-foreground">Enterprise AI Enablement</p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
            Runs privately in your browser
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Find your first AI win
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            Turn repetitive work into AI opportunities
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Describe your day-to-day work and get a clear, practical map of the tasks worth automating — with
            recommended tools, estimated impact, and a first step you can take this week.
          </p>

          <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: Target, label: "Spot repetitive tasks" },
              { icon: Sparkles, label: "Match practical AI tools" },
              { icon: Clock, label: "Estimate time saved" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <WorkflowMapper />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          AI Workflow Mapper · Demo analysis with realistic sample recommendations. Connect a live model to power
          production insights.
        </div>
      </footer>
    </div>
  )
}
