-- Create mentor_applications table for mentor applications
CREATE TABLE public.mentor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_experience BOOLEAN NOT NULL DEFAULT false,
  motivation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own mentor applications" 
ON public.mentor_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mentor applications" 
ON public.mentor_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all mentor applications" 
ON public.mentor_applications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mentor applications" 
ON public.mentor_applications 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete mentor applications" 
ON public.mentor_applications 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mentor_applications_updated_at
BEFORE UPDATE ON public.mentor_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();