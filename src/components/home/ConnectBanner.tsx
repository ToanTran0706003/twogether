"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface CoupleRow {
  id: string
  user_a_id: string
  user_b_id: string | null
  invite_code: string
}

export function ConnectBanner({ userId }: { userId: string }) {
  const [couple, setCouple] = useState<CoupleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSheet, setShowSheet] = useState(false)
  const [tab, setTab] = useState<"create" | "join">("create")
  const [myCode, setMyCode] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [error, setError] = useState("")
  const [working, setWorking] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    void fetchCouple()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realtime: creator sees partner join in real-time
  useEffect(() => {
    if (!couple?.id) return

    const channel = supabase
      .channel(`couple-connect-${couple.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "couples", filter: `id=eq.${couple.id}` },
        (payload) => {
          const updated = payload.new as CoupleRow
          if (updated.user_b_id) {
            setCouple(updated)
            setCelebrated(true)
            setTimeout(() => {
              window.location.href = "/home"
            }, 2500)
          }
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couple?.id])

  const fetchCouple = async () => {
    const { data } = await supabase
      .from("couples")
      .select("*")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .maybeSingle()
    setCouple(data as CoupleRow | null)
    if ((data as CoupleRow | null)?.invite_code) setMyCode((data as CoupleRow).invite_code)
    setLoading(false)
  }

  const createCouple = async () => {
    setWorking(true)
    const res = await fetch("/api/couple", { method: "POST" })
    const data = await res.json() as { couple?: CoupleRow }
    if (data.couple) {
      setMyCode(data.couple.invite_code)
      setCouple(data.couple)
    }
    setWorking(false)
  }

  const joinCouple = async () => {
    if (!inputCode.trim()) return
    setWorking(true)
    setError("")
    const res = await fetch("/api/couple", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_code: inputCode.trim() }),
    })
    const data = await res.json() as { error?: string; couple?: CoupleRow }
    if (!res.ok) {
      setError(data.error ?? "Có lỗi xảy ra")
      setWorking(false)
      return
    }
    // Success: close sheet, update couple, show celebration
    setShowSheet(false)
    setCouple(data.couple ?? null)
    setCelebrated(true)
    setWorking(false)
    setTimeout(() => {
      router.refresh()
      window.location.href = "/home"
    }, 2500)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(myCode)
  }

  if (loading) return null

  // Celebration overlay renders even after user_b_id is set
  if (couple?.user_b_id && !celebrated) return null

  return (
    <>
      {/* Celebration overlay */}
      {celebrated && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ background: "white", borderRadius: 24, padding: "32px 40px", textAlign: "center", maxWidth: 300, margin: "0 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#C0607A", fontFamily: "Georgia,serif", marginBottom: 8 }}>Đã kết nối! ♡</div>
            <div style={{ fontSize: 13, color: "#7A5A65" }}>Chào mừng hai bạn đến với TwoGether</div>
          </div>
        </div>
      )}

      {/* Banner — hidden during/after celebration */}
      {!celebrated && (
        <div style={{ margin: "0 16px 12px", background: "linear-gradient(135deg,#FBEAF0,#F7F0FB)", border: "1px solid #F4C0D1", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>💕</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#C0607A" }}>Kết nối với người yêu</div>
              <div style={{ fontSize: 11, color: "#7A5A65", marginTop: 2 }}>Chia sẻ mã mời để bắt đầu hành trình cùng nhau ♡</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setTab("create"); setShowSheet(true); if (!myCode) void createCouple() }}
              style={{ flex: 1, background: "#C0607A", color: "white", border: "none", borderRadius: 10, padding: "9px 0", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
            >
              Tạo mã mời
            </button>
            <button
              onClick={() => { setTab("join"); setShowSheet(true) }}
              style={{ flex: 1, background: "white", color: "#C0607A", border: "1px solid #F4C0D1", borderRadius: 10, padding: "9px 0", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
            >
              Nhập mã
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      {showSheet && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setShowSheet(false)} />
          <div style={{ position: "relative", background: "white", borderRadius: "20px 20px 0 0", padding: 24, paddingBottom: "calc(24px + env(safe-area-inset-bottom))", maxHeight: "85dvh", overflowY: "auto", zIndex: 1 }}>
            <div style={{ width: 40, height: 4, background: "#E0E0E0", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 16, fontWeight: 500, color: "#3A2832", fontFamily: "Georgia,serif", marginBottom: 16, textAlign: "center" }}>
              Kết nối người yêu ♡
            </div>

            <div style={{ display: "flex", background: "#F7F7F5", borderRadius: 10, padding: 3, marginBottom: 20 }}>
              {(["create", "join"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 12, fontWeight: 500, background: tab === t ? "white" : "transparent", color: tab === t ? "#C0607A" : "#7A5A65", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {t === "create" ? "Tạo mã mời" : "Nhập mã mời"}
                </button>
              ))}
            </div>

            {tab === "create" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#7A5A65", marginBottom: 12 }}>Gửi mã này cho người yêu</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 6, color: "#C0607A", background: "#FBEAF0", borderRadius: 12, padding: "16px 24px", marginBottom: 16, fontFamily: "monospace" }}>
                  {working ? "..." : myCode || "..."}
                </div>
                <button onClick={() => void copyCode()}
                  style={{ width: "100%", background: "#C0607A", color: "white", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  Copy mã mời
                </button>
              </div>
            ) : (
              <div>
                <input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã 8 ký tự..."
                  maxLength={8}
                  style={{ width: "100%", padding: "13px 16px", border: "1px solid #F4C0D1", borderRadius: 12, fontSize: 16, fontWeight: 600, letterSpacing: 4, textAlign: "center", outline: "none", fontFamily: "monospace", color: "#C0607A", background: "#FBEAF0", marginBottom: 8, boxSizing: "border-box" }}
                />
                {error && (
                  <div style={{ color: "#A32D2D", fontSize: 12, textAlign: "center", marginBottom: 8 }}>{error}</div>
                )}
                <button
                  onClick={() => void joinCouple()}
                  disabled={working || inputCode.length < 6}
                  style={{ width: "100%", background: inputCode.length >= 6 ? "#C0607A" : "#ccc", color: "white", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 500, cursor: inputCode.length >= 6 ? "pointer" : "not-allowed" }}>
                  {working ? "Đang kết nối..." : "Tham gia ♡"}
                </button>
              </div>
            )}
            <div style={{ height: 24 }} />
          </div>
        </div>
      )}
    </>
  )
}
