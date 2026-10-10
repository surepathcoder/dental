"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { api, API_BASE, ApiError } from "@/lib/api"
import { track } from "@/lib/analytics"
import type { ChatAction, ChatResponse } from "@/lib/types"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  response?: ChatResponse
  error?: boolean
  source?: "ai" | "staff" | "queued"
}

export interface DemoState {
  running: boolean
  step: number
  total: number
  title: string
  detail?: string
  finished: boolean
  leadId?: number | null
  appointment?: ChatResponse["appointment"]
  events?: ChatResponse["events"]
}

interface ChatContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  openWith: (message?: string) => void
  messages: ChatMessage[]
  busy: boolean
  draft: string
  setDraft: (v: string) => void
  send: (text: string) => Promise<ChatResponse | null>
  act: (action: ChatAction, label?: string) => Promise<ChatResponse | null>
  restart: () => void
  demo: DemoState | null
  runDemo: () => void
  stopDemo: () => void
  dismissDemo: () => void
  highlight: string | null
}

const ChatContext = createContext<ChatContextValue | null>(null)

const STORAGE_KEY = "brightsmile-chat-v2"
const LEGACY_STORAGE_KEY = "brightsmile-chat-v1"
const SESSION_TTL_MS = 60 * 60 * 1000
const uid = () => Math.random().toString(36).slice(2, 10)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type SavedChat = { id: string | null; messages: ChatMessage[]; stage: string; savedAt: number }

function clearLegacyChat() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

function readSavedChat(): SavedChat | null {
  try {
    clearLegacyChat()
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as SavedChat
    if (!saved?.savedAt || Date.now() - saved.savedAt > SESSION_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return saved
  } catch {
    return null
  }
}

export const DEMO_STEPS = [
  "Visitor opens the Invisalign page",
  "AI already knows the page and answers from the knowledge base",
  "Visitor books a complimentary consult",
  "AI collects patient information",
  "Available appointments appear",
  "Visitor selects an appointment",
  "Appointment is created and confirmed",
  "Lead appears in the clinic dashboard",
  "Visitor asks to move the visit",
  "AI reschedules from the same chat",
  "Visitor asks to talk to a person",
  "Front desk can take over live from the dashboard",
]

class DemoCancelled extends Error {}

function consumeSseBlock(block: string, onEvent: (event: string, parsed: { delta?: string } & Partial<ChatResponse>) => void) {
  let event = "message"
  let data = ""
  for (const raw of block.split(/\r?\n/)) {
    const line = raw.replace(/\r$/, "")
    if (line.startsWith("event:")) event = line.slice(6).trim()
    else if (line.startsWith("data:")) data += (data ? "\n" : "") + line.slice(5).trimStart()
  }
  if (!data) return
  try {
    onEvent(event, JSON.parse(data) as { delta?: string } & Partial<ChatResponse>)
  } catch {
    /* ignore partial JSON */
  }
}

async function readChatStream(payload: Record<string, unknown>, onDelta: (text: string) => void): Promise<ChatResponse> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Can't reach the server. Please check your connection.", 0)
  }
  const ctype = res.headers.get("content-type") || ""
  if (!res.ok || !res.body || !ctype.includes("text/event-stream")) {
    throw new ApiError(res.status === 429 ? "Too many requests — please wait a moment." : `Request failed (${res.status || 502})`, res.status)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let donePayload: ChatResponse | null = null
  let streamed = ""
  const apply = (event: string, parsed: { delta?: string } & Partial<ChatResponse>) => {
    if (event === "done") {
      donePayload = parsed as ChatResponse
      return
    }
    if (parsed.delta) {
      streamed += parsed.delta
      onDelta(streamed)
    }
  }
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const blocks = buffer.split(/\r?\n\r?\n/)
    buffer = blocks.pop() ?? ""
    for (const block of blocks) consumeSseBlock(block, apply)
    if (done) break
  }
  if (buffer.trim()) consumeSseBlock(buffer, apply)
  if (!donePayload) {
    const err = new ApiError("The assistant reply was interrupted.", 502) as ApiError & { streamed: boolean }
    err.streamed = Boolean(streamed)
    throw err
  }
  return donePayload
}

