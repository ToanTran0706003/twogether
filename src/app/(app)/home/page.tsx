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
    .single()

  if (!couple) redirect("/invite")

  const partnerId = couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id

  const today = new Date().toISOString().split("T")[0]

  const [initialMoods, questData, letterData, memoryData, todayPhotoData] = await Promise.all([
    supabase
      .from("mood_entries")
      .select("*")
      .eq("couple_id", couple.id)
      .eq("entry_date", today),
    supabase
      .from("quest_items")
      .select("completed")
      .eq("couple_id", couple.id),
    supabase
      .from("letters")
      .select("id", { count: "exact" })
      .eq("couple_id", couple.id)
      .eq("delivered", false),
    supabase
      .from("memories")
      .select("id", { count: "exact" })
      .eq("couple_id", couple.id),
    supabase
      .from("locket_photos")
      .select("id", { count: "exact" })
      .eq("couple_id", couple.id)
      .gte("taken_at", `${today}T00:00:00`),
  ])

  const completedQuests = questData.data?.filter((q) => q.completed).length ?? 0
  const totalQuests = questData.data?.length ?? 0
  const pendingLetters = letterData.count ?? 0
  const totalMemories = memoryData.count ?? 0
  const todayPhotos = todayPhotoData.count ?? 0

  return (
    <>
      <TopNav />

      <div className="flex-1 space-y-1">
        <div className="pt-4 pb-2">
          <HeroCard anniversary={couple.anniversary} coupleId={couple.id} />
        </div>

        <MoodSync
          coupleId={couple.id}
          userId={user.id}
          partnerId={partnerId}
          initialMoods={initialMoods.data ?? []}
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
