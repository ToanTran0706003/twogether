-- Run this in Supabase SQL Editor

-- Add category column to quest_items
ALTER TABLE quest_items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other';

-- Add push_subscriptions table (for push notifications)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON push_subscriptions(user_id);
