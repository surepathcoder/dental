"use client"

import { useEffect, useState } from "react"
import { BellRing, CalendarCheck2, Clock3, Mail, MessageSquareText, Star, XCircle } from "lucide-react"

import { fmtDateTime } from "@/lib/format"
import type { FlowEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

const ICONS: Record<string, typeof Mail> = {
  booked: CalendarCheck2,
  email: Mail,
  sms: MessageSquareText,
  reminder_24h: BellRing,
  reminder_2h: Clock3,
  reminder_30m: Clock3,
  review: Star,
  followup: BellRing,
}

const STATUS_STYLE: Record<FlowEvent["status"], { label: string; cls: string }> = {
  completed: { label: "Done", cls: "bg-success/12 text-success" },
  simulated: { label: "Simulated", cls: "bg-amber-100 text-amber-800" },
  scheduled: { label: "Scheduled", cls: "bg-sky-100 text-sky-800" },
  pending: { label: "Skipped", cls: "bg-muted text-muted-foreground" },
  failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
}

/** Vertical automation timeline with a staggered reveal. */
export function AutomationTimeline({ events, animate = true, compact = false }: { events: FlowEvent[]; animate?: boolean; compact?: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : events.length)

  useEffect(() => {
    if (!animate) return
    if (shown >= events.length) return
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 250 : 550)
    return () => clearTimeout(t)
  }, [animate, shown, events.length])

  return (
    <ol className="relative space-y-0" aria-label="Automation steps">
      {events.map((ev, i) => {
        const Icon = ev.status === "failed" ? XCircle : (ICONS[ev.key] ?? BellRing)
        const visible = i < shown
        const st = STATUS_STYLE[ev.status]
        return (
          <li
            key={`${ev.key}-${i}`}
            className={cn("relative flex gap-3 pb-3 transition-all duration-500 last:pb-0", visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}
          >
            {i < events.length - 1 && <span className="absolute top-8 left-[15px] h-[calc(100%-1.75rem)] w-px bg-border" aria-hidden />}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-card",
                ev.status === "scheduled" ? "bg-sky-50 text-sky-700" : ev.status === "failed" ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn("font-medium text-ink", compact ? "text-[13px]" : "text-sm")}>{ev.label}</span>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", st.cls)}>{st.label}</span>
              </div>
              {(ev.detail || ev.at) && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {ev.detail}
                  {ev.status === "scheduled" && ev.at && !ev.detail.includes(" at ") ? ` · ${fmtDateTime(ev.at)}` : ""}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
