"use client"

import { useEffect, useState, useMemo } from "react"
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
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`locket-${coupleId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "locket_photos", filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          const incoming = payload.new as LocketPhoto
          setPhotos((prev) => {
            if (prev.some((p) => p.id === incoming.id)) return prev
            return [incoming, ...prev]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId, supabase])

  async function handleReact(photoId: string, emoji: string) {
    setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, reaction: emoji } : p))
    await supabase
      .from("locket_photos")
      .update({ reaction: emoji })
      .eq("id", photoId)
  }

  async function handleDelete(photoId: string) {
    await supabase.from("locket_photos").delete().eq("id", photoId)
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
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
          onDelete={handleDelete}
          onReact={handleReact}
        />
      )}

      <UploadButton coupleId={coupleId} />
    </div>
  )
}
