// ==============================================================================
// NEXGUIDE LIVE — FRONTEND OPPORTUNITY SERVICE LAYER
// Bridges UI with the secure backend Opportunity Intelligence Pipeline.
// Manages local persistence for saved/bookmarked opportunities.
// ==============================================================================

const SAVED_OPPORTUNITIES_KEY = 'oppradar_saved_opportunities';
const LAST_SEARCH_CACHE_KEY = 'oppradar_last_radar_search';
const SERPAPI_KEY_STORAGE = 'oppradar_serpapi_key';
const RAW_KEY = 'MGZhNzVjM2RiYTU2NjY4YzdkMjk1MDEwY2NmYmZmZWU3M2FhZmI0NTk3M2QxOWViZDI3MjllMDExOGEyNjQ4MA==';
export const DEFAULT_SERPAPI_KEY = typeof atob !== 'undefined' ? atob(RAW_KEY) : '';

/**
 * Returns stored user SerpApi Key
 */
export function getStoredSerpApiKey() {
  const custom = localStorage.getItem(SERPAPI_KEY_STORAGE);
  if (custom && custom.trim() && custom !== 'your_serpapi_key_here') {
    return custom.trim();
  }
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERPAPI_KEY) || DEFAULT_SERPAPI_KEY;
}

/**
 * Persists user SerpApi Key
 */
export function setStoredSerpApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(SERPAPI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(SERPAPI_KEY_STORAGE);
  }
}

/**
 * Health check on SerpApi server configuration
 */
export async function checkSerpApiStatus() {
  try {
    const key = getStoredSerpApiKey();
    const res = await fetch('/api/radar/status', {
      headers: key ? { 'x-serpapi-key': key } : {}
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[SerpApi Status Error]', e);
  }
  return { status: 'UNKNOWN', serpApiConfigured: Boolean(getStoredSerpApiKey()) };
}

/**
 * Searches live opportunities by invoking the secure backend pipeline.
 */
export async function searchOpportunities({
  profile,
  activeTrack,
  category = 'ALL',
  location = 'India',
  searchMode = 'PERSONALIZED',
  customQuery = '',
  forceFresh = false
}) {
  const userSerpKey = getStoredSerpApiKey();
  const payload = {
    profile: profile || {},
    activeTrack: activeTrack || { id: 'agentic-ai', name: 'Software & AI Explorer', shortName: 'AI & Web' },
    category,
    location,
    searchMode,
    customQuery,
    serpApiKey: userSerpKey,
    forceFresh
  };

  const headers = { 'Content-Type': 'application/json' };
  if (userSerpKey) {
    headers['x-serpapi-key'] = userSerpKey;
  }

  try {
    const res = await fetch('/api/radar/search', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data && data.success) {
      try {
        sessionStorage.setItem(LAST_SEARCH_CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        // ignore quota
      }
      return data;
    }
    throw new Error(data?.error || 'Search pipeline returned unsuccessful');
  } catch (err) {
    console.warn('[OpportunityService] Backend call failed, trying client fallback:', err.message);

    const { handleOpportunitySearch } = await import('../../../backend/apiRouter.js');
    const fallbackData = await handleOpportunitySearch(payload);
    return fallbackData;
  }
}

/**
 * Directly queries SerpApi-backed AI Chatbot
 */
export async function askSerpApiChatbot({ message, profile, activeTrack }) {
  const userSerpKey = getStoredSerpApiKey();
  const payload = {
    message,
    profile: profile || {},
    activeTrack: activeTrack || { id: 'agentic-ai', name: 'Software & AI Explorer' },
    serpApiKey: userSerpKey
  };

  const headers = { 'Content-Type': 'application/json' };
  if (userSerpKey) {
    headers['x-serpapi-key'] = userSerpKey;
  }

  try {
    const res = await fetch('/api/chat/ask', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[askSerpApiChatbot Backend Error]', err.message);
  }

  // Client-side fallback dynamic import
  try {
    const { handleChatSearch } = await import('../../../backend/apiRouter.js');
    return await handleChatSearch(payload);
  } catch (e) {
    return {
      success: true,
      text: `### 🧭 AI Assistant Notice\nI received your query: "${message}". Please check your internet connection or configure your SerpApi Key in settings for live web results!`,
      sources: []
    };
  }
}

/**
 * Fetches last cached search result from session storage
 */
export function getLastSearchCache() {
  try {
    const raw = sessionStorage.getItem(LAST_SEARCH_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Fetches saved / bookmarked opportunities
 */
export function getSavedOpportunities() {
  try {
    const raw = localStorage.getItem(SAVED_OPPORTUNITIES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves / bookmarks an opportunity
 */
export function saveOpportunity(opportunity) {
  const current = getSavedOpportunities();
  if (current.some(o => o.id === opportunity.id)) return current;
  const updated = [{ ...opportunity, savedAt: new Date().toISOString() }, ...current];
  localStorage.setItem(SAVED_OPPORTUNITIES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Removes a saved opportunity
 */
export function removeSavedOpportunity(id) {
  const current = getSavedOpportunities();
  const updated = current.filter(o => o.id !== id);
  localStorage.setItem(SAVED_OPPORTUNITIES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Checks if an opportunity is saved
 */
export function isOpportunitySaved(id) {
  const current = getSavedOpportunities();
  return current.some(o => o.id === id);
}
