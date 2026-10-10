import type { Metadata } from "next"

import { ChatCTA } from "@/components/site/chat-cta"
import { LiveFaqs } from "@/components/site/practice-copy"
import { FinalCTA, PageHero } from "@/components/site/shared"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { services } from "@/lib/site"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Insurance, pricing, hours, emergencies and what to expect at your first visit.",
}

export default function FaqPage() {
  const serviceFaqs = services.flatMap((s) => s.faqs.map((f) => ({ ...f, group: s.name })))

  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions patients ask us most." intro="Can't find your answer? Our online assistant replies instantly, 24/7 — or call us during office hours.">
        <ChatCTA label="Ask a question" />
      </PageHero>

      <section className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-2xl font-medium text-ink">Practice &amp; billing</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Insurance, costs, hours, parking and new patient visits.</p>
        </div>
        <LiveFaqs />
      </section>

      <section className="border-t bg-card">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-2xl font-medium text-ink">Treatment questions</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              General information only — your dentist will give you personalized recommendations after an exam.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {serviceFaqs.map((f) => (
              <AccordionItem key={`${f.group}-${f.q}`} value={`${f.group}-${f.q}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-ink">
                  <span>
                    <span className="mr-2 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">{f.group}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
