import type { Metadata } from "next"

import { FinalCTA, PageHero, ServiceCard } from "@/components/site/shared"
import { services } from "@/lib/site"

export const metadata: Metadata = {
  title: "Dental Services",
  description: "General, cosmetic and emergency dentistry, dental implants and Invisalign.",
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Complete dental care for every stage of life."
        intro="Preventive, cosmetic, restorative and emergency dentistry — delivered by a team that explains your options and prices before treatment starts."
      />
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>
      <FinalCTA title="Not sure which visit you need?" intro="Our online assistant can help you figure it out and book the right appointment in about a minute." />
    </>
  )
}
