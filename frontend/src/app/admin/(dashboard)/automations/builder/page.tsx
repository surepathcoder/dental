"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import {
  addEdge, Background, BackgroundVariant, type Connection, Controls, type Edge, Handle, MarkerType, MiniMap, type Node, type NodeProps, Position, ReactFlow,
  useEdgesState, useNodesState,
} from "@xyflow/react"
import { ArrowLeft, Bot, CalendarCheck, Clock, Database, GitBranch, Mail, MessageSquareText, Play, Repeat, Save, Siren, Star, UserPlus, Zap } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { api, useApi } from "@/lib/api"
import type { Automation } from "@/lib/types"
import { cn } from "@/lib/utils"

import "@xyflow/react/dist/style.css"

const ICONS = { Bot, Zap, GitBranch, Database, UserPlus, CalendarCheck, Mail, MessageSquareText, Clock, Repeat, Star, Siren, Play } as const

type NodeKind = "trigger" | "ai" | "decision" | "action" | "delay" | "result" | "branch"

interface FlowNodeData extends Record<string, unknown> {
  label: string
  detail?: string
  kind: NodeKind
  icon: keyof typeof ICONS
  control?: "followup_delay" | "reminders"
}

const KIND_STYLE: Record<NodeKind, string> = {
  trigger: "border-ink/80 bg-ink text-white",
  ai: "border-primary/60 bg-primary text-primary-foreground",
  decision: "border-amber-300 bg-amber-50 text-amber-950",
  action: "border-border bg-card text-ink",
  delay: "border-dashed border-muted-foreground/40 bg-muted text-muted-foreground",
  result: "border-emerald-300 bg-emerald-50 text-emerald-900",
  branch: "border-sky-300 bg-sky-50 text-sky-900",
}

function FlowNode({ data }: NodeProps<Node<FlowNodeData>>) {
  const Icon = ICONS[data.icon] ?? Zap
  // Local edit wins; otherwise show what the automation engine currently has.
  const [override, setOverride] = useState<string | null>(null)
  const { data: automations } = useApi<Automation[]>(data.control ? "/automations" : null)
  const followup = automations?.find((a) => a.key === "missed_lead_followup")
  const reminder = automations?.find((a) => a.key === "sms_reminder")
  const delay = override ?? String(followup?.config?.delay_hours ?? 24)
  const reminders = override ?? (Array.isArray(reminder?.config?.reminder_hours) ? (reminder.config.reminder_hours as number[]).join(",") : "24,2,0.5")

  const save = async (value: string) => {
    setOverride(value)
    try {
      if (data.control === "followup_delay") {
        await api("/automations", { method: "POST", json: { key: "missed_lead_followup", config: { delay_hours: Number(value) } } })
      } else {
        await api("/automations", { method: "POST", json: { key: "sms_reminder", config: { reminder_hours: value.split(",").map(Number) } } })
      }
      toast.success("Automation updated", { description: "Saved to the automation engine." })
    } catch (e) {
      toast.error("Couldn't save", { description: (e as Error).message })
    }
  }

  return (
    <div className={cn("w-56 rounded-xl border-2 px-3 py-2.5 shadow-sm", KIND_STYLE[data.kind])}>
      <Handle type="target" position={Position.Top} className="!size-2 !border-0 !bg-primary" />
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 size-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-[13px] leading-snug font-semibold">{data.label}</p>
          {data.detail && <p className="mt-0.5 text-[11px] leading-snug opacity-80">{data.detail}</p>}
        </div>
      </div>
      {data.control === "followup_delay" && (
        <select
          className="nodrag nopan mt-2 w-full rounded-md border bg-card px-2 py-1 text-[11px] font-medium text-ink"
          value={delay}
          onChange={(e) => save(e.target.value)}
          aria-label="Follow-up delay"
        >
          {["1", "4", "12", "24", "48", "72"].map((h) => (
            <option key={h} value={h}>
              Wait {h} hour{h === "1" ? "" : "s"}
            </option>
          ))}
        </select>
      )}
      {data.control === "reminders" && (
        <select
          className="nodrag nopan mt-2 w-full rounded-md border bg-card px-2 py-1 text-[11px] font-medium text-ink"
          value={reminders}
          onChange={(e) => save(e.target.value)}
          aria-label="Reminder schedule"
        >
          <option value="24,2">24h + 2h before</option>
          <option value="48,24,2">48h + 24h + 2h before</option>
          <option value="24">24h before only</option>
          <option value="2">2h before only</option>
        </select>
      )}
      <Handle type="source" position={Position.Bottom} className="!size-2 !border-0 !bg-primary" />
    </div>
  )
}

