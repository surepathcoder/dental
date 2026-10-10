"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { services } from "@/lib/site"

export function TreatmentExplorer() {
  const [active, setActive] = useState<string>(services[0].slug)
  return (
    <Tabs value={active} onValueChange={setActive} orientation="vertical" className="editorial-treatments" data-reveal>
      <TabsList aria-label="Explore dental treatments" className="treatment-index">
        {services.map((service, index) => (
          <TabsTrigger key={service.slug} value={service.slug} className="treatment-index-row">
            <span className="treatment-number">0{index + 1}</span>
            <span>{service.name}</span>
            {active === service.slug ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
          </TabsTrigger>
        ))}
      </TabsList>
      {services.map((service) => (
        <TabsContent key={service.slug} value={service.slug} className="treatment-story">
          <div className="treatment-story-image">
            <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 900px) 100vw, 45vw" className="object-cover" />
            <span>{service.duration}</span>
          </div>
          <div className="treatment-story-copy">
            <div>
              <h3>{service.headline}</h3>
              <p>{service.short}</p>
            </div>
            <Link href={`/book?service=${service.slug}`} className="treatment-book" aria-label={`Book ${service.name}`}>
              <ArrowUpRight />
            </Link>
          </div>
          <Link href={`/services/${service.slug}`} className="text-link">
            Explore {service.name.toLowerCase()} <ArrowUpRight />
          </Link>
        </TabsContent>
      ))}
    </Tabs>
  )
}
