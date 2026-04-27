import { signInWithGoogle } from "./actions"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden" style={{ backgroundColor: "#FDF8F5" }}>
      {[
        { left: "8%", top: "12%", size: 20, color: "#F4C8D0", rot: 25, op: 0.4 },
        { left: "85%", top: "8%", size: 14, color: "#E8A0B0", rot: 140, op: 0.35 },
        { left: "15%", top: "72%", size: 18, color: "#DCD2E8", rot: 60, op: 0.3 },
        { left: "80%", top: "68%", size: 12, color: "#C9DDD2", rot: 200, op: 0.35 },
        { left: "50%", top: "5%", size: 10, color: "#F4C8D0", rot: 310, op: 0.25 },
      ].map((p, i) => (
        <svg key={i} width={p.size} height={p.size} viewBox="0 0 24 24"
          style={{ position: "absolute", left: p.left, top: p.top, transform: `rotate(${p.rot}deg)`, opacity: p.op, pointerEvents: "none" }}>
          <path d="M12 2c4 3 6 7 6 11s-3 9-6 9-6-5-6-9 2-8 6-11z" fill={p.color}/>
        </svg>
      ))}

      <div className="w-full max-w-sm flex flex-col" style={{ gap: 40 }}>
        <div className="flex flex-col items-center text-center" style={{ paddingTop: 48 }}>
          <div style={{ marginBottom: 18 }}>
            <svg width="68" height="68" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F4C8D0"/>
                  <stop offset="1" stopColor="#C0607A"/>
                </linearGradient>
              </defs>
              <path d="M40 70s-26-16-26-37c0-11 9-19 18-15 4 1.7 6.5 5 8 8.5 1.5-3.5 4-6.8 8-8.5 9-4 18 4 18 15 0 21-26 37-26 37z" fill="url(#lg1)"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 600, color: "#C0607A", margin: 0, letterSpacing: -1, lineHeight: 1, fontFamily: "var(--font-heading), serif" }}>
            Two<em>gether</em>
          </h1>
          <div style={{ fontSize: 28, color: "#E8A0B0", marginTop: 4 }}>♡</div>
          <p style={{ fontSize: 17, color: "#7A5A65", marginTop: 16, marginBottom: 0, fontWeight: 400, fontFamily: "var(--font-heading), serif", fontStyle: "italic" }}>
            Không gian riêng của hai người
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 14, alignItems: "center" }}>
            <span style={{ width: 24, height: 1, background: "#C0607A", opacity: 0.3, display: "inline-block" }}/>
            <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#B89BA3", fontWeight: 600 }}>Est. 2024</span>
            <span style={{ width: 24, height: 1, background: "#C0607A", opacity: 0.3, display: "inline-block" }}/>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <form action={signInWithGoogle}>
            <button type="submit" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", height: 52, borderRadius: 100,
              background: "white", color: "#C0607A",
              border: "1.5px solid #F4C8D0",
              fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập với Google
            </button>
          </form>

          <Link href="/login/email" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", height: 52, borderRadius: 100,
            background: "#E8A0B0", color: "white",
            fontWeight: 600, fontSize: 15, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(232,160,176,0.4)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M3 7l9 6 9-6" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            Đăng nhập với Email
          </Link>

          <p style={{ fontSize: 11.5, textAlign: "center", color: "#B89BA3", marginTop: 8, lineHeight: 1.5 }}>
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <span style={{ color: "#C0607A", textDecoration: "underline" }}>Điều khoản</span>
            {" "}& <span style={{ color: "#C0607A", textDecoration: "underline" }}>Riêng tư</span>
          </p>
        </div>
      </div>
    </main>
  )
}
