"use client"

import type React from "react"
import { useState } from "react"
import { Sparkles, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkflowInput } from "@/lib/analyze"

const AI_EXPERIENCE_OPTIONS = [
  "None — I've never used AI tools",
  "Beginner — I've tried a few tools",
  "Intermediate — I use AI occasionally",
  "Advanced — I use AI daily",
]

const EMPTY: WorkflowInput = {
  jobRole: "",
  department: "",
  dailyTasks: "",
  repetitiveTasks: "",
  aiExperience: "",
  aiChallenge: "",
}

const SAMPLE: WorkflowInput = {
  jobRole: "Operations Coordinator",
  department: "Operations",
  dailyTasks:
    "Answer internal emails, update project trackers in Excel, schedule cross-team meetings, compile a weekly status report, and research vendor options.",
  repetitiveTasks:
    "Copying data between spreadsheets, replying to the same types of emails, and writing the weekly report.",
  aiExperience: "Beginner — I've tried a few tools",
  aiChallenge: "I'm not sure which tasks are safe or worth automating.",
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {hint ? <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p> : null}
      {children}
    </div>
  )
}

const fieldClasses =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

export function WorkflowForm({
  onAnalyze,
  isAnalyzing,
}: {
  onAnalyze: (input: WorkflowInput) => void
  isAnalyzing: boolean
}) {
  const [values, setValues] = useState<WorkflowInput>(EMPTY)

  const set = (key: keyof WorkflowInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }))

  const isValid = values.jobRole.trim() && (values.dailyTasks.trim() || values.repetitiveTasks.trim())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isAnalyzing) return
    onAnalyze(values)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-label="Workflow analysis form"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Tell us about your work</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The more detail you share, the more tailored your recommendations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setValues(SAMPLE)}
          className="shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-secondary"
        >
          Use sample
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Job Role" htmlFor="jobRole">
            <input
              id="jobRole"
              className={fieldClasses}
              placeholder="e.g. Operations Coordinator"
              value={values.jobRole}
              onChange={set("jobRole")}
              required
            />
          </Field>
          <Field label="Department" htmlFor="department">
            <input
              id="department"
              className={fieldClasses}
              placeholder="e.g. Operations, Finance, HR"
              value={values.department}
              onChange={set("department")}
            />
          </Field>
        </div>

        <Field
          label="Daily Tasks"
          htmlFor="dailyTasks"
          hint="What does a typical day look like? List the main things you do."
        >
          <textarea
            id="dailyTasks"
            rows={3}
            className={fieldClasses}
            placeholder="e.g. Answer emails, update trackers, run reports, coordinate meetings..."
            value={values.dailyTasks}
            onChange={set("dailyTasks")}
          />
        </Field>

        <Field
          label="Repetitive / Time-Consuming Tasks"
          htmlFor="repetitiveTasks"
          hint="Which tasks feel repetitive, manual, or eat up the most time?"
        >
          <textarea
            id="repetitiveTasks"
            rows={3}
            className={fieldClasses}
            placeholder="e.g. Copying data between spreadsheets, replying to the same emails..."
            value={values.repetitiveTasks}
            onChange={set("repetitiveTasks")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="AI Experience" htmlFor="aiExperience">
            <select
              id="aiExperience"
              className={fieldClasses}
              value={values.aiExperience}
              onChange={set("aiExperience")}
            >
              <option value="">Select your level</option>
              {AI_EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Biggest AI Challenge" htmlFor="aiChallenge">
            <input
              id="aiChallenge"
              className={fieldClasses}
              placeholder="e.g. Not sure where to start"
              value={values.aiChallenge}
              onChange={set("aiChallenge")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setValues(EMPTY)}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear form
        </button>
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isAnalyzing}
          className="gap-2 font-semibold"
        >
          <Sparkles className={`size-4 ${isAnalyzing ? "animate-pulse" : ""}`} aria-hidden="true" />
          {isAnalyzing ? "Analyzing your workflow..." : "Analyze My Workflow"}
        </Button>
      </div>
      {!isValid ? (
        <p className="mt-3 text-right text-xs text-muted-foreground">
          Add your job role and at least one task to run the analysis.
        </p>
      ) : null}
    </form>
  )
}
