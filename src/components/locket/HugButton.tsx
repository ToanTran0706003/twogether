"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface HugButtonProps {
  coupleId: string
}

export default function HugButton({ coupleId }: HugButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  async function handleHug() {
    if (isLoading) return
    setIsLoading(true)
    try {
      await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "hug", couple_id: coupleId }),
      })
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 1500)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 left-4 z-40">
      <Button
        onClick={handleHug}
        disabled={isLoading}
        className="rounded-full px-5 h-11 text-sm font-medium gap-1.5 shadow-sm"
        style={{ backgroundColor: "#E8A0B0", color: "#3A2832" }}
      >
        {showHeart ? (
          <span className="text-lg animate-ping">💗</span>
        ) : (
          <span>Gửi hug 🤗</span>
        )}
      </Button>
    </div>
  )
}
