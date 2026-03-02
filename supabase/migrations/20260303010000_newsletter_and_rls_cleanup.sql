
-- 1. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" 
ON public.newsletter_subscribers FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage subscribers" 
ON public.newsletter_subscribers FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. RLS Policy Normalization & Cleanup
-- Fix typo in blog_posts policy (previously pointed to ads)
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.ads;
CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ensure consistent casting to app_role
DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;
CREATE POLICY "Admins can manage ads" 
ON public.ads FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Realtime enable for newsletter
ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;
