import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowDownRight, ArrowUpRight, Plus } from "lucide-react"

import { ChatCTA } from "@/components/site/chat-cta"
import { ConversationPreview } from "@/components/site/motion"
import { HomeFaqs, HomeCoverage, PracticeHeroCopy } from "@/components/site/practice-copy"
import { QuickBooking } from "@/components/site/quick-booking"
import { TreatmentExplorer } from "@/components/site/treatment-explorer"
import { FinalCTA } from "@/components/site/shared"
import { team } from "@/lib/site"

export default function HomePage() {
  return (
    <>
      <section className="editorial-hero container-page">
        <div className="hero-kicker">
          <span>PERSONAL CARE. EVERY STEP.</span>
          <span className="hero-availability">
            <i /> New patients welcome
          </span>
        </div>
        <div className="editorial-hero-top">
          <PracticeHeroCopy />
          <div className="hero-aside">
            <p>A comfortable visit. An honest conversation. A little more confidence in your everyday.</p>
            <Link href="/book" className="editorial-button">
              <span>Book your first visit</span>
              <ArrowUpRight />
            </Link>
            <a href="#our-approach" className="quiet-link">
              Get to know us <ArrowDown className="size-4" />
            </a>
          </div>
        </div>
        <div className="editorial-hero-photo">
          <div className="hero-photo-inner" data-parallax>
            <Image
              src="/images/african-dental-hero.webp"
              alt="An African dentist and patient smiling together in a bright, welcoming practice"
              fill
              preload
              sizes="(max-width: 1440px) 100vw, 1360px"
              className="object-cover"
            />
          </div>
          <div className="hero-photo-bottom">
            <p>
              Come as you are.
              <br />
              <em>Leave with a smile.</em>
            </p>
            <span>
              Care that puts you first.
              <br />
              From hello to see you again.
            </span>
          </div>
          <a href="#services" className="hero-scroll" aria-label="Explore our dental care">
            <ArrowDown className="size-5" />
          </a>
        </div>
        <div className="hero-footnote">
          <span>YOUR COMFORT IS PART OF THE CARE.</span>
          <span>01 — A fresh start</span>
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
      <section id="our-approach" className="container-page editorial-intro section-space" data-reveal>
        <p className="section-label">
          <span>01 / THE FEELING</span>
          <ArrowDownRight />
        </p>
        <div>
          <h2 className="editorial-heading">
            Dentistry that feels
            <br />a little more <em>human.</em>
          </h2>
          <div className="intro-columns">
            <p>
              We know the chair isn’t everyone’s favourite place. So we make room for your questions, explain the options, and take things
              at your pace.
            </p>
            <div>
              <p>
                From a routine checkup to a fresh start for your smile, you deserve care you understand and a team you feel comfortable
                with.
              </p>
              <Link href="/about" className="text-link">
                Our approach to care <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="treatments-section section-space">
        <div className="container-page">
          <div className="editorial-section-head" data-reveal>
            <p className="section-label">02 / YOUR CARE</p>
            <h2 className="editorial-heading">
              For the smile
              <br />
              <em>you call yours.</em>
            </h2>
            <Link href="/services" className="text-link">
              All treatments <ArrowUpRight />
            </Link>
          </div>
          <TreatmentExplorer />
        </div>
      </section>
      <section className="container-page section-space story-section">
        <div className="story-image" data-reveal>
          <div data-parallax>
            <Image
              src="/images/african-family.webp"
              alt="An African family enjoying a relaxed moment together in the waiting room"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <span>A little care. A lifetime of smiles.</span>
        </div>
        <div className="story-copy" data-reveal>
          <p className="section-label">03 / THE EXPERIENCE</p>
          <h2 className="editorial-heading">
            More listening.
            <br />
            <em>Less worrying.</em>
          </h2>
          <p className="story-description">
            It’s the small things that make a visit feel different. A friendly hello. Time to ask. Knowing what happens next.
          </p>
          <div className="care-principles">
            {[
              { title: "A pace that works for you", body: "Tell us how you’re feeling. We’ll make time for your concerns." },
              { title: "Clarity before commitment", body: "Understand your options and costs before choosing your next step." },
              { title: "Care that fits your day", body: "Book online and ask us questions any time, even after hours." },
            ].map((item, index) => (
              <div key={item.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/about" className="text-link">
            A closer look at our practice <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="team-section section-space">
        <div className="container-page">
          <div className="editorial-section-head" data-reveal>
            <p className="section-label">04 / YOUR PEOPLE</p>
            <h2 className="editorial-heading">
              Good at what we do.
              <br />
              <em>Here for who you are.</em>
            </h2>
            <Link href="/team" className="text-link">
              Meet everyone <ArrowUpRight />
            </Link>
          </div>
          <div className="editorial-team-grid">
            {team.map((member, index) => (
              <Link
                href="/team"
                key={member.name}
                className="editorial-person"
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              >
                <div className="person-image">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-top"
                  />
                  <span className="person-arrow">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="person-caption">
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                  <span>0{index + 1}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="reception-section section-space">
        <div className="container-page reception-grid">
          <div data-reveal>
            <p className="section-label">05 / ALWAYS A HELLO</p>
            <h2 className="editorial-heading">
              Life doesn’t keep
              <br />
              <em>office hours.</em>
            </h2>
            <p>
              Neither do your questions. Our online assistant can help you explore treatments, understand insurance, and start booking a
              visit.
            </p>
            <ChatCTA label="Chat with us" variant="dark" className="reception-button" />
            <span className="reception-small">Questions for a dentist? We’ll point you to the team.</span>
          </div>
          <ConversationPreview />
        </div>
      </section>
      <section className="container-page section-space" aria-label="Find an appointment" data-reveal>
        <QuickBooking />
      </section>
      <section className="container-page editorial-faq section-space">
        <div data-reveal>
          <p className="section-label">06 / GOOD TO KNOW</p>
          <h2 className="editorial-heading">
            Before you
            <br />
            <em>say hello.</em>
          </h2>
          <p>From insurance to your first appointment, a few answers to help you feel ready.</p>
          <Link href="/faq" className="text-link">
            More questions, answered <ArrowUpRight />
          </Link>
        </div>
        <div data-reveal>
          <HomeFaqs limit={5} />
          <HomeCoverage />
        </div>
      </section>
      <FinalCTA
        title="Your smile has a next chapter."
        intro="Let’s start with a conversation. We’ll help you find the right care, at the right pace for you."
      />
    </>
  )
}
