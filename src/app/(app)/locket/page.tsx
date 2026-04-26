import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import LocketFeed from "@/components/locket/LocketFeed"
import UploadButton from "@/components/locket/UploadButton"
import HugButton from "@/components/locket/HugButton"
import type { LocketPhoto } from "@/types"

export default async function LocketPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const { data: photos } = await supabase
    .from("locket_photos")
    .select("*, sender:sender_id(name)")
    .eq("couple_id", couple.id)
    .order("taken_at", { ascending: false })
    .limit(50)

  return (
    <>
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <LocketFeed
          initialPhotos={(photos as LocketPhoto[]) ?? []}
          coupleId={couple.id}
          currentUserId={user.id}
        />
      </main>
      <UploadButton coupleId={couple.id} />
      <HugButton coupleId={couple.id} />
    </>
  )
}
