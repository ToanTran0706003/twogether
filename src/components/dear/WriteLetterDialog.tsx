"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Letter } from "@/types"
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const QUICK_DATES = [
  { label: "Sinh nhật", getValue: () => nextBirthday() },
  { label: "Kỷ niệm 1 năm", getValue: () => oneYearAnniversary() },
  { label: "Valentine", getValue: () => nextValentine() },
]

function nextBirthday(): string {
  const now = new Date()
  const thisYear = now.getFullYear()
  const bd = new Date(`${thisYear}-06-15T09:00:00`)
  if (bd <= now) bd.setFullYear(thisYear + 1)
  return toDatetimeLocal(bd)
}

function oneYearAnniversary(): string {
  const now = new Date()
  now.setFullYear(now.getFullYear() + 1)
  now.setMonth(0)
  now.setDate(1)
  now.setHours(9, 0, 0, 0)
  return toDatetimeLocal(now)
}

function nextValentine(): string {
  const now = new Date()
  const thisYear = now.getFullYear()
  const vd = new Date(`${thisYear}-02-14T09:00:00`)
  if (vd <= now) vd.setFullYear(thisYear + 1)
  return toDatetimeLocal(vd)
}

function toDatetimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

function toISOString(value: string): string {
  const d = new Date(value)
  return d.toISOString()
}

interface WriteLetterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupleId: string
  onSent: (letter: Letter) => void
}

export default function WriteLetterDialog({
  open,
  onOpenChange,
  coupleId,
  onSent,
}: WriteLetterDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [sendAt, setSendAt] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(9, 0, 0, 0)
    return toDatetimeLocal(d)
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Auto-save draft
  useEffect(() => {
    if (!open) return
    if (!content && !title) return
    const draft = { title, content, savedAt: Date.now() }
    localStorage.setItem('letter_draft', JSON.stringify(draft))
  }, [title, content, open])

  // Load draft on open
  useEffect(() => {
    if (!open) return
    const saved = localStorage.getItem('letter_draft')
    if (!saved) return
    try {
      const draft = JSON.parse(saved) as { title: string; content: string; savedAt: number }
      if (Date.now() - draft.savedAt < 86_400_000) {
        if (draft.title) setTitle(draft.title)
        if (draft.content) setContent(draft.content)
      }
    } catch {
      // ignore corrupt draft
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError("Vui lòng viết nội dung thư")
      return
    }

    const sendAtISO = toISOString(sendAt)
    const now = new Date()
    if (new Date(sendAtISO) <= now) {
      setError("Thời gian gửi phải là tương lai")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() || null, content: content.trim(), send_at: sendAtISO, couple_id: coupleId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Có lỗi xảy ra")
        setIsLoading(false)
        return
      }

      onSent(data)
      localStorage.removeItem('letter_draft')
      setTitle("")
      setContent("")
      onOpenChange(false)
    } catch {
      setError("Có lỗi xảy ra khi gửi")
    }

    setIsLoading(false)
  }

  function applyQuickDate(value: string) {
    setSendAt(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle
            className="font-serif text-lg"
            style={{ color: "#C0607A" }}
          >
            Viết thư cho nửa kia 💌
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề (tùy chọn)"
              className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 16,
              }}
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Những lời bạn muốn gửi đến nửa kia…"
              rows={7}
              required
              className="w-full px-3 py-2 rounded-xl border leading-relaxed outline-none focus:ring-2 transition-all resize-none"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                lineHeight: "1.8",
                fontSize: 16,
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#8A6A72" }}
            >
              Gợi ý nhanh
            </label>
            <div className="flex gap-2 flex-wrap">
              {QUICK_DATES.map((qd) => (
                <button
                  key={qd.label}
                  type="button"
                  onClick={() => applyQuickDate(qd.getValue())}
                  className="text-xs px-3 py-1 rounded-full border transition-colors hover:opacity-80"
                  style={{ borderColor: "#F0E4DF", color: "#C0607A" }}
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#8A6A72" }}
            >
              Ngày giờ gửi
            </label>
            <input
              type="datetime-local"
              value={sendAt}
              onChange={(e) => setSendAt(e.target.value)}
              min={toDatetimeLocal(new Date())}
              required
              className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
                fontSize: 16,
              }}
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#C0607A" }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
              style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#E8A0B0" }}
            >
              <>
                {isLoading && <LoadingSpinner size={14} color="white" />}
                {isLoading ? "Đang gửi..." : "Hẹn giờ gửi"}
              </>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
