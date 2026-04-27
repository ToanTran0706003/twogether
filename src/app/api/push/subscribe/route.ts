import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { subscription, userId } = body

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
  }

  const targetUserId = userId ?? user.id

  await supabase
    .from("push_subscriptions")
    .upsert(
      { user_id: targetUserId, subscription, updated_at: new Date().toISOString() },
      { onConflict: "user_id,subscription->>endpoint" }
    )

  return NextResponse.json({ ok: true })
}
