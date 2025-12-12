-- Fix: Remove the public SELECT policy from payment_settings and make it superadmin-only
DROP POLICY IF EXISTS "Anyone can view payment settings" ON public.payment_settings;

-- Create a restrictive policy allowing only superadmins to view payment settings
CREATE POLICY "Only superadmins can view payment settings" 
ON public.payment_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'superadmin'::app_role));