import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import HeroCard from "@/components/home/HeroCard"
import MoodSync from "@/components/home/MoodSync"
import ModuleGrid from "@/components/home/ModuleGrid"
import MemoryJarPreview from "@/components/home/MemoryJarPreview"
import { StreakBar } from "@/components/home/StreakBar"
import HomeSkeleton from "@/components/home/HomeSkeleton"
import { ConnectBanner } from "@/components/home/ConnectBanner"
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

  const today = new Date().toISOString().split("T")[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]

  const [questData, letterData, memoryData, todayPhotoData, moodData] = couple
    ? await Promise.all([
        supabase.from("quest_items").select("completed").eq("couple_id", couple.id),
        supabase.from("letters").select("id", { count: "exact" }).eq("couple_id", couple.id).eq("delivered", false),
        supabase.from("memories").select("id", { count: "exact" }).eq("couple_id", couple.id),
        supabase.from("locket_photos").select("id", { count: "exact" }).eq("couple_id", couple.id).gte("taken_at", `${today}T00:00:00`),
        supabase.from("mood_entries").select("entry_date, user_id").eq("couple_id", couple.id).gte("entry_date", sevenDaysAgo),
      ])
    : [{ data: [] }, { count: 0 }, { count: 0 }, { count: 0 }, { data: [] }]

  const completedQuests = (questData as { data?: { completed: boolean }[] }).data?.filter((q) => q.completed).length ?? 0
  const totalQuests = (questData as { data?: unknown[] }).data?.length ?? 0
  const pendingLetters = (letterData as { count?: number | null }).count ?? 0
  const totalMemories = (memoryData as { count?: number | null }).count ?? 0
  const todayPhotos = (todayPhotoData as { count?: number | null }).count ?? 0
  const moodEntries = (moodData as { data?: { entry_date: string; user_id: string }[] }).data ?? []

  const streakCount = (() => {
    let count = 0
    const d = new Date()
    while (true) {
      const dateStr = d.toISOString().split("T")[0]
      const hasEntry = moodEntries.some(e => e.user_id === user.id && e.entry_date === dateStr)
      if (!hasEntry) break
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })()

  return (
    <>
      <TopNav />

      <div className="flex-1 space-y-1 stagger-children">
        {/* ConnectBanner handles its own state — shows only when no partner */}
        <ConnectBanner userId={user.id} />

        {couple && (
          <>
            <div className="pt-4 pb-2">
              <HeroCard anniversary={couple.anniversary} coupleId={couple.id} />
            </div>

            <MoodSync
              coupleId={couple.id}
              userId={user.id}
            />

            <div className="border-t border-b py-1" style={{ borderColor: "#F0E4DF" }}>
              <StreakBar
                streakCount={streakCount}
                entries={moodEntries}
                currentUserId={user.id}
              />
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
