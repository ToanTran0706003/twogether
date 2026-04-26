"use client"

import Link from "next/link"

interface Module {
  emoji: string
  label: string
  stat: string
  href: string
  description: string
}

interface ModuleGridProps {
  photoCount?: number
  questCompleted?: number
  questTotal?: number
  letterCount?: number
  memoryCount?: number
}

const MODULES: Module[] = [
  {
    emoji: "📱",
    label: "Locket",
    stat: "",
    href: "/locket",
    description: "Gửi ảnh cho nhau",
  },
  {
    emoji: "💝",
    label: "Lovequest",
    stat: "",
    href: "/quest",
    description: "Nhiệm vụ tình yêu",
  },
  {
    emoji: "🎨",
    label: "Moodboard",
    stat: "",
    href: "/mood",
    description: "Bảng cảm xúc",
  },
  {
    emoji: "💌",
    label: "Dear you",
    stat: "",
    href: "/letters",
    description: "Thư tình",
  },
  {
    emoji: "🫙",
    label: "Memory jar",
    stat: "",
    href: "/memories",
    description: "Lọ kỷ niệm",
  },
  {
    emoji: "🎰",
    label: "Date spinner",
    stat: "",
    href: "/spinner",
    description: "Spin ý tưởng hẹn hò",
  },
]

export default function ModuleGrid({
  photoCount = 0,
  questCompleted = 0,
  questTotal = 0,
  letterCount = 0,
  memoryCount = 0,
}: ModuleGridProps) {
  const stats = [photoCount.toString(), `${questCompleted}/${questTotal}`, "", letterCount.toString(), memoryCount.toString(), "Spin hôm nay!"]

  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-2 gap-3">
        {MODULES.map((mod, i) => (
          <Link
            key={mod.label}
            href={mod.href}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-transform active:scale-95 hover:opacity-90"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F0E4DF",
              boxShadow: "0 1px 3px rgba(192,96,122,0.06)",
            }}
          >
            <span className="text-3xl leading-none">{mod.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: "#3A2832" }}>
              {mod.label}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#F5EDE8",
                color: "#8A6A72",
                fontWeight: 500,
              }}
            >
              {stats[i]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
