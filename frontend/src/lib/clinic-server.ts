import type { ClinicInfo } from "@/lib/types"

export async function fetchClinic(): Promise<ClinicInfo | null> {
  const base = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "")
  try {
    const res = await fetch(`${base}/api/clinic`, { cache: "no-store" })
    if (!res.ok) return null
    return (await res.json()) as ClinicInfo
  } catch {
    return null
  }
}
