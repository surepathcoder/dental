# AI Dental Receptionist & Patient Automation Platform

A complete, working demonstration of what an AI receptionist does for a dental practice:

> **Website visitor → AI receptionist → patient qualification → appointment booking → confirmation → automated follow-up → clinic dashboard**

Built around **BrightSmile Dental**, a fictional practice in Austin, Texas. Every page, conversation and
automation in this repository runs for real against a FastAPI backend, a LangGraph workflow and a database —
the only thing that's simulated is the sending of emails/SMS and the calendar write, so the whole thing can be
demonstrated safely without any API keys.

**This is a portfolio / demo system, not a production medical product.** See [Disclaimer](#disclaimer).

---

## Table of contents

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [How the AI receptionist works](#how-the-ai-receptionist-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Demo mode](#demo-mode)
- [The 12-step guided demo](#the-12-step-guided-demo)
- [Connecting the integrations](#connecting-the-integrations)
- [API documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Future improvements](#future-improvements)
- [Disclaimer](#disclaimer)

---

## The problem

A dental practice's website is usually a brochure. Meanwhile:

- **Calls go to voicemail** when the front desk is with a patient — and the caller rings the next practice.
- **Nights and weekends are dead air.** A large share of website visits happen when nobody can answer.
- **Web forms go cold.** "We'll get back to you" loses the patient who wanted an appointment *now*.
- **Follow-up rarely happens.** Interested visitors who don't book are seldom contacted again.

## The solution

An AI receptionist that lives on the practice's website and does six jobs:

| Job | What it does |
|---|---|
| **Answers patients** | Insurance, pricing, hours, services and directions — from the practice's own structured knowledge base |
| **Captures leads** | Every conversation becomes a structured lead record |
| **Qualifies inquiries** | New vs. existing patient, treatment interest, insurance, urgency, preferred times |
| **Books appointments** | Real availability, booked inside the chat, with an instant confirmation |
| **Sends reminders** | Email + SMS confirmation, then 24-hour and 2-hour reminders |
| **Follows up** | Interested but didn't book? A follow-up is scheduled and sent automatically |

Plus a **clinic dashboard** so the practice can see leads, transcripts, appointments, automations and analytics.

---

## Features

### Patient-facing website (`/`)
- Home, services hub + 5 service pages, about, team, FAQ, contact, online booking, privacy, terms
- Floating **AI receptionist** widget with quick replies, inline slot picker, inline contact card,
  appointment confirmation card and a live automation timeline
- 3-step **online booking flow** with real availability and an instant confirmation
- Contact form that creates a real lead in the dashboard
- Fully responsive; the chat is full-screen on mobile

### AI receptionist
- **LangGraph** workflow: intent detection → (emergency | knowledge retrieval | lead qualification) →
  availability → booking → confirmation → follow-up scheduling
- **Grounded answers only.** Responses come from a structured knowledge base (clinic profile, services, FAQs).
  When an LLM is configured it may only rephrase those facts. Answers that invent prices, phone numbers, or
  insurers not in the knowledge base are rejected, and if retrieval misses, the bot hands off to the front desk
  instead of guessing. Sources used for an answer appear as chips in the chat.
- **Never diagnoses.** Clinical questions get a clear "a dentist needs to examine you" disclaimer
- **Emergency triage** with a 911 / emergency-room warning for red-flag symptoms, plus same-day slots
- Handles mid-flow questions ("wait — do you take Delta Dental?") and returns to the booking flow afterwards
- Understands free-text contact details, dates ("next week, mornings"), insurers, urgency and slot choices
- **Page-aware:** opening chat from a service page (e.g. Invisalign) greets with that treatment
- **Find / cancel / reschedule** an existing visit in chat (lookup by this conversation or phone)
- **Staff takeover:** "talk to a person" parks the bot; the front desk replies live from AI Conversations
- After-hours greetings, a light Spanish path, and streaming replies in the widget
- Works **with or without an LLM** — the rule-based path is complete on its own

### Lead qualification & scoring
- Structured `Lead` objects with name, phone, email, service, patient type, insurance, urgency, preferences
- 0–100 score with HOT / WARM / COLD labels, status pipeline
  `NEW → CONTACTED → QUALIFIED → BOOKED → FOLLOW_UP → CONVERTED → LOST`

### Automations (6)
`AI Receptionist` · `Lead Qualification` · `Appointment Confirmation` · `SMS Reminders` ·
`Missed Lead Follow-up` · `Review Request` — each with trigger → steps → result, a run counter, live activity
log, and editable timing.

### Clinic dashboard (`/admin`)
- **Overview** — 6 KPI cards, trend charts, today's schedule, leads to call back, live automation activity
- **Leads** — filter by status, search, CSV export, full lead record with conversation transcript
- **AI Conversations** — every chat with the **workflow path the AI took** for each reply
- **Appointments** — today / upcoming / past, with status actions
- **Automation Center** — toggle automations, queued messages, "Simulate missed lead", "Process due now"
- **Workflow Builder** — React Flow canvas of the whole journey; the delay nodes read and write the real
  automation configuration
- **Analytics** — visitors, conversations, leads, appointments, conversion funnel, hour-of-day histogram,
  breakdowns by service, source, status and topic (chart palette validated for colour-vision accessibility)
- **Settings** — clinic info, hours, AI assistant, appointment rules, SMS/email templates, services,
  integration status

### Agency landing page (`/solutions/dental`)
The service-provider pitch: problem, capabilities, workflow, deliverables, pricing, FAQ — with a one-click
link into the guided demo.

---

## Screenshots

| | |
|---|---|
| **Patient website** — `/` | **AI receptionist** — booking + automations inside the chat |
| ![Home page](docs/screenshots/home.jpg) | ![AI receptionist chat](docs/screenshots/chat.jpg) |
| **Clinic dashboard** — `/admin` | **Automation center** — `/admin/automations` |
| ![Clinic dashboard](docs/screenshots/dashboard.jpg) | ![Automation center](docs/screenshots/automations.jpg) |
| **Workflow builder** — `/admin/automations/builder` | **Analytics** — `/admin/analytics` |
| ![Workflow builder](docs/screenshots/builder.jpg) | ![Analytics](docs/screenshots/analytics.jpg) |

---

## Architecture

```
┌──────────────────────────────────────────── Browser ────────────────────────────────────────────┐
│  Patient website (/)            AI chat widget            Clinic dashboard (/admin)             │
└───────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                            │  fetch /api/backend/*
┌───────────────────────────────────────────▼─────────────── Next.js 16 (Vercel) ─────────────────┐
│  App Router pages · proxy.ts admin guard · route handler /api/backend/[...path]                 │
│  → adds X-API-Key server-side, allow-lists public endpoints, never ships secrets to the browser │
└───────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                            │  HTTP
┌───────────────────────────────────────────▼─────────────── FastAPI (Render / Railway) ──────────┐
│  routers/    chat · leads · appointments · followups · conversations · analytics ·              │
│              automations · clinic · demo                                                        │
│  agent/      LangGraph receptionist  (nlu · knowledge · graph · runner)                          │
│  services/   llm (Groq→OpenAI→rules) · scheduler (Cal.com→mock) · notifications                  │
│              (Resend/Twilio→simulated) · automations engine · lead scoring                      │
│  security    API-key auth · sliding-window rate limits · CORS · audit log                       │
│  worker      background thread: due follow-ups + abandoned-chat sweep                           │
└───────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                            │  SQLAlchemy 2.0
                            ┌───────────────▼────────────────┐
                            │  PostgreSQL (SQLite in demo)   │
                            │  clinic · users · services ·   │
                            │  faqs · leads · conversations ·│
                            │  messages · appointments ·     │
                            │  automations · automation_events│
                            │  followups · integrations ·    │
                            │  audit_logs                    │
                            └────────────────────────────────┘
```

**Why the proxy?** The browser never sees the admin API key or the backend URL. Public endpoints (chat,
availability, booking, contact form) are explicitly allow-listed; everything else requires a valid admin
session before the route handler will attach the key.

---

## How the AI receptionist works

```
                                   START
                                     │
                            ┌────────▼─────────┐
                            │ intent detection │  rules first, LLM only as fallback
                            └────────┬─────────┘
        ┌──────────────┬─────────────┼───────────────┬──────────────┐
        ▼              ▼             ▼               ▼              ▼
   emergency      knowledge     qualification     booking      follow-up
   triage         retrieval     (slot filling)    (slot        (missed lead)
        │              │             │             selected)         │
        │              ▼             ▼               │               ▼
        │          response ──► END  │               ▼         schedule + END
        └──────────────► ────────────┤          confirmation
                                     ▼               │
                                availability         ▼
                                     │        reminder scheduling
                                    END              │
                                                    END
```

Design decisions worth calling out:

1. **The booking path is deterministic.** The LLM never invents a time slot, price or confirmation. Slot
   selection is validated against freshly computed availability server-side, so a stale or forged slot is
   rejected.
2. **Retrieval before generation.** Keyword retrieval over the clinic's structured data runs first; the LLM
   receives only those facts and is instructed to answer from them or hand off to the front desk.
3. **Rules before the model.** Intent detection, entity extraction and slot filling are deterministic and
   testable. The LLM is a fallback classifier and a rephraser — so the system still works when it's
   unavailable (as the test suite proves).
4. **Every turn is auditable.** Each assistant message stores the workflow path it took (`intent_detection →
   knowledge_retrieval → response`), visible in the dashboard.

---

## Tech stack

**Frontend** — Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide ·
Recharts · React Flow (`@xyflow/react`) · PostHog (optional)

**Backend** — FastAPI · Python 3.12+ · Pydantic v2 · LangGraph · SQLAlchemy 2.0 · httpx · Uvicorn

**Data** — PostgreSQL (psycopg 3) in production, SQLite automatically in demo mode

**Integrations** — Groq or OpenAI (LLM) · Resend (email) · Twilio (SMS) · Cal.com (scheduling) ·
PostHog (analytics) — *every one optional*

---

## Project structure

```
dental/
├── backend/
│   ├── app/
│   │   ├── main.py              FastAPI app, middleware, lifespan, background worker
│   │   ├── config.py            Settings (env vars) + demo-mode fallbacks
│   │   ├── database.py          Engine/session (PostgreSQL or SQLite)
│   │   ├── models.py            SQLAlchemy models (12 tables)
│   │   ├── schemas.py           Pydantic request/response schemas + validation
│   │   ├── security.py          API-key auth, rate limiting, audit log
│   │   ├── knowledge_base.py    The fictional clinic's structured data (seed source)
│   │   ├── seed.py              Deterministic demo dataset
│   │   ├── agent/
│   │   │   ├── nlu.py           Intent classification + entity extraction
│   │   │   ├── knowledge.py     Knowledge-base documents + retrieval
│   │   │   ├── graph.py         LangGraph workflow (nodes + routing)
│   │   │   └── runner.py        One chat turn: load state → invoke graph → persist
│   │   ├── services/            llm · scheduler · notifications · automations · leads
│   │   └── routers/             chat · leads · appointments · followups · conversations
│   │                            analytics · automations · clinic · demo
│   ├── tests/                   pytest suite (26 tests)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (site)/          Patient website
│       │   ├── admin/           Dashboard (route-grouped shell) + login
│       │   ├── solutions/dental Agency landing page
│       │   └── api/             backend proxy + admin session routes
│       ├── components/
│       │   ├── chat/            Chat provider (incl. guided demo), panel, widgets, timeline
│       │   ├── site/            Header, footer, demo bar, shared sections
│       │   ├── booking/         3-step booking form
│       │   ├── admin/           Shell, KPI cards, charts, transcript viewer
│       │   └── ui/              shadcn/ui primitives
│       ├── lib/                 api client · types · site content · formatting · auth
│       └── proxy.ts             Admin route guard (Next.js 16 "proxy", formerly middleware)
├── docs/                        API.md · DEPLOYMENT.md · DEMO_SCRIPT.md
├── .env.example
├── render.yaml / railway.json
└── README.md
```

---

## Installation

**Prerequisites:** Node.js 20.9+, Python 3.11+ (3.12 recommended), npm. PostgreSQL is optional.

```bash
git clone <your-repo-url> dental
cd dental

# ── Backend ──────────────────────────────────────────────
cd backend
python -m venv .venv
# Windows:        .venv\Scripts\activate
# macOS / Linux:  source .venv/bin/activate
pip install -r requirements.txt

# ── Frontend ─────────────────────────────────────────────
cd ../frontend
npm install
```

No configuration is required to run the demo — skip straight to [Running locally](#running-locally).

---

## Environment variables

Copy `.env.example` to `backend/.env` (or the repo root) and `frontend/.env.local`, then fill in only what you
need. Everything is optional in demo mode.

| Variable | Where | Purpose |
|---|---|---|
| `DEMO_MODE` | backend | `true` simulates email/SMS/booking and enables demo endpoints |
| `DATABASE_URL` | backend | PostgreSQL URL; empty → local SQLite file |
| `GROQ_API_KEY` / `GROQ_MODEL` | backend | Primary LLM provider |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | backend | Alternative LLM provider |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | backend | Real email delivery |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | backend | Real SMS delivery |
| `CAL_API_KEY`, `CAL_EVENT_TYPE_ID` | backend | Real calendar availability + booking |
| `ADMIN_API_KEY` | backend + frontend | Protects admin endpoints (required when `DEMO_MODE=false`) |
| `CORS_ORIGINS` | backend | Comma-separated allowed origins |
| `RATE_LIMIT_PER_MINUTE`, `CHAT_RATE_LIMIT_PER_MINUTE` | backend | Request limits per IP |
| `ENABLE_SCHEDULER`, `SCHEDULER_INTERVAL_SECONDS` | backend | Background follow-up worker |
| `API_URL` | frontend | Backend URL used **server-side** by the proxy route |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | frontend | Password-protect `/admin` (unset = open, demo only) |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | frontend | Product analytics |
| `NEXT_PUBLIC_AGENCY_EMAIL`, `NEXT_PUBLIC_AGENCY_CALENDAR_URL` | frontend | Your contact details on `/solutions/dental` |

> **Never hard-code API keys.** Secrets live only in backend environment variables; the frontend only ever
> receives `NEXT_PUBLIC_*` values, and the admin key is attached server-side by the proxy route.

---

## Running locally

Two terminals:

```bash
# Terminal 1 — API on http://localhost:8000
cd backend
# activate the venv, then:
uvicorn app.main:app --reload --port 8000
```

```bash
# Terminal 2 — website on http://localhost:3000
cd frontend
npm run dev
```

On first start the backend creates the database schema and seeds the demo dataset automatically.

| URL | What it is |
|---|---|
| http://localhost:3000 | Patient website + AI receptionist |
| http://localhost:3000/book | Online booking |
| http://localhost:3000/admin | Clinic dashboard |
| http://localhost:3000/solutions/dental | Agency landing page |
| http://localhost:8000/docs | Interactive API documentation (Swagger UI) |

### Database setup

- **Demo (default):** nothing to do — SQLite at `backend/brightsmile_demo.db`, created and seeded on startup.
- **PostgreSQL:** create a database and set `DATABASE_URL`, e.g.
  `postgresql://brightsmile:password@localhost:5432/brightsmile`. Tables are created on startup and the demo
  dataset is seeded if the database is empty. (`postgres://` URLs from Render/Heroku are normalised
  automatically.)
- **Reset the data:** delete the SQLite file, or click **Reset demo data** in the dashboard
  (`POST /api/demo/reset`).

---

## Demo mode

`DEMO_MODE=true` (the default) makes the platform fully functional with **zero API keys**:

| Subsystem | Demo behaviour |
|---|---|
| AI answers | Rule-based, grounded in the knowledge base (an LLM is used if a key is present) |
| Availability | Deterministic mock scheduler built from the clinic's business hours |
| Bookings | Written to the database, labelled *Demo booking — no real appointment will be created* |
| Email | Logged as `[SIMULATED EMAIL]`, recorded as `SIMULATED` in the dashboard |
| SMS | Logged as `[SIMULATED SMS]`, recorded as `SIMULATED` |
| Analytics | Seeded dataset, clearly labelled **Demo Data** everywhere it appears |
| Admin auth | `demo-admin-key` accepted; `/admin` is open unless `ADMIN_PASSWORD` is set |

A **DEMO MODE** badge sits in the site header, the chat header, the dashboard header and on every booking.

To go live: set `DEMO_MODE=false`, provide `ADMIN_API_KEY`, and add the integration keys you want. Anything
still missing keeps using its safe fallback.

---

## The 12-step guided demo

Click **Run Demo** in the top bar (or open `/?demo=1`). It drives the **real** API end-to-end:

1. Visitor opens the website · 2. Asks about Invisalign · 3. AI answers from the knowledge base ·
4. Requests an appointment · 5. AI collects patient information · 6. Available appointments appear ·
7. Visitor selects one · 8. Appointment is created · 9. Confirmation appears ·
10. Lead appears in the dashboard · 11. Automation workflow updates · 12. Follow-up reminders are scheduled

It finishes with a summary dialog linking straight to the new lead and the automation center.
There's a second scripted scenario in the Automation Center: **Simulate missed lead** — an interested visitor
who leaves without booking, which schedules the follow-up automation.

A word-for-word script for demonstrating this to a dentist is in **[docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)**.

---

## Connecting the integrations

**Groq (recommended LLM)** — create a key at console.groq.com, then set `GROQ_API_KEY` (and optionally
`GROQ_MODEL`). Restart the backend; the dashboard sidebar will show the active provider. If the provider is
unreachable the receptionist silently falls back to knowledge-base answers.

**OpenAI** — set `OPENAI_API_KEY` (and `OPENAI_MODEL`). Used when no Groq key is present.

**Twilio (SMS)** — set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (E.164, e.g.
`+15125550142`) **and** `DEMO_MODE=false`. Until demo mode is off, messages stay simulated on purpose.

**Resend (email)** — set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (a verified domain, or
`onboarding@resend.dev` for testing) and `DEMO_MODE=false`.

**Cal.com (scheduling)** — create an event type, then set `CAL_API_KEY` and `CAL_EVENT_TYPE_ID` and
`DEMO_MODE=false`. Availability comes from Cal.com and bookings are written there; if a call fails, the
platform falls back to the built-in scheduler so a patient is never left without options.

**PostHog** — set `NEXT_PUBLIC_POSTHOG_KEY` (+ host). Events: `chat_opened`, `appointment_booked`,
`followup_scheduled`, `contact_form_submitted`, `demo_started`, `demo_completed`.

Check **Settings → API integrations** in the dashboard to see what's connected, in demo mode, or missing.

---

## API documentation

Interactive docs ship with the backend at **`/docs`** (Swagger UI) and **`/redoc`**.
A written reference with request/response examples is in **[docs/API.md](docs/API.md)**.

```
POST   /api/chat                        Talk to the AI receptionist (public)
POST   /api/chat/{id}/end               Visitor left — trigger missed-lead follow-up (public)
GET    /api/clinic                      Clinic profile, services, FAQs (public)
POST   /api/clinic                      Update clinic settings (admin)
GET    /api/appointments/availability   Open slots for a service (public)
POST   /api/appointments                Book an appointment (public)
GET    /api/appointments                List appointments (admin)
PATCH  /api/appointments/{id}           Update appointment status (admin)
POST   /api/leads                       Contact-form lead (public)
GET    /api/leads                       List/filter/search leads (admin)
GET    /api/leads/{id}                  Lead + transcripts + automations (admin)
PATCH  /api/leads/{id}                  Update status / notes (admin)
GET    /api/conversations               AI conversations (admin)
GET    /api/conversations/{id}          Full transcript with workflow trace (admin)
GET    /api/followups                   Scheduled / sent messages (admin)
POST   /api/followups                   Schedule a follow-up (admin)
POST   /api/followups/{id}/send         Send one now (admin)
POST   /api/followups/process           Process everything due (admin)
GET    /api/automations                 Automations + config (admin)
POST   /api/automations                 Create/update/pause an automation (admin)
GET    /api/automations/events          Automation activity log (admin)
GET    /api/analytics                   KPIs, series, funnel, breakdowns (admin)
GET    /api/integrations                Integration status, never secrets (admin)
GET    /api/status  ·  /api/health      Runtime status (public)
POST   /api/demo/reset                  Re-seed the demo dataset (admin, demo mode only)
POST   /api/demo/missed-lead            Simulate an abandoned inquiry (admin)
```

Admin endpoints require `X-API-Key`. In demo mode that key is `demo-admin-key`:

```bash
curl -s http://localhost:8000/api/analytics -H "X-API-Key: demo-admin-key" | jq .kpis
```

---

## Testing

```bash
cd backend
pytest -q          # 26 tests: receptionist flows, booking, automations, security, validation
```

The suite runs against an isolated SQLite database with **no** API keys configured, which also proves the
whole product works in pure demo mode. It covers grounded answers, the Invisalign booking journey, emergency
triage and red-flag warnings, the medical-advice disclaimer, missed-lead follow-up, mid-flow questions,
slot validation, admin authentication, rate limiting and input validation.

Frontend checks:

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

---

## Security

Implemented here:

- **Environment variables for every secret**; nothing sensitive reaches the browser bundle
- **Server-side proxy** for all API calls, with an explicit public-endpoint allow-list
- **API-key authentication** on every admin endpoint (constant-time comparison)
- **Optional password protection** for `/admin` with an HMAC-signed, HttpOnly session cookie
- **Input validation** everywhere via Pydantic (lengths, formats, enums, phone/email normalisation)
- **Rate limiting** per IP with a stricter bucket for the chat endpoint
- **CORS** restricted to configured origins; `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
  and `Cache-Control: no-store` on every response
- **Audit logging** of admin actions, bookings and failed authentications
- **Safe-by-default demo**: no real messages are sent and every form warns against entering real patient data

For a real practice you would additionally need: a HIPAA compliance review and business associate agreements
with each vendor, encryption at rest, per-user accounts with RBAC and MFA, log redaction, a Redis-backed rate
limiter, and a managed job queue.

---

## Deployment

Full instructions (including free-tier notes) are in **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

**Frontend → Vercel**

1. Push this repository to GitHub.
2. Import it in Vercel and set the **root directory** to `frontend`.
3. Environment variables: `API_URL` (your deployed backend), `ADMIN_API_KEY` (same as the backend),
   optionally `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY`.
4. Deploy.

**Backend → Render** (blueprint included)

1. New → Blueprint → select the repo. `render.yaml` provisions the web service and a PostgreSQL database.
2. Set `CORS_ORIGINS` and `PUBLIC_SITE_URL` to your Vercel URL; add integration keys if you want them live.
3. Deploy, then point the frontend's `API_URL` at the Render URL.

**Backend → Railway** — `railway.json` builds `backend/Dockerfile`; add a PostgreSQL plugin and Railway
injects `DATABASE_URL` automatically.

---

## Future improvements

- Embeddings + pgvector once the knowledge base outgrows BM25 + keyword scoring
- Multi-tenant support (multiple clinics behind one deployment)
- Two-way SMS so patients can confirm/reschedule by replying
- Real practice-management integrations (Dentrix, Open Dental, Eaglesoft)
- Voice receptionist for phone calls
- Staff accounts with roles, plus a proper job queue (Celery/RQ) and Redis-backed rate limiting
- Full Spanish NLU (the demo currently detects Spanish and can reply in Spanish when an LLM is on)

---

## Disclaimer

**BrightSmile Dental is a fictional practice.** The team members, patients, testimonials, reviews and every
figure in the dashboard are demonstration data generated for this project. Photographs are licensed stock
images and do not depict the fictional staff described.

This project is a **software portfolio demonstration**, not a medical product. It does not provide medical or
dental advice, is not HIPAA compliant, and must not be used to process protected health information. Brand
names (Invisalign, CareCredit, Delta Dental, Cal.com, Twilio, Resend, Groq, OpenAI, PostHog) belong to their
respective owners and are referenced for demonstration purposes only.

---

Built as a portfolio project demonstrating AI automation for dental practices.
