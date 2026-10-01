"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bot, CalendarCheck, ClipboardList, HeartHandshake, Headset, MessageSquareText, Play, Repeat, Send, Star, Workflow, Zap } from "lucide-react"
import { toast } from "sonner"

import { ErrorBlock, LoadingBlock, PageHeader, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { api, useApi } from "@/lib/api"
import { fmtDateTime, timeAgo } from "@/lib/format"
import type { Automation, AutomationEvent, FollowUp } from "@/lib/types"
import { cn } from "@/lib/utils"

const ICONS: Record<string, React.ElementType> = {
  ai_receptionist: Bot,
  lead_qualification: ClipboardList,
  appointment_confirmation: CalendarCheck,
  sms_reminder: MessageSquareText,
  missed_lead_followup: Repeat,
  review_request: Star,
  no_show_recovery: Repeat,
  hygiene_recall: CalendarCheck,
  staff_handoff_alert: Headset,
  treatment_plan_followup: HeartHandshake,
}

const STEP_STYLE: Record<string, string> = {
  trigger: "bg-ink text-white",
  ai: "bg-primary text-primary-foreground",
  action: "bg-secondary text-secondary-foreground",
  delay: "bg-muted text-muted-foreground",
  result: "bg-emerald-100 text-emerald-800",
}

export default function AutomationsPage() {
  const automations = useApi<Automation[]>("/automations", { refreshMs: 30000 })
  const events = useApi<AutomationEvent[]>("/automations/events?limit=25", { refreshMs: 15000 })
  const followups = useApi<FollowUp[]>("/followups?status=SCHEDULED&limit=20", { refreshMs: 30000 })
  const [busy, setBusy] = useState<string | null>(null)
  const router = useRouter()

  const toggle = async (a: Automation, active: boolean) => {
    setBusy(a.key)
    try {
      await api("/automations", { method: "POST", json: { key: a.key, status: active ? "ACTIVE" : "PAUSED" } })
      toast.success(`${a.name} ${active ? "activated" : "paused"}`)
      await automations.reload(true)
    } catch (e) {
      toast.error("Couldn't update automation", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const simulateMissedLead = async () => {
    setBusy("simulate")
    try {
      const res = await api<{ lead_id: number }>("/demo/missed-lead", { method: "POST" })
      toast.success("Missed lead simulated", {
        description: "A visitor showed interest, left without booking, and a follow-up was scheduled.",
        action: { label: "View lead", onClick: () => router.push(`/admin/leads/${res.lead_id}`) },
      })
      await Promise.all([events.reload(true), followups.reload(true), automations.reload(true)])
    } catch (e) {
      toast.error("Simulation failed", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const processDue = async () => {
    setBusy("process")
    try {
      const res = await api<{ processed: number }>("/followups/process", { method: "POST" })
      toast.success(res.processed ? `${res.processed} follow-up${res.processed > 1 ? "s" : ""} delivered` : "Nothing was due right now", {
        description: "Messages are simulated in demo mode.",
      })
      await Promise.all([events.reload(true), followups.reload(true)])
    } catch (e) {
      toast.error("Couldn't process follow-ups", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const sendNow = async (id: number) => {
    try {
      await api(`/followups/${id}/send`, { method: "POST" })
      toast.success("Sent (simulated)")
      await Promise.all([events.reload(true), followups.reload(true)])
    } catch (e) {
      toast.error("Couldn't send", { description: (e as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation center"
        description="Automations that turn website traffic into booked, reminded and followed-up patients."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={simulateMissedLead} disabled={busy === "simulate"}>
              <Play /> Simulate missed lead
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/automations/builder">
                <Workflow /> Workflow builder
              </Link>
            </Button>
          </>
        }
      />

      {automations.loading && !automations.data && <LoadingBlock rows={3} />}
      {automations.error && <ErrorBlock message={automations.error.message} onRetry={() => automations.reload()} />}

      <div className="grid gap-4 lg:grid-cols-2">
        {automations.data?.map((a) => {
          const Icon = ICONS[a.key] ?? Zap
          return (
            <article key={a.key} className={cn("rounded-2xl border bg-card p-5", a.status !== "ACTIVE" && "opacity-70")}>
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-ink">{a.name}</h2>
                    <StatusPill status={a.status} />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                </div>
                <Switch checked={a.status === "ACTIVE"} disabled={busy === a.key} onCheckedChange={(v) => toggle(a, v)} aria-label={`${a.name} active`} />
              </div>

              <p className="mt-4 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Trigger</p>
              <p className="text-sm text-ink">{a.trigger}</p>

              <ol className="mt-3 flex flex-wrap items-center gap-1.5">
                {a.steps.map((s, i) => (
                  <li key={`${s.label}-${i}`} className="flex items-center gap-1.5">
                    <span className={cn("rounded-lg px-2 py-1 text-[11px] font-medium", STEP_STYLE[s.type] ?? "bg-muted")}>{s.label}</span>
                    {i < a.steps.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-ink tabular-nums">{a.runs_count}</span> runs
                </span>
                <span>{a.last_run_at ? `Last run ${timeAgo(a.last_run_at)}` : "Not run yet"}</span>
              </div>
              {Object.keys(a.config ?? {}).length > 0 && (
                <p className="mt-2 truncate text-[11px] text-muted-foreground">
                  Config:{" "}
                  {Object.entries(a.config)
                    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${Array.isArray(v) ? v.join(", ") : String(v).slice(0, 60)}`)
                    .join(" · ")}
                </p>
              )}
            </article>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Send className="size-4 text-primary" /> Queued messages
            </p>
            <Button size="xs" variant="outline" onClick={processDue} disabled={busy === "process"}>
              Process due now
            </Button>
          </div>
          {followups.data?.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nothing scheduled right now.</p>}
          <ul className="space-y-3">
            {followups.data?.slice(0, 8).map((f) => (
              <li key={f.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-ink capitalize">
                    {f.kind.replace(/_/g, " ")} · {f.lead_name ?? "Lead"}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{fmtDateTime(f.due_at)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{f.message}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">{f.channel}</span>
                  <Button size="xs" variant="ghost" onClick={() => sendNow(f.id)}>
                    Send now
                  </Button>
                  <Link href={`/admin/leads/${f.lead_id}`} className="ml-auto text-[11px] font-medium text-primary hover:underline">
                    Open lead
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <p className="mb-4 flex items-center gap-2 font-semibold text-ink">
            <Zap className="size-4 text-primary" /> Activity log
          </p>
          {events.loading && !events.data && <LoadingBlock rows={4} />}
          <ol className="space-y-3">
            {events.data?.map((e) => (
              <li key={e.id} className="flex items-start gap-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{e.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {timeAgo(e.created_at)} · {e.automation_key.replace(/_/g, " ")}
                    {e.detail ? ` · ${e.detail}` : ""}
                  </p>
                </div>
                <StatusPill status={e.status} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
