"use client"

import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { serviceHref, useClinic } from "@/components/site/clinic-provider"

export function SiteFooter() {
  const { clinic, demoMode } = useClinic()
  const city = clinic.raw?.city || "Austin"

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light name={clinic.name} city={city} />
          <p className="text-sm leading-relaxed text-white/65">
            {clinic.tagline} 24/7 AI receptionist to answer questions and book visits.
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
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <span>
                {clinic.address}
                <br />
                {clinic.cityLine}
              </span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <a href={clinic.phoneHref} className="hover:text-white">
                {clinic.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <span>{clinic.email}</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="size-4 text-teal-300" /> Hours
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
                © {new Date().getFullYear()} {clinic.name} is shown here as a <strong className="text-white/80">portfolio demo</strong>. Not a real
                clinic; no medical advice is provided.
              </>
            ) : (
              <>© {new Date().getFullYear()} {clinic.name}. AI assistant provides general information only — not medical advice.</>
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
            {demoMode && (
              <>
                <Link href="/admin/login" className="hover:text-white">
                  Clinic dashboard
                </Link>
                <Link href="/solutions/dental" className="hover:text-white">
                  Built by — for dental clinics
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
