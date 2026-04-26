"use client"

import { useState } from "react"
import Image from "next/image"
import type { QuestItem } from "@/types"
import CompleteDialog from "./CompleteDialog"

const CATEGORY_LABELS: Record<string, string> = {
  food: "Ăn uống",
  travel: "Du lịch",
  home: "Ở nhà",
  adventure: "Phiêu lưu",
  creative: "Sáng tạo",
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#FFE4CC",
  travel: "#D4F0F0",
  home: "#F0E4DF",
  adventure: "#E8F4D4",
  creative: "#F4E4F0",
}

interface QuestCardProps {
  quest: QuestItem
}

export default function QuestCard({ quest }: QuestCardProps) {
  const [showComplete, setShowComplete] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  async function handleToggle() {
    if (quest.completed) return
    setShowComplete(true)
  }

  async function confirmComplete(photoUrl?: string) {
    setIsCompleting(true)
    await fetch("/api/quest", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quest_id: quest.id,
        completed: true,
        photo_url: photoUrl ?? null,
      }),
    })
    setShowComplete(false)
    setIsCompleting(false)
  }

  return (
    <>
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border transition-all"
        style={{
          backgroundColor: quest.completed ? "#F5F9F5" : "#FFFFFF",
          borderColor: quest.completed ? "#D4EDDA" : "#F0E4DF",
          opacity: quest.completed ? 0.8 : 1,
        }}
      >
        <button
          onClick={handleToggle}
          disabled={quest.completed}
          className="mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110 disabled:cursor-default"
          style={{
            borderColor: quest.completed ? "#7AC47A" : "#E8A0B0",
            backgroundColor: quest.completed ? "#7AC47A" : "transparent",
          }}
        >
          {quest.completed && <span className="text-white text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className="text-sm font-medium"
              style={{
                color: "#3A2832",
                textDecoration: quest.completed ? "line-through" : "none",
              }}
            >
              {quest.title}
            </p>
            {quest.category && (
              <span
                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[quest.category] + "99", color: "#3A2832" }}
              >
                {CATEGORY_LABELS[quest.category] ?? quest.category}
              </span>
            )}
          </div>

          {quest.completed && quest.completed_at && (
            <p className="text-xs mt-1" style={{ color: "#8A6A72" }}>
              Hoàn thành {new Date(quest.completed_at).toLocaleDateString("vi-VN")}
            </p>
          )}

          {quest.photo_url && (
            <div className="relative mt-2 w-20 h-20 rounded-xl overflow-hidden">
              <Image
                src={quest.photo_url}
                alt="Quest photo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      <CompleteDialog
        open={showComplete}
        onOpenChange={setShowComplete}
        questTitle={quest.title}
        onConfirm={confirmComplete}
        isLoading={isCompleting}
      />
    </>
  )
}
