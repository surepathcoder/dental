import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  HeartHandshake,
  LayoutDashboard,
  MessageCircle,
  MessageSquareText,
  Play,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react"

import { ToothMark } from "@/components/brand/logo"
import { PageMotion } from "@/components/site/motion"
import { SalesInquiryForm } from "@/components/site/sales-inquiry-form"
import { SectionHeading } from "@/components/site/shared"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI Receptionist for Dental Clinics",
  description:
    "Give every inquiry a next step. An AI dental receptionist for patient questions, appointment booking, reminders, and follow-up. Explore the working demo.",
}

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_AGENCY_EMAIL?.trim()
const CALENDAR_URL = process.env.NEXT_PUBLIC_AGENCY_CALENDAR_URL?.trim() || "#get-started"
const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Be there for the first question.",
    body: "Answer questions about your services, hours, pricing, and insurance using your practice information.",
    tag: "24/7 patient support",
  },
  {
    icon: CalendarCheck,
    title: "Make the next step a booking.",
    body: "Guide patients from interest to an available appointment, in the same conversation.",
    tag: "Online scheduling",
  },
  {
    icon: Repeat2,
    title: "Keep the conversation going.",
    body: "Confirm visits, send reminders, and follow up with interested patients when integrations are connected.",
    tag: "Thoughtful follow-up",
  },
]
const FAQS = [
  {
    q: "Can I try it before deciding?",
    a: "Yes. Explore the fictional clinic, ask the AI receptionist a question, and try booking. The guided demo shows the full journey through the dashboard. Use sample contact details; this demo is not a real dental practice.",
  },
  {
    q: "Will it work with my existing website?",
    a: "Yes. The receptionist can be added to WordPress with a small plugin, or to other websites with an embed snippet. If you need a new practice website too, we can scope that as a separate package.",
  },
  {
    q: "Does it replace my reception team?",
    a: "It supports your team by handling routine questions and collecting booking details. Your staff can review conversations and take over when a patient needs a person.",
  },
  {
    q: "What can the AI answer?",
    a: "It uses your configured practice information for services, hours, insurance, and pricing. It checks available appointments instead of inventing times. Clinical questions are handed to your team; it does not diagnose or recommend treatment.",
  },
  {
    q: "Which booking and messaging tools can I connect?",
    a: "The platform supports Cal.com scheduling, email through supported providers, and SMS through Twilio. Other practice systems need a separate integration review. Provider subscriptions and message usage are billed separately.",
  },
  {
    q: "What is included in the setup price?",
    a: "Starter includes the receptionist on your existing website, practice information setup, lead capture, an online booking page with email confirmations, and a lead dashboard. Professional adds calendar integration, SMS, follow-up workflows, and the full dashboard. Ongoing hosting and provider usage are separate.",
  },
  {
    q: "Is the demo ready for real patient information?",
    a: "No. This public demo is for sample information. A live deployment requires appropriate access controls, privacy and compliance review, and agreements with connected providers. HIPAA requirements, where applicable, are scoped with the practice before launch.",
  },
]

