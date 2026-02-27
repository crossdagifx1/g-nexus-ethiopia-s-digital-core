
-- Fix: the blog admin policy was accidentally put on ads table. Add it to blog_posts instead.
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.ads;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));
