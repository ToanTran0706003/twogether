"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface UploadButtonProps {
  coupleId: string
  onUploaded?: () => void
}

export default function UploadButton({ coupleId, onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const resized = await resizeImage(file, 1200)
      const fileName = `${Date.now()}.jpg`
      const filePath = `photos/${coupleId}/locket/${fileName}`

      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, resized, { contentType: "image/jpeg" })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath)

      const res = await fetch("/api/locket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: publicUrl, caption: "", couple_id: coupleId }),
      })

      if (!res.ok) throw new Error("Failed to save photo")

      onUploaded?.()
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Tải ảnh thất bại. Vui lòng thử lại.")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg p-0 flex items-center justify-center text-2xl z-40"
        style={{ backgroundColor: "#C0607A" }}
        aria-label="Chụp ảnh mới"
      >
        {isUploading ? (
          <span className="animate-spin text-xl">⏳</span>
        ) : (
          <span>📷</span>
        )}
      </Button>
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
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Canvas toBlob failed"))
        },
        "image/jpeg",
        0.85
      )
    }
    img.onerror = () => reject(new Error("Image load failed"))
    img.src = URL.createObjectURL(file)
  })
}
