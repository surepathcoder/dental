import type { Metadata } from "next"
import { cookies } from "next/headers"

import { AdminShell } from "@/components/admin/admin-shell"
import { ADMIN_COOKIE, sessionRole } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: { default: "Clinic Dashboard", template: "%s · Clinic Admin" },
  description: "Leads, AI conversations, appointments and automations.",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = (await sessionRole((await cookies()).get(ADMIN_COOKIE)?.value)) ?? "owner"
  return <AdminShell role={role}>{children}</AdminShell>
}
