"use client"

import { useState } from "react"

export default function InvitePage() {
  const [tab, setTab] = useState<"create" | "join">("create")
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleCreateCouple() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/couple", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInviteCode(data.invite_code)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleJoinCouple() {
    if (!joinCode.trim()) { setError("Vui lòng nhập mã mời"); return }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/couple", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: joinCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => { window.location.href = "/home" }, 1500)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ flex: 1, padding: "8px 16px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ paddingBottom: 20, paddingTop: 16 }}>
          <h1 style={{ fontSize: 30, fontWeight: 600, color: "#3A2832", margin: "4px 0 6px", letterSpacing: -0.5, fontFamily: "var(--font-heading), serif" }}>
            Kết nối với <em style={{ color: "#C0607A" }}>người yêu</em>
          </h1>
          <p style={{ fontSize: 14, color: "#7A5A65", margin: 0, lineHeight: 1.5 }}>
            Mỗi tài khoản chỉ kết nối với một người. Hãy cùng nhau bắt đầu hành trình ♡
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "12px 0 22px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #C9DDD2 0%, #A8C5B5 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading), serif", fontStyle: "italic", color: "white", fontSize: 27, fontWeight: 600 }}>M</div>
          <div style={{ animation: "pulse-heart 2s ease-in-out infinite" }}>
            <svg width="44" height="44" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9.5C1.5 7 5 3 8.5 4c1.7.5 2.7 1.6 3.5 3 .8-1.4 1.8-2.5 3.5-3C19 3 22.5 7 21 11.5c-2 5-9 9.5-9 9.5z" fill="#E8A0B0"/></svg>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #F4C8D0 0%, #E8A0B0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading), serif", fontStyle: "italic", color: "white", fontSize: 27, fontWeight: 600 }}>L</div>
        </div>

        <div className="tg-tabs" style={{ marginBottom: 20 }}>
          <button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>Tạo couple</button>
          <button className={tab === "join" ? "active" : ""} onClick={() => setTab("join")}>Nhập mã mời</button>
        </div>

        {tab === "create" ? (
          <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
            {!inviteCode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 14, color: "#7A5A65", margin: 0 }}>Tạo couple mới và chia sẻ mã mời với người ấy</p>
                <button
                  onClick={handleCreateCouple}
                  disabled={isLoading}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 52, borderRadius: 100, background: "#E8A0B0", color: "white", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 14px rgba(232,160,176,0.4)", opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? "Đang tạo..." : "Tạo couple mới ♡"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#B89BA3", textTransform: "uppercase", letterSpacing: 1.5 }}>Mã mời của bạn</div>
                <div style={{ fontSize: 38, fontWeight: 600, color: "#C0607A", letterSpacing: 6, fontFamily: "var(--font-heading), serif" }}>{inviteCode}</div>
                <p style={{ fontSize: 12, color: "#B89BA3", margin: 0 }}>Chia sẻ mã này với người ấy để kết nối</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleCopy} style={{ flex: 1, height: 44, borderRadius: 100, background: "#F4C8D0", color: "#C0607A", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {copied ? "Đã copy! ✓" : "Sao chép"}
                  </button>
                  <button onClick={() => navigator.share?.({ text: inviteCode })} style={{ flex: 1, height: 44, borderRadius: 100, background: "#C0607A", color: "white", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Chia sẻ
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 20, padding: 22, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#B89BA3", textTransform: "uppercase", letterSpacing: 1.5 }}>Mã mời từ người yêu</label>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã mời..."
              maxLength={8}
              style={{ width: "100%", height: 56, padding: "0 16px", background: "#FDF8F5", border: "1.5px solid rgba(58,40,50,0.08)", borderRadius: 14, fontSize: 16, letterSpacing: 2, textAlign: "center", fontWeight: 600, color: "#3A2832", outline: "none", fontFamily: "monospace" }}
            />
            <button
              onClick={handleJoinCouple}
              disabled={isLoading}
              style={{ width: "100%", height: 52, borderRadius: 100, background: "#C0607A", color: "white", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 18px rgba(192,96,122,0.28)", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? "Đang tham gia..." : "Tham gia ♡"}
            </button>
          </div>
        )}

        {error && (
          <p style={{ fontSize: 13, textAlign: "center", color: "#ef4444", marginTop: 12 }}>{error}</p>
        )}
      </div>

      {success && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(58,40,50,0.4)", backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "white", borderRadius: 24, padding: "32px 40px",
            textAlign: "center", boxShadow: "0 8px 28px rgba(192,96,122,0.2)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>💑</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#C0607A", fontFamily: "var(--font-heading), serif" }}>
              Đã kết nối!
            </div>
            <div style={{ fontSize: 14, color: "#7A5A65" }}>
              Đã kết nối với người yêu ♡
            </div>
            <div style={{ fontSize: 12, color: "#B89BA3" }}>Đang chuyển trang...</div>
          </div>
        </div>
      )}
    </main>
  )
}
