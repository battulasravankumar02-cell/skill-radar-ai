// ==============================================================================
// NEXGUIDE AI — SUPABASE CLIENT & REAL-TIME CONNECTION SERVICE
// Single source of truth: delegates to src/supabaseClient.js for the live client
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

// ── Re-export the shared singleton client ────────────────────────────────────
export { supabase, default } from '../supabaseClient';

// ── Retrieve credentials from Vite env OR user-saved localStorage values ─────
const getCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const storedUrl = localStorage.getItem('nexguide_supabase_url');
  const storedKey = localStorage.getItem('nexguide_supabase_anon_key');

  const supabaseUrl = storedUrl || envUrl || '';
  const supabaseAnonKey = storedKey || envKey || '';

  return { supabaseUrl, supabaseAnonKey };
};

// ── isSupabaseConfigured — used by Settings.jsx, App.jsx, SupabaseModal ──────
export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getCredentials();
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

// ── getSupabaseClient — used by storageService.js for all DB operations ──────
export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getCredentials();
  if (!isSupabaseConfigured()) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[NexGuide] Supabase client init failed:', err);
    }
    return null;
  }
};

// ── testSupabaseConnection — used by SupabaseModal.jsx for live ping test ────
export const testSupabaseConnection = async (url, key) => {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && error.message && !error.message.includes('permission denied')) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase PostgreSQL successfully!' };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to connect' };
  }
};

// ── Credential persistence helpers ───────────────────────────────────────────
export const saveSupabaseCredentials = (url, key) => {
  localStorage.setItem('nexguide_supabase_url', url);
  localStorage.setItem('nexguide_supabase_anon_key', key);
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('nexguide_supabase_url');
  localStorage.removeItem('nexguide_supabase_anon_key');
};
