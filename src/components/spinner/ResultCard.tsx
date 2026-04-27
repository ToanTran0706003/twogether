"use client"

import { useState } from "react"
import type { DateIdea } from "@/lib/date-ideas"

const COST_LABEL: Record<string, string> = {
  free: "Miễn phí",
  under200k: "Dưới 200k",
  under500k: "Dưới 500k",
  any: "Bất kỳ",
}

interface ResultCardProps {
  idea: DateIdea
  onSpinAgain: () => void
  onSaveMemory: () => Promise<void>
  onSaveQuest: () => Promise<void>
}

export default function ResultCard({ idea, onSpinAgain, onSaveMemory, onSaveQuest }: ResultCardProps) {
  const [savedMemory, setSavedMemory] = useState(false)
  const [savedQuest, setSavedQuest] = useState(false)
  const [loadingMemory, setLoadingMemory] = useState(false)
  const [loadingQuest, setLoadingQuest] = useState(false)

  async function handleSaveMemory() {
    setLoadingMemory(true)
    await onSaveMemory()
    setSavedMemory(true)
    setLoadingMemory(false)
  }

  async function handleSaveQuest() {
    setLoadingQuest(true)
    await onSaveQuest()
    setSavedQuest(true)
    setLoadingQuest(false)
  }

  return (
    <div
      className="rounded-2xl p-5 border shadow-md animate-in fade-in zoom-in-95 duration-300"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{idea.emoji}</span>
        <h2
          className="font-serif text-xl font-bold leading-tight"
          style={{ color: "#C0607A" }}
        >
          {idea.title}
        </h2>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "#3A2832" }}>
        {idea.description}
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}>
          ⏱ {idea.duration}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}>
          💰 {COST_LABEL[idea.cost]}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}>
          📍 {idea.location === "home" ? "Ở nhà" : idea.location === "outdoor" ? "Ra ngoài" : "Cả hai"}
        </span>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={handleSaveMemory}
          disabled={savedMemory || loadingMemory}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: savedMemory ? "#C0909C" : "#E8A0B0" }}
        >
          {savedMemory ? "Đã lưu ♡" : loadingMemory ? "Đang lưu..." : "❤️ Lưu"}
        </button>
        <button
          onClick={onSpinAgain}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
          style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
        >
          🔄 Spin lại
        </button>
      </div>

      <button
        onClick={handleSaveQuest}
        disabled={savedQuest || loadingQuest}
        className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80 disabled:opacity-60"
        style={{ borderColor: "#D8EDE5", color: savedQuest ? "#C0909C" : "#3A2832", backgroundColor: savedQuest ? "#F5F5F5" : "#D8EDE5" }}
      >
        {savedQuest ? "Đã thêm vào Lovequest ✓" : loadingQuest ? "Đang thêm..." : "✅ Thêm vào Lovequest"}
      </button>
    </div>
  )
}
