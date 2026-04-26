"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { LocketPhoto } from "@/types"
import PhotoGrid from "./PhotoGrid"

interface LocketFeedProps {
  initialPhotos: LocketPhoto[]
  coupleId: string
  currentUserId: string
}

export default function LocketFeed({ initialPhotos, coupleId, currentUserId }: LocketFeedProps) {
  const [photos, setPhotos] = useState<LocketPhoto[]>(initialPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<LocketPhoto | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`locket-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "locket_photos",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          setPhotos((prev) => [payload.new as LocketPhoto, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coupleId, supabase])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3A2832" }}>
          Locket
        </h1>
        <span className="text-sm" style={{ color: "#8A6A72" }}>
          {photos.length} ảnh
        </span>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📱</p>
          <p className="text-base font-medium" style={{ color: "#8A6A72" }}>
            Chưa có ảnh nào
          </p>
          <p className="text-sm mt-1" style={{ color: "#C0909C" }}>
            Gửi ảnh đầu tiên cho người ấy nhé!
          </p>
        </div>
      ) : (
        <PhotoGrid
          photos={photos}
          currentUserId={currentUserId}
          selectedPhoto={selectedPhoto}
          onSelectPhoto={setSelectedPhoto}
        />
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption ?? ""}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#3A2832" }}>
                    {selectedPhoto.caption ?? "Không có chú thích"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8A6A72" }}>
                    {new Date(selectedPhoto.taken_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <ReactionPicker photoId={selectedPhoto.id} currentReaction={selectedPhoto.reaction} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReactionPicker({ photoId, currentReaction }: { photoId: string; currentReaction: string | null }) {
  const REACTIONS = ["❤️", "😍", "🥹", "😘", "🤗"]
  const [reacted, setReacted] = useState<string | null>(currentReaction)
  const [isLoading, setIsLoading] = useState(false)

  async function handleReact(emoji: string) {
    if (isLoading) return
    setIsLoading(true)
    setReacted(emoji)
    await fetch("/api/locket", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id: photoId, reaction: emoji }),
    })
    setIsLoading(false)
  }

  return (
    <div className="flex gap-1">
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={() => handleReact(r)}
          className={`w-8 h-8 rounded-full text-lg flex items-center justify-center transition-transform ${
            reacted === r ? "scale-125" : "hover:scale-110"
          }`}
          style={{ backgroundColor: reacted === r ? "#F5EDE8" : "transparent" }}
        >
          {r}
        </button>
      ))}
    </div>
  )
}
