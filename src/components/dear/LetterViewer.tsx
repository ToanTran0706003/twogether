"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Letter } from "@/types"

interface LetterViewerProps {
  letter: Letter
  onClose: () => void
  onSaved: () => void
}

function formatReceivedDate(dateStr: string) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `Nhận lúc ${hours}:${minutes} · ${day}/${month}/${year}`
}

export default function LetterViewer({ letter, onClose, onSaved }: LetterViewerProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSaveToJar() {
    setIsSaving(true)
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couple_id: letter.couple_id,
          type: "letter",
          title: letter.title ?? "Thư tình",
          content: letter.content,
          memory_date: letter.send_at,
          source: "letter",
          source_id: letter.id,
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(onSaved, 800)
      }
    } catch {
      // silently fail
    }
    setIsSaving(false)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <DialogHeader className="text-center mb-4">
          {/* envelope open animation */}
          <div
            className="text-4xl mb-2"
            style={{
              animation: "envelopeOpen 0.6s ease-out forwards",
              display: "inline-block",
            }}
          >
            💌
          </div>
          <DialogTitle
            className="text-lg italic leading-snug"
            style={{ color: "#C0607A", fontFamily: "Georgia, serif" }}
          >
            {letter.title || "Thư không tiêu đề"}
          </DialogTitle>
          <p className="text-xs mt-1" style={{ color: "#C0909C" }}>
            {formatReceivedDate(letter.send_at)}
          </p>
        </DialogHeader>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            lineHeight: "2",
            color: "#3A2832",
            fontSize: "0.9375rem",
            whiteSpace: "pre-wrap",
            animation: "fadeInUp 0.5s ease-out 0.3s both",
          }}
        >
          {letter.content}
        </div>

        <div className="pt-4 mt-2">
          {saved ? (
            <p className="text-xs text-center" style={{ color: "#C0607A" }}>
              Đã lưu vào Memory Jar 🫙
            </p>
          ) : (
            <button
              onClick={handleSaveToJar}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80 disabled:opacity-50"
              style={{ borderColor: "#F0E4DF", color: "#C0607A" }}
            >
              {isSaving ? "Đang lưu..." : "Lưu vào Memory Jar ♡"}
            </button>
          )}
        </div>

        <style>{`
          @keyframes envelopeOpen {
            0% { transform: scale(0.8) rotate(-5deg); opacity: 0.5; }
            60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
