

# Advanced Admin Portal Overhaul with AI Blog Writing

## Overview
Transform the admin into a polished, fully integrated command center with AI-powered blog writing, fixed chat history, and improved management across all sections.

---

## 1. AI-Powered Blog Writer

**New edge function:** `supabase/functions/ai-blog-writer/index.ts`
- Uses the existing OpenRouter API key (already configured) with the same model setup as `ai-chat`
- Accepts a `topic`, `tone`, and `keywords` input
- Returns a generated blog post with title, excerpt, and full markdown content
- System prompt tailored for professional tech/business blog writing

**BlogManager upgrade** (`src/components/admin/BlogManager.tsx`):
- Add "AI Write" button next to "New Post" that opens a dialog
- Dialog has inputs for: Topic, Tone (Professional/Casual/Technical), Keywords
- Clicking "Generate" calls the edge function and populates the blog form with the AI-generated content
- Admin can then edit before saving

---

## 2. Fix AI Chat History in Admin

**Problem:** The `EnhancedChatView` works but has 37 conversations in the database. The current implementation fetches message counts one-by-one per conversation (N+1 query problem), which is slow and may fail.

**Fix in `EnhancedChatView.tsx`:**
- Batch-fetch message counts instead of N+1 queries
- Add pagination (load 20 conversations at a time with "Load More")
- Add a "Delete Conversation" action for admins
- Show the chat mode (agent vs gnexus) if available
- Fix real-time subscription to properly handle updates without re-fetching everything

---

## 3. Enhanced Dashboard

**Upgrade `Admin.tsx` dashboard tab:**
- Add quick-action cards: "Write Blog with AI", "View Support Tickets", "Manage Team"
- Add content summary row: total blog posts, testimonials, team members, open tickets, FAQ items
- Improve recent conversations display with better status indicators
- Add a "System Health" mini-card showing service status counts

---

## 4. Comprehensive Analytics Upgrade

**Upgrade `AdminAnalytics.tsx`:**
- Add content analytics: blog posts by month, portfolio by category
- Add support ticket metrics: open vs resolved, avg resolution time
- Add team/testimonial counts as KPI cards
- Replace the mocked "Avg Response Time" with actual calculation from message timestamps

---

## 5. Fix All Manager Components

Several managers use `as any` type casts. Clean these up and ensure they all:
- Have proper loading states
- Show success/error toasts consistently
- Log activity to `activity_log` table on create/update/delete actions
- Have search/filter capabilities where missing

**Files to touch:**
- `BlogManager.tsx` - remove `as any` casts, add AI writing, add activity logging
- `TestimonialManager.tsx` - add activity logging
- `TeamManager.tsx` - add activity logging
- `CareersManager.tsx` - add activity logging
- `FAQManager.tsx` - add activity logging
- `DocsManager.tsx` - add activity logging
- `StatusManager.tsx` - add activity logging
- `NavigationManager.tsx` - add activity logging
- `AdManager.tsx` - add activity logging
- `SupportManager.tsx` - add activity logging

---

## 6. Settings Enhancement

**Upgrade `AdminSettings.tsx`:**
- Add a "Danger Zone" tab with options like: Clear all chat history, Export all data
- Add AI settings tab: configure AI model, system prompt preview, test AI response
- Add SEO/Meta settings: site title, description, OG image URL

---

## Technical Details

### New Edge Function: `ai-blog-writer`
```text
Input:  { topic, tone, keywords, length }
Output: { title, excerpt, content (markdown), category }
Uses:   OPENROUTER_API_KEY (already set)
Model:  arcee-ai/trinity-large-preview:free
```

### Files to Create
1. `supabase/functions/ai-blog-writer/index.ts`

### Files to Modify
1. `src/pages/Admin.tsx` - enhanced dashboard with quick actions and content stats
2. `src/components/admin/BlogManager.tsx` - AI writing integration, remove type casts
3. `src/components/admin/EnhancedChatView.tsx` - fix N+1 queries, add pagination and delete
4. `src/components/admin/AdminAnalytics.tsx` - add content/support analytics
5. `src/components/admin/AdminSettings.tsx` - add AI and danger zone tabs
6. `src/components/admin/TestimonialManager.tsx` - add activity logging
7. `src/components/admin/TeamManager.tsx` - add activity logging
8. `src/components/admin/CareersManager.tsx` - add activity logging
9. `src/components/admin/FAQManager.tsx` - add activity logging
10. `src/components/admin/DocsManager.tsx` - add activity logging
11. `src/components/admin/StatusManager.tsx` - add activity logging
12. `src/components/admin/NavigationManager.tsx` - add activity logging
13. `src/components/admin/AdManager.tsx` - add activity logging
14. `src/components/admin/SupportManager.tsx` - add activity logging

### Config Update
- Add `ai-blog-writer` function to `supabase/config.toml` with `verify_jwt = false`

