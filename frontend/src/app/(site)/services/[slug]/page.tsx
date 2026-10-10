import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CalendarCheck, Check, Clock, Wallet } from "lucide-react"

import { ChatCTA } from "@/components/site/chat-cta"
import { FinalCTA, SectionHeading, SERVICE_ICONS } from "@/components/site/shared"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { serviceBySlug, services } from "@/lib/site"

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) return { title: "Service not found" }
  return { title: service.name, description: service.short }
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) notFound()
  const Icon = SERVICE_ICONS[service.icon]
  const others = services.filter((s) => s.slug !== service.slug)

  return (
    <>
      <section className="border-b bg-gradient-to-b from-mint/70 to-background">
        <div className="container-page grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground">
              <Link href="/services" className="hover:text-primary">
                Services
              </Link>
              <span className="px-2">/</span>
              <span className="text-ink">{service.name}</span>
            </nav>
            <span className="mb-5 grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h1 className="font-display text-4xl leading-[1.05] font-medium text-ink sm:text-5xl">{service.headline}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
                <Link href={`/book?service=${service.slug}`}>
                  <CalendarCheck /> Book {service.name.toLowerCase()}
                </Link>
              </Button>
              <ChatCTA label="Ask about this" message={service.chatPrompt} />
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-xl border bg-card p-4">
                <Clock className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Visit length</dt>
                  <dd className="mt-0.5 text-sm text-ink">{service.duration}</dd>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border bg-card p-4">
                <Wallet className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Cost</dt>
                  <dd className="mt-0.5 text-sm text-ink">{service.priceNote}</dd>
                </div>
              </div>
            </dl>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-ink/5">
            <Image src={service.image} alt={service.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHeading eyebrow="Why patients choose us" title={`What to expect from ${service.name.toLowerCase()}`} />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border bg-card p-5">
                <Check className="size-5 text-primary" />
                <p className="mt-3 font-semibold text-ink">{b.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-12 text-lg font-semibold text-ink">How it works</h3>
          <ol className="mt-5 space-y-5 border-l pl-6">
            {service.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{i + 1}</span>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold text-ink">What we treat</h3>
            <ul className="mt-4 space-y-2.5">
              {service.treatments.map((t) => (
                <li key={t} className="flex gap-2.5 text-sm text-ink/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-sand p-6">
            <h3 className="font-semibold text-ink">Questions before booking?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Our online assistant can check your insurance, explain costs and find a time that fits — 24 hours a day.
            </p>
            <ChatCTA label="Chat about this" message={service.chatPrompt} className="mt-4 w-full" />
          </div>
        </aside>
      </section>

      <section className="border-t bg-card">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="FAQ" title={`${service.name} questions`} />
          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold text-ink">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-lg font-semibold text-ink">Other services</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <Link key={o.slug} href={`/services/${o.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 hover:border-primary/30">
              <span className="text-sm font-medium text-ink">{o.name}</span>
              <ArrowRight className="size-4 text-primary transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
