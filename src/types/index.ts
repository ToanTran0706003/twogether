import { type User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}

export interface Couple {
  id: string
  user_a_id: string
  user_b_id: string | null
  anniversary: string
  invite_code: string
  created_at: string
}

export interface CoupleWithPartner extends Couple {
  partner: SupabaseUser
}

export interface LocketPhoto {
  id: string
  couple_id: string
  sender_id: string
  photo_url: string
  caption: string | null
  reaction: string | null
  taken_at: string
}

export interface QuestItem {
  id: string
  couple_id: string
  created_by: string
  title: string
  description: string | null
  category: string | null
  completed: boolean
  photo_url: string | null
  completed_at: string | null
  created_at: string
}

export interface MoodEntry {
  id: string
  couple_id: string
  user_id: string
  emoji: string
  color: string | null
  note: string | null
  entry_date: string
  created_at: string
}

export interface Letter {
  id: string
  couple_id: string
  sender_id: string
  title: string
  content: string
  send_at: string
  delivered: boolean
  created_at: string
}

export interface Memory {
  id: string
  couple_id: string
  user_id: string
  type: string
  title: string
  content: string | null
  media_url: string | null
  memory_date: string
  source: string | null
  created_at: string
}
