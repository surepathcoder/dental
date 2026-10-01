# API reference

Base URL: `http://localhost:8000` (interactive docs at `/docs`, OpenAPI schema at `/openapi.json`).

- **Public endpoints** are rate limited per IP and need no authentication.
- **Admin endpoints** require the `X-API-Key` header. In demo mode the key is `demo-admin-key`;
  otherwise it is whatever `ADMIN_API_KEY` is set to.
- All timestamps are UTC ISO-8601 with a trailing `Z`. Appointment times are shown to patients in the
  clinic's timezone (`America/Chicago`).
- Validation failures return `422` with a `detail` array; rate limits return `429` with `Retry-After`.

---

## AI receptionist

### `POST /api/chat` (public)

Runs one turn of the LangGraph workflow.

```jsonc
// Request
{
  "conversation_id": null,          // 32-char hex id, or null to start a new conversation
  "message": "Do you offer Invisalign?",
  "action": null,                   // structured UI action (see below)
  "page": "/services/invisalign"    // optional, for attribution
}
```

`action` replaces `message` for UI interactions:

```jsonc
{ "type": "select_slot",    "slot_id": "2026-09-21T15:00:00Z" }
{ "type": "submit_contact", "name": "Jordan Miller", "phone": "(512) 555-0187", "email": "jordan.miller@example.com" }
{ "type": "restart" }
{ "type": "cancel_appointment", "appointment_id": 12 }
{ "type": "reschedule_slot", "slot_id": "2026-09-22T15:00:00Z", "appointment_id": 12 }
```

```jsonc
// Response
{
  "conversation_id": "5f1c…",
  "reply": "Yes — we offer Invisalign at BrightSmile Dental. …",
  "quick_replies": ["Yes, let's book", "Not right now"],
  "ui": { "type": "slots", "demo_note": "Demo booking — no real appointment will be created." },
  "slots": [
    { "id": "2026-09-21T15:00:00Z", "start": "2026-09-21T15:00:00Z", "end": "2026-09-21T15:45:00Z",
      "date_label": "Mon, Sep 21", "time_label": "10:00 AM", "label": "Mon, Sep 21 · 10:00 AM",
      "provider": "Dr. Priya Nair" }
  ],
  "appointment": null,              // populated on the turn the booking completes
  "events": [],                     // automation steps triggered this turn
  "lead": { "id": 42, "name": "Jordan Miller", "status": "QUALIFIED", "score_label": "WARM", … },
  "stage": "choose_slot",           // conversation state machine position
  "intent": "details",
  "disclaimer": null,               // medical / emergency disclaimer when applicable
  "demo_mode": true,
  "ai_provider": "Rule-based (demo)",
  "sources": [{ "id": "service:invisalign", "title": "Invisalign" }],
  "waiting_staff": false,
  "staff_brief": null,
  "last_message_id": 184
}
```

`ui.type` is one of `contact_form`, `slots`, `confirmation`, `followup` — it tells the client which inline
widget to render.

### `POST /api/chat/stream` (public)

Same as `POST /api/chat`, then streams the assembled reply as SSE (`data: {"delta":"…"}` tokens, then
`event: done` with the full JSON response). Structured widgets still arrive on the final event.

### `GET /api/chat/{conversation_id}/updates?after_id=` (public)

Poll new messages while a conversation is waiting for staff. Returns `{ messages, waiting_staff, last_id, status }`.

### `POST /api/conversations/{id}/staff-reply` (admin)

Front-desk reply that the visitor sees in the website chat. Sets status `WAITING_STAFF`.

### `POST /api/conversations/{id}/resume` (admin)

Hands the thread back to the AI receptionist.

### `POST /api/chat/{conversation_id}/end` (public)

Signals that the visitor left. If the conversation produced an interested-but-unbooked lead with contact
details, the missed-lead follow-up automation is scheduled and the resulting event is returned (otherwise
`null`). The web client calls this via `navigator.sendBeacon` on `pagehide`.

---

## Appointments

### `GET /api/appointments/availability` (public)

| Query | Default | Notes |
|---|---|---|
| `service` | `General Dentistry` | Must be an active service |
| `date` | – | `YYYY-MM-DD` (clinic local date) |
| `limit` | 12 | 1–40 |

```jsonc
{ "service": "Invisalign", "timezone": "America/Chicago", "scheduler": "mock", "demo": true,
  "slots": [ { "id": "2026-09-21T15:00:00Z", "label": "Mon, Sep 21 · 10:00 AM", … } ] }
```

### `POST /api/appointments` (public)

```jsonc
{ "name": "Riley Chen", "phone": "512-555-0190", "email": "riley.chen@example.com",
  "service": "General Dentistry", "slot_id": "2026-09-21T15:00:00Z",
  "patient_type": "new", "insurance": "MetLife", "notes": null, "source": "booking_form" }
```

