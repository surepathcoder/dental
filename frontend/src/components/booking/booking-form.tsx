"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, CalendarCheck2, CalendarDays, Check, Loader2, ShieldAlert, Stethoscope, UserRound } from "lucide-react"

import { AutomationTimeline } from "@/components/chat/automation-timeline"
import { useChat } from "@/components/chat/chat-provider"
import { useClinic } from "@/components/site/clinic-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { track } from "@/lib/analytics"
import { api, ApiError } from "@/lib/api"
import { fmtDate, fmtTime } from "@/lib/format"
import type { FlowEvent, Slot } from "@/lib/types"
import { cn } from "@/lib/utils"

interface Availability {
  service: string
  timezone: string
  scheduler: string
  demo: boolean
  slots: Slot[]
}

interface BookingResult {
  appointment: { id: number; patient_name: string; service: string; provider_name: string | null; start_at: string; status: string }
  lead_id: number
  events: FlowEvent[]
  demo: boolean
}

const STEPS = ["Service", "Time", "Your details"]

export function BookingForm({ defaultService }: { defaultService?: string }) {
  const { openWith } = useChat()
  const { clinic, demoMode } = useClinic()
  const catalog = clinic.activeServices
  const insurers = [...clinic.insurance, "Other insurance", "No insurance (self-pay)", "Not sure"]
  const [step, setStep] = useState(0)
  const [service, setService] = useState(() => catalog.find((s) => s.slug === defaultService)?.name ?? "")
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotError, setSlotError] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", patient_type: "new", insurance: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BookingResult | null>(null)

  const loadSlots = useCallback(async (svc: string) => {
    setLoadingSlots(true)
    setSlotError(null)
    try {
      const data = await api<Availability>(`/appointments/availability?service=${encodeURIComponent(svc)}&limit=18`)
      setSlots(data.slots)
      if (!data.slots.length) setSlotError("No online openings in the next three weeks — please call us and we'll find a time.")
    } catch (e) {
      setSlotError((e as ApiError).message)
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (step !== 1 || !service) return
    let active = true
    queueMicrotask(() => {
      if (active) void loadSlots(service)
    })
    return () => {
      active = false
    }
  }, [step, service, loadSlots])

  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>()
    for (const s of slots) map.set(s.date_label, [...(map.get(s.date_label) ?? []), s])
    return [...map.entries()]
  }, [slots])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slot) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await api<BookingResult>("/appointments", {
        method: "POST",
        json: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          service,
          slot_id: slot.id,
          patient_type: form.patient_type,
          insurance: form.insurance || null,
          notes: form.notes.trim() || null,
          source: "booking_form",
        },
      })
      setResult(res)
      track("appointment_booked", { service, channel: "booking_form" })
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message)
      if (apiErr.status === 409) {
        setStep(1)
        setSlot(null)
        void loadSlots(service)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-primary/25 bg-card">
          <div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
            <CalendarCheck2 className="size-6" />
            <div>
              <p className="text-lg font-semibold">Appointment Confirmed</p>
              <p className="text-sm text-primary-foreground/80">We&apos;ve saved your spot{result.demo ? " (demo booking)" : ""}.</p>
            </div>
          </div>
          <dl className="grid gap-3 p-6 sm:grid-cols-2">
            {[
              ["Patient", result.appointment.patient_name],
              ["Service", result.appointment.service],
              ["Date", fmtDate(result.appointment.start_at, { weekday: "long", month: "long", day: "numeric" })],
              ["Time", `${fmtTime(result.appointment.start_at)}`],
              ["Dentist", result.appointment.provider_name ?? "Our team"],
              ["Clinic", `${clinic.name}, ${clinic.address}`],
              ["Phone", clinic.phone],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{k}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t p-6">
            <p className="mb-4 text-sm font-semibold text-ink">What happens next — automatically</p>
            <AutomationTimeline events={result.events} />
          </div>
          <div className="flex flex-wrap gap-3 border-t px-6 py-4">
            <Button asChild variant="outline" size="sm">
              <Link href={`/intake?appointment_id=${result.appointment.id}`}>Complete intake form</Link>
            </Button>
          </div>
          {demoMode && result.demo && (
            <p className="border-t bg-amber-50 px-6 py-3 text-xs font-medium text-amber-900">
              {result.events.some((e) => e.key === "email" && e.status === "completed")
                ? "Demo booking — no real calendar appointment was created. A confirmation email was sent."
                : "Demo booking — no real appointment was created and no email or SMS was actually sent."}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="h-11 flex-1 rounded-full">
            <Link href="/">Back to homepage</Link>
          </Button>
          <Button asChild className="h-11 flex-1 rounded-full">
            <Link href={`/admin/leads/${result.lead_id}`}>See this lead in the clinic dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-6 flex items-center gap-2 rounded-2xl border bg-white p-4 text-sm" aria-label="Booking progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("text-xs font-medium", i === step ? "text-ink" : "text-muted-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
          </li>
        ))}
      </ol>

      <div className="rounded-[1.35rem] border bg-card p-5 sm:p-7">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold text-ink">What do you need?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick the visit that fits best — we&apos;ll confirm details at your appointment.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {catalog.map((s) => (
                <button
                  key={s.slug || s.name}
                  type="button"
                  onClick={() => {
                    setService(s.name)
                    setSlot(null)
                    setStep(1)
                  }}
                  aria-pressed={service === s.name}
                  className={cn(
                    "rounded-2xl border bg-white p-5 text-left transition hover:border-primary hover:bg-secondary/40 hover:shadow-sm",
                    service === s.name && "border-primary bg-secondary/40",
                  )}
                >
                  <span className="font-medium text-ink">{s.name}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{s.short}</span>
                  <span className="mt-2 block text-xs font-medium text-primary">{s.duration}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Stethoscope className="size-4 text-primary" /> Not sure?{" "}
              <button type="button" className="font-semibold text-primary underline underline-offset-4" onClick={() => openWith("I'm not sure which appointment I need")}>
                Ask our AI receptionist
              </button>
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">Choose a time</h2>
                <p className="mt-1 text-sm text-muted-foreground">{service} · times shown in Central Time</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                Change service
              </Button>
            </div>
            {loadingSlots && (
              <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Checking live availability…
              </p>
            )}
            {slotError && (
              <p className="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {slotError}
              </p>
            )}
            <div className="mt-6 space-y-5">
              {grouped.map(([day, daySlots]) => (
                <div key={day}>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                    <CalendarDays className="size-4 text-primary" /> {day}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {daySlots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSlot(s)
                          setStep(2)
                        }}
                        className={cn(
                          "rounded-lg border px-2 py-2.5 text-sm font-medium text-ink transition hover:border-primary hover:bg-primary hover:text-primary-foreground",
                          slot?.id === s.id && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {s.time_label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && slot && (
          <form onSubmit={submit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">Your details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service} · {slot.label} · {slot.provider}
                </p>
              </div>
              <Button variant="ghost" size="sm" type="button" onClick={() => setStep(1)}>
                Change time
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="b-name">Full name</Label>
                <Input id="b-name" required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Miller" className="h-11" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="b-phone">Mobile number</Label>
                <Input id="b-phone" required inputMode="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(512) 555-0187" className="h-11" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="b-email">Email</Label>
                <Input id="b-email" required type="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="h-11" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="b-type">Patient type</Label>
                <Select value={form.patient_type} onValueChange={(v) => setForm({ ...form, patient_type: v })}>
                  <SelectTrigger id="b-type" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New patient</SelectItem>
                    <SelectItem value="existing">Existing patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="b-ins">Insurance</Label>
                <Select value={form.insurance} onValueChange={(v) => setForm({ ...form, insurance: v })}>
                  <SelectTrigger id="b-ins" className="h-11 w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {insurers.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="b-notes">Anything we should know? (optional)</Label>
                <Textarea id="b-notes" maxLength={1000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. sensitive teeth, running late risk, questions for the dentist" rows={3} />
              </div>
            </div>
            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
              </p>
            )}
            {demoMode && (
            <p className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
              <ShieldAlert className="mt-px size-3.5 shrink-0" /> Demo only — please don&apos;t enter real patient information. No real appointment is created.
            </p>
            )}
            <Button type="submit" size="lg" className="mt-5 h-12 w-full rounded-full text-base" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" /> : <UserRound />} Confirm appointment
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
