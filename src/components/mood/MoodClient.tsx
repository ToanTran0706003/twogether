"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MoodEntry } from "@/types"
import { MOOD_OPTIONS } from "@/lib/mood-config"
import MoodPicker from "./MoodPicker"
import WeeklyGrid from "./WeeklyGrid"

interface MoodClientProps {
  entries: MoodEntry[]
  dates: string[]
  userId: string
  coupleId: string
  partnerId: string | null
  myName: string
  partnerName: string
  myAvatar?: string | null
  partnerAvatar?: string | null
}

export default function MoodClient({
  entries,
  dates,
  userId,
  coupleId,
  partnerId,
  myName,
  partnerName,
  myAvatar,
  partnerAvatar,
}: MoodClientProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(entries)
  const [showPicker, setShowPicker] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const today = new Date().toISOString().split("T")[0]
  const todayEntry = moodEntries.find((e) => e.entry_date === today && e.user_id === userId)
  const partnerTodayEntry = partnerId
    ? moodEntries.find((e) => e.entry_date === today && e.user_id === partnerId)
    : null
  const partnerMood = partnerTodayEntry
    ? MOOD_OPTIONS.find((m) => m.emoji === partnerTodayEntry.emoji)
    : null

  // Streak: count consecutive days both users have entries
  const streak = useMemo(() => {
    if (!partnerId) return 0
    let count = 0
    const sortedDates = [...dates].sort((a, b) => (a < b ? 1 : -1))
    for (const date of sortedDates) {
      const hasMe = moodEntries.some((e) => e.entry_date === date && e.user_id === userId)
      const hasPartner = moodEntries.some((e) => e.entry_date === date && e.user_id === partnerId)
      if (hasMe && hasPartner) {
        count++
      } else {
        break
      }
    }
    return count
  }, [moodEntries, dates, userId, partnerId])

  // Stats: most common mood this week (combined)
  const topMood = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const entry of moodEntries) {
      counts[entry.emoji] = (counts[entry.emoji] ?? 0) + 1
    }
    let best: string | null = null
    let max = 0
    for (const [emoji, count] of Object.entries(counts)) {
      if (count > max) {
        max = count
        best = emoji
      }
    }
    return best
  }, [moodEntries])

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
            setMoodEntries((prev) => {
              const filtered = prev.filter(
                (e) => !(e.entry_date === entry.entry_date && e.user_id === entry.user_id)
              )
              return [entry, ...filtered]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coupleId, supabase])

  async function handleMoodSelect(emoji: string, color: string) {
    setSaveError(null)
    const { data, error } = await supabase
      .from("mood_entries")
      .upsert(
        { couple_id: coupleId, user_id: userId, emoji, color, entry_date: today },
        { onConflict: "couple_id,user_id,entry_date" }
      )
      .select()
      .single()

    if (error) {
      setSaveError("Không thể lưu tâm trạng, thử lại nhé")
      return
    }
    if (data) {
      setMoodEntries((prev) => {
        const filtered = prev.filter(
          (e) => !(e.entry_date === today && e.user_id === userId)
        )
        return [data, ...filtered]
      })
    }
    setShowPicker(false)
  }

  return (
    <div className="px-4 space-y-4">
      {saveError && (
        <div className="rounded-xl px-4 py-2 text-xs text-center" style={{ backgroundColor: "#FEE2E2", color: "#C0607A" }}>
          {saveError}
        </div>
      )}
      {/* Streak + Stats row */}
      {(streak > 0 || topMood) && (
        <div className="flex gap-3">
          {streak > 0 && (
            <div
              className="flex-1 rounded-2xl p-3 border shadow-sm flex items-center gap-2"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
            >
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#C0607A" }}>
                  {streak} ngày streak
                </p>
                <p className="text-[10px]" style={{ color: "#8A6A72" }}>
                  Cùng cập nhật liên tục
                </p>
              </div>
            </div>
          )}
          {topMood && (
            <div
              className="flex-1 rounded-2xl p-3 border shadow-sm flex items-center gap-2"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
            >
              <span className="text-xl">{topMood}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#C0607A" }}>
                  Mood nổi bật
                </p>
                <p className="text-[10px]" style={{ color: "#8A6A72" }}>
                  Tuần này hay {topMood} nhất
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My mood + Partner mood */}
      <div className="flex gap-3">
        <div
          className="flex-1 rounded-2xl p-4 border shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
        >
          <MoodPicker
            todayEntry={todayEntry ?? null}
            onSelect={handleMoodSelect}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
        </div>

        {partnerId && (
          <div
            className="flex-1 rounded-2xl p-4 border shadow-sm flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
          >
            <h2 className="text-xs font-semibold self-start" style={{ color: "#8A6A72" }}>
              {partnerName}
            </h2>
            {partnerMood ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: partnerMood.color }}
                >
                  {partnerMood.emoji}
                </div>
                <p className="text-xs font-medium" style={{ color: "#3A2832" }}>
                  {partnerMood.label}
                </p>
              </>
            ) : (
              <p className="text-sm text-center py-2" style={{ color: "#C0909C" }}>
                Chưa cập nhật 🌙
              </p>
            )}
          </div>
        )}
      </div>

      {/* Weekly grid */}
      <div
        className="rounded-2xl p-4 border shadow-sm"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
      >
        <WeeklyGrid
          entries={moodEntries}
          dates={dates}
          userId={userId}
          partnerId={partnerId}
          myName={myName}
          partnerName={partnerName}
          myAvatar={myAvatar}
          partnerAvatar={partnerAvatar}
        />
      </div>
    </div>
  )
}
