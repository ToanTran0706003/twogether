"use client"

import Image from "next/image"
import type { Memory } from "@/types"

const SOURCE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  locket: { icon: "📸", label: "Locket", color: "#F7D6DF" },
  quest: { icon: "✨", label: "Quest", color: "#D8EDE5" },
  letter: { icon: "💌", label: "Thư", color: "#EDE8F5" },
  manual: { icon: "✍️", label: "Thủ công", color: "#FFF0C0" },
}

function formatMemoryDate(dateStr: string) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day}/${month}/${date.getFullYear()}`
}

function getSourceInfo(memory: Memory) {
  return SOURCE_CONFIG[memory.type] ?? SOURCE_CONFIG[memory.source ?? "manual"] ?? { icon: "📌", label: "Khác", color: "#E8E8E0" }
}

interface MemoryCardProps {
  memory: Memory
  onOpen: (memory: Memory) => void
}

export default function MemoryCard({ memory, onOpen }: MemoryCardProps) {
  const source = getSourceInfo(memory)

  return (
    <button
      onClick={() => onOpen(memory)}
      className="w-full flex items-center gap-3 rounded-xl p-3 border shadow-sm text-left transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      {memory.media_url ? (
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
          <Image
            src={memory.media_url}
            alt={memory.title}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: source.color }}
        >
          {source.icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate mb-0.5"
          style={{ color: "#3A2832" }}
        >
          {memory.title}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: source.color, color: "#3A2832" }}
          >
            {source.icon} {source.label}
          </span>
          <span className="text-[10px]" style={{ color: "#C0909C" }}>
            {formatMemoryDate(memory.memory_date)}
          </span>
        </div>
      </div>
    </button>
  )
}
