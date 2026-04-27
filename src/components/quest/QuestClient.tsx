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
        { event: "*", schema: "public", table: "quest_items", filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuests((prev) => {
              if (prev.some((q) => q.id === payload.new.id)) return prev
              return [payload.new as QuestItem, ...prev]
            })
          } else if (payload.eventType === "UPDATE") {
            setQuests((prev) =>
              prev.map((q) => (q.id === payload.new.id ? (payload.new as QuestItem) : q))
            )
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId, supabase])

  function handleQuestUpdated(updated: QuestItem) {
    setQuests((prev) => prev.map((q) => q.id === updated.id ? updated : q))
  }

  const filtered = quests.filter((q) => {
    if (filter === "todo") return !q.completed
    if (filter === "done") return q.completed
    return true
  })

  const completed = quests.filter((q) => q.completed).length
  const total = quests.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#3A2832", fontFamily: "var(--font-heading), serif", margin: "0 0 2px" }}>
            Lovequest
          </h1>
          <p style={{ fontSize: 13, color: "#8A6A72", margin: 0 }}>
            {completed}/{total} hoàn thành
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width: 40, height: 40, borderRadius: "50%", backgroundColor: "#C0607A",
            color: "white", border: "none", fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(192,96,122,0.35)",
          }}
        >
          +
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ height: 8, borderRadius: 8, backgroundColor: "#F0E4DF", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 8,
                background: "linear-gradient(90deg, #E8A0B0, #C0607A)",
                width: `${pct}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#B89BA3", marginTop: 4, textAlign: "right" }}>{pct}%</p>
        </div>
      )}

      {/* Filter tabs */}
      <FilterBar filter={filter} onFilterChange={setFilter} filters={FILTERS} />

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>💝</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#8A6A72", margin: 0 }}>
            {filter === "done" ? "Chưa có quest nào hoàn thành" : "Chưa có quest nào"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onUpdated={handleQuestUpdated} />
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
    <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, backgroundColor: "#F5EDE8" }}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 9, border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            backgroundColor: filter === f ? "#FFFFFF" : "transparent",
            color: filter === f ? "#3A2832" : "#8A6A72",
            boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {labels[f]}
        </button>
      ))}
    </div>
  )
}
