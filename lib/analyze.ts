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

type Category = {
  id: string
  title: string
  // Weighted signals. Multi-word phrases are more specific, so they score higher.
  // `weight` lets us bias a category when its terms are strong/unambiguous.
  strong: string[] // specific phrases — high confidence (score 3 each)
  weak: string[] // single words — supporting evidence (score 1 each)
  aiOpportunity: string
  recommendedSolution: string
  hoursSavedPerWeek: number
  priority: Priority
  firstStep: string
}

// Category-based knowledge base. Each detected task is scored against every
// category and assigned to its single best match, so the recommendation always
// aligns with the actual task (no more "copy data" -> AI writing tool).
const CATEGORIES: Category[] = [
  {
    id: "spreadsheets",
    title: "Copying and moving data between spreadsheets and systems",
    strong: [
      "copy data",
      "copying data",
      "paste data",
      "between spreadsheets",
      "between systems",
      "moving data",
      "move data",
      "transfer data",
      "data entry",
      "enter data",
      "re-enter",
      "reenter",
      "retype",
      "re-type",
      "manual input",
      "update spreadsheet",
      "vlookup",
      "csv import",
      "export to excel",
    ],
    weak: ["spreadsheet", "spreadsheets", "excel", "sheets", "csv", "database", "crm entry"],
    aiOpportunity: "Automatically extract, map, and sync data between your spreadsheets and systems instead of retyping it",
    recommendedSolution:
      "A no-code workflow automation (n8n, Make, or Power Automate) plus AI-powered spreadsheet functions (Copilot in Excel / Gemini in Sheets) for extraction and cleanup",
    hoursSavedPerWeek: 6,
    priority: "High",
    firstStep:
      "Pick one recurring copy-paste route and rebuild it as a single automated flow (e.g. a Power Automate / n8n template) that moves the data for you.",
  },
  {
    id: "reports",
    title: "Compiling recurring reports and analyzing data",
    strong: [
      "compile report",
      "compiling report",
      "compile reports",
      "build report",
      "weekly report",
      "monthly report",
      "status report",
      "status update",
      "weekly update",
      "analyze data",
      "data analysis",
      "pull metrics",
      "dashboard update",
      "summarize results",
    ],
    weak: ["report", "reports", "reporting", "recap", "metrics", "kpi", "analytics"],
    aiOpportunity: "Summarize raw data into report drafts and surface the key trends and outliers automatically",
    recommendedSolution:
      "AI report summarization + data analysis (ChatGPT / Claude with a reusable report prompt, or Copilot connected to your data export)",
    hoursSavedPerWeek: 5,
    priority: "High",
    firstStep:
      "Paste last period's raw data into an AI tool and ask it to draft your standard report format and call out the top 3 changes.",
  },
  {
    id: "scheduling",
    title: "Coordinating and scheduling meetings",
    strong: [
      "schedule meeting",
      "scheduling meeting",
      "schedule meetings",
      "book meeting",
      "booking meeting",
      "set up meeting",
      "setting up meeting",
      "coordinate calendar",
      "coordinate schedule",
      "coordinating schedules",
      "find a time",
      "book appointment",
      "booking appointment",
      "calendar invite",
      "arrange meeting",
      "back and forth",
    ],
    weak: ["schedule", "scheduling", "calendar", "appointment", "booking", "availability"],
    aiOpportunity: "Let an AI assistant propose times, handle the back-and-forth, and send invites for you",
    recommendedSolution:
      "An AI scheduling assistant (e.g. Reclaim, Motion, or Copilot scheduling) that reads availability and books meetings automatically",
    hoursSavedPerWeek: 3,
    priority: "Medium",
    firstStep:
      "Connect an AI scheduling assistant to your calendar and let it handle the next round of meeting coordination.",
  },
  {
    id: "meeting-notes",
    title: "Taking meeting notes and writing follow-ups",
    strong: [
      "meeting notes",
      "take notes",
      "taking notes",
      "note taking",
      "note-taking",
      "meeting minutes",
      "transcribe",
      "transcription",
      "action items",
      "follow-up email",
      "write up notes",
      "recap the meeting",
    ],
    weak: ["notes", "minutes", "transcript"],
    aiOpportunity: "Transcribe and summarize meetings into structured notes, decisions, and action items automatically",
    recommendedSolution:
      "An AI meeting notetaker (Otter, Fireflies, or built-in Teams / Google Meet summaries) that captures and shares follow-ups",
    hoursSavedPerWeek: 3,
    priority: "Medium",
    firstStep: "Add an AI notetaker to your next recurring meeting to auto-capture the summary and action items.",
  },
  {
    id: "email",
    title: "Reading, sorting, and replying to routine email",
    strong: [
      "reply to email",
      "replying to email",
      "respond to email",
      "responding to email",
      "answer email",
      "answering email",
      "sort email",
      "sorting email",
      "triage email",
      "clear inbox",
      "manage inbox",
      "email correspondence",
      "routine email",
    ],
    weak: ["email", "emails", "inbox", "outlook", "gmail", "correspondence"],
    aiOpportunity: "Draft, summarize, and triage inbound email automatically so you only review and send",
    recommendedSolution:
      "An AI email assistant (Copilot for Outlook / Gemini for Gmail) with saved reply templates for your common message types",
    hoursSavedPerWeek: 5,
    priority: "High",
    firstStep: "Turn on AI-suggested replies for your 3 most common email types this week.",
  },
  {
    id: "support",
    title: "Answering repetitive customer questions and tickets",
    strong: [
      "customer question",
      "customer questions",
      "support ticket",
      "support tickets",
      "customer inquiries",
      "customer inquiry",
      "answer tickets",
      "respond to tickets",
      "help desk",
      "helpdesk",
      "customer support",
      "client questions",
      "faq",
    ],
    weak: ["ticket", "tickets", "inquiry", "inquiries", "complaints", "escalation"],
    aiOpportunity: "Draft consistent, on-brand responses and deflect common questions with an AI knowledge assistant",
    recommendedSolution:
      "AI reply drafting inside your helpdesk (Zendesk / Intercom AI) backed by an internal FAQ knowledge assistant",
    hoursSavedPerWeek: 5,
    priority: "High",
    firstStep: "Build an AI prompt from your 10 most common tickets and use it to draft first-pass replies.",
  },
  {
    id: "documents",
    title: "Processing documents, invoices, and forms",
    strong: [
      "process invoice",
      "processing invoices",
      "process forms",
      "processing forms",
      "extract from pdf",
      "read pdf",
      "scan document",
      "scanning documents",
      "data from documents",
      "reconcile invoice",
      "expense report",
      "fill out form",
      "filling out forms",
      "contract review",
    ],
    weak: ["invoice", "invoices", "receipts", "forms", "pdf", "ocr", "paperwork", "documents"],
    aiOpportunity: "Extract fields from documents, validate them, and flag anomalies instead of reading each one by hand",
    recommendedSolution:
      "An AI document-processing / OCR tool (Azure Document Intelligence, Rossum, or Copilot) integrated with your system of record",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Run a batch of last month's documents through an AI document reader and check the extracted fields.",
  },
  {
    id: "research",
    title: "Researching and gathering information from many sources",
    strong: [
      "look up information",
      "looking up information",
      "gather information",
      "gathering information",
      "do research",
      "doing research",
      "market research",
      "competitive research",
      "find sources",
      "compile information",
      "background research",
      "search the web",
    ],
    weak: ["research", "google", "sources", "browsing"],
    aiOpportunity: "Search, synthesize, and cite findings from many sources in minutes instead of hours",
    recommendedSolution:
      "An AI research assistant with web access (Perplexity, ChatGPT search, or Gemini Deep Research) with source verification",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Run your next research task through an AI search tool and verify its top-cited sources.",
  },
  {
    id: "content",
    title: "Creating repetitive content and marketing copy",
    strong: [
      "write content",
      "writing content",
      "create content",
      "creating content",
      "social media post",
      "social media posts",
      "write posts",
      "blog post",
      "blog posts",
      "newsletter",
      "marketing copy",
      "product description",
      "ad copy",
      "content calendar",
    ],
    weak: ["content", "social", "blog", "captions", "campaign", "copywriting"],
    aiOpportunity: "Generate on-brand first drafts and variations of content, then refine with a human review step",
    recommendedSolution:
      "An AI writing tool (ChatGPT, Claude, or Jasper) with a saved brand-voice prompt and a required human edit pass",
    hoursSavedPerWeek: 4,
    priority: "Medium",
    firstStep: "Create a reusable brand-voice prompt and use it to draft next week's content.",
  },
]

