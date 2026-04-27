"use client"

import { useState } from "react"
import { injectKeyframes } from "@/lib/animations"

interface HugButtonProps {
  coupleId: string
}

export default function HugButton({ coupleId }: HugButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [beating, setBeating] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleHug() {
    if (isLoading) return
    injectKeyframes()
    setBeating(true)
    setIsLoading(true)
    setTimeout(() => setBeating(false), 700)
    try {
      await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "hug", couple_id: coupleId }),
      })
      setSent(true)
      setTimeout(() => setSent(false), 2000)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 left-4 z-40">
      <button
        onClick={handleHug}
        disabled={isLoading}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 100,
          background: "#E8A0B0", color: "#3A2832",
          border: "none", fontWeight: 600, fontSize: 14,
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
          boxShadow: "0 4px 12px rgba(232,160,176,0.4)",
          minHeight: 44,
        }}
      >
        <span
          style={{
            fontSize: 20,
            display: "inline-block",
            animation: beating ? "heartBeat 0.7s ease" : "none",
          }}
        >
          {sent ? "❤️" : "🤗"}
        </span>
        <span>{sent ? "Đã gửi hug ♡" : "Gửi hug"}</span>
      </button>
    </div>
  )
}
