// Marketing content for Bright Dental Clinic, Dar es Salaam.
// The online assistant's knowledge base lives in backend/app/knowledge_base.py
// and mirrors these facts.

export const clinic = {
  name: "Bright Dental Clinic",
  tagline: "Smile Better With Us! Your Smile Is Our Priority.",
  slogan: "Smile Better With Us",
  phone: "0673 445 270",
  phoneHref: "tel:+255673445270",
  email: "",
  address: "Mbezi Beach, Ndumbwi, near Makonde Bus Stop",
  cityLine: "Dar es Salaam, Tanzania",
  neighborhood: "Mbezi Beach & Mwenge, Dar es Salaam",
  mapsQuery: "Makonde Bus Stop Mbezi Beach Dar es Salaam",
  locations: [
    { name: "Mbezi Beach", address: "Mbezi Beach, Ndumbwi, near Makonde Bus Stop" },
    { name: "Mwenge", address: "Mwenge Stand Kuu ya Mabasi, second floor, inside BF SUMA" },
  ],
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
    { name: "Bright Dental Membership", detail: "$29/month for patients without insurance: two cleanings, exams, X-rays and 15% off treatment." },
  ],
}

export type ServiceSlug = "checkup-consultation" | "tooth-extraction" | "dental-fillings" | "scaling-polishing" | "root-canal" | "dentures" | "orthodontics-braces"

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

const commonBenefits = [
  { title: "Modern equipment", body: "Clean, modern tools for safe and comfortable treatment." },
  { title: "Professional care", body: "An experienced team that explains everything clearly." },
  { title: "Affordable services", body: "Fair prices, explained before any treatment begins." },
]

const commonSteps = [
  { title: "Book your visit", body: "Call 0673 445 270 or book online." },
  { title: "Examination", body: "We check your teeth and listen to your concerns." },
  { title: "Your plan", body: "We explain the treatment and the cost upfront." },
  { title: "Treatment & aftercare", body: "Comfortable treatment and clear aftercare advice." },
]

