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
  onUpdated: (quest: QuestItem) => void
}

export default function QuestCard({ quest, onUpdated }: QuestCardProps) {
  const [showComplete, setShowComplete] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  async function confirmComplete(photoUrl?: string) {
    setIsCompleting(true)
    // Optimistic update
    const optimistic: QuestItem = {
      ...quest,
      completed: true,
      completed_at: new Date().toISOString(),
      photo_url: photoUrl ?? quest.photo_url,
    }
    onUpdated(optimistic)
    setShowComplete(false)

    try {
      const res = await fetch("/api/quest", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: quest.id, completed: true, photo_url: photoUrl ?? null }),
      })
      if (res.ok) {
        const saved: QuestItem = await res.json()
        onUpdated(saved)
      }
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: 12, padding: 16,
          borderRadius: 18, border: "1.5px solid",
          backgroundColor: quest.completed ? "#F5F9F5" : "#FFFFFF",
          borderColor: quest.completed ? "#C8E6C9" : "#F0E4DF",
          opacity: quest.completed ? 0.85 : 1,
          transition: "all 0.2s",
        }}
      >
        <button
          onClick={() => !quest.completed && setShowComplete(true)}
          disabled={quest.completed || isCompleting}
          style={{
            marginTop: 1, width: 24, height: 24, borderRadius: "50%", border: "2px solid",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: quest.completed ? "default" : "pointer",
            borderColor: quest.completed ? "#66BB6A" : "#E8A0B0",
            backgroundColor: quest.completed ? "#66BB6A" : "transparent",
            transition: "all 0.2s",
          }}
        >
          {quest.completed && <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✓</span>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <p style={{
              fontSize: 14, fontWeight: 600, color: "#3A2832", margin: 0,
              textDecoration: quest.completed ? "line-through" : "none",
            }}>
              {quest.title}
            </p>
            {quest.category && (
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 100, flexShrink: 0,
                backgroundColor: (CATEGORY_COLORS[quest.category] ?? "#F0E4DF") + "BB",
                color: "#5A3A42",
              }}>
                {CATEGORY_LABELS[quest.category] ?? quest.category}
              </span>
            )}
          </div>

          {quest.completed && quest.completed_at && (
            <p style={{ fontSize: 11, color: "#8A9A8A", marginTop: 3 }}>
              Hoàn thành {new Date(quest.completed_at).toLocaleDateString("vi-VN")}
            </p>
          )}

          {quest.photo_url && (
            <div style={{ position: "relative", marginTop: 8, width: 80, height: 80, borderRadius: 10, overflow: "hidden" }}>
              <Image src={quest.photo_url} alt="Quest photo" fill style={{ objectFit: "cover" }} unoptimized />
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
