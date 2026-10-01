"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Browser → Next.js route handler (/api/backend/*) → FastAPI.
 * The route handler attaches the admin API key server-side, so no secret is
 * ever shipped to the browser.
 */
export const API_BASE = "/api/backend"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

function extractDetail(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const detail = (body as { detail?: unknown }).detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { msg?: string; loc?: unknown[] }
    const field = Array.isArray(first.loc) ? String(first.loc[first.loc.length - 1]) : ""
    const msg = (first.msg ?? "Invalid input").replace(/^Value error, /, "")
    return field && field !== "body" ? `${field.replace(/_/g, " ")}: ${msg}` : msg
  }
  return null
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Can't reach the server. Please check your connection.", 0)
  }
  const text = await res.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = null
  }
  if (!res.ok) {
    const msg =
      extractDetail(body) ??
      (res.status === 429
        ? "Too many requests — please wait a moment."
        : res.status === 502 || res.status === 503
          ? "The API server is offline. Start the FastAPI backend (see README)."
          : `Request failed (${res.status})`)
    throw new ApiError(msg, res.status)
  }
  return body as T
}

/** Minimal data hook with optional polling (no external dependency). */
export function useApi<T>(path: string | null, opts: { refreshMs?: number } = {}) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(Boolean(path))
  const mounted = useRef(true)

  const load = useCallback(
    async (silent = false) => {
      if (!path) return
      if (!silent) setLoading(true)
      try {
        const result = await api<T>(path)
        if (mounted.current) {
          setData(result)
          setError(null)
        }
      } catch (e) {
        if (mounted.current) setError(e as ApiError)
      } finally {
        if (mounted.current) setLoading(false)
      }
    },
    [path],
  )

  useEffect(() => {
    mounted.current = true
    // Deferred so the fetch (and its setState) never runs synchronously inside the effect.
    queueMicrotask(() => {
      if (mounted.current) void load()
    })
    return () => {
      mounted.current = false
    }
  }, [load])

  useEffect(() => {
    if (!opts.refreshMs || !path) return
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void load(true)
    }, opts.refreshMs)
    return () => clearInterval(id)
  }, [opts.refreshMs, path, load])

  return { data, error, loading, reload: load, setData }
}
