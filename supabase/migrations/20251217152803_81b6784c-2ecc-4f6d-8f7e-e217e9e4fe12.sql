-- Fix function search_path for all user-defined functions

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$function$;

-- Fix generate_scholarship_hash function
CREATE OR REPLACE FUNCTION public.generate_scholarship_hash(title text, link text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  RETURN encode(digest(lower(trim(title)) || '::' || lower(trim(link)), 'sha256'), 'hex');
END;
$function$;

-- Fix auto_generate_scholarship_hash function
CREATE OR REPLACE FUNCTION public.auto_generate_scholarship_hash()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.unique_hash := public.generate_scholarship_hash(NEW.title, COALESCE(NEW.link, ''));
  NEW.last_updated := now();
  RETURN NEW;
END;
$function$;

-- Fix log_user_activity function (already has search_path, but ensure it's set)
CREATE OR REPLACE FUNCTION public.log_user_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  IF TG_TABLE_NAME = 'user_applications' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.user_activity (user_id, activity_type, description)
      VALUES (
        NEW.user_id,
        'application_created',
        'Applied to a scholarship'
      );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      INSERT INTO public.user_activity (user_id, activity_type, description)
      VALUES (
        NEW.user_id,
        'application_updated',
        'Updated application status to ' || NEW.status
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;