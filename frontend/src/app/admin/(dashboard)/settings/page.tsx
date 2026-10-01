"use client"

import Link from "next/link"
import { useState } from "react"
import { Bot, Building2, CalendarClock, Clock, Code2, Copy, CreditCard, Download, FileText, Mail, MessageSquareText, Plug, Save, ShieldCheck, Star, Stethoscope, Workflow } from "lucide-react"
import { toast } from "sonner"

import { IntegrationSettings } from "@/components/admin/integration-settings"
import { KnowledgeSettings } from "@/components/admin/knowledge-settings"
import { ErrorBlock, LoadingBlock, PageHeader } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { api, useApi } from "@/lib/api"
import { useAdminRole } from "@/lib/admin-role"
import type { ClinicInfo, SystemStatus } from "@/lib/types"

const DAYS: [string, string][] = [
  ["mon", "Monday"],
  ["tue", "Tuesday"],
  ["wed", "Wednesday"],
  ["thu", "Thursday"],
  ["fri", "Friday"],
  ["sat", "Saturday"],
  ["sun", "Sunday"],
]

function Section({ title, description, icon: Icon, children }: { title: string; description: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
          <Icon className="size-4.5" />
        </span>
        <div>
          <h2 className="font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function SettingsPage() {
  const role = useAdminRole()
  const { data, error, loading, reload } = useApi<ClinicInfo>("/clinic")
  const status = useApi<SystemStatus>("/status")
  const [draft, setDraft] = useState<ClinicInfo | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  // The loaded clinic is the source of truth until the user edits something.
  const clinic = draft ?? data
  const setClinic = (next: ClinicInfo) => setDraft(next)

  const save = async (section: string, payload: Record<string, unknown>) => {
    setSaving(section)
    try {
      await api("/clinic", { method: "POST", json: payload })
      toast.success("Settings saved", { description: "The AI receptionist now uses the updated information." })
      setDraft(null)
      await reload(true)
    } catch (e) {
      toast.error("Couldn't save", { description: (e as Error).message })
    } finally {
      setSaving(null)
    }
  }

  const setSetting = (group: "assistant" | "appointments" | "sms" | "email" | "brand", key: string, value: unknown) => {
    if (!clinic) return
    setDraft({ ...clinic, settings: { ...clinic.settings, [group]: { ...(clinic.settings[group] ?? {}), [key]: value } } })
  }

  const assistant = (clinic?.settings.assistant ?? {}) as Record<string, string | boolean>
  const appts = (clinic?.settings.appointments ?? {}) as Record<string, number | boolean>
  const sms = (clinic?.settings.sms ?? {}) as Record<string, string>
  const email = (clinic?.settings.email ?? {}) as Record<string, string>
  const brand = (clinic?.settings.brand ?? {}) as Record<string, string | number>
  const financing = (clinic?.financing ?? {}) as { summary?: string; membership_plan?: string; providers?: string[] }
  const demoMode = status.data?.demo_mode !== false

  const saveRuntime = async (nextDemo: boolean) => {
    setSaving("runtime")
    try {
      await api("/runtime", { method: "POST", json: { demo_mode: nextDemo } })
      toast.success(nextDemo ? "Demo mode is on" : "Production mode is on", {
        description: nextDemo
          ? "SMS and calendar stay simulated. Gmail still sends if it is connected."
          : "Twilio and Cal.com will run live when their keys are saved.",
      })
      await status.reload(true)
    } catch (e) {
      toast.error("Couldn't update mode", { description: (e as Error).message })
    } finally {
      setSaving(null)
    }
  }

  if (role === "front_desk") {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="API keys and clinic profile stay with the owner." />
        <section className="rounded-2xl border bg-card p-6">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="size-4 text-primary" /> Owner-only
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Front desk can run leads, chats, and appointments. Hours, FAQs, uploaded documents, and API keys are only visible to the practice owner.
          </p>
          <Button asChild className="mt-5" size="sm">
            <Link href="/admin">Back to today</Link>
          </Button>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Clinic information, AI behaviour, appointment rules, messaging and integrations." />

      {loading && !clinic && <LoadingBlock rows={5} />}
      {error && <ErrorBlock message={error.message} onRetry={() => reload()} />}

      {clinic && (
        <div className="grid gap-5 xl:grid-cols-2">
          <Section title="Clinic information" description="Used across the website and by the AI receptionist." icon={Building2}>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Practice name"],
                  ["phone", "Phone"],
                  ["email", "Email"],
                  ["address_line", "Street address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["zip_code", "ZIP"],
                  ["tagline", "Tagline"],
                ] as [keyof ClinicInfo, string][]
              ).map(([key, label]) => (
                <div key={key} className="grid gap-1.5">
                  <Label htmlFor={`c-${key}`}>{label}</Label>
                  <Input id={`c-${key}`} value={String(clinic[key] ?? "")} maxLength={200} onChange={(e) => setClinic({ ...clinic, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <Button
              className="mt-5"
              size="sm"
              disabled={saving === "clinic"}
              onClick={() =>
                save("clinic", {
                  name: clinic.name,
                  phone: clinic.phone,
                  email: clinic.email,
                  address_line: clinic.address_line,
                  city: clinic.city,
                  state: clinic.state,
                  zip_code: clinic.zip_code,
                  tagline: clinic.tagline,
                })
              }
            >
              <Save /> Save clinic information
            </Button>
          </Section>

          <Section title="Business hours" description="Availability offered by the AI and the booking page comes from these hours." icon={Clock}>
            <ul className="space-y-2">
              {DAYS.map(([key, label]) => {
                const span = clinic.hours[key]
                return (
                  <li key={key} className="flex flex-wrap items-center gap-3">
                    <span className="w-24 text-sm font-medium text-ink">{label}</span>
                    <Switch
                      checked={Boolean(span)}
                      onCheckedChange={(open) => setClinic({ ...clinic, hours: { ...clinic.hours, [key]: open ? { open: "08:00", close: "17:00" } : null } })}
                      aria-label={`${label} open`}
                    />
                    {span ? (
                      <>
                        <Input
                          type="time"
                          value={span.open}
                          className="h-9 w-32"
                          onChange={(e) => setClinic({ ...clinic, hours: { ...clinic.hours, [key]: { ...span, open: e.target.value } } })}
                          aria-label={`${label} opening time`}
                        />
                        <span className="text-muted-foreground">–</span>
                        <Input
                          type="time"
                          value={span.close}
                          className="h-9 w-32"
                          onChange={(e) => setClinic({ ...clinic, hours: { ...clinic.hours, [key]: { ...span, close: e.target.value } } })}
                          aria-label={`${label} closing time`}
                        />
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    )}
                  </li>
                )
              })}
            </ul>
            <Button className="mt-5" size="sm" disabled={saving === "hours"} onClick={() => save("hours", { hours: clinic.hours })}>
              <Save /> Save hours
            </Button>
          </Section>

          <Section title="Production mode" description="Turn this off when you are ready to send live SMS and use Cal.com. Clinic edits and uploaded docs already apply to the live receptionist." icon={ShieldCheck}>
            <label className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
              <span>
                <span className="block font-medium text-ink">Demo mode</span>
                <span className="block text-xs text-muted-foreground">
                  {demoMode
                    ? `AI: ${status.data?.ai_provider ?? "…"} · email ${status.data?.email ?? "…"} · SMS simulated`
                    : `Live · AI ${status.data?.ai_provider ?? "…"} · email ${status.data?.email ?? "…"} · SMS ${status.data?.sms ?? "…"}`}
                </span>
              </span>
              <Switch checked={demoMode} disabled={saving === "runtime"} onCheckedChange={(v) => void saveRuntime(v)} />
            </label>
          </Section>

          <Section title="Reviews & ROI" description="Google review requests and the dollar value used on the analytics dashboard." icon={Star}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="review-url">Google review URL</Label>
                <Input
                  id="review-url"
                  placeholder="https://g.page/r/..."
                  value={String(brand.google_review_url ?? "")}
                  onChange={(e) => setSetting("brand", "google_review_url", e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="per-visit">Estimated production per visit ($)</Label>
                <Input
                  id="per-visit"
                  type="number"
                  min={0}
                  max={50000}
                  value={Number(brand.production_per_visit ?? 250)}
                  onChange={(e) => setSetting("brand", "production_per_visit", Number(e.target.value))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="brand-color">Widget / brand color</Label>
                <Input
                  id="brand-color"
                  placeholder="#0f6b70"
                  value={String(brand.primary_color ?? "#0f6b70")}
                  onChange={(e) => setSetting("brand", "primary_color", e.target.value)}
                />
              </div>
            </div>
            <Button className="mt-5" size="sm" disabled={saving === "brand"} onClick={() => save("brand", { settings: { brand } })}>
              <Save /> Save review & ROI settings
            </Button>
          </Section>

          <Section
            title="WordPress & existing websites"
            description="Practices that already have a site keep it. We add the same receptionist as a plugin or a one-line snippet — no theme rebuild."
            icon={Code2}
          >
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-ink">WordPress (recommended).</span> Download the plugin, then in wp-admin go to Plugins → Add New →
                Upload Plugin. Activate it, open Settings → AI Receptionist, paste this app URL, and save. The chat button appears on every public page.
              </li>
              <li>
                <span className="font-medium text-ink">WPCode / Insert Headers and Footers.</span> Paste the snippet into the site-wide footer. Do not
                limit it to the homepage if you want the receptionist on service pages too.
              </li>
              <li>
                <span className="font-medium text-ink">Any other site (Wix, Squarespace, custom).</span> Paste the same snippet before{" "}
                <code className="rounded bg-muted px-1">&lt;/body&gt;</code>.
              </li>
            </ol>
            <p className="mb-2 text-xs font-medium text-ink">Hosted app URL to paste into the plugin</p>
            <Textarea readOnly rows={1} className="mb-4 font-mono text-xs" value={typeof window === "undefined" ? "https://your-practice-url" : window.location.origin} />
            <p className="mb-2 text-xs font-medium text-ink">Snippet</p>
            <Textarea
              readOnly
              rows={4}
              className="font-mono text-xs"
              value={`<script src="${typeof window === "undefined" ? "https://your-practice-url" : window.location.origin}/widget.js" data-origin="${typeof window === "undefined" ? "https://your-practice-url" : window.location.origin}" data-color="${String(brand.primary_color ?? "#0f6b70")}" data-label="Ask our AI receptionist" async></script>`}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  const origin = typeof window === "undefined" ? "" : window.location.origin
                  const snippet = `<script src="${origin}/widget.js" data-origin="${origin}" data-color="${String(brand.primary_color ?? "#0f6b70")}" data-label="Ask our AI receptionist" async></script>`
                  void navigator.clipboard.writeText(snippet).then(
                    () => toast.success("Snippet copied"),
                    () => toast.error("Couldn't copy — select the snippet and copy it"),
                  )
                }}
              >
                <Copy /> Copy snippet
              </Button>
              <Button asChild size="sm">
                <a href="/wordpress/brightsmile-receptionist.zip" download>
                  <Download /> Download WordPress plugin
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Conversations, phone numbers and bookings land in this dashboard — not in WordPress comments. Twilio inbound SMS webhook:{" "}
              <code className="rounded bg-muted px-1">/api/webhooks/twilio/sms</code>
              {" · "}
              missed-call: <code className="rounded bg-muted px-1">/api/webhooks/twilio/voice</code>
            </p>
          </Section>

          <Section title="Insurance & financing" description="The receptionist answers insurance and payment questions from this list, not from seed data." icon={CreditCard}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="insurers">In-network plans (one per line)</Label>
                <Textarea
                  id="insurers"
                  rows={5}
                  value={(clinic.insurance_accepted ?? []).join("\n")}
                  onChange={(e) =>
                    setClinic({
                      ...clinic,
                      insurance_accepted: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="fin-sum">Financing summary</Label>
                <Textarea id="fin-sum" rows={3} maxLength={500} value={String(financing.summary ?? "")} onChange={(e) => setClinic({ ...clinic, financing: { ...clinic.financing, summary: e.target.value } })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="fin-mem">Membership plan</Label>
                <Textarea id="fin-mem" rows={2} maxLength={400} value={String(financing.membership_plan ?? "")} onChange={(e) => setClinic({ ...clinic, financing: { ...clinic.financing, membership_plan: e.target.value } })} />
              </div>
            </div>
            <Button
              className="mt-5"
              size="sm"
              disabled={saving === "insurance"}
              onClick={() => save("insurance", { insurance_accepted: clinic.insurance_accepted, financing: { summary: financing.summary ?? "", membership_plan: financing.membership_plan ?? "" } })}
            >
              <Save /> Save insurance & financing
            </Button>
          </Section>

          <Section title="AI assistant" description="How the receptionist introduces itself and what it collects." icon={Bot}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="a-name">Assistant name</Label>
                <Input id="a-name" maxLength={40} value={String(assistant.name ?? "")} onChange={(e) => setSetting("assistant", "name", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="a-greeting">Greeting</Label>
                <Textarea id="a-greeting" rows={3} maxLength={500} value={String(assistant.greeting ?? "")} onChange={(e) => setSetting("assistant", "greeting", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="a-phone">Hand-off phone number</Label>
                <Input id="a-phone" maxLength={40} value={String(assistant.handoff_phone ?? "")} onChange={(e) => setSetting("assistant", "handoff_phone", e.target.value)} />
              </div>
              <label className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                <span>
                  <span className="block font-medium text-ink">Ask for insurance</span>
                  <span className="block text-xs text-muted-foreground">Collects the provider during qualification.</span>
                </span>
                <Switch checked={assistant.collect_insurance !== false} onCheckedChange={(v) => setSetting("assistant", "collect_insurance", v)} />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                <span>
                  <span className="block font-medium text-ink">Ask about urgency</span>
                  <span className="block text-xs text-muted-foreground">&ldquo;How soon would you like to come in?&rdquo;</span>
                </span>
                <Switch checked={assistant.collect_urgency !== false} onCheckedChange={(v) => setSetting("assistant", "collect_urgency", v)} />
              </label>
            </div>
            <Button className="mt-5" size="sm" disabled={saving === "assistant"} onClick={() => save("assistant", { settings: { assistant } })}>
              <Save /> Save AI settings
            </Button>
          </Section>

          <Section title="Appointment settings" description="How slots are generated and offered to patients." icon={CalendarClock}>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["slot_interval_minutes", "Slot interval (minutes)", 5, 120],
                  ["min_notice_hours", "Minimum notice (hours)", 0, 72],
                  ["booking_window_days", "Booking window (days)", 1, 90],
                  ["slots_to_offer", "Slots offered in chat", 1, 12],
                ] as [string, string, number, number][]
              ).map(([key, label, min, max]) => (
                <div key={key} className="grid gap-1.5">
                  <Label htmlFor={`ap-${key}`}>{label}</Label>
                  <Input
                    id={`ap-${key}`}
                    type="number"
                    min={min}
                    max={max}
                    value={Number(appts[key] ?? 0)}
                    onChange={(e) => setSetting("appointments", key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <Button className="mt-5" size="sm" disabled={saving === "appointments"} onClick={() => save("appointments", { settings: { appointments: appts } })}>
              <Save /> Save appointment settings
            </Button>
          </Section>

          <Section title="SMS templates" description="Placeholders: {first_name} {service} {date} {time} {when} {clinic}" icon={MessageSquareText}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="s-confirm">Confirmation SMS</Label>
                <Textarea id="s-confirm" rows={3} maxLength={480} value={String(sms.confirmation_template ?? "")} onChange={(e) => setSetting("sms", "confirmation_template", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-remind">Reminder SMS</Label>
                <Textarea id="s-remind" rows={3} maxLength={480} value={String(sms.reminder_template ?? "")} onChange={(e) => setSetting("sms", "reminder_template", e.target.value)} />
              </div>
            </div>
            <Button className="mt-5" size="sm" disabled={saving === "sms"} onClick={() => save("sms", { settings: { sms } })}>
              <Save /> Save SMS templates
            </Button>
          </Section>

          <Section title="Email settings" description="Sender name and confirmation subject line." icon={Mail}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="e-from">From name</Label>
                <Input id="e-from" maxLength={80} value={String(email.from_name ?? "")} onChange={(e) => setSetting("email", "from_name", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="e-subject">Confirmation subject</Label>
                <Input id="e-subject" maxLength={160} value={String(email.confirmation_subject ?? "")} onChange={(e) => setSetting("email", "confirmation_subject", e.target.value)} />
              </div>
            </div>
            <Button className="mt-5" size="sm" disabled={saving === "email"} onClick={() => save("email", { settings: { email } })}>
              <Save /> Save email settings
            </Button>
          </Section>

          <Section title="Services" description="Turn services on or off and adjust visit length." icon={Stethoscope}>
            <ul className="space-y-2">
              {clinic.services.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                  <Switch
                    checked={s.is_active}
                    aria-label={`${s.name} active`}
                    onCheckedChange={(v) => setClinic({ ...clinic, services: clinic.services.map((x) => (x.id === s.id ? { ...x, is_active: v } : x)) })}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{s.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.price_note}</span>
                  </span>
                  <Input
                    type="number"
                    min={10}
                    max={240}
                    className="h-9 w-24"
                    aria-label={`${s.name} duration in minutes`}
                    value={s.duration_minutes}
                    onChange={(e) => setClinic({ ...clinic, services: clinic.services.map((x) => (x.id === s.id ? { ...x, duration_minutes: Number(e.target.value) } : x)) })}
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-5"
              size="sm"
              disabled={saving === "services"}
              onClick={() => save("services", { services: clinic.services.map((s) => ({ id: s.id, is_active: s.is_active, duration_minutes: s.duration_minutes })) })}
            >
              <Save /> Save services
            </Button>
          </Section>

          <Section title="Automation settings" description="Timing and templates live in the automation center." icon={Workflow}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Turn individual automations on or off, adjust the missed-lead delay and reminder schedule, and watch the activity log from the automation center.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/automations">Open automation center</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/automations/builder">Open workflow builder</Link>
              </Button>
            </div>
          </Section>

          <div className="xl:col-span-2">
            <Section title="Knowledge base" description="Upload policies, fee guides or paste notes. Together with FAQs, this is what the receptionist retrieves." icon={FileText}>
              <KnowledgeSettings />
            </Section>
          </div>

          <div className="xl:col-span-2">
            <Section title="API keys" description="Paste production keys here. Saved values are stored on the server and never shown in full." icon={Plug}>
              <IntegrationSettings />
            </Section>
          </div>

          <div className="xl:col-span-2">
            <p className="rounded-xl border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              Clinic profile, hours, insurance, FAQs and uploaded documents are stored in the database and used immediately by the AI receptionist.
              {demoMode ? " Reset demo data is available from the top bar while demo mode is on." : " Demo reset is disabled in production mode so live patients are not wiped."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
