-- Run this in Supabase SQL Editor → Storage → Policies
-- Or via SQL Editor directly

-- Allow authenticated users to upload to photos bucket
CREATE POLICY "auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'photos');

CREATE POLICY "auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
