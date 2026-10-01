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
  if (d.length === 11 && d.startsWith("1")) return `tel:+${d}`
  if (d.length === 10) return `tel:+1${d}`
  return phone ? `tel:${phone}` : fallbackClinic.phoneHref
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
      city: "Austin",
      state: "TX",
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
    phone: info.phone,
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

const ClinicContext = createContext<{
  clinic: LiveClinic
  demoMode: boolean
  status: SystemStatus | null
}>({ clinic: fromInfo(null), demoMode: true, status: null })

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const clinicQuery = useApi<ClinicInfo>("/clinic")
  const statusQuery = useApi<SystemStatus>("/status")
  const value = useMemo(
    () => ({
      clinic: fromInfo(clinicQuery.data),
      demoMode: statusQuery.data?.demo_mode !== false,
      status: statusQuery.data,
    }),
    [clinicQuery.data, statusQuery.data],
  )
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

export function useClinic() {
  return useContext(ClinicContext)
}

const MARKETING_SLUGS = new Set<string>(fallbackServices.map((s) => s.slug))

export function serviceHref(slug: string) {
  return MARKETING_SLUGS.has(slug) ? `/services/${slug}` : `/book?service=${encodeURIComponent(slug)}`
}

export function applyBrandColor(hex: string) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return
  const root = document.documentElement
  root.style.setProperty("--primary", hex)
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
