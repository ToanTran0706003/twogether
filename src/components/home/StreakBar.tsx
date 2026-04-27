import { createClient } from "@/lib/supabase/server"

interface StreakBarProps {
  coupleId: string
}

function getLast5Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split("T")[0])
  }
  return days
}

export default async function StreakBar({ coupleId }: StreakBarProps) {
  const supabase = await createClient()
  const last5 = getLast5Days()

  const { data: entries } = await supabase
    .from("mood_entries")
    .select("entry_date")
    .eq("couple_id", coupleId)
    .in("entry_date", last5)

  const filledDates = new Set(entries?.map((e) => e.entry_date) ?? [])

  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  const streak = (() => {
    let count = 0
    for (let i = last5.length - 1; i >= 0; i--) {
      if (filledDates.has(last5[i])) count++
      else break
    }
    return count
  })()

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold"
          style={{ backgroundColor: "#F5EDE8", color: "#C0607A" }}
        >
          <span>🔥</span>
          <span>{streak} ngày streak</span>
        </div>

        <div className="flex gap-1.5">
          {last5.map((date, i) => {
            const dayIndex = new Date(date).getDay()
            const label = dayLabels[dayIndex === 0 ? 6 : dayIndex - 1]
            const filled = filledDates.has(date)
            const isToday = i === last5.length - 1

            return (
              <div key={date} className="flex flex-col items-center gap-1">
                <span className="text-xs" style={{ color: isToday ? "#C0607A" : "#8A6A72" }}>
                  {label}
                </span>
                <div
                  className={`w-5 h-5 rounded-full${isToday && filled ? " anim-streakPop" : ""}`}
                  style={{
                    backgroundColor: filled ? "#E8A0B0" : "#F0E4DF",
                    outline: isToday ? "2px solid #C0607A" : "none",
                    outlineOffset: "1px",
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
