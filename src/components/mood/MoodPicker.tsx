"use client"

import { useState } from "react"
import type { MoodEntry } from "@/types"
import { MOOD_OPTIONS } from "@/lib/mood-config"
import { injectKeyframes } from "@/lib/animations"

interface MoodPickerProps {
  todayEntry: MoodEntry | null
  onSelect: (emoji: string, color: string) => Promise<void>
  showPicker: boolean
  setShowPicker: (v: boolean) => void
}

export default function MoodPicker({
  todayEntry,
  onSelect,
  showPicker,
  setShowPicker,
}: MoodPickerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingMood, setPendingMood] = useState<{ emoji: string; color: string } | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  const currentMood = todayEntry
    ? MOOD_OPTIONS.find((m) => m.emoji === todayEntry.emoji)
    : null

  async function handleSelect(emoji: string, color: string) {
    injectKeyframes()
    setSelectedEmoji(emoji)
    setTimeout(() => setSelectedEmoji(null), 400)
    if (todayEntry) {
      setPendingMood({ emoji, color })
      setShowConfirm(true)
      return
    }
    setIsLoading(true)
    await onSelect(emoji, color)
    setIsLoading(false)
  }

  async function handleConfirmChange() {
    if (!pendingMood) return
    setIsLoading(true)
    await onSelect(pendingMood.emoji, pendingMood.color)
    setPendingMood(null)
    setShowConfirm(false)
    setIsLoading(false)
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ color: "#8A6A72" }}>
        Cảm xúc hôm nay
      </h2>

      {!showPicker ? (
        <div className="flex flex-col items-center gap-3 py-2">
          {currentMood ? (
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-sm"
                style={{ backgroundColor: currentMood.color }}
              >
                {currentMood.emoji}
              </div>
              <p className="text-sm font-medium" style={{ color: "#3A2832" }}>
                {currentMood.label}
              </p>
              <button
                onClick={() => setShowPicker(true)}
                className="text-sm px-4 py-1.5 rounded-full border transition-colors hover:opacity-80"
                style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
              >
                Thay đổi
              </button>
            </>
          ) : (
            <>
              <p className="text-sm mb-2" style={{ color: "#8A6A72" }}>
                Bạn chưa cập nhật cảm xúc hôm nay
              </p>
              <button
                onClick={() => setShowPicker(true)}
                className="text-sm px-5 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90 shadow-sm"
                style={{ backgroundColor: "#E8A0B0", color: "#FFFFFF" }}
              >
                Chọn cảm xúc
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-center" style={{ color: "#8A6A72" }}>
            Chọn cảm xúc phù hợp với bạn hôm nay
          </p>
          <div className="grid grid-cols-4 gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => handleSelect(mood.emoji, mood.color)}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:opacity-80 disabled:opacity-50 transition-all active:scale-95"
                style={{ backgroundColor: mood.color }}
              >
                <span style={{
                  fontSize: 24,
                  display: "block",
                  animation: selectedEmoji === mood.emoji
                    ? "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
                    : "none",
                }}>{mood.emoji}</span>
                <span className="text-[10px] font-medium" style={{ color: "#3A2832" }}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setShowPicker(false)
              setShowConfirm(false)
              setPendingMood(null)
            }}
            className="w-full text-sm py-2 rounded-lg transition-colors"
            style={{ color: "#8A6A72" }}
          >
            Đóng
          </button>
        </div>
      )}

      {showConfirm && pendingMood && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(58,40,50,0.5)" }}
          onClick={() => {
            setShowConfirm(false)
            setPendingMood(null)
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: pendingMood.color }}
              >
                {pendingMood.emoji}
              </div>
            </div>
            <p className="text-center text-sm font-medium mb-1" style={{ color: "#3A2832" }}>
              Thay đổi cảm xúc hôm nay?
            </p>
            <p className="text-center text-xs mb-4" style={{ color: "#8A6A72" }}>
              Cảm xúc trước đó sẽ được ghi đè
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setPendingMood(null)
                }}
                className="flex-1 py-2 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmChange}
                disabled={isLoading}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#E8A0B0" }}
              >
                {isLoading ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
