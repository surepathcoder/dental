import type { Metadata } from "next"
import Image from "next/image"
import { CalendarCheck, Check, MessageCircle, ShieldCheck } from "lucide-react"

import { BookingForm } from "@/components/booking/booking-form"
import { ChatCTA } from "@/components/site/chat-cta"
import { PracticePhoneLink } from "@/components/site/practice-copy"

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Find the right visit, choose a time, and book your appointment with our team.",
}

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { service } = await searchParams
  const defaultService = typeof service === "string" ? service : undefined

  return (
    <section className="container-page booking-layout">
      <div className="booking-sidebar">
        <p className="eyebrow">A little time for your wellbeing</p>
        <h1 className="font-display mt-5 text-[2.7rem] leading-[1.1] text-ink sm:text-5xl">
          Let’s find your
          <br />
          <span className="text-primary italic">next smile.</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-[1.85] text-muted-foreground">
          Choose your care, find a time that works, and tell us a little about yourself. We’ll guide you through each step.
        </p>
        <ul className="mt-7 hidden space-y-3 text-sm text-ink lg:block">
          {["Clear options before you book", "A friendly team ready to welcome you", "Your comfort comes first"].map((text) => (
            <li key={text} className="flex items-center gap-2.5">
              <Check className="size-4 text-primary" />
              {text}
            </li>
          ))}
        </ul>
        <div className="mt-8 hidden items-center gap-4 lg:flex border-y py-5">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/images/african-dentist-woman.webp"
              alt="Illustrative portrait of a welcoming dentist"
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">A question before you book?</p>
            <PracticePhoneLink className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-primary" />
          </div>
        </div>
        <div className="mt-6 hidden items-start gap-2 lg:flex text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <p>Ask our team about your insurance cover.</p>
        </div>
      </div>
      <div>
        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-primary">
          <CalendarCheck className="size-4" /> Your visit, in three simple steps
        </div>
        <div className="booking-surface">
          <BookingForm defaultService={defaultService} />
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border p-5 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="size-4 text-primary" />
            Rather talk it through first?
          </p>
          <ChatCTA label="Ask our online assistant" className="h-10 px-4 text-xs" />
        </div>
      </div>
    </section>
  )
}
