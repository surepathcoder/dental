"use client"

import { createContext, useContext, useEffect, useMemo } from "react"

import { useApi } from "@/lib/api"
import { clinic as fallbackClinic, faqs as fallbackFaqs, services as fallbackServices } from "@/lib/site"
import type { ClinicInfo, SystemStatus } from "@/lib/types"

const DAY_LABELS: [string, string][] = [
  ["mon", "Monday"],
  ["tue", "Tuesday"],
  ["wed", "Wednesday"],
  ["thu", "Thursday"],
  ["fri", "Friday"],
  ["sat", "Saturday"],
  ["sun", "Sunday"],
]

export interface LiveClinic {
  name: string
  tagline: string
  phone: string
  phoneHref: string
  email: string
  address: string
  cityLine: string
  hours: { day: string; hours: string }[]
  insurance: string[]
  assistantName: string
  greeting: string
  city: string
  state: string
  faqs: { id?: number; question: string; answer: string }[]
  activeServices: { id?: number; slug: string; name: string; short: string; duration: string }[]
  primaryColor: string
  raw: ClinicInfo | null
}

function digits(phone: string) {
  return phone.replace(/\D/g, "")
}

function phoneHref(phone: string) {
  const d = digits(phone)
  if (phone.trim().startsWith("+")) return `tel:+${d}` // international already (+255 …): keep its country code
  if (d.length === 11 && d.startsWith("1")) return `tel:+${d}`
  if (d.length === 10 && !d.startsWith("0")) return `tel:+1${d}` // a US number; "0712 …" is a local one
  return phone ? `tel:${phone}` : "" // no number set: callers hide their Call links
}

/** "+255788479534" → "+255 788 479 534"; numbers already spaced, or not international, stay as written. */
function formatPhone(phone: string) {
  const t = phone.trim()
  if (!t.startsWith("+") || /\s/.test(t)) return t
  const d = digits(t)
  if (d.length === 11 && d.startsWith("1")) return `+1 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
  if (d.length === 12) return `+${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
  return t
}

function formatClock(value: string) {
  const [hRaw, mRaw] = value.split(":")
  const h = Number(hRaw)
  const m = Number(mRaw)
  if (Number.isNaN(h) || Number.isNaN(m)) return value
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = ((h + 11) % 12) + 1
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

function hoursList(hours: ClinicInfo["hours"] | undefined): { day: string; hours: string }[] {
  if (!hours) return fallbackClinic.hours
  return DAY_LABELS.map(([key, label]) => {
    const span = hours[key]
    return { day: label, hours: span ? `${formatClock(span.open)} – ${formatClock(span.close)}` : "Closed" }
  })
}

function fromInfo(info: ClinicInfo | null): LiveClinic {
  if (!info) {
    return {
      name: fallbackClinic.name,
      tagline: fallbackClinic.tagline,
      phone: fallbackClinic.phone,
      phoneHref: fallbackClinic.phoneHref,
      email: fallbackClinic.email,
      address: fallbackClinic.address,
      cityLine: fallbackClinic.cityLine,
      hours: fallbackClinic.hours,
      insurance: fallbackClinic.insurance,
      assistantName: "Ava",
      greeting: fallbackClinic.tagline,
      city: "",
      state: "",
      faqs: fallbackFaqs.map((f) => ({ question: f.q, answer: f.a })),
      activeServices: fallbackServices.map((s) => ({ slug: s.slug, name: s.name, short: s.short, duration: s.duration })),
      primaryColor: "#0f6b70",
      raw: null,
    }
  }
  const assistant = (info.settings?.assistant ?? {}) as Record<string, unknown>
  const brand = (info.settings?.brand ?? {}) as Record<string, unknown>
  const color = String(brand.primary_color || "#0f6b70")
  const liveServices = (info.services ?? []).filter((s) => s.is_active)
  return {
    name: info.name,
    tagline: info.tagline || fallbackClinic.tagline,
    phone: formatPhone(info.phone),
    phoneHref: phoneHref(info.phone),
    email: info.email,
    address: info.address_line,
    cityLine: `${info.city}, ${info.state} ${info.zip_code}`.trim(),
    hours: hoursList(info.hours),
    insurance: info.insurance_accepted?.length ? info.insurance_accepted : fallbackClinic.insurance,
    assistantName: String(assistant.name || "Ava"),
    greeting: String(assistant.greeting || ""),
    city: info.city,
    state: info.state,
    faqs: (info.faqs ?? []).map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
    activeServices: liveServices.length
      ? liveServices.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          short: s.short_description,
          duration: `About ${s.duration_minutes} minutes`,
        }))
      : fallbackServices.map((s) => ({ slug: s.slug, name: s.name, short: s.short, duration: s.duration })),
    primaryColor: /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#0f6b70",
    raw: info,
  }
}

