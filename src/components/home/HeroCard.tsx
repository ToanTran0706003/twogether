import { getCoupleDays, formatDate } from "@/lib/utils"
import AnniversaryPicker from "./AnniversaryPicker"
import PetalEffect from "./PetalEffect"

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
  return { label: formatDate(next), daysLeft }
}

export default async function HeroCard({ anniversary, coupleId }: HeroCardProps) {
  const days = anniversary ? getCoupleDays(anniversary) : null
  const next = anniversary ? getNextAnniversary(anniversary) : null

  return (
    <div className="card-dark mx-4" style={{ padding: "22px 22px 18px", position: "relative", overflow: "hidden" }}>
      <PetalEffect anniversary={anniversary} />
      <svg width="80" height="80" viewBox="0 0 24 24" style={{ position: "absolute", top: -10, right: -10, opacity: 0.18, pointerEvents: "none" }}>
        <path d="M12 2c4 3 6 7 6 11s-3 9-6 9-6-5-6-9 2-8 6-11z" fill="#E8A0B0"/>
      </svg>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: 0.3 }}>
        Chúng ta đã bên nhau
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 76, fontWeight: 600, color: "white", lineHeight: 1, letterSpacing: -2, fontFamily: "var(--font-heading), serif" }}>
          {days ?? "—"}
        </span>
        <em style={{ fontSize: 22, color: "#F4C8D0", fontFamily: "var(--font-heading), serif" }}>ngày rồi ♡</em>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {next ? (
          <>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Sắp tới</div>
              <div style={{ fontSize: 14, color: "white", marginTop: 2, fontWeight: 500 }}>
                {next.label}
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 100, background: "rgba(232,160,176,0.25)", color: "#F4C8D0", fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#F4C8D0", display: "inline-block" }}/>
              {next.daysLeft === 0 ? "Hôm nay!" : `còn ${next.daysLeft} ngày`}
            </div>
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Thêm ngày kỷ niệm để theo dõi</p>
            <AnniversaryPicker coupleId={coupleId} />
          </div>
        )}
      </div>
    </div>
  )
}
