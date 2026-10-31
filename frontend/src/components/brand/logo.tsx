import { cn } from "@/lib/utils"

export function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M11.2 8.5c-2.6 0-4.2 2-4.2 4.6 0 2.1.8 3.4 1.5 5 .8 1.8.9 3.6 1.4 5.2.3 1 .8 1.7 1.6 1.7 1.3 0 1.5-1.6 1.8-3.3.3-1.6.8-3 2.7-3s2.4 1.4 2.7 3c.3 1.7.5 3.3 1.8 3.3.8 0 1.3-.7 1.6-1.7.5-1.6.6-3.4 1.4-5.2.7-1.6 1.5-2.9 1.5-5 0-2.6-1.6-4.6-4.2-4.6-1.9 0-2.9 1-4.8 1s-2.9-1-4.8-1Z"
        fill="white"
      />
      <path d="M21.5 6.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" fill="white" opacity=".85" />
    </svg>
  )
}

export function Logo({ className, light = false, name }: { className?: string; light?: boolean; name?: string; city?: string }) {
  const display = name || "Bright Dental Clinic"
  return (
    <span className={cn("brand-logo inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/bright-mark.png" alt="" aria-hidden="true" className="size-10 rounded-lg bg-white object-contain p-0.5" />
      <span className={cn("leading-none", light ? "text-white" : "text-ink")}>
        <span className="brand-name font-display block text-[1.15rem] font-semibold tracking-tight">{display}</span>
        <span
          className={cn("mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.24em]", light ? "text-white/70" : "text-primary")}
        >
          Smile Better With Us
        </span>
      </span>
    </span>
  )
}