export const services: ServiceContent[] = [
  {
    slug: "checkup-consultation",
    name: "Dental Check-up & Consultation",
    short: "A full oral examination and an honest conversation about your teeth and gums.",
    headline: "Regular check-ups keep small problems small.",
    intro: "We examine your teeth and gums, answer your questions and explain any treatment you may need \u2014 clearly, and before anything begins.",
    image: "/images/african-family.webp",
    imageAlt: "Dental Check-up & Consultation at Bright Dental Clinic",
    icon: "stethoscope",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "About 30 minutes",
    benefits: commonBenefits,
    treatments: ["Full oral examination", "Consultation & advice", "Treatment planning", "Children & adults"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I'd like to book a check-up",
  },
  {
    slug: "tooth-extraction",
    name: "Tooth Extraction (Adult & Child)",
    short: "Gentle, careful removal of damaged or painful teeth for adults and children.",
    headline: "Relief from a painful tooth, done gently.",
    intro: "When a tooth cannot be saved, we remove it carefully with local anaesthesia and give you clear aftercare instructions.",
    image: "/images/african-consultation.webp",
    imageAlt: "Tooth Extraction (Adult & Child) at Bright Dental Clinic",
    icon: "siren",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "About 30\u201345 minutes",
    benefits: commonBenefits,
    treatments: ["Adult extractions", "Child extractions", "Local anaesthesia", "Aftercare advice"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I need a tooth extraction",
  },
  {
    slug: "dental-fillings",
    name: "Dental Fillings",
    short: "Repair cavities and restore your tooth's strength and shape.",
    headline: "Stop decay early and save your tooth.",
    intro: "A filling repairs a tooth damaged by decay. We clean out the cavity and restore the tooth so you can eat comfortably again.",
    image: "/images/african-dental-hero.webp",
    imageAlt: "Dental Fillings at Bright Dental Clinic",
    icon: "stethoscope",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "About 30\u201360 minutes",
    benefits: commonBenefits,
    treatments: ["Cavity treatment", "Tooth-coloured fillings", "Repair of chipped teeth"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I need a filling",
  },
  {
    slug: "scaling-polishing",
    name: "Scaling & Polishing",
    short: "Professional cleaning that removes tartar and stains for fresh, healthy gums.",
    headline: "A cleaner, brighter, healthier smile.",
    intro: "Scaling removes hardened plaque (tartar) that brushing can't, and polishing leaves your teeth smooth and bright.",
    image: "/images/african-dental-hero.webp",
    imageAlt: "Scaling & Polishing at Bright Dental Clinic",
    icon: "sparkles",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "About 45 minutes",
    benefits: commonBenefits,
    treatments: ["Tartar removal", "Stain removal", "Polishing", "Gum health advice"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I'd like scaling and polishing",
  },
  {
    slug: "root-canal",
    name: "Root Canal Treatment",
    short: "Save an infected or badly damaged tooth and stop the pain.",
    headline: "Save your natural tooth.",
    intro: "Root canal treatment removes infection from inside the tooth, relieves pain and lets you keep your natural tooth.",
    image: "/images/african-consultation.webp",
    imageAlt: "Root Canal Treatment at Bright Dental Clinic",
    icon: "anchor",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "One or more visits",
    benefits: commonBenefits,
    treatments: ["Infection treatment", "Pain relief", "Tooth restoration"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I think I need a root canal",
  },
  {
    slug: "dentures",
    name: "Dentures (By Choice)",
    short: "Comfortable, natural-looking replacement teeth \u2014 the type is your choice.",
    headline: "Replace missing teeth, your way.",
    intro: "We help you choose the dentures that suit you, take measurements and fit them for comfort, so you can smile and eat with confidence.",
    image: "/images/african-family.webp",
    imageAlt: "Dentures (By Choice) at Bright Dental Clinic",
    icon: "smile",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "Several visits",
    benefits: commonBenefits,
    treatments: ["Partial dentures", "Full dentures", "Fitting & adjustments"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I'm interested in dentures",
  },
  {
    slug: "orthodontics-braces",
    name: "Orthodontic Treatment (Braces)",
    short: "Braces to straighten teeth and correct your bite.",
    headline: "Straighter teeth, a confident smile.",
    intro: "Braces gently move teeth into the right position over time. We start with an assessment and explain the plan and costs clearly.",
    image: "/images/african-dental-hero.webp",
    imageAlt: "Orthodontic Treatment (Braces) at Bright Dental Clinic",
    icon: "smile",
    priceNote: "We explain the cost before treatment begins. Call 0673 445 270 for details.",
    duration: "Assessment about 45 minutes",
    benefits: commonBenefits,
    treatments: ["Assessment", "Braces fitting", "Regular adjustments", "Retainers"],
    steps: commonSteps,
    faqs: [
      { q: "How do I book?", a: "Call 0673 445 270 or book online. We are at Mbezi Beach (Ndumbwi, near Makonde Bus Stop) and Mwenge (inside BF SUMA, second floor)." },
    ],
    chatPrompt: "I'm interested in braces",
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)

export const team = [
  {
    name: "Dr. Emily Carter, DDS",
    role: "Founder & General Dentist",
    image: "/images/african-dentist-woman.webp",
    bio: "Dr. Carter founded Bright Dental Clinic to make dental visits feel calm, clear and unhurried. She focuses on preventive and family dentistry.",
    focus: ["Family dentistry", "Preventive care", "Crowns & fillings"],
  },
  {
    name: "Dr. Marcus Reed, DMD",
    role: "Implant & Restorative Dentist",
    image: "/images/african-dentist-man.webp",
    bio: "Dr. Reed leads our implant program, using 3D planning to restore missing teeth with predictable, natural-looking results.",
    focus: ["Dental implants", "Full-arch restorations", "Bridges"],
  },
  {
    name: "Dr. Priya Nair, DDS",
    role: "Cosmetic Dentist & Invisalign Provider",
    image: "/images/african-dentist-young-woman.webp",
    bio: "Dr. Nair helps patients plan cosmetic and orthodontic treatment with digital previews, so there are no surprises.",
    focus: ["Invisalign", "Veneers", "Whitening"],
  },
  {
    name: "Daniel Ortiz, RDH",
    role: "Lead Dental Hygienist",
    image: "/images/african-hygienist-man.webp",
    bio: "Daniel is known for gentle cleanings and clear explanations — and for putting nervous patients at ease.",
    focus: ["Cleanings", "Periodontal care", "Patient education"],
  },
]

// Clearly fictional sample testimonials — shown with a "Demo testimonial" label.
export const testimonials = [
  { name: "Sarah M.", detail: "Invisalign patient", quote: "The online assistant answered my insurance question at 10 PM and booked my consultation in two minutes. The team was just as easy to deal with in person." },
  { name: "James T.", detail: "Emergency visit", quote: "Cracked a tooth on a Saturday morning and was seen before noon. They explained everything before doing anything." },
  { name: "Priscilla R.", detail: "Family patient", quote: "We book all three kids back-to-back. Reminders by text mean we haven't missed a single appointment." },
]

export const faqs = [
  { q: "Do you accept my insurance?", a: "We're in-network with most major PPO plans, including Delta Dental, Cigna, Aetna, MetLife, Guardian, United Concordia, Blue Cross Blue Shield and Humana. We'll verify your benefits before your visit." },
  { q: "What if I don't have insurance?", a: "Our new patient special is $129 for an exam, cleaning and X-rays. The Bright Dental Membership ($29/month) covers preventive care and gives 15% off treatment." },
  { q: "Do you offer financing?", a: "Ask us about paying in instalments." },
  { q: "Can I get a same-day emergency appointment?", a: "We reserve emergency appointments every weekday and will do our best to see you the same day." },
  { q: "What are your hours?", a: "Mon, Tue & Thu 8–5, Wed 8–6, Fri 8–3, Sat 9–1. Closed Sundays." },
  { q: "Where are you located?", a: "We have two locations: Mbezi Beach, Ndumbwi, near Makonde Bus Stop — and Mwenge Stand Kuu ya Mabasi, second floor, inside BF SUMA." },
  { q: "Do you see children?", a: "Yes, from age 3. Many families book back-to-back appointments." },
  { q: "I'm nervous about the dentist. Can you help?", a: "Absolutely. Let us know — we'll go at your pace and discuss comfort options such as nitrous oxide for eligible patients." },
  { q: "Is the chat answered by a person?", a: "No. Our online assistant is automated: it answers common questions and books appointments. It doesn't give medical advice — clinical decisions are always made by our dentists." },
]
