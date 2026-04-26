import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function TopNav() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: couple } = await supabase
    .from("couples")
    .select("user_a_id, user_b_id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) return null

  const partnerId = couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id

  const [myProfile, partnerProfile] = await Promise.all([
    supabase.from("users").select("avatar_url").eq("id", user.id).single(),
    partnerId
      ? supabase.from("users").select("avatar_url").eq("id", partnerId).single()
      : Promise.resolve({ data: null }),
  ])

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b"
      style={{ backgroundColor: "#FDF8F5", borderColor: "#F0E4DF" }}
    >
      <Link href="/home" className="font-serif text-xl font-bold" style={{ color: "#C0607A" }}>
        TwoGether ♡
      </Link>

      <div className="flex -space-x-2">
        {myProfile.data?.avatar_url && (
          <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative flex-shrink-0">
            <Image
              src={myProfile.data.avatar_url}
              alt="Me"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        {partnerProfile.data?.avatar_url && (
          <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative flex-shrink-0">
            <Image
              src={partnerProfile.data.avatar_url}
              alt="Partner"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>
    </header>
  )
}
