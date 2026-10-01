"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { KeyRound, Loader2, ShieldCheck, Stethoscope, Users } from "lucide-react"

import { ToothMark } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import type { ClinicInfo } from "@/lib/types"

type Role = "owner" | "front_desk"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<Role | false>(false)
  const [open, setOpen] = useState<boolean | null>(null)
  const [practice, setPractice] = useState("Clinic")

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d: { protected: boolean }) => setOpen(!d.protected))
      .catch(() => setOpen(null))
    api<ClinicInfo>("/clinic")
      .then((c) => setPractice(c.name.replace(/\s+Dental$/i, "") || "Clinic"))
      .catch(() => undefined)
  }, [])

  const signIn = async (role: Role) => {
    setBusy(role)
    setError(null)
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { detail?: string }
        throw new Error(body.detail ?? "Login failed")
      }
      const next = new URLSearchParams(window.location.search).get("next")
      const dest = next?.startsWith("/admin") ? next : "/admin"
      window.location.href = role === "front_desk" && dest.startsWith("/admin/settings") ? "/admin" : dest
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    void signIn("owner")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ToothMark className="size-8" />
          <span className="text-sm leading-tight font-semibold text-ink">
            {practice}
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Clinic dashboard</span>
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-ink">Staff sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {open === true
            ? "Pick a role. Front desk runs the chair list without seeing API keys."
            : "Enter the dashboard password, then choose owner or front desk."}
        </p>

        {open === true ? (
          <div className="mt-6 grid gap-3">
            <Button className="h-11 w-full rounded-full" disabled={Boolean(busy)} onClick={() => void signIn("owner")}>
              {busy === "owner" ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Continue as owner
            </Button>
            <Button variant="outline" className="h-11 w-full rounded-full" disabled={Boolean(busy)} onClick={() => void signIn("front_desk")}>
              {busy === "front_desk" ? <Loader2 className="animate-spin" /> : <Users />} Continue as front desk
            </Button>
            <p className="text-xs text-muted-foreground">
              Owner: API keys, clinic profile, demo reset. Front desk: leads, chats, appointments.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" maxLength={200} required />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="h-11 w-full rounded-full" disabled={Boolean(busy)}>
              {busy === "owner" ? <Loader2 className="animate-spin" /> : <KeyRound />} Sign in as owner
            </Button>
            <Button type="button" variant="outline" className="h-11 w-full rounded-full" disabled={Boolean(busy) || !password} onClick={() => void signIn("front_desk")}>
              {busy === "front_desk" ? <Loader2 className="animate-spin" /> : <Stethoscope />} Sign in as front desk
            </Button>
          </form>
        )}

        {open === true && error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Back to the patient website
          </Link>
        </p>
      </div>
    </div>
  )
}
