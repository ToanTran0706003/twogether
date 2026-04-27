import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import { signOut } from "@/app/(auth)/login/actions"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  const daysCount = couple?.anniversary
    ? Math.floor((new Date().getTime() - new Date(couple.anniversary).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80, backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div style={{ padding: "0 16px 24px" }}>
        <div className="card-dark" style={{ padding: 22, marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,160,176,0.15)" }}/>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #C9DDD2, #A8C5B5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading), serif", fontStyle: "italic", fontSize: 27, fontWeight: 600, boxShadow: "0 0 0 2.5px white, 0 0 0 4.5px #A8C5B5" }}>M</div>
            <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9.5C1.5 7 5 3 8.5 4c1.7.5 2.7 1.6 3.5 3 .8-1.4 1.8-2.5 3.5-3C19 3 22.5 7 21 11.5c-2 5-9 9.5-9 9.5z" fill="#E8A0B0"/></svg>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #F4C8D0, #E8A0B0)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading), serif", fontStyle: "italic", fontSize: 27, fontWeight: 600, boxShadow: "0 0 0 2.5px white, 0 0 0 4.5px #E8A0B0" }}>L</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: "white", fontFamily: "var(--font-heading), serif" }}>
              {profile?.name ?? user.email}
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              {daysCount !== null ? `Bên nhau ${daysCount} ngày` : "Thêm ngày kỷ niệm"}
              {couple?.anniversary ? ` · từ ${new Date(couple.anniversary).toLocaleDateString("vi-VN")}` : ""}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B89BA3", textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 4px 8px" }}>Tài khoản</div>
          <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 2px rgba(192,96,122,0.04), 0 2px 8px rgba(192,96,122,0.05)" }}>
            <div style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #F4C8D0, #E8A0B0)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading), serif", fontStyle: "italic", fontSize: 18, fontWeight: 600 }}>
                {(profile?.name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "#3A2832" }}>{profile?.name ?? "Chưa đặt tên"}</div>
                <div style={{ fontSize: 12, color: "#7A5A65" }}>{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B89BA3", textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 4px 8px" }}>Thông báo</div>
          <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 2px rgba(192,96,122,0.04), 0 2px 8px rgba(192,96,122,0.05)" }}>
            {[
              { label: "Locket mới", sub: "Khi người yêu gửi ảnh", on: true },
              { label: "Thư đã đến", sub: "Khi thư hẹn được mở", on: true },
              { label: "Nhắc kỷ niệm", sub: "Thông báo trước 7 ngày", on: false },
            ].map((t, i, a) => (
              <div key={i} style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, borderBottom: i === a.length - 1 ? "none" : "1px solid rgba(58,40,50,0.08)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#3A2832" }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: "#7A5A65", marginTop: 1 }}>{t.sub}</div>
                </div>
                <div style={{ width: 44, height: 26, borderRadius: 100, background: t.on ? "#C0607A" : "#E5DCD5", position: "relative" }}>
                  <div style={{ position: "absolute", top: 2, left: t.on ? 20 : 2, width: 22, height: 22, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form action={signOut}>
          <button type="submit" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", height: 52, borderRadius: 100,
            background: "white", color: "#C0607A",
            border: "1.5px solid #F4C8D0",
            fontWeight: 600, fontSize: 15, cursor: "pointer",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#C0607A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Đăng xuất
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: 11, color: "#B89BA3", marginTop: 20 }}>
          TwoGether v1.0 · Made with <span style={{ color: "#E8A0B0" }}>♡</span>
        </div>
      </div>
    </div>
  )
}
