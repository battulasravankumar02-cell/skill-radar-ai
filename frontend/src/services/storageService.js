// ==============================================================================
// OPPRADAR AI — UNIFIED STORAGE & PROFILE ADAPTER SERVICE
// Supports both Supabase PostgreSQL and instant local persistence.
// ==============================================================================

import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.js';

const devWarn = (...args) => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.warn(...args);
  }
};

const STORAGE_KEYS = {
  PROFILE: 'oppradar_profile',
  AUTHENTICATED: 'oppradar_authenticated',
  ONBOARDED: 'oppradar_onboarded_completed',
  USER_EMAIL: 'oppradar_user_email'
};

// Default student profile for Skill Radar AI / OppRadar
const DEFAULT_PROFILE = {
  id: 'usr-student-01',
  username: 'student_explorer',
  full_name: 'Aditya Sharma',
  email: 'aditya.sharma@gmail.com',
  degree: 'B.Tech / B.E.',
  branch: 'Computer Science & Engineering',
  college: 'National Institute of Technology',
  institution: 'National Institute of Technology',
  yearOfStudy: '3rd Year',
  current_year: 3,
  location: 'Bangalore, India',
  skills: ['Python', 'React', 'Data Structures & Algorithms', 'Machine Learning', 'Git & GitHub'],
  interests: ['Hackathons', 'AI / Web3', 'Frontend & Full-Stack', 'Summer Internships'],
  created_at: new Date().toISOString()
};

/**
 * Retrieves the current user profile from Supabase or localStorage.
 */
export const getProfile = async () => {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        const { data } = await client.from('profiles').select('*').eq('id', user.id).single();
        if (data) return data;
      }
    } catch (e) {
      devWarn('Supabase profile fetch failed, using local persistence:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn('[OppRadar Storage] Corrupted profile JSON in localStorage');
    }
  }
  return DEFAULT_PROFILE;
};

/**
 * Persists the updated user profile locally and syncs to Supabase if configured.
 */
export const saveProfile = async (profileData) => {
  const existing = await getProfile();
  const updated = {
    ...existing,
    ...profileData,
    updated_at: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        await client.from('profiles').upsert({ ...updated, id: user.id });
      }
    } catch (e) {
      devWarn('Supabase profile save failed:', e);
    }
  }

  return updated;
};

export default {
  getProfile,
  saveProfile
};
