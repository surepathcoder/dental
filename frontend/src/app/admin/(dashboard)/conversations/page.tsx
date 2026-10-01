"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Bot, ExternalLink, Headset } from "lucide-react"

import { ConversationTranscript } from "@/components/admin/transcript"
import { EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, ScoreBadge, Spinner, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { api, useApi } from "@/lib/api"
import { fmtDateTime, timeAgo } from "@/lib/format"
import type { Conversation, Paginated } from "@/lib/types"
import { cn } from "@/lib/utils"

const FILTERS = ["ALL", "WAITING_STAFF", "ACTIVE", "BOOKED", "FOLLOW_UP", "ABANDONED", "CLOSED"] as const

export default function ConversationsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL")
  const [openId, setOpenId] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)

  const path = useMemo(() => `/conversations?limit=100${filter === "ALL" ? "" : `&status=${filter}`}`, [filter])
  const { data, error, loading, reload } = useApi<Paginated<Conversation>>(path, { refreshMs: 8000 })
  const detail = useApi<Conversation>(openId ? `/conversations/${openId}` : null, { refreshMs: openId ? 3000 : undefined })
  const waiting = data?.status_counts?.WAITING_STAFF ?? 0

  useEffect(() => {
    const base = "AI conversations"
    document.title = waiting > 0 ? `(${waiting}) Waiting · ${base}` : base
    return () => {
      document.title = base
    }
  }, [waiting])

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI conversations"
        description="Every chat the AI receptionist handled. Conversations waiting for staff light up so the front desk can take over live."
      />

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card text-ink/70 hover:border-primary/40",
            )}
          >
            {f.replace("_", " ")}
            {data?.status_counts?.[f] !== undefined && <span className="ml-1.5 opacity-70">{data.status_counts[f]}</span>}
            {f === "WAITING_STAFF" && waiting > 0 && <span className="ml-1.5 rounded-full bg-violet-600 px-1.5 text-[10px] text-white">{waiting}</span>}
          </button>
        ))}
      </div>

      {loading && !data && <LoadingBlock rows={6} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}
      {data && data.items.length === 0 && <EmptyBlock title="No conversations here yet" />}

      {data && data.items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  {["Conversation", "Patient", "Intent", "Service", "Lead score", "Status", "Messages", "Started"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((c) => (
                  <tr key={c.id} className="cursor-pointer transition hover:bg-muted/40" onClick={() => setOpenId(c.id)}>
                    <td className="max-w-xs px-4 py-3">
                      <span className="flex items-center gap-2">
                        {c.status === "WAITING_STAFF" ? <Headset className="size-3.5 shrink-0 text-violet-600" /> : <Bot className="size-3.5 shrink-0 text-primary" />}
                        <span className="truncate text-ink">{c.preview ?? "—"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.patient_name ? (
                        <span className="font-medium text-ink">{c.patient_name}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Anonymous visitor</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink">{c.intent}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.service ?? "—"}</td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={c.lead_score} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{c.message_count}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
            Showing {data.items.length} of {data.total} conversations
          </p>
        </div>
      )}

      <Dialog open={Boolean(openId)} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conversation transcript</DialogTitle>
            <DialogDescription>
              {detail.data
                ? `${detail.data.intent} · ${fmtDateTime(detail.data.created_at)} · ${detail.data.status.replace("_", " ").toLowerCase()}`
                : "Loading…"}
            </DialogDescription>
          </DialogHeader>
          {detail.loading && <Spinner />}
          {detail.error && <ErrorBlock message={detail.error.message} />}
          {detail.data && (
            <>
              {detail.data.staff_brief && (
                <div className="rounded-xl border bg-violet-50/70 px-3 py-2 text-sm text-ink">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">Staff brief</p>
                  <p className="mt-0.5 leading-relaxed">{detail.data.staff_brief}</p>
                </div>
              )}
              <ConversationTranscript conversation={detail.data} />
              <form
                className="space-y-2 rounded-xl border bg-card p-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!openId || !reply.trim() || sending) return
                  setSending(true)
                  try {
                    await api(`/conversations/${openId}/staff-reply`, { method: "POST", json: { message: reply.trim() } })
                    setReply("")
                    await detail.reload(true)
                    await reload(true)
                  } finally {
                    setSending(false)
                  }
                }}
              >
                <p className="text-xs font-semibold text-ink">Reply as front desk</p>
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="The visitor will see this in the website chat…" />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" size="sm" disabled={!reply.trim() || sending}>
                    Send to visitor
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={sending}
                    onClick={async () => {
                      if (!openId) return
                      setSending(true)
                      try {
                        await api(`/conversations/${openId}/resume`, { method: "POST" })
                        await detail.reload(true)
                        await reload(true)
                      } finally {
                        setSending(false)
                      }
                    }}
                  >
                    Return to AI
                  </Button>
                </div>
              </form>
            </>
          )}
          {detail.data?.lead_id && (
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href={`/admin/leads/${detail.data.lead_id}`}>
                <ExternalLink /> Open lead record
              </Link>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
