-- Drop existing policies and recreate with correct configuration
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

-- Recreate policies for documents bucket
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);