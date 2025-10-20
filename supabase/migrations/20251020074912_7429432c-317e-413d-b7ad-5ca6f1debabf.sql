-- Fix search_path for functions that don't have it set
ALTER FUNCTION public.update_post_likes_count() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;