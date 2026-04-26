"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import type { QuestItem } from "@/types"
import QuestCard from "./QuestCard"
import AddQuestDialog from "./AddQuestDialog"

interface QuestClientProps {
  initialQuests: QuestItem[]
  coupleId: string
}

const FILTERS = ["all", "todo", "done"] as const
type Filter = (typeof FILTERS)[number]

export default function QuestClient({ initialQuests, coupleId }: QuestClientProps) {
  const [quests, setQuests] = useState<QuestItem[]>(initialQuests)
  const [filter, setFilter] = useState<Filter>("all")
  const [showAdd, setShowAdd] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`quest-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quest_items",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuests((prev) => [payload.new as QuestItem, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setQuests((prev) =>
              prev.map((q) => (q.id === payload.new.id ? (payload.new as QuestItem) : q))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coupleId, supabase])

  const filtered = quests.filter((q) => {
    if (filter === "todo") return !q.completed
    if (filter === "done") return q.completed
    return true
  })

  const completed = quests.filter((q) => q.completed).length

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#3A2832" }}>
            Lovequest
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#8A6A72" }}>
            {completed}/{quests.length} hoàn thành
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: "#C0607A", color: "#FFFFFF" }}
        >
          +
        </button>
      </div>

      <FilterBar filter={filter} onFilterChange={setFilter} filters={FILTERS} />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">💝</p>
          <p className="text-base font-medium" style={{ color: "#8A6A72" }}>
            {filter === "done" ? "Chưa có quest nào hoàn thành" : "Chưa có quest nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      <AddQuestDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        coupleId={coupleId}
        onAdded={(quest) => {
          setQuests((prev) => [quest as QuestItem, ...prev])
        }}
      />
    </div>
  )
}

function FilterBar({
  filter,
  onFilterChange,
  filters,
}: {
  filter: Filter
  onFilterChange: (f: Filter) => void
  filters: readonly Filter[]
}) {
  const labels: Record<Filter, string> = { all: "Tất cả", todo: "Chưa xong", done: "Đã xong" }

  return (
    <div
      className="flex gap-1 p-1 rounded-xl"
      style={{ backgroundColor: "#F5EDE8" }}
    >
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: filter === f ? "#FFFFFF" : "transparent",
            color: filter === f ? "#3A2832" : "#8A6A72",
            boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
          }}
        >
          {labels[f]}
        </button>
      ))}
    </div>
  )
}
