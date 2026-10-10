-- ==============================================================================
-- OPPRADAR AI — DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Powered by Samrat • Real-Time Opportunity & Academic Intelligence Platform
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────────────────────
-- 1. USER PROFILES & ACADEMIC CREDENTIALS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  degree TEXT DEFAULT 'B.Tech / B.E.',
  branch TEXT DEFAULT 'Computer Science & Engineering',
  college TEXT DEFAULT 'University',
  institution TEXT DEFAULT 'University',
  current_year INT DEFAULT 3,
  year_of_study TEXT DEFAULT '3rd Year',
  location TEXT DEFAULT 'India',
  skills JSONB DEFAULT '["Python", "React", "Data Structures & Algorithms"]'::jsonb,
  interests JSONB DEFAULT '["Hackathons", "Internships", "Scholarships"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. SAVED / BOOKMARKED OPPORTUNITIES
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  opportunity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('HACKATHON', 'INTERNSHIP', 'SCHOLARSHIP', 'GRANT', 'OTHER')),
  location TEXT DEFAULT 'Remote / India',
  stipend_or_prize TEXT,
  deadline DATE,
  apply_url TEXT NOT NULL,
  match_score INT DEFAULT 85,
  eligibility_notes TEXT,
  source TEXT DEFAULT 'SERPAPI_RADAR',
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. SERPAPI SEARCH CACHE (Saves API credits & accelerates search speeds)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.opportunity_search_cache (
  cache_key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  query TEXT,
  location TEXT DEFAULT 'India',
  results JSONB NOT NULL,
  result_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '12 hours')
);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. STUDENT CHAT SESSIONS & CONVERSATION LOGS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  mode_used TEXT DEFAULT 'OPPORTUNITY',
  action_suggestion TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and manage only their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Saved Opportunities: Users can only see & modify their own bookmarks
CREATE POLICY "Users can view own saved opportunities" 
  ON public.saved_opportunities FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved opportunities" 
  ON public.saved_opportunities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved opportunities" 
  ON public.saved_opportunities FOR DELETE 
  USING (auth.uid() = user_id);

-- Search cache is read-only for all authenticated students
ALTER TABLE public.opportunity_search_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cached searches"
  ON public.opportunity_search_cache FOR SELECT
  TO authenticated, anon
  USING (expires_at > NOW());
