-- Fix the incorrect RLS policy that was applied to the 'ads' table instead of 'blog_posts'
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.ads;

-- Create the correct policy for blog_posts
CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ensure anyone can view published posts (pre-existing but good to re-affirm)
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');
