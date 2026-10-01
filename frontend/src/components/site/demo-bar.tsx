"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { LayoutDashboard, Play, Square } from "lucide-react"

import { useChat } from "@/components/chat/chat-provider"
import { useClinic } from "@/components/site/clinic-provider"

export function DemoBar() {
  const { runDemo, demo, stopDemo } = useChat()
  const { demoMode } = useClinic()
  const autoStarted = useRef(false)

  useEffect(() => {
    if (!demoMode) return
    if (autoStarted.current) return
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      autoStarted.current = true
      window.history.replaceState(null, "", window.location.pathname)
      setTimeout(runDemo, 600)
    }
  }, [runDemo, demoMode])

  if (!demoMode) return null

  return (
    <div className="bg-ink text-white">
      <div className="container-page flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-xs">
        <p className="flex items-center gap-2">
          <span className="rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-950">DEMO MODE</span>
          <span className="hidden text-white/75 sm:inline">Fictional clinic · portfolio demo of an AI receptionist &amp; patient automation platform</span>
        </p>
        <div className="flex items-center gap-1">
          {demo?.running ? (
            <button type="button" onClick={stopDemo} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold hover:bg-white/10">
              <Square className="size-3 fill-current" /> Stop demo
            </button>
          ) : (
            <button type="button" onClick={runDemo} className="inline-flex items-center gap-1.5 rounded-md bg-teal-400/20 px-2.5 py-1 font-semibold text-teal-100 hover:bg-teal-400/30">
              <Play className="size-3 fill-current" /> Run Demo
            </button>
          )}
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-white/85 hover:bg-white/10 hover:text-white">
            <LayoutDashboard className="size-3.5" /> Clinic dashboard
          </Link>
          <Link href="/solutions/dental" className="hidden rounded-md px-2 py-1 text-white/85 hover:bg-white/10 hover:text-white md:inline-flex">
            For dental clinics →
          </Link>
        </div>
      </div>
    </div>
  )
}
