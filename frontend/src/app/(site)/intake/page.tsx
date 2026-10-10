"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import { PageHero } from "@/components/site/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api, useApi, type ApiError } from "@/lib/api"
import type { IntakePreview } from "@/lib/types"

function IntakeForm() {
  const params = useSearchParams()
  const appointmentId = Number(params.get("appointment_id") || 0)
  const preview = useApi<IntakePreview>(appointmentId ? `/intake?appointment_id=${appointmentId}` : null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "", medications: "", allergies: "", insurance: "" })
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    setError(null)
    try {
      await api("/intake", {
        method: "POST",
        json: {
          appointment_id: appointmentId,
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          reason: form.reason.trim() || null,
          medications: form.medications.trim() || null,
          allergies: form.allergies.trim() || null,
          insurance: form.insurance.trim() || null,
        },
      })
      setState("done")
    } catch (err) {
      setError((err as ApiError).message)
      setState("idle")
    }
  }

  if (!appointmentId) {
    return (
      <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Open this page from the link in your confirmation email so we can match the form to your visit.
      </p>
    )
  }

  if (preview.loading && !preview.data) {
    return <p className="text-sm text-muted-foreground">Loading your visit…</p>
  }
  if (preview.error) {
    return <p className="text-sm text-red-600">{preview.error.message}</p>
  }
  if (preview.data?.already_submitted || state === "done") {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-ink">Intake received</h2>
        <p className="mt-2 text-sm text-muted-foreground">You&apos;re all set for {preview.data?.service}. See you {preview.data?.date_label}.</p>
      </div>
    )
  }

  const visit = preview.data

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-6 sm:p-8">
      {visit && (
        <p className="mb-5 text-sm text-muted-foreground">
          Hi {visit.patient_first_name} — this is for your {visit.service} visit on {visit.date_label} at {visit.time_label} at {visit.clinic_name}.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="i-name">Full name</Label>
          <Input id="i-name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="i-phone">Phone</Label>
          <Input id="i-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="i-email">Email</Label>
          <Input id="i-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="i-reason">Reason for visit</Label>
          <Textarea id="i-reason" rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="i-meds">Current medications</Label>
          <Input id="i-meds" value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="i-all">Allergies</Label>
          <Input id="i-all" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="i-ins">Dental insurance</Label>
          <Input id="i-ins" value={form.insurance} onChange={(e) => setForm({ ...form, insurance: e.target.value })} />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button type="submit" className="mt-5" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 className="animate-spin" /> : null}
        Submit intake
      </Button>
    </form>
  )
}

export default function IntakePage() {
  return (
    <>
      <PageHero eyebrow="Intake" title="Complete your forms before you arrive." intro="Takes about two minutes. Your dentist still confirms everything in the chair — this just saves time at the front desk." />
      <section className="container-page max-w-xl py-16">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <IntakeForm />
        </Suspense>
      </section>
    </>
  )
}
