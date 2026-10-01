"use client"

import { CalendarCheck, Clock3, DollarSign, Flame, MessageSquareText, Moon, TrendingUp, Users } from "lucide-react"

import { CategoryBars, EngagementChart, FunnelBars, HourHistogram, VisitorsChart } from "@/components/admin/charts"
import { DemoDataBadge, ErrorBlock, KpiCard, LoadingBlock, PageHeader } from "@/components/admin/ui"
import { useApi } from "@/lib/api"
import type { Analytics } from "@/lib/types"

export default function AnalyticsPage() {
  const { data, error, loading, reload } = useApi<Analytics>("/analytics", { refreshMs: 30000 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="How website traffic turns into conversations, qualified leads and booked appointments."
        actions={data?.demo_data ? <DemoDataBadge /> : undefined}
      />

      {data?.demo_data && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Demo data.</strong> These figures come from the seeded demonstration dataset — they are not real business results for any practice. Website
          visitor counts are simulated; in production they would come from PostHog.
        </p>
      )}

      {loading && !data && <LoadingBlock rows={4} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.demo_data && (
              <KpiCard label="Website visitors" value={data.kpis.visitors} trend={data.trends.visitors} sub="last 30 days" icon={Users} />
            )}
            <KpiCard label="AI conversations" value={data.kpis.conversations} trend={data.trends.conversations} sub={data.demo_data ? `${data.kpis.chat_rate}% of visitors` : "last 30 days"} icon={MessageSquareText} />
            <KpiCard label="Qualified leads" value={data.kpis.qualified_leads} trend={data.trends.leads} sub="name + contact + interest" icon={Flame} />
            <KpiCard label="Appointments" value={data.kpis.appointments} trend={data.trends.appointments} sub={`${data.kpis.ai_booked} via AI receptionist`} icon={CalendarCheck} />
            <KpiCard label="Lead → appointment" value={`${data.kpis.conversion_rate}%`} sub="qualified leads that booked" icon={TrendingUp} />
            <KpiCard label="After-hours chats" value={data.after_hours_conversations} sub="outside 8 AM – 5 PM" icon={Clock3} />
            <KpiCard
              label="After-hours bookings"
              value={data.kpis.after_hours_bookings ?? 0}
              sub="AI chats booked outside 8–5"
              icon={Moon}
            />
            <KpiCard
              label="Est. production"
              value={`$${Math.round(data.kpis.estimated_production ?? 0).toLocaleString()}`}
              sub={`$${Math.round(data.kpis.production_per_visit ?? 250)} per visit · from Settings`}
              icon={DollarSign}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {data.demo_data && <VisitorsChart data={data.series} demoData />}
            <EngagementChart data={data.series} demoData={data.demo_data} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <FunnelBars data={data.funnel} demoData={data.demo_data} />
            <HourHistogram data={data.conversations_by_hour} afterHours={data.after_hours_conversations} demoData={data.demo_data} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <CategoryBars title="Leads by service" subtitle={data.demo_data ? "Where patient demand is coming from · demo data" : "Where patient demand is coming from"} data={data.leads_by_service} colorIndex={0} />
            <CategoryBars title="Appointment sources" subtitle={data.demo_data ? "How appointments were booked · demo data" : "How appointments were booked"} data={data.appointment_sources} colorIndex={3} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <CategoryBars title="Lead status breakdown" subtitle={data.demo_data ? "Pipeline health · demo data" : "Pipeline health"} data={data.lead_status.map((s) => ({ ...s, name: s.name.replace("_", " ") }))} colorIndex={1} />
            <CategoryBars title="Top conversation topics" subtitle={data.demo_data ? "What patients ask the AI · demo data" : "What patients ask the AI"} data={data.top_intents} colorIndex={2} />
          </section>
        </>
      )}
    </div>
  )
}
