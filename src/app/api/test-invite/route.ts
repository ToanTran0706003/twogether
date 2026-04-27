import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("couples")
    .select("id, invite_code, user_a_id, user_b_id, created_at")
  return NextResponse.json({ data, error })
}
