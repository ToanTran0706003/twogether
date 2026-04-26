"use client"

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
  onSave: () => void
}

export default function ResultCard({ idea, onSpinAgain, onSave }: ResultCardProps) {
  return (
    <div
      className="rounded-2xl p-5 border shadow-md animate-in fade-in zoom-in-95 duration-300"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{idea.emoji}</span>
        <div>
          <h2
            className="font-serif text-xl font-bold leading-tight"
            style={{ color: "#C0607A" }}
          >
            {idea.title}
          </h2>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "#3A2832" }}
      >
        {idea.description}
      </p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}
        >
          <span>⏱</span>
          <span>{idea.duration}</span>
        </div>
        <div
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}
        >
          <span>💰</span>
          <span>{COST_LABEL[idea.cost]}</span>
        </div>
        <div
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#F5EDE8", color: "#8A6A72" }}
        >
          <span>📍</span>
          <span>
            {idea.location === "home" ? "Ở nhà" : idea.location === "outdoor" ? "Ra ngoài" : "Cả hai"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#E8A0B0" }}
        >
          ❤️ Lưu
        </button>
        <button
          onClick={onSpinAgain}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
          style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
        >
          🔄 Spin lại
        </button>
      </div>
    </div>
  )
}
