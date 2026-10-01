import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatProvider } from "@/components/chat/chat-provider"
import { BrandTheme, ClinicProvider } from "@/components/site/clinic-provider"
import { DemoBar } from "@/components/site/demo-bar"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClinicProvider>
      <BrandTheme />
      <ChatProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-card focus:px-3 focus:py-2">
          Skip to content
        </a>
        <DemoBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ChatPanel />
      </ChatProvider>
    </ClinicProvider>
  )
}