Returns `201` with the appointment, the lead id, the automation `events` that fired, and `demo`.
Returns `409` if the slot is no longer available (always re-fetch availability on this error).

### `GET /api/appointments` (admin)

Query: `start` (ISO date, default 14 days ago), `days` (1–120, default 45), `status`.

### `PATCH /api/appointments/{id}` (admin)

```jsonc
{ "status": "COMPLETED" }   // CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
```

Completing an appointment marks the lead `CONVERTED`; cancelling moves it to `FOLLOW_UP` and cancels
pending reminders.

---

## Leads

### `POST /api/leads` (public)

Contact-form submission. Requires `name` plus a phone **or** email; phone numbers are normalised to
`(512) 555-0187`. Returns `201` with the lead.

### `GET /api/leads` (admin)

Query: `status`, `service`, `q` (name/email/phone search), `limit` (≤200), `offset`.

```jsonc
{ "items": [ … ], "total": 106, "status_counts": { "BOOKED": 24, "NEW": 20, … } }
```

### `GET /api/leads/{id}` (admin)

The full record: lead fields plus `conversations` (with message transcripts and per-message workflow
traces), `appointments`, `followups` and `events`.

### `PATCH /api/leads/{id}` (admin)

```jsonc
{ "status": "CONTACTED", "notes": "Called, left voicemail" }
```

---

## Conversations

- `GET /api/conversations` (admin) — query `status`, `score`, `limit`, `offset`; returns items with
  `preview`, `message_count`, `intent`, `lead_score` and `status_counts`.
- `GET /api/conversations/{id}` (admin) — full transcript. Each assistant message carries
  `meta.trace` (the workflow path, e.g. `["intent_detection","knowledge_retrieval","response"]`),
  `meta.retrieved` (knowledge documents used), `meta.events` and `meta.slots`.

---

## Follow-ups

- `GET /api/followups` (admin) — query `kind` (`missed_lead`, `confirmation`, `reminder_24h`,
  `reminder_2h`, `review_request`), `status`, `limit`.
- `POST /api/followups` (admin) — `{ "lead_id": 42, "kind": "missed_lead", "delay_hours": 24 }`.
  Returns `422` if the lead has no contact details or the automation is paused.
- `POST /api/followups/{id}/send` (admin) — deliver immediately (simulated in demo mode).
- `POST /api/followups/process` (admin) — deliver everything currently due; returns `{ "processed": n }`.

---

## Automations

- `GET /api/automations` (admin) — the six automations with `steps`, `status`, `config`, `runs_count`.
- `POST /api/automations` (admin) — create or update:

```jsonc
{ "key": "missed_lead_followup", "status": "ACTIVE", "config": { "delay_hours": 24 } }
{ "key": "sms_reminder", "config": { "reminder_hours": [24, 2] } }
```

Config keys are allow-listed per automation and range-checked (`422` otherwise).

- `GET /api/automations/events` (admin) — activity log; query `key`, `limit`.

---

## Clinic, analytics & system

- `GET /api/clinic` (public) — profile, hours, insurance list, financing, settings, services, FAQs.
  This is the same data the AI receptionist answers from.
- `POST /api/clinic` (admin) — update profile fields, `hours` (validated `HH:MM`, open < close),
  `insurance_accepted`, `settings` (groups `assistant`, `appointments`, `sms`, `email`) and per-service
  patches.
- `GET /api/analytics` (admin) — `kpis`, `trends`, 30-day `series`, `funnel`, `leads_by_service`,
  `appointment_sources`, `lead_status`, `top_intents`, `conversations_by_hour`, `today_appointments`,
  `upcoming_appointments`, `recent_activity`, `hot_leads`. Always includes `"demo_data": true`.
- `GET /api/integrations` (admin) — per-provider `status` (`connected` / `demo` / `not_connected`) and the
  environment variables involved. **Never returns secret values.**
- `GET /api/status` (public) — demo flag and which implementation each subsystem is using.
- `GET /api/health` (public) — liveness probe.
- `POST /api/demo/reset` (admin, demo mode only) — wipe and re-seed the demo dataset.
- `POST /api/demo/missed-lead` (admin) — run a scripted abandoned-inquiry conversation through the real
  workflow and return the lead id and scheduled follow-up.

---

## Error format

```jsonc
{ "detail": "Sorry — that time was just taken. Please choose another slot." }
```

| Status | Meaning |
|---|---|
| 401 | Missing or invalid `X-API-Key` |
| 404 | Unknown lead / appointment / conversation |
| 409 | Slot already taken |
| 422 | Validation error (Pydantic detail array) |
| 429 | Rate limited — see `Retry-After` |
| 503 | Admin key not configured on the server |
