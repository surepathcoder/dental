import type { Metadata } from "next"

import { PrivacyBody } from "@/components/site/practice-copy"
import { PageHero } from "@/components/site/shared"

export const metadata: Metadata = { title: "Privacy Notice", description: "How this website handles the information you enter." }

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy notice" intro="Plain-language summary of how this website handles information." />
      <section className="container-page max-w-3xl py-16">
        <PrivacyBody />
      </section>
    </>
  )
}
