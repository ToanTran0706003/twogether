import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { photo_url, caption, couple_id } = body

  if (!photo_url || !couple_id) {
    return NextResponse.json({ error: "photo_url and couple_id are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("locket_photos")
    .insert({
      couple_id,
      sender_id: user.id,
      photo_url,
      caption: caption ?? null,
    })
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
  const { photo_id, reaction } = body

  if (!photo_id) {
    return NextResponse.json({ error: "photo_id is required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("locket_photos")
    .update({ reaction: reaction ?? null })
    .eq("id", photo_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
