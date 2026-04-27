"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMood } from "@/hooks/useMood"
import { MOOD_OPTIONS, getMoodByEmoji } from "@/lib/mood-config"
import type { MoodEntry } from "@/types"

interface MoodSyncProps {
  coupleId: string
  userId: string
  partnerName?: string
}

export default function MoodSync({ coupleId, userId, partnerName = "Người ấy" }: MoodSyncProps) {
  const { myMood, partnerMood, isSaving, saveError, updateMood } = useMood({ coupleId, userId })
  const [showPicker, setShowPicker] = useState(false)
  const router = useRouter()

  async function selectMood(emoji: string, color: string) {
    const result = await updateMood(emoji, color)
    if (result) setShowPicker(false)
  }

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#7A5A65", marginBottom: 10, letterSpacing: 0.3 }}>
        Cảm xúc hôm nay
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <MoodCard
          mood={myMood}
          label="Mình"
          isMe
          onAction={() => setShowPicker(true)}
        />
        <MoodCard
          mood={partnerMood}
          label={partnerName}
          isMe={false}
          onAction={() => router.push("/mood")}
        />
      </div>

      {saveError && (
        <div style={{
          marginTop: 8,
          fontSize: 12,
          color: "#A32D2D",
          background: "#FFF0F0",
          border: "0.5px solid #F4C0C0",
          borderRadius: 10,
          padding: "6px 12px",
          textAlign: "center",
        }}>
          {saveError}
        </div>
      )}

      {showPicker && (
        <div style={{
          marginTop: 12,
          background: "white",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #F4C0D1",
        }}>
          <div style={{ fontSize: 12, color: "#7A5A65", marginBottom: 10, fontWeight: 500 }}>
            Hôm nay bạn thế nào?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {MOOD_OPTIONS.map(mood => (
              <button
                key={mood.emoji}
                onClick={() => void selectMood(mood.emoji, mood.color)}
                disabled={isSaving}
                style={{
                  background: mood.color,
                  border: myMood?.emoji === mood.emoji ? `2px solid ${mood.textColor}` : "none",
                  borderRadius: 12,
                  padding: "10px 6px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 24 }}>{mood.emoji}</span>
                <span style={{ fontSize: 10, color: mood.textColor, fontWeight: 500 }}>{mood.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowPicker(false)}
            style={{
              marginTop: 10, width: "100%", background: "transparent",
              border: "none", color: "#B8909A", fontSize: 12, cursor: "pointer", padding: "6px 0",
            }}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  )
}

function MoodCard({
  mood,
  label,
  isMe,
  onAction,
}: {
  mood: MoodEntry | null
  label: string
  isMe: boolean
  onAction: () => void
}) {
  const moodInfo = mood ? getMoodByEmoji(mood.emoji) : null

  return (
    <div style={{
      flex: 1,
      background: moodInfo?.color ?? "#FAF5F7",
      borderRadius: 16,
      padding: "14px 12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      minHeight: 110,
      border: "0.5px solid rgba(232,160,176,0.3)",
      transition: "background 0.3s",
    }}>
      <span style={{ fontSize: 11, color: "#7A5A65", fontWeight: 500, alignSelf: "flex-start" }}>
        {label}
      </span>

      {mood ? (
        <span style={{ fontSize: 36, lineHeight: 1 }}>{mood.emoji}</span>
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>
          {isMe ? "?" : "🌙"}
        </div>
      )}

      <span style={{ fontSize: 12, color: moodInfo?.textColor ?? "#7A5A65", fontWeight: mood ? 500 : 400 }}>
        {mood ? (moodInfo?.label ?? mood.emoji) : "Chưa cập nhật"}
      </span>

      <button
        onClick={onAction}
        style={{
          fontSize: 11, padding: "4px 12px", borderRadius: 20,
          background: "rgba(255,255,255,0.7)",
          border: "0.5px solid rgba(192,96,122,0.3)",
          color: "#C0607A", cursor: "pointer", fontWeight: 500,
        }}
      >
        {isMe ? (mood ? "Thay đổi" : "Cập nhật") : "Xem mood"}
      </button>
    </div>
  )
}
