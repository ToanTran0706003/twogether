"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Memory } from "@/types"

interface AddMemoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupleId: string
  onAdded: (memory: Memory) => void
}

export default function AddMemoryDialog({
  open,
  onOpenChange,
  coupleId,
  onAdded,
}: AddMemoryDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [memoryDate, setMemoryDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  })
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const resized = await resizeImage(file, 1200)
      const path = `${coupleId}/memories/${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, resized, { contentType: "image/webp", upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path)
      setMediaUrl(urlData.publicUrl)
      setPreviewUrl(urlData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải ảnh thất bại")
    } finally {
      setIsUploading(false)
    }
  }

  function resizeImage(file: File, maxSize: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề")
      return
    }

    setIsLoading(true)
    setError("")

    const { data, error: fetchError } = await supabase
      .from("memories")
      .insert({
        couple_id: coupleId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        type: "manual",
        title: title.trim(),
        content: content.trim() || null,
        media_url: mediaUrl,
        memory_date: new Date(memoryDate).toISOString(),
        source: "manual",
      })
      .select()
      .single()

    if (fetchError) {
      setError(fetchError.message)
      setIsLoading(false)
      return
    }

    if (data) onAdded(data)

    setTitle("")
    setContent("")
    setMediaUrl(null)
    setPreviewUrl(null)
    setMemoryDate(new Date().toISOString().split("T")[0])
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle
            className="font-serif text-lg"
            style={{ color: "#C0607A" }}
          >
            Thêm kỷ niệm mới 🫙
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề kỷ niệm"
              required
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
              }}
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả khoảnh khắc này (tùy chọn)"
              rows={4}
              className="w-full px-3 py-2 rounded-xl border text-sm leading-relaxed outline-none focus:ring-2 transition-all resize-none"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#8A6A72" }}
            >
              Ngày kỷ niệm
            </label>
            <input
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#F0E4DF",
                backgroundColor: "#FDF8F5",
                color: "#3A2832",
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#8A6A72" }}
            >
              Ảnh (tùy chọn)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:cursor-pointer cursor-pointer"
              style={{ color: "#8A6A72" }}
            />
            {isUploading && (
              <p className="text-xs mt-1.5" style={{ color: "#C0607A" }}>
                Đang tải ảnh...
              </p>
            )}
            {previewUrl && !isUploading && (
              <div className="mt-2 rounded-xl overflow-hidden border" style={{ borderColor: "#F0E4DF" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#C0607A" }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
              style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#E8A0B0" }}
            >
              {isLoading ? "Đang lưu..." : isUploading ? "Đang tải ảnh..." : "Lưu vào lọ"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
