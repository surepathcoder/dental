"use client"

import { MessageCircle } from "lucide-react"

import { useChat } from "@/components/chat/chat-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChatCTA({
  label = "Ask us a question",
  message,
  variant = "light",
  className,
}: {
  label?: string
  message?: string
  variant?: "light" | "dark" | "outline"
  className?: string
}) {
  const { openWith } = useChat()
  return (
    <Button
      type="button"
      size="lg"
      variant="outline"
      onClick={() => openWith(message)}
      className={cn(
        "h-12 rounded-full px-6 text-base",
        variant === "dark" && "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
        variant === "light" && "border-primary/25 bg-card text-primary hover:bg-secondary hover:text-primary",
        className,
      )}
    >
      <MessageCircle /> {label}
    </Button>
  )
}
