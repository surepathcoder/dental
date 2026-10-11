"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Send, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { track } from "@/lib/analytics"
import { api, type ApiError } from "@/lib/api"
import { useClinic, usePhoneStyle } from "@/components/site/clinic-provider"

export function ContactForm() {
  const { clinic, demoMode } = useClinic()
  const { samplePhone } = usePhoneStyle()
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" })
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    setError(null)
    try {
      await api("/leads", {
        method: "POST",
        json: {
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          service: form.service || null,
          message: form.message.trim() || null,
          source: "contact_form",
        },
      })
      setState("done")
      track("contact_form_submitted", { service: form.service || null })
    } catch (err) {
      setError((err as ApiError).message)
      setState("idle")
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-primary/25 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-ink">Thanks, {form.name.split(" ")[0]}!</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your message reached our front desk and was added to the clinic dashboard as a new lead. We reply during office hours.
        </p>
        {demoMode && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900">Demo submission — no message was actually sent unless email is connected.</p>}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink">Send us a message</h2>
      <p className="mt-1 text-sm text-muted-foreground">We reply to messages during office hours. For anything urgent, please call.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="c-name">Your name</Label>
          <Input id="c-name" required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" placeholder="Jordan Miller" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" inputMode="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" placeholder={samplePhone} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" placeholder="you@example.com" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="c-service">What can we help with?</Label>
          <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
            <SelectTrigger id="c-service" className="h-11 w-full">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {clinic.activeServices.map((s) => (
                <SelectItem key={s.slug || s.name} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
              <SelectItem value="Billing & insurance">Billing &amp; insurance</SelectItem>
              <SelectItem value="Something else">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" maxLength={2000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Please provide a phone number or an email so we can reply.</p>
      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      )}
      {demoMode && (
      <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
        <ShieldAlert className="mt-px size-3.5 shrink-0" /> Demo only — do not enter real patient information or protected health information.
      </p>
      )}
      <Button type="submit" size="lg" className="mt-5 h-12 w-full rounded-full text-base" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 className="animate-spin" /> : <Send />} Send message
      </Button>
    </form>
  )
}
