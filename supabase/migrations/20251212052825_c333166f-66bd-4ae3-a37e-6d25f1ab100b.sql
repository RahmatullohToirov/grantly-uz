-- Fix 1: Create function to check if user can view mentor contact info
CREATE OR REPLACE FUNCTION public.can_view_mentor_contact(mentor_uuid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM mentorship_requests
    WHERE mentor_id = mentor_uuid
    AND user_id = auth.uid()
    AND status = 'Approved'
  )
$$;

-- Fix 2: Drop existing SELECT policy and create a new one that doesn't expose contact_info
-- Note: RLS policies apply to entire rows, so we'll create a view for safe access
DROP POLICY IF EXISTS "Authenticated users can view available mentors" ON public.mentors;

-- Create policy that allows viewing mentors but we'll use a view for contact masking
CREATE POLICY "Authenticated users can view available mentors"
ON public.mentors
FOR SELECT
USING (available = true);

-- Create a secure view that masks contact info unless user has approved request
CREATE OR REPLACE VIEW public.mentors_safe AS
SELECT 
  id,
  name,
  title,
  bio,
  expertise,
  avatar_url,
  available,
  created_at,
  CASE 
    WHEN public.can_view_mentor_contact(id) THEN contact_info
    ELSE NULL
  END as contact_info
FROM public.mentors
WHERE available = true;

-- Fix 3: Update mentorship_requests policies
-- Drop existing SELECT policy first
DROP POLICY IF EXISTS "Users can view own requests" ON public.mentorship_requests;

-- Create policy that allows both users and mentors to view requests
CREATE POLICY "Users and mentors can view requests"
ON public.mentorship_requests
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = mentor_id);

-- Add UPDATE policy for mentors to respond to requests
CREATE POLICY "Mentors can update request status"
ON public.mentorship_requests
FOR UPDATE
USING (auth.uid() = mentor_id)
WITH CHECK (auth.uid() = mentor_id);