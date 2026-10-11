"use client"

import { Car, Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react"

import { ChatCTA } from "@/components/site/chat-cta"
import { useClinic } from "@/components/site/clinic-provider"
import { FinalCTA } from "@/components/site/shared"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PracticeHeroCopy() {
  const { clinic, demoMode } = useClinic()
  return (
    <>
      <h1 className="editorial-hero-title">
        {demoMode ? (
          <>
            <span className="title-line">
              <span>Feel good.</span>
            </span>
            <span className="title-line">
              <em>Smile freely.</em>
            </span>
          </>
        ) : clinic.tagline.includes(".") ? (
          <>
            {clinic.tagline.split(".")[0]}.
            <br />
            <span className="text-primary italic">{clinic.tagline.split(".").slice(1).join(".").trim() || "Made Simple."}</span>
          </>
        ) : (
          <>
            {clinic.tagline || "Modern Dental Care."}
            <br />
            <span className="text-primary italic">{clinic.name}</span>
          </>
        )}
      </h1>
    </>
  )
}

export function InsurancePills() {
  const { clinic } = useClinic()
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {clinic.insurance.map((i) => (
        <li key={i} className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium text-ink">
          {i}
        </li>
      ))}
    </ul>
  )
}

export function PracticePhoneLink({ className }: { className?: string }) {
  const { clinic } = useClinic()
  if (!clinic.phone) return null
  return (
    <a href={clinic.phoneHref} className={className}>
      <Phone className="size-4 text-primary" /> {clinic.phone}
    </a>
  )
}

