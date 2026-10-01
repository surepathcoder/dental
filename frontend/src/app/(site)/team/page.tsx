import type { Metadata } from "next"
import Image from "next/image"

import { DemoOnly } from "@/components/site/practice-copy"
import { FinalCTA, PageHero } from "@/components/site/shared"
import { team } from "@/lib/site"

export const metadata: Metadata = {
  title: "Meet Our Dentists",
  description: "The dentists and hygienists at the practice.",
}

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="Our team" title="The people behind your smile." intro="Four clinicians, one philosophy: take the time to explain, then treat.">
        <DemoOnly>
        <p className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          Fictional team members · stock photography used for this portfolio demo
        </p>
        </DemoOnly>
      </PageHero>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2">
          {team.map((m) => (
            <article key={m.name} className="flex flex-col gap-6 sm:flex-row">
              <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:w-44">
                <Image src={m.image} alt={`Portrait of ${m.name}`} fill sizes="(max-width: 640px) 100vw, 200px" className="object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">{m.name}</h2>
                <p className="text-sm font-medium text-primary">{m.role}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{m.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {m.focus.map((f) => (
                    <li key={f} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalCTA title="Meet the team in person." intro="Book a visit online in under a minute — or ask our AI receptionist which dentist is the right fit." />
    </>
  )
}
