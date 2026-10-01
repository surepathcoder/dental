"use client"

import posthog from "posthog-js"

let initialized = false

/** Initializes PostHog only when NEXT_PUBLIC_POSTHOG_KEY is configured. */
export function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (initialized || !key || typeof window === "undefined") return
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: "history_change",
    person_profiles: "identified_only",
    // Never record typed chat content or form fields.
    mask_all_text: false,
    session_recording: { maskAllInputs: true },
  })
  initialized = true
}

/** Fire-and-forget product analytics event. No PII should be passed here. */
export function track(event: string, props: Record<string, string | number | boolean | null | undefined> = {}) {
  if (!initialized) return
  posthog.capture(event, props)
}

export const analyticsEnabled = () => Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
