"use client"

import { useState } from "react"
import { Bot, CalendarClock, CheckCircle2, CircleDashed, KeyRound, Mail, MessageSquareText, Plug, Save, XCircle } from "lucide-react"
import { toast } from "sonner"

import { ErrorBlock, LoadingBlock } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, useApi } from "@/lib/api"
import type { IntegrationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const INTEGRATION_ICON: Record<string, React.ElementType> = { groq: Bot, openai: Bot, twilio: MessageSquareText, gmail: Mail, resend: Mail, calcom: CalendarClock }

export function IntegrationSettings() {
  const { data, error, loading, reload } = useApi<IntegrationStatus[]>("/integrations")
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const setField = (provider: string, key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [provider]: { ...(prev[provider] ?? {}), [key]: value } }))
  }

  const save = async (item: IntegrationStatus) => {
    const values = drafts[item.provider] ?? {}
    const payload: Record<string, string> = {}
    for (const field of item.fields ?? []) {
      const typed = (values[field.key] ?? "").trim()
      if (typed) payload[field.key] = typed
    }
    if (!Object.keys(payload).length) {
      toast.error("Nothing to save", { description: "Paste a key or value first. Leave a secret blank to keep the current one." })
      return
    }
    setSaving(item.provider)
    try {
      await api<IntegrationStatus[]>(`/integrations/${item.provider}`, { method: "POST", json: { values: payload } })
      toast.success(`${item.name} saved`, { description: "The receptionist will use these credentials on the next request." })
      setDrafts((prev) => ({ ...prev, [item.provider]: {} }))
      await reload(true)
    } catch (e) {
      toast.error("Couldn't save keys", { description: (e as Error).message })
    } finally {
      setSaving(null)
    }
  }

  if (loading && !data) return <LoadingBlock rows={4} />
  if (error) return <ErrorBlock message={error.message} onRetry={() => reload()} />

  return (
    <ul className="space-y-4">
      {data?.map((item) => {
        const Icon = INTEGRATION_ICON[item.provider] ?? Plug
        const StateIcon = item.status === "connected" ? CheckCircle2 : item.status === "demo" ? CircleDashed : XCircle
        const draft = drafts[item.provider] ?? {}
        return (
          <li key={item.provider} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-ink">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-ink">{item.name}</span>
                  <span className="text-[11px] text-muted-foreground">{item.category}</span>
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  item.status === "connected" ? "bg-emerald-100 text-emerald-800" : item.status === "demo" ? "bg-amber-100 text-amber-900" : "bg-neutral-200 text-neutral-600",
                )}
              >
                <StateIcon className="size-3.5" />
                {item.status === "connected" ? "Connected" : item.status === "demo" ? "Demo mode" : "Not connected"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(item.fields ?? []).map((field) => (
                <div key={field.key} className="grid gap-1.5">
                  <Label htmlFor={`${item.provider}-${field.key}`}>
                    {field.label}
                    {field.secret && field.configured && field.hint ? (
                      <span className="ml-2 font-normal text-muted-foreground">saved {field.hint}</span>
                    ) : null}
                  </Label>
                  <Input
                    id={`${item.provider}-${field.key}`}
                    type={field.secret ? "password" : "text"}
                    autoComplete="off"
                    placeholder={field.secret ? (field.configured ? "Leave blank to keep current key" : field.placeholder) : field.value || field.placeholder}
                    value={draft[field.key] ?? (field.secret ? "" : field.value ?? "")}
                    onChange={(e) => setField(item.provider, field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <Button className="mt-4" size="sm" disabled={saving === item.provider} onClick={() => void save(item)}>
              <Save /> {saving === item.provider ? "Saving…" : `Save ${item.name}`}
            </Button>
          </li>
        )
      })}
      <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
        <KeyRound className="mt-0.5 size-3.5 shrink-0" />
        Keys are stored on the server and applied immediately. They are never sent back to the browser — only a masked hint is shown.
      </p>
    </ul>
  )
}
