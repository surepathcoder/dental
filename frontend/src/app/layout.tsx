import type { Metadata, Viewport } from "next"
import { Fraunces, Inter } from "next/font/google"

import { AnalyticsProvider } from "@/components/analytics-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fetchClinic } from "@/lib/clinic-server"

import "./globals.css"
import "./editorial.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" })
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", axes: ["opsz"] })

export async function generateMetadata(): Promise<Metadata> {
  const info = await fetchClinic()
  const name = info?.name || "Dental Practice"
  const tagline = (info?.tagline || "Modern Dental Care").replace(/[.\s]+$/, "")
  // "Dar es salaam, Dar es salaam" when the region has the city's name: say it once
  const parts = info ? [info.city, info.state].filter(Boolean) : []
  const city = [...new Map(parts.map((p) => [p.trim().toLowerCase(), p.trim()])).values()].join(", ")
  const title = city ? `${name} — ${tagline} in ${city}` : `${name} — ${tagline}`
  const description = `${name}${city ? ` in ${city}` : ""} — ${tagline}. Book online or ask us about treatments and insurance, any time.`
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: ["/images/african-dental-hero.webp"],
    },
    robots: { index: false, follow: false },
  }
}

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AnalyticsProvider />
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
