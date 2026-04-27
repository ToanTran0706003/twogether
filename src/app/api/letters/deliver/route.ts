import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendPushToUser } from "@/lib/push-server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("letters")
    .select("id, couple_id, sender_id, title, content, send_at")
    .eq("delivered", false)
    .lte("send_at", new Date().toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ delivered: 0 })
  }

  const updateResults = await Promise.allSettled(
    data.map(async (letter) => {
      await supabase
        .from("letters")
        .update({ delivered: true })
        .eq("id", letter.id)

      await supabase.from("memories").insert({
        couple_id: letter.couple_id,
        user_id: letter.sender_id,
        type: "letter",
        title: letter.title ?? "Thư tình",
        content: letter.content,
        memory_date: letter.send_at,
        source: "letter",
      })

      const { data: couple } = await supabase
        .from("couples")
        .select("user_a_id, user_b_id")
        .eq("id", letter.couple_id)
        .single()
      if (couple) {
        const recipientId =
          couple.user_a_id === letter.sender_id ? couple.user_b_id : couple.user_a_id
        if (recipientId) {
          await sendPushToUser(recipientId, {
            title: "Bạn có thư mới 💌",
            body: letter.title ? `"${letter.title}" đã đến tay bạn` : "Người ấy gửi thư cho bạn ♡",
            url: "/dear",
          })
        }
      }
    })
  )

  const failed = updateResults.filter((r) => r.status === "rejected").length

  return NextResponse.json({
    delivered: data.length - failed,
    failed,
  })
}
