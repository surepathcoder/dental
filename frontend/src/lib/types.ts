// Types mirroring the FastAPI schemas (backend/app/schemas.py)

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKED" | "FOLLOW_UP" | "CONVERTED" | "LOST"
export type ScoreLabel = "HOT" | "WARM" | "COLD"

export interface Slot {
  id: string
  start: string
  end: string
  date_label: string
  time_label: string
  label: string
  provider?: string | null
}

export interface FlowEvent {
  key: string
  label: string
  detail: string
  status: "completed" | "simulated" | "scheduled" | "failed" | "pending"
  channel?: string | null
  at?: string | null
}

export interface LeadSummary {
  id?: number | null
  name?: string | null
  phone?: string | null
  email?: string | null
  service?: string | null
  patient_type?: string | null
  insurance?: string | null
  urgency?: string | null
  preferred_date?: string | null
  preferred_time?: string | null
  status: LeadStatus
  score_label: ScoreLabel
}

export interface BookedAppointment {
  id: number
  patient_name: string
  service: string
  provider: string
  date: string
  time: string
  start: string
  clinic: string
  address: string
  phone: string
  patient_phone?: string | null
  patient_email?: string | null
  demo: boolean
  lead_id: number
}

export interface ChatUI {
  type: "contact_form" | "slots" | "confirmation" | "followup"
  missing?: ("name" | "phone" | "email")[]
  optional?: string[]
  phone_first?: boolean
  prefill?: Partial<Record<"name" | "phone" | "email", string | null>>
  note?: string
  submit_label?: string
  demo_note?: string | null
}

export interface ChatSource {
  id?: string | null
  title: string
}

export interface ChatResponse {
  conversation_id: string
  reply: string
  quick_replies: string[]
  ui: ChatUI | null
  slots: Slot[]
  appointment: BookedAppointment | null
  events: FlowEvent[]
  lead: LeadSummary | null
  stage: string
  intent: string
  disclaimer: string | null
  demo_mode: boolean
  ai_provider: string
  sources: ChatSource[]
  waiting_staff: boolean
  staff_brief: string | null
  last_message_id?: number | null
  new_session?: boolean
}

export type ChatAction =
  | { type: "select_slot"; slot_id: string }
  | { type: "submit_contact"; name: string; phone?: string; email?: string }
  | { type: "restart" }
  | { type: "cancel_appointment"; appointment_id?: number }
  | { type: "reschedule_slot"; slot_id: string; appointment_id?: number }

export interface Lead {
  id: number
  name: string | null
  phone: string | null
  email: string | null
  service: string | null
  patient_type: string | null
  insurance: string | null
  urgency: string | null
  preferred_date: string | null
  preferred_time: string | null
  status: LeadStatus
  score: number
  score_label: ScoreLabel
  source: string
  notes: string
  is_demo: boolean
  created_at: string
  last_activity_at: string
}

export interface Message {
  id: number
  role: "user" | "assistant" | "system"
  content: string
  meta: {
    intent?: string
    stage?: string
    trace?: string[]
    retrieved?: string[]
    events?: FlowEvent[]
    slots?: Slot[]
    disclaimer?: string | null
    [k: string]: unknown
  }
  created_at: string
}

export interface Conversation {
  id: string
  lead_id: number | null
  channel: string
  intent: string
  service: string | null
  stage: string
  status: "ACTIVE" | "BOOKED" | "FOLLOW_UP" | "ABANDONED" | "CLOSED" | "WAITING_STAFF"
  lead_score: ScoreLabel
  is_demo: boolean
  created_at: string
  last_message_at: string
  patient_name: string | null
  message_count: number
  preview: string | null
  staff_brief?: string | null
  page?: string | null
  messages?: Message[]
}

export interface Appointment {
  id: number
  lead_id: number | null
  patient_name: string
  patient_phone: string | null
  patient_email: string | null
  service: string
  provider_name: string | null
  start_at: string
  end_at: string
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  source: string
  scheduler: string
  is_demo: boolean
  notes: string
  created_at: string
}

export interface FollowUp {
  id: number
  lead_id: number
  appointment_id: number | null
  kind: string
  channel: "sms" | "email"
  recipient: string
  subject: string | null
  message: string
  due_at: string
  status: "SCHEDULED" | "SENT" | "SIMULATED" | "CANCELLED" | "FAILED"
  sent_at: string | null
  created_at: string
  lead_name: string | null
}

