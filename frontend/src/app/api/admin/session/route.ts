import { type NextRequest, NextResponse } from "next/server"

import {
  ADMIN_COOKIE,
  adminPasswordConfigured,
  parseRole,
  passwordMatches,
  sessionRole,
  sessionToken,
} from "@/lib/admin-auth"

// Naive per-instance throttle for login attempts.
const attempts = new Map<string, { count: number; first: number }>()

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
    const now = Date.now()
    const entry = attempts.get(ip)
    if (entry && now - entry.first < 60_000 && entry.count >= 8) {
      return NextResponse.json({ detail: "Too many attempts. Try again in a minute." }, { status: 429 })
    }
    if (!entry || now - entry.first >= 60_000) attempts.set(ip, { count: 1, first: now })
    else entry.count++

    let password = ""
    let roleRaw: unknown = "owner"
    try {
      const body = (await req.json()) as { password?: unknown; role?: unknown }
      password = String(body.password ?? "").slice(0, 200)
      roleRaw = body.role
    } catch {
      return NextResponse.json({ detail: "Invalid request" }, { status: 400 })
    }
    const role = parseRole(roleRaw)
    if (adminPasswordConfigured() && !(await passwordMatches(password))) {
      return NextResponse.json({ detail: "Incorrect password" }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true, role, open: !adminPasswordConfigured() })
    res.cookies.set(ADMIN_COOKIE, await sessionToken(role), cookieOptions())
    return res
  } catch {
    return NextResponse.json({ detail: "Could not create session" }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}

export async function GET(req: NextRequest) {
  const role = await sessionRole(req.cookies.get(ADMIN_COOKIE)?.value)
  return NextResponse.json({
    protected: adminPasswordConfigured(),
    role: role ?? null,
    authenticated: role !== null,
  })
}
