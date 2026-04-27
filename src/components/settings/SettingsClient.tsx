"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  userId: string
  coupleId: string | null
  coupleUserAId: string | null
  inviteCode: string | null
  anniversary: string | null
  myName: string
  myEmail: string
  myAvatar: string | null
  partnerName: string
  partnerAvatar: string | null
  hasCouple: boolean
  hasPartner: boolean
}

interface Event {
  id: string
  name: string
  date: string
}

const COLORS = {
  primary: "#C0607A",
  accent: "#E8A0B0",
  bg: "#FDF8F5",
  muted: "#8A6A72",
  text: "#3A2832",
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: 20,
  boxShadow: "0 1px 2px rgba(192,96,122,0.04), 0 2px 8px rgba(192,96,122,0.05)",
  overflow: "hidden",
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#B89BA3",
  textTransform: "uppercase",
  letterSpacing: 1.5,
  padding: "4px 4px 8px",
}

const rowStyle: React.CSSProperties = {
  padding: 14,
  display: "flex",
  alignItems: "center",
  gap: 12,
}

function AvatarCircle({
  src,
  name,
  size = 42,
  gradient = "linear-gradient(135deg, #F4C8D0, #E8A0B0)",
}: {
  src: string | null
  name: string
  size?: number
  gradient?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontStyle: "italic",
        fontSize: size * 0.42,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {(name || "U")[0].toUpperCase()}
    </div>
  )
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export default function SettingsClient({
  userId,
  coupleId,
  coupleUserAId,
  inviteCode: initialInviteCode,
  anniversary,
  myName,
  myEmail,
  myAvatar,
  partnerName,
  partnerAvatar,
  hasCouple: initialHasCouple,
  hasPartner,
}: Props) {
  const [hasCouple, setHasCouple] = useState(initialHasCouple)
  const [inviteCode, setInviteCode] = useState(initialInviteCode)
  const [activeCoupleId, setActiveCoupleId] = useState(coupleId)

  // Connect section state
  const [connectTab, setConnectTab] = useState<"create" | "join">("create")
  const [joinCode, setJoinCode] = useState("")
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [connectSuccess, setConnectSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [creatingCouple, setCreatingCouple] = useState(false)

  // Anniversary state
  const [anniversaryVal, setAnniversaryVal] = useState<string | null>(anniversary)
  const [editingAnniversary, setEditingAnniversary] = useState(false)
  const [anniversaryInput, setAnniversaryInput] = useState(
    anniversary ? anniversary.slice(0, 10) : ""
  )
  const [anniversarySaving, setAnniversarySaving] = useState(false)

  // Profile state
  const [displayName, setDisplayName] = useState(myName)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(myName)
  const [nameSaving, setNameSaving] = useState(false)

  // Events state
  const [events, setEvents] = useState<Event[]>([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEventName, setNewEventName] = useState("")
  const [newEventDate, setNewEventDate] = useState("")

  // Notification state
  const [notifOn, setNotifOn] = useState(false)
  const [notifSupported, setNotifSupported] = useState(true)

  // Danger zone state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`twogether_events_${activeCoupleId}`)
      if (raw) setEvents(JSON.parse(raw) as Event[])
    } catch { /* ignore */ }
  }, [activeCoupleId])

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifSupported(false)
    }
    try {
      const raw = localStorage.getItem(`twogether_notif_${userId}`)
      if (raw !== null) setNotifOn(raw === "true")
    } catch { /* ignore */ }
  }, [userId])

  // Auto-create couple when switching to "create" tab if not yet created
  useEffect(() => {
    if (connectTab === "create" && !hasCouple && !inviteCode && !creatingCouple) {
      void handleCreateCouple()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectTab])

  const daysTogetherCount = anniversaryVal
    ? Math.floor((Date.now() - new Date(anniversaryVal).getTime()) / 86400000)
    : null

  async function handleCreateCouple() {
    setCreatingCouple(true)
    setConnectError(null)
    try {
      const res = await fetch("/api/couple", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInviteCode(data.invite_code)
      setActiveCoupleId(data.id)
      setHasCouple(true)
    } catch (e) {
      setConnectError((e as Error).message)
    } finally {
      setCreatingCouple(false)
    }
  }

  async function handleJoinCouple() {
    if (!joinCode.trim()) { setConnectError("Vui lòng nhập mã mời"); return }
    setConnectLoading(true)
    setConnectError(null)
    try {
      const res = await fetch("/api/couple", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: joinCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setConnectSuccess(true)
      setTimeout(() => { window.location.reload() }, 1500)
    } catch (e) {
      setConnectError((e as Error).message)
    } finally {
      setConnectLoading(false)
    }
  }

  async function handleCopyCode() {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSaveAnniversary() {
    if (!anniversaryInput || !activeCoupleId) return
    setAnniversarySaving(true)
    try {
      const isoString = new Date(anniversaryInput).toISOString()
      const res = await fetch(`/api/couple/${activeCoupleId}/anniversary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anniversary: isoString }),
      })
      if (res.ok) {
        setAnniversaryVal(isoString)
        setEditingAnniversary(false)
      }
    } finally {
      setAnniversarySaving(false)
    }
  }

  async function handleSaveName() {
    if (!nameInput.trim()) return
    setNameSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: nameInput.trim() })
        .eq("id", userId)
      if (!error) {
        setDisplayName(nameInput.trim())
        setEditingName(false)
      }
    } finally {
      setNameSaving(false)
    }
  }

  function saveEvents(updated: Event[]) {
    localStorage.setItem(`twogether_events_${activeCoupleId}`, JSON.stringify(updated))
    setEvents(updated)
  }

  function handleAddEvent() {
    if (!newEventName.trim() || !newEventDate) return
    const newEvent: Event = { id: Date.now().toString(), name: newEventName.trim(), date: newEventDate }
    saveEvents([...events, newEvent])
    setNewEventName("")
    setNewEventDate("")
    setShowAddEvent(false)
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const upcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  async function handleNotifToggle() {
    const next = !notifOn
    if (next) {
      const { setupPushSubscription } = await import("@/lib/push-client")
      await setupPushSubscription(userId)
    } else {
      const { removePushSubscription } = await import("@/lib/push-client")
      await removePushSubscription()
    }
    localStorage.setItem(`twogether_notif_${userId}`, String(next))
    setNotifOn(next)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  async function handleLeaveCouple() {
    if (!activeCoupleId) return
    if (userId === coupleUserAId) {
      await supabase.from("couples").delete().eq("id", activeCoupleId)
    } else {
      await supabase.from("couples").update({ user_b_id: null }).eq("id", activeCoupleId)
    }
    window.location.href = "/settings"
  }

  return (
    <div style={{ padding: "0 0 24px" }}>

      {/* ── Section 0: Connect section ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabelStyle}>Kết nối người yêu</div>

        {!hasCouple ? (
          <div style={{ ...cardStyle, padding: 20 }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(["create", "join"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setConnectTab(t)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    background: connectTab === t ? COLORS.primary : "#F5EDE8",
                    color: connectTab === t ? "white" : COLORS.muted,
                    transition: "all 0.15s",
                  }}
                >
                  {t === "create" ? "Tạo mã mời" : "Nhập mã mời"}
                </button>
              ))}
            </div>

            {connectTab === "create" ? (
              <div style={{ textAlign: "center" }}>
                {creatingCouple ? (
                  <div style={{ padding: "20px 0", color: COLORS.muted, fontSize: 13 }}>Đang tạo mã...</div>
                ) : inviteCode ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#B89BA3", textTransform: "uppercase", letterSpacing: 1.5 }}>Mã mời của bạn</div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.primary, letterSpacing: 6, fontFamily: "monospace" }}>{inviteCode}</div>
                    <p style={{ fontSize: 12, color: "#B89BA3", margin: 0 }}>Gửi mã này cho người yêu để kết nối</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={handleCopyCode}
                        style={{ flex: 1, height: 40, borderRadius: 100, background: "#F4C8D0", color: COLORS.primary, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                      >
                        {copied ? "Đã copy! ✓" : "Sao chép"}
                      </button>
                      <button
                        onClick={() => navigator.share?.({ text: inviteCode })}
                        style={{ flex: 1, height: 40, borderRadius: 100, background: COLORS.primary, color: "white", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                      >
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateCouple}
                    disabled={creatingCouple}
                    style={{ width: "100%", height: 48, borderRadius: 100, background: COLORS.accent, color: "white", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                  >
                    Tạo couple mới ♡
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã mời..."
                  maxLength={8}
                  style={{ width: "100%", height: 52, padding: "0 16px", background: "#FDF8F5", border: "1.5px solid rgba(58,40,50,0.08)", borderRadius: 14, fontSize: 16, letterSpacing: 2, textAlign: "center", fontWeight: 600, color: "#3A2832", outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
                />
                <button
                  onClick={handleJoinCouple}
                  disabled={connectLoading}
                  style={{ width: "100%", height: 48, borderRadius: 100, background: COLORS.primary, color: "white", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: connectLoading ? 0.7 : 1 }}
                >
                  {connectLoading ? "Đang kết nối..." : "Kết nối ♡"}
                </button>
              </div>
            )}

            {connectError && (
              <p style={{ fontSize: 12, textAlign: "center", color: "#ef4444", marginTop: 10, marginBottom: 0 }}>{connectError}</p>
            )}
          </div>
        ) : hasPartner ? (
          <div style={{ ...cardStyle }}>
            <div style={rowStyle}>
              <AvatarCircle src={partnerAvatar} name={partnerName} size={44} gradient="linear-gradient(135deg, #F4C8D0, #E8A0B0)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.text }}>Đã kết nối với {partnerName} ♡</div>
                {anniversaryVal && (
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                    Bên nhau {daysTogetherCount} ngày
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...cardStyle, padding: "14px 16px" }}>
            <div style={{ fontSize: 13, color: "#3A2832", fontWeight: 500, marginBottom: 6 }}>⏳ Chờ người yêu kết nối...</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>Mã mời của bạn:</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.primary, letterSpacing: 4, fontFamily: "monospace", flex: 1 }}>{inviteCode}</div>
              <button
                onClick={handleCopyCode}
                style={{ padding: "6px 14px", borderRadius: 10, background: "#F4C8D0", color: COLORS.primary, border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
              >
                {copied ? "Đã copy ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 1: Couple card (anniversary) — only when has couple ── */}
      {hasCouple && (
        <div style={{ ...cardStyle, marginBottom: 20, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AvatarCircle src={myAvatar} name={displayName || myEmail} size={60} gradient="linear-gradient(135deg, #C9DDD2, #A8C5B5)" />
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path d="M12 21s-7-4.5-9-9.5C1.5 7 5 3 8.5 4c1.7.5 2.7 1.6 3.5 3 .8-1.4 1.8-2.5 3.5-3C19 3 22.5 7 21 11.5c-2 5-9 9.5-9 9.5z" fill="#E8A0B0" />
            </svg>
            <AvatarCircle src={partnerAvatar} name={partnerName} size={60} gradient="linear-gradient(135deg, #F4C8D0, #E8A0B0)" />
          </div>

          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>
            {daysTogetherCount !== null ? `Bên nhau ${daysTogetherCount} ngày` : "Thêm ngày kỷ niệm"}
          </div>

          <div style={{ width: "100%", borderTop: "1px solid rgba(58,40,50,0.08)", paddingTop: 12 }}>
            {editingAnniversary ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="date"
                  value={anniversaryInput}
                  onChange={(e) => setAnniversaryInput(e.target.value)}
                  style={{ flex: 1, border: "1px solid #E8A0B0", borderRadius: 10, padding: "6px 10px", fontSize: 13, color: COLORS.text, outline: "none" }}
                />
                <button onClick={handleSaveAnniversary} disabled={anniversarySaving} style={{ padding: "6px 14px", borderRadius: 10, background: COLORS.primary, color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Lưu</button>
                <button onClick={() => setEditingAnniversary(false)} style={{ padding: "6px 10px", borderRadius: 10, background: "none", color: COLORS.muted, border: "1px solid #E5DCD5", fontSize: 13, cursor: "pointer" }}>Hủy</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>Ngày kỷ niệm</div>
                  <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>
                    {anniversaryVal ? new Date(anniversaryVal).toLocaleDateString("vi-VN") : "Chưa đặt"}
                  </div>
                </div>
                <button onClick={() => setEditingAnniversary(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: COLORS.muted }} aria-label="Chỉnh sửa ngày kỷ niệm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={COLORS.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={COLORS.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section 2: Profile ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabelStyle}>Tài khoản</div>
        <div style={cardStyle}>
          <div style={rowStyle}>
            <AvatarCircle src={myAvatar} name={displayName || myEmail} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingName ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} style={{ flex: 1, border: "1px solid #E8A0B0", borderRadius: 8, padding: "5px 8px", fontSize: 14, color: COLORS.text, outline: "none" }} autoFocus />
                  <button onClick={handleSaveName} disabled={nameSaving} style={{ padding: "5px 12px", borderRadius: 8, background: COLORS.primary, color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Lưu</button>
                  <button onClick={() => { setEditingName(false); setNameInput(displayName) }} style={{ padding: "5px 8px", borderRadius: 8, background: "none", color: COLORS.muted, border: "1px solid #E5DCD5", fontSize: 13, cursor: "pointer" }}>Hủy</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.text }}>{displayName || "Chưa đặt tên"}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{myEmail}</div>
                </>
              )}
            </div>
            {!editingName && (
              <button onClick={() => { setEditingName(true); setNameInput(displayName) }} style={{ padding: "5px 12px", borderRadius: 8, background: "#FDF0F3", color: COLORS.primary, border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                Đổi tên
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 3: Upcoming events — only when has couple ── */}
      {hasCouple && (
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabelStyle}>Sự kiện sắp tới</div>
          <div style={cardStyle}>
            {upcomingEvents.length === 0 && !showAddEvent && (
              <div style={{ padding: "18px 14px", fontSize: 13, color: COLORS.muted, textAlign: "center" }}>Chưa có sự kiện nào</div>
            )}
            {upcomingEvents.map((ev, i) => (
              <div key={ev.id} style={{ ...rowStyle, borderBottom: i < upcomingEvents.length - 1 || showAddEvent ? "1px solid rgba(58,40,50,0.08)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>{new Date(ev.date).toLocaleDateString("vi-VN")}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, whiteSpace: "nowrap" }}>còn {daysUntil(ev.date)} ngày</div>
              </div>
            ))}
            {showAddEvent ? (
              <div style={{ padding: 14, borderTop: upcomingEvents.length > 0 ? "1px solid rgba(58,40,50,0.08)" : "none" }}>
                <input placeholder="Tên sự kiện" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} style={{ width: "100%", border: "1px solid #E8A0B0", borderRadius: 8, padding: "7px 10px", fontSize: 13, color: COLORS.text, outline: "none", marginBottom: 8, boxSizing: "border-box" }} autoFocus />
                <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} style={{ width: "100%", border: "1px solid #E8A0B0", borderRadius: 8, padding: "7px 10px", fontSize: 13, color: COLORS.text, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleAddEvent} style={{ flex: 1, padding: "8px 0", borderRadius: 10, background: COLORS.primary, color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Lưu</button>
                  <button onClick={() => { setShowAddEvent(false); setNewEventName(""); setNewEventDate("") }} style={{ flex: 1, padding: "8px 0", borderRadius: 10, background: "none", color: COLORS.muted, border: "1px solid #E5DCD5", fontSize: 13, cursor: "pointer" }}>Hủy</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddEvent(true)} style={{ width: "100%", padding: "12px 14px", background: "none", border: "none", borderTop: upcomingEvents.length > 0 ? "1px solid rgba(58,40,50,0.08)" : "none", fontSize: 13.5, fontWeight: 600, color: COLORS.primary, cursor: "pointer", textAlign: "center" }}>
                + Thêm sự kiện
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Section 4: Notifications ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabelStyle}>Thông báo</div>
        <div style={cardStyle}>
          {/* Push notification toggle */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>Thông báo đẩy</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                {!notifSupported
                  ? "Trình duyệt không hỗ trợ"
                  : notifOn
                  ? "Đang bật — nhận thông báo từ người yêu"
                  : "Tắt — bật để không bỏ lỡ gì ♡"}
              </div>
            </div>
            <button
              onClick={notifSupported ? handleNotifToggle : undefined}
              aria-label="Toggle thông báo đẩy"
              style={{
                width: 48, height: 28, borderRadius: 100,
                background: notifOn ? COLORS.primary : "#E5DCD5",
                border: "none", position: "relative",
                cursor: notifSupported ? "pointer" : "not-allowed",
                transition: "background 0.25s", flexShrink: 0, padding: 0,
                opacity: notifSupported ? 1 : 0.5,
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: notifOn ? 23 : 3,
                width: 22, height: 22, borderRadius: "50%",
                background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                transition: "left 0.25s",
              }} />
            </button>
          </div>
          {/* Mood reminder toggle */}
          <div style={{ ...rowStyle, borderTop: "0.5px solid #F7D6DF" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>Nhắc check-in mood</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Nhắc lúc 21:00 nếu chưa cập nhật</div>
            </div>
            <button
              aria-label="Toggle nhắc mood"
              style={{
                width: 48, height: 28, borderRadius: 100,
                background: "#E5DCD5",
                border: "none", position: "relative",
                cursor: "not-allowed",
                transition: "background 0.25s", flexShrink: 0, padding: 0,
                opacity: 0.4,
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: 3,
                width: 22, height: 22, borderRadius: "50%",
                background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 5: Sign out ── */}
      <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", height: 52, borderRadius: 100, background: "white", color: COLORS.primary, border: "1.5px solid #F4C8D0", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={COLORS.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Đăng xuất
      </button>

      {/* ── Section 6: Danger zone — only when has couple ── */}
      {hasCouple && (
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabelStyle}>Danger Zone</div>
          <div style={cardStyle}>
            <div style={rowStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "#C0607A" }}>Rời khỏi couple</div>
              </div>
              <button onClick={() => setShowLeaveConfirm(true)} style={{ padding: "7px 14px", borderRadius: 10, background: "none", color: "#C0607A", border: "1.5px solid #C0607A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Rời khỏi</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: "#B89BA3", marginTop: 4 }}>
        TwoGether v1.0 · Made with <span style={{ color: "#E8A0B0" }}>♡</span>
      </div>

      {/* Leave couple confirm */}
      {showLeaveConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "0 24px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 24, maxWidth: 320, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 8, textAlign: "center" }}>Rời khỏi couple?</div>
            <div style={{ fontSize: 13.5, color: COLORS.muted, textAlign: "center", marginBottom: 20 }}>Bạn có chắc muốn rời khỏi couple?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLeaveConfirm(false)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, background: "none", color: COLORS.muted, border: "1px solid #E5DCD5", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Hủy</button>
              <button onClick={handleLeaveCouple} style={{ flex: 1, padding: "11px 0", borderRadius: 12, background: "#C0607A", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Rời khỏi</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect success overlay */}
      {connectSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(58,40,50,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "32px 40px", textAlign: "center", boxShadow: "0 8px 28px rgba(192,96,122,0.2)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 48 }}>💑</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#C0607A" }}>Đã kết nối!</div>
            <div style={{ fontSize: 14, color: "#7A5A65" }}>Đã kết nối với người yêu ♡</div>
            <div style={{ fontSize: 12, color: "#B89BA3" }}>Đang tải lại...</div>
          </div>
        </div>
      )}
    </div>
  )
}
