"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Memory } from "@/types"
import JarHero from "./JarHero"
import MemoryCard from "./MemoryCard"
import AddMemoryDialog from "./AddMemoryDialog"
import Slideshow from "./Slideshow"

type FilterType = "all" | "locket" | "quest" | "letter" | "manual"

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "locket", label: "📸 Ảnh" },
  { value: "quest", label: "✨ Quest" },
  { value: "letter", label: "💌 Thư" },
  { value: "manual", label: "✍️ Thủ công" },
]

interface JarClientProps {
  initialMemories: Memory[]
  totalCount: number
  yearCount: number
  coupleId: string
  pageSize: number
}

export default function JarClient({
  initialMemories,
  totalCount,
  yearCount,
  coupleId,
  pageSize,
}: JarClientProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [filter, setFilter] = useState<FilterType>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialMemories.length < totalCount)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [showSlideshow, setShowSlideshow] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])

  const filtered = filter === "all"
    ? memories
    : memories.filter((m) => {
        if (filter === "manual") return !m.source || m.source === "manual"
        return m.type === filter
      })

  const grouped = groupByMonth(filtered)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    const { data } = await supabase
      .from("memories")
      .select("*")
      .eq("couple_id", coupleId)
      .order("memory_date", { ascending: false })
      .range(memories.length, memories.length + pageSize - 1)

    if (data && data.length > 0) {
      setMemories((prev) => [...prev, ...data])
      setHasMore(data.length === pageSize)
    } else {
      setHasMore(false)
    }

    setIsLoading(false)
  }, [isLoading, hasMore, memories.length, coupleId, pageSize, supabase])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  function handleMemoryAdded(newMemory: Memory) {
    setMemories((prev) => [newMemory, ...prev])
  }

  return (
    <div className="px-4">
      <JarHero
        totalCount={totalCount}
        yearCount={yearCount}
        onSlideshow={() => setShowSlideshow(true)}
      />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={{
              backgroundColor: filter === f.value ? "#E8A0B0" : "#FFFFFF",
              borderColor: filter === f.value ? "#E8A0B0" : "#F0E4DF",
              color: filter === f.value ? "#FFFFFF" : "#8A6A72",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <span className="text-5xl">🫙</span>
          <p className="text-sm font-medium" style={{ color: "#3A2832" }}>
            Chưa có kỷ niệm nào
          </p>
          <p className="text-xs" style={{ color: "#8A6A72" }}>
            Thêm kỷ niệm hoặc hoàn thành quest để lưu lại ♡
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <h3
                className="text-xs font-semibold mb-2 sticky top-0 z-10 py-1"
                style={{ color: "#8A6A72", backgroundColor: "#FDF8F5" }}
              >
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.items.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onOpen={setSelectedMemory}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-8 flex items-center justify-center mt-4">
        {isLoading && (
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#E8A0B0", borderTopColor: "transparent" }}
          />
        )}
        {!hasMore && memories.length > 0 && (
          <p className="text-xs" style={{ color: "#C0909C" }}>
            Đã xem hết ♡
          </p>
        )}
      </div>

      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed right-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg z-40 transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#C0607A", color: "#FFFFFF", bottom: "calc(80px + env(safe-area-inset-bottom))" }}
        aria-label="Thêm kỷ niệm"
      >
        ➕
      </button>

      <AddMemoryDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        coupleId={coupleId}
        onAdded={handleMemoryAdded}
      />

      {selectedMemory && (
        <MemoryDetailDialog
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {showSlideshow && (
        <Slideshow
          coupleId={coupleId}
          year={new Date().getFullYear()}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </div>
  )
}

function groupByMonth(memories: Memory[]) {
  const map = new Map<string, Memory[]>()

  for (const memory of memories) {
    const date = new Date(memory.memory_date)
    const label = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(memory)
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

function MemoryDetailDialog({
  memory,
  onClose,
}: {
  memory: Memory
  onClose: () => void
}) {
  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const sourceLabel: Record<string, string> = {
    locket: "📸 Locket",
    quest: "✨ Quest",
    letter: "💌 Thư",
    manual: "✍️ Thủ công",
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(58,40,50,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg max-h-[80vh] flex flex-col"
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={(e) => e.stopPropagation()}
      >
        {memory.media_url && (
          <div className="relative h-48 w-full flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memory.media_url}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}>
              {sourceLabel[memory.type] ?? sourceLabel[memory.source ?? ""] ?? memory.type}
            </span>
            <span className="text-xs" style={{ color: "#C0909C" }}>
              {formatDate(memory.memory_date)}
            </span>
          </div>

          <h2 className="font-serif text-lg font-bold mb-2" style={{ color: "#3A2832" }}>
            {memory.title}
          </h2>

          {memory.content && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#3A2832", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: "1.8" }}
            >
              {memory.content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
