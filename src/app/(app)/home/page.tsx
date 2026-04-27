import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import HeroCard from "@/components/home/HeroCard"
import MoodSync from "@/components/home/MoodSync"
import ModuleGrid from "@/components/home/ModuleGrid"
import MemoryJarPreview from "@/components/home/MemoryJarPreview"
import StreakBar from "@/components/home/StreakBar"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { Suspense } from "react"

async function HomeContent() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  const partnerId = couple
    ? (couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id)
    : null
  const hasPartner = couple?.user_b_id != null

  const today = new Date().toISOString().split("T")[0]

  const [initialMoods, questData, letterData, memoryData, todayPhotoData] = couple
    ? await Promise.all([
        supabase.from("mood_entries").select("*").eq("couple_id", couple.id).eq("entry_date", today),
        supabase.from("quest_items").select("completed").eq("couple_id", couple.id),
        supabase.from("letters").select("id", { count: "exact" }).eq("couple_id", couple.id).eq("delivered", false),
        supabase.from("memories").select("id", { count: "exact" }).eq("couple_id", couple.id),
        supabase.from("locket_photos").select("id", { count: "exact" }).eq("couple_id", couple.id).gte("taken_at", `${today}T00:00:00`),
      ])
    : [{ data: [] }, { data: [] }, { count: 0 }, { count: 0 }, { count: 0 }]

  const completedQuests = (questData as { data?: { completed: boolean }[] }).data?.filter((q) => q.completed).length ?? 0
  const totalQuests = (questData as { data?: unknown[] }).data?.length ?? 0
  const pendingLetters = (letterData as { count?: number | null }).count ?? 0
  const totalMemories = (memoryData as { count?: number | null }).count ?? 0
  const todayPhotos = (todayPhotoData as { count?: number | null }).count ?? 0

  return (
    <>
      <TopNav />

      <div className="flex-1 space-y-1">
        {!couple && (
          <div style={{ margin: "12px 16px 0", padding: "12px 16px", borderRadius: 16, backgroundColor: "#FBEAF0", border: "1px solid #F4C0D1", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💕</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#C0607A" }}>Chưa kết nối với người yêu</div>
              <div style={{ fontSize: 11, color: "#7A5A65" }}>Vào Cài đặt để kết nối ngay</div>
            </div>
            <a href="/settings" style={{ marginLeft: "auto", fontSize: 12, color: "#C0607A", fontWeight: 500, textDecoration: "none" }}>Vào Settings →</a>
          </div>
        )}

        {couple && !hasPartner && (
          <div style={{ margin: "12px 16px 0", padding: "12px 16px", borderRadius: 16, backgroundColor: "#FFF0C0", border: "1px solid #F2DDC2", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3A2832" }}>Chờ người yêu kết nối...</div>
              <div style={{ fontSize: 11.5, color: "#7A5A65", marginTop: 1 }}>Mã mời: <span style={{ fontWeight: 700, letterSpacing: 2, fontFamily: "monospace" }}>{couple.invite_code}</span></div>
            </div>
          </div>
        )}

        {couple && (
          <>
            <div className="pt-4 pb-2">
              <HeroCard anniversary={couple.anniversary} coupleId={couple.id} />
            </div>

            <MoodSync
              coupleId={couple.id}
              userId={user.id}
              partnerId={partnerId}
              initialMoods={(initialMoods as { data?: import("@/types").MoodEntry[] }).data ?? []}
            />

            <div className="border-t border-b py-1" style={{ borderColor: "#F0E4DF" }}>
              <StreakBar coupleId={couple.id} />
            </div>

            <ModuleGrid
              photoCount={todayPhotos}
              questCompleted={completedQuests}
              questTotal={totalQuests}
              letterCount={pendingLetters}
              memoryCount={totalMemories}
            />

            <div className="border-t" style={{ borderColor: "#F0E4DF" }}>
              <MemoryJarPreview coupleId={couple.id} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}
