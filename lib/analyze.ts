export type Priority = "High" | "Medium" | "Low"

export type WorkflowInput = {
  jobRole: string
  department: string
  dailyTasks: string
  repetitiveTasks: string
  aiExperience: string
  aiChallenge: string
}

export type Opportunity = {
  id: string
  repetitiveTask: string
  aiOpportunity: string
  recommendedSolution: string
  estimatedImpact: string
  hoursSavedPerWeek: number
  priority: Priority
  firstStep: string
}

export type AnalysisResult = {
  summary: {
    tasksAnalyzed: number
    opportunitiesFound: number
    estimatedHoursPerWeek: number
    automationScore: number
  }
  opportunities: Opportunity[]
}

type Pattern = {
  keywords: string[]
  label: (match: string) => string
  aiOpportunity: string
  recommendedSolution: string
  hoursSavedPerWeek: number
  priority: Priority
  firstStep: string
}

// Realistic, category-based mock knowledge base. Matching is keyword-driven so
// the generated results feel tailored to whatever the employee typed.
const PATTERNS: Pattern[] = [
  {
    keywords: ["email", "inbox", "reply", "respond", "correspondence", "outlook", "gmail"],
    label: () => "Reading, sorting, and replying to routine emails",
    aiOpportunity: "Draft, summarize, and triage inbound email automatically",
    recommendedSolution: "AI email assistant (Copilot for Outlook / Gemini for Gmail) with saved reply templates",
    hoursSavedPerWeek: 5,
    priority: "High",
    firstStep: "Turn on AI-suggested replies for your 3 most common email types this week.",
  },
  {
    keywords: ["report", "reporting", "summary", "summaries", "recap", "weekly update", "status"],
    label: () => "Compiling recurring reports and status summaries",
    aiOpportunity: "Auto-generate first drafts of reports from your raw data and notes",
    recommendedSolution: "ChatGPT / Claude with a reusable report prompt, connected to your data export",
    hoursSavedPerWeek: 4,
    priority: "High",
    firstStep: "Paste last week's data into an AI tool and ask it to draft your standard report format.",
  },
  {
    keywords: ["data", "spreadsheet", "excel", "entry", "copy", "paste", "csv", "manual input"],
    label: () => "Manual data entry and moving data between systems",
    aiOpportunity: "Extract, clean, and structure data with AI instead of retyping it",
    recommendedSolution: "AI-powered spreadsheet formulas (Copilot in Excel / Gemini in Sheets) or a no-code automation",
    hoursSavedPerWeek: 6,
    priority: "High",
    firstStep: "Pick one recurring copy-paste task and try an AI formula to auto-fill it.",
  },
  {
    keywords: ["schedule", "scheduling", "calendar", "meeting", "book", "appointment"],
    label: () => "Coordinating schedules and setting up meetings",
    aiOpportunity: "Let AI propose times, draft invites, and prep agendas",
    recommendedSolution: "AI scheduling assistant + meeting-notes tool (e.g. an AI notetaker on your calls)",
    hoursSavedPerWeek: 3,
    priority: "Medium",
    firstStep: "Add an AI notetaker to your next recurring meeting to auto-capture action items.",
  },
  {
    keywords: ["note", "minutes", "transcribe", "meeting notes", "document", "documentation", "write up"],
    label: () => "Taking notes and writing up documentation",
    aiOpportunity: "Transcribe and summarize meetings into structured notes and action items",
    recommendedSolution: "AI meeting assistant (Otter, Fireflies, or built-in Teams/Meet summaries)",
    hoursSavedPerWeek: 3,
    priority: "Medium",
    firstStep: "Record one meeting and let AI produce the summary and follow-ups.",
  },
  {
    keywords: ["customer", "support", "ticket", "inquiry", "faq", "client question", "helpdesk"],
    label: () => "Answering repetitive customer questions and tickets",
    aiOpportunity: "Draft consistent responses and deflect common questions with AI",
    recommendedSolution: "AI reply drafting in your helpdesk + an internal FAQ knowledge assistant",
    hoursSavedPerWeek: 5,
    priority: "High",
    firstStep: "Build an AI prompt from your 10 most common tickets and use it to draft replies.",
  },
  {
    keywords: ["research", "search", "look up", "find information", "compile", "gather"],
    label: () => "Researching and gathering information from many sources",
    aiOpportunity: "Use AI to search, synthesize, and cite findings in minutes",
    recommendedSolution: "AI research assistant with web access (Perplexity, ChatGPT search, or Gemini)",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Run your next research task through an AI search tool and verify the top sources.",
  },
  {
    keywords: ["content", "social", "post", "marketing", "copy", "blog", "newsletter", "campaign"],
    label: () => "Producing repetitive content and marketing copy",
    aiOpportunity: "Generate first drafts and variations of content on brand",
    recommendedSolution: "AI writing tool with a saved brand-voice prompt and a human review step",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Create a brand-voice prompt and use it to draft next week's posts.",
  },
  {
    keywords: ["invoice", "billing", "expense", "accounting", "reconcile", "payment", "finance"],
    label: () => "Processing invoices, expenses, and reconciliations",
    aiOpportunity: "Extract line items and flag anomalies automatically",
    recommendedSolution: "AI document-processing / OCR tool integrated with your finance system",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Test an AI document reader on a batch of last month's invoices.",
  },
  {
    keywords: ["review", "approve", "proofread", "edit", "check", "quality", "qa"],
    label: () => "Reviewing, proofreading, and quality-checking work",
    aiOpportunity: "Use AI as a first-pass reviewer to catch errors before you do",
    recommendedSolution: "AI proofreading / review assistant with a checklist prompt",
    hoursSavedPerWeek: 2,
    priority: "Low",
    firstStep: "Run your next document through an AI review pass before final human sign-off.",
  },
]