const nodeTypes = { flow: FlowNode }

const INITIAL_NODES: Node<FlowNodeData>[] = [
  { id: "visit", type: "flow", position: { x: 0, y: 0 }, data: { label: "Visitor arrives", detail: "Website, Google or ad click", kind: "trigger", icon: "Play" } },
  { id: "chat", type: "flow", position: { x: 0, y: 110 }, data: { label: "AI conversation", detail: "Ava greets the visitor", kind: "ai", icon: "Bot" } },
  { id: "intent", type: "flow", position: { x: 0, y: 220 }, data: { label: "Detect intent", detail: "Information · Booking · Emergency", kind: "decision", icon: "GitBranch" } },
  { id: "info", type: "flow", position: { x: -300, y: 330 }, data: { label: "Information request", detail: "Insurance, hours, pricing", kind: "branch", icon: "MessageSquareText" } },
  { id: "kb", type: "flow", position: { x: -300, y: 440 }, data: { label: "Knowledge retrieval", detail: "Answer grounded in clinic data", kind: "ai", icon: "Database" } },
  { id: "offer", type: "flow", position: { x: -300, y: 550 }, data: { label: "Offer appointment", detail: "“Would you like to book?”", kind: "action", icon: "CalendarCheck" } },
  { id: "emergency", type: "flow", position: { x: 300, y: 330 }, data: { label: "Emergency request", detail: "Safety message, no diagnosis", kind: "branch", icon: "Siren" } },
  { id: "contact", type: "flow", position: { x: 0, y: 440 }, data: { label: "Collect contact information", detail: "Name, phone, email, insurance, urgency", kind: "action", icon: "UserPlus" } },
  { id: "avail", type: "flow", position: { x: 0, y: 560 }, data: { label: "Check availability", detail: "Cal.com or built-in scheduler", kind: "action", icon: "Clock" } },
  { id: "book", type: "flow", position: { x: 0, y: 670 }, data: { label: "Book appointment", detail: "Saved to database, lead → BOOKED", kind: "action", icon: "CalendarCheck" } },
  { id: "confirm", type: "flow", position: { x: 0, y: 780 }, data: { label: "Send confirmation", detail: "Email (Resend) + SMS (Twilio)", kind: "action", icon: "Mail" } },
  { id: "remind", type: "flow", position: { x: -170, y: 900 }, data: { label: "Schedule reminders", kind: "delay", icon: "Clock", control: "reminders" } },
  { id: "review", type: "flow", position: { x: 190, y: 900 }, data: { label: "Request review", detail: "3 hours after the visit", kind: "action", icon: "Star" } },
  { id: "attended", type: "flow", position: { x: 0, y: 1040 }, data: { label: "Patient attends", detail: "No-show rate down, chair filled", kind: "result", icon: "Zap" } },
  { id: "nobook", type: "flow", position: { x: -620, y: 660 }, data: { label: "Left without booking", detail: "Lead status → FOLLOW_UP", kind: "branch", icon: "Repeat" } },
  { id: "wait", type: "flow", position: { x: -620, y: 780 }, data: { label: "Follow-up delay", kind: "delay", icon: "Clock", control: "followup_delay" } },
  { id: "followup", type: "flow", position: { x: -620, y: 900 }, data: { label: "Send follow-up", detail: "Personalised SMS or email", kind: "action", icon: "MessageSquareText" } },
  { id: "reengage", type: "flow", position: { x: -620, y: 1010 }, data: { label: "Lead re-engaged", detail: "Replies or books online", kind: "result", icon: "Zap" } },
]

