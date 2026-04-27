import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { title, category, couple_id } = body

  if (!title || !couple_id) {
    return NextResponse.json({ error: "title and couple_id are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("quest_items")
    .insert({ couple_id, created_by: user.id, title, category: category ?? null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { quest_id, completed, photo_url } = body

  if (!quest_id) {
    return NextResponse.json({ error: "quest_id is required" }, { status: 400 })
  }

  const updates: Record<string, unknown> = { completed }
  if (completed) {
    updates.completed_at = new Date().toISOString()
    if (photo_url) updates.photo_url = photo_url
  }

  const { data, error } = await supabase
    .from("quest_items")
    .update(updates)
    .eq("id", quest_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-insert into memories when quest is completed
  if (completed && data) {
    await supabase.from("memories").insert({
      couple_id: data.couple_id,
      user_id: user.id,
      type: "quest",
      title: data.title,
      content: null,
      media_url: photo_url ?? null,
      memory_date: new Date().toISOString().split("T")[0],
      source: "quest",
      source_id: quest_id,
    })
  }

  return NextResponse.json(data)
}
