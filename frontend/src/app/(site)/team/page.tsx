import type { Metadata } from "next"
import Image from "next/image"

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
      </PageHero>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <article key={m.name} className="flex flex-col overflow-hidden rounded-2xl border bg-white">
              <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted">
                <Image src={m.image} alt={`Illustrative portrait of ${m.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-top" />
              </div>
              <div className="p-5">
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

      <FinalCTA title="Meet the team in person." intro="Book a visit online in under a minute — or ask our online assistant which dentist is the right fit." />
    </>
  )
}
