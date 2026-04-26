import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .single()

  if (!couple) return NextResponse.json({ error: "No couple found" }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const page = parseInt(searchParams.get("page") ?? "0", 10)
  const limit = parseInt(searchParams.get("limit") ?? "20", 10)

  let query = supabase
    .from("memories")
    .select("*", { count: "exact" })
    .eq("couple_id", couple.id)
    .order("memory_date", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type && type !== "all") {
    if (type === "manual") {
      query = query.or(`source.eq.manual,source.is.null`)
    } else {
      query = query.eq("type", type)
    }
  }

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count })
}

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
  const { title, content, memory_date, media_url } = body

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("memories")
    .insert({
      couple_id: couple.id,
      user_id: user.id,
      type: "manual",
      title,
      content: content ?? null,
      media_url: media_url ?? null,
      memory_date: memory_date ?? new Date().toISOString(),
      source: "manual",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
