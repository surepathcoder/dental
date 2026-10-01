"use client"

import { Bot, User, Workflow } from "lucide-react"

import { fmtDateTime } from "@/lib/format"
import type { Conversation } from "@/lib/types"
import { cn } from "@/lib/utils"

const TRACE_LABELS: Record<string, string> = {
  intent_detection: "Intent detection",
  llm_intent_fallback: "LLM intent fallback",
  knowledge_retrieval: "Knowledge retrieval",
  llm_grounded_answer: "Grounded LLM answer",
  response: "Response",
  lead_qualification: "Lead qualification",
  emergency_triage: "Emergency triage",
  appointment_availability: "Availability",
  booking: "Booking",
  confirmation: "Confirmation",
  follow_up_scheduling: "Reminder scheduling",
  staff_handoff: "Staff takeover",
  staff_reply: "Front desk reply",
  staff_resume: "Returned to AI",
  manage_visit: "Find / change visit",
  appointment_cancelled: "Appointment cancelled",
  appointment_reschedule: "Reschedule",
}

export function ConversationTranscript({ conversation, className }: { conversation: Conversation; className?: string }) {
  const messages = conversation.messages ?? []
  return (
    <div className={cn("space-y-4", className)}>
      {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages in this conversation.</p>}
      {messages.map((m) => {
        const trace = (m.meta?.trace as string[] | undefined) ?? []
        return (
          <div key={m.id} className={cn("flex gap-2.5", m.role === "user" ? "justify-end" : "")}>
            {m.role !== "user" && (
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Bot className="size-3.5" />
              </span>
            )}
            <div className={cn("min-w-0 max-w-[80%]", m.role === "user" && "text-right")}>
              <div
                className={cn(
                  "inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-tl-md bg-muted text-ink",
                )}
              >
                {m.content}
              </div>
              {m.meta?.source === "staff" && (
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">Front desk</p>
              )}
              {trace.length > 0 && (
                <p className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                  <Workflow className="size-3 text-primary" />
                  {trace.map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded bg-secondary/70 px-1.5 py-0.5 font-medium text-secondary-foreground">
                      {TRACE_LABELS[t] ?? t}
                    </span>
                  ))}
                </p>
              )}
              {Array.isArray(m.meta?.retrieved) && m.meta.retrieved.length > 0 && (
                <p className="mt-1 text-[10px] text-muted-foreground">Knowledge used: {(m.meta.retrieved as string[]).join(", ")}</p>
              )}
            </div>
            {m.role === "user" && (
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-white">
                <User className="size-3.5" />
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