const FALLBACK: Pattern = {
  keywords: [],
  label: (match) => match || "Recurring manual work in your daily routine",
  aiOpportunity: "Use a general-purpose AI assistant to draft, summarize, and speed up this task",
  recommendedSolution: "ChatGPT, Claude, or Microsoft Copilot with a reusable prompt for this task",
  hoursSavedPerWeek: 2,
  priority: "Medium",
  firstStep: "Write down the exact steps of this task, then ask an AI tool to help with the slowest step.",
}

function normalize(text: string): string {
  return text.toLowerCase()
}

function splitTasks(text: string): string[] {
  return text
    .split(/[\n,;•\u2022]|(?:\d+\.)/g)
    .map((t) => t.trim())
    .filter((t) => t.length > 2)
}

function experienceMultiplier(experience: string): number {
  const e = normalize(experience)
  if (e.includes("advanced") || e.includes("expert") || e.includes("daily")) return 1.15
  if (e.includes("none") || e.includes("never") || e.includes("beginner")) return 0.85
  return 1
}

export function analyzeWorkflow(input: WorkflowInput): AnalysisResult {
  const combined = normalize(`${input.dailyTasks} ${input.repetitiveTasks}`)
  const taskList = [...splitTasks(input.repetitiveTasks), ...splitTasks(input.dailyTasks)]
  const tasksAnalyzed = Math.max(taskList.length, 1)
  const multiplier = experienceMultiplier(input.aiExperience)

  const matched = new Map<string, Opportunity>()

  PATTERNS.forEach((pattern, index) => {
    const hitKeyword = pattern.keywords.find((k) => combined.includes(k))
    if (!hitKeyword) return

    // Prefer the user's own phrasing for the matched task when we can find it.
    const userPhrase =
      taskList.find((t) => pattern.keywords.some((k) => normalize(t).includes(k))) ?? pattern.label(hitKeyword)

    matched.set(pattern.label(hitKeyword), {
      id: `opp-${index}`,
      repetitiveTask: userPhrase.charAt(0).toUpperCase() + userPhrase.slice(1),
      aiOpportunity: pattern.aiOpportunity,
      recommendedSolution: pattern.recommendedSolution,
      hoursSavedPerWeek: Math.round(pattern.hoursSavedPerWeek * multiplier),
      estimatedImpact: impactLabel(Math.round(pattern.hoursSavedPerWeek * multiplier)),
      priority: pattern.priority,
      firstStep: pattern.firstStep,
    })
  })

  let opportunities = Array.from(matched.values())

  // Always give the employee something actionable, even with sparse input.
  if (opportunities.length === 0) {
    const firstTask = taskList[0] ?? ""
    opportunities = [
      {
        id: "opp-fallback",
        repetitiveTask: (firstTask || FALLBACK.label("")).replace(/^\w/, (c) => c.toUpperCase()),
        aiOpportunity: FALLBACK.aiOpportunity,
        recommendedSolution: FALLBACK.recommendedSolution,
        hoursSavedPerWeek: FALLBACK.hoursSavedPerWeek,
        estimatedImpact: impactLabel(FALLBACK.hoursSavedPerWeek),
        priority: FALLBACK.priority,
        firstStep: FALLBACK.firstStep,
      },
    ]
  }

  // Sort by priority then hours saved so the most valuable wins are at the top.
  const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
  opportunities.sort(
    (a, b) => priorityRank[a.priority] - priorityRank[b.priority] || b.hoursSavedPerWeek - a.hoursSavedPerWeek,
  )

  const estimatedHoursPerWeek = opportunities.reduce((sum, o) => sum + o.hoursSavedPerWeek, 0)
  const automationScore = Math.min(
    95,
    Math.round((opportunities.length * 12 + estimatedHoursPerWeek * 3) * multiplier),
  )

  return {
    summary: {
      tasksAnalyzed,
      opportunitiesFound: opportunities.length,
      estimatedHoursPerWeek,
      automationScore: Math.max(automationScore, 24),
    },
    opportunities,
  }
}

function impactLabel(hours: number): string {
  const magnitude = hours >= 5 ? "High" : hours >= 3 ? "Moderate" : "Modest"
  return `${magnitude} — ~${hours} hrs/week saved`
}
