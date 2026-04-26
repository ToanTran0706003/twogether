"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MoodEntry } from "@/types"
import MoodPicker from "./MoodPicker"
import WeeklyGrid from "./WeeklyGrid"

interface MoodClientProps {
  entries: MoodEntry[]
  dates: string[]
  userId: string
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
  partnerId,
  myName,
  partnerName,
  myAvatar,
  partnerAvatar,
}: MoodClientProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(entries)
  const [showPicker, setShowPicker] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const today = new Date().toISOString().split("T")[0]
  const todayEntry = moodEntries.find((e) => e.entry_date === today && e.user_id === userId)

  useEffect(() => {
    const channel = supabase
      .channel(`moodboard-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mood_entries",
          filter: `user_id=eq.${userId},user_id=eq.${partnerId}`,
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
  }, [userId, partnerId, supabase])

  async function handleMoodSelect(emoji: string, color: string) {
    const todayDate = new Date().toISOString().split("T")[0]

    const { data } = await supabase
      .from("mood_entries")
      .upsert(
        { couple_id: entries[0]?.couple_id, user_id: userId, emoji, color, entry_date: todayDate },
        { onConflict: "user_id,entry_date" }
      )
      .select()
      .single()

    if (data) {
      setMoodEntries((prev) => {
        const filtered = prev.filter(
          (e) => !(e.entry_date === todayDate && e.user_id === userId)
        )
        return [data, ...filtered]
      })
    }
    setShowPicker(false)
  }

  return (
    <div className="px-4 space-y-6">
      <div
        className="rounded-2xl p-4 border shadow-sm"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
      >
        <MoodPicker
          todayEntry={todayEntry ?? null}
          onSelect={handleMoodSelect}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      </div>

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
