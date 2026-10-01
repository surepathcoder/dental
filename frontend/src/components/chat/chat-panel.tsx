"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowUp, Bot, LayoutDashboard, Loader2, RotateCcw, ShieldAlert, Sparkles, Workflow, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { AutomationTimeline } from "./automation-timeline"
import { type ChatMessage, DEMO_STEPS, useChat } from "./chat-provider"
import { ConfirmationCard, ContactCard, SlotPicker } from "./chat-widgets"
import { useClinic } from "@/components/site/clinic-provider"

function Avatar({ small = false }: { small?: boolean }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-white shadow-sm", small ? "size-7" : "size-9")}>
      <Sparkles className={small ? "size-3.5" : "size-4"} />
    </span>
  )
}

function TypingIndicator() {
  const { clinic } = useClinic()
  return (
    <div className="flex items-end gap-2">
      <Avatar small />
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3" aria-label={`${clinic.assistantName} is typing`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ msg, isLatest }: { msg: ChatMessage; isLatest: boolean }) {
  const { act, busy, send, highlight } = useChat()
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground">{msg.text}</p>
      </div>
    )
  }
  const r = msg.response
  const interactive = isLatest && !busy
  return (
    <div className="flex items-start gap-2">
      <Avatar small />
      <div className="min-w-0 max-w-[88%] flex-1">
        <p
          className={cn(
            "inline-block rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
            msg.error ? "bg-red-50 text-red-700" : "bg-muted text-ink",
          )}
        >
          {msg.text}
        </p>
        {msg.source === "staff" && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">Front desk</p>
        )}
        {r?.sources && r.sources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {r.sources.map((s) => (
              <span key={s.title} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                Source: {s.title}
              </span>
            ))}
          </div>
        )}
        {r?.ui?.type === "slots" && r.slots.length > 0 && (
          <SlotPicker slots={r.slots} demoNote={r.ui.demo_note} disabled={!interactive} highlight={highlight} onSelect={(s) => void act({ type: "select_slot", slot_id: s.id }, `I'll take ${s.label}`)} />
        )}
        {r?.ui?.type === "contact_form" && isLatest && (
          <ContactCard ui={r.ui} disabled={!interactive} highlight={highlight === "contact"} onSubmit={(v) => void act({ type: "submit_contact", ...v })} />
        )}
        {r?.appointment && <ConfirmationCard appt={r.appointment} />}
        {r && r.events.length > 0 && (
          <div className="mt-2 rounded-xl border bg-card p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Workflow className="size-3.5 text-primary" /> Automation triggered
            </p>
            <AutomationTimeline events={r.events} animate={isLatest} compact />
          </div>
        )}
        {isLatest && r && r.quick_replies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {r.quick_replies.map((q) => (
              <button
                key={q}
                type="button"
                disabled={!interactive}
                onClick={() => void send(q)}
                className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DemoProgress() {
  const { demo, stopDemo } = useChat()
  if (!demo || (!demo.running && !demo.detail?.startsWith("Demo stopped"))) return null
  const pct = Math.round((demo.step / demo.total) * 100)
  return (
    <div className="border-b bg-ink px-4 py-2.5 text-white">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
        <span>
          Live demo · Step {demo.step} of {demo.total}
        </span>
        <button type="button" onClick={stopDemo} className="rounded px-1.5 py-0.5 text-white/80 hover:bg-white/10">
          Stop
        </button>
      </div>
      <p className="mt-0.5 text-sm font-semibold">{demo.title}</p>
      {demo.detail && <p className="mt-0.5 text-xs text-white/75">{demo.detail}</p>}
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-teal-300 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function DemoSummary() {
  const { demo, dismissDemo, setOpen } = useChat()
  const open = Boolean(demo?.finished)
  return (
    <Dialog open={open} onOpenChange={(o) => !o && dismissDemo()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Demo complete: visitor → booked, moved, handed off</DialogTitle>
          <DialogDescription>
            Everything you just watched ran through the real API: grounded answers, deterministic booking, reschedule, and a live staff takeover queue. Messages were simulated because DEMO_MODE is on.
          </DialogDescription>
        </DialogHeader>
        <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
          {DEMO_STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
              <span className="text-ink">{s}</span>
            </li>
          ))}
        </ol>
        {demo?.events && demo.events.length > 0 && (
          <div className="rounded-xl border p-4">
            <p className="mb-3 text-sm font-semibold text-ink">Automations triggered for {demo.appointment?.patient_name}</p>
            <AutomationTimeline events={demo.events} animate={false} />
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1" onClick={() => setOpen(false)}>
            <Link href={demo?.leadId ? `/admin/leads/${demo.leadId}` : "/admin/leads"}>
              <LayoutDashboard /> View lead in dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            <Link href="/admin/automations">
              <Workflow /> Open Automation Center
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ChatPanel({ variant = "widget" }: { variant?: "widget" | "embed" }) {
  const { open, setOpen, messages, busy, draft, setDraft, send, restart, demo, openWith } = useChat()
  const { clinic, demoMode } = useClinic()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const embed = variant === "embed"
  const panelOpen = embed || open

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, busy])

  useEffect(() => {
    if (embed) return
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen, embed])

  const demoRunning = Boolean(demo?.running)
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!busy && !demoRunning) void send(draft)
  }

  return (
    <>
      {!embed && (
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="ai-receptionist"
        className={cn(
          "fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-full bg-primary py-2 pr-4 pl-2 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition hover:bg-primary/90 sm:right-6 sm:bottom-6",
          open && "max-sm:hidden",
          !open && messages.length === 0 && "pulse-ring",
        )}
      >
        <span className="grid size-9 place-items-center rounded-full bg-white/15">{open ? <X className="size-4" /> : <Bot className="size-5" />}</span>
        <span>{open ? "Close" : "Ask our AI Receptionist"}</span>
      </button>
      )}

      <section
        id="ai-receptionist"
        aria-label="AI receptionist chat"
        className={cn(
          "flex flex-col overflow-hidden bg-background",
          embed
            ? "fixed inset-0 z-50"
            : cn(
                "fixed z-50 shadow-2xl transition-all duration-300",
                "inset-0 sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[410px] sm:rounded-2xl sm:border",
                panelOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
              ),
        )}
        aria-hidden={!panelOpen}
      >
        <header className="flex items-center gap-3 bg-gradient-to-r from-primary to-teal-700 px-4 py-3 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-white/15">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{clinic.assistantName} · AI Receptionist</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className={cn("size-1.5 rounded-full", messages.some((m) => m.response?.waiting_staff) ? "bg-violet-300" : "bg-emerald-300")} />
              {messages.some((m) => m.response?.waiting_staff) ? "Waiting for front desk" : `${clinic.name} · replies instantly`}
            </p>
          </div>
          {demoMode && <span className="rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">Demo</span>}
          <button type="button" onClick={restart} disabled={demoRunning} className="rounded-md p-1.5 text-white/80 hover:bg-white/10 disabled:opacity-40" aria-label="Start a new conversation" title="New conversation">
            <RotateCcw className="size-4" />
          </button>
          {!embed && (
            <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-white/80 hover:bg-white/10" aria-label="Close chat">
              <X className="size-5" />
            </button>
          )}
        </header>
        {demoMode && <DemoProgress />}
        {demoMode && (
        <p className="flex items-center gap-1.5 border-b bg-amber-50 px-4 py-1.5 text-[11px] font-medium text-amber-900">
          <ShieldAlert className="size-3.5 shrink-0" /> Demo only — do not enter real patient information.
        </p>
        )}

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Avatar small />
                <p className="rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-ink">
                  {clinic.greeting || `Hi! I'm ${clinic.assistantName}, ${clinic.name}'s AI receptionist. I can answer questions about services, insurance and hours — or book your visit in about a minute.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-9">
                {["Book an appointment", "Do you accept Delta Dental?", "Do you offer Invisalign?", "What are your hours?", "I have a dental emergency"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="pl-9 text-[11px] leading-snug text-muted-foreground">
                {clinic.assistantName} gives general information only and can&apos;t provide medical advice. In a medical emergency call 911.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={m.id} msg={m} isLatest={i === messages.length - 1} />
          ))}
          {busy && <TypingIndicator />}
        </div>

        <form onSubmit={submit} className="border-t bg-card p-3">
          <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-1.5 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder={demoRunning ? "Demo in progress…" : "Type your message…"}
              aria-label="Message"
              readOnly={demoRunning}
              className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
            />
            <Button type="submit" size="icon" className="mb-0.5 rounded-lg" disabled={!draft.trim() || busy || demoRunning} aria-label="Send message">
              {busy ? <Loader2 className="animate-spin" /> : <ArrowUp />}
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            AI assistant · general information only · <button type="button" className="underline underline-offset-2" onClick={() => openWith("I'd like to speak to a person")}>talk to a person</button>
          </p>
        </form>
      </section>
      {!embed && <DemoSummary />}
    </>
  )
}
