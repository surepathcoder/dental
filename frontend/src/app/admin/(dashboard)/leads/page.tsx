"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronRight, Download, Search } from "lucide-react"

import { EmptyBlock, ErrorBlock, LeadStatusBadge, LoadingBlock, PageHeader, ScoreBadge } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApi } from "@/lib/api"
import { SOURCE_LABELS, timeAgo } from "@/lib/format"
import type { Lead, Paginated } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUSES = ["ALL", "NEW", "CONTACTED", "QUALIFIED", "BOOKED", "FOLLOW_UP", "CONVERTED", "LOST"] as const

export default function LeadsPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL")
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [callableOnly, setCallableOnly] = useState(true)

  const path = useMemo(() => {
    const p = new URLSearchParams({ limit: "200" })
    if (status !== "ALL") p.set("status", status)
    if (search) p.set("q", search)
    return `/leads?${p.toString()}`
  }, [status, search])

  const { data, error, loading, reload } = useApi<Paginated<Lead>>(path, { refreshMs: 30000 })

  const rows = useMemo(() => {
    const items = data?.items ?? []
    if (!callableOnly) return items
    return items.filter((l) => l.phone || l.email)
  }, [data, callableOnly])

  const exportCsv = () => {
    if (!data) return
    const csvRows = [
      ["Name", "Phone", "Email", "Service", "Patient type", "Status", "Score", "Source", "Created", "Last activity"],
      ...rows.map((l) => [l.name ?? "", l.phone ?? "", l.email ?? "", l.service ?? "", l.patient_type ?? "", l.status, l.score_label, l.source, l.created_at, l.last_activity_at]),
    ]
    const csv = csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "leads.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every patient inquiry captured by the AI receptionist, booking form and front desk."
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data?.items.length}>
            <Download /> Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => {
            const count = s === "ALL" ? data?.total : data?.status_counts?.[s]
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  status === s ? "border-primary bg-primary text-primary-foreground" : "bg-card text-ink/70 hover:border-primary/40",
                )}
              >
                {s.replace("_", " ")}
                {count !== undefined && <span className="ml-1.5 opacity-70">{count}</span>}
              </button>
            )
          })}
        </div>
        <form
          className="relative lg:ml-auto lg:w-72"
          onSubmit={(e) => {
            e.preventDefault()
            setSearch(query.trim())
          }}
        >
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or phone" className="h-10 pl-9" maxLength={100} />
        </form>
        <label className="flex items-center gap-2 text-xs font-medium text-ink/70">
          <input type="checkbox" className="size-3.5 accent-primary" checked={callableOnly} onChange={(e) => setCallableOnly(e.target.checked)} />
          Phone or email only
        </label>
      </div>

      {loading && !data && <LoadingBlock rows={6} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}

      {data && rows.length === 0 && <EmptyBlock title="No leads match this filter" body="Try a different status, or clear the search." />}

      {data && rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-muted/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  {["Name", "Contact", "Service", "Patient", "Status", "Score", "Source", "Created", "Last activity", ""].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((l) => (
                  <tr key={l.id} className="group transition hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-medium text-ink hover:text-primary">
                        {l.name ?? <span className="text-muted-foreground italic">Website visitor</span>}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {l.phone && (
                        <a href={`tel:+1${l.phone.replace(/\D/g, "").slice(-10)}`} className="block font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          {l.phone}
                        </a>
                      )}
                      {l.email && <span className="block truncate">{l.email}</span>}
                      {!l.phone && !l.email && <span className="italic">No contact yet</span>}
                    </td>
                    <td className="px-4 py-3 text-ink">{l.service ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{l.patient_type ?? "—"}</td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={l.score_label} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{SOURCE_LABELS[l.source] ?? l.source}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(l.created_at)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(l.last_activity_at)}</td>
                    <td className="px-2 py-3">
                      <Link href={`/admin/leads/${l.id}`} aria-label={`Open ${l.name ?? "lead"}`} className="grid size-7 place-items-center rounded-md text-muted-foreground group-hover:bg-secondary group-hover:text-primary">
                        <ChevronRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
            Showing {rows.length} of {data.total} leads
          </p>
        </div>
      )}
    </div>
  )
}
