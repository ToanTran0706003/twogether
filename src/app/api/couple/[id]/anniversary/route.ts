import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id: coupleId } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: couple } = await supabase
    .from("couples")
    .select("id, user_a_id, user_b_id")
    .eq("id", coupleId)
    .single()

  if (!couple || (couple.user_a_id !== user.id && couple.user_b_id !== user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json()
  const { anniversary } = body

  if (!anniversary) {
    return NextResponse.json({ error: "anniversary is required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("couples")
    .update({ anniversary })
    .eq("id", coupleId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
