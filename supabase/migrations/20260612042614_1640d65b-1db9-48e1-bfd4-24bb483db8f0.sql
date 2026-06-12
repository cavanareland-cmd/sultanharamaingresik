
-- Restrict EXECUTE on has_role (SECURITY DEFINER) to only authenticated role
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Lock down site_settings: only expose known public keys to anon/authenticated
DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
CREATE POLICY "public read safe settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('hero','about','contact','stats','gallery_meta'));

-- Add restrictive policy on user_roles so non-admins cannot insert/update/delete (defense in depth)
CREATE POLICY "block non-admin role writes" ON public.user_roles
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
