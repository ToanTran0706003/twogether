import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import MoodClient from "@/components/mood/MoodClient"

async function getMoodData(coupleId: string, userId: string) {
  const supabase = await createClient()

  const today = new Date()
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dates.push(d.toISOString().split("T")[0])
  }

  const { data: entries } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("couple_id", coupleId)
    .in("entry_date", dates)
    .order("entry_date", { ascending: false })

  const { data: couple } = await supabase
    .from("couples")
    .select("user_a_id, user_b_id")
    .eq("id", coupleId)
    .single()

  const partnerId = couple?.user_a_id === userId ? couple?.user_b_id : couple?.user_a_id

  const [myProfile, partnerProfile] = await Promise.all([
    supabase.from("users").select("id, name, avatar_url").eq("id", userId).single(),
    partnerId
      ? supabase.from("users").select("id, name, avatar_url").eq("id", partnerId).single()
      : Promise.resolve({ data: null }),
  ])

  return {
    entries: entries ?? [],
    dates,
    myProfile: myProfile.data,
    partnerProfile: partnerProfile.data,
  }
}

export default async function MoodPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const moodData = await getMoodData(couple.id, user.id)

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div className="px-4 pt-4">
        <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: "#C0607A" }}>
          Moodboard
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8A6A72" }}>
          Cập nhật cảm xúc mỗi ngày để thấy nhịp đập của hai ta ♡
        </p>
      </div>

      <MoodClient
        entries={moodData.entries}
        dates={moodData.dates}
        userId={user.id}
        coupleId={couple.id}
        partnerId={moodData.partnerProfile?.id ?? null}
        myName={moodData.myProfile?.name ?? "Mình"}
        partnerName={moodData.partnerProfile?.name ?? "Người ấy"}
        myAvatar={moodData.myProfile?.avatar_url}
        partnerAvatar={moodData.partnerProfile?.avatar_url}
      />
    </div>
  )
}
