"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { useClinic } from "@/components/site/clinic-provider"

/** Progressive enhancement: content stays visible without JavaScript. */
export function PageMotion() {
  const pathname = usePathname()
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const root = document.querySelector(".marketing-shell")
    if (!root) return
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
    const images = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"))
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.visible = "true"
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    )
    const updateImages = () => {
      frame = 0
      if (media.matches || window.innerWidth < 768) return
      images.forEach((element) => {
        const bounds = element.parentElement?.getBoundingClientRect()
        if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) return
        const offset = Math.max(-20, Math.min(20, (bounds.top + bounds.height / 2 - window.innerHeight / 2) * 0.045))
        element.style.setProperty("--parallax-y", `${offset}px`)
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateImages)
    }
    const configure = () => {
      observer.disconnect()
      elements.forEach((element) => {
        if (media.matches || element.getBoundingClientRect().top < window.innerHeight) element.dataset.visible = "true"
        else {
          element.dataset.visible = "false"
          observer.observe(element)
        }
      })
      if (media.matches) images.forEach((element) => element.style.removeProperty("--parallax-y"))
      else onScroll()
    }
    configure()
    media.addEventListener("change", configure)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      media.removeEventListener("change", configure)
      elements.forEach((element) => {
        delete element.dataset.visible
      })
      images.forEach((element) => element.style.removeProperty("--parallax-y"))
    }
  }, [pathname])
  return null
}

/** Runs once on entry; no endless animation competing with the page. */
export function ConversationPreview() {
  const { clinic } = useClinic()
  const short = clinic.name.replace(/\s+(dental( clinic| centre| center)?|clinic)$/i, "").trim() || clinic.name
  return (
    <div className="conversation-demo" data-reveal aria-label="Illustrative online assistant conversation">
      <div className="conversation-heading">
        <span className="conversation-avatar">
          {short.charAt(0).toUpperCase()}<span />
        </span>
        <div>
          <strong>{short} reception</strong>
          <span>Automated assistant · conversation preview</span>
        </div>
        <span className="conversation-time">Now</span>
      </div>
      <div className="conversation-messages">
        <p className="conversation-bubble patient">Hi, can I book a checkup?</p>
        <p className="conversation-bubble assistant">Of course. Let’s find a time that works for you. Morning or afternoon?</p>
        <p className="conversation-bubble patient last">A morning would be great.</p>
        <div className="conversation-note">
          <span className="conversation-dot" /> From a first question to a next step.
        </div>
      </div>
      <p className="conversation-footnote">Try a real conversation using the button beside this preview.</p>
    </div>
  )
}
