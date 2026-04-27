"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getMoodByEmoji } from "@/lib/mood-config"
import type { MoodEntry } from "@/types"

interface UseMoodOptions {
  coupleId: string
  userId: string
}

interface UseMoodReturn {
  myMood: MoodEntry | null
  partnerMood: MoodEntry | null
  isSaving: boolean
  saveError: string | null
  updateMood: (emoji: string, color: string) => Promise<MoodEntry | null>
  today: string
}

export function useMood({ coupleId, userId }: UseMoodOptions): UseMoodReturn {
  const supabase = useMemo(() => createClient(), [])
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const [myMood, setMyMood] = useState<MoodEntry | null>(null)
  const [partnerMood, setPartnerMood] = useState<MoodEntry | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchTodayMoods = useCallback(async () => {
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("couple_id", coupleId)
      .eq("entry_date", today)
    if (data) {
      setMyMood((data as MoodEntry[]).find(m => m.user_id === userId) ?? null)
      setPartnerMood((data as MoodEntry[]).find(m => m.user_id !== userId) ?? null)
    }
  }, [coupleId, userId, today, supabase])

  useEffect(() => {
    if (!coupleId) return
    void fetchTodayMoods()
    const channel = supabase
      .channel(`mood-sync-${coupleId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "mood_entries",
        filter: `couple_id=eq.${coupleId}`,
      }, () => { void fetchTodayMoods() })
      .subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [coupleId, fetchTodayMoods, supabase])

  const updateMood = useCallback(async (emoji: string, color: string): Promise<MoodEntry | null> => {
    setIsSaving(true)
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
      setSaveError("Không thể lưu tâm trạng. Vui lòng thử lại.")
      setIsSaving(false)
      return null
    }

    const entry = data as MoodEntry
    setMyMood(entry)

    void fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        couple_id: coupleId,
        sender_id: userId,
        type: "mood_update",
        title: "Người yêu vừa cập nhật tâm trạng",
        body: `${emoji} ${getMoodByEmoji(emoji)?.label ?? emoji}`,
        url: "/mood",
      }),
    })

    setIsSaving(false)
    return entry
  }, [coupleId, userId, today, supabase])

  return { myMood, partnerMood, isSaving, saveError, updateMood, today }
}
