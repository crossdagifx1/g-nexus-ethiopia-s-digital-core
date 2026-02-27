

# Massive Admin & Site Enhancement Plan

## Overview
This plan covers: (1) Supercharged admin panel with 15+ management sections, (2) removing public auth/signup, (3) adding Agent & G-Nexus AI buttons, (4) admin-managed links across all pages, (5) advanced Portfolio/Blog/Team/Careers/Platform pages pulling from database, and (6) fully built-out Support, Contact, FAQ, Documentation, and Status pages.

---

## 1. Remove Public Login/Signup

- Remove the `/auth` route from `App.tsx` and delete the Auth page link from any public navigation
- Keep `Auth.tsx` but make it **login-only** (no signup toggle) -- only admins who already have accounts can sign in
- Remove any "Sign Up" or "Create Account" references from the auth page
- Admin page at `/admin` remains, redirecting to `/auth` if not logged in

## 2. Add Agent & G-Nexus AI Buttons

- Add two floating action buttons alongside the existing chat widget:
  - **"Agent" button** -- opens the existing AI chat widget (Tsion)
  - **"G-Nexus AI" button** -- opens a separate AI assistant focused on G-Nexus platform questions
- Update `AIChatWidget.tsx` to support a mode prop or add a second widget component
- Place buttons as a vertical FAB stack in bottom-right corner

## 3. Admin Panel -- 100x Better

### New Admin Navigation Tabs
Add these new sections to the admin sidebar (alongside existing Dashboard, Chats, Portfolio, Ads, Blog, Testimonials, Users, Analytics, Settings):

- **Team Management** -- CRUD team members (name, role, bio, skills, social links, photo)
- **Careers Management** -- CRUD job positions (title, department, type, location, requirements, status)
- **Pages/Links Management** -- Manage all page links, navigation items, footer links from admin
- **Platform Management** -- Manage G-Nexus features, pricing plans, testimonials
- **FAQ Management** -- CRUD FAQ items
- **Documentation Management** -- CRUD documentation entries
- **Support Tickets** -- View/manage support requests submitted via the Support page
- **Status Management** -- Toggle service statuses, add incidents

### Database Migrations Required

```sql
-- Team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar_url text,
  skills jsonb DEFAULT '[]',
  social_links jsonb DEFAULT '{}',
  fun_fact text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career positions table
CREATE TABLE public.career_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  type text NOT NULL DEFAULT 'Full-time',
  location text,
  description text,
  requirements jsonb DEFAULT '[]',
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Service status table
CREATE TABLE public.service_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text DEFAULT 'operational',
  description text,
  last_incident text,
  updated_at timestamptz DEFAULT now()
);

-- Navigation links table (admin-managed)
CREATE TABLE public.navigation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'navbar', 'footer_services', 'footer_company', 'footer_support'
  label text NOT NULL,
  href text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  parent_id uuid REFERENCES public.navigation_links(id),
  created_at timestamptz DEFAULT now()
);
```

RLS policies: Admin can manage all tables, public can SELECT active/published items. Support tickets allow public INSERT.

### New Admin Components to Create

| Component | File | Purpose |
|-----------|------|---------|
| TeamManager | `src/components/admin/TeamManager.tsx` | CRUD team members |
| CareersManager | `src/components/admin/CareersManager.tsx` | CRUD career positions |
| FAQManager | `src/components/admin/FAQManager.tsx` | CRUD FAQ items |
| DocsManager | `src/components/admin/DocsManager.tsx` | CRUD documentation |
| SupportManager | `src/components/admin/SupportManager.tsx` | View/manage support tickets |
| StatusManager | `src/components/admin/StatusManager.tsx` | Manage service statuses |
| NavigationManager | `src/components/admin/NavigationManager.tsx` | Manage nav/footer links |

### Admin UI Improvements

- Add search/filter to all manager tables
- Add bulk actions (delete multiple)
- Improve sidebar with collapsible groups (Content, Management, System)
- Add breadcrumbs in header
- Add quick stats cards at top of each section
- Better mobile responsive admin layout

## 4. Advanced Public Pages (Database-Driven)

### Portfolio Page
- Fetch projects from `portfolio_projects` table (already exists)
- Add filtering by category, search, sorting
- Add project detail modal with full description, tech stack, live link
- Add admin link indicators

### Blog Page
- Fetch published posts from `blog_posts` table (already exists)
- Show actual DB posts instead of hardcoded data
- Individual blog post view at `/blog/:id`
- Newsletter subscription stores to DB

### Team Page
- Fetch team members from new `team_members` table
- Dynamic skills, social links, bios from database
- Admin can add/remove team members

### Careers Page
- Fetch open positions from `career_positions` table
- Application button submits to `support_tickets` with type "application"
- Filter by department, show only "open" positions

### G-Nexus Platform Page
- Keep current design but add admin-editable content sections
- Platform link managed by admin navigation settings

### FAQ Page
- Fetch from `faq_items` table instead of hardcoded array
- Category-based filtering
- Search functionality

### Documentation Page
- Fetch from `documentation_entries` table
- Category grouping, search
- Rich content display

### Status Page
- Fetch from `service_status` table
- Real-time status indicators
- Incident history display

### Contact/Support Page
- Contact form submissions saved to `support_tickets` table
- Add live chat link, phone, email
- Add support ticket tracking

## 5. Files to Create

| File | Description |
|------|-------------|
| `src/components/admin/TeamManager.tsx` | Team CRUD |
| `src/components/admin/CareersManager.tsx` | Careers CRUD |
| `src/components/admin/FAQManager.tsx` | FAQ CRUD |
| `src/components/admin/DocsManager.tsx` | Docs CRUD |
| `src/components/admin/SupportManager.tsx` | Support tickets |
| `src/components/admin/StatusManager.tsx` | Service status |
| `src/components/admin/NavigationManager.tsx` | Links manager |
| `src/pages/BlogPost.tsx` | Individual blog post page |
| `src/pages/Support.tsx` | Dedicated support page |

## 6. Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Remove `/auth` signup, add `/blog/:id` and `/support` routes |
| `src/pages/Auth.tsx` | Login only, remove signup toggle |
| `src/pages/Admin.tsx` | Add 7 new tabs, improve sidebar grouping, better UI |
| `src/pages/Blog.tsx` | Fetch from database instead of hardcoded |
| `src/pages/Team.tsx` | Fetch from database |
| `src/pages/Careers.tsx` | Fetch from database |
| `src/pages/FAQ.tsx` | Fetch from database |
| `src/pages/Documentation.tsx` | Fetch from database |
| `src/pages/Status.tsx` | Fetch from database |
| `src/pages/Contact.tsx` | Save submissions to support_tickets |
| `src/pages/Portfolio.tsx` | Already DB-driven, enhance UI |
| `src/components/Navbar.tsx` | Fetch links from navigation_links table |
| `src/components/Footer.tsx` | Fetch links from navigation_links table |
| `src/components/AIChatWidget.tsx` | Add Agent + G-Nexus AI dual button |

## 7. Implementation Order

1. Database migrations (all 7 new tables + RLS policies)
2. Auth page -- login only
3. Admin panel restructure with grouped sidebar
4. Build all 7 new admin manager components
5. Update public pages to be database-driven
6. Add Agent & G-Nexus AI buttons
7. Add navigation link management + dynamic navbar/footer
8. Add blog post detail page and support page
9. Polish and test