/** A demo made for one prospect (/d/<token>): who it's for, who made it, and what we really know. */
export interface ProspectDemo {
  token: string
  prepared_for: string
  prepared_by: string
  country: string
  language: string
  website: string
  hours_known: boolean
  expires_at: string
}

const ClinicContext = createContext<{
  clinic: LiveClinic
  demoMode: boolean
  status: SystemStatus | null
  prospect: ProspectDemo | null
  loaded: boolean
  missing: boolean
}>({ clinic: fromInfo(null), demoMode: true, status: null, prospect: null, loaded: false, missing: false })

export function ClinicProvider({ children, demoToken }: { children: React.ReactNode; demoToken?: string }) {
  // A prospect's demo reads its own clinic; the practice site reads the practice.
  const clinicQuery = useApi<ClinicInfo>(demoToken ? null : "/clinic")
  const demoQuery = useApi<{ clinic: ClinicInfo; demo: Omit<ProspectDemo, "token"> }>(
    demoToken ? `/demo-links/${encodeURIComponent(demoToken)}` : null,
  )
  const statusQuery = useApi<SystemStatus>("/status")
  const value = useMemo(
    () => ({
      clinic: fromInfo(demoToken ? (demoQuery.data?.clinic ?? null) : clinicQuery.data),
      demoMode: demoToken ? false : statusQuery.data?.demo_mode !== false,
      status: statusQuery.data,
      prospect: demoToken && demoQuery.data ? { ...demoQuery.data.demo, token: demoToken } : null,
      loaded: demoToken ? Boolean(demoQuery.data || demoQuery.error) : Boolean(clinicQuery.data || clinicQuery.error),
      missing: Boolean(demoToken && demoQuery.error),
    }),
    [clinicQuery.data, clinicQuery.error, demoQuery.data, demoQuery.error, statusQuery.data, demoToken],
  )
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

export function useClinic() {
  return useContext(ClinicContext)
}

const MARKETING_SLUGS = new Set<string>(fallbackServices.map((s) => s.slug))

/** A clinic outside the US (a prospect's preview abroad, or the sample site set to Dar es Salaam) takes local numbers. */
export function usePhoneStyle() {
  const { prospect, clinic } = useClinic()
  const abroad = prospect
    ? !["", "United States", "US", "USA"].includes(prospect.country)
    : !(clinic.raw?.timezone || "America/").startsWith("America/")
  return { abroad, samplePhone: abroad ? "0712 345 678" : "(512) 555-0187" }
}

export function serviceHref(slug: string) {
  return MARKETING_SLUGS.has(slug) ? `/services/${slug}` : `/book?service=${encodeURIComponent(slug)}`
}

export function applyBrandColor(hex: string) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return
  const root = document.documentElement
  root.style.setProperty("--primary", hex)
  root.style.setProperty("--marketing-primary", hex)
  root.style.setProperty("--ring", hex)
  root.style.setProperty("--sidebar-primary", hex)
}

export function BrandTheme() {
  const { clinic } = useClinic()
  useEffect(() => {
    applyBrandColor(clinic.primaryColor)
  }, [clinic.primaryColor])
  return null
}
