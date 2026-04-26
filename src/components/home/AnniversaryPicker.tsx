"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AnniversaryPickerProps {
  coupleId: string
}

export default function AnniversaryPicker({ coupleId }: AnniversaryPickerProps) {
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    setIsLoading(true)
    await fetch(`/api/couple/${coupleId}/anniversary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anniversary: date }),
    })
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="rounded-full px-4 py-2 text-sm text-center border"
        style={{ borderColor: "#E8A0B0", color: "#3A2832", backgroundColor: "rgba(255,255,255,0.15)" }}
      />
      <button
        type="submit"
        disabled={isLoading || !date}
        className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ backgroundColor: "#E8A0B0", color: "#3A2832" }}
      >
        {isLoading ? "Đang lưu..." : "Lưu ngày kỷ niệm"}
      </button>
    </form>
  )
}
