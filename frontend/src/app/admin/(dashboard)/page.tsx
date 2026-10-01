"use client"

import Link from "next/link"
import { BellRing, CalendarCheck, CalendarDays, Flame, MessageSquareText, Phone, Repeat, TrendingUp, Users, Workflow } from "lucide-react"

import { EngagementChart, VisitorsChart } from "@/components/admin/charts"
import { DemoDataBadge, EmptyBlock, ErrorBlock, KpiCard, LeadStatusBadge, LoadingBlock, PageHeader, ScoreBadge, StatusPill } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { useApi } from "@/lib/api"
import { fmtDate, fmtTime, smsHref, telHref, timeAgo } from "@/lib/format"
import type { Analytics } from "@/lib/types"

export default function AdminOverviewPage() {
  const { data, error, loading, reload } = useApi<Analytics>("/analytics", { refreshMs: 20000 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinic overview"
        description="Everything the AI receptionist handled — updated live."
        actions={
          <>
            {data?.demo_data && <DemoDataBadge />}
            <Button asChild variant="outline" size="sm">
              <Link href="/">Open patient website</Link>
            </Button>
          </>
        }
      />

      {loading && !data && <LoadingBlock rows={3} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.demo_data && (
              <KpiCard label="Website visitors" value={data.kpis.visitors} trend={data.trends.visitors} sub="last 30 days" icon={Users} />
            )}
            <KpiCard label="AI conversations" value={data.kpis.conversations} trend={data.trends.conversations} sub={data.demo_data ? `${data.kpis.chat_rate}% of visitors chat` : "last 30 days"} icon={MessageSquareText} href="/admin/conversations" />
            <KpiCard label="Qualified leads" value={data.kpis.qualified_leads} trend={data.trends.leads} sub="contact + treatment interest" icon={Flame} href="/admin/leads" />
            <KpiCard label="Appointments" value={data.kpis.appointments} trend={data.trends.appointments} sub={`${data.kpis.ai_booked} booked by the AI`} icon={CalendarCheck} href="/admin/appointments" />
            <KpiCard label="Follow-ups" value={data.kpis.followups} sub="missed-lead automations" icon={Repeat} href="/admin/automations" />
            <KpiCard label="Conversion rate" value={`${data.kpis.conversion_rate}%`} sub="qualified lead → appointment" icon={TrendingUp} href="/admin/analytics" />
            <KpiCard
              label="Est. production"
              value={`$${Math.round(data.kpis.estimated_production ?? 0).toLocaleString()}`}
              sub={`${data.kpis.after_hours_bookings ?? 0} after-hours AI bookings`}
              icon={BellRing}
              href="/admin/analytics"
            />
          </section>

          <section className={data.demo_data ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
            {data.demo_data && <VisitorsChart data={data.series} demoData />}
            <EngagementChart data={data.series} demoData={data.demo_data} />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <CalendarDays className="size-4 text-primary" /> Today&apos;s schedule
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/appointments">View all</Link>
                </Button>
              </div>
              {data.today_appointments.length === 0 ? (
                <EmptyBlock title="No appointments today" body="Upcoming visits appear on the appointments page." />
              ) : (
                <ul className="divide-y">
                  {data.today_appointments.map((a) => (
                    <li key={a.id} className="flex items-center gap-4 py-3">
                      <span className="w-20 shrink-0 text-sm font-semibold text-ink tabular-nums">{fmtTime(a.start_at)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{a.patient_name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {a.service} · {a.provider_name}
                        </span>
                      </span>
                      <StatusPill status={a.status} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 mb-3 flex items-center justify-between border-t pt-5">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <CalendarCheck className="size-4 text-primary" /> Next up
                </p>
              </div>
              <ul className="divide-y">
                {data.upcoming_appointments.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center gap-4 py-2.5">
                    <span className="w-32 shrink-0 text-xs font-medium text-muted-foreground">
                      {fmtDate(a.start_at)} · {fmtTime(a.start_at)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">{a.patient_name}</span>
                    <span className="hidden truncate text-xs text-muted-foreground sm:block">{a.service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border bg-card p-5">
                <p className="mb-3 flex items-center gap-2 font-semibold text-ink">
                  <Flame className="size-4 text-coral" /> Call these hot leads
                </p>
                {data.hot_leads.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Nothing waiting — nice.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {data.hot_leads.map((l) => {
                      const tel = telHref(l.phone)
                      const sms = smsHref(l.phone)
                      return (
                        <li key={l.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
                          <Link href={`/admin/leads/${l.id}`} className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">{l.name}</span>
                            <span className="block truncate text-xs text-muted-foreground">{l.service ?? "General inquiry"}</span>
                          </Link>
                          <ScoreBadge score={l.score_label} />
                          {tel ? (
                            <>
                              <Button asChild variant="outline" size="icon" className="size-8 shrink-0">
                                <a href={tel} aria-label={`Call ${l.name}`}>
                                  <Phone className="size-3.5" />
                                </a>
                              </Button>
                              {sms ? (
                                <Button asChild variant="outline" size="icon" className="size-8 shrink-0">
                                  <a href={sms} aria-label={`Text ${l.name}`}>
                                    <MessageSquareText className="size-3.5" />
                                  </a>
                                </Button>
                              ) : null}
                            </>
                          ) : (
                            <LeadStatusBadge status={l.status} />
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    <Workflow className="size-4 text-primary" /> Automation activity
                  </p>
                  <Button asChild variant="ghost" size="xs">
                    <Link href="/admin/automations">Open</Link>
                  </Button>
                </div>
                <ul className="space-y-3">
                  {data.recent_activity.slice(0, 6).map((e) => (
                    <li key={e.id} className="flex gap-2.5">
                      <BellRing className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-ink">{e.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {timeAgo(e.created_at)}
                          {e.detail ? ` · ${e.detail}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
