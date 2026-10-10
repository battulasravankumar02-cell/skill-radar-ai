// ==============================================================================
// OPPRADAR — MOBILE APPLICATION (Amazon / Flipkart / Apple Form Factor)
// Executive Monochrome + macOS Frosted Glass + Fixed Bottom Navigation
// "Discover. Explore. Act." • Powered by Samrat
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Trophy, 
  Briefcase, 
  Bookmark, 
  SlidersHorizontal,
  Search,
  X,
  Sun,
  Moon,
  Sparkles,
  Globe,
  GraduationCap,
  MessageSquarePlus,
  ArrowRight,
  School,
  Code,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Key,
  Award,
  Menu
} from 'lucide-react';

import { getProfile, saveProfile } from './services/storageService';
import { getSavedOpportunities, getStoredSerpApiKey } from './services/opportunityService';
import OpportunityRadar from './components/OpportunityRadar/OpportunityRadar';
import AwardsScholarshipsView from './components/Scholarships/AwardsScholarshipsView';
import AcademicSkillsOnboardingModal from './components/Onboarding/AcademicSkillsOnboardingModal';
import SerpApiKeyModal from './components/common/SerpApiKeyModal';
import LandingGateway from './components/Landing/LandingGateway';
import ChatDrawer from './components/Chat/ChatDrawer';
import OppRadarLogo, { OppRadarTieIcon } from './components/common/OppRadarLogo';
import AppCoverModal from './components/common/AppCoverModal';
import { getInitialAppScreen, isInstalledApp, clearAuthSession, setInstalledAppFlag } from './services/authModeService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[OPPRADAR ErrorBoundary caught error]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#ffffff', color: '#0f172a' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Radar Feed Temporarily Paused</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{this.state.error?.message || 'A temporary component issue occurred.'}</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Reload Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // ── Screen Router: 'landing' (Launching Gateway) | 'app' (Workspace) ──
  // Web Browser visits: prompted to sign in or register on every application open
  // Installed App (Mobile or Laptop): signs in once, credentials saved, opens directly without sign in
  const [currentScreen, setCurrentScreen] = useState(() => getInitialAppScreen());

  // ── Navigation State: 6 Clean Bottom Tabs ──
  // 'all' | 'hackathons' | 'internships' | 'scholarships' | 'saved' | 'settings'
  const [activeTab, setActiveTab] = useState('all');

  // ── Search Query State & Toggle (Magnifying glass symbol only by default) ──
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ── Enforce Pristine Light Theme (#FFFFFF) ──
  const [theme, setTheme] = useState('light');

  // ── User Profile State ──
  const [profile, setProfile] = useState(null);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAppCoverOpen, setIsAppCoverOpen] = useState(false);
  const [hasSerpKey, setHasSerpKey] = useState(Boolean(getStoredSerpApiKey()));
  const [savedCount, setSavedCount] = useState(() => getSavedOpportunities().length);
  const [landingSearchIntent, setLandingSearchIntent] = useState(null);

  // Apply light theme to document element and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('oppradar_theme', 'light');
  }, []);

  // Sync saved count periodically
  useEffect(() => {
    const updateCount = () => setSavedCount(getSavedOpportunities().length);
    updateCount();
    const interval = setInterval(updateCount, 1500);
    return () => clearInterval(interval);
  }, []);

  // Toggle or set theme
  const toggleTheme = (newTheme) => {
    const nextTheme = newTheme || (theme === 'light' ? 'light' : 'light');
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('oppradar_theme', 'light');
  };

  // Load profile on initial mount & check for first-time academic onboarding
  useEffect(() => {
    async function loadInitialData() {
      const p = await getProfile();
      setProfile(p);
      
      // The user must be asked their academic and skill details before using the app
      const isOnboarded = localStorage.getItem('oppradar_onboarded_completed') === 'true';
      if (!isOnboarded) {
        setIsAcademicModalOpen(true);
      }
    }
    loadInitialData();
  }, []);

  // Save profile handler
  const handleSaveProfile = async (updatedProfile) => {
    const saved = await saveProfile(updatedProfile);
    setProfile(saved);
    localStorage.setItem('oppradar_onboarded_completed', 'true');
    setIsAcademicModalOpen(false);
    // STEP 3: Home tab opens with Radar opportunities!
    setActiveTab('all');
    setCurrentScreen('app');
  };

  // ────────────────────────────────────────────────────────────────────────────
  // SCREEN 1: LAUNCHING / LANDING PAGE (First it shows like this: Welcome, Sign In, Register)
  // ────────────────────────────────────────────────────────────────────────────
  if (currentScreen === 'landing') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        <LandingGateway
          onEnterApp={(targetTab) => {
            setActiveTab(targetTab || 'all');
            // STEP 2: The user has to fill details like academics and skills known!
            setCurrentScreen('onboarding');
          }}
          onQuickSearch={({ query, category }) => {
            setLandingSearchIntent({ query, category });
            setSearchQuery(query || '');
            setActiveTab(category === 'HACKATHON' ? 'hackathons' : category === 'INTERNSHIP' ? 'internships' : 'all');
            setCurrentScreen('onboarding');
          }}
          onOpenAcademicModal={() => setCurrentScreen('onboarding')}
          onOpenAppCover={() => setIsAppCoverOpen(true)}
          onSaveProfile={handleSaveProfile}
          profile={profile}
        />

        <AppCoverModal
          isOpen={isAppCoverOpen}
          onClose={() => setIsAppCoverOpen(false)}
        />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SCREEN 2: ACADEMIC & SKILLS ONBOARDING (User fills academics & skills known)
  // ────────────────────────────────────────────────────────────────────────────
  if (currentScreen === 'onboarding') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <AcademicSkillsOnboardingModal
          isOpen={true}
          onClose={() => {
            // After completing or dismissing, proceed to Home tab
            setActiveTab('all');
            setCurrentScreen('app');
          }}
          onSave={handleSaveProfile}
          initialProfile={profile}
        />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SCREEN 2: MOBILE APPLICATION (Amazon / Flipkart / Apple Form Factor)
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh',
      height: '100dvh',
      maxHeight: '100dvh',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ================================================================ */}
      {/* 1. TOP MOBILE APPLICATION HEADER (Magnifying Glass + Logo + Menu)  */}
      {/* ================================================================ */}
      <header 
        className="mobile-app-header"
        style={{
          padding: '0.65rem 1rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          flexShrink: 0,
          zIndex: 100
        }}
      >
        {/* ROW 1: Brand Logo on left, Search Magnifying Glass & Settings on right */}
        {isSearchActive ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #2563eb',
              borderRadius: '9999px',
              padding: '0.45rem 0.85rem',
              gap: '0.5rem'
            }}>
              <Search style={{ width: '16px', height: '16px', color: '#2563eb', flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                placeholder={
                  activeTab === 'hackathons'
                    ? 'Search hackathons (AI, Web3, Smart India...)'
                    : activeTab === 'internships'
                    ? 'Search internships (Python, Frontend, ML...)'
                    : 'Search hackathons & internships...'
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab === 'settings') setActiveTab('all');
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title="Clear search"
                >
                  <X style={{ width: '15px', height: '15px' }} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSearchActive(false);
                setSearchQuery('');
              }}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem' }}>
            {/* Brand Logo + 'Powered by Samrat' on left */}
            <div 
              onClick={() => setIsAppCoverOpen(true)} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="OPPRADAR AI • Tap to preview Mobile App Cover & Download"
            >
              <OppRadarLogo size="sm" showWordmark={true} showPoweredBy={true} />
            </div>

            {/* Actions on right: Magnifying glass symbol + Settings menu button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {/* THE MAGNIFYING GLASS SYMBOL */}
              <button
                type="button"
                onClick={() => setIsSearchActive(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: searchQuery ? '#eff6ff' : '#ffffff',
                  border: `1.5px solid ${searchQuery ? '#2563eb' : '#e2e8f0'}`,
                  color: searchQuery ? '#2563eb' : '#0f172a',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                title="Search Hackathons & Internships"
                aria-label="Search"
              >
                <Search style={{ width: '18px', height: '18px', strokeWidth: 2.2 }} />
              </button>

              {/* Settings button on the top right side: Three lines (Menu) */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'settings' ? 'all' : 'settings')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: activeTab === 'settings' ? '#eff6ff' : '#ffffff',
                  border: `1.5px solid ${activeTab === 'settings' ? '#2563eb' : '#e2e8f0'}`,
                  color: activeTab === 'settings' ? '#2563eb' : '#0f172a',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                title={activeTab === 'settings' ? 'Close Settings' : 'Open Settings & Preferences'}
                aria-label="Settings"
              >
                <Menu style={{ width: '20px', height: '20px', strokeWidth: 2.2 }} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* 2. MAIN APP CONTENT (Scrollable middle container)                */}
      {/* ================================================================ */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '1.5rem'
      }}>
        
        {/* VIEW 1: SETTINGS TAB (Includes Light Mode / Dark Mode) */}
        {activeTab === 'settings' ? (
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.25rem 1rem 6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Header */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Settings & Preferences
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Configure theme appearance, academic criteria, and live platform settings
              </p>
            </div>

            {/* SECTION 1: APPEARANCE (Light Mode / Dark Mode Switcher) */}
            <div className="macos-glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Theme Appearance
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Choose between high-contrast crisp light mode or obsidian frosted glass dark mode.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.35rem' }}>
                {/* Option 1: Light Mode */}
                <div
                  onClick={() => toggleTheme('light')}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: theme === 'light' ? 'var(--bg-glass-input)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e4e4e7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <Sun style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>Light Mode</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Crisp white & executive zinc</div>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--bg-core)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check style={{ width: '12px', height: '12px', strokeWidth: 3 }} />
                    </div>
                  )}
                </div>

                {/* Option 2: Dark Mode */}
                <div
                  onClick={() => toggleTheme('dark')}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: theme === 'dark' ? 'var(--bg-glass-input)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      border: '1px solid #27272a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                      <Moon style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>Dark Mode</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Obsidian glass with contrast</div>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--bg-core)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check style={{ width: '12px', height: '12px', strokeWidth: 3 }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC PROFILE & SKILLS */}
            <div className="macos-glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Academic Profile & Known Skills
                </div>
                <button
                  onClick={() => setIsAcademicModalOpen(true)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--bg-core)',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                <div style={{ background: 'var(--bg-glass-input)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Degree</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {profile?.degree || 'B.Tech / B.E.'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass-input)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Year</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {profile?.yearOfStudy || '3rd Year'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass-input)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>College</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {profile?.college || 'University'}
                  </div>
                </div>
              </div>

              {profile?.skills && profile.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {profile.skills.map(s => (
                    <span key={s} style={{
                      background: 'var(--bg-glass-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: SERPAPI REAL-TIME WEB ENGINE CONFIGURATION */}
            <div className="macos-glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}>
                    <Radio style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      SerpApi Web Intelligence Engine
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      100% Automated • Live Google Search & Google Jobs Pipeline
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--bg-core)',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Key style={{ width: '14px', height: '14px' }} />
                  <span>Manage API Key</span>
                </button>
              </div>

              <div style={{
                background: 'var(--bg-glass-input)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: hasSerpKey ? '#10b981' : '#3b82f6',
                    boxShadow: `0 0 8px ${hasSerpKey ? '#10b981' : '#3b82f6'}`
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {hasSerpKey ? 'Custom SerpApi Key Active' : 'Live SerpApi Pipeline Ready'}
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {hasSerpKey ? 'Key: ••••••••••••••••' : 'India Hackathon 2026 Engine'}
                </span>
              </div>
            </div>

            {/* SECTION 4: OPPRADAR AI MOBILE APP & COVER PREVIEW */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #00a4e4',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              boxShadow: '0 4px 16px rgba(0, 164, 228, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <OppRadarTieIcon size={34} />
                </div>
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a' }}>
                    OPPRADAR AI Mobile App
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                    Official standalone app icon, cover & Home Screen install
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAppCoverOpen(true)}
                style={{
                  padding: '0.52rem 1.15rem',
                  borderRadius: '9999px',
                  backgroundColor: '#00a4e4',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0, 164, 228, 0.28)'
                }}
              >
                <span>Preview & Install</span>
              </button>
            </div>

            {/* SECTION 5: ACCOUNT MANAGEMENT & SIGN OUT */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                    Account Session & Device Mode
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {localStorage.getItem('oppradar_user_email') || profile?.email || 'Logged in as student'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      clearAuthSession();
                      setCurrentScreen('landing');
                    }}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '9999px',
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca',
                      fontSize: '0.80rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Log Out / Switch Account
                  </button>
                </div>
              </div>

              {/* Device Mode Status Box */}
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: isInstalledApp() ? '#f0fdf4' : '#f8fafc',
                border: `1.5px solid ${isInstalledApp() ? '#bbf7d0' : '#e2e8f0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isInstalledApp() ? '#15803d' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{isInstalledApp() ? '📱 Installed App Mode Active' : '🌐 Web Browser Mode Active'}</span>
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                    {isInstalledApp() 
                      ? 'Your username & password are saved. Subsequent launches open directly without sign-in!' 
                      : 'Browsing in normal web tab. You will be prompted to sign in whenever you open this site.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextInstalled = !isInstalledApp();
                    setInstalledAppFlag(nextInstalled);
                    alert(nextInstalled 
                      ? '✓ Installed App Mode ACTIVATED on this device!\n\nYour username and password are saved. The next time you open OPPRADAR, you will enter directly into the app without signing in!'
                      : '✓ Web Browser Mode ACTIVATED.\n\nYou will be asked to sign in whenever you open the site.');
                    // force re-render
                    setTheme(t => t);
                  }}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isInstalledApp() ? '#ffffff' : '#0284c7',
                    color: isInstalledApp() ? '#374151' : '#ffffff',
                    border: isInstalledApp() ? '1px solid #cbd5e1' : 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isInstalledApp() ? 'Test Browser Mode' : 'Switch to Installed App Mode'}
                </button>
              </div>
            </div>

            {/* SECTION 5: INTELLIGENCE ENGINE & ATTRIBUTION */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <OppRadarLogo size="md" showWordmark={true} showPoweredBy={true} />
              <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '380px' }}>
                Connected to SerpApi Real-Time Web Intelligence Pipeline. Real-time opportunity discovery and eligibility ranking.
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                OPPRADAR v2.5 • Executive Build 2026
              </div>
            </div>

          </div>
        ) : activeTab === 'scholarships' ? (
          /* VIEW 2: SCREEN 4 (AWARDS & SCHOLARSHIPS HUB) */
          <ErrorBoundary>
            <AwardsScholarshipsView
              profile={profile}
              onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
            />
          </ErrorBoundary>
        ) : (
          /* VIEW 3: OPPORTUNITIES FEED (RADAR / HACKATHONS / INTERNSHIPS / SAVED) */
          <ErrorBoundary>
            <OpportunityRadar
              profile={profile}
              activeTrack={{ id: 'agentic-ai', name: 'Software & AI Explorer', shortName: 'AI & Web' }}
              currentTab={activeTab}
              searchQuery={searchQuery}
              onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              initialSearchIntent={landingSearchIntent}
            />
          </ErrorBoundary>
        )}
      </main>

      {/* ================================================================ */}
      {/* 3. YOUTUBE STYLE BOTTOM NAVIGATION BAR (Exact OppRadar Tabs & Icons) */}
      {/* ================================================================ */}
      <nav 
        className="mobile-app-bottom-bar"
        aria-label="YouTube Style Bottom Navigation Bar"
      >
        {/* TAB 1: RADAR */}
        <button
          className={`mobile-app-bottom-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          aria-label="Radar"
        >
          <div className="tab-icon-pill">
            <Radio />
          </div>
          <span>Radar</span>
        </button>

        {/* TAB 2: HACKATHONS */}
        <button
          className={`mobile-app-bottom-item ${activeTab === 'hackathons' ? 'active' : ''}`}
          onClick={() => setActiveTab('hackathons')}
          aria-label="Hackathons"
        >
          <div className="tab-icon-pill">
            <Trophy />
          </div>
          <span>Hackathons</span>
        </button>

        {/* TAB 3: INTERNSHIPS */}
        <button
          className={`mobile-app-bottom-item ${activeTab === 'internships' ? 'active' : ''}`}
          onClick={() => setActiveTab('internships')}
          aria-label="Internships"
        >
          <div className="tab-icon-pill">
            <Briefcase />
          </div>
          <span>Internships</span>
        </button>

        {/* TAB 4: SCHOLARSHIPS (SCREEN 4) */}
        <button
          className={`mobile-app-bottom-item ${activeTab === 'scholarships' ? 'active' : ''}`}
          onClick={() => setActiveTab('scholarships')}
          aria-label="Awards & Scholarships"
        >
          <div className="tab-icon-pill">
            <GraduationCap />
          </div>
          <span>Scholarships</span>
        </button>

        {/* TAB 5: SAVED */}
        <button
          className={`mobile-app-bottom-item ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
          aria-label="Saved Bookmarks"
        >
          <div className="tab-icon-pill">
            <Bookmark />
            {savedCount > 0 && (
              <span className="yt-tab-badge">
                {savedCount}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>
      </nav>

      {/* ================================================================ */}
      {/* 4. CHAT BOT DRAWER & HOLOGRAPHIC RADAR AI ORB (SerpApi Powered)  */}
      {/* ================================================================ */}
      <ChatDrawer
        profile={profile}
        activeTrack={{ id: 'agentic-ai', name: 'Software & AI Explorer', shortName: 'AI & Web' }}
        onNavigateTab={(tab) => setActiveTab(tab)}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />

      {/* ================================================================ */}
      {/* 5. ACADEMIC & SKILLS ONBOARDING MODAL                            */}
      {/* ================================================================ */}
      <AcademicSkillsOnboardingModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={profile}
      />

      {/* ================================================================ */}
      {/* 6. SERPAPI KEY MANAGEMENT MODAL                                  */}
      {/* ================================================================ */}
      <SerpApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => {
          setIsKeyModalOpen(false);
          setHasSerpKey(Boolean(getStoredSerpApiKey()));
        }}
        onKeySaved={() => {
          setHasSerpKey(true);
        }}
      />

      {/* ================================================================ */}
      {/* 7. OPPRADAR AI MOBILE APP COVER & PWA INSTALL MODAL              */}
      {/* ================================================================ */}
      <AppCoverModal
        isOpen={isAppCoverOpen}
        onClose={() => setIsAppCoverOpen(false)}
      />
    </div>
  );
}

