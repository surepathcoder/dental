"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { api, useApi } from "@/lib/api"
import { timeAgo } from "@/lib/format"
import type { WaitlistEntry } from "@/lib/types"

export default function WaitlistAdminPage() {
  const { data, error, loading, reload } = useApi<WaitlistEntry[]>("/waitlist", { refreshMs: 20000 })
  const [filter, setFilter] = useState<"WAITING" | "ALL">("WAITING")
  const items = useMemo(() => {
    const list = data ?? []
    return filter === "WAITING" ? list.filter((e) => e.status === "WAITING") : list
  }, [data, filter])

  const setStatus = async (id: number, status: WaitlistEntry["status"]) => {
    try {
      await api(`/waitlist/${id}`, { method: "PATCH", json: { status } })
      toast.success(`Marked ${status.toLowerCase()}`)
      await reload(true)
    } catch (e) {
      toast.error("Update failed", { description: (e as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Waitlist"
        description="Patients who want the next cancelled opening. They are texted automatically when a matching visit is cancelled."
      />
      <div className="flex gap-2">
        <Button size="sm" variant={filter === "WAITING" ? "default" : "outline"} onClick={() => setFilter("WAITING")}>
          Waiting
        </Button>
        <Button size="sm" variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>
          All
        </Button>
      </div>
      {loading && !data && <LoadingBlock rows={4} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}
      {data && items.length === 0 && <EmptyBlock title="No one on the waitlist" body="The public /waitlist page is where patients join." />}
      {items.length > 0 && (
        <ul className="divide-y rounded-2xl border bg-card">
          {items.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {e.service || "Any service"} · {e.phone || e.email} · {timeAgo(e.created_at)}
                </p>
              </div>
              <StatusPill status={e.status} />
              {e.status === "WAITING" && (
                <Button size="sm" variant="outline" onClick={() => void setStatus(e.id, "CANCELLED")}>
                  Remove
                </Button>
              )}
              {e.status === "NOTIFIED" && (
                <Button size="sm" variant="outline" onClick={() => void setStatus(e.id, "BOOKED")}>
                  Mark booked
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
