"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, LayoutDashboard, LogOut, type LucideIcon, Menu, MessageSquareText, RefreshCw, Settings, Users, Workflow,
} from "lucide-react"
import { toast } from "sonner"

import { ToothMark } from "@/components/brand/logo"
import { applyBrandColor } from "@/components/site/clinic-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { api, useApi } from "@/lib/api"
import { AdminRoleContext } from "@/lib/admin-role"
import type { AdminRole } from "@/lib/admin-types"
import type { ClinicInfo, Conversation, Paginated, SystemStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const NAV: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/conversations", label: "AI Conversations", icon: MessageSquareText },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/waitlist", label: "Waitlist", icon: Bell },
  { href: "/admin/automations", label: "Automations", icon: Workflow },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function pingDesk() {
  try {
    const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    const ctx = new Ctor()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = 880
    gain.gain.value = 0.06
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.16)
    window.setTimeout(() => void ctx.close(), 400)
  } catch {
    /* autoplay or unsupported */
  }
}

function NavLinks({ onNavigate, waiting = 0, role }: { onNavigate?: () => void; waiting?: number; role: AdminRole }) {
  const pathname = usePathname()
  const items = role === "front_desk" ? NAV.filter((item) => item.href !== "/admin/settings") : NAV
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Admin">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const isChats = item.href === "/admin/conversations"
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
              active ? "bg-primary text-primary-foreground" : "text-ink/75 hover:bg-secondary hover:text-primary",
            )}
          >
            <item.icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {isChats && waiting > 0 && (
              <span className={cn("rounded-full px-1.5 text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-violet-600 text-white")}>{waiting}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarFooter() {
  const { data } = useApi<SystemStatus>("/status")
  return (
    <div className="space-y-3 border-t p-4 text-xs">
      <div className="rounded-lg bg-secondary/60 p-3">
        <p className="flex items-center gap-1.5 font-semibold text-ink">
          <Bot className="size-3.5 text-primary" /> AI receptionist
        </p>
        <p className="mt-1 text-muted-foreground">{data?.ai_provider ?? "…"}</p>
        <p className="mt-1.5 flex flex-wrap gap-1">
          <span className="rounded bg-card px-1.5 py-0.5 font-medium text-ink">Scheduler: {data?.scheduler ?? "…"}</span>
          <span className="rounded bg-card px-1.5 py-0.5 font-medium text-ink">SMS: {data?.sms ?? "…"}</span>
          <span className="rounded bg-card px-1.5 py-0.5 font-medium text-ink">Email: {data?.email ?? "…"}</span>
        </p>
      </div>
      <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
        <ArrowUpRight className="size-3.5" /> View patient website
      </Link>
    </div>
  )
}

export function AdminShell({ children, role }: { children: React.ReactNode; role: AdminRole }) {
  const [open, setOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const router = useRouter()
  const isOwner = role === "owner"
  const status = useApi<SystemStatus>("/status", { refreshMs: 5000 })
  const clinic = useApi<ClinicInfo>("/clinic")
  const inbox = useApi<Paginated<Conversation>>("/conversations?limit=1", { refreshMs: 8000 })
  const demoMode = status.data?.demo_mode !== false
  const practiceName = (clinic.data?.name || "Clinic").replace(/\s+Dental$/i, "")
  const brandColor = String((clinic.data?.settings?.brand as Record<string, unknown> | undefined)?.primary_color || "")
  const waiting = inbox.data?.status_counts?.WAITING_STAFF ?? 0
  const prevWaiting = useRef<number | null>(null)

  useEffect(() => {
    applyBrandColor(brandColor)
  }, [brandColor])

  useEffect(() => {
    if (waiting > 0) {
      document.title = `(${waiting}) Waiting · ${practiceName}`
    }
    if (prevWaiting.current !== null && waiting > prevWaiting.current) {
      pingDesk()
      toast.info("Someone is waiting for the front desk", {
        description: "Open AI Conversations to take over the chat.",
        action: {
          label: "Open",
          onClick: () => router.push("/admin/conversations"),
        },
      })
    }
    prevWaiting.current = waiting
  }, [waiting, practiceName, router])

  const resetDemo = async () => {
    if (resetting) return
    setResetting(true)
    try {
      await api("/demo/reset", { method: "POST" })
      toast.success("Demo data reset", { description: "The database was re-seeded with the standard demo dataset." })
      router.refresh()
    } catch (e) {
      toast.error("Couldn't reset demo data", { description: (e as Error).message })
    } finally {
      setResetting(false)
    }
  }

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" })
    router.replace("/")
    router.refresh()
  }

  return (
    <AdminRoleContext.Provider value={role}>
      <div className="flex min-h-dvh bg-muted/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b px-4">
          <ToothMark className="size-7" />
          <span className="text-sm leading-tight font-semibold text-ink">
            {practiceName}
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Clinic dashboard</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks waiting={waiting} role={role} />
        </div>
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="h-16 justify-center border-b px-4">
                <SheetTitle className="flex items-center gap-2.5 text-sm">
                  <ToothMark className="size-7" /> {practiceName} Admin
                </SheetTitle>
              </SheetHeader>
              <div className="p-3">
                <NavLinks onNavigate={() => setOpen(false)} waiting={waiting} role={role} />
              </div>
              <SidebarFooter />
            </SheetContent>
          </Sheet>

          {demoMode ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-900 uppercase">Demo mode</span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-800 uppercase">Live</span>
          )}
          <span className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
            isOwner ? "bg-secondary text-ink" : "bg-violet-100 text-violet-900",
          )}>
            {isOwner ? "Owner" : "Front desk"}
          </span>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {isOwner
              ? demoMode
                ? "Dashboard shows live activity only · demo reset available"
                : "Production settings · live patient data"
              : "Leads, chats and appointments — API keys stay with the owner"}
          </p>

          <div className="ml-auto flex items-center gap-2">
            {demoMode && isOwner && (
              <Button variant="outline" size="sm" onClick={resetDemo} disabled={resetting} className="hidden sm:inline-flex">
                <RefreshCw className={cn(resetting && "animate-spin")} /> Reset demo data
              </Button>
            )}
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/admin/login">Switch role</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out" title="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      </div>
    </AdminRoleContext.Provider>
  )
}
