import { type NextRequest, NextResponse } from "next/server"

import { ADMIN_COOKIE, isAdminRequest, sessionRole } from "@/lib/admin-auth"

/**
 * Server-side proxy to the FastAPI backend.
 *  - Keeps the backend URL and ADMIN_API_KEY on the server (never in the browser bundle).
 *  - Public endpoints are allow-listed; everything else requires an admin session.
 */
const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "")
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "demo-admin-key"

const PUBLIC_ROUTES: { method: string; pattern: RegExp }[] = [
  { method: "POST", pattern: /^chat$/ },
  { method: "POST", pattern: /^chat\/stream$/ },
  { method: "POST", pattern: /^chat\/[a-f0-9]{32}\/end$/ },
  { method: "GET", pattern: /^chat\/[a-f0-9]{32}\/updates$/ },
  { method: "GET", pattern: /^clinic$/ },
  { method: "GET", pattern: /^status$/ },
  { method: "GET", pattern: /^health$/ },
  { method: "GET", pattern: /^appointments\/availability$/ },
  { method: "POST", pattern: /^appointments$/ },
    { method: "POST", pattern: /^leads$/ },
  { method: "POST", pattern: /^waitlist$/ },
  { method: "GET", pattern: /^intake$/ },
  { method: "POST", pattern: /^intake$/ },
  { method: "POST", pattern: /^webhooks\/twilio\/sms$/ },
  { method: "POST", pattern: /^webhooks\/twilio\/voice$/ },
]

const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/

/** Keys, clinic profile writes, knowledge uploads, and demo reset stay with the owner. */
function ownerOnly(method: string, joined: string): boolean {
  if (joined === "integrations" || joined.startsWith("integrations/")) return true
  if (joined === "runtime") return true
  if (joined === "demo/reset" || joined.startsWith("demo/")) return true
  if (joined === "clinic" && method !== "GET") return true
  if (joined.startsWith("knowledge") && method !== "GET") return true
  return false
}

async function forward(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  if (!path.every((seg) => SAFE_SEGMENT.test(seg))) {
    return NextResponse.json({ detail: "Invalid path" }, { status: 400 })
  }
  const joined = path.join("/")
  const isPublic = PUBLIC_ROUTES.some((r) => r.method === req.method && r.pattern.test(joined))

  try {
    const isStream = joined === "chat/stream"
    const headers: Record<string, string> = { Accept: isStream ? "text/event-stream" : "application/json" }
    const contentType = req.headers.get("content-type")
    if (contentType) headers["Content-Type"] = contentType
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || ""
    if (ip) headers["X-Forwarded-For"] = ip

    if (!isPublic) {
      const cookie = req.cookies.get(ADMIN_COOKIE)?.value
      const authorized = await isAdminRequest(cookie)
      if (!authorized) return NextResponse.json({ detail: "Admin login required" }, { status: 401 })
      if (ownerOnly(req.method, joined) && (await sessionRole(cookie)) !== "owner") {
        return NextResponse.json({ detail: "Owner access required" }, { status: 403 })
      }
      headers["X-API-Key"] = ADMIN_API_KEY
    }

    const url = `${API_URL}/api/${joined}${req.nextUrl.search}`
    const isMultipart = Boolean(contentType?.includes("multipart/form-data"))
    let body: BodyInit | undefined
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (isMultipart) {
        body = Buffer.from(await req.arrayBuffer())
      } else {
        body = await req.text()
      }
    }
    const maxBytes = isMultipart ? 8_000_000 : 20_000
    const size = typeof body === "string" ? body.length : body ? (body as Buffer).byteLength : 0
    if (size > maxBytes) {
      return NextResponse.json({ detail: "Request too large" }, { status: 413 })
    }

    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(isStream ? 60_000 : 25_000),
    })
    const contentTypeOut = upstream.headers.get("content-type") ?? "application/json"
    if (contentTypeOut.includes("text/event-stream") && upstream.body) {
      return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
          "Content-Encoding": "identity",
        },
      })
    }
    const text = await upstream.text()
    const res = new NextResponse(text, { status: upstream.status })
    res.headers.set("Content-Type", contentTypeOut)
    const retry = upstream.headers.get("retry-after")
    if (retry) res.headers.set("Retry-After", retry)
    res.headers.set("Cache-Control", "no-store")
    return res
  } catch {
    return NextResponse.json(
      { detail: "The BrightSmile API is offline. Start the FastAPI backend (see README) and try again." },
      { status: 503 },
    )
  }
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const GET = forward
export const POST = forward
export const PATCH = forward
export const DELETE = forward
