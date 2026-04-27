"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { LocketPhoto } from "@/types"
import PhotoGrid from "./PhotoGrid"
import UploadButton from "./UploadButton"

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
        { event: "INSERT", schema: "public", table: "locket_photos", filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          const incoming = payload.new as LocketPhoto
          // deduplicate: own uploads already added via onUploaded optimistic
          setPhotos((prev) => {
            if (prev.some((p) => p.id === incoming.id)) return prev
            return [incoming, ...prev]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId, supabase])

  function handleUploaded(photo: LocketPhoto) {
    setPhotos((prev) => [photo, ...prev])
  }

  function handleReaction(photoId: string, reaction: string) {
    setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, reaction } : p))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((p) => p ? { ...p, reaction } : p)
    }
  }

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#3A2832", fontFamily: "var(--font-heading), serif", margin: 0 }}>
          Locket
        </h1>
        <span style={{ fontSize: 13, color: "#8A6A72" }}>{photos.length} ảnh</span>
      </div>

      {photos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📷</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#8A6A72", margin: "0 0 6px" }}>
            Gửi ảnh đầu tiên hôm nay ♡
          </p>
          <p style={{ fontSize: 13, color: "#C0909C", margin: 0 }}>
            Nhấn nút 📷 để chụp và gửi cho người ấy
          </p>
        </div>
      ) : (
        <PhotoGrid
          photos={photos}
          currentUserId={currentUserId}
          onSelectPhoto={setSelectedPhoto}
        />
      )}

      <UploadButton coupleId={coupleId} onUploaded={handleUploaded} />

      {selectedPhoto && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.6)", padding: 16,
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{ width: "100%", maxWidth: 360, borderRadius: 20, overflow: "hidden", backgroundColor: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
              <Image
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption ?? ""}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#3A2832", margin: "0 0 3px" }}>
                    {selectedPhoto.caption || "Không có chú thích"}
                  </p>
                  <p style={{ fontSize: 12, color: "#8A6A72", margin: 0 }}>
                    {selectedPhoto.sender_id === currentUserId ? "Bạn" : "Người ấy"} •{" "}
                    {new Date(selectedPhoto.taken_at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric" })}
                  </p>
                </div>
                {selectedPhoto.reaction && (
                  <span style={{ fontSize: 24 }}>{selectedPhoto.reaction}</span>
                )}
              </div>
              <ReactionPicker
                photoId={selectedPhoto.id}
                currentReaction={selectedPhoto.reaction}
                onReact={handleReaction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReactionPicker({
  photoId,
  currentReaction,
  onReact,
}: {
  photoId: string
  currentReaction: string | null
  onReact: (photoId: string, reaction: string) => void
}) {
  const REACTIONS = ["❤️", "😍", "🥹", "😘", "🤗"]
  const [reacted, setReacted] = useState<string | null>(currentReaction)
  const [isLoading, setIsLoading] = useState(false)

  async function handleReact(emoji: string) {
    if (isLoading) return
    const next = reacted === emoji ? null : emoji
    setReacted(next)
    if (next) onReact(photoId, next)
    setIsLoading(true)
    await fetch("/api/locket", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id: photoId, reaction: next }),
    })
    setIsLoading(false)
  }

  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
      {REACTIONS.map((r) => (
        <button
          key={r}
          onClick={() => handleReact(r)}
          style={{
            flex: 1, height: 44, borderRadius: 12, border: "none", fontSize: 22,
            cursor: "pointer", transition: "transform 0.15s",
            backgroundColor: reacted === r ? "#F5EDE8" : "#FDF8F5",
            transform: reacted === r ? "scale(1.2)" : "scale(1)",
          }}
        >
          {r}
        </button>
      ))}
    </div>
  )
}
