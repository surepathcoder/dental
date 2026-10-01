// Marketing content for the FICTIONAL BrightSmile Dental practice.
// The AI receptionist's knowledge base lives in backend/app/knowledge_base.py
// and mirrors these facts.

export const clinic = {
  name: "BrightSmile Dental",
  tagline: "Modern dental care. Made simple.",
  phone: "(512) 555-0142",
  phoneHref: "tel:+15125550142",
  email: "hello@brightsmile.example",
  address: "4120 Bright Leaf Blvd, Suite 200",
  cityLine: "Austin, TX 78731",
  neighborhood: "Northwest Hills, Austin",
  mapsQuery: "Northwest Hills Austin TX",
  hours: [
    { day: "Monday", hours: "8:00 AM – 5:00 PM" },
    { day: "Tuesday", hours: "8:00 AM – 5:00 PM" },
    { day: "Wednesday", hours: "8:00 AM – 6:00 PM" },
    { day: "Thursday", hours: "8:00 AM – 5:00 PM" },
    { day: "Friday", hours: "8:00 AM – 3:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 1:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  insurance: ["Delta Dental", "Cigna", "Aetna", "MetLife", "Guardian", "United Concordia", "Blue Cross Blue Shield", "Humana"],
  financing: [
    { name: "CareCredit", detail: "Flexible monthly payments, with promotional financing on qualifying treatment." },
    { name: "Sunbit", detail: "Quick approval at the front desk with transparent monthly plans." },
    { name: "BrightSmile Membership", detail: "$29/month for patients without insurance: two cleanings, exams, X-rays and 15% off treatment." },
  ],
}

export type ServiceSlug = "general-dentistry" | "cosmetic-dentistry" | "dental-implants" | "invisalign" | "emergency-dentistry"

export interface ServiceContent {
  slug: ServiceSlug
  name: string
  short: string
  headline: string
  intro: string
  image: string
  imageAlt: string
  icon: "stethoscope" | "sparkles" | "anchor" | "smile" | "siren"
  priceNote: string
  duration: string
  benefits: { title: string; body: string }[]
  treatments: string[]
  steps: { title: string; body: string }[]
  faqs: { q: string; a: string }[]
  chatPrompt: string
}

export const services: ServiceContent[] = [
  {
    slug: "general-dentistry",
    name: "General Dentistry",
    short: "Exams, cleanings, X-rays, fillings and preventive care for the whole family.",
    headline: "Preventive care that keeps small problems small.",
    intro:
      "Regular checkups are the foundation of a healthy smile. Our hygienists and dentists take the time to explain what we see, answer your questions, and build a prevention plan that fits your life.",
    image: "/images/general.jpg",
    imageAlt: "Dentist examining a patient's teeth",
    icon: "stethoscope",
    priceNote: "Most in-network PPO plans cover exams, cleanings and X-rays at 100%. Self-pay new patient special: $129.",
    duration: "About 60 minutes for new patients",
    benefits: [
      { title: "Unhurried visits", body: "A full hour for new patients, so nothing feels rushed." },
      { title: "Low-radiation digital X-rays", body: "Clear images on-screen that we walk through together." },
      { title: "Family scheduling", body: "Back-to-back appointments for kids (from age 3) and adults." },
    ],
    treatments: ["Comprehensive exams", "Professional cleanings", "Digital X-rays", "Tooth-colored fillings", "Crowns", "Root canal therapy", "Night guards", "Oral cancer screening"],
    steps: [
      { title: "Book online or with Ava", body: "Pick a time that works — early mornings and Saturdays available." },
      { title: "Quick digital check-in", body: "Complete intake forms from your phone before you arrive." },
      { title: "Exam & cleaning", body: "X-rays, a thorough exam and cleaning, and time for questions." },
      { title: "Your plan", body: "A clear, prioritized plan with costs explained upfront." },
    ],
    faqs: [
      { q: "How often should I have a checkup?", a: "Most patients visit every six months. Your dentist may recommend a different schedule based on your needs." },
      { q: "Do you see children?", a: "Yes — we see children from age 3, as well as teens and adults." },
      { q: "What should I bring to my first visit?", a: "A photo ID and your insurance card. We'll send digital forms before your appointment." },
    ],
    chatPrompt: "I'd like to book a cleaning and checkup",
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    short: "Professional whitening, porcelain veneers, bonding and smile makeovers.",
    headline: "A brighter, more confident smile — designed with you.",
    intro:
      "Whether you want a whiter shade for a big event or a complete smile makeover, we start with a conversation about your goals and show you realistic options before any treatment begins.",
    image: "/images/cosmetic.jpg",
    imageAlt: "Smiling woman outdoors",
    icon: "sparkles",
    priceNote: "In-office whitening from $349. Veneers are quoted per tooth after a complimentary consultation.",
    duration: "45-minute complimentary consultation",
    benefits: [
      { title: "Complimentary consultation", body: "Talk through goals, options and pricing with no obligation." },
      { title: "Natural-looking results", body: "Shade and shape matched to your face, not a one-size-fits-all look." },
      { title: "Financing available", body: "Spread the cost with CareCredit or Sunbit." },
    ],
    treatments: ["Professional teeth whitening", "Porcelain veneers", "Cosmetic bonding", "Smile makeovers", "Gum contouring", "Tooth-colored restorations"],
    steps: [
      { title: "Smile consultation", body: "We listen to your goals and take photos and a digital scan." },
      { title: "Preview your options", body: "See what's realistic, how long it takes and what it costs." },
      { title: "Treatment", body: "Comfortable visits, scheduled around your calendar." },
      { title: "Aftercare", body: "Simple tips to keep results looking their best." },
    ],
    faqs: [
      { q: "Is teeth whitening safe?", a: "Professional whitening supervised by a dentist is widely used. Your dentist will check whether it's appropriate for you." },
      { q: "How long do veneers last?", a: "Longevity varies by patient and habits; your dentist will discuss what to expect during your consultation." },
      { q: "Is the cosmetic consultation free?", a: "Yes, cosmetic consultations are complimentary." },
    ],
    chatPrompt: "I'm interested in teeth whitening",
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    short: "Permanent, natural-looking replacements for missing teeth — from single implants to full-arch.",
    headline: "Replace missing teeth with confidence.",
    intro:
      "Dental implants are a long-term solution for missing teeth. Your consultation includes a 3D scan and a written plan with transparent pricing, so you can make the decision that's right for you.",
    image: "/images/implants.jpg",
    imageAlt: "Dentist reviewing dental X-rays",
    icon: "anchor",
    priceNote: "Single implants (post, abutment and crown) typically start around $3,200. Exact quote after your consultation and 3D scan.",
    duration: "60-minute consultation with 3D CBCT scan",
    benefits: [
      { title: "3D-guided planning", body: "CBCT imaging helps plan precise, predictable placement." },
      { title: "One team, start to finish", body: "Placement and restoration coordinated in the same practice." },
      { title: "Transparent pricing", body: "A written plan with every cost itemized before you commit." },
    ],
    treatments: ["Single-tooth implants", "Implant-supported bridges", "Implant-retained dentures", "Full-arch restorations", "Bone grafting (when needed)"],
    steps: [
      { title: "Consultation & 3D scan", body: "We assess bone, bite and your goals." },
      { title: "Written treatment plan", body: "Timeline, costs and financing options — in writing." },
      { title: "Implant placement", body: "Performed comfortably with local anesthesia." },
      { title: "Your new tooth", body: "A custom crown is placed once the implant has healed." },
    ],
    faqs: [
      { q: "Am I a candidate for implants?", a: "Many adults are, but only an exam and 3D scan can determine that. Your dentist will review the results with you." },
      { q: "How long does the process take?", a: "It varies by case. Your written plan will include an estimated timeline." },
      { q: "Do you offer financing for implants?", a: "Yes — through CareCredit and Sunbit, with options reviewed during your consultation." },
    ],
    chatPrompt: "I'm interested in dental implants",
  },
  {
    slug: "invisalign",
    name: "Invisalign",
    short: "Clear aligners to straighten your teeth discreetly — with a free 3D smile scan.",
    headline: "Straighter teeth, without metal braces.",
    intro:
      "Invisalign uses a series of custom clear aligners to gradually move your teeth. Start with a complimentary consultation and 3D scan to see a preview of your projected results.",
    image: "/images/invisalign.jpg",
    imageAlt: "Person placing a clear aligner",
    icon: "smile",
    priceNote: "Treatment typically ranges from $3,500 to $6,500. Consultations and 3D scans are complimentary. Many PPO plans include orthodontic benefits.",
    duration: "45-minute complimentary consultation",
    benefits: [
      { title: "Free iTero 3D scan", body: "No messy impressions — and a digital preview of your results." },
      { title: "Fits your routine", body: "Removable aligners for eating, brushing and special occasions." },
      { title: "Monthly payment options", body: "Insurance benefits plus flexible financing." },
    ],
    treatments: ["Invisalign for adults", "Invisalign for teens", "Retainers", "Minor tooth movement", "Refinement aligners"],
    steps: [
      { title: "Free consultation", body: "Exam, 3D scan and a preview of your projected smile." },
      { title: "Custom aligners", body: "Your aligners are made from your 3D scan." },
      { title: "Check-ins", body: "Quick progress visits every 6–8 weeks." },
      { title: "Retainers", body: "Keep your new smile in place." },
    ],
    faqs: [
      { q: "How long does Invisalign take?", a: "It depends on your case. Your consultation includes an estimated timeline." },
      { q: "Does insurance cover Invisalign?", a: "Many PPO plans include orthodontic benefits. We'll check your coverage for you." },
      { q: "How many hours a day do I wear aligners?", a: "Your provider will give you specific instructions for your treatment plan." },
    ],
    chatPrompt: "I want Invisalign",
  },
  {
    slug: "emergency-dentistry",
    name: "Emergency Dentistry",
    short: "Same-day appointments for toothaches, broken teeth, swelling and dental injuries.",
    headline: "In pain? We keep time open for you today.",
    intro:
      "We reserve appointments every weekday for dental emergencies. Reach out as early as possible and we'll do our best to see you the same day.",
    image: "/images/emergency.jpg",
    imageAlt: "Dentist holding dental instruments",
    icon: "siren",
    priceNote: "Emergency exams with a focused X-ray start at $95 for self-pay patients and are often covered by insurance.",
    duration: "30-minute emergency visit",
    benefits: [
      { title: "Same-day appointments", body: "Emergency time is reserved every weekday." },
      { title: "Relief first", body: "We focus on getting you comfortable, then explain your options." },
      { title: "Clear next steps", body: "A written plan and costs before any follow-up treatment." },
    ],
    treatments: ["Severe toothaches", "Cracked or broken teeth", "Knocked-out teeth", "Lost fillings or crowns", "Dental swelling", "Broken dentures"],
    steps: [
      { title: "Reach out", body: "Call, or tell Ava what's happening — any time of day." },
      { title: "Same-day visit", body: "We fit you into a reserved emergency slot." },
      { title: "Diagnosis & relief", body: "Exam and X-ray to understand what's going on." },
      { title: "Follow-up plan", body: "Options and costs explained before any further treatment." },
    ],
    faqs: [
      { q: "What counts as a dental emergency?", a: "Severe pain, a broken or knocked-out tooth, swelling, or a lost filling or crown are common reasons to call." },
      { q: "When should I go to the ER instead?", a: "If you have difficulty breathing or swallowing, severe bleeding, major facial trauma or swelling spreading to your eye or neck, call 911 or go to the nearest emergency room." },
      { q: "Can I be seen on Saturday?", a: "We're open Saturdays 9 AM–1 PM and will do our best to fit emergencies in." },
    ],
    chatPrompt: "I have a dental emergency",
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)

export const team = [
  {
    name: "Dr. Emily Carter, DDS",
    role: "Founder & General Dentist",
    image: "/images/team-carter.jpg",
    bio: "Dr. Carter founded BrightSmile to make dental visits feel calm, clear and unhurried. She focuses on preventive and family dentistry.",
    focus: ["Family dentistry", "Preventive care", "Crowns & fillings"],
  },
  {
    name: "Dr. Marcus Reed, DMD",
    role: "Implant & Restorative Dentist",
    image: "/images/team-reed.jpg",
    bio: "Dr. Reed leads our implant program, using 3D planning to restore missing teeth with predictable, natural-looking results.",
    focus: ["Dental implants", "Full-arch restorations", "Bridges"],
  },
  {
    name: "Dr. Priya Nair, DDS",
    role: "Cosmetic Dentist & Invisalign Provider",
    image: "/images/team-nair.jpg",
    bio: "Dr. Nair helps patients plan cosmetic and orthodontic treatment with digital previews, so there are no surprises.",
    focus: ["Invisalign", "Veneers", "Whitening"],
  },
  {
    name: "Daniel Ortiz, RDH",
    role: "Lead Dental Hygienist",
    image: "/images/team-ortiz.jpg",
    bio: "Daniel is known for gentle cleanings and clear explanations — and for putting nervous patients at ease.",
    focus: ["Cleanings", "Periodontal care", "Patient education"],
  },
]

// Clearly fictional sample testimonials — shown with a "Demo testimonial" label.
export const testimonials = [
  { name: "Sarah M.", detail: "Invisalign patient", quote: "The AI assistant answered my insurance question at 10 PM and booked my consultation in two minutes. The team was just as easy to deal with in person." },
  { name: "James T.", detail: "Emergency visit", quote: "Cracked a tooth on a Saturday morning and was seen before noon. They explained everything before doing anything." },
  { name: "Priscilla R.", detail: "Family patient", quote: "We book all three kids back-to-back. Reminders by text mean we haven't missed a single appointment." },
]

export const faqs = [
  { q: "Do you accept my insurance?", a: "We're in-network with most major PPO plans, including Delta Dental, Cigna, Aetna, MetLife, Guardian, United Concordia, Blue Cross Blue Shield and Humana. We'll verify your benefits before your visit." },
  { q: "What if I don't have insurance?", a: "Our new patient special is $129 for an exam, cleaning and X-rays. The BrightSmile Membership ($29/month) covers preventive care and gives 15% off treatment." },
  { q: "Do you offer financing?", a: "Yes, through CareCredit and Sunbit, with flexible monthly payment options." },
  { q: "Can I get a same-day emergency appointment?", a: "We reserve emergency appointments every weekday and will do our best to see you the same day." },
  { q: "What are your hours?", a: "Mon, Tue & Thu 8–5, Wed 8–6, Fri 8–3, Sat 9–1. Closed Sundays." },
  { q: "Where do I park?", a: "Free covered parking is available in front of the building at 4120 Bright Leaf Blvd." },
  { q: "Do you see children?", a: "Yes, from age 3. Many families book back-to-back appointments." },
  { q: "I'm nervous about the dentist. Can you help?", a: "Absolutely. Let us know — we'll go at your pace and discuss comfort options such as nitrous oxide for eligible patients." },
  { q: "Is the AI receptionist a real person?", a: "No. Ava is an AI assistant that answers common questions and books appointments. It doesn't give medical advice — clinical decisions are always made by our dentists." },
]
