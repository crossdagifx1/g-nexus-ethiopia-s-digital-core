

## Comprehensive Enhancement Plan: G-Nexus Logo, Ad Posting, Admin Features, and Homepage Animations

### 1. Add G-Nexus Logo Throughout the App

Copy the uploaded `g-nexus-logo.png` to `src/assets/` and use it in:
- **Navbar** - Replace the "G" icon placeholder with the actual logo
- **Footer** - Replace the "G" icon with the logo
- **GNexusSection** - Replace the "G" placeholder in the dashboard card with the logo
- **GNexusPlatform page** - Use logo in the hero area
- **Admin sidebar** - Show the logo in the admin panel header

### 2. Ad Posting System (New Feature)

**Database:** Create an `ads` table with fields: `id`, `title`, `description`, `image_url`, `link_url`, `placement` (hero_banner, sidebar, in_feed, popup), `status` (active, paused, scheduled, expired), `start_date`, `end_date`, `impressions`, `clicks`, `created_by`, `created_at`, `updated_at`. Enable RLS for admin management and public viewing of active ads.

**Admin tab:** Add an "Ads" tab in the admin panel with:
- Create/edit/delete ads with image upload
- Set placement, schedule (start/end dates), and status
- View impressions and click tracking stats
- Toggle ads active/paused

**Frontend component:** Create `AdBanner` component that fetches and displays active ads in configured placements on the homepage.

### 3. 10+ New Admin Features

Add these new admin capabilities:

1. **Ad Management** (as described above)
2. **Blog Post Manager** - CRUD for blog posts with rich text, categories, publish/draft status
3. **Testimonial Manager** - Add/edit/delete customer testimonials shown on site
4. **Site Content Editor** - Edit hero text, company info, contact details from admin
5. **File Manager** - Browse and manage uploaded files in storage
6. **Notification Center** - Bell icon with real-time notifications for new chats, form submissions
7. **Quick Actions Bar** - Header shortcuts: new project, new blog post, new ad
8. **Dashboard Charts** - Add Recharts line/bar charts showing chat trends, project growth over time
9. **Export Data** - Export conversations, analytics, projects as CSV
10. **System Health Monitor** - Show API status, storage usage, active users count
11. **Bulk Actions on Projects** - Select multiple projects to delete, feature, or reorder

**New admin nav items:** Ads, Blog, Testimonials, Content

### 4. Enhanced Homepage Animations

Add these new animated sections and effects to the homepage:

- **Animated number counters** - Stats section with numbers counting up on scroll using GSAP
- **Marquee/ticker section** - Auto-scrolling tech stack or partner logos between sections
- **Morphing gradient background** - Animated color-shifting gradient behind the hero
- **Scroll-triggered text splitting** - Headlines that animate word-by-word as they enter viewport
- **Floating 3D card tilt effect** - Service cards that tilt toward the mouse cursor
- **Section divider animations** - Wavy SVG dividers between sections that animate on scroll
- **Staggered grid reveal** - Portfolio/services cards that cascade in with wave pattern
- **Typewriter effect** - Rotating taglines in the hero that type and delete

### Technical Details

**Database Migration:**
```sql
-- ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  placement TEXT NOT NULL DEFAULT 'in_feed',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  author_id UUID,
  author_name TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for admin CRUD and public read
```

**New Files to Create:**
- `src/components/admin/AdManager.tsx` - Full ad CRUD interface
- `src/components/admin/BlogManager.tsx` - Blog post management
- `src/components/admin/TestimonialManager.tsx` - Testimonial management
- `src/components/admin/NotificationCenter.tsx` - Real-time notification bell
- `src/components/AdBanner.tsx` - Public-facing ad display component
- `src/components/MarqueeSection.tsx` - Auto-scrolling ticker
- `src/components/TypewriterHero.tsx` - Typing text effect
- `src/components/SectionDivider.tsx` - Animated wavy SVG dividers

**Files to Modify:**
- `src/pages/Admin.tsx` - Add new tabs (Ads, Blog, Testimonials), notification center, quick actions
- `src/pages/Index.tsx` - Add marquee section, section dividers, enhanced animations
- `src/components/HeroSection.tsx` - Add typewriter effect, morphing gradient
- `src/components/Navbar.tsx` - Replace icon with logo image
- `src/components/Footer.tsx` - Replace icon with logo image
- `src/components/GNexusSection.tsx` - Use logo image
- `src/components/ServicesSection.tsx` - Add tilt card effect
- `src/App.tsx` - No route changes needed (blog page already exists)

