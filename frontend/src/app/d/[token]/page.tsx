import type { Metadata } from "next"

import { ProspectSite } from "@/components/site/prospect-site"

// A private preview made for one clinic. Never indexed, never linked from the site.
export const metadata: Metadata = {
  title: "Website preview",
  robots: { index: false, follow: false, nocache: true },
}

export default async function ProspectDemoPage({ params }: PageProps<"/d/[token]">) {
  const { token } = await params
  return <ProspectSite token={token} />
}
