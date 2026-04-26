"use client"

import { useState, useCallback, useMemo } from "react"
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

export default function SpinnerClient() {
  const [costFilter, setCostFilter] = useState<CostType | null>(null)
  const [locationFilter, setLocationFilter] = useState<LocationType | null>(null)
  const [durationFilter, setDurationFilter] = useState<string | null>(null)
  const [result, setResult] = useState<DateIdea | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinKey, setSpinKey] = useState(0)

  const filteredIdeas = useMemo(
    () =>
      filterIdeas(DATE_IDEAS, {
        cost: costFilter,
        location: locationFilter,
        duration: durationFilter,
      }),
    [costFilter, locationFilter, durationFilter]
  )

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setResult(null)

    setTimeout(() => {
      const picked = pickRandomIdea(filteredIdeas)
      setResult(picked)
      setIsSpinning(false)
      setSpinKey((k) => k + 1)
    }, 1300)
  }, [isSpinning, filteredIdeas])

  async function handleSaveToQuest(idea: DateIdea) {
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
      <SpinWheel
        key={spinKey}
        isSpinning={isSpinning}
        segments={filteredIdeas.length > 0 ? filteredIdeas.length : 6}
        onSpin={handleSpin}
      />

      {filteredIdeas.length === 0 && (
        <div className="text-center py-2">
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
          onSpinAgain={() => {
            setResult(null)
            handleSpin()
          }}
          onSave={() => handleSaveToQuest(result)}
        />
      )}
    </div>
  )
}
