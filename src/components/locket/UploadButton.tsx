"use client"

import { useRef, useState } from "react"
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { resizeImage } from '@/lib/image-utils'
import { useToast } from '@/components/shared/Toast'

interface UploadButtonProps {
  coupleId: string
}

export default function UploadButton({ coupleId }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { showToast } = useToast()
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
      // Realtime subscription in LocketFeed handles adding the photo
    } catch (err) {
      console.error("Upload failed:", err)
      showToast("Tải ảnh thất bại. Vui lòng thử lại.", "error")
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
        className="fab"
        style={{ fontSize: 24, opacity: isUploading ? 0.7 : 1 }}
      >
        {isUploading ? <LoadingSpinner size={20} color="white" /> : "📷"}
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