const FALLBACK = {
  aiOpportunity: "Use a general-purpose AI assistant to draft, summarize, and speed up this task",
  recommendedSolution: "ChatGPT, Claude, or Microsoft Copilot with a reusable prompt built for this specific task",
  hoursSavedPerWeek: 2,
  priority: "Medium" as Priority,
  firstStep: "Write down the exact steps of this task, then ask an AI tool to help with the slowest step.",
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim()
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

// Score a single task string against a category. Specific multi-word phrases
// dominate single-word signals so ambiguous words (e.g. "copy") never win.
function scoreCategory(task: string, category: Category): number {
  let score = 0
  for (const phrase of category.strong) {
    if (task.includes(phrase)) score += 3
  }
  for (const word of category.weak) {
    // Word-boundary match so "sheets" doesn't fire on "worksheets" accidentally, etc.
    const re = new RegExp(`(^|[^a-z])${escapeRegExp(word)}([^a-z]|$)`)
    if (re.test(task)) score += 1
  }
  return score
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function impactLabel(hours: number): string {
  const magnitude = hours >= 5 ? "High" : hours >= 3 ? "Moderate" : "Modest"
  return `${magnitude} — ~${hours} hrs/week saved`
}

export function analyzeWorkflow(input: WorkflowInput): AnalysisResult {
  // Repetitive tasks are the primary signal; daily tasks add context.
  const repetitive = splitTasks(input.repetitiveTasks)
  const daily = splitTasks(input.dailyTasks)
  const taskList = [...repetitive, ...daily]
  const tasksAnalyzed = Math.max(taskList.length, 1)
  const multiplier = experienceMultiplier(input.aiExperience)

  // Assign each detected task to its single best-matching category.
  type Bucket = { category: Category; phrases: string[]; bestScore: number }
  const buckets = new Map<string, Bucket>()

  for (const rawTask of taskList) {
    const task = normalize(rawTask)
    let best: Category | null = null
    let bestScore = 0

    for (const category of CATEGORIES) {
      const score = scoreCategory(task, category)
      if (score > bestScore) {
        bestScore = score
        best = category
      }
    }

    if (!best || bestScore === 0) continue

    const existing = buckets.get(best.id)
    if (existing) {
      existing.phrases.push(rawTask.trim())
      existing.bestScore = Math.max(existing.bestScore, bestScore)
    } else {
      buckets.set(best.id, { category: best, phrases: [rawTask.trim()], bestScore })
    }
  }

  let opportunities: Opportunity[] = Array.from(buckets.values()).map(({ category, phrases }) => {
    // Prefer a repetitive-task phrase for the label; fall back to the category title.
    const userPhrase =
      phrases.find((p) => repetitive.some((r) => normalize(r) === normalize(p))) ?? phrases[0] ?? category.title
    const hours = Math.round(category.hoursSavedPerWeek * multiplier)
    return {
      id: `opp-${category.id}`,
      repetitiveTask: titleCase(userPhrase),
      aiOpportunity: category.aiOpportunity,
      recommendedSolution: category.recommendedSolution,
      hoursSavedPerWeek: hours,
      estimatedImpact: impactLabel(hours),
      priority: category.priority,
      firstStep: category.firstStep,
    }
  })

  // Always give the employee something actionable, even with sparse input.
  if (opportunities.length === 0) {
    const firstTask = taskList[0] ?? ""
    const hours = Math.round(FALLBACK.hoursSavedPerWeek * multiplier)
    opportunities = [
      {
        id: "opp-fallback",
        repetitiveTask: titleCase(firstTask || "Recurring manual work in your daily routine"),
        aiOpportunity: FALLBACK.aiOpportunity,
        recommendedSolution: FALLBACK.recommendedSolution,
        hoursSavedPerWeek: hours,
        estimatedImpact: impactLabel(hours),
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
