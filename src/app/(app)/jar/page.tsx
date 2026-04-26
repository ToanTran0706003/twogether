import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TopNav from "@/components/shared/TopNav"
import JarClient from "@/components/jar/JarClient"

const PAGE_SIZE = 20

export default async function JarPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) redirect("/invite")

  const { data: initialMemories, count } = await supabase
    .from("memories")
    .select("*", { count: "exact" })
    .eq("couple_id", couple.id)
    .order("memory_date", { ascending: false })
    .range(0, PAGE_SIZE - 1)

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div className="px-4 pt-4">
        <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: "#C0607A" }}>
          Lọ kỷ niệm
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8A6A72" }}>
          Những khoảnh khắc của hai ta được giữ mãi 🫙
        </p>
      </div>

      <JarClient
        initialMemories={initialMemories ?? []}
        totalCount={count ?? 0}
        coupleId={couple.id}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
