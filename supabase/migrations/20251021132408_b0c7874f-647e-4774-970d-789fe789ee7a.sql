-- Add fields for scraper tracking and deduplication
ALTER TABLE public.scholarships
ADD COLUMN IF NOT EXISTS source_url text,
ADD COLUMN IF NOT EXISTS source_name text,
ADD COLUMN IF NOT EXISTS last_updated timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS unique_hash text;

-- Create unique index on hash to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS scholarships_unique_hash_idx ON public.scholarships(unique_hash);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS scholarships_title_idx ON public.scholarships USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS scholarships_description_idx ON public.scholarships USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS scholarships_location_idx ON public.scholarships(location);
CREATE INDEX IF NOT EXISTS scholarships_deadline_idx ON public.scholarships(deadline);
CREATE INDEX IF NOT EXISTS scholarships_category_idx ON public.scholarships(category);

-- Function to generate unique hash
CREATE OR REPLACE FUNCTION public.generate_scholarship_hash(title text, link text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(digest(lower(trim(title)) || '::' || lower(trim(link)), 'sha256'), 'hex');
END;
$$;

-- Trigger to auto-generate hash on insert/update
CREATE OR REPLACE FUNCTION public.auto_generate_scholarship_hash()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.unique_hash := public.generate_scholarship_hash(NEW.title, COALESCE(NEW.link, ''));
  NEW.last_updated := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_scholarship_hash
BEFORE INSERT OR UPDATE ON public.scholarships
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_scholarship_hash();