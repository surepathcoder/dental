"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { track } from "@/lib/analytics"

export function SalesInquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === "sending") return
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "").trim()
    const practice = String(form.get("practice") || "").trim()
    if (name.length < 2 || practice.length < 2) {
      setError("Please enter your name and practice name (at least two characters each).")
      return
    }
    setError(null)
    setState("sending")
    try {
      await api("/leads", {
        method: "POST",
        json: {
          name,
          email: String(form.get("email") || "").trim(),
          source: "contact_form",
          service: "AI receptionist — business inquiry",
          message: `Business inquiry from the platform sales page.\nPractice: ${practice}\nInterested in: ${form.get("package")}\n${String(form.get("message") || "").trim()}`,
        },
      })
      setState("done")
      track("sales_inquiry_submitted", { package: String(form.get("package") || "") })
    } catch {
      setError("We couldn’t save your request. Please try again in a moment; your details are still in the form.")
      setState("idle")
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-3xl border bg-white p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h3 className="font-display mt-5 text-3xl text-ink">Your request is saved.</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Your practice details and interests have been added to the dashboard for review. This form does not send an email or reserve a
          meeting time.
        </p>
        <Button type="button" variant="outline" className="mt-6 rounded-full" onClick={() => setState("idle")}>
          Send another inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border bg-white p-6 shadow-[0_12px_40px_#203e3205] sm:p-8">
      <h3 className="text-lg font-semibold text-ink">Let’s find your fit.</h3>
      <p className="mt-2 text-sm text-muted-foreground">A few details to get the conversation started.</p>
      <fieldset disabled={state === "sending"} className="mt-7 space-y-5 disabled:opacity-70">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="sales-name">Your name</Label>
            <Input
              id="sales-name"
              name="name"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              placeholder="Full name"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sales-practice">Practice name</Label>
            <Input
              id="sales-practice"
              name="practice"
              required
              minLength={2}
              maxLength={160}
              autoComplete="organization"
              placeholder="Your dental practice"
              className="h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sales-email">Work email</Label>
          <Input
            id="sales-email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="you@yourpractice.com"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sales-package">What are you looking for?</Label>
          <select
            id="sales-package"
            name="package"
            className="h-12 w-full rounded-xl border border-input bg-transparent px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
            defaultValue="Help choosing the right setup"
          >
            <option>Help choosing the right setup</option>
            <option>Starter — receptionist for my website</option>
            <option>Professional — the full workflow</option>
            <option>A new website + AI receptionist</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sales-message">
            Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="sales-message"
            name="message"
            rows={3}
            maxLength={1400}
            placeholder="Tell us about your website or what you’d like to improve."
            className="rounded-xl"
          />
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <Button type="submit" disabled={state === "sending"} className="mt-6 h-12 w-full rounded-full">
        {state === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving your request…
          </>
        ) : (
          <>
            Request a conversation <ArrowUpRight className="size-4" />
          </>
        )}
      </Button>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        Saved as a business inquiry in the clinic dashboard. No payment or commitment. Please use sample details in this demo.
      </p>
    </form>
  )
}
