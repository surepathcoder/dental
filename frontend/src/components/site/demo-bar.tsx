"use client"

import Link from "next/link"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { LayoutDashboard, Play, Square } from "lucide-react"

import { useChat } from "@/components/chat/chat-provider"
import { useClinic } from "@/components/site/clinic-provider"

const noSubscribe = () => () => {}
const readTour = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("tour") === "1" || params.get("demo") === "1"
}

export function DemoBar() {
  const { runDemo, demo, stopDemo } = useChat()
  const { demoMode } = useClinic()
  const autoStarted = useRef(false)
  // Visitors see a normal clinic website. The bar is for showing the product to a clinic owner: open /?tour=1
  // (or /?demo=1, which also starts the guided demo).
  const tour = useSyncExternalStore(noSubscribe, readTour, () => false)

  useEffect(() => {
    if (!demoMode) return
    const params = new URLSearchParams(window.location.search)
    if (autoStarted.current) return
    if (params.get("demo") === "1") {
      autoStarted.current = true
      window.history.replaceState(null, "", window.location.pathname + "?tour=1") // keeps the bar after the demo starts
      setTimeout(runDemo, 600)
    }
  }, [runDemo, demoMode])

  if (!demoMode || !tour) return null

  return (
    <div className="demo-bar bg-ink text-white">
      <div className="container-page flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-xs">
        <p className="flex items-center gap-2">
          <span className="rounded-full border border-white/30 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white/90">LIVE DEMO</span>
          <span className="hidden text-white/75 sm:inline">A fictional practice. A working online assistant.</span>
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
          <Link href="/admin/login" className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-white/85 hover:bg-white/10 hover:text-white sm:inline-flex">
            <LayoutDashboard className="size-3.5" /> Clinic dashboard
          </Link>
          <Link href="/solutions/dental" className="inline-flex rounded-md px-2 py-1 text-white/85 hover:bg-white/10 hover:text-white">
            For clinic owners →
          </Link>
        </div>
      </div>
    </div>
  )
}
