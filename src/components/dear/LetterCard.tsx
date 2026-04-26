"use client"

import type { Letter } from "@/types"

interface LetterCardProps {
  letter: Letter
  variant: "scheduled" | "received"
  onOpen: (letter: Letter) => void
}

function formatSendDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `Đã gửi ${formatDate(date)}`
  } else if (diffDays === 0) {
    return "Gửi hôm nay"
  } else if (diffDays === 1) {
    return "Gửi ngày mai"
  } else if (diffDays <= 7) {
    return `Còn ${diffDays} ngày`
  } else {
    return `Hẹn ${formatDate(date)}`
  }
}

function formatDate(date: Date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export default function LetterCard({ letter, variant, onOpen }: LetterCardProps) {
  const isScheduled = variant === "scheduled"
  const preview = letter.content.length > 60
    ? letter.content.slice(0, 60) + "…"
    : letter.content

  return (
    <button
      onClick={() => isScheduled ? null : onOpen(letter)}
      disabled={isScheduled}
      className="w-full text-left rounded-2xl p-4 border shadow-sm transition-all hover:shadow-md disabled:hover:shadow-sm disabled:cursor-default"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#F0E4DF",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="font-semibold text-sm leading-snug"
          style={{
            color: "#3A2832",
            fontFamily: isScheduled ? "Georgia, serif" : "inherit",
            fontStyle: isScheduled ? "italic" : "normal",
          }}
        >
          {letter.title || "Thư không tiêu đề"}
        </h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
          style={{
            backgroundColor: isScheduled ? "#F7D6DF" : "#D8EDE5",
            color: isScheduled ? "#C0607A" : "#3A2832",
          }}
        >
          {isScheduled ? "🔒 Đang hẹn" : "💌 Đã gửi"}
        </span>
      </div>

      <p
        className="text-xs leading-relaxed mb-3"
        style={{ color: "#8A6A72" }}
      >
        {preview}
      </p>

      <p className="text-xs" style={{ color: "#C0909C" }}>
        {formatSendDate(letter.send_at)}
      </p>
    </button>
  )
}
