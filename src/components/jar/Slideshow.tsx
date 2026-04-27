"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Memory } from "@/types"

interface SlideshowProps {
  coupleId: string
  year: number
  onClose: () => void
}

export default function Slideshow({ coupleId, year, onClose }: SlideshowProps) {
  const [photos, setPhotos] = useState<Memory[]>([])
  const [index, setIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from("memories")
        .select("*")
        .eq("couple_id", coupleId)
        .not("media_url", "is", null)
        .gte("memory_date", `${year}-01-01`)
        .lte("memory_date", `${year}-12-31`)
        .order("memory_date", { ascending: true })

      setPhotos(data ?? [])
      setIsLoading(false)
    }

    fetchPhotos()
  }, [coupleId, year, supabase])

  function prev() {
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1))
  }

  function next() {
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0))
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    if (delta < 0) next()
    else prev()
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  // Fullscreen overlay
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "#000000" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
          aria-label="Đóng"
        >
          ✕
        </button>

        {!isLoading && photos.length > 0 && (
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            {index + 1} / {photos.length}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#E8A0B0", borderTopColor: "transparent" }}
          />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">🫙</span>
          <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
            Chưa có ảnh kỷ niệm nào trong năm {year} 🫙
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#C0607A", color: "#FFFFFF" }}
          >
            Đóng
          </button>
        </div>
      ) : (
        <>
          {/* Photo */}
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[index].media_url!}
              alt={photos[index].title}
              className="max-w-full max-h-full"
              style={{ objectFit: "contain" }}
            />

            {/* Left arrow */}
            {photos.length > 1 && (
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#FFFFFF" }}
                aria-label="Ảnh trước"
              >
                ‹
              </button>
            )}

            {/* Right arrow */}
            {photos.length > 1 && (
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#FFFFFF" }}
                aria-label="Ảnh tiếp"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom info */}
          <div
            className="flex-shrink-0 px-5 py-4"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
          >
            <p className="font-serif text-base font-semibold" style={{ color: "#FFFFFF" }}>
              {photos[index].title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              {formatDate(photos[index].memory_date)}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
