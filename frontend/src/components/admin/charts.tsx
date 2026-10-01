"use client"

/**
 * Chart components (Recharts).
 * Palette: the five categorical slots from globals.css, assigned in fixed order
 * and never cycled. Every multi-series chart ships a legend plus direct labels
 * or a table view (two palette slots sit below 3:1 on this surface), a single
 * y-axis per chart, thin marks and a recessive grid.
 */

import { useId, useState } from "react"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { fmtNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export const SERIES = {
  visitors: { color: "var(--chart-1)", label: "Website visitors" },
  conversations: { color: "var(--chart-2)", label: "AI conversations" },
  leads: { color: "var(--chart-3)", label: "Qualified leads" },
  appointments: { color: "var(--chart-4)", label: "Appointments" },
} as const

const AXIS = { stroke: "var(--muted-foreground)", fontSize: 11 }

function TooltipCard({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}
          <span className="ml-auto font-semibold text-ink tabular-nums">{fmtNumber(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function ChartFrame({
  title,
  subtitle,
  children,
  legend,
  actions,
  className,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  legend?: { label: string; color: string }[]
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn("rounded-2xl border bg-card p-5", className)}>
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {legend && (
            <ul className="flex flex-wrap items-center gap-3 text-xs">
              {legend.map((l) => (
                <li key={l.label} className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2.5 rounded-full" style={{ background: l.color }} /> {l.label}
                </li>
              ))}
            </ul>
          )}
          {actions}
        </div>
      </figcaption>
      {children}
    </figure>
  )
}

export function VisitorsChart({ data, demoData = true }: { data: { label: string; visitors: number }[]; demoData?: boolean }) {
  const gradId = useId().replace(/:/g, "")
  return (
    <ChartFrame title="Website visitors" subtitle={demoData ? "Last 30 days · demo data" : "Last 30 days"}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIES.visitors.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={SERIES.visitors.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS} interval="preserveStartEnd" minTickGap={28} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS} width={44} />
            <Tooltip content={<TooltipCard />} cursor={{ stroke: "var(--grid)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="visitors" name="Visitors" stroke={SERIES.visitors.color} strokeWidth={2} fill={`url(#${gradId})`} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

type FunnelRow = { label: string; conversations: number; leads: number; appointments: number }

export function EngagementChart({ data, table = true, demoData = true }: { data: FunnelRow[]; table?: boolean; demoData?: boolean }) {
  const [showTable, setShowTable] = useState(false)
  const legend = [
    { label: SERIES.conversations.label, color: SERIES.conversations.color },
    { label: SERIES.leads.label, color: SERIES.leads.color },
    { label: SERIES.appointments.label, color: SERIES.appointments.color },
  ]
  return (
    <ChartFrame
      title="Conversations, leads and appointments"
      subtitle={demoData ? "Last 30 days · demo data" : "Last 30 days"}
      legend={legend}
      actions={
        table ? (
          <Button variant="outline" size="xs" onClick={() => setShowTable((v) => !v)}>
            {showTable ? "Chart" : "Table"}
          </Button>
        ) : undefined
      }
    >
      {showTable ? (
        <div className="max-h-56 overflow-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/70 text-left">
              <tr>
                {["Day", "Conversations", "Leads", "Appointments"].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.label} className="border-t">
                  <td className="px-3 py-1.5 text-muted-foreground">{d.label}</td>
                  <td className="px-3 py-1.5 tabular-nums">{d.conversations}</td>
                  <td className="px-3 py-1.5 tabular-nums">{d.leads}</td>
                  <td className="px-3 py-1.5 tabular-nums">{d.appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS} interval="preserveStartEnd" minTickGap={28} />
              <YAxis tickLine={false} axisLine={false} tick={AXIS} width={44} allowDecimals={false} />
              <Tooltip content={<TooltipCard />} cursor={{ stroke: "var(--grid)", strokeWidth: 1 }} />
              <Line type="monotone" dataKey="conversations" name="AI conversations" stroke={SERIES.conversations.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="leads" name="Qualified leads" stroke={SERIES.leads.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="appointments" name="Appointments" stroke={SERIES.appointments.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  )
}

export function FunnelBars({ data, demoData = true }: { data: { stage: string; value: number }[]; demoData?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <ChartFrame title="Conversion funnel" subtitle={demoData ? "Website visitor → booked appointment · demo data" : "Conversation → booked appointment"}>
      <ol className="space-y-3">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          const prev = i > 0 ? data[i - 1].value : null
          const rate = prev ? Math.round((d.value / prev) * 1000) / 10 : null
          return (
            <li key={d.stage}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-ink">{d.stage}</span>
                <span className="tabular-nums text-muted-foreground">
                  <span className="font-semibold text-ink">{fmtNumber(d.value)}</span>
                  {rate !== null && <span className="ml-2 text-xs">{rate}% of previous</span>}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 1.5)}%`, background: SERIES.visitors.color, opacity: 1 - i * 0.13 }} />
              </div>
            </li>
          )
        })}
      </ol>
    </ChartFrame>
  )
}

export function CategoryBars({
  title,
  subtitle,
  data,
  colorIndex = 0,
}: {
  title: string
  subtitle?: string
  data: { name: string; value: number }[]
  colorIndex?: number
}) {
  const color = [SERIES.visitors.color, SERIES.conversations.color, SERIES.leads.color, SERIES.appointments.color, "var(--chart-5)"][colorIndex % 5]
  return (
    <ChartFrame title={title} subtitle={subtitle}>
      <div style={{ height: Math.max(data.length * 38, 120) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }} barCategoryGap={6}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ ...AXIS, fill: "var(--ink)" }} width={150} />
            <Tooltip content={<TooltipCard />} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="value" name="Count" fill={color} radius={[4, 4, 4, 4]} barSize={14} label={{ position: "right", fontSize: 11, fill: "var(--muted-foreground)" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

export function HourHistogram({ data, afterHours, demoData = true }: { data: { hour: number; value: number }[]; afterHours: number; demoData?: boolean }) {
  const fmtHour = (h: number) => `${h % 12 || 12}${h < 12 ? "a" : "p"}`
  return (
    <ChartFrame
      title="When patients reach out"
      subtitle={`${afterHours} conversations started outside office hours${demoData ? " · demo data" : ""}`}
      legend={[
        { label: "Office hours", color: SERIES.visitors.color },
        { label: "After hours", color: SERIES.leads.color },
      ]}
    >
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" tickFormatter={fmtHour} tickLine={false} axisLine={false} tick={AXIS} interval={2} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS} width={40} allowDecimals={false} />
            <Tooltip content={<TooltipCard />} cursor={{ fill: "var(--muted)" }} labelFormatter={(h) => `${fmtHour(Number(h))} – ${fmtHour((Number(h) + 1) % 24)}`} />
            <Bar dataKey="value" name="Conversations" radius={[4, 4, 0, 0]} barSize={12}>
              {data.map((d) => (
                <Cell key={d.hour} fill={d.hour < 8 || d.hour >= 17 ? SERIES.leads.color : SERIES.visitors.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
