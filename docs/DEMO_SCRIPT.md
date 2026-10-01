# Demo script — showing this to a dental practice

A 6–8 minute walkthrough. Two tabs open before you start: the **patient website** (`/`) and the
**clinic dashboard** (`/admin`). Click **Reset demo data** in the dashboard beforehand so the numbers are clean.

> Keep saying "this is a demo clinic" — the honesty is part of the pitch, and the DEMO badges do the work
> for you.

---

## 0 · Frame it (20 seconds)

> "I build AI receptionists for dental practices. Rather than talk about it, I've built a complete working
> practice — fictional clinic, real software — so you can see exactly what patients would experience and what
> your front desk would see. Nothing here is a mockup; everything I click is live."

---

## 1 · The patient's view (60 seconds)

Open `/`, scroll slowly through the homepage.

> "This is the part patients see: services, your dentists, insurance, financing. It's the assistant in the
> corner that changes the economics."

Point at the chat launcher.

> "When your front desk is with a patient, or it's 9 PM on a Sunday, this is what answers."

---

## 2 · The guided demo (~2 minutes)

Click **Run Demo** in the top bar and narrate the steps as they appear.

| On screen | What to say |
|---|---|
| Steps 1–2 | "They're on the Invisalign page. Ava already knows that, and the answer comes from *your* practice information — it cannot invent facts. If it doesn't know, it hands them to the front desk with your phone number." |
| Steps 3–4 | "It offers a consult, then collects what your team would ask on the phone: new or existing patient, name, mobile, email, insurance, how soon." |
| Steps 5–7 | "Real availability — filtered to your hours and the right dentist. They pick a time, get confirmed, and reminders are scheduled. Still 9 PM. Nobody at the practice lifted a finger." |
| Steps 8–10 | "Plans change. They ask to move it. Ava finds the visit from this chat and offers new times — same scheduler, still no invented slots." |
| Steps 11–12 | "They want a person. The bot parks. Open **AI Conversations**, filter Waiting staff, type a reply — it shows up in the website chat. Then Return to AI." |

Close the summary dialog with **View lead in dashboard**.

---

## 3 · What the practice sees (2 minutes)

**Lead record** — the page you just landed on.

> "Here's that patient. Contact details, treatment interest, insurance, urgency — and the full transcript, so
> your team knows exactly what was promised. Scored HOT because they booked."

**Leads list** (`/admin/leads`)

> "Every inquiry in one pipeline: new, qualified, booked, follow-up, converted. Filter, search, export to CSV
> for your practice management system."

**AI Conversations** (`/admin/conversations`)

> "Every conversation is logged, including the workflow path. If someone asks to talk to a person, it shows
> up here as waiting for staff — you type a reply and the visitor sees it live, then you can hand it back to
> the AI."

**Appointments** (`/admin/appointments`)

> "Today, upcoming and past. Mark someone completed and the review request fires; cancel and the reminders stop."

---

## 4 · The automations — the real value (2 minutes)

Open `/admin/automations`.

> "Six automations run in the background. Confirmations, reminders 24 hours and 2 hours before — that's your
> no-show rate. And this one is the one practices feel most:"

Point at **Missed Lead Follow-up**, then click **Simulate missed lead**.

> "Somebody asked about implants, gave their details and left without booking. Today that inquiry disappears.
> Here, the lead is saved and a follow-up is scheduled automatically — 'Hi Morgan, you were interested in
> dental implants, would you like help finding a time?' You choose the timing and the wording."

Open the toast's **View lead**, then go to `/admin/automations/builder`.

> "This is the whole patient journey. The solid path is booking; the dashed path is recovering the ones who
> don't book. And these delay steps are live settings — change the follow-up from 24 hours to 4 and it applies
> immediately."

Change the delay dropdown to demonstrate.

---

## 5 · Numbers & control (60 seconds)

`/admin/analytics`

> "Visitors, conversations, qualified leads, appointments, and the funnel between them. To be clear: these are
> demonstration numbers from the seeded dataset, not results from a real practice — I'm showing you the
> reporting, not a promise. Notice this chart though: the share of conversations that start outside office
> hours. That's the demand your website currently can't answer."

`/admin/settings`

> "Everything is yours to control — hours, appointment lengths, what the assistant asks, the exact wording of
> the texts and emails. And the keys stay in your accounts; you own the whole stack."

---

## 6 · Close (30 seconds)

> "That's the system: it answers patients, qualifies them, books them, reminds them and follows up when they
> don't book. Setup on your existing website starts at $199; the full platform with SMS, calendar integration
> and the dashboard is quoted per practice.
>
> If it's useful, the next step is 20 minutes where I build this against *your* services, insurance list and
> hours, so you can see your own clinic answering patients."

---

## Handling the usual questions

**"Will it say something wrong to my patients?"**
> "It answers only from the information you give it — services, hours, insurance, pricing. It never diagnoses
> or recommends treatment; clinical questions get 'a dentist needs to examine you' and an appointment. Try to
> break it — ask it something you'd never want it to answer."
> *(Then actually do it in the chat: "Should I take antibiotics for my toothache?")*

**"Is it HIPAA compliant?"**
> "This public demo is not, and it says so on the site. For your practice that means a compliance review,
> signed agreements with each vendor, encryption and access controls — I scope and quote that separately.
> I'd rather tell you that now than after you've signed."

**"Does it replace my front desk?"**
> "No — it removes the repetitive questions and the after-hours gap. Your team still does the work that needs
> a person, and every conversation is handed to them with the details already collected."

**"What if a patient wants a human?"**
> "They ask, and the assistant gives them your number straight away." *(Type "I want to speak to a person".)*

**"How long does setup take?"**
> "Typically one to two weeks: knowledge base from your website and price list, calendar connection, message
> wording, then a walkthrough with your team."

---

## Pre-demo checklist

- [ ] Backend and frontend both running (`/api/health` returns ok)
- [ ] **Reset demo data** clicked
- [ ] Two tabs ready: `/` and `/admin`
- [ ] Sound off, notifications off, browser zoom at 100%
- [ ] If the practice has a name you're pitching, have `knowledge_base.py` ready to show how their content
      would slot in
