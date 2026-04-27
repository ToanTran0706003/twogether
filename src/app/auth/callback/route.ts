import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name ?? user.email,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        }, { onConflict: "id" })

        const { data: couple } = await supabase
          .from("couples")
          .select("id")
          .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
          .maybeSingle()

        return NextResponse.redirect(`${origin}${couple ? "/home" : "/invite"}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
