import type { Metadata } from "next"
import { Clock, ShieldCheck } from "lucide-react"

import { BookingForm } from "@/components/booking/booking-form"
import { ChatCTA } from "@/components/site/chat-cta"
import { PracticePhoneLink } from "@/components/site/practice-copy"

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book your visit online in under a minute — or chat with our AI receptionist.",
}

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { service } = await searchParams
  const defaultService = typeof service === "string" ? service : undefined

  return (
    <>
      <section className="border-b bg-gradient-to-b from-mint/70 to-background">
        <div className="container-page py-12 text-center sm:py-16">
          <p className="eyebrow mb-3">Online booking</p>
          <h1 className="font-display text-4xl leading-tight font-medium text-ink sm:text-5xl">Book your appointment</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Three quick steps. You&apos;ll get an instant confirmation by email and text, plus reminders before your visit.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/75">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" /> Takes about a minute
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" /> Most PPO plans accepted
            </span>
            <PracticePhoneLink className="flex items-center gap-1.5 font-semibold hover:text-primary" />
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <BookingForm defaultService={defaultService} />
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border bg-sand/60 p-6 text-center">
          <p className="text-sm font-medium text-ink">Prefer to just ask a question first?</p>
          <ChatCTA label="Chat with our AI receptionist" />
        </div>
      </section>
    </>
  )
}
