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
      }
      return NextResponse.redirect(`${origin}/home`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
