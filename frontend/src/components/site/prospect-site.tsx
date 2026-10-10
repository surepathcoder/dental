"use client"

import Image from "next/image"
import { ArrowDown, ArrowDownRight, ArrowUpRight, CalendarCheck, Clock, Loader2, MapPin, MessageCircle, Phone, Plus } from "lucide-react"

import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatProvider, useChat } from "@/components/chat/chat-provider"
import { ToothMark } from "@/components/brand/logo"
import { BrandTheme, ClinicProvider, useClinic } from "@/components/site/clinic-provider"
import { ConversationPreview, PageMotion } from "@/components/site/motion"
import { services } from "@/lib/site"

/**
 * A prospect's private preview (/d/<token>): the clinic website, as if it were already theirs. Their name, phone,
 * address, opening hours and map come from their public listing; what we don't know (their dentists, prices,
 * insurers) is never invented: the team photos are labelled as samples and prices are not shown.
 * One page, so every link stays inside their preview.
 */
export function ProspectSite({ token }: { token: string }) {
  return (
    <ClinicProvider demoToken={token}>
      <BrandTheme />
      <ChatProvider demoLink={token}>
        <Body />
        <ChatPanel />
      </ChatProvider>
    </ClinicProvider>
  )
}

const NAV = [
  { href: "#care", label: "Our care" },
  { href: "#about", label: "About us" },
  { href: "#team", label: "Our team" },
  { href: "#visit", label: "Visit us" },
]

const TEAM_SAMPLES = [
  { image: "/images/african-dentist-woman.webp", role: "Dentist" },
  { image: "/images/african-dentist-man.webp", role: "Dentist" },
  { image: "/images/african-dentist-young-woman.webp", role: "Dentist" },
  { image: "/images/african-hygienist-man.webp", role: "Dental hygienist" },
]

