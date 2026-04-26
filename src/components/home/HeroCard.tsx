import { getCoupleDays, formatDate } from "@/lib/utils"

interface HeroCardProps {
  anniversary: string | null
  coupleId: string
}

function getNextAnniversary(anniversary: string): { label: string; daysLeft: number } | null {
  const anniv = new Date(anniversary)
  const today = new Date()
  const thisYear = new Date(today.getFullYear(), anniv.getMonth(), anniv.getDate())

  const next = thisYear >= today ? thisYear : new Date(today.getFullYear() + 1, anniv.getMonth(), anniv.getDate())
  const daysLeft = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft === 0) return { label: "Hôm nay là kỷ niệm!", daysLeft: 0 }
  if (daysLeft === 1) return { label: "Ngày mai là kỷ niệm", daysLeft: 1 }
  return { label: `${formatDate(next)}`, daysLeft }
}

export default async function HeroCard({ anniversary, coupleId }: HeroCardProps) {
  const days = anniversary ? getCoupleDays(anniversary) : null
  const next = anniversary ? getNextAnniversary(anniversary) : null

  return (
    <div
      className="mx-4 rounded-3xl p-6 text-center"
      style={{ backgroundColor: "#3A2832" }}
    >
      <p className="text-sm mb-1" style={{ color: "#C0909C" }}>
        Chúng ta đã bên nhau
      </p>
      <div className="font-serif text-6xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
        {days ?? "—"}
      </div>
      <p className="text-2xl mb-4" style={{ color: "#E8A0B0" }}>
        ngày rồi ♡
      </p>

      {next ? (
        <div
          className="border-t pt-4 mt-2 flex items-center justify-center gap-2 text-sm"
          style={{ borderColor: "rgba(255,255,255,0.1)", color: "#C0909C" }}
        >
          <span>🎉</span>
          <span>{next.daysLeft === 0 ? next.label : `Còn ${next.daysLeft} ngày nữa — ${next.label}`}</span>
        </div>
      ) : (
        <div className="border-t pt-4 mt-2">
          <p className="text-sm mb-2" style={{ color: "#C0909C" }}>
            Thêm ngày kỷ niệm để theo dõi
          </p>
          <form action={`/api/couple/${coupleId}/anniversary`} method="POST">
            <button
              type="submit"
              className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#E8A0B0", color: "#3A2832" }}
            >
              Chọn ngày kỷ niệm
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
