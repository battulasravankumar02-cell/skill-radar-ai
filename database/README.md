# OPPRADAR AI — Database Architecture

This directory houses the PostgreSQL schema and database definitions for **OPPRADAR AI** (powered by Supabase).

## Structure
* **`schema.sql`**: Production schema including:
  * **`public.profiles`**: Student academic credentials (degree, college, graduation year, known skills).
  * **`public.saved_opportunities`**: Student bookmarks for hackathons, internships, and scholarships.
  * **`public.opportunity_search_cache`**: 12-hour automated SerpApi caching table to minimize API usage.
  * **`public.chat_messages`**: Chat history and academic tutor interaction logs.
  * **Row-Level Security (RLS)**: Enforces privacy so students can only access their own data.

## Setup Instructions
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Paste the contents of `schema.sql` and run the script.
4. Copy your **Project URL** and **Anon Key** into `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