function Body() {
  const { clinic, prospect, loaded, missing } = useClinic()
  const { openWith } = useChat()

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" /> Loading…
      </div>
    )
  }
  if (missing || !prospect) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-semibold text-ink">This preview has expired</h1>
        <p className="text-muted-foreground">
          Previews are kept for 30 days. Reply to the message you received and we&apos;ll gladly make you a new one.
        </p>
      </div>
    )
  }

  // Google Maps addresses usually already end in the city — don't say "Dar es Salaam" twice
  const hasCity = clinic.city && (clinic.address || "").toLowerCase().includes(clinic.city.toLowerCase())
  const place = [clinic.address, hasCity ? "" : clinic.city].filter(Boolean).join(", ")
  const area = clinic.city || prospect.country || ""
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([clinic.name, place].filter(Boolean).join(", "))}`
  const expires = new Date(prospect.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
  const book = () => openWith("I'd like to book an appointment")

  return (
    <div className="marketing-shell flex min-h-screen flex-col">
      <PageMotion />
      <div className="bg-ink px-4 py-2 text-center text-xs text-white/85">
        Website preview for <strong className="text-white">{prospect.prepared_for}</strong>
        {prospect.prepared_by ? <> · prepared by {prospect.prepared_by}</> : null} · available until {expires}
      </div>

      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="container-page flex h-18 items-center justify-between gap-4">
          <a href="#top" className="inline-flex min-w-0 items-center gap-2.5" aria-label={`${clinic.name} home`}>
            <ToothMark />
            <span className="min-w-0 leading-none">
              <span className="font-display block truncate text-[1.1rem] font-semibold tracking-tight text-ink">{clinic.name}</span>
              {area && <span className="mt-1 block text-[0.55rem] font-semibold tracking-[0.24em] text-primary uppercase">{area}</span>}
            </span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            {clinic.phone && (
              <a href={clinic.phoneHref} aria-label={`Call ${clinic.phone}`}
                 className="hidden size-10 items-center justify-center rounded-full border text-ink hover:bg-secondary sm:inline-flex">
                <Phone className="size-4" />
              </a>
            )}
            <button type="button" onClick={book}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Book a visit <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="editorial-hero container-page">
          <div className="hero-kicker">
            <span>{area ? `DENTAL CARE IN ${area.toUpperCase()}` : "PERSONAL CARE. EVERY STEP."}</span>
            <span className="hero-availability"><i /> New patients welcome</span>
          </div>
          <div className="editorial-hero-top">
            <h1 className="editorial-hero-title">
              <span className="title-line"><span>Feel good.</span></span>
              <span className="title-line"><em>Smile freely.</em></span>
            </h1>
            <div className="hero-aside">
              <p>A comfortable visit and an honest conversation at {clinic.name}. A little more confidence in your everyday.</p>
              <button type="button" onClick={book} className="editorial-button">
                <span>Book your visit</span>
                <ArrowUpRight />
              </button>
              <a href="#about" className="quiet-link">Get to know us <ArrowDown className="size-4" /></a>
            </div>
          </div>
          <div className="editorial-hero-photo">
            <div className="hero-photo-inner" data-parallax>
              <Image src="/images/african-dental-hero.webp" alt="A dentist and a smiling patient in a bright, welcoming clinic"
                     fill preload sizes="(max-width: 1440px) 100vw, 1360px" className="object-cover" />
            </div>
            <div className="hero-photo-bottom">
              <p>Come as you are.<br /><em>Leave with a smile.</em></p>
              <span>Care that puts you first.<br />From hello to see you again.</span>
            </div>
            <a href="#care" className="hero-scroll" aria-label="See our care"><ArrowDown className="size-5" /></a>
          </div>
        </section>

        <section className="care-values" aria-label="Our approach to care">
          <div className="container-page">
            <span>Good people.</span>
            <Plus aria-hidden="true" />
            <span>Thoughtful care.</span>
            <Plus aria-hidden="true" />
            <span>Brighter days.</span>
            <ArrowUpRight aria-hidden="true" />
          </div>
        </section>

        <section id="about" className="container-page editorial-intro section-space" data-reveal>
          <p className="section-label"><span>01 / ABOUT US</span><ArrowDownRight /></p>
          <div>
            <h2 className="editorial-heading">Dentistry that feels<br />a little more <em>human.</em></h2>
            <div className="intro-columns">
              <p>
                We know the dental chair isn’t everyone’s favourite place. At {clinic.name} we make time for your questions,
                explain your options and take things at your pace.
              </p>
              <p>
                From a routine check-up to a fresh start for your smile, you deserve care you understand and a team you feel
                comfortable with{clinic.city ? `, right here in ${clinic.city}` : ""}.
              </p>
            </div>
          </div>
        </section>

        <section id="care" className="treatments-section section-space">
          <div className="container-page">
            <div className="editorial-section-head" data-reveal>
              <p className="section-label">02 / OUR CARE</p>
              <h2 className="editorial-heading">For the smile<br /><em>you call yours.</em></h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <button key={s.slug} type="button" onClick={() => openWith(`Tell me about ${s.name.toLowerCase()}`)}
                        className="group overflow-hidden rounded-3xl border bg-card text-left transition-shadow hover:shadow-lg"
                        data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 640px) 100vw, 33vw"
                           className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </span>
                  <span className="block p-5">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-ink">{s.name}</span>
                      <ArrowUpRight className="size-4 shrink-0 text-primary" />
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{s.short}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page section-space story-section">
          <div className="story-image" data-reveal>
            <div data-parallax>
              <Image src="/images/african-family.webp" alt="A family relaxing together in a modern clinic waiting area"
                     fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
            </div>
            <span>A little care. A lifetime of smiles.</span>
          </div>
          <div className="story-copy" data-reveal>
            <p className="section-label">03 / YOUR VISIT</p>
            <h2 className="editorial-heading">More listening.<br /><em>Less worrying.</em></h2>
            <p className="story-description">
              It’s the small things that make a visit feel different. A friendly hello. Time to ask. Knowing what happens next.
            </p>
            <div className="care-principles">
              {[
                { title: "A pace that works for you", body: "Tell us how you’re feeling. We’ll make time for your concerns." },
                { title: "Clarity before commitment", body: "Understand your options and costs before choosing your next step." },
                { title: "Care that fits your day", body: "Book online, or send us a question any time, even after hours." },
              ].map((item, i) => (
                <div key={item.title}>
                  <span>0{i + 1}</span>
                  <div><h3>{item.title}</h3><p>{item.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="team-section section-space">
          <div className="container-page">
            <div className="editorial-section-head" data-reveal>
              <p className="section-label">04 / OUR TEAM</p>
              <h2 className="editorial-heading">Good at what we do.<br /><em>Here for who you are.</em></h2>
            </div>
            <div className="editorial-team-grid">
              {TEAM_SAMPLES.map((m, i) => (
                <div key={m.image} className="editorial-person" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                  <div className="person-image">
                    <Image src={m.image} alt={m.role} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover object-top" />
                  </div>
                  <div className="person-caption"><div><h3>{m.role}</h3></div><span>0{i + 1}</span></div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Sample photos. Your own team’s photos and names go here.</p>
          </div>
        </section>

        <section className="reception-section section-space">
          <div className="container-page reception-grid">
            <div data-reveal>
              <p className="section-label">05 / ALWAYS A HELLO</p>
              <h2 className="editorial-heading">Life doesn’t keep<br /><em>office hours.</em></h2>
              <p>Neither do your questions. Ask about a treatment, our opening hours or a visit, and get an answer straight away.</p>
              <button type="button" onClick={() => openWith()}
                      className="reception-button inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-white hover:bg-white/10">
                <MessageCircle className="size-5" /> Chat with us
              </button>
            </div>
            <ConversationPreview />
          </div>
        </section>

        <section id="visit" className="container-page section-space">
          <div className="editorial-section-head" data-reveal>
            <p className="section-label">06 / VISIT US</p>
            <h2 className="editorial-heading">We’d love<br /><em>to see you.</em></h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3" data-reveal>
            <div className="rounded-3xl border bg-card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-ink"><Clock className="size-5 text-primary" /> Opening hours</h3>
              {prospect.hours_known ? (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {clinic.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4">
                      <span>{h.day}</span><span className="text-muted-foreground">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Call or message us for today’s opening times.</p>
              )}
            </div>
            <div className="rounded-3xl border bg-card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-ink"><MapPin className="size-5 text-primary" /> Find us</h3>
              <p className="mt-4 text-sm">{place || clinic.name}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                 className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Get directions <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="rounded-3xl border bg-card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-ink"><CalendarCheck className="size-5 text-primary" /> Book a visit</h3>
              <p className="mt-4 text-sm text-muted-foreground">Choose a time online in about a minute, or call us.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={book}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  Book online
                </button>
                {clinic.phone && (
                  <a href={clinic.phoneHref} className="inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium text-ink hover:bg-secondary">
                    <Phone className="size-4" /> {clinic.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-white/80">
        <div className="container-page flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <ToothMark />
            <div>
              <p className="font-display font-semibold text-white">{clinic.name}</p>
              {place && <p className="text-xs text-white/60">{place}</p>}
            </div>
          </div>
          {clinic.phone && <a href={clinic.phoneHref} className="text-sm hover:text-white">{clinic.phone}</a>}
        </div>
        <p className="container-page border-t border-white/10 py-5 text-xs text-white/50">
          © {new Date().getFullYear()} {clinic.name} · Website preview, not yet live. Bookings and messages here are a demonstration.
        </p>
      </footer>
    </div>
  )
}
