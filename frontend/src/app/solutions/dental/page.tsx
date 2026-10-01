import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight, BarChart3, Bot, CalendarCheck, Check, ClipboardList, Clock, Code2, Database, MessageSquareText, PhoneOff, Repeat, ShieldCheck, Sparkles, Workflow,
} from "lucide-react"

import { ToothMark } from "@/components/brand/logo"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Receptionist for Dental Clinics",
  description:
    "Turn your dental website into an AI receptionist that answers patients, qualifies inquiries, books appointments, sends reminders and follows up automatically.",
}

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_AGENCY_EMAIL || "hello@example.com"
const CALENDAR_URL = process.env.NEXT_PUBLIC_AGENCY_CALENDAR_URL || `mailto:${CONTACT_EMAIL}?subject=Dental%20AI%20receptionist%20demo`

const PROBLEMS = [
  { icon: PhoneOff, title: "Calls go to voicemail", body: "When the front desk is with a patient, the caller hangs up and calls the next practice." },
  { icon: Clock, title: "Nights and weekends are dead air", body: "A large share of website visits happen outside office hours, when nobody can answer." },
  { icon: ClipboardList, title: "Web forms go cold", body: "A form that just says \"we'll get back to you\" loses people who wanted an appointment now." },
  { icon: Repeat, title: "Follow-up never happens", body: "Interested patients who don't book are rarely contacted again — there's no time." },
]

const CAPABILITIES = [
  { icon: MessageSquareText, title: "Answer patients", body: "Insurance, pricing, hours, services and directions — answered instantly from your practice's own information." },
  { icon: Bot, title: "Capture leads", body: "Every conversation becomes a structured lead with name, contact details and treatment interest." },
  { icon: ClipboardList, title: "Qualify inquiries", body: "New vs. existing patient, insurance provider, urgency and preferred times — collected conversationally." },
  { icon: CalendarCheck, title: "Book appointments", body: "Real availability from your calendar, booked in the chat, with an instant confirmation." },
  { icon: Clock, title: "Send reminders", body: "Automatic email and SMS confirmations, plus 24-hour and 2-hour reminders before each visit." },
  { icon: Repeat, title: "Follow up automatically", body: "Interested but didn't book? A friendly follow-up goes out on the schedule you choose." },
]

const FLOW = [
  "Visitor arrives",
  "AI conversation",
  "Intent detected",
  "Contact captured",
  "Availability checked",
  "Appointment booked",
  "Confirmation sent",
  "Reminders scheduled",
  "Review requested",
]

const STACK = [
  { icon: Code2, label: "Next.js + TypeScript" },
  { icon: Workflow, label: "LangGraph AI workflow" },
  { icon: Database, label: "FastAPI + PostgreSQL" },
  { icon: BarChart3, label: "Analytics dashboard" },
  { icon: ShieldCheck, label: "Your data, your keys" },
]

const DELIVERABLES = [
  "WordPress plugin or one-line snippet on the site you already have — no rebuild",
  "Knowledge base built from your services, insurance list, hours and pricing",
  "Appointment booking connected to your scheduler (or a standalone booking page)",
  "Email + SMS confirmations and reminders",
  "Missed-lead follow-up automation with timing you control",
  "Clinic dashboard: leads, conversations, appointments, automations, analytics",
  "Staff walkthrough and documentation",
]

