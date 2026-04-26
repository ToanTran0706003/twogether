import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) {
    return NextResponse.json({ error: "No couple found" }, { status: 404 })
  }

  const body = await req.json()
  const { emoji, color, note, entry_date } = body

  if (!emoji || !color) {
    return NextResponse.json({ error: "Missing emoji or color" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("mood_entries")
    .upsert(
      {
        couple_id: couple.id,
        user_id: user.id,
        emoji,
        color,
        note: note ?? null,
        entry_date: entry_date ?? new Date().toISOString().split("T")[0],
      },
      { onConflict: "user_id,entry_date" }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

export async function PATCH(req: NextRequest) {
  return POST(req)
}
