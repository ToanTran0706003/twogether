-- Fix RLS policy cho couples table
DROP POLICY IF EXISTS "couple_update" ON couples;
DROP POLICY IF EXISTS "couple_select" ON couples;
DROP POLICY IF EXISTS "couple_insert" ON couples;
DROP POLICY IF EXISTS "couple_members" ON couples;

-- Cho phép INSERT khi user_a_id = current user
CREATE POLICY "couple_insert" ON couples
  FOR INSERT WITH CHECK (auth.uid() = user_a_id);

-- Cho phép SELECT nếu là user_a hoặc user_b
CREATE POLICY "couple_select" ON couples
  FOR SELECT USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  );

-- Cho phép UPDATE nếu là user_a HOẶC nếu user_b_id đang NULL (ai cũng join được)
CREATE POLICY "couple_update" ON couples
  FOR UPDATE USING (
    auth.uid() = user_a_id
    OR auth.uid() = user_b_id
    OR user_b_id IS NULL
  )
  WITH CHECK (
    auth.uid() = user_a_id
    OR auth.uid() = user_b_id
    OR (user_b_id IS NULL AND auth.uid() != user_a_id)
  );