const edge = (source: string, target: string, label?: string, dashed = false): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  label,
  animated: !dashed,
  style: { stroke: dashed ? "var(--muted-foreground)" : "var(--primary)", strokeWidth: 1.5, strokeDasharray: dashed ? "5 4" : undefined },
  labelStyle: { fontSize: 11, fill: "var(--muted-foreground)" },
  labelBgStyle: { fill: "var(--card)" },
  markerEnd: { type: MarkerType.ArrowClosed, color: dashed ? "var(--muted-foreground)" : "var(--primary)" },
})

const INITIAL_EDGES: Edge[] = [
  edge("visit", "chat"),
  edge("chat", "intent"),
  edge("intent", "info", "question"),
  edge("intent", "contact", "wants a visit"),
  edge("intent", "emergency", "emergency"),
  edge("info", "kb"),
  edge("kb", "offer"),
  edge("offer", "contact", "yes"),
  edge("offer", "nobook", "not now", true),
  edge("emergency", "contact", "same-day"),
  edge("contact", "avail"),
  edge("contact", "nobook", "abandons", true),
  edge("avail", "book"),
  edge("book", "confirm"),
  edge("confirm", "remind"),
  edge("confirm", "review"),
  edge("remind", "attended"),
  edge("review", "attended"),
  edge("nobook", "wait", "", true),
  edge("wait", "followup", "", true),
  edge("followup", "reengage", "", true),
  edge("reengage", "contact", "books later", true),
]

export default function WorkflowBuilderPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(INITIAL_EDGES)
  const [dirty, setDirty] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: "var(--primary)" }, style: { stroke: "var(--primary)", strokeWidth: 1.5 } }, eds))
      setDirty(true)
    },
    [setEdges],
  )

  const reset = () => {
    setNodes(INITIAL_NODES)
    setEdges(INITIAL_EDGES)
    setDirty(false)
    toast.success("Layout reset")
  }

  const legend = useMemo(
    () => [
      { label: "Trigger", cls: KIND_STYLE.trigger },
      { label: "AI step", cls: KIND_STYLE.ai },
      { label: "Decision", cls: KIND_STYLE.decision },
      { label: "Action", cls: KIND_STYLE.action },
      { label: "Delay", cls: KIND_STYLE.delay },
      { label: "Outcome", cls: KIND_STYLE.result },
    ],
    [],
  )

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/automations">
          <ArrowLeft /> Automation center
        </Link>
      </Button>

      <PageHeader
        title="Workflow builder"
        description="The full patient journey the platform automates. Drag nodes, connect steps, and change live settings on the delay nodes."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reset} disabled={!dirty && nodes === INITIAL_NODES}>
              Reset layout
            </Button>
            <Button size="sm" onClick={() => toast.info("Layout is visual only", { description: "Timing changes made on the delay nodes are saved to the automation engine immediately." })}>
              <Save /> About saving
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2 text-xs">
        {legend.map((l) => (
          <span key={l.label} className={cn("rounded-full border px-2.5 py-1 font-medium", l.cls)}>
            {l.label}
          </span>
        ))}
      </div>

      <div className="h-[72vh] min-h-[560px] overflow-hidden rounded-2xl border bg-card">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(c) => {
            onNodesChange(c)
            setDirty(true)
          }}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: false }}
          minZoom={0.2}
          className="bg-muted/30"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="var(--grid)" />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable nodeStrokeWidth={2} className="!bottom-2 !right-2 hidden sm:block" />
        </ReactFlow>
      </div>

      <p className="text-xs text-muted-foreground">
        Solid lines are the booking path; dashed lines are the recovery path for visitors who don&apos;t book. The delay nodes read and write the real
        automation configuration — changing one updates the missed-lead follow-up or reminder schedule immediately.
      </p>
    </div>
  )
}
