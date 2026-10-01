// Shared by proxy.ts and route handlers (Web Crypto works in both runtimes).
// If ADMIN_PASSWORD is unset the admin dashboard is open — intended for DEMO_MODE only.
// Cookie is `role.hmac` so the same login can be owner (API keys) or front_desk (desk only).

import type { AdminRole } from "@/lib/admin-types"

export const ADMIN_COOKIE = "bs_admin"

export type { AdminRole }

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function parseRole(raw: unknown): AdminRole {
  return raw === "front_desk" ? "front_desk" : "owner"
}

const HMAC_KEY = Uint8Array.from([
  0x62, 0x73, 0x61, 0x64, 0x6d, 0x69, 0x6e, 0x73, 0x65, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x6b, 0x31,
  0x62, 0x72, 0x69, 0x67, 0x68, 0x74, 0x73, 0x6d, 0x69, 0x6c, 0x65, 0x2d, 0x76, 0x32, 0x6b, 0x32,
])

async function signHmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey("raw", HMAC_KEY, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const payload = `${secret}\n${message}`
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("")
}

function signingSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "open").trim() || "open"
}

export async function sessionToken(role: AdminRole = "owner"): Promise<string> {
  const sig = await signHmacHex(signingSecret(), `brightsmile-admin:${role}:${process.env.ADMIN_PASSWORD ?? ""}`)
  return `${role}.${sig}`
}

async function legacySessionToken(): Promise<string> {
  return signHmacHex(signingSecret(), `brightsmile-admin:${process.env.ADMIN_PASSWORD ?? ""}`)
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function sessionRole(cookieValue: string | undefined): Promise<AdminRole | null> {
  if (!cookieValue) return null
  const dot = cookieValue.indexOf(".")
  if (dot > 0) {
    const role = cookieValue.slice(0, dot)
    if (role === "owner" || role === "front_desk") {
      const expected = await sessionToken(role)
      if (safeEqual(cookieValue, expected)) return role
    }
  }
  if (safeEqual(cookieValue, await legacySessionToken())) return "owner"
  return null
}

export async function isAdminRequest(cookieValue: string | undefined): Promise<boolean> {
  return (await sessionRole(cookieValue)) !== null
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  if (!expected) return true
  // Compare HMACs so timing doesn't leak the password length/content.
  const [a, b] = await Promise.all([signHmacHex("cmp", candidate), signHmacHex("cmp", expected)])
  return safeEqual(a, b)
}