export interface AutomationEvent {
  id: number
  automation_key: string
  lead_id: number | null
  appointment_id: number | null
  title: string
  detail: string
  channel: string | null
  status: string
  created_at: string
}

export interface LeadDetail extends Lead {
  conversations: Conversation[]
  appointments: Appointment[]
  followups: FollowUp[]
  events: AutomationEvent[]
}

export interface AutomationStep {
  type: "trigger" | "ai" | "action" | "delay" | "result"
  label: string
}

export interface Automation {
  id: number
  key: string
  name: string
  description: string
  trigger: string
  steps: AutomationStep[]
  status: "ACTIVE" | "PAUSED"
  config: Record<string, unknown>
  runs_count: number
  last_run_at: string | null
}

export interface Paginated<T> {
  items: T[]
  total: number
  status_counts: Record<string, number>
}

export interface Analytics {
  demo_data: boolean
  demo_mode: boolean
  period_days: number
  kpis: {
    visitors: number
    conversations: number
    qualified_leads: number
    appointments: number
    followups: number
    conversion_rate: number
    chat_rate: number
    ai_booked: number
    after_hours_bookings?: number
    production_per_visit?: number
    estimated_production?: number
  }
  trends: Record<"visitors" | "conversations" | "leads" | "appointments", number>
  series: { date: string; label: string; visitors: number; conversations: number; leads: number; appointments: number }[]
  funnel: { stage: string; value: number }[]
  leads_by_service: { name: string; value: number }[]
  appointment_sources: { name: string; value: number }[]
  lead_status: { name: string; value: number }[]
  top_intents: { name: string; value: number }[]
  after_hours_conversations: number
  conversations_by_hour: { hour: number; value: number }[]
  today_appointments: Appointment[]
  upcoming_appointments: Appointment[]
  recent_activity: AutomationEvent[]
  hot_leads: { id: number; name: string; service: string | null; score: number; score_label: ScoreLabel; status: LeadStatus; phone: string | null; email: string | null }[]
}

export interface ServiceInfo {
  id: number
  slug: string
  name: string
  category: string
  short_description: string
  description: string
  duration_minutes: number
  price_from: number | null
  price_note: string
  is_active: boolean
}

export interface ClinicInfo {
  id: number
  name: string
  tagline: string
  phone: string
  email: string
  address_line: string
  city: string
  state: string
  zip_code: string
  timezone: string
  hours: Record<string, { open: string; close: string } | null>
  insurance_accepted: string[]
  financing: Record<string, unknown>
  settings: {
    assistant?: Record<string, unknown>
    appointments?: Record<string, unknown>
    sms?: Record<string, unknown>
    email?: Record<string, unknown>
    brand?: Record<string, unknown>
  }
  services: ServiceInfo[]
  faqs?: FaqItem[]
}

export interface FaqItem {
  id: number
  question: string
  answer: string
  category: string
  keywords?: string[]
}

export interface KnowledgeDoc {
  id: number
  title: string
  filename?: string | null
  source: string
  char_count: number
  is_active: boolean
  created_at: string
  preview: string
}

export interface IntegrationField {
  key: string
  label: string
  secret: boolean
  configured: boolean
  hint?: string | null
  value?: string | null
  placeholder?: string
}

export interface IntegrationStatus {
  provider: string
  name: string
  category: string
  status: "connected" | "not_connected" | "demo"
  detail: string
  env_vars: string[]
  fields?: IntegrationField[]
  configured_in?: "env" | "admin" | "both" | "none"
}

export interface WaitlistEntry {
  id: number
  name: string
  phone: string | null
  email: string | null
  service: string | null
  notes: string
  status: "WAITING" | "NOTIFIED" | "BOOKED" | "CANCELLED"
  created_at: string
}

export interface IntakePreview {
  appointment_id: number
  clinic_name: string
  patient_first_name: string
  service: string
  date_label: string
  time_label: string
  already_submitted: boolean
}

export interface SystemStatus {
  demo_mode: boolean
  ai_provider: string
  scheduler: string
  email: string
  sms: string
  database: string
  chat_session_ttl_minutes?: number
}
