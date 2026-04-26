import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) return NextResponse.json({ error: "No couple found" }, { status: 404 })

  const body = await request.json()
  const { title, content, send_at, couple_id } = body

  if (!content || !send_at) {
    return NextResponse.json({ error: "content and send_at are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("letters")
    .insert({
      couple_id: couple_id ?? couple.id,
      sender_id: user.id,
      title: title ?? null,
      content,
      send_at,
      delivered: false,
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
  const { letter_id } = body

  if (!letter_id) {
    return NextResponse.json({ error: "letter_id is required" }, { status: 400 })
  }

  const { data: letter, error: fetchError } = await supabase
    .from("letters")
    .select("couple_id, sender_id")
    .eq("id", letter_id)
    .single()

  if (fetchError || !letter) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 })
  }

  const isParticipant = letter.sender_id === user.id ||
    (await checkPartner(supabase, user.id, letter.couple_id))

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: updatedLetter, error } = await supabase
    .from("letters")
    .update({ delivered: true })
    .eq("id", letter_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { error: memoryError } = await supabase.from("memories").insert({
    couple_id: letter.couple_id,
    user_id: letter.sender_id,
    type: "letter",
    title: updatedLetter.title ?? "Thư tình",
    content: updatedLetter.content,
    memory_date: updatedLetter.send_at,
    source: "letter",
  })

  if (memoryError) {
    console.error("Failed to create memory from letter:", memoryError)
  }

  return NextResponse.json(updatedLetter)
}

async function checkPartner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  coupleId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("couples")
    .select("user_a_id, user_b_id")
    .eq("id", coupleId)
    .single()

  if (!data) return false
  return data.user_a_id === userId || data.user_b_id === userId
}
