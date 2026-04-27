import Image from "next/image"
import type { LocketPhoto } from "@/types"

interface PhotoGridProps {
  photos: LocketPhoto[]
  currentUserId: string
  onSelectPhoto: (photo: LocketPhoto) => void
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

export default function PhotoGrid({ photos, currentUserId, onSelectPhoto }: PhotoGridProps) {
  const grouped = groupByDate(photos)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {[...grouped.entries()].map(([label, datePhotos]) => (
        <div key={label}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A6A72", marginBottom: 8 }}>
            {label}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {datePhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                style={{
                  position: "relative", aspectRatio: "1/1", borderRadius: 14,
                  overflow: "hidden", border: "none", padding: 0, cursor: "pointer",
                  display: "block",
                }}
              >
                <Image
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  fill
                  sizes="(max-width: 480px) 50vw, 240px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 7, left: 8, right: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                }}>
                  <span style={{ color: "white", fontSize: 11, fontWeight: 600 }}>
                    {photo.sender_id === currentUserId ? "Bạn" : "Người ấy"}
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>
                    {photo.reaction ?? ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
