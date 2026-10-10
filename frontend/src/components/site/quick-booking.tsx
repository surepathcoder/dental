"use client"

import { ArrowUpRight, CalendarDays, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClinic } from "./clinic-provider"

export function QuickBooking() {
  const { clinic } = useClinic()
  return (
    <div className="quick-booking grid items-center gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
          <CalendarDays className="size-6" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">Let’s make time for you.</h2>
          <p className="mt-1 text-xs text-muted-foreground">A better dental visit starts right here.</p>
        </div>
      </div>
      <form action="/book" method="GET" className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="quick-service" className="sr-only">
            Choose your treatment
          </label>
          <select
            id="quick-service"
            name="service"
            className="h-13 w-full appearance-none rounded-xl border bg-[#f7faf9] pr-9 pl-4 text-sm text-ink outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
            defaultValue=""
          >
            <option value="">What can we help you with?</option>
            {clinic.activeServices.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-4.5 right-3 size-4 text-primary" />
        </div>
        <Button type="submit" className="h-13 rounded-xl px-5">
          Find a visit <ArrowUpRight className="size-4" />
        </Button>
      </form>
    </div>
  )
}
