import { createClient } from '@/lib/supabase/server'
import { MoodClient } from '@/components/mood/MoodClient'

export default async function MoodPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: couple } = await supabase
    .from('couples')
    .select('*, user_a:users!couples_user_a_id_fkey(id,name,avatar_url), user_b:users!couples_user_b_id_fkey(id,name,avatar_url)')
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .maybeSingle()

  const today = new Date().toISOString().split('T')[0]
  const { data: moodEntries } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('couple_id', couple?.id ?? '')
    .gte('entry_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0])
    .order('entry_date', { ascending: false })

  const partner = couple?.user_a_id === user.id
    ? couple?.user_b
    : couple?.user_a

  return (
    <MoodClient
      coupleId={couple?.id ?? ''}
      currentUserId={user.id}
      partnerName={partner?.name ?? 'Người ấy'}
      initialEntries={moodEntries ?? []}
      today={today}
    />
  )
}
