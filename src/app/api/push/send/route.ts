import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { sendPushToUser } from "@/lib/push-server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { user_id, title, body, url } = await req.json()
  if (!user_id || !title || !body) {
    return NextResponse.json({ error: "user_id, title, body required" }, { status: 400 })
  }

  await sendPushToUser(user_id, { title, body, url: url ?? "/home" })
  return NextResponse.json({ ok: true })
}
