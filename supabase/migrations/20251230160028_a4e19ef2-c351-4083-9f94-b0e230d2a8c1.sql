-- Recreate the function to use pgcrypto.digest with proper schema
CREATE OR REPLACE FUNCTION public.generate_scholarship_hash(title text, link text)
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  RETURN encode(extensions.digest(lower(trim(title)) || '::' || lower(trim(link)), 'sha256'), 'hex');
END;
$$;