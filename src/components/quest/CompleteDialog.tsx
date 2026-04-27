"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { resizeImage } from '@/lib/image-utils'

interface CompleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questTitle: string
  onConfirm: (photoUrl?: string) => void
  isLoading: boolean
}

export default function CompleteDialog({
  open,
  onOpenChange,
  questTitle,
  onConfirm,
  isLoading,
}: CompleteDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setIsUploading(true)
    try {
      const blob = await resizeImage(file, 1200)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const filePath = `quest/${Date.now()}.webp`
      const { error } = await supabase.storage.from("photos").upload(filePath, blob, { contentType: "image/webp" })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)
      setUploadedUrl(publicUrl)
    } catch (err) {
      console.error("Upload failed:", err)
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleClose() {
    if (isLoading || isUploading) return
    setPreviewUrl(null)
    setUploadedUrl(null)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(58,40,50,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "white", borderRadius: 24, padding: 24,
          width: "100%", maxWidth: 380,
          display: "flex", flexDirection: "column", gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 40, margin: "0 0 6px" }}>🎉</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#C0607A", fontFamily: "var(--font-heading), serif", margin: 0 }}>
            Hoàn thành quest!
          </p>
        </div>

        <p style={{ fontSize: 14, color: "#3A2832", textAlign: "center", margin: 0 }}>
          <strong>&ldquo;{questTitle}&rdquo;</strong>
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {previewUrl ? (
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden" }}>
            <Image src={previewUrl} alt="preview" fill style={{ objectFit: "cover" }} unoptimized />
            {isUploading && (
              <div style={{
                position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 14, fontWeight: 600,
              }}>
                Đang tải ảnh...
              </div>
            )}
            {!isUploading && (
              <button
                onClick={() => { setPreviewUrl(null); setUploadedUrl(null) }}
                style={{
                  position: "absolute", top: 8, right: 8, width: 28, height: 28,
                  borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none",
                  color: "white", fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              width: "100%", height: 80, borderRadius: 14,
              border: "2px dashed #E8C0C8", background: "#FDF8F5",
              color: "#C0607A", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}
          >
            <span style={{ fontSize: 22 }}>📷</span>
            Thêm ảnh kỷ niệm (tuỳ chọn)
          </button>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleClose}
            disabled={isLoading || isUploading}
            style={{
              flex: 1, height: 46, borderRadius: 100,
              border: "1.5px solid #E0C8CC", background: "white",
              color: "#7A5A65", fontWeight: 600, fontSize: 14, cursor: "pointer",
              opacity: (isLoading || isUploading) ? 0.5 : 1,
            }}
          >
            Huỷ
          </button>
          <button
            onClick={() => onConfirm(uploadedUrl ?? undefined)}
            disabled={isLoading || isUploading}
            style={{
              flex: 2, height: 46, borderRadius: 100, border: "none",
              background: "#C0607A", color: "white", fontWeight: 600,
              fontSize: 14, cursor: "pointer",
              opacity: (isLoading || isUploading) ? 0.7 : 1,
            }}
          >
            {isLoading ? "Đang lưu..." : isUploading ? "Chờ ảnh..." : "Hoàn thành ✓"}
          </button>
        </div>
      </div>
    </div>
  )
}