function embedParentPage(): string | null {
  if (typeof window === "undefined") return null
  const raw = new URLSearchParams(window.location.search).get("page")
  if (!raw) return null
  const path = raw.startsWith("/") ? raw : `/${raw}`
  return path.slice(0, 180)
}

export function ChatProvider({ children, demoLink }: { children: React.ReactNode; demoLink?: string }) {
  const [open, setOpenState] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState("")
  const [demo, setDemo] = useState<DemoState | null>(null)
  const [highlight, setHighlight] = useState<string | null>(null)
  const [liveStaff, setLiveStaff] = useState(false)
  const conversationId = useRef<string | null>(null)
  const lastStage = useRef<string>("start")
  const lastMessageId = useRef(0)
  const waitingStaff = useRef(false)
  const demoPage = useRef<string | null>(null)
  const demoToken = useRef(0)
  const restored = useRef(false)

  // Restore this browser-tab session after a reload (expires after SESSION_TTL_MS of inactivity)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const saved = readSavedChat()
    if (saved) {
      conversationId.current = saved.id
      lastStage.current = saved.stage
      setMessages(saved.messages.slice(-40))
    }
  }, [])

  useEffect(() => {
    if (!restored.current) return
    try {
      if (!conversationId.current && messages.length === 0) {
        sessionStorage.removeItem(STORAGE_KEY)
        clearLegacyChat()
        return
      }
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: conversationId.current,
          messages: messages.slice(-40),
          stage: lastStage.current,
          savedAt: Date.now(),
        }),
      )
      clearLegacyChat()
    } catch {
      /* ignore */
    }
  }, [messages])

  useEffect(() => {
    const onHide = () => {
      const id = conversationId.current
      if (!id || ["start", "booked", "followup_scheduled"].includes(lastStage.current)) return
      navigator.sendBeacon?.(`${API_BASE}/chat/${id}/end`)
    }
    window.addEventListener("pagehide", onHide)
    return () => window.removeEventListener("pagehide", onHide)
  }, [])

  useEffect(() => {
    if (!liveStaff || !conversationId.current) return
    const tick = async () => {
      const id = conversationId.current
      if (!id || !waitingStaff.current) return
      try {
        const data = await api<{
          waiting_staff: boolean
          last_id: number
          messages: { id: number; role: string; content: string; source?: string | null }[]
        }>(`/chat/${id}/updates?after_id=${lastMessageId.current}`)
        waitingStaff.current = data.waiting_staff
        setLiveStaff(data.waiting_staff)
        if (data.last_id) lastMessageId.current = data.last_id
        const incoming = data.messages.filter((m) => m.role === "assistant" && m.source === "staff")
        if (incoming.length) {
          setMessages((prev) => {
            const seen = new Set(prev.map((p) => p.text))
            const extra: ChatMessage[] = incoming
              .filter((m) => !seen.has(m.content))
              .map((m) => ({ id: `staff-${m.id}`, role: "assistant", text: m.content, source: "staff" }))
            return extra.length ? [...prev, ...extra] : prev
          })
        }
      } catch {
        /* poll is best-effort */
      }
    }
    const timer = setInterval(() => void tick(), 3000)
    return () => clearInterval(timer)
  }, [liveStaff])

  const request = useCallback(async (payload: { message?: string; action?: ChatAction }, userText: string) => {
    const assistantId = uid()
    const ensureBubble = (text: string, response?: ChatResponse, error?: boolean) => {
      setMessages((m) => {
        if (m.some((msg) => msg.id === assistantId)) {
          return m.map((msg) => (msg.id === assistantId ? { ...msg, text, response, error, source: response?.waiting_staff ? "queued" : "ai" } : msg))
        }
        return [...m, { id: assistantId, role: "assistant", text, response, error, source: response?.waiting_staff ? "queued" : "ai" }]
      })
    }
    setMessages((m) => [...m, { id: uid(), role: "user", text: userText }])
    setBusy(true)
    const body = {
      conversation_id: conversationId.current,
      message: payload.message ?? "",
      action: payload.action ?? null,
      page: demoPage.current || embedParentPage() || (typeof window !== "undefined" ? window.location.pathname : "/"),
      // A prospect's demo link: the assistant answers as their clinic.
      ...(demoLink ? { demo: demoLink } : {}),
    }
    const apply = (res: ChatResponse) => {
      const priorId = conversationId.current
      const rolled = Boolean(res.new_session && priorId && priorId !== res.conversation_id)
      conversationId.current = res.conversation_id
      lastStage.current = res.stage
      lastMessageId.current = res.last_message_id ?? (rolled ? 0 : lastMessageId.current)
      waitingStaff.current = Boolean(res.waiting_staff)
      setLiveStaff(Boolean(res.waiting_staff))
      const source = res.waiting_staff ? "queued" : "ai"
      if (rolled) {
        setMessages([
          { id: uid(), role: "user", text: userText },
          { id: assistantId, role: "assistant", text: res.reply, response: res, source },
        ])
      } else {
        ensureBubble(res.reply, res)
      }
      if (res.appointment) track("appointment_booked", { service: res.appointment.service, channel: "ai_chat" })
      if (res.stage === "followup_scheduled") track("followup_scheduled", { service: res.lead?.service ?? null })
    }
    let streamedAny = false
    try {
      const res = await readChatStream(body, (text) => {
        streamedAny = true
        ensureBubble(text)
      })
      apply(res)
      return res
    } catch {
      if (streamedAny) return null
      try {
        const res = await api<ChatResponse>("/chat", { method: "POST", json: body })
        apply(res)
        return res
      } catch (e) {
        ensureBubble((e as Error).message, undefined, true)
        return null
      }
    } finally {
      setBusy(false)
    }
  }, [])

  const send = useCallback(
    async (text: string) => {
      const t = text.trim()
      if (!t) return null
      setDraft("")
      return request({ message: t }, t)
    },
    [request],
  )

  const act = useCallback(
    (action: ChatAction, label?: string) => {
      const text =
        label ??
        (action.type === "submit_contact" ? `My details: ${[action.name, action.phone, action.email].filter(Boolean).join(" · ")}` : "Continue")
      return request({ action }, text)
    },
    [request],
  )

  const setOpen = useCallback((value: boolean) => {
    setOpenState(value)
    if (value) track("chat_opened")
  }, [])

  const openWith = useCallback(
    (message?: string) => {
      setOpen(true)
      if (message) setTimeout(() => void send(message), 250)
    },
    [send, setOpen],
  )

  const restart = useCallback(() => {
    const id = conversationId.current
    if (id && !["start", "booked", "followup_scheduled"].includes(lastStage.current)) {
      void fetch(`${API_BASE}/chat/${id}/end`, { method: "POST" }).catch(() => undefined)
    }
    conversationId.current = null
    lastStage.current = "start"
    lastMessageId.current = 0
    waitingStaff.current = false
    setLiveStaff(false)
    demoPage.current = null
    setMessages([])
    setDraft("")
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  // ── Scripted product demo (uses the real API end-to-end) ──────────────────
  const runDemo = useCallback(() => {
    const token = ++demoToken.current
    const check = () => {
      if (demoToken.current !== token) throw new DemoCancelled()
    }
    const stepTo = (step: number, detail?: string, extra: Partial<DemoState> = {}) => {
      check()
      setDemo((d) => ({ ...(d ?? { running: true, total: DEMO_STEPS.length, finished: false }), running: true, step, title: DEMO_STEPS[step - 1], detail, ...extra }) as DemoState)
    }
    const typeAndSend = async (text: string) => {
      for (let i = 1; i <= text.length; i++) {
        check()
        setDraft(text.slice(0, i))
        await sleep(22)
      }
      await sleep(300)
      check()
      const res = await send(text)
      if (!res) throw new Error("Chat request failed")
      await sleep(1100)
      return res
    }

    track("demo_started")
    void (async () => {
      try {
        conversationId.current = null
        lastStage.current = "start"
        lastMessageId.current = 0
        waitingStaff.current = false
        setLiveStaff(false)
        demoPage.current = "/services/invisalign"
        setMessages([])
        stepTo(1, "A prospective patient is on the Invisalign page after hours.")
        window.scrollTo({ top: 0, behavior: "smooth" })
        await sleep(1600)
        setOpenState(true)
        stepTo(2, "Ava already knows they were looking at Invisalign and answers from the clinic knowledge base.")
        await sleep(900)
        await typeAndSend("Hi! Do you offer Invisalign?")
        await sleep(1800)
        stepTo(3, "The visitor books a complimentary consult — no invented slots or prices.")
        await typeAndSend("Yes, let's book")
        stepTo(4, "Lead qualification: patient type, contact details, insurance and timing.")
        await typeAndSend("I'm a new patient")
        check()
        await sleep(700)
        setHighlight("contact")
        await sleep(1400)
        setHighlight(null)
        const contact = await act({ type: "submit_contact", name: "Jordan Miller", phone: "(512) 555-0187", email: "jordan.miller@example.com" })
        if (!contact) throw new Error("Chat request failed")
        await sleep(1000)
        await typeAndSend("Delta Dental")
        await typeAndSend("Within the next 2 weeks")
        stepTo(5, "Real-time availability (mock scheduler in demo mode, Cal.com in production).")
        const slotsRes = await typeAndSend("Next week, mornings please")
        const slot = slotsRes.slots[0]
        if (!slot) throw new Error("No slots available")
        await sleep(1000)
        stepTo(6, `The visitor picks ${slot.label}.`)
        setHighlight(slot.id)
        await sleep(1400)
        setHighlight(null)
        const booked = await act({ type: "select_slot", slot_id: slot.id }, `I'll take ${slot.label}`)
        if (!booked?.appointment) throw new Error("Booking failed")
        stepTo(7, "Booked, confirmed, and reminders scheduled — all from chat.", { appointment: booked.appointment, leadId: booked.lead?.id, events: booked.events })
        await sleep(2200)
        stepTo(8, "Jordan now shows as a HOT booked lead in the clinic dashboard.")
        await sleep(1800)
        stepTo(9, "Plans change — they ask to move the visit.")
        const moved = await typeAndSend("I need to reschedule")
        await sleep(900)
        stepTo(10, "Ava finds the visit and offers new times. Same deterministic scheduler — still no invented slots.")
        const nextSlot = moved.slots?.[0] ?? (await typeAndSend("Earliest available")).slots?.[0]
        if (nextSlot) {
          await act({ type: "select_slot", slot_id: nextSlot.id }, `I'll take ${nextSlot.label}`)
        }
        await sleep(1400)
        stepTo(11, "They want a person. The bot parks and flags the front desk.")
        await typeAndSend("I'd like to speak to a person")
        await sleep(1600)
        stepTo(12, "Open AI Conversations in the dashboard — staff can reply live, then hand the chat back to Ava.")
        await sleep(2400)
        check()
        demoPage.current = null
        setDemo((d) => (d ? { ...d, running: false, finished: true } : d))
        track("demo_completed")
      } catch (e) {
        demoPage.current = null
        if (e instanceof DemoCancelled) return
        setDemo((d) => (d ? { ...d, running: false, finished: false, detail: `Demo stopped: ${(e as Error).message}` } : d))
      }
    })()
  }, [act, send])

  const stopDemo = useCallback(() => {
    demoToken.current++
    setDemo(null)
    setDraft("")
    setHighlight(null)
  }, [])

  const dismissDemo = useCallback(() => setDemo(null), [])

  const value = useMemo<ChatContextValue>(
    () => ({ open, setOpen, openWith, messages, busy, draft, setDraft, send, act, restart, demo, runDemo, stopDemo, dismissDemo, highlight }),
    [open, setOpen, openWith, messages, busy, draft, send, act, restart, demo, runDemo, stopDemo, dismissDemo, highlight],
  )
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>")
  return ctx
}
