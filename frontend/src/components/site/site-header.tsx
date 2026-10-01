"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Menu, Phone } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { serviceHref, useClinic } from "@/components/site/clinic-provider"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { clinic: live, demoMode } = useClinic()
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/")
  const city = live.raw?.city || "Austin"

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" aria-label={`${live.name} home`}>
          <Logo name={live.name} city={city} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink/80 outline-none hover:text-primary data-[state=open]:text-primary",
                active("/services") && "text-primary",
              )}
            >
              Services <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 p-1.5">
              {live.activeServices.map((s) => (
                <DropdownMenuItem key={s.slug || s.name} asChild className="cursor-pointer flex-col items-start gap-0.5 rounded-lg p-2.5">
                  <Link href={serviceHref(s.slug)}>
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{s.short}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5 font-medium text-primary">
                <Link href="/services">View all services →</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary", active(n.href) && "text-primary")}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={live.phoneHref} className="hidden items-center gap-2 text-sm font-semibold text-ink xl:inline-flex">
            <Phone className="size-4 text-primary" /> {live.phone}
          </a>
          <Button asChild className="hidden h-10 rounded-full px-5 sm:inline-flex">
            <Link href="/book">Book an Appointment</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-10 lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo name={live.name} city={city} />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="Mobile">
                <p className="px-2 pt-2 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Services</p>
                {live.activeServices.map((s) => (
                  <Link key={s.slug || s.name} href={serviceHref(s.slug)} onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-ink hover:bg-muted">
                    {s.name}
                  </Link>
                ))}
                <p className="px-2 pt-4 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Practice</p>
                {[{ href: "/", label: "Home" }, ...NAV, ...(demoMode ? [{ href: "/admin/login", label: "Clinic dashboard (demo)" }] : [])].map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-ink hover:bg-muted">
                    {n.label}
                  </Link>
                ))}
                <Button asChild className="mt-4 h-11 rounded-full" onClick={() => setMobileOpen(false)}>
                  <Link href="/book">Book an Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-full">
                  <a href={live.phoneHref}>
                    <Phone /> {live.phone}
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
