"use client"

import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatProvider } from "@/components/chat/chat-provider"
import { BrandTheme, ClinicProvider } from "@/components/site/clinic-provider"

export default function EmbedChatPage() {
  return (
    <ClinicProvider>
      <BrandTheme />
      <ChatProvider>
        <ChatPanel variant="embed" />
      </ChatProvider>
    </ClinicProvider>
  )
}
