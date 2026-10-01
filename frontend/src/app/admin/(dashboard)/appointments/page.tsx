"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, Check, Clock, MoreHorizontal, Phone, User, X } from "lucide-react"
import { toast } from "sonner"

import { EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { api, useApi } from "@/lib/api"
import { fmtDate, fmtTime, localDayKey, SOURCE_LABELS, telHref } from "@/lib/format"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

const VIEWS = ["Upcoming", "Today", "Past"] as const

export default function AppointmentsPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Today")
  const { data, error, loading, reload } = useApi<Appointment[]>("/appointments?days=60", { refreshMs: 30000 })

  // Captured once per mount so render stays pure.
  const [now] = useState(() => Date.now())
  const [todayKey] = useState(() => localDayKey(new Date().toISOString()))

  const filtered = useMemo(() => {
    const items = data ?? []
    if (view === "Today") return items.filter((a) => localDayKey(a.start_at) === todayKey)
    if (view === "Past") return items.filter((a) => new Date(a.start_at).getTime() < now).reverse()
    return items.filter((a) => new Date(a.start_at).getTime() >= now)
  }, [data, view, todayKey, now])

  const grouped = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of filtered) {
      const key = fmtDate(a.start_at, { weekday: "long", month: "long", day: "numeric" })
      map.set(key, [...(map.get(key) ?? []), a])
    }
    return [...map.entries()]
  }, [filtered])

  const byProvider = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of filtered) {
      const key = a.provider_name || "Unassigned"
      map.set(key, [...(map.get(key) ?? []), a])
    }
    return [...map.entries()]
  }, [filtered])

  const setStatus = async (id: number, status: string) => {
    try {
      await api(`/appointments/${id}`, { method: "PATCH", json: { status } })
      toast.success(`Appointment marked ${status.toLowerCase().replace("_", " ")}`)
      await reload(true)
    } catch (e) {
      toast.error("Update failed", { description: (e as Error).message })
    }
  }

  const counts = {
    Today: (data ?? []).filter((a) => localDayKey(a.start_at) === todayKey).length,
    Upcoming: (data ?? []).filter((a) => new Date(a.start_at).getTime() >= now).length,
    Past: (data ?? []).filter((a) => new Date(a.start_at).getTime() < now).length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Booked by the AI receptionist, the online booking form and the front desk."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/book">Open booking page</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              view === v ? "border-primary bg-primary text-primary-foreground" : "bg-card text-ink/70 hover:border-primary/40",
            )}
          >
            {v} <span className="ml-1.5 opacity-70">{counts[v]}</span>
          </button>
        ))}
      </div>

      {loading && !data && <LoadingBlock rows={5} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}
      {data && filtered.length === 0 && (
        <EmptyBlock title={`No ${view.toLowerCase()} appointments`} body={view === "Today" ? "The clinic may be closed today — check the upcoming list." : undefined} />
      )}

      {view === "Today" && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {byProvider.map(([provider, items]) => (
            <section key={provider} className="overflow-hidden rounded-2xl border bg-card">
              <h2 className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3 text-sm font-semibold text-ink">
                {provider}
                <span className="text-xs font-normal text-muted-foreground">· {items.length}</span>
              </h2>
              <ul>
                {items.map((a) => (
                  <AppointmentRow key={a.id} a={a} onStatus={setStatus} compact />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <section key={day}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <CalendarDays className="size-4 text-primary" /> {day}
              <span className="text-xs font-normal text-muted-foreground">
                · {items.length} appointment{items.length > 1 ? "s" : ""}
              </span>
            </h2>
            <ul className="overflow-hidden rounded-2xl border bg-card">
              {items.map((a) => (
                <AppointmentRow key={a.id} a={a} onStatus={setStatus} />
              ))}
            </ul>
          </section>
        ))}
      </div>
      )}
    </div>
  )
}

function AppointmentRow({ a, onStatus, compact = false }: { a: Appointment; onStatus: (id: number, status: string) => void; compact?: boolean }) {
  const phone = telHref(a.patient_phone)
  return (
    <li className="flex flex-wrap items-center gap-3 border-b px-4 py-3 last:border-0 sm:flex-nowrap">
      <span className="flex w-24 shrink-0 items-center gap-1.5 text-sm font-semibold text-ink tabular-nums">
        <Clock className="size-3.5 text-muted-foreground" />
        {fmtTime(a.start_at)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {a.lead_id ? (
            <Link href={`/admin/leads/${a.lead_id}`} className="truncate text-sm font-medium text-ink hover:text-primary">
              {a.patient_name}
            </Link>
          ) : (
            <span className="truncate text-sm font-medium text-ink">{a.patient_name}</span>
          )}
          {phone && (
            <a href={phone} className="hidden items-center gap-1 text-xs text-primary hover:underline sm:inline-flex" onClick={(e) => e.stopPropagation()}>
              <Phone className="size-3" /> {a.patient_phone}
            </a>
          )}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {a.service}
          {!compact && a.provider_name ? ` · ${a.provider_name}` : ""} · {SOURCE_LABELS[a.source] ?? a.source}
        </span>
      </span>
      <StatusPill status={a.status} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${a.patient_name}`}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatus(a.id, "COMPLETED")}>
            <Check /> Mark completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus(a.id, "NO_SHOW")}>
            <User /> Mark no-show
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus(a.id, "CANCELLED")}>
            <X /> Cancel appointment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
