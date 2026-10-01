const TZ = "America/Chicago"

export function fmtDateTime(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...opts,
  }).format(new Date(iso))
}

export function fmtDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric", ...opts }).format(new Date(iso))
}

export function fmtTime(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso))
}

export function localDayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso))
}

export function telHref(phone: string | null | undefined) {
  const d = (phone || "").replace(/\D/g, "")
  if (!d) return ""
  if (d.length === 11 && d.startsWith("1")) return `tel:+${d}`
  if (d.length === 10) return `tel:+1${d}`
  return `tel:${phone}`
}

export function smsHref(phone: string | null | undefined) {
  const tel = telHref(phone)
  return tel ? tel.replace(/^tel:/, "sms:") : ""
}

export function timeAgo(iso: string | null | undefined, now: number = Date.now()) {
  if (!iso) return "—"
  const diff = new Date(iso).getTime() - now
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ]
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return diff > 0 ? "in a moment" : "just now"
}

export function fmtNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

export function initials(name: string | null | undefined) {
  if (!name) return "?"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export const SOURCE_LABELS: Record<string, string> = {
  ai_chat: "AI Receptionist",
  booking_form: "Booking form",
  contact_form: "Contact form",
  phone: "Phone",
  manual: "Front desk",
}
