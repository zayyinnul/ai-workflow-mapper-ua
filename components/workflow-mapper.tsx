"use client"

import { useRef, useState } from "react"
import { Workflow } from "lucide-react"
import { WorkflowForm } from "@/components/workflow-form"
import { AnalysisResults } from "@/components/analysis-results"
import { analyzeWorkflow, type AnalysisResult, type WorkflowInput } from "@/lib/analyze"

export function WorkflowMapper() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleAnalyze = (input: WorkflowInput) => {
    setIsAnalyzing(true)
    setResult(null)
    // Simulate processing for a realistic feel; mock analysis runs locally.
    setTimeout(() => {
      const analysis = analyzeWorkflow(input)
      setResult(analysis)
      setIsAnalyzing(false)
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }, 900)
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      <div className="lg:sticky lg:top-8">
        <WorkflowForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      <div ref={resultsRef} className="scroll-mt-8">
        {result ? (
          <AnalysisResults result={result} />
        ) : (
          <EmptyState isAnalyzing={isAnalyzing} />
        )}
      </div>
    </div>
  )
}

function EmptyState({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div
        className={`flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary ${
          isAnalyzing ? "animate-pulse" : ""
        }`}
      >
        <Workflow className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-bold text-foreground text-balance">
        {isAnalyzing ? "Mapping your workflow..." : "Your results will appear here"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
        {isAnalyzing
          ? "Scanning your tasks for repetitive patterns and matching them to practical AI solutions."
          : "Fill in the form and select “Analyze My Workflow” to get a personalized map of repetitive tasks and AI opportunities."}
      </p>
    </div>
  )
}
