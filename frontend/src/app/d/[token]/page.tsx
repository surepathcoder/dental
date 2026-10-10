import type { Metadata } from "next"

import { ProspectSite } from "@/components/site/prospect-site"
import { fetchDemoClinic } from "@/lib/clinic-server"

// A private preview made for one clinic. Never indexed, never linked from the site.
// Its link card (WhatsApp, email) names that clinic — never the main site's clinic.
export async function generateMetadata({ params }: PageProps<"/d/[token]">): Promise<Metadata> {
  const { token } = await params
  const clinic = /^[A-Za-z0-9_-]{8,40}$/.test(token) ? await fetchDemoClinic(token) : null
  const name = clinic?.name || "Your clinic"
  const city = clinic?.city || ""
  const description = `A website preview for ${name}${city ? ` in ${city}` : ""}: book online, see treatments and find the clinic.`
  return {
    title: { absolute: `${name} — website preview` },
    description,
    openGraph: { title: `${name} — website preview`, description, images: ["/images/african-dental-hero.webp"] },
    twitter: { card: "summary_large_image", title: `${name} — website preview`, description },
    robots: { index: false, follow: false, nocache: true },
  }
}

export default async function ProspectDemoPage({ params }: PageProps<"/d/[token]">) {
  const { token } = await params
  return <ProspectSite token={token} />
}
