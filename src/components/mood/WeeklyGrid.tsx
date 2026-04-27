"use client"

import Image from "next/image"
import type { MoodEntry } from "@/types"
import { MOOD_OPTIONS } from "@/lib/mood-config"

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

interface WeeklyGridProps {
  entries: MoodEntry[]
  dates: string[]
  userId: string
  partnerId: string | null
  myName: string
  partnerName: string
  myAvatar?: string | null
  partnerAvatar?: string | null
}

function getMoodInfo(emoji: string) {
  return MOOD_OPTIONS.find((m) => m.emoji === emoji) ?? null
}

function formatDayLabel(dateStr: string) {
  const date = new Date(dateStr)
  const dayIndex = date.getDay()
  const adjusted = dayIndex === 0 ? 6 : dayIndex - 1
  return DAY_LABELS[adjusted]
}

function formatMonthDay(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0]
}

export default function WeeklyGrid({
  entries,
  dates,
  userId,
  partnerId,
  myName,
  partnerName,
  myAvatar,
  partnerAvatar,
}: WeeklyGridProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "#8A6A72" }}>
        7 ngày gần nhất
      </h2>

      <div className="grid grid-cols-8 gap-1">
        <div />

        {dates.map((date) => (
          <div
            key={date}
            className="flex flex-col items-center gap-1 py-1 rounded-lg"
            style={{
              backgroundColor: isToday(date) ? "#F7D6DF" : "transparent",
            }}
          >
            <span
              className="text-[10px] font-semibold"
              style={{ color: isToday(date) ? "#C0607A" : "#8A6A72" }}
            >
              {formatDayLabel(date)}
            </span>
            <span
              className="text-[9px]"
              style={{ color: "#C0909C" }}
            >
              {formatMonthDay(date)}
            </span>
          </div>
        ))}

        <div
          className="flex items-center text-xs font-medium"
          style={{ color: "#8A6A72" }}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden mr-1 relative flex-shrink-0">
            {myAvatar ? (
              <Image
                src={myAvatar}
                alt={myName}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "#E8A0B0", color: "#FFFFFF" }}
              >
                {myName[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <span className="truncate">{myName}</span>
        </div>

        {dates.map((date) => {
          const entry = entries.find((e) => e.entry_date === date && e.user_id === userId)
          const moodInfo = entry ? getMoodInfo(entry.emoji) : null

          return (
            <div
              key={date}
              className="flex items-center justify-center"
            >
              {moodInfo ? (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                  style={{ backgroundColor: moodInfo.color }}
                >
                  {moodInfo.emoji}
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                  style={{ backgroundColor: "#F5EDE8", color: "#C0909C" }}
                >
                  —
                </div>
              )}
            </div>
          )
        })}

        {partnerId ? (
          <div
            className="flex items-center text-xs font-medium"
            style={{ color: "#8A6A72" }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden mr-1 relative flex-shrink-0">
              {partnerAvatar ? (
                <Image
                  src={partnerAvatar}
                  alt={partnerName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#C0607A", color: "#FFFFFF" }}
                >
                  {partnerName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate">{partnerName}</span>
          </div>
        ) : (
          <div className="flex items-center text-xs" style={{ color: "#C0909C" }}>
            Chưa ghép đôi
          </div>
        )}

        {dates.map((date) => {
          const entry = entries.find(
            (e) => e.entry_date === date && e.user_id === partnerId
          )
          const moodInfo = entry ? getMoodInfo(entry.emoji) : null

          return (
            <div
              key={date}
              className="flex items-center justify-center"
            >
              {moodInfo ? (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                  style={{ backgroundColor: moodInfo.color }}
                >
                  {moodInfo.emoji}
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                  style={{ backgroundColor: "#F5EDE8", color: "#C0909C" }}
                >
                  —
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t flex flex-wrap gap-3 justify-center" style={{ borderColor: "#F0E4DF" }}>
        {MOOD_OPTIONS.map((mood) => (
          <div key={mood.emoji} className="flex items-center gap-1">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: mood.color }}
            >
              {mood.emoji}
            </div>
            <span className="text-[10px]" style={{ color: "#8A6A72" }}>
              {mood.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
