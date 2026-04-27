import webpush from "web-push"
import { createClient } from "@/lib/supabase/server"

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("user_id", userId)

  if (!rows?.length) return

  await Promise.allSettled(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, JSON.stringify(payload))
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("user_id", userId)
            .eq("subscription->>endpoint", (row.subscription as { endpoint: string }).endpoint)
        }
      }
    })
  )
}

export async function getPartnerId(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("couples")
    .select("user_a_id, user_b_id")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .single()
  if (!data) return null
  return data.user_a_id === userId ? data.user_b_id : data.user_a_id
}
