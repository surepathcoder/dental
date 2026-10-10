import Image from "next/image"
import Link from "next/link"
import { Anchor, ArrowUpRight, CalendarCheck, Siren, Smile, Sparkles, Stethoscope } from "lucide-react"

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
      <h2 className="font-display text-[1.9rem] leading-[1.15] text-ink sm:text-[2.65rem]">{title}</h2>
      {intro && (
        <p className={cn("mt-5 max-w-xl text-sm leading-[1.85] text-muted-foreground sm:text-base", align === "center" && "mx-auto")}>
          {intro}
        </p>
      )}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="page-hero relative overflow-hidden border-b bg-sand/40">
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
    <Link href={`/services/${service.slug}`} className="treatment-card group flex flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-4 grid size-11 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="size-4.5" />
        </span>
        <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Explore this treatment <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function FinalCTA({
  title = "Ready for a healthier, brighter smile?",
  intro = "Book online in under a minute, or ask us anything, day or night.",
}: {
  title?: string
  intro?: string
}) {
  return (
    <section className="final-cta-section" data-reveal>
      <div className="final-cta">
        <div className="final-cta-copy">
          <p className="eyebrow mb-5">LET’S MAKE A START</p>
          <h2 className="font-display max-w-xl text-3xl leading-[1.15] text-ink sm:text-[2.65rem]">{title}</h2>
          <p className="mt-5 max-w-lg text-sm leading-[1.85] text-muted-foreground">{intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm">
              <Link href="/book">
                <CalendarCheck /> Book a visit <ArrowUpRight />
              </Link>
            </Button>
            <ChatCTA label="Ask a question" className="h-12 border-ink/15 bg-transparent px-5 text-sm" />
          </div>
        </div>
        <div className="final-cta-visual">
          <Image
            src="/images/african-dental-hero.webp"
            alt="A welcoming African dentist and patient"
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover object-[60%_center]"
          />
        </div>
      </div>
    </section>
  )
}
