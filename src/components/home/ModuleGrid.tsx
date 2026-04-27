"use client"

import Link from "next/link"

const MODULES = [
  { emoji: "🌸", label: "Locket", href: "/locket", bg: "#F4C8D0", description: "Gửi ảnh cho nhau" },
  { emoji: "✨", label: "Lovequest", href: "/quest", bg: "#C9DDD2", description: "Nhiệm vụ tình yêu" },
  { emoji: "💌", label: "Dear you", href: "/dear", bg: "#F4C8D0", description: "Thư tình hẹn giờ" },
  { emoji: "🎡", label: "Date night", href: "/spinner", bg: "#F2DDC2", description: "Spin ý tưởng" },
  { emoji: "🎨", label: "Moodboard", href: "/mood", bg: "#DCD2E8", description: "Bảng cảm xúc" },
  { emoji: "🫙", label: "Memory jar", href: "/jar", bg: "#D8C7DC", description: "Lọ kỷ niệm" },
]

interface ModuleGridProps {
  photoCount?: number
  questCompleted?: number
  questTotal?: number
  letterCount?: number
  memoryCount?: number
}

export default function ModuleGrid({ photoCount = 0, questCompleted = 0, questTotal = 0, letterCount = 0, memoryCount = 0 }: ModuleGridProps) {
  const stats = [
    photoCount > 0 ? `${photoCount} ảnh mới` : "Gửi ảnh nào",
    questTotal > 0 ? `${questCompleted}/${questTotal}` : "Khám phá",
    letterCount > 0 ? `${letterCount} thư hẹn` : "Viết thư",
    "Spin nào",
    "Hôm nay?",
    memoryCount > 0 ? `${memoryCount} kỷ niệm` : "Lưu kỷ niệm",
  ]

  return (
    <div className="px-4 py-5">
      <div className="section-h"><span>Tính năng</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {MODULES.map((mod, i) => (
          <Link
            key={mod.label}
            href={mod.href}
            style={{
              background: mod.bg, borderRadius: 18, padding: "14px 12px",
              aspectRatio: "1 / 1.1",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 1px 2px rgba(192,96,122,0.04), 0 2px 8px rgba(192,96,122,0.05)",
              textDecoration: "none", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 24 }}>{mod.emoji}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3A2832", letterSpacing: -0.2 }}>{mod.label}</div>
              <div style={{ fontSize: 10.5, color: "rgba(58,40,50,0.55)", fontWeight: 500, marginTop: 1 }}>{stats[i]}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
