import { type NextRequest, NextResponse } from "next/server"

import { ADMIN_COOKIE, isAdminRequest, sessionRole } from "@/lib/admin-auth"

// Optimistic guard for the admin UI. The real authorization check happens in
// /api/backend (which attaches the API key only for valid admin sessions).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/admin/login") return NextResponse.next()
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value
  if (!(await isAdminRequest(cookie))) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith("/admin/settings") && (await sessionRole(cookie)) === "front_desk") {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    url.search = ""
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
