"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MOOD_OPTIONS, getMoodByEmoji } from "@/lib/mood-config"
import type { MoodEntry } from "@/types"

interface MoodSyncProps {
  coupleId: string
  userId: string
  partnerName?: string
}

export default function MoodSync({ coupleId, userId, partnerName = "Người ấy" }: MoodSyncProps) {
  const [myMood, setMyMood] = useState<MoodEntry | null>(null)
  const [partnerMood, setPartnerMood] = useState<MoodEntry | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const today = new Date().toISOString().split("T")[0]

  async function fetchMoods() {
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("couple_id", coupleId)
      .eq("entry_date", today)
    if (data) {
      setMyMood((data as MoodEntry[]).find(m => m.user_id === userId) ?? null)
      setPartnerMood((data as MoodEntry[]).find(m => m.user_id !== userId) ?? null)
    }
  }

  useEffect(() => {
    void fetchMoods()

    const channel = supabase
      .channel(`mood-home-${coupleId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mood_entries", filter: `couple_id=eq.${coupleId}` },
        () => { void fetchMoods() }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId])

  async function selectMood(emoji: string, color: string) {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("mood_entries")
      .upsert(
        { couple_id: coupleId, user_id: userId, emoji, color, entry_date: today },
        { onConflict: "couple_id,user_id,entry_date" }
      )
      .select()
      .single()

    if (!error && data) {
      setMyMood(data as MoodEntry)
      const moodLabel = getMoodByEmoji(emoji)?.label ?? emoji
      void fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couple_id: coupleId,
          sender_id: userId,
          type: "mood_update",
          title: "Người yêu vừa cập nhật tâm trạng",
          body: `${emoji} ${moodLabel}`,
          url: "/mood",
        }),
      })
    }
    setShowPicker(false)
    setIsLoading(false)
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
                disabled={isLoading}
                style={{
                  background: mood.color,
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: isLoading ? 0.6 : 1,
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
