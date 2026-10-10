// ==============================================================================
// OPPRADAR — OPPORTUNITY RADAR (HACKATHONS & INTERNSHIPS FEED)
// White Background + Black Typography + macOS Glass Style + Relevant Color Accents
// Shows: Available Hackathons & Internships, Prominent Eligibility & Direct Redirect Buttons
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Building2, 
  MapPin, 
  Bookmark, 
  RefreshCw, 
  AlertTriangle, 
  GraduationCap,
  ExternalLink,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Globe,
  SlidersHorizontal,
  X,
  Check,
  School,
  Code,
  User,
  ChevronRight,
  Radio,
  Heart,
  Zap,
  Star,
  Compass,
  ShieldCheck
} from 'lucide-react';

import { 
  searchOpportunities, 
  getSavedOpportunities, 
  saveOpportunity, 
  removeSavedOpportunity,
  isOpportunitySaved
} from '../../services/opportunityService';
import OpportunityDetailModal from './OpportunityDetailModal';

export default function OpportunityRadar({
  profile,
  activeTrack,
  currentTab = 'all',
  onOpenAcademicModal,
  onNavigateTab,
  initialSearchIntent,
  searchQuery: externalSearchQuery = ''
}) {
  // ── Category & View State derived from currentTab ──
  const initialCategory = useMemo(() => {
    if (currentTab === 'hackathons') return 'HACKATHON';
    if (currentTab === 'internships') return 'INTERNSHIP';
    return initialSearchIntent?.category || 'ALL';
  }, [currentTab, initialSearchIntent]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || initialSearchIntent?.query || '');
  const [locationQuery, setLocationQuery] = useState(profile?.dream_country || 'India');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('MATCH'); // 'MATCH' | 'DEADLINE' | 'STIPEND' | 'NEWEST'

  // Sync when external search query changes from top header search bar
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Sync when tab switches externally
  useEffect(() => {
    if (currentTab === 'hackathons') {
      setSelectedCategory('HACKATHON');
    } else if (currentTab === 'internships') {
      setSelectedCategory('INTERNSHIP');
    } else if (currentTab === 'all') {
      setSelectedCategory('ALL');
    }
  }, [currentTab]);

  // ── Results & Pipeline State ──
  const [opportunities, setOpportunities] = useState([]);
  const [savedList, setSavedList] = useState(getSavedOpportunities());
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(1);
  const [telemetry, setTelemetry] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // ── Modal State ──
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('DETAILS');

  const handleOpenDetails = (opp) => {
    setSelectedOpportunity(opp);
    setModalTab('DETAILS');
    setIsModalOpen(true);
  };

  const handleOpenWizard = (opp) => {
    setSelectedOpportunity(opp);
    setModalTab('WIZARD');
    setIsModalOpen(true);
  };

  // Loading Stage Sequencer
  useEffect(() => {
    let t1, t2;
    if (loading) {
      setLoadingStage(1);
      t1 = setTimeout(() => setLoadingStage(2), 500);
      t2 = setTimeout(() => setLoadingStage(3), 1000);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  // Execute Search Effect
  useEffect(() => {
    if (currentTab === 'saved') {
      setOpportunities(getSavedOpportunities());
      return;
    }

    if (currentTab === 'profile') {
      return;
    }

    let isMounted = true;
    async function executeSearch() {
      setLoading(true);
      setSearchError(null);
      try {
        const result = await searchOpportunities({
          profile,
          activeTrack,
          category: selectedCategory,
          location: locationQuery,
          searchMode: searchQuery.trim() ? 'EXPLORE' : 'PERSONALIZED',
          customQuery: searchQuery.trim()
        });

        if (isMounted && result) {
          setOpportunities(result.opportunities || []);
          setTelemetry(result.telemetry || null);
          setStats(result.stats || null);
        }
      } catch (err) {
        console.error('[OPPRADAR] Search error:', err);
        if (isMounted) {
          setSearchError(err.message || 'Error connecting to radar. Please retry.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeSearch();
    return () => { isMounted = false; };
  }, [profile, activeTrack, currentTab, selectedCategory, locationQuery]);

  // Manual Search Submit
  const handleManualSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearchError(null);
    try {
      const result = await searchOpportunities({
        profile,
        activeTrack,
        category: selectedCategory,
        location: locationQuery,
        searchMode: searchQuery.trim() ? 'EXPLORE' : 'PERSONALIZED',
        customQuery: searchQuery.trim()
      });
      if (result) {
        setOpportunities(result.opportunities || []);
        setTelemetry(result.telemetry || null);
        setStats(result.stats || null);
      }
    } catch (err) {
      setSearchError(err.message || 'Failed to search live radar.');
    } finally {
      setLoading(false);
    }
  };

  // Live Refresh from SerpApi (bypass cache for guaranteed freshness)
  const handleRefreshLiveRadar = async () => {
    setLoading(true);
    setSearchError(null);
    try {
      const result = await searchOpportunities({
        profile,
        activeTrack,
        category: selectedCategory,
        location: locationQuery,
        searchMode: searchQuery.trim() ? 'EXPLORE' : 'PERSONALIZED',
        customQuery: searchQuery.trim(),
        forceFresh: true
      });
      if (result) {
        setOpportunities(result.opportunities || []);
        setTelemetry(result.telemetry || null);
        setStats(result.stats || null);
      }
    } catch (err) {
      setSearchError(err.message || 'Failed to refresh live radar.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Save
  const handleToggleSave = (opp) => {
    if (isOpportunitySaved(opp.id)) {
      const updated = removeSavedOpportunity(opp.id);
      setSavedList(updated);
      if (currentTab === 'saved') {
        setOpportunities(updated);
      }
    } else {
      const updated = saveOpportunity(opp);
      setSavedList(updated);
    }
  };

  // Filter Pipeline
  const displayedOpportunities = useMemo(() => {
    let list = currentTab === 'saved' ? savedList : opportunities;

    // Filter by category if not 'ALL' and not on 'saved'
    if (currentTab !== 'saved' && selectedCategory !== 'ALL') {
      if (selectedCategory === 'HACKATHON') {
        list = list.filter(o => o.category === 'HACKATHON' || o.category === 'COMPETITION');
      } else {
        list = list.filter(o => o.category === selectedCategory);
      }
    }

    // Filter by match score
    if (minMatchScore > 0) {
      list = list.filter(o => (o.matchScore || 85) >= minMatchScore);
    }

    // Filter remote
    if (onlyRemote) {
      list = list.filter(o => o.remote === true);
    }

    // Filter query on client side for instantaneous feedback across all tabs
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
        (o.title || '').toLowerCase().includes(q) ||
        (o.organization || '').toLowerCase().includes(q) ||
        (o.description || '').toLowerCase().includes(q) ||
        (o.eligibility || '').toLowerCase().includes(q) ||
        (o.skills || []).some(s => (s || '').toLowerCase().includes(q))
      );
    }

    // Sort opportunities (Amazon / Flipkart style)
    if (sortBy === 'DEADLINE') {
      list = [...list].sort((a, b) => (a.daysLeft || 999) - (b.daysLeft || 999));
    } else if (sortBy === 'STIPEND') {
      list = [...list].sort((a, b) => (b.stipendOrPrize ? 1 : 0) - (a.stipendOrPrize ? 1 : 0) || (b.matchScore - a.matchScore));
    } else if (sortBy === 'NEWEST') {
      list = [...list].sort((a, b) => (b.discoveredAt || '').localeCompare(a.discoveredAt || ''));
    } else {
      list = [...list].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return list;
  }, [opportunities, savedList, currentTab, selectedCategory, minMatchScore, onlyRemote, searchQuery, sortBy]);

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER: PROFILE & ACADEMIC TAB
  // ────────────────────────────────────────────────────────────────────────────
  if (currentTab === 'profile') {
    const userDegree = profile?.degree || 'B.Tech / B.E. (Bachelor of Technology)';
    const userCollege = profile?.college || 'University Engineering College';
    const userBranch = profile?.branch || 'Computer Science & Engineering';
    const userYear = profile?.yearOfStudy || '3rd Year (Pre-Final)';
    const userSkills = profile?.skills || ['Python', 'JavaScript', 'React', 'Problem Solving'];

    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>
        {/* Profile Card */}
        <div className="macos-glass-card" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'var(--bg-core)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800
              }}>
                {(profile?.full_name || profile?.username || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {profile?.full_name || 'Student Explorer'}
                </h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <School style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                  <span>{userCollege}</span>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'var(--bg-glass-input)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginTop: '4px'
                }}>
                  OPPRADAR • Powered by Samrat
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAcademicModal}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'var(--primary)',
                color: 'var(--bg-core)',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px var(--shadow-sm)'
              }}
            >
              <span>Edit Academic Details</span>
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Academic Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-glass-input)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Degree Program</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{userDegree}</div>
            </div>

            <div style={{ background: 'var(--bg-glass-input)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Branch / Major</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{userBranch}</div>
            </div>

            <div style={{ background: 'var(--bg-glass-input)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Year of Study</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{userYear}</div>
            </div>
          </div>

          {/* Skills Section */}
          <div style={{ background: 'var(--bg-glass-input)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <Code style={{ width: '16px', height: '16px', color: 'var(--text-primary)' }} />
                <span>Known Skills ({userSkills.length})</span>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Matched against live web hackathons & internships
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {userSkills.map(skill => (
                <span
                  key={skill}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Check style={{ width: '13px', height: '13px', color: 'var(--text-primary)' }} />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Direct Shortcut to Opportunities */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateTab('hackathons')}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: '14px',
                background: 'var(--primary)',
                color: 'var(--bg-core)',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Explore Available Hackathons</span>
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>

            <button
              onClick={() => onNavigateTab('internships')}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: '14px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Explore Available Internships</span>
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  // RENDER: OPPORTUNITIES FEED (AMAZON / FLIPKART MOBILE OVERVIEW)
  // ────────────────────────────────────────────────────────────────────────────
  const topDeal = displayedOpportunities.length > 0 && currentTab !== 'saved' && !searchQuery.trim() ? displayedOpportunities[0] : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 0.75rem 6.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* ── 1. USER MINI-PROFILE ROW (Matches Page 3 Screen 1) ── */}
      <div 
        className="macos-glass-card"
        style={{
          padding: '1rem 1.15rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Student Avatar"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #2563eb',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {profile?.full_name || 'Aditya Sharma'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{profile?.branch || 'Computer Science & Engineering'}</span>
                <span>•</span>
                <span>{profile?.yearOfStudy || '3rd Year (Junior)'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAcademicModal}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-glass-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            Edit Profile
          </button>
        </div>

        {/* Quick Action Pills: My resume, Deadlines, Saved (Matches Page 3 Screen 1) */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab('profile')}
            style={{
              flex: 1,
              minWidth: '95px',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-glass-input)',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>📄 My resume</span>
          </button>

          <button
            onClick={() => setSortBy('DEADLINE')}
            style={{
              flex: 1,
              minWidth: '95px',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              border: sortBy === 'DEADLINE' ? '1.5px solid #2563eb' : '1px solid var(--border-subtle)',
              backgroundColor: sortBy === 'DEADLINE' ? '#eff6ff' : 'var(--bg-glass-input)',
              color: sortBy === 'DEADLINE' ? '#2563eb' : 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>📅 Deadlines</span>
          </button>

          <button
            onClick={() => onNavigateTab('saved')}
            style={{
              flex: 1,
              minWidth: '95px',
              padding: '0.5rem 0.75rem',
              borderRadius: '12px',
              border: currentTab === 'saved' ? '1.5px solid #2563eb' : '1px solid var(--border-subtle)',
              backgroundColor: currentTab === 'saved' ? '#eff6ff' : 'var(--bg-glass-input)',
              color: currentTab === 'saved' ? '#2563eb' : 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>🔖 Saved ({savedList.length})</span>
          </button>
        </div>
      </div>

      {/* ── 2. FEATURED VACANCIES RAIL (Matches Page 3 Screen 1) ── */}
      {displayedOpportunities.length > 0 && currentTab !== 'saved' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Featured vacancies
            </span>
            <span 
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer' }}
            >
              All
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {displayedOpportunities.slice(0, 2).map((item) => (
              <div
                key={`feat-${item.id}`}
                onClick={() => handleOpenDetails(item)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: item.category === 'HACKATHON' ? '#eff6ff' : '#ecfdf5',
                    color: item.category === 'HACKATHON' ? '#2563eb' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900
                  }}>
                    {item.category === 'HACKATHON' ? '🏆' : '💼'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(item);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isOpportunitySaved(item.id) ? '#2563eb' : '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  >
                    <Bookmark style={{ width: '16px', height: '16px', fill: isOpportunitySaved(item.id) ? '#2563eb' : 'none' }} />
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.remote ? 'Remote' : (item.location || 'India')}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>
                    {item.matchScore}% Match
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {item.organization}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. MOST ACTIVE COMPANIES RAIL (Matches Page 3 Screen 1) ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Most active companies
          </span>
          <span 
            onClick={() => setSearchQuery('Google')}
            style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer' }}
          >
            All
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { name: 'Google', role: 'AI & Cloud', color: '#ea4335', letter: 'G' },
            { name: 'AICTE SIH', role: 'Hackathons', color: '#7c3aed', letter: 'S' },
            { name: 'Sarvam AI', role: 'GenAI & LLMs', color: '#2563eb', letter: 'S' },
            { name: 'Microsoft', role: 'Software', color: '#0284c7', letter: 'M' },
            { name: 'Unstop', role: 'Challenges', color: '#059669', letter: 'U' },
            { name: 'UI-Pro', role: 'Design & UX', color: '#d97706', letter: 'U' }
          ].map(comp => (
            <div
              key={comp.name}
              onClick={() => {
                setSearchQuery(comp.name);
                setSelectedCategory('ALL');
              }}
              style={{
                flexShrink: 0,
                width: '110px',
                padding: '0.75rem',
                borderRadius: '16px',
                backgroundColor: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-subtle, #e2e8f0)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: comp.color,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem'
              }}>
                {comp.letter}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {comp.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {comp.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. YOUTUBE STYLE CATEGORY FILTER CHIPS ── */}
      <div className="yt-chip-bar">
        {/* YouTube Explore Compass Chip */}
        <button
          type="button"
          className={`yt-explore-chip ${selectedCategory === 'ALL' && !searchQuery ? 'active' : ''}`}
          onClick={() => {
            setSelectedCategory('ALL');
            setSearchQuery('');
            onNavigateTab('all');
          }}
          title="Explore All Categories"
          aria-label="Explore"
        >
          <Compass style={{ width: '16px', height: '16px' }} />
        </button>

        {[
          { label: 'All', category: 'ALL', query: '' },
          { label: 'Hackathons', category: 'HACKATHON', query: '' },
          { label: 'Internships', category: 'INTERNSHIP', query: '' },
          { label: 'AI & GenAI', category: 'ALL', query: 'AI' },
          { label: 'High Stipend', category: 'ALL', query: 'Stipend' },
          { label: 'Closing Soon', category: 'ALL', query: 'Closing Soon' }
        ].map(item => {
          const isActive = (item.category === selectedCategory && (!item.query || searchQuery === item.query));
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setSelectedCategory(item.category);
                setSearchQuery(item.query);
                if (item.category === 'HACKATHON') onNavigateTab('hackathons');
                else if (item.category === 'INTERNSHIP') onNavigateTab('internships');
                else onNavigateTab('all');
              }}
              className={`yt-chip ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. AMAZON SEARCH RESULTS TOOLBAR (Count, Sort, Remote, Refresh) ── */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '0.55rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {displayedOpportunities.length} Opportunities
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                background: 'var(--bg-glass-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="MATCH">⚡ Best Match</option>
              <option value="DEADLINE">⏳ Last Date (Urgent)</option>
              <option value="STIPEND">💰 Highest Prize / Stipend</option>
              <option value="NEWEST">🆕 Newest</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700 }}>
            <input
              type="checkbox"
              checked={onlyRemote}
              onChange={e => setOnlyRemote(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Remote</span>
          </label>

          <button
            type="button"
            onClick={handleRefreshLiveRadar}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-glass-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Refresh live from SerpApi"
          >
            <RefreshCw style={{ width: '11px', height: '11px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Live Sync</span>
          </button>
        </div>
      </div>

      {/* ── 4. LOADING STATE ── */}
      {loading && (
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <RefreshCw style={{ width: '28px', height: '28px', color: 'var(--text-primary)', animation: 'spin 1.2s linear infinite' }} />
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {loadingStage === 1 && 'Scanning live portals with SerpApi...'}
              {loadingStage === 2 && 'Matching academic degrees & graduation years...'}
              {loadingStage === 3 && 'Arranging live hackathons & internships...'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Real-time Google search telemetry pipeline active
            </div>
          </div>
        </div>
      )}

      {/* ── 5. ERROR STATE ── */}
      {searchError && !loading && (
        <div style={{
          background: 'var(--bg-glass-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          textAlign: 'center'
        }}>
          <AlertTriangle style={{ width: '28px', height: '28px', color: 'var(--text-primary)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{searchError}</div>
          <button onClick={handleManualSearch} style={{ marginTop: '0.75rem', padding: '0.4rem 0.95rem', borderRadius: '9999px', background: 'var(--primary)', color: 'var(--bg-core)', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Retry Search
          </button>
        </div>
      )}

      {/* ── 6. EMPTY STATE ── */}
      {!loading && displayedOpportunities.length === 0 && (
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '3rem 1.5rem',
          textAlign: 'center'
        }}>
          <Search style={{ width: '36px', height: '36px', color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
            {currentTab === 'saved' ? 'No saved items in your Wishlist' : 'No matching opportunities found'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
            {currentTab === 'saved' 
              ? 'Click the heart icon on any hackathon or internship to save it to your wishlist.' 
              : 'Try selecting a different category or clearing search filters.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setMinMatchScore(0); setOnlyRemote(false); onNavigateTab('all'); }}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '9999px',
              background: 'var(--primary)',
              color: 'var(--bg-core)',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── 7. OPPORTUNITIES FEED & HIGH-CONVERSION OPPORTUNITY CARDS ── */}
      {!loading && displayedOpportunities.length > 0 && (
        <div className="amazon-overview-grid">
          {displayedOpportunities.map(opp => {
            const isSaved = isOpportunitySaved(opp.id);
            const score = opp.matchScore || 85;
            const isHackathon = opp.category === 'HACKATHON';

            return (
              <div
                key={opp.id}
                onClick={() => handleOpenDetails(opp)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.07)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* 1. Header Badges: Match % Score, Expiration Countdown, Category & Wishlist */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {/* Match Score Badge */}
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '0.22rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles style={{ width: '12px', height: '12px' }} />
                      <span>{score}% Match</span>
                    </span>

                    {/* Expiration Countdown Badge */}
                    <span style={{
                      backgroundColor: '#fff7ed',
                      color: '#c2410c',
                      border: '1px solid #fed7aa',
                      padding: '0.22rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      <span>{opp.daysLeft ? `⏳ ${opp.daysLeft}d left` : 'Active'}</span>
                    </span>

                    {/* Category Pill */}
                    <span style={{
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      padding: '0.22rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {isHackathon ? '🏆 Hackathon' : '💼 Internship'}
                    </span>
                  </div>

                  {/* Bookmark Heart / Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(opp);
                    }}
                    style={{
                      background: isSaved ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${isSaved ? '#fecaca' : '#e2e8f0'}`,
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isSaved ? '#ef4444' : '#94a3b8',
                      transition: 'transform 0.15s ease'
                    }}
                    title={isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart style={{ width: '15px', height: '15px', fill: isSaved ? '#ef4444' : 'none' }} />
                  </button>
                </div>

                {/* 2. Organization Host & Verified Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#64748b' }}>
                  <Building2 style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                  <span style={{ color: '#0f172a', fontWeight: 800 }}>{opp.organization}</span>
                  <span>•</span>
                  <span>{opp.location || 'Remote / Online'}</span>
                  <span style={{ color: '#16a34a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck style={{ width: '13px', height: '13px' }} />
                    Verified
                  </span>
                </div>

                {/* 3. Title */}
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {opp.title}
                </h3>

                {/* 4. Academic Fit & Ratings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.85rem' }}>
                    ★★★★★
                  </div>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>4.9</span>
                  <span style={{ color: '#64748b' }}>
                    • Verified fit for {profile?.degree ? profile.degree.split('(')[0].trim() : 'Undergraduate'} ({profile?.branch || 'Engineering'})
                  </span>
                </div>

                {/* 5. Award / Stipend Banner */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}>
                  <span style={{ fontWeight: 900, color: '#15803d' }}>
                    {opp.stipendOrPrize || 'Placement Opportunity'}
                  </span>
                  <span style={{ color: '#166534', fontSize: '0.72rem', fontWeight: 700 }}>
                    {isHackathon ? 'Prize Pool' : 'Monthly Stipend'}
                  </span>
                </div>

                {/* 6. Deadline info */}
                <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock style={{ width: '13px', height: '13px', color: '#c2410c' }} />
                  <span><strong>Last Date to Apply:</strong> {opp.lastApplicationDate || 'Open enrollment'}</span>
                </div>

                {/* 7. Academic Eligibility Specs */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  color: '#334155'
                }}>
                  <GraduationCap style={{ width: '14px', height: '14px', flexShrink: 0, color: '#2563eb' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong>Eligibility:</strong> {opp.eligibility}
                  </span>
                </div>

                {/* 8. Skills pills */}
                {opp.skills && opp.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {opp.skills.slice(0, 3).map(skill => (
                      <span key={skill} style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* 9. Action Buttons: Direct Apply (#2563EB) & Step-by-Step Guidance Wizard (#F97316) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {/* Direct Apply Trigger Button (Vibrant Blue #2563EB) */}
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="btn-primary-blue"
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      borderRadius: '8px',
                      padding: '0.62rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>Direct Apply</span>
                    <ArrowUpRight style={{ width: '14px', height: '14px' }} />
                  </a>

                  {/* Step-by-Step Application Guidance Wizard Trigger (Vibrant Orange #F97316) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenWizard(opp);
                    }}
                    className="btn-primary-orange"
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      borderRadius: '8px',
                      padding: '0.62rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    <span>Apply Wizard</span>
                  </button>

                  {/* Quick Details Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(opp);
                    }}
                    className="btn-outline-slate"
                    style={{
                      borderRadius: '8px',
                      padding: '0.62rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                    title="View Full Details"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 8. OPPORTUNITY DETAIL & APPLICATION GUIDANCE MODAL ── */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSaved={selectedOpportunity ? isOpportunitySaved(selectedOpportunity.id) : false}
        onToggleSave={handleToggleSave}
        initialTab={modalTab}
      />
    </div>
  );
}
