import type { Metadata } from "next"

import { TermsBody } from "@/components/site/practice-copy"
import { PageHero } from "@/components/site/shared"

export const metadata: Metadata = { title: "Terms of Use", description: "Terms for using this website." }

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" intro="How this website and the AI receptionist may be used." />
      <section className="container-page max-w-3xl py-16">
        <TermsBody />
      </section>
    </>
  )
}
