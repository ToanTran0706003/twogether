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
      const res = await fetch("/api/letters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter_id: letter.id }),
      })

      if (res.ok) {
        setSaved(true)
        onSaved()
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
          <div className="text-3xl mb-2">💌</div>
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
          className="animate-in fade-in zoom-in-95 duration-300"
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            lineHeight: "2",
            color: "#3A2832",
            fontSize: "0.9375rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {letter.content}
        </div>

        {!saved && (
          <div className="pt-4 mt-2">
            <button
              onClick={handleSaveToJar}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80 disabled:opacity-50"
              style={{
                borderColor: "#F0E4DF",
                color: "#C0607A",
              }}
            >
              {isSaving ? "Đang lưu..." : "Lưu vào Memory Jar ♡"}
            </button>
          </div>
        )}

        {saved && (
          <div className="pt-4 mt-2 text-center">
            <p className="text-xs" style={{ color: "#C0607A" }}>
              Đã lưu vào Memory Jar 🫙
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