export default function AgencyLandingPage() {
  return (
    <div className="marketing-shell sales-site flex min-h-screen flex-col">
      <PageMotion />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <Link href="/solutions/dental" className="flex items-center gap-2.5">
            <ToothMark className="size-9" />
            <span className="font-display text-lg font-semibold leading-tight text-ink">
              BrightSmile
              <span className="block font-sans text-[9px] font-semibold uppercase tracking-[.2em] text-primary">
                Practice growth, simplified
              </span>
            </span>
          </Link>
          <nav aria-label="Platform navigation" className="hidden items-center gap-7 text-sm font-medium text-ink/75 lg:flex">
            <a href="#features" className="hover:text-primary">
              The platform
            </a>
            <a href="#how-it-works" className="hover:text-primary">
              How it works
            </a>
            <a href="#pricing" className="hover:text-primary">
              Pricing
            </a>
            <a href="#questions" className="hover:text-primary">
              FAQs
            </a>
          </nav>
          <Button asChild className="h-11 rounded-full px-5 text-xs sm:text-sm">
            <a href={CALENDAR_URL}>
              Let’s talk <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
        <nav
          aria-label="Mobile platform navigation"
          className="flex justify-center gap-6 border-t px-4 py-3 text-xs font-medium text-primary lg:hidden"
        >
          <a href="#features">Platform</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#questions">FAQs</a>
        </nav>
      </header>
      <main id="main" className="flex-1">
        <section data-reveal className="home-hero">
          <div className="container-page grid items-center gap-12 pt-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
            <div className="hero-copy">
              <p className="eyebrow flex items-center gap-2">A WARM WELCOME. A CLEAR NEXT STEP.</p>
              <h1 className="font-display mt-6 text-[3rem] leading-[1.06] font-medium text-ink sm:text-6xl lg:text-[4.1rem]">
                A front desk.
                <br />
                Without the
                <br />
                <span className="text-primary">closing time.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-[1.8] text-muted-foreground">
                Your next patient could be browsing right now. Give them answers, help them book, and keep the conversation moving — even
                when your team has gone home.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-13 rounded-full px-7 text-sm">
                  <Link href="/?demo=1">
                    <Play className="size-4" /> Try the live demo <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-13 rounded-full bg-transparent px-7 text-sm">
                  <a href="#pricing">Explore packages</a>
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" /> No signup to explore
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" /> Works with your website
                </span>
              </div>
            </div>
            <div className="hero-visual relative min-w-0 pb-20">
              <div className="hero-photo relative aspect-[1.12] overflow-hidden bg-sand">
                <Image
                  src="/images/african-consultation.webp"
                  alt="An African dentist having a relaxed conversation with a patient"
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
                <p className="font-display absolute bottom-28 left-6 max-w-64 text-2xl leading-tight text-white">
                  More time for the
                  <br />
                  people in your care.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 left-4 rounded-2xl border bg-white p-5 shadow-[0_16px_50px_#203e3215] sm:-left-5 sm:right-8">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="grid size-7 place-items-center rounded-full bg-secondary text-primary">
                      <Sparkles className="size-3.5" />
                    </span>
                    Your practice, connected
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Demo preview</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#e7ebd5] p-3">
                  <CalendarCheck className="size-5 shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-ink">New consultation booked</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Patient inquiry → appointment → follow-up</p>
                  </div>
                  <CheckCheck className="size-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
          <div className="container-page">
            <div className="grid grid-cols-2 gap-5 border-t border-ink/10 py-7 text-xs font-medium text-ink/75 sm:grid-cols-4 sm:text-sm">
              {[
                { icon: MessageCircle, text: "Questions answered" },
                { icon: Users, text: "Inquiries captured" },
                { icon: CalendarCheck, text: "Visits scheduled" },
                { icon: BarChart3, text: "Progress made visible" },
              ].map((item) => (
                <span key={item.text} className="flex items-center justify-center gap-2">
                  <item.icon className="size-4 shrink-0 text-primary" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal id="features" className="container-page py-20 sm:py-24">
          <SectionHeading
            align="center"
            eyebrow="A better first impression. A clearer next step."
            title={
              <>
                Your team is caring for patients.
                <br />
                <span className="text-primary italic">Let your website help, too.</span>
              </>
            }
            intro="Give visitors an easy way to get answers and take action, while your team stays focused on the people in front of them."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <article key={feature.title} className={`rounded-3xl border p-7 ${index === 1 ? "bg-[#ede9e1]" : "bg-white"}`}>
                <span className="grid size-12 place-items-center rounded-2xl border border-primary/15 bg-background text-primary">
                  <feature.icon className="size-6" />
                </span>
                <p className="mt-8 text-[10px] font-semibold uppercase tracking-widest text-primary">{feature.tag}</p>
                <h3 className="font-display mt-3 text-2xl leading-tight text-ink">{feature.title}</h3>
                <p className="mt-4 text-sm leading-[1.8] text-muted-foreground">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-reveal className="bg-[#34272e] text-white">
          <div className="container-page grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow !text-[#ddebba]">The whole picture, in one place</p>
              <h2 className="font-display mt-4 text-4xl leading-[1.12] sm:text-5xl">
                Less chasing.
                <br />
                <span className="text-[#ddebba] italic">More clarity.</span>
              </h2>
              <p className="mt-5 leading-[1.8] text-white/70">
                Know who reached out, what they need, and what happens next. One dashboard connects conversations, leads, appointments, and
                follow-up.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-white/85">
                {[
                  "Read the conversation before you call back",
                  "See appointment and lead status at a glance",
                  "Control reminder and follow-up workflows",
                  "Understand how visitors move toward booking",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="size-4 shrink-0 text-[#ddebba]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="mt-8 h-12 rounded-full border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/admin/login">
                  Explore the dashboard <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/5 p-4 sm:p-6">
              <div className="overflow-hidden rounded-xl bg-[#f7f5f0] text-ink">
                <div className="flex items-center gap-2 border-b bg-white px-4 py-4">
                  <ToothMark className="size-6" />
                  <p className="text-xs font-semibold">Practice overview</p>
                  <span className="ml-auto text-[9px] text-muted-foreground">Illustrative preview</span>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold">Every inquiry has a next step.</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { icon: Users, title: "Leads" },
                      { icon: CalendarCheck, title: "Bookings" },
                      { icon: Workflow, title: "Follow-ups" },
                    ].map((item) => (
                      <div key={item.title} className="rounded-xl border bg-white p-3">
                        <item.icon className="mb-3 size-5 text-primary" />
                        <p className="text-[10px] font-medium">{item.title}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      { title: "New patient inquiry", detail: "General checkup", status: "Captured" },
                      { title: "Consultation appointment", detail: "Cosmetic dentistry", status: "Booked" },
                      { title: "Appointment reminder", detail: "Email + SMS workflow", status: "Scheduled" },
                    ].map((row) => (
                      <div key={row.title} className="flex items-center gap-2 border-b pb-3 last:border-0">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary">
                          <Check className="size-3 text-primary" />
                        </span>
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold">{row.title}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">{row.detail}</p>
                        </div>
                        <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-semibold text-primary">{row.status}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/admin/login"
                    className="mt-3 flex items-center justify-between border-t pt-4 text-xs font-semibold text-primary"
                  >
                    Open the working dashboard <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-reveal id="how-it-works" className="container-page py-20 sm:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="From hello to follow-up" title="A smoother journey, from the start." />
            <Link href="/?demo=1" className="text-link">
              See it happen <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "A patient asks.",
                body: "The receptionist helps with questions, understands their interest, and collects contact details.",
              },
              {
                title: "They find a time.",
                body: "Available appointments make booking the natural next step. Your team can review the details.",
              },
              {
                title: "You stay connected.",
                body: "Connected email and SMS services handle confirmations, reminders, and scheduled follow-up.",
              },
            ].map((step, index) => (
              <li key={step.title} className="border-t border-primary/25 pt-6">
                <span className="font-display text-4xl text-primary/50">0{index + 1}</span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-[1.8] text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section data-reveal id="pricing" className="border-y bg-[#ede9e1]">
          <div className="container-page py-20 sm:py-24">
            <SectionHeading
              align="center"
              eyebrow="A clear place to start"
              title={
                <>
                  Built around <span className="text-primary italic">your practice.</span>
                </>
              }
              intro="Start with the receptionist, or connect the full patient journey. One-time setup, with provider usage billed separately."
            />
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
              {[
                {
                  name: "Starter",
                  tagline: "Make your existing website work harder.",
                  price: "$199",
                  detail: "one-time setup",
                  features: [
                    "AI receptionist on your existing website",
                    "Your services, hours, and insurance information",
                    "Lead capture and qualification",
                    "Online booking page + email confirmations",
                    "Lead dashboard",
                  ],
                  cta: "Start with the essentials",
                },
                {
                  name: "Professional",
                  tagline: "Connect the whole patient journey.",
                  price: "Let’s build your plan",
                  detail: "custom quote for your practice",
                  features: [
                    "Everything in Starter",
                    "Calendar integration",
                    "SMS confirmations and reminders",
                    "Missed-inquiry follow-up and review requests",
                    "Full conversations, bookings, and analytics dashboard",
                    "Custom workflows and a staff walkthrough",
                  ],
                  cta: "Talk about your practice",
                },
              ].map((plan, index) => (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border bg-white p-7 sm:p-9 ${index === 1 ? "border-primary ring-1 ring-primary" : "border-transparent"}`}
                >
                  {index === 1 && (
                    <span className="absolute -top-3 right-7 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-white">
                      THE COMPLETE WORKFLOW
                    </span>
                  )}
                  <p className="eyebrow">{plan.name}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.tagline}</p>
                  <p className={`font-display mt-7 text-ink ${index === 0 ? "text-5xl" : "text-3xl sm:text-4xl"}`}>{plan.price}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{plan.detail}</p>
                  <ul className="mt-7 flex-1 space-y-3 border-t pt-7">
                    {plan.features.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={index === 1 ? "default" : "outline"} className="mt-8 h-12 w-full rounded-full">
                    <a href={CALENDAR_URL}>
                      {plan.cta} <ArrowUpRight />
                    </a>
                  </Button>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
              AI usage, email, SMS, and hosting are separate ongoing costs. A new practice website and additional integrations are quoted
              separately. No specific booking or revenue increase is guaranteed.
            </p>
          </div>
        </section>

        <section data-reveal className="container-page grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[1.4] overflow-hidden rounded-3xl">
            <Image
              src="/images/african-dental-hero.webp"
              alt="An African patient and dentist smiling in a welcoming clinic"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Your practice. Your personality."
              title="Make it feel like you."
              intro="Your branding, your services, your approach to care. We help turn your practice information into an experience that feels familiar to patients."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <span className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 text-primary" /> Accounts you own
              </span>
              <span className="flex items-center gap-2 text-sm">
                <HeartHandshake className="size-4 text-primary" /> Your team in control
              </span>
              <span className="flex items-center gap-2 text-sm">
                <LayoutDashboard className="size-4 text-primary" /> A connected dashboard
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Clock3 className="size-4 text-primary" /> Support after hours
              </span>
            </div>
          </div>
        </section>

        <section data-reveal id="questions" className="border-y bg-white">
          <div className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Before you take the next step" title="Good questions. Clear answers." />
              <a href="#get-started" className="text-link mt-6">
                Tell us what you have in mind <ArrowUpRight className="size-4" />
              </a>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-ink sm:text-base">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-[1.8] text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section
          data-reveal
          id="get-started"
          className="container-page grid items-start gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20"
        >
          <div>
            <p className="eyebrow">Let’s talk about your next chapter</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
              Your next patient
              <br />
              could start with
              <br />
              <span className="text-primary italic">a conversation.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-[1.8] text-muted-foreground">
              Tell us a little about your practice and what you’d like to improve. We’ll have the details needed to discuss the right setup
              for you.
            </p>
            <Link href="/?demo=1" className="text-link mt-7">
              Prefer to explore first? Try the demo <ChevronRight className="size-4" />
            </Link>
            {CONTACT_EMAIL && (
              <p className="mt-5 text-sm text-muted-foreground">
                Or email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </p>
            )}
            <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
              This is a working product demonstration. Use sample details when exploring; do not include patient information.
            </p>
          </div>
          <SalesInquiryForm />
        </section>
      </main>
      <footer className="border-t bg-ink text-white/70">
        <div className="container-page flex flex-col justify-between gap-5 py-8 text-xs sm:flex-row sm:items-center">
          <p>BrightSmile · AI reception &amp; patient automation</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-white">
              Demo practice
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
