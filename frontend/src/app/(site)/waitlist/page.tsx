"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import { useClinic } from "@/components/site/clinic-provider"
import { PageHero } from "@/components/site/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api, type ApiError } from "@/lib/api"

export default function WaitlistPage() {
  const { clinic } = useClinic()
  const catalog = clinic.activeServices
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", notes: "" })
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)
  const serviceValue = form.service || catalog[0]?.name || ""

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    setError(null)
    try {
      await api("/waitlist", {
        method: "POST",
        json: {
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          service: form.service || catalog[0]?.name || null,
          notes: form.notes.trim() || null,
        },
      })
      setState("done")
    } catch (err) {
      setError((err as ApiError).message)
      setState("idle")
    }
  }

  return (
    <>
      <PageHero eyebrow="Waitlist" title="We'll text you when a time opens up." intro="If the slot you wanted is taken, join the waitlist. When a visit is cancelled, the next matching patient is notified automatically." />
      <section className="container-page max-w-xl py-16">
        {state === "done" ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-ink">You&apos;re on the list</h2>
            <p className="mt-2 text-sm text-muted-foreground">We&apos;ll reach out if an earlier {(form.service || catalog[0]?.name || "visit").toLowerCase()} opening appears.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="w-name">Name</Label>
                <Input id="w-name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w-phone">Phone</Label>
                <Input id="w-phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w-email">Email</Label>
                <Input id="w-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Service</Label>
                <Select value={serviceValue} onValueChange={(v) => setForm({ ...form, service: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.map((s) => (
                      <SelectItem key={s.slug || s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w-notes">Notes (optional)</Label>
                <Textarea id="w-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <Button type="submit" className="mt-5" disabled={state === "sending"}>
              {state === "sending" ? <Loader2 className="animate-spin" /> : null}
              Join the waitlist
            </Button>
          </form>
        )}
      </section>
    </>
  )
}
