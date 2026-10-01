"use client"

import Link from "next/link"
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Inbox, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fmtNumber } from "@/lib/format"
import type { LeadStatus, ScoreLabel } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900", className)}>
      Demo Data
    </span>
  )
}

export function KpiCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  href,
}: {
  label: string
  value: string | number
  sub?: string
  trend?: number
  icon: React.ElementType
  href?: string
}) {
  const body = (
    <div className="h-full rounded-2xl border bg-card p-5 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">{typeof value === "number" ? fmtNumber(value) : value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {trend !== undefined && trend !== 0 && (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", trend > 0 ? "text-success" : "text-coral")}>
            {trend > 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  )
}

const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-violet-100 text-violet-800",
  QUALIFIED: "bg-sky-100 text-sky-800",
  BOOKED: "bg-emerald-100 text-emerald-800",
  FOLLOW_UP: "bg-amber-100 text-amber-900",
  CONVERTED: "bg-teal-100 text-teal-900",
  LOST: "bg-neutral-200 text-neutral-600",
}

export function LeadStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide", LEAD_STATUS_STYLE[status as LeadStatus] ?? "bg-muted text-muted-foreground", className)}>
      {status.replace("_", " ")}
    </span>
  )
}

const SCORE_STYLE: Record<ScoreLabel, string> = {
  HOT: "bg-coral/15 text-coral",
  WARM: "bg-amber-100 text-amber-900",
  COLD: "bg-slate-100 text-slate-600",
}

export function ScoreBadge({ score, className }: { score: string; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold", SCORE_STYLE[score as ScoreLabel] ?? "bg-muted", className)}>{score}</span>
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    BOOKED: "bg-emerald-100 text-emerald-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    COMPLETED: "bg-teal-100 text-teal-900",
    SENT: "bg-emerald-100 text-emerald-800",
    SIMULATED: "bg-amber-100 text-amber-900",
    SCHEDULED: "bg-sky-100 text-sky-800",
    WAITING_STAFF: "bg-violet-100 text-violet-800",
    WAITING: "bg-sky-100 text-sky-800",
    NOTIFIED: "bg-amber-100 text-amber-900",
    ABANDONED: "bg-neutral-200 text-neutral-600",
    CLOSED: "bg-neutral-100 text-neutral-500",
    CANCELLED: "bg-neutral-200 text-neutral-600",
    NO_SHOW: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
    PAUSED: "bg-neutral-200 text-neutral-600",
  }
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", map[status] ?? "bg-muted text-muted-foreground", className)}>{status.replace("_", " ")}</span>
}

export function LoadingBlock({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  )
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> {label}
    </p>
  )
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="flex items-start gap-2 text-sm font-medium text-amber-900">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {message}
      </p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyBlock({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
      <Inbox className="size-6 text-muted-foreground" />
      <p className="font-medium text-ink">{title}</p>
      {body && <p className="max-w-sm text-sm text-muted-foreground">{body}</p>}
    </div>
  )
}
