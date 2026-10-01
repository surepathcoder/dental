"use client"

import Link from "next/link"
import { use, useState } from "react"
import { ArrowLeft, BellRing, CalendarCheck, Mail, MessageSquareText, Phone, Send, ShieldCheck, Workflow } from "lucide-react"
import { toast } from "sonner"

import { ConversationTranscript } from "@/components/admin/transcript"
import { DemoDataBadge, ErrorBlock, LeadStatusBadge, LoadingBlock, PageHeader, ScoreBadge, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api, useApi } from "@/lib/api"
import { fmtDate, fmtDateTime, fmtTime, smsHref, SOURCE_LABELS, telHref, timeAgo } from "@/lib/format"
import type { LeadDetail, LeadStatus } from "@/lib/types"

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "BOOKED", "FOLLOW_UP", "CONVERTED", "LOST"]

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, loading, reload } = useApi<LeadDetail>(`/leads/${id}`)
  const [notes, setNotes] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const patch = async (body: Record<string, unknown>, message: string) => {
    setSaving(true)
    try {
      await api(`/leads/${id}`, { method: "PATCH", json: body })
      toast.success(message)
      await reload(true)
    } catch (e) {
      toast.error("Update failed", { description: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const scheduleFollowUp = async () => {
    try {
      await api("/followups", { method: "POST", json: { lead_id: Number(id), kind: "missed_lead", delay_hours: 24 } })
      toast.success("Follow-up scheduled", { description: "It will be sent (simulated) in 24 hours." })
      await reload(true)
    } catch (e) {
      toast.error("Couldn't schedule follow-up", { description: (e as Error).message })
    }
  }

  const scheduleTreatmentPlan = async () => {
    try {
      await api("/followups", { method: "POST", json: { lead_id: Number(id), kind: "treatment_plan" } })
      toast.success("Treatment-plan follow-up queued", { description: "Nudges go out at 3 days and 10 days." })
      await reload(true)
    } catch (e) {
      toast.error("Couldn't schedule treatment-plan follow-up", { description: (e as Error).message })
    }
  }

  const sendNow = async (followupId: number) => {
    try {
      await api(`/followups/${followupId}/send`, { method: "POST" })
      toast.success("Follow-up sent", { description: "Simulated in demo mode — no real message was delivered." })
      await reload(true)
    } catch (e) {
      toast.error("Couldn't send", { description: (e as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/leads">
          <ArrowLeft /> All leads
        </Link>
      </Button>

      {loading && !data && <LoadingBlock rows={5} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}

      {data && (
        <>
          <PageHeader
            title={data.name ?? "Website visitor"}
            description={`${data.service ?? "General inquiry"} · ${SOURCE_LABELS[data.source] ?? data.source} · created ${timeAgo(data.created_at)}`}
            actions={
              <>
                <ScoreBadge score={data.score_label} />
                <LeadStatusBadge status={data.status} />
                {data.is_demo && <DemoDataBadge />}
              </>
            }
          />

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-2xl border bg-card p-5">
                <p className="mb-4 flex items-center gap-2 font-semibold text-ink">
                  <MessageSquareText className="size-4 text-primary" /> Conversation history
                </p>
                {data.conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">This lead came from a form — no chat transcript.</p>
                ) : (
                  data.conversations.map((c) => (
                    <div key={c.id} className="mb-6 last:mb-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <StatusPill status={c.status} />
                        <span>{c.intent}</span>
                        <span>·</span>
                        <span>{fmtDateTime(c.created_at)}</span>
                        <span>·</span>
                        <span>{c.message_count} messages</span>
                      </div>
                      <ConversationTranscript conversation={c} />
                    </div>
                  ))
                )}
              </section>

              <section className="rounded-2xl border bg-card p-5">
                <p className="mb-4 flex items-center gap-2 font-semibold text-ink">
                  <Workflow className="size-4 text-primary" /> Automation history
                </p>
                {data.events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No automation has run for this lead yet.</p>
                ) : (
                  <ol className="space-y-3">
                    {data.events.map((e) => (
                      <li key={e.id} className="flex gap-3">
                        <BellRing className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">{e.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {fmtDateTime(e.created_at)}
                            {e.detail ? ` · ${e.detail}` : ""}
                          </p>
                        </div>
                        <StatusPill status={e.status} />
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border bg-card p-5">
                <p className="mb-4 font-semibold text-ink">Lead details</p>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="size-3.5" /> Phone
                    </dt>
                    <dd className="text-right font-medium break-all text-ink">
                      {data.phone ? (
                        <span className="flex flex-col items-end gap-0.5">
                          <a href={telHref(data.phone)} className="text-primary hover:underline">
                            {data.phone}
                          </a>
                          {smsHref(data.phone) && (
                            <a href={smsHref(data.phone)} className="text-[11px] font-semibold text-primary hover:underline">
                              Text
                            </a>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="size-3.5" /> Email
                    </dt>
                    <dd className="text-right font-medium break-all text-ink">
                      {data.email ? (
                        <a href={`mailto:${data.email}`} className="text-primary hover:underline">
                          {data.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  {(
                    [
                      { label: "Service", value: data.service },
                      { label: "Patient type", value: data.patient_type },
                      { label: "Insurance", value: data.insurance, icon: ShieldCheck },
                      { label: "Urgency", value: data.urgency },
                      { label: "Preferred", value: [data.preferred_date, data.preferred_time].filter(Boolean).join(" · ") || null },
                      { label: "Lead score", value: `${data.score}/100` },
                    ] as { label: string; value: string | null; icon?: React.ElementType }[]
                  ).map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        {Icon && <Icon className="size-3.5" />}
                        {label}
                      </dt>
                      <dd className="text-right font-medium break-all text-ink capitalize">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rounded-2xl border bg-card p-5">
                <p className="mb-3 font-semibold text-ink">Update status</p>
                <Select value={data.status} onValueChange={(v) => patch({ status: v }, `Status set to ${v.replace("_", " ")}`)} disabled={saving}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-4 mb-2 text-sm font-medium text-ink">Notes</p>
                <Textarea
                  rows={4}
                  maxLength={4000}
                  value={notes ?? data.notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Call notes, treatment plan discussion, anything the team should know."
                />
                <Button size="sm" className="mt-2 w-full" disabled={saving || notes === null} onClick={() => patch({ notes }, "Notes saved")}>
                  Save notes
                </Button>
              </section>

              <section className="rounded-2xl border bg-card p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="font-semibold text-ink">Messages &amp; follow-ups</p>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <Button size="xs" variant="outline" onClick={scheduleFollowUp}>
                      <Send /> Missed lead
                    </Button>
                    <Button size="xs" variant="outline" onClick={scheduleTreatmentPlan}>
                      <CalendarCheck /> Treatment plan
                    </Button>
                  </div>
                </div>
                {data.followups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing scheduled.</p>
                ) : (
                  <ul className="space-y-3">
                    {data.followups.map((f) => (
                      <li key={f.id} className="rounded-xl border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-ink capitalize">{f.kind.replace(/_/g, " ")}</p>
                          <StatusPill status={f.status} />
                        </div>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{f.message}</p>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {f.channel.toUpperCase()} · {f.status === "SCHEDULED" ? `due ${fmtDateTime(f.due_at)}` : `sent ${fmtDateTime(f.sent_at ?? f.due_at)}`}
                        </p>
                        {f.status === "SCHEDULED" && (
                          <Button size="xs" variant="ghost" className="mt-1.5" onClick={() => sendNow(f.id)}>
                            Send now
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {data.appointments.length > 0 && (
                <section className="rounded-2xl border bg-card p-5">
                  <p className="mb-3 flex items-center gap-2 font-semibold text-ink">
                    <CalendarCheck className="size-4 text-primary" /> Appointments
                  </p>
                  <ul className="space-y-2">
                    {data.appointments.map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
                        <span>
                          <span className="block font-medium text-ink">
                            {fmtDate(a.start_at)} · {fmtTime(a.start_at)}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {a.service} · {a.provider_name}
                          </span>
                        </span>
                        <StatusPill status={a.status} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
