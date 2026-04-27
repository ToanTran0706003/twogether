import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase()
}

function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PRESET_QUESTS = [
  { title: "Xem phim không bỏ dở", category: "home" },
  { title: "Cùng nấu bữa tối", category: "food" },
  { title: "Đi cà phê sáng sớm", category: "food" },
  { title: "Viết thư tay cho nhau", category: "creative" },
  { title: "Đi xem hoàng hôn", category: "adventure" },
  { title: "Học nấu món mới cùng nhau", category: "food" },
  { title: "Chụp ảnh 4 mùa cùng nhau", category: "creative" },
  { title: "Đi du lịch lần đầu tiên", category: "travel" },
  { title: "Cùng trồng một cây xanh", category: "home" },
  { title: "Đọc cùng một cuốn sách", category: "home" },
]

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const service = getService()
  const { data, error } = await service
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const service = getService()

    await service.from("users").upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    }, { onConflict: "id" })

    const { data: existing } = await service
      .from("couples")
      .select("*")
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .maybeSingle()

    if (existing) return NextResponse.json({ couple: existing })

    const { data: couple, error } = await service
      .from("couples")
      .insert({ user_a_id: user.id, invite_code: generateInviteCode() })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await service.from("quest_items").insert(
      PRESET_QUESTS.map((q) => ({
        couple_id: couple.id,
        created_by: user.id,
        title: q.title,
        category: q.category,
      }))
    )

    return NextResponse.json({ couple }, { status: 201 })
  } catch (err) {
    console.error("[CREATE COUPLE]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const inviteCode = body.invite_code?.toString().trim().toUpperCase()

    if (!inviteCode) return NextResponse.json({ error: "Thiếu mã mời" }, { status: 400 })

    const service = getService()

    await service.from("users").upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    }, { onConflict: "id" })

    const { data: couple, error: findError } = await service
      .from("couples")
      .select("*")
      .eq("invite_code", inviteCode)
      .is("user_b_id", null)
      .maybeSingle()

    if (findError || !couple) {
      return NextResponse.json({ error: "Mã không hợp lệ hoặc đã được sử dụng" }, { status: 400 })
    }

    if (couple.user_a_id === user.id) {
      return NextResponse.json({ error: "Không thể dùng mã của chính mình" }, { status: 400 })
    }

    const { data: updated, error: updateError } = await service
      .from("couples")
      .update({ user_b_id: user.id })
      .eq("id", couple.id)
      .select()
      .single()

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    return NextResponse.json({ success: true, couple: updated })
  } catch (err) {
    console.error("[JOIN COUPLE]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