export function PracticeContactCard() {
  const { clinic } = useClinic()
  const maps = encodeURIComponent(`${clinic.address}, ${clinic.cityLine}`)
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold text-ink">Practice details</h2>
        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4.5 shrink-0 text-primary" />
            <span>
              <a
                href={`https://maps.google.com/?q=${maps}`}
                className="block font-medium text-ink hover:text-primary"
                target="_blank"
                rel="noreferrer"
              >
                {clinic.address}
              </a>
              <span className="block text-muted-foreground">{clinic.cityLine}</span>
            </span>
          </li>
          {clinic.phone && (
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4.5 shrink-0 text-primary" />
              <a href={clinic.phoneHref} className="font-medium text-ink hover:text-primary">
                {clinic.phone}
              </a>
            </li>
          )}
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4.5 shrink-0 text-primary" />
            <span className="font-medium text-ink">{clinic.email}</span>
          </li>
          <li className="flex gap-3">
            <Car className="mt-0.5 size-4.5 shrink-0 text-primary" />
            <span className="text-muted-foreground">Free covered parking in front of the building.</span>
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Clock className="size-4.5 text-primary" /> Office hours
        </h2>
        <ul className="mt-4 space-y-1.5 text-sm">
          {clinic.hours.map((h) => (
            <li key={h.day} className="flex justify-between gap-4 border-b border-dashed pb-1.5 last:border-0">
              <span className="text-ink">{h.day}</span>
              <span className="text-muted-foreground">{h.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function PracticeAboutCopy() {
  const { clinic, demoMode } = useClinic()
  return (
    <>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Today the practice brings general, cosmetic, implant and orthodontic care together under one roof at {clinic.address},{" "}
        {clinic.cityLine}. We keep emergency time open every weekday, explain every cost upfront so it never gets in
        the way of care.
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        If something needs a human, {clinic.assistantName} hands you to our front desk{clinic.phone ? ` at ${clinic.phone}` : ""}. In a medical emergency, call your local emergency number.
      </p>
      {demoMode && (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          This website is a portfolio demo. Patient reviews and dashboard figures shown here are demonstration data unless they came from a
          live booking.
        </p>
      )}
    </>
  )
}

export function LiveFaqs() {
  const { clinic } = useClinic()
  const items = clinic.faqs
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">FAQs are managed in Settings → Knowledge.</p>
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f) => (
        <AccordionItem key={f.id ?? f.question} value={String(f.id ?? f.question)}>
          <AccordionTrigger className="text-left text-base font-semibold text-ink">{f.question}</AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function HomeFaqs({ limit = 6 }: { limit?: number }) {
  const { clinic } = useClinic()
  const items = clinic.faqs.slice(0, limit)
  if (!items.length) return null
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f) => (
        <AccordionItem key={f.id ?? f.question} value={String(f.id ?? f.question)}>
          <AccordionTrigger className="text-left text-base font-semibold text-ink">{f.question}</AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function DemoOnly({ children }: { children: React.ReactNode }) {
  const { demoMode } = useClinic()
  if (!demoMode) return null
  return <>{children}</>
}

export function ClinicName({ fallback = "the practice" }: { fallback?: string }) {
  const { clinic } = useClinic()
  return <>{clinic.name || fallback}</>
}

export function AskAssistantCta({
  message,
  className,
  variant,
}: {
  message?: string
  className?: string
  variant?: "light" | "dark" | "outline"
}) {
  const { clinic } = useClinic()
  return <ChatCTA label={`Ask ${clinic.assistantName}`} message={message} className={className} variant={variant} />
}

export function PracticeChatPreview() {
  const { clinic } = useClinic()
  return (
    <div className="absolute -bottom-8 left-3 w-[min(320px,85%)] rounded-2xl border bg-card p-4 shadow-xl sm:-left-8">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-white">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">{clinic.assistantName} · Online assistant</p>
          <p className="text-[11px] text-muted-foreground">Replies instantly, day or night</p>
        </div>
      </div>
      <p className="mt-3 rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-[13px] leading-snug text-ink">
        Good news — we&apos;re in-network with {clinic.insurance[0] || "your insurer"}. I have openings tomorrow at 8:30 and 10:00 AM.
        Want me to book one?
      </p>
      <div className="mt-2 flex gap-1.5">
        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">8:30 AM</span>
        <span className="rounded-full border border-primary/30 px-2.5 py-1 text-[11px] font-semibold text-primary">10:00 AM</span>
      </div>
    </div>
  )
}

export function LiveFinalCta({ title = "Ready for a healthier, brighter smile?" }: { title?: string }) {
  const { clinic } = useClinic()
  return <FinalCTA title={title} intro={`Book online in under a minute, or ask ${clinic.assistantName} any question — day or night.`} />
}

export function PrivacyBody() {
  const { clinic, demoMode } = useClinic()
  const sections = demoMode
    ? [
        {
          title: "This is a demonstration website",
          body: [
            `${clinic.name} is shown here to demonstrate an online assistant and patient automation platform.`,
            "Please do not enter real patient information, protected health information (PHI), payment details or any other sensitive data anywhere on this site.",
          ],
        },
        {
          title: "What this demo collects",
          body: [
            "When you chat with the online assistant or submit a form, the text you type, along with any name, phone number, email address, treatment interest, insurance name and appointment preference you provide, is stored so the workflow can be shown end-to-end.",
            "Technical information such as your IP address is used briefly for rate limiting and audit logging.",
          ],
        },
        {
          title: "How information is used",
          body: [
            "Information you enter is used only to operate the demo: generating AI responses, creating leads and appointments, and displaying the admin dashboard.",
            "Email and SMS are only sent when those integrations are connected.",
          ],
        },
      ]
    : [
        {
          title: `Information ${clinic.name} collects`,
          body: [
            `When you chat with our online assistant or submit a form, we store the name, phone, email, treatment interest and appointment details you provide so ${clinic.name} can answer you and book your visit.`,
            "Technical information such as your IP address may be used for rate limiting and security logging.",
          ],
        },
        {
          title: "How information is used",
          body: [
            "We use it to operate this website, the online assistant, appointment confirmations, reminders and follow-ups.",
            "Message text may be sent to an AI provider to generate responses. Email and SMS providers send confirmations only when those services are connected.",
          ],
        },
      ]
  return (
    <>
      {demoMode && (
        <p className="mb-10 rounded-xl bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
          Demo only — do not enter real patient information. This notice describes a software demonstration.
        </p>
      )}
      <div className="space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xl font-semibold text-ink">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        ))}
        <div>
          <h2 className="text-xl font-semibold text-ink">A note on HIPAA</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            This software is not a HIPAA-compliant system by default and must not be used to process protected health information until a
            production deployment includes a compliance review, signed business associate agreements, encryption and access controls.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Questions</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Questions can be directed to {clinic.email}
            {demoMode ? " (used for this demonstration)." : "."}
          </p>
        </div>
      </div>
    </>
  )
}

export function TermsBody() {
  const { clinic, demoMode } = useClinic()
  const sections = demoMode
    ? [
        {
          title: "Demonstration only",
          body: [
            `This website demonstrates software. ${clinic.name}, sample team members, testimonials and dashboard figures exist to show how the platform works.`,
            "Nothing here creates a patient relationship unless a real clinic is operating this site in production.",
          ],
        },
        {
          title: "Not medical advice",
          body: [
            `The online assistant provides general information about ${clinic.name}. It does not diagnose conditions, recommend treatment or provide medical advice.`,
            "If you have a medical emergency, call your local emergency number or go to the nearest hospital.",
          ],
        },
        {
          title: "Appointments in demo mode",
          body: [
            "Bookings may be stored as demo records. A real calendar appointment is only created when the practice turns off demo mode and connects scheduling.",
          ],
        },
      ]
    : [
        {
          title: "Using this website",
          body: [
            `This website is operated by ${clinic.name}. By booking or chatting you agree that information you submit may be used to schedule and communicate about your visit.`,
          ],
        },
        {
          title: "Not medical advice",
          body: [
            `The online assistant provides general information about ${clinic.name}. It does not diagnose conditions, recommend treatment or provide medical advice. Always consult a licensed dentist or physician about your own health.`,
            "If you have a medical emergency, call your local emergency number or go to the nearest hospital.",
          ],
        },
        {
          title: "Appointments",
          body: [
            "Bookings made on this site create a request with the practice. You will receive confirmation by email or text when those channels are connected.",
          ],
        },
      ]
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <div key={s.title}>
          <h2 className="text-xl font-semibold text-ink">{s.title}</h2>
          {s.body.map((p) => (
            <p key={p} className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
