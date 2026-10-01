import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, CalendarCheck, CalendarClock, CreditCard, HeartHandshake, MessageCircle, Quote, ShieldCheck, Siren, Stethoscope } from "lucide-react"

import { ChatCTA } from "@/components/site/chat-cta"
import { DemoOnly, HomeFaqs, InsurancePills, PracticeChatPreview, PracticeHeroCopy } from "@/components/site/practice-copy"
import { FinalCTA, SectionHeading, ServiceCard } from "@/components/site/shared"
import { Button } from "@/components/ui/button"
import { clinic, services, team, testimonials } from "@/lib/site"

const TRUST = [
  { icon: Stethoscope, title: "Experienced dentists", body: "General, cosmetic, implant and orthodontic care under one roof." },
  { icon: Siren, title: "Same-day emergencies", body: "Time reserved every weekday for toothaches and dental injuries." },
  { icon: ShieldCheck, title: "Insurance accepted", body: "In-network with most major PPO plans. We file claims for you." },
  { icon: CreditCard, title: "Flexible financing", body: "CareCredit, Sunbit and a $29/month membership plan." },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mint via-background to-background">
        <div className="container-page grid items-center gap-12 pt-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
          <div>
            <PracticeHeroCopy />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-base shadow-lg shadow-primary/20">
                <Link href="/book">
                  <CalendarCheck /> Book an Appointment
                </Link>
              </Button>
              <ChatCTA />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/75">
              {["Most PPO plans accepted", "Open Saturdays", "New patient special $129"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/10 sm:aspect-[4/3.2]">
              <Image src="/images/hero-clinic.jpg" alt="Bright, modern treatment room" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <PracticeChatPreview />
            <div className="absolute top-5 -right-2 hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg sm:flex">
              <CalendarClock className="size-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-ink">Same-day emergencies</p>
                <p className="text-[11px] text-muted-foreground">Reserved every weekday</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────────── */}
      <section className="border-y bg-card">
        <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <t.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="container-page py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Our services" title="Everything your smile needs, in one practice." intro="From routine cleanings to implants and clear aligners — with clear explanations and pricing before any treatment." />
          <Button asChild variant="outline" className="h-11 self-start rounded-full px-5 md:self-auto">
            <Link href="/services">
              All services <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
          <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
            <div>
              <MessageCircle className="size-6" />
              <h3 className="mt-4 text-xl font-semibold">Not sure what you need?</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                Tell our AI receptionist what&apos;s going on. It will point you to the right visit and find a time that works — no phone tag.
              </p>
            </div>
            <ChatCTA label="Ask our AI receptionist" className="mt-6 self-start border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline" />
          </div>
        </div>
      </section>

      {/* ── AI receptionist ─────────────────────────────────── */}
      <section className="bg-sand/60">
        <div className="container-page grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="24/7 AI receptionist"
              title="Questions at 10 PM? The AI receptionist has answers — and appointments."
              intro="Our AI receptionist answers common questions from our practice information, checks availability and books your visit. Clinical questions always go to our dentists."
            />
            <ol className="mt-8 space-y-4">
              {[
                ["Ask anything", "Insurance, pricing, hours, services — answered instantly from verified practice information."],
                ["Pick a time", "See real openings and choose the one that works for you."],
                ["Get confirmed", "Instant confirmation by email and text, plus reminders before your visit."],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-ink">{t}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <ChatCTA label="Try the AI receptionist" message="Hi! Do you accept Delta Dental?" />
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
              <Image src="/images/clinic-room.jpg" alt="Treatment room with dental chair" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="absolute right-4 -bottom-6 left-4 rounded-2xl border bg-card p-4 shadow-xl sm:right-auto sm:w-80">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CalendarCheck className="size-4 text-primary" /> Appointment Confirmed
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Invisalign consultation · Tue 9:00 AM · Dr. Priya Nair</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Email sent</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">SMS sent</span>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700">Reminder scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section className="container-page py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Meet the team" title="Dentists who take the time to explain." />
          <Button asChild variant="outline" className="h-11 self-start rounded-full px-5 md:self-auto">
            <Link href="/team">
              Meet everyone <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <Image src={m.image} alt={`Portrait of ${m.name}`} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
              </div>
              <p className="mt-4 font-semibold text-ink">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <DemoOnly>
      <section className="bg-mint/60">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading align="center" eyebrow="Patient stories" title="What a better dental experience sounds like." />
          <p className="mx-auto mt-3 w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Demo testimonials — fictional, for illustration only</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border bg-card p-6">
                <Quote className="size-6 text-primary/40" />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-4">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">{t.name[0]}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.detail}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      </DemoOnly>

      {/* ── Insurance & financing ────────────────────────────── */}
      <section className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Insurance" title="In-network with most major PPO plans." intro="We verify your benefits before your visit and file claims for you — so you know what's covered before treatment starts." />
          <InsurancePills />
          <p className="mt-4 text-sm text-muted-foreground">Don&apos;t see your plan? Many PPO plans offer out-of-network benefits — ask our AI receptionist or call us.</p>
        </div>
        <div>
          <SectionHeading eyebrow="Financing" title="Great care, on a budget that works." />
          <div className="mt-8 space-y-3">
            {clinic.financing.map((f) => (
              <div key={f.name} className="flex gap-4 rounded-2xl border bg-card p-5">
                <HeartHandshake className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-ink">{f.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-t bg-card">
        <div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Answers to common questions." intro="Can't find what you're looking for? Ask our AI receptionist — available 24/7." />
            <Button asChild variant="link" className="mt-4 h-auto px-0 text-base">
              <Link href="/faq">
                See all FAQs <ArrowRight />
              </Link>
            </Button>
          </div>
          <HomeFaqs />
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
