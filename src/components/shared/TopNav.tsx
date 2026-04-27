import Link from "next/link"

export default function TopNav() {
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 16px 14px",
      backgroundColor: "#FDF8F5",
    }}>
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: "#C0607A", letterSpacing: -0.5, fontFamily: "var(--font-heading), serif" }}>
          Two<em>gether</em>
        </span>
        <span style={{ fontSize: 12, color: "#E8A0B0" }}>♡</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/settings" style={{
          width: 38, height: 38, borderRadius: "50%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 2px rgba(192,96,122,0.04), 0 2px 8px rgba(192,96,122,0.05)",
          textDecoration: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M9 21a3 3 0 006 0" stroke="#3A2832" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </header>
  )
}
