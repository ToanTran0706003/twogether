import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import SettingsClient from "@/components/settings/SettingsClient"

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

  const partnerId =
    couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id

  let partnerProfile = null
  if (partnerId) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", partnerId)
      .single()
    partnerProfile = data
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80, backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ padding: "16px 4px 20px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#3A2832" }}>Cài đặt</div>
          <div style={{ fontSize: 13, color: "#8A6A72", marginTop: 4 }}>Quản lý tài khoản và couple của bạn</div>
        </div>

        <SettingsClient
          userId={user.id}
          coupleId={couple.id}
          coupleUserAId={couple.user_a_id}
          anniversary={couple.anniversary ?? null}
          myName={profile?.name ?? user.email ?? ""}
          myEmail={user.email ?? ""}
          myAvatar={profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null}
          partnerName={partnerProfile?.name ?? "Người ấy"}
          partnerAvatar={partnerProfile?.avatar_url ?? null}
        />
      </div>
    </div>
  )
}
