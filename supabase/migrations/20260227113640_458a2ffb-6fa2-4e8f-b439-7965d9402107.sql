
-- Team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar_url text,
  skills jsonb DEFAULT '[]'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  fun_fact text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING (is_active = true);

-- Career positions table
CREATE TABLE public.career_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  type text NOT NULL DEFAULT 'Full-time',
  location text,
  description text,
  requirements jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.career_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage career positions" ON public.career_positions FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view open positions" ON public.career_positions FOR SELECT USING (status = 'open');

-- FAQ items table
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage FAQ items" ON public.faq_items FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active FAQ items" ON public.faq_items FOR SELECT USING (is_active = true);

-- Documentation entries table
CREATE TABLE public.documentation_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text,
  category text DEFAULT 'General',
  icon text DEFAULT 'Book',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.documentation_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage documentation" ON public.documentation_entries FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active documentation" ON public.documentation_entries FOR SELECT USING (is_active = true);

-- Support tickets table
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  priority text DEFAULT 'normal',
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage support tickets" ON public.support_tickets FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);

-- Service status table
CREATE TABLE public.service_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text DEFAULT 'operational',
  description text,
  last_incident text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage service status" ON public.service_status FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view service status" ON public.service_status FOR SELECT USING (true);

-- Navigation links table
CREATE TABLE public.navigation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  label text NOT NULL,
  href text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  parent_id uuid REFERENCES public.navigation_links(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage navigation links" ON public.navigation_links FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active navigation links" ON public.navigation_links FOR SELECT USING (is_active = true);
