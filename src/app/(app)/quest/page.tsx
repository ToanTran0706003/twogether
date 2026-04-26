import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import QuestClient from "@/components/quest/QuestClient"

export default async function QuestPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const { data: quests } = await supabase
    .from("quest_items")
    .select("*")
    .eq("couple_id", couple.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <TopNav />
      <main className="flex-1 overflow-y-auto pb-8">
        <QuestClient
          initialQuests={quests ?? []}
          coupleId={couple.id}
        />
      </main>
    </>
  )
}
