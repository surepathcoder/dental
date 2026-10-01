import Image from "next/image"
import Link from "next/link"
import { Anchor, ArrowRight, CalendarCheck, Siren, Smile, Sparkles, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ServiceContent } from "@/lib/site"
import { cn } from "@/lib/utils"

import { ChatCTA } from "./chat-cta"

export const SERVICE_ICONS = { stethoscope: Stethoscope, sparkles: Sparkles, anchor: Anchor, smile: Smile, siren: Siren }

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl leading-[1.1] font-medium text-ink sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-mint/70 to-background">
      <div className="container-page py-14 sm:py-20">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-medium text-ink sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

export function ServiceCard({ service }: { service: ServiceContent }) {
  const Icon = SERVICE_ICONS[service.icon]
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-3 grid size-9 place-items-center rounded-lg bg-secondary text-primary">
          <Icon className="size-4.5" />
        </span>
        <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Learn more <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function FinalCTA({ title = "Ready for a healthier, brighter smile?", intro = "Book online in under a minute, or ask our AI receptionist any question — day or night." }: { title?: string; intro?: string }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 lg:block">
          <Image src="/images/smile.jpg" alt="" fill sizes="40vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink to-transparent" />
        </div>
        <div className="relative max-w-xl">
          <h2 className="font-display text-3xl leading-tight font-medium sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-white/75">{intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-6 text-base text-ink hover:bg-white/90">
              <Link href="/book">
                <CalendarCheck /> Book an Appointment
              </Link>
            </Button>
            <ChatCTA variant="dark" />
          </div>
        </div>
      </div>
    </section>
  )
}
