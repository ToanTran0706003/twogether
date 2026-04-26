import Image from "next/image"
import type { LocketPhoto } from "@/types"

interface PhotoGridProps {
  photos: LocketPhoto[]
  currentUserId: string
  selectedPhoto: LocketPhoto | null
  onSelectPhoto: (photo: LocketPhoto | null) => void
}

function groupByDate(photos: LocketPhoto[]): Map<string, LocketPhoto[]> {
  const groups = new Map<string, LocketPhoto[]>()
  for (const photo of photos) {
    const date = new Date(photo.taken_at).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date)!.push(photo)
  }
  return groups
}

export default function PhotoGrid({ photos, currentUserId, onSelectPhoto }: PhotoGridProps) {
  const grouped = groupByDate(photos)

  return (
    <div className="space-y-6">
      {[...grouped.entries()].map(([date, datePhotos]) => (
        <div key={date}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8A6A72" }}>
            {date}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {datePhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <Image
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium truncate">
                    {photo.sender_id === currentUserId ? "Bạn" : "Người ấy"}
                  </span>
                  {photo.reaction && (
                    <span className="text-base leading-none">{photo.reaction}</span>
                  )}
                </div>
                {photo.reaction && (
                  <div className="absolute top-1.5 right-1.5 text-lg leading-none">
                    {photo.reaction}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
