import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import DearClient from "@/components/dear/DearClient"

export default async function DearPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const [myLettersData, receivedLettersData] = await Promise.all([
    supabase
      .from("letters")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("letters")
      .select("*")
      .eq("couple_id", couple.id)
      .eq("delivered", true)
      .neq("sender_id", user.id)
      .order("send_at", { ascending: false }),
  ])

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div className="px-4 pt-4">
        <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: "#C0607A" }}>
          Dear You
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8A6A72" }}>
          Những lá thư tình được gửi đúng lúc ♡
        </p>
      </div>

      <DearClient
        myLetters={myLettersData.data ?? []}
        receivedLetters={receivedLettersData.data ?? []}
        coupleId={couple.id}
      />
    </div>
  )
}
