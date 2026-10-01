import type { Metadata, Viewport } from "next"
import { Fraunces, Inter } from "next/font/google"

import { AnalyticsProvider } from "@/components/analytics-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fetchClinic } from "@/lib/clinic-server"

import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" })
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", axes: ["opsz"] })

export async function generateMetadata(): Promise<Metadata> {
  const info = await fetchClinic()
  const name = info?.name || "Dental Practice"
  const tagline = info?.tagline || "Modern Dental Care"
  const city = info ? `${info.city}, ${info.state}` : ""
  const title = city ? `${name} — ${tagline} in ${city}` : `${name} — ${tagline}`
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description: `${name}${city ? ` in ${city}` : ""} — ${tagline}. 24/7 AI receptionist for questions, insurance and online booking.`,
    openGraph: {
      title,
      description: "Website visitor → AI receptionist → qualified lead → booked appointment → automated follow-up.",
      images: ["/images/hero-clinic.jpg"],
    },
    robots: { index: false, follow: false },
  }
}

export const viewport: Viewport = {
  themeColor: "#0f6b70",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AnalyticsProvider />
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
