"use client"

import { useMemo, useState } from "react"
import { CalendarCheck2, CalendarClock, Info, MapPin, Phone, ShieldCheck, Stethoscope, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BookedAppointment, ChatUI, Slot } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useClinic } from "@/components/site/clinic-provider"

export function SlotPicker({
  slots,
  demoNote,
  disabled,
  highlight,
  onSelect,
}: {
  slots: Slot[]
  demoNote?: string | null
  disabled?: boolean
  highlight?: string | null
  onSelect: (slot: Slot) => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>()
    for (const s of slots) map.set(s.date_label, [...(map.get(s.date_label) ?? []), s])
    return [...map.entries()]
  }, [slots])

  return (
    <div className="mt-2 space-y-2.5 rounded-xl border bg-card p-3">
      {grouped.map(([day, daySlots]) => (
        <div key={day}>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
            <CalendarClock className="size-3.5 text-primary" /> {day}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {daySlots.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium text-ink transition hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  highlight === s.id && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/25",
                )}
              >
                {s.time_label}
              </button>
            ))}
          </div>
        </div>
      ))}
      {slots[0]?.provider && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Stethoscope className="size-3" /> With {slots[0].provider}
        </p>
      )}
      {demoNote && (
        <p className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-[11px] font-medium text-amber-800">
          <Info className="mt-px size-3 shrink-0" /> {demoNote}
        </p>
      )}
    </div>
  )
}

const PHONE_OK = (v: string) => v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length === 10
const EMAIL_OK = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export function ContactCard({
  ui,
  disabled,
  highlight,
  onSubmit,
}: {
  ui: ChatUI
  disabled?: boolean
  highlight?: boolean
  onSubmit: (v: { name: string; phone?: string; email?: string }) => void
}) {
  const [name, setName] = useState(ui.prefill?.name ?? "")
  const [phone, setPhone] = useState(ui.prefill?.phone ?? "")
  const [email, setEmail] = useState(ui.prefill?.email ?? "")
  const [error, setError] = useState<string | null>(null)
  const { prospect } = useClinic()
  // A demo for a clinic abroad: their numbers and names, not Texas ones.
  const abroad = Boolean(prospect && !["", "United States", "US", "USA"].includes(prospect.country))
  const samplePhone = abroad ? "0712 345 678" : "(512) 555-0187"
  const sampleName = abroad ? "Amina Juma" : "Jordan Miller"
  const phoneValid = (v: string) => (abroad ? /^\+?[\d\s().-]{9,20}$/.test(v) && v.replace(/\D/g, "").length >= 9 : PHONE_OK(v))
  const followUpMode = Boolean(ui.optional?.length)
  const phoneFirst = Boolean(ui.phone_first) || (ui.missing?.length === 1 && ui.missing[0] === "phone")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneFirst && name.trim().length < 2) return setError("Please enter a name.")
    if (phone && !phoneValid(phone)) return setError(abroad ? "Please enter a valid phone number." : "Please enter a valid 10-digit US phone number.")
    if (email && !EMAIL_OK(email)) return setError("Please enter a valid email address.")
    if (phoneFirst && !phone) return setError("Please add a mobile number so we can reach you.")
    if (!phoneFirst && !followUpMode && (!phone || !email)) return setError("Please add both a phone number and an email.")
    if (!phoneFirst && followUpMode && !phone && !email) return setError("Please add a phone number or email.")
    setError(null)
    onSubmit({ name: name.trim(), phone: phone || undefined, email: email || undefined })
  }

  return (
    <form
      onSubmit={submit}
      className={cn("mt-2 space-y-2 rounded-xl border bg-card p-3 transition", highlight && "ring-4 ring-primary/25")}
      aria-label="Contact details"
    >
      {phoneFirst ? (
        <div className="grid gap-1">
          <Label htmlFor="cc-phone" className="text-[11px] text-muted-foreground">
            Mobile number
          </Label>
          <Input id="cc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={samplePhone} inputMode="tel" autoComplete="off" className="h-9" disabled={disabled} maxLength={20} autoFocus={!disabled} />
        </div>
      ) : (
        <div className="grid gap-1">
          <Label htmlFor="cc-name" className="text-[11px] text-muted-foreground">
            Full name
          </Label>
          <Input id="cc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={sampleName} autoComplete="off" className="h-9" disabled={disabled} maxLength={120} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {!phoneFirst && (
          <div className="grid gap-1">
            <Label htmlFor="cc-phone" className="text-[11px] text-muted-foreground">
              Mobile
            </Label>
            <Input id="cc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={samplePhone} inputMode="tel" autoComplete="off" className="h-9" disabled={disabled} maxLength={20} />
          </div>
        )}
        {phoneFirst && (
          <div className="grid gap-1">
            <Label htmlFor="cc-name" className="text-[11px] text-muted-foreground">
              Name (optional)
            </Label>
            <Input id="cc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={sampleName} autoComplete="off" className="h-9" disabled={disabled} maxLength={120} />
          </div>
        )}
        <div className="grid gap-1">
          <Label htmlFor="cc-email" className="text-[11px] text-muted-foreground">
            Email{followUpMode || phoneFirst ? " (optional)" : ""}
          </Label>
          <Input id="cc-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" inputMode="email" autoComplete="off" className="h-9" disabled={disabled} maxLength={160} />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      <Button type="submit" className="h-9 w-full" disabled={disabled}>
        {ui.submit_label ?? "Continue"}
      </Button>
      <p className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
        <ShieldCheck className="mt-px size-3 shrink-0" /> {ui.note ?? "Demo only — do not enter real patient information."}
      </p>
    </form>
  )
}

export function ConfirmationCard({ appt }: { appt: BookedAppointment }) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-primary/25 bg-card">
      <div className="flex items-center gap-2 bg-primary px-3 py-2 text-primary-foreground">
        <CalendarCheck2 className="size-4" />
        <span className="text-sm font-semibold">Appointment Confirmed</span>
        {appt.demo && <span className="ml-auto rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Demo</span>}
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 p-3 text-xs">
        <dt className="flex items-center gap-1 text-muted-foreground">
          <UserRound className="size-3" /> Patient
        </dt>
        <dd className="font-medium text-ink">{appt.patient_name}</dd>
        <dt className="text-muted-foreground">Service</dt>
        <dd className="font-medium text-ink">{appt.service}</dd>
        <dt className="text-muted-foreground">Date</dt>
        <dd className="font-medium text-ink">{appt.date}</dd>
        <dt className="text-muted-foreground">Time</dt>
        <dd className="font-medium text-ink">
          {appt.time} <span className="font-normal text-muted-foreground">(Central)</span>
        </dd>
        <dt className="text-muted-foreground">Dentist</dt>
        <dd className="font-medium text-ink">{appt.provider}</dd>
        <dt className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3" /> Clinic
        </dt>
        <dd className="text-ink">
          {appt.clinic}
          <span className="block text-muted-foreground">{appt.address}</span>
        </dd>
        <dt className="flex items-center gap-1 text-muted-foreground">
          <Phone className="size-3" /> Phone
        </dt>
        <dd className="text-ink">{appt.phone}</dd>
      </dl>
      {appt.demo && (
        <p className="border-t bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-800">Demo booking — no real appointment was created.</p>
      )}
    </div>
  )
}
