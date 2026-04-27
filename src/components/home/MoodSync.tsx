"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MoodEntry } from "@/types"

interface MoodSyncProps {
  coupleId: string
  userId: string
  partnerId: string | null
  initialMoods?: MoodEntry[]
}

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Vui", color: "#FFE066" },
  { emoji: "🥰", label: "Yêu", color: "#FFB3C6" },
  { emoji: "😌", label: "Bình yên", color: "#B5EAD7" },
  { emoji: "😴", label: "Mệt", color: "#C7CEEA" },
  { emoji: "🌧", label: "Buồn", color: "#A8D8EA" },
  { emoji: "😤", label: "Giận", color: "#FFAAA5" },
]

export default function MoodSync({ coupleId, userId, partnerId, initialMoods = [] }: MoodSyncProps) {
  const [myMood, setMyMood] = useState<MoodEntry | null>(
    initialMoods.find((m) => m.user_id === userId) ?? null
  )
  const [partnerMood, setPartnerMood] = useState<MoodEntry | null>(
    initialMoods.find((m) => m.user_id === partnerId) ?? null
  )
  const [showPicker, setShowPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`mood-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mood_entries",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const entry = payload.new as MoodEntry
            if (entry.user_id === userId) setMyMood(entry)
            else if (partnerId && entry.user_id === partnerId) setPartnerMood(entry)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coupleId, userId, partnerId, supabase])

  async function selectMood(emoji: string, color: string) {
    setIsLoading(true)
    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("mood_entries")
      .upsert(
        { couple_id: coupleId, user_id: userId, emoji, color, entry_date: today },
        { onConflict: "couple_id,user_id,entry_date" }
      )
      .select()
      .single()

    if (!error && data) setMyMood(data)
    setShowPicker(false)
    setIsLoading(false)
  }

  const myMoodInfo = myMood ? MOOD_OPTIONS.find((m) => m.emoji === myMood.emoji) : null
  const partnerMoodInfo = partnerMood ? MOOD_OPTIONS.find((m) => m.emoji === partnerMood.emoji) : null

  return (
    <div className="px-4 py-5">
      <h2 className="text-sm font-semibold mb-3" style={{ color: "#8A6A72" }}>
        Cảm xúc hôm nay
      </h2>

      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <MoodCard label="Mình" mood={myMood} emoji={myMoodInfo?.emoji} color={myMoodInfo?.color} />
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #F0E4DF" }}
          >
            {myMoodInfo ? myMoodInfo.emoji : "😊"}
          </button>
        </div>

        <div className="flex-1">
          <MoodCard label="Người ấy" mood={partnerMood} emoji={partnerMoodInfo?.emoji} color={partnerMoodInfo?.color} />
        </div>
      </div>

      {showPicker && (
        <div
          className="mt-3 p-3 rounded-2xl border shadow-md grid grid-cols-3 gap-2"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
        >
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.emoji}
              onClick={() => selectMood(m.emoji, m.color)}
              disabled={isLoading}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:opacity-80 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: m.color + "33" }}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-xs" style={{ color: "#3A2832" }}>{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MoodCard({
  label,
  mood,
  emoji,
  color,
}: {
  label: string
  mood: MoodEntry | null
  emoji: string | null | undefined
  color: string | null | undefined
}) {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{ backgroundColor: color ? color + "33" : "#F5EDE8" }}
    >
      <p className="text-xs mb-1" style={{ color: "#8A6A72" }}>{label}</p>
      <p className="text-3xl">{emoji ?? "—"}</p>
      {!mood && <p className="text-xs mt-1" style={{ color: "#8A6A72" }}>Chưa cập nhật</p>}
    </div>
  )
}
