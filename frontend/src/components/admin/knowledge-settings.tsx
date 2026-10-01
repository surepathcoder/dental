"use client"

import { useRef, useState } from "react"
import { FileUp, Plus, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api, useApi } from "@/lib/api"
import type { FaqItem, KnowledgeDoc } from "@/lib/types"

export function KnowledgeSettings() {
  const docs = useApi<KnowledgeDoc[]>("/knowledge/documents")
  const faqs = useApi<FaqItem[]>("/knowledge/faqs")
  const [title, setTitle] = useState("")
  const [paste, setPaste] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [faqQ, setFaqQ] = useState("")
  const [faqA, setFaqA] = useState("")
  const [faqCat, setFaqCat] = useState("general")

  const uploadFile = async (file: File) => {
    setBusy("upload")
    try {
      const body = new FormData()
      body.append("file", file)
      if (title.trim()) body.append("title", title.trim())
      await api<KnowledgeDoc>("/knowledge/documents/upload", { method: "POST", body })
      toast.success("Document added", { description: `${file.name} is now in the receptionist knowledge base.` })
      setTitle("")
      await docs.reload(true)
    } catch (e) {
      toast.error("Couldn't upload", { description: (e as Error).message })
    } finally {
      setBusy(null)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const pasteDoc = async () => {
    setBusy("paste")
    try {
      await api("/knowledge/documents", { method: "POST", json: { title: title.trim() || "Pasted note", text: paste.trim() } })
      toast.success("Note added to knowledge base")
      setPaste("")
      setTitle("")
      await docs.reload(true)
    } catch (e) {
      toast.error("Couldn't save note", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const removeDoc = async (id: number) => {
    setBusy(`doc-${id}`)
    try {
      await api(`/knowledge/documents/${id}`, { method: "DELETE" })
      await docs.reload(true)
    } catch (e) {
      toast.error("Couldn't delete", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const addFaq = async () => {
    setBusy("faq")
    try {
      await api("/knowledge/faqs", { method: "POST", json: { question: faqQ.trim(), answer: faqA.trim(), category: faqCat } })
      toast.success("FAQ saved")
      setFaqQ("")
      setFaqA("")
      await faqs.reload(true)
    } catch (e) {
      toast.error("Couldn't save FAQ", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const removeFaq = async (id: number) => {
    setBusy(`faq-${id}`)
    try {
      await api(`/knowledge/faqs/${id}`, { method: "DELETE" })
      await faqs.reload(true)
    } catch (e) {
      toast.error("Couldn't delete FAQ", { description: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-ink">Upload documents</h3>
        <p className="mt-1 text-xs text-muted-foreground">PDF, .txt, .md or .csv up to 2 MB. The receptionist retrieves this text when patients ask related questions.</p>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="kb-title">Title (optional)</Label>
            <Input id="kb-title" value={title} maxLength={200} placeholder="Office policies, after-hours protocol…" onChange={(e) => setTitle(e.target.value)} />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadFile(file)
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" disabled={busy === "upload"} onClick={() => fileRef.current?.click()}>
              <Upload /> {busy === "upload" ? "Uploading…" : "Upload file"}
            </Button>
            <span className="self-center text-xs text-muted-foreground">or paste text below</span>
          </div>
          <Textarea rows={5} value={paste} maxLength={80000} placeholder="Paste policies, insurance notes, or visit prep instructions…" onChange={(e) => setPaste(e.target.value)} />
          <Button type="button" size="sm" disabled={busy === "paste" || paste.trim().length < 20} onClick={() => void pasteDoc()}>
            <FileUp /> Add pasted text
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {docs.data?.map((d) => (
            <li key={d.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{d.title}</p>
                <p className="text-xs text-muted-foreground">
                  {d.source === "upload" ? d.filename || "Uploaded file" : "Pasted note"} · {d.char_count.toLocaleString()} characters
                </p>
                {d.preview && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.preview}</p>}
              </div>
              <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${d.title}`} disabled={busy === `doc-${d.id}`} onClick={() => void removeDoc(d.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
          {docs.data && docs.data.length === 0 && <li className="text-sm text-muted-foreground">No uploaded documents yet.</li>}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">FAQs</h3>
        <p className="mt-1 text-xs text-muted-foreground">These answers are retrieved live — not a static seed — whenever a visitor asks a matching question.</p>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="faq-q">Question</Label>
            <Input id="faq-q" value={faqQ} maxLength={300} onChange={(e) => setFaqQ(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="faq-a">Answer</Label>
            <Textarea id="faq-a" rows={3} maxLength={4000} value={faqA} onChange={(e) => setFaqA(e.target.value)} />
          </div>
          <div className="grid gap-1.5 sm:max-w-xs">
            <Label htmlFor="faq-c">Category</Label>
            <Input id="faq-c" value={faqCat} maxLength={60} onChange={(e) => setFaqCat(e.target.value)} />
          </div>
          <Button type="button" size="sm" disabled={busy === "faq" || faqQ.trim().length < 5 || faqA.trim().length < 5} onClick={() => void addFaq()}>
            <Plus /> Add FAQ
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {faqs.data?.map((f) => (
            <li key={f.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{f.question}</p>
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{f.answer}</p>
              </div>
              <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${f.question}`} disabled={busy === `faq-${f.id}`} onClick={() => void removeFaq(f.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
