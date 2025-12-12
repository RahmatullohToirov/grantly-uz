-- Fix the security definer view issue by recreating as SECURITY INVOKER
DROP VIEW IF EXISTS public.mentors_safe;

-- Create the view with SECURITY INVOKER (default, safer)
CREATE VIEW public.mentors_safe 
WITH (security_invoker = true)
AS
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