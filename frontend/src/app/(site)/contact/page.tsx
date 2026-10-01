import type { Metadata } from "next"
import { Siren } from "lucide-react"

import { ChatCTA } from "@/components/site/chat-cta"
import { ContactForm } from "@/components/site/contact-form"
import { PracticeContactCard } from "@/components/site/practice-copy"
import { PageHero } from "@/components/site/shared"

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: "Call, email or message the practice — or chat with our AI receptionist 24/7.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="We're easy to reach — day or night." intro="Call during office hours, send a message, or ask our AI receptionist anything at any time.">
        <ChatCTA />
      </PageHero>

      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <PracticeContactCard />
          <div className="flex gap-3 rounded-2xl border border-coral/30 bg-sand/70 p-6">
            <Siren className="mt-0.5 size-5 shrink-0 text-coral" />
            <div>
              <h2 className="font-semibold text-ink">Dental emergency?</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Call us as early as you can — we reserve same-day appointments every weekday. If you have difficulty breathing or swallowing, severe bleeding or
                major facial trauma, call 911 or go to the nearest emergency room.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  )
}
