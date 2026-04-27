"use client"
import type { LocketPhoto } from "@/types"
import { PhotoCard } from "./PhotoCard"

interface PhotoGridProps {
  photos: LocketPhoto[]
  currentUserId: string
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
}

function getDateLabel(dateStr: string): string {
  const photoDate = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const toDay = (d: Date) => d.toISOString().slice(0, 10)
  const photoDay = toDay(photoDate)
  if (photoDay === toDay(today)) return "Hôm nay"
  if (photoDay === toDay(yesterday)) return "Hôm qua"
  return photoDate.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" })
}

function groupByDate(photos: LocketPhoto[]): Map<string, LocketPhoto[]> {
  const groups = new Map<string, LocketPhoto[]>()
  for (const photo of photos) {
    const label = getDateLabel(photo.taken_at)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(photo)
  }
  return groups
}

export default function PhotoGrid({ photos, currentUserId, onDelete, onReact }: PhotoGridProps) {
  const grouped = groupByDate(photos)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {[...grouped.entries()].map(([label, datePhotos]) => (
        <div key={label}>
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 1, color: "#8A6A72", marginBottom: 8,
          }}>
            {label}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {datePhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isMyPhoto={photo.sender_id === currentUserId}
                onDelete={onDelete}
                onReact={onReact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
