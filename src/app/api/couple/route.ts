import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase()
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
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // If user already has a couple, return it instead of erroring
  const { data: existing } = await supabase
    .from("couples")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(existing)
  }

  const { data, error } = await supabase
    .from("couples")
    .insert({
      user_a_id: user.id,
      invite_code: generateInviteCode(),
    })
    .select()
    .single()

  if (error) {
    console.error("[POST /api/couple] Insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from("quest_items").insert(
    PRESET_QUESTS.map((q) => ({
      couple_id: data.id,
      created_by: user.id,
      title: q.title,
      category: q.category,
    }))
  )

  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Block only if already in a fully connected couple
  const { data: existing } = await supabase
    .from("couples")
    .select("id, user_b_id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  if (existing && existing.user_b_id !== null) {
    return NextResponse.json({ error: "Already in a couple" }, { status: 400 })
  }

  const body = await request.json()
  const inviteCode = body.invite_code?.trim().toUpperCase()

  if (!inviteCode) {
    return NextResponse.json({ error: "Thiếu mã mời" }, { status: 400 })
  }

  console.log("[PATCH /api/couple] Searching for invite_code:", inviteCode)

  const { data: couple, error: findError } = await supabase
    .from("couples")
    .select("*")
    .ilike("invite_code", inviteCode)
    .is("user_b_id", null)
    .neq("user_a_id", user.id)
    .maybeSingle()

  console.log("[PATCH /api/couple] Found:", couple, "Error:", findError)

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 })
  }

  if (!couple) {
    return NextResponse.json({ error: "Mã không hợp lệ hoặc đã được sử dụng" }, { status: 400 })
  }

  const { data: updated, error: updateError } = await supabase
    .from("couples")
    .update({ user_b_id: user.id })
    .eq("id", couple.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, couple: updated })
}