const FAQS = [
  {
    q: "Does this replace my front desk team?",
    a: "No. It handles the repetitive questions and after-hours booking so your team can focus on patients in the chair. Anything unusual is handed straight to your staff, with the phone number front and centre.",
  },
  {
    q: "Can the AI make things up?",
    a: "The assistant answers only from a knowledge base built from your practice's own information, and the booking flow itself is deterministic — the AI can't invent prices, insurers or appointment times. It never diagnoses or gives medical advice; clinical questions are routed to your dentists.",
  },
  {
    q: "Is this HIPAA compliant?",
    a: "This public demo is not, and it's clearly labelled that way. A production deployment for a real practice requires a compliance review, business associate agreements with each vendor, encryption, access controls and staff training — that scope is quoted per practice.",
  },
  {
    q: "Do I need to rebuild my website?",
    a: "No. If the practice already has WordPress, we install a small plugin (or paste a one-line snippet into WPCode). The theme and pages stay. The chat button appears on every public page; questions, phone numbers and bookings go to the clinic dashboard. Practices without a website get a full site plus the same receptionist — that's a separate package.",
  },
  {
    q: "We already have WordPress. What do you install?",
    a: "A plugin you upload under Plugins → Add New → Upload Plugin. After you activate it, Settings → AI Receptionist asks for the hosted app URL we give the practice. Save once. If they prefer not to use a plugin, the same script goes in WPCode or Insert Headers and Footers, site-wide.",
  },
  {
    q: "Which calendar does it book into?",
    a: "Cal.com is supported out of the box. Other systems can be connected where an API is available; otherwise the platform manages bookings itself and your team syncs them into your practice management software.",
  },
  {
    q: "What does it cost to run?",
    a: "Setup is a one-off fee. Ongoing costs are usage-based and billed by the providers directly to you: the AI model, SMS, email and hosting. You keep ownership of the accounts and API keys.",
  },
]

