-- Add enhanced profile fields for matching
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS nationality text,
ADD COLUMN IF NOT EXISTS country_of_residence text,
ADD COLUMN IF NOT EXISTS gpa numeric(3,2),
ADD COLUMN IF NOT EXISTS institution_type text,
ADD COLUMN IF NOT EXISTS income_level text,
ADD COLUMN IF NOT EXISTS financial_need boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_completed_at timestamp with time zone;

-- Add scholarship requirements fields for better matching
ALTER TABLE public.scholarships
ADD COLUMN IF NOT EXISTS eligible_genders text[],
ADD COLUMN IF NOT EXISTS min_age integer,
ADD COLUMN IF NOT EXISTS max_age integer,
ADD COLUMN IF NOT EXISTS eligible_nationalities text[],
ADD COLUMN IF NOT EXISTS eligible_countries text[],
ADD COLUMN IF NOT EXISTS min_gpa numeric(3,2),
ADD COLUMN IF NOT EXISTS eligible_education_levels text[],
ADD COLUMN IF NOT EXISTS eligible_fields text[],
ADD COLUMN IF NOT EXISTS financial_need_required boolean DEFAULT false;

-- Create application_checklists table for tracking required documents
CREATE TABLE public.application_checklists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id uuid NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  checklist_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, scholarship_id)
);

-- Enable RLS
ALTER TABLE public.application_checklists ENABLE ROW LEVEL SECURITY;

-- RLS policies for application_checklists
CREATE POLICY "Users can view own checklists"
ON public.application_checklists
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklists"
ON public.application_checklists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists"
ON public.application_checklists
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklists"
ON public.application_checklists
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_application_checklists_updated_at
BEFORE UPDATE ON public.application_checklists
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();