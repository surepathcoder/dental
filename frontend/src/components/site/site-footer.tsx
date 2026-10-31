"use client"

import Link from "next/link"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { serviceHref, useClinic } from "@/components/site/clinic-provider"
import { clinic as practice } from "@/lib/site"

export function SiteFooter() {
  const { clinic, demoMode } = useClinic()
  const city = clinic.raw?.city || ""

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-page">
        <div className="footer-topline flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="font-display max-w-md text-2xl leading-tight text-white sm:text-3xl">Good care starts with a hello.</p>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-5 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Get in touch <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light name={clinic.name} city={city} />
          <p className="text-sm leading-relaxed text-white/65">
            {clinic.tagline} Questions answered and visits booked, any time.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Services</p>
          <ul className="space-y-2 text-sm">
            {clinic.activeServices.map((s) => (
              <li key={s.slug || s.name}>
                <Link href={serviceHref(s.slug)} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Visit us</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#cdeee6]" />
              <span>
                {clinic.address}
                <br />
                {clinic.cityLine}
              </span>
            </li>
            {practice.locations.slice(1).map((loc) => (
              <li key={loc.name} className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#cdeee6]" />
                <span>{loc.address}</span>
              </li>
            ))}
            {clinic.phone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#cdeee6]" />
                <a href={clinic.phoneHref} className="hover:text-white">
                  {clinic.phone}
                </a>
              </li>
            )}
            {clinic.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#cdeee6]" />
                <a href={`mailto:${clinic.email}`} className="break-all hover:text-white">
                  {clinic.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="size-4 text-[#cdeee6]" /> Hours
          </p>
          <ul className="space-y-1 text-sm">
            {clinic.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-white/60">{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            {demoMode ? (
              <>
                © {new Date().getFullYear()} {clinic.name} is shown here as a <strong className="text-white/80">portfolio demo</strong>.
                Not a real clinic; no medical advice is provided.
              </>
            ) : (
              <>
                © {new Date().getFullYear()} {clinic.name}. Our online chat gives general information only — not medical advice.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/waitlist" className="hover:text-white">
              Waitlist
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
