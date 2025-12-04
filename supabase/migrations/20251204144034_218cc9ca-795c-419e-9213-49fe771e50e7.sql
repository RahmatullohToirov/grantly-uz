-- Fix 1: Restrict profiles SELECT policy to prevent public data exposure
-- Users should only see their own profile by default, admins can see all
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Fix 2: Remove anonymous access to mentors table to protect contact_info
DROP POLICY IF EXISTS "Public can view mentor profiles" ON public.mentors;

-- Keep only authenticated access for mentors
-- The "Authenticated users can view available mentors" policy already exists

-- Fix 3: Add INSERT policy for user_activity table (defense in depth)
CREATE POLICY "Users can insert own activity" 
ON public.user_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);