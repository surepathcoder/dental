import type { Metadata } from "next"
import Image from "next/image"
import { Bot, HeartHandshake, MessageSquare, ShieldCheck, Sparkles } from "lucide-react"

import { FinalCTA, PageHero, SectionHeading } from "@/components/site/shared"
import { PracticeAboutCopy } from "@/components/site/practice-copy"

export const metadata: Metadata = {
  title: "About Our Practice",
  description: "A modern family and cosmetic dental practice — easy to understand, easy to schedule and never rushed.",
}

const VALUES = [
  { icon: MessageSquare, title: "Explain, then treat", body: "You'll always know what we see, what your options are and what it costs before anything starts." },
  { icon: HeartHandshake, title: "Comfort first", body: "Calm rooms, gentle hygienists and comfort options for anxious patients — no judgment, ever." },
  { icon: ShieldCheck, title: "Honest recommendations", body: "We prioritize treatment: what's urgent, what can wait and what's optional." },
  { icon: Sparkles, title: "Modern tools", body: "Digital X-rays, 3D scanning and implant planning — plus an AI receptionist so you're never on hold." },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A calm, modern dental practice."
        intro="Dental care should be easy to understand, easy to schedule and never rushed."
      />

      <section className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/images/clinic-chair.jpg" alt="Treatment room" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading
            eyebrow="Our story"
            title="Founded by a dentist who was tired of the ten-minute appointment."
            intro="Full-hour new patient visits, digital images reviewed together, and a front desk that answers — day or night."
          />
          <PracticeAboutCopy />
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading align="center" eyebrow="What we stand for" title="Four things we won't compromise on." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <v.icon className="size-5" />
                </span>
                <p className="mt-4 font-semibold text-ink">{v.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="rounded-3xl border bg-sand/70 p-8 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Bot className="size-6" />
            </span>
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">About our AI receptionist</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                The AI receptionist is an assistant — not a person and not a dentist. It answers questions using verified information about this practice
                (services, hours, insurance, pricing), checks real appointment availability and books visits. It never diagnoses conditions or recommends
                treatment; those decisions are always made by our dentists after an exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