export default function AgencyLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/solutions/dental" className="flex items-center gap-2.5">
            <ToothMark className="size-7" />
            <span className="text-sm leading-tight font-semibold text-ink">
              AI Receptionist
              <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">for dental practices</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/">View the live demo site</Link>
            </Button>
            <Button asChild className="rounded-full">
              <a href={CALENDAR_URL}>Book a Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-mint/70 to-background">
          <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> For dental practices in the US
              </p>
              <h1 className="font-display mt-6 text-4xl leading-[1.05] font-medium text-ink sm:text-5xl lg:text-6xl">
                Turn your dental website into an <span className="text-primary italic">AI receptionist.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Your website shouldn&apos;t just display information. It should answer patients, capture leads, qualify inquiries, book appointments, send
                reminders and follow up — automatically, around the clock.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full px-7 text-base shadow-lg shadow-primary/20">
                  <Link href="/?demo=1">
                    <Sparkles /> See the AI Demo
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-primary/25 px-7 text-base text-primary">
                  <a href={CALENDAR_URL}>Book a Demo</a>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                The demo is a complete working system — chat, booking, dashboard and automations — built on a fictional clinic so you can click anything.
              </p>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-ink/10">
                <Image src="/images/scan.jpg" alt="Digital dental scan on a tablet" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" priority />
              </div>
              <div className="absolute -bottom-6 left-4 w-64 rounded-2xl border bg-card p-4 shadow-xl">
                <p className="text-xs font-semibold text-ink">New lead · 9:42 PM</p>
                <p className="mt-1 text-xs text-muted-foreground">Invisalign consultation · booked Tue 9:00 AM</p>
                <div className="mt-2 flex gap-1.5 text-[10px] font-semibold">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">HOT</span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">Reminders set</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two ways we sell */}
        <section className="container-page py-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">How we deliver it</p>
            <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">Keep WordPress. Or get a site if you don&apos;t have one.</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border bg-card p-7">
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">Already have a website</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">WordPress chatbot</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your pages and theme stay. We add a plugin (or a one-line snippet). Patients see the same AI receptionist on every public page. Leads and
                bookings land in the clinic dashboard, not in WordPress.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/85">
                {[
                  "Upload plugin → paste the hosted app URL → save",
                  "Works with WPCode / Insert Headers and Footers too",
                  "No theme files to edit",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-primary bg-card p-7">
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">No website yet</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Full site + receptionist</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We ship a practice website with hours, services, insurance and the receptionist built in — the demo you can click through on this site.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/85">
                {[
                  "Public site plus admin dashboard",
                  "Same booking, reminders and lead capture",
                  "Quoted as a separate package",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="container-page py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">The problem</p>
            <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">Most dental websites are brochures, not front desks.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Patients decide quickly. When nobody answers, they move on to the next practice in the search results.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-card p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-sand text-coral">
                  <p.icon className="size-5" />
                </span>
                <p className="mt-4 font-semibold text-ink">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-y bg-card">
          <div className="container-page py-20">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">The solution</p>
              <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">One assistant that does six jobs.</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="rounded-2xl border p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                    <c.icon className="size-5" />
                  </span>
                  <p className="mt-4 font-semibold text-ink">{c.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="container-page py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">From first question to booked chair — automatically.</h2>
          </div>
          <ol className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {FLOW.map((step, i) => (
              <li key={step} className="relative rounded-xl border bg-card p-4 text-center">
                <span className="text-[11px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 text-xs leading-snug font-medium text-ink">{step}</p>
                {i < FLOW.length - 1 && <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-4 -translate-y-1/2 text-primary/40 lg:block" />}
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/automations/builder">
                <Workflow /> Open the automation builder
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/login">
                <BarChart3 /> Open the clinic dashboard
              </Link>
            </Button>
          </div>
        </section>

        {/* Deliverables + stack */}
        <section className="border-y bg-sand/50">
          <div className="container-page grid gap-12 py-20 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">What you get</p>
              <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">Everything set up, connected and documented.</h2>
              <ul className="mt-8 space-y-3">
                {DELIVERABLES.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-ink/85">
                    <Check className="mt-0.5 size-4.5 shrink-0 text-primary" /> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Built with</p>
              <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">A production stack, not a chatbot plugin.</h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {STACK.map((s) => (
                  <li key={s.label} className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm font-medium text-ink">
                    <s.icon className="size-4.5 text-primary" /> {s.label}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                You own the code, the database and the API keys. Everything runs in accounts that belong to your practice.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="container-page py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Pricing</p>
            <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">Straightforward setup pricing.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border bg-card p-8">
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">Starter</p>
              <p className="font-display mt-3 text-4xl font-medium text-ink">
                $199 <span className="text-base font-normal text-muted-foreground">setup</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The AI receptionist on your existing website, trained on your practice information.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "WordPress plugin or snippet on the site you already have",
                  "Knowledge base from your services, hours and insurance list",
                  "Lead capture and qualification",
                  "Online booking page with email confirmations",
                  "Lead dashboard",
                ].map((f) => (
                  <li key={f} className="flex gap-2.5 text-ink/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 h-11 w-full rounded-full">
                <a href={CALENDAR_URL}>Book a Demo</a>
              </Button>
            </div>
            <div className="relative rounded-3xl border-2 border-primary bg-card p-8">
              <span className="absolute -top-3 right-8 rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-wide text-primary-foreground uppercase">
                Most complete
              </span>
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">Professional</p>
              <p className="font-display mt-3 text-4xl font-medium text-ink">Custom pricing</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The full platform: automations, calendar integration, SMS and the complete clinic dashboard.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "Everything in Starter",
                  "Calendar integration (Cal.com or equivalent)",
                  "SMS confirmations and reminders",
                  "Missed-lead follow-up and review-request automations",
                  "Full dashboard: conversations, appointments, automations, analytics",
                  "Custom workflows and staff training",
                ].map((f) => (
                  <li key={f} className="flex gap-2.5 text-ink/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 h-11 w-full rounded-full">
                <a href={CALENDAR_URL}>Talk through your practice</a>
              </Button>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Setup fees are one-off. Ongoing provider costs (AI model usage, SMS, email, hosting) are billed directly to your practice at cost. Results depend on
            your traffic, services and market — no specific increase in patients or revenue is promised.
          </p>
        </section>

        {/* FAQ */}
        <section className="border-t bg-card">
          <div className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow mb-3">FAQ</p>
              <h2 className="font-display text-3xl leading-tight font-medium text-ink sm:text-4xl">Questions practices ask.</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-base font-semibold text-ink">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container-page py-20">
          <div className="rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12">
            <h2 className="font-display mx-auto max-w-2xl text-3xl leading-tight font-medium sm:text-4xl">
              See it working on a real website before you decide.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
              Run the guided demo — visitor question to booked appointment to automated follow-up — in about ninety seconds.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-base text-ink hover:bg-white/90">
                <Link href="/?demo=1">
                  <Sparkles /> See the AI Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white">
                <a href={CALENDAR_URL}>Book a Demo</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>AI receptionist &amp; patient automation platform · portfolio project</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-primary">
              Demo clinic site
            </Link>
            <Link href="/admin/login" className="hover:text-primary">
              Clinic dashboard
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
