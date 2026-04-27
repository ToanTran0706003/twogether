"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import SpinWheel from "@/components/spinner/SpinWheel"
import FilterBar from "@/components/spinner/FilterBar"
import ResultCard from "@/components/spinner/ResultCard"
import {
  DATE_IDEAS,
  filterIdeas,
  pickRandomIdea,
  type CostType,
  type LocationType,
  type DateIdea,
} from "@/lib/date-ideas"

const HISTORY_KEY = "spinner_history"
const MAX_HISTORY = 10

function loadHistory(): DateIdea[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]")
  } catch {
    return []
  }
}

function saveHistory(idea: DateIdea) {
  const prev = loadHistory()
  const deduped = prev.filter((i) => i.title !== idea.title)
  const updated = [idea, ...deduped].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export default function SpinnerClient() {
  const [costFilter, setCostFilter] = useState<CostType | null>(null)
  const [locationFilter, setLocationFilter] = useState<LocationType | null>(null)
  const [durationFilter, setDurationFilter] = useState<string | null>(null)
  const [result, setResult] = useState<DateIdea | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinKey, setSpinKey] = useState(0)
  const [history, setHistory] = useState<DateIdea[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const filteredIdeas = useMemo(
    () => filterIdeas(DATE_IDEAS, { cost: costFilter, location: locationFilter, duration: durationFilter }),
    [costFilter, locationFilter, durationFilter]
  )

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    if (filteredIdeas.length === 0) {
      showToast("Thử bộ lọc khác nhé!")
      return
    }
    setIsSpinning(true)
    setResult(null)
    setSpinKey((k) => k + 1)

    setTimeout(() => {
      const picked = pickRandomIdea(filteredIdeas)
      if (picked) {
        setResult(picked)
        saveHistory(picked)
        setHistory(loadHistory())
      }
      setIsSpinning(false)
    }, 1300)
  }, [isSpinning, filteredIdeas])

  async function handleSaveMemory(idea: DateIdea) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: couple } = await supabase
      .from("couples")
      .select("id")
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .single()

    if (!couple) return

    await supabase.from("memories").insert({
      couple_id: couple.id,
      user_id: user.id,
      type: "manual",
      title: idea.title,
      content: idea.description,
      memory_date: new Date().toISOString(),
      source: "manual",
    })
  }

  async function handleSaveQuest(idea: DateIdea) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: couple } = await supabase
      .from("couples")
      .select("id")
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .single()

    if (!couple) return

    await supabase.from("quest_items").insert({
      couple_id: couple.id,
      created_by: user.id,
      title: idea.title,
      category: "hẹn hò",
    })
  }

  return (
    <div className="px-4 space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          style={{ backgroundColor: "#C0607A", color: "#FFFFFF" }}
        >
          {toast}
        </div>
      )}

      <SpinWheel
        key={spinKey}
        isSpinning={isSpinning}
        segments={filteredIdeas.length > 0 ? filteredIdeas.length : 6}
        onSpin={handleSpin}
      />

      {filteredIdeas.length === 0 && (
        <div className="text-center py-1">
          <p className="text-xs" style={{ color: "#C0607A" }}>
            Không có gợi ý phù hợp với bộ lọc hiện tại. Thử bỏ bớt filter nhé!
          </p>
        </div>
      )}

      <FilterBar
        costFilter={costFilter}
        locationFilter={locationFilter}
        durationFilter={durationFilter}
        onCostChange={setCostFilter}
        onLocationChange={setLocationFilter}
        onDurationChange={setDurationFilter}
      />

      {result && !isSpinning && (
        <ResultCard
          idea={result}
          onSpinAgain={() => { setResult(null); handleSpin() }}
          onSaveMemory={() => handleSaveMemory(result)}
          onSaveQuest={() => handleSaveQuest(result)}
        />
      )}

      {history.length > 0 && (
        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
        >
          <h3 className="text-xs font-semibold mb-3" style={{ color: "#8A6A72" }}>
            Gần đây
          </h3>
          <div className="space-y-2">
            {history.map((idea, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base">{idea.emoji}</span>
                <span className="text-sm" style={{ color: "#3A2832" }}>{idea.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
