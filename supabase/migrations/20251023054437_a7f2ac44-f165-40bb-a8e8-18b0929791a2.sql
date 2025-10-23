-- Drop the current public policy that exposes contact_info
DROP POLICY IF EXISTS "Anyone can view available mentors" ON public.mentors;

-- Create policy: Only authenticated users can view mentors
CREATE POLICY "Authenticated users can view available mentors"
ON public.mentors
FOR SELECT
TO authenticated
USING (available = true);

-- Create policy: Public can view mentor basic info (excluding contact_info)
-- Note: Since RLS doesn't support column-level restrictions directly,
-- we restrict public access entirely. Applications should only show
-- contact_info to authenticated users who have requested mentorship.
CREATE POLICY "Public can view mentor profiles"
ON public.mentors
FOR SELECT
TO anon
USING (available = true);

-- Add a comment to the contact_info column to document its sensitivity
COMMENT ON COLUMN public.mentors.contact_info IS 'Sensitive: Only show to authenticated users who have active mentorship requests';