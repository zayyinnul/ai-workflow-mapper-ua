"use client"

import { ArrowRight, Clock, Gauge, Lightbulb, Repeat, Target, TrendingUp, Wrench } from "lucide-react"
import type { AnalysisResult, Opportunity, Priority } from "@/lib/analyze"

function priorityStyles(priority: Priority): string {
  switch (priority) {
    case "High":
      return "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
    case "Medium":
      return "bg-accent/15 text-accent-foreground ring-1 ring-inset ring-accent/30"
    case "Low":
      return "bg-secondary text-secondary-foreground ring-1 ring-inset ring-border"
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-mono text-2xl font-bold text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-foreground">{children}</p>
      </div>
    </div>
  )
}

function OpportunityCard({ opportunity, index }: { opportunity: Opportunity; index: number }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            {index + 1}
          </span>
          <h3 className="text-base font-bold text-foreground text-pretty">{opportunity.repetitiveTask}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles(opportunity.priority)}`}>
          {opportunity.priority} priority
        </span>
      </header>

      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
        <DetailRow icon={Repeat} label="Repetitive Task">
          {opportunity.repetitiveTask}
        </DetailRow>
        <DetailRow icon={Lightbulb} label="AI Opportunity">
          {opportunity.aiOpportunity}
        </DetailRow>
        <DetailRow icon={Wrench} label="Recommended AI Solution">
          {opportunity.recommendedSolution}
        </DetailRow>
        <DetailRow icon={TrendingUp} label="Estimated Impact">
          {opportunity.estimatedImpact}
        </DetailRow>
      </div>

      <footer className="flex items-start gap-3 border-t border-border bg-accent/10 px-5 py-4">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-accent/25 text-accent-foreground">
          <Target className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            Recommended First Step
          </p>
          <p className="mt-0.5 text-sm font-medium leading-relaxed text-foreground">{opportunity.firstStep}</p>
        </div>
      </footer>
    </article>
  )
}

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const { summary, opportunities } = result

  return (
    <section aria-label="Workflow analysis results" className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground ring-1 ring-inset ring-accent/30">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Analysis complete
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-foreground text-balance">Your AI opportunity map</h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Based on your workflow, here are the highest-value places to start using AI. Demo analysis — no data leaves
          your browser.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Repeat} label="Tasks analyzed" value={String(summary.tasksAnalyzed)} />
        <StatCard icon={Lightbulb} label="Opportunities" value={String(summary.opportunitiesFound)} />
        <StatCard
          icon={Clock}
          label="Potential savings"
          value={`${summary.estimatedHoursPerWeek}h`}
          sub="per week"
        />
        <StatCard
          icon={Gauge}
          label="Automation score"
          value={`${summary.automationScore}`}
          sub="out of 100"
        />
      </div>

      <div className="flex flex-col gap-4">
        {opportunities.map((opportunity, index) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} />
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
        <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Pick one <span className="font-semibold text-foreground">High priority</span> item and try its first step
          this week. Small, consistent wins build real AI fluency.
        </p>
      </div>
    </section>
  )
}
