"use client"

import { useRef, useState } from "react"
import type { LocketPhoto } from "@/types"

interface UploadButtonProps {
  coupleId: string
  onUploaded?: (photo: LocketPhoto) => void
}

export default function UploadButton({ coupleId, onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [caption, setCaption] = useState("")

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (inputRef.current) inputRef.current.value = ""
    try {
      const resized = await resizeImage(file, 1200)
      setPendingBlob(resized)
      setCaption("")
      setShowCaption(true)
    } catch (err) {
      console.error("Resize failed:", err)
    }
  }

  async function handleUpload() {
    if (!pendingBlob) return
    setIsUploading(true)
    setShowCaption(false)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const filePath = `${coupleId}/locket/${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, pendingBlob, { contentType: "image/webp" })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)

      const res = await fetch("/api/locket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: publicUrl, caption: caption.trim() || null, couple_id: coupleId }),
      })
      if (!res.ok) throw new Error("Failed to save photo")
      const saved: LocketPhoto = await res.json()
      onUploaded?.(saved)
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Tải ảnh thất bại. Vui lòng thử lại.")
    } finally {
      setIsUploading(false)
      setPendingBlob(null)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label="Gửi ảnh mới"
        style={{
          position: "fixed", bottom: "calc(80px + env(safe-area-inset-bottom))", right: 16, width: 56, height: 56,
          borderRadius: "50%", backgroundColor: "#C0607A", color: "white",
          border: "none", fontSize: 24, cursor: "pointer", zIndex: 40,
          boxShadow: "0 4px 16px rgba(192,96,122,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: isUploading ? 0.7 : 1,
        }}
      >
        {isUploading ? "⏳" : "📷"}
      </button>

      {showCaption && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            backgroundColor: "rgba(58,40,50,0.5)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => { setShowCaption(false); setPendingBlob(null) }}
        >
          <div
            style={{
              background: "white", borderRadius: "20px 20px 0 0",
              padding: "20px 20px calc(36px + env(safe-area-inset-bottom, 0px))", width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 15, fontWeight: 600, color: "#3A2832", marginBottom: 12 }}>
              Thêm chú thích (tuỳ chọn)
            </p>
            <input
              autoFocus
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Viết gì đó cho người ấy..."
              maxLength={100}
              style={{
                width: "100%", height: 48, padding: "0 14px", borderRadius: 12,
                border: "1.5px solid rgba(58,40,50,0.12)", fontSize: 16, color: "#3A2832",
                background: "#FDF8F5", outline: "none", boxSizing: "border-box",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleUpload()}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => { setShowCaption(false); setPendingBlob(null) }}
                style={{
                  flex: 1, height: 46, borderRadius: 100,
                  border: "1.5px solid #E0C8CC", background: "white",
                  color: "#7A5A65", fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Huỷ
              </button>
              <button
                onClick={handleUpload}
                style={{
                  flex: 2, height: 46, borderRadius: 100, border: "none",
                  background: "#C0607A", color: "white", fontWeight: 600,
                  fontSize: 14, cursor: "pointer",
                }}
              >
                Gửi ảnh ♡
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function resizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/webp",
        0.85
      )
    }
    img.onerror = () => reject(new Error("Image load failed"))
    img.src = URL.createObjectURL(file)
  })
}
