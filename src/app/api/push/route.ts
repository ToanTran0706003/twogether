import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { sendPushToUser, getPartnerId } from "@/lib/push-server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { type, couple_id } = await req.json()

  if (type === "hug") {
    const partnerId = await getPartnerId(user.id)
    if (partnerId) {
      await sendPushToUser(partnerId, {
        title: "Có người gửi hug cho bạn 🤗",
        body: "Người ấy đang nghĩ đến bạn ♡",
        url: "/locket",
      })
    }
  }

  return NextResponse.json({ ok: true })
}
