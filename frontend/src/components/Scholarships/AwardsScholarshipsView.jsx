// ==============================================================================
// OPPRADAR — SCREEN 4: AWARDS & SCHOLARSHIPS HUB
// Clean, Breathable Light Theme (#FFFFFF + #E2E8F0 + #1E293B)
// Dedicated Scholarship & Research Grant Discovery View with:
// - Saved Preferences
// - Verified Partner Tags (Goodwall, DNP Foundation, AICTE, MeitY)
// - Expiration Countdown Badges
// - Match Percentage Scores
// - Direct Apply Triggers & Guidance Wizards
// ==============================================================================

import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  MapPin, 
  ArrowUpRight, 
  SlidersHorizontal,
  CheckCircle2,
  Filter,
  DollarSign,
  Trophy,
  BookOpen,
  Calendar,
  Share2
} from 'lucide-react';

export const SCHOLARSHIPS_DATA = [
  {
    id: 'sch-1',
    title: '$1000 Member of the Month Award',
    organization: 'Goodwall',
    verifiedPartner: 'Goodwall Verified Partner',
    category: 'SCHOLARSHIP',
    awardAmount: '$1,000 USD',
    awardType: 'Cash Grant & Mentorship',
    location: 'Global / Online',
    deadline: '2026-10-31',
    daysLeft: 14,
    deadlineUrgency: 'URGENT',
    matchScore: 98,
    eligibility: 'Open to all enrolled undergraduate students (1st to 4th year across all branches).',
    description: 'We are on a global mission to recognize and fund ambitious students around the world who are creating real-world software, community initiatives, or research solutions.',
    skills: ['Problem Solving', 'Leadership', 'Innovation', 'Project Execution'],
    url: 'https://www.goodwall.io/',
    requirements: [
      'Must be currently enrolled in an accredited undergraduate program',
      'Submit a 1-page summary or working demo of an active academic project',
      'Valid student email identification'
    ]
  },
  {
    id: 'sch-2',
    title: 'Graphic Culture & Human-Centered Tech Grant',
    organization: 'DNP Foundation for Cultural Promotion',
    verifiedPartner: 'DNP Foundation',
    category: 'RESEARCH_GRANT',
    awardAmount: '$4,500 USD',
    awardType: 'Research Grant',
    location: 'International / Remote',
    deadline: '2026-11-15',
    daysLeft: 22,
    deadlineUrgency: 'NORMAL',
    matchScore: 95,
    eligibility: 'Undergraduate and postgraduate students in Computer Science, HCI, Design & AI.',
    description: 'DNP Foundation provides grants to research projects exploring human-computer interaction, creative interfaces, and graphical intelligence in the modern digital age.',
    skills: ['UI/UX Design', 'Frontend Development', 'Research', 'Human-Computer Interaction'],
    url: 'https://www.dnpf-foundation.or.jp/en/',
    requirements: [
      'Research proposal outline (max 1000 words)',
      'Portfolio link or prototype repository',
      'Faculty recommendation letter or department endorsement'
    ]
  },
  {
    id: 'sch-3',
    title: 'National AI & DeepTech Innovation Grant 2026',
    organization: 'Ministry of Electronics & IT (MeitY)',
    verifiedPartner: 'Government of India',
    category: 'RESEARCH_GRANT',
    awardAmount: '₹10,00,000 INR',
    awardType: 'Prototype & Seed Grant',
    location: 'Pan-India',
    deadline: '2026-11-30',
    daysLeft: 35,
    deadlineUrgency: 'NORMAL',
    matchScore: 96,
    eligibility: '2nd, 3rd, and 4th-year B.Tech / M.Tech / MCA engineering student teams.',
    description: 'National innovation seed funding for student teams creating generative AI, agentic systems, semiconductors, or sustainable computing prototypes addressing national challenges.',
    skills: ['Python', 'Generative AI / LLMs', 'Machine Learning', 'System Design'],
    url: 'https://www.meity.gov.in/',
    requirements: [
      'Team of 2 to 4 engineering students',
      'Proof-of-concept repository with working demonstration',
      'College NOC from department head'
    ]
  },
  {
    id: 'sch-4',
    title: 'Agentic AI Graduate Research Fellowship 2026',
    organization: 'Sarvam AI Research Labs',
    verifiedPartner: 'Sarvam AI',
    category: 'FELLOWSHIP',
    awardAmount: '₹75,000 / Month',
    awardType: 'Paid Fellowship + Compute Credits',
    location: 'Bengaluru / Hybrid',
    deadline: '2026-10-25',
    daysLeft: 8,
    deadlineUrgency: 'URGENT',
    matchScore: 94,
    eligibility: 'Pre-final (3rd Year) and Final (4th Year) B.Tech / M.Sc Computer Science students.',
    description: 'Fully funded research fellowship covering frontier LLM development, Indic voice intelligence pipelines, and multimodal inference engineering.',
    skills: ['Python', 'PyTorch', 'LangGraph', 'Transformers'],
    url: 'https://sarvam.ai/careers',
    requirements: [
      'Solid command over linear algebra, PyTorch, and NLP foundations',
      'GitHub profile demonstrating open-source model pipelines or papers',
      'Available for 6 months part-time or full-time research cycle'
    ]
  },
  {
    id: 'sch-5',
    title: 'National Technical Education Merit Scholarship',
    organization: 'AICTE & Ministry of Education',
    verifiedPartner: 'AICTE Approved',
    category: 'SCHOLARSHIP',
    awardAmount: '₹50,000 / Year',
    awardType: 'Tuition Grant & Book Allowance',
    location: 'All India Institutions',
    deadline: '2026-11-10',
    daysLeft: 19,
    deadlineUrgency: 'NORMAL',
    matchScore: 92,
    eligibility: '1st, 2nd, and 3rd year enrolled engineering and technology degree students.',
    description: 'Government merit-cum-means scholarship supporting technical students pursuing engineering, computer science, and applied mathematics degrees.',
    skills: ['Academic Merit', 'Engineering Foundations', 'Mathematics'],
    url: 'https://www.aicte-india.org/',
    requirements: [
      'Enrolled in AICTE recognized institution',
      'Minimum CGPA 7.5 or equivalent first-class standing',
      'Official fee receipt and bonafide student certificate'
    ]
  },
  {
    id: 'sch-6',
    title: 'Undergraduate STEM & Innovation Award',
    organization: 'Cordelia Foundation Trust',
    verifiedPartner: 'Cordelia Foundation',
    category: 'SCHOLARSHIP',
    awardAmount: '$2,500 USD',
    awardType: 'Direct Academic Grant',
    location: 'Remote / Global',
    deadline: '2026-10-28',
    daysLeft: 11,
    deadlineUrgency: 'URGENT',
    matchScore: 91,
    eligibility: 'All undergraduate students studying STEM, Data Science, or Software Engineering.',
    description: 'Providing tuition and project development assistance for undergraduate developers solving educational and environmental sustainability problems.',
    skills: ['Full Stack Development', 'Problem Solving', 'Data Science'],
    url: 'https://unstop.com/scholarships',
    requirements: [
      'Proof of current undergraduate enrollment',
      'Personal essay on how software solves local community challenges',
      'Resume detailing software projects and academic coursework'
    ]
  }
];

export default function AwardsScholarshipsView({
  profile,
  onOpenGuidanceWizard,
  onOpenAcademicModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'PREFERENCES' | 'GRANTS' | 'SCHOLARSHIPS' | 'URGENT'
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('oppradar_saved_scholarships');
      return raw ? JSON.parse(raw) : ['sch-1'];
    } catch {
      return ['sch-1'];
    }
  });

  const toggleSaveScholarship = (id) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('oppradar_saved_scholarships', JSON.stringify(next));
      return next;
    });
  };

  // Filtered List
  const filteredScholarships = SCHOLARSHIPS_DATA.filter(item => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.skills.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category / Preference mode
    if (filterMode === 'PREFERENCES') {
      return savedIds.includes(item.id);
    }
    if (filterMode === 'GRANTS') {
      return item.category === 'RESEARCH_GRANT' || item.category === 'FELLOWSHIP';
    }
    if (filterMode === 'SCHOLARSHIPS') {
      return item.category === 'SCHOLARSHIP';
    }
    if (filterMode === 'URGENT') {
      return item.deadlineUrgency === 'URGENT';
    }

    return true;
  });

  const studentDegree = profile?.degree || 'B.Tech / B.E.';
  const studentYear = profile?.yearOfStudy || '3rd Year (Junior)';

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.25rem 1rem 6rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      backgroundColor: '#ffffff'
    }}>

      {/* ── HEADER BANNER ── */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <Trophy style={{ width: '13px', height: '13px' }} />
              <span>Verified Funding Opportunities</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
              Awards, Grants & Scholarships
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Apply for vetted funding and research awards verified for <strong>{studentDegree}</strong> students ({studentYear}).
            </p>
          </div>

          {/* User Preferences Shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterMode(filterMode === 'PREFERENCES' ? 'ALL' : 'PREFERENCES')}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '12px',
                border: filterMode === 'PREFERENCES' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: filterMode === 'PREFERENCES' ? '#eff6ff' : '#ffffff',
                color: filterMode === 'PREFERENCES' ? '#2563eb' : '#1e293b',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Bookmark style={{ width: '15px', height: '15px', fill: filterMode === 'PREFERENCES' ? '#2563eb' : 'none' }} />
              <span>Saved Preferences ({savedIds.length})</span>
            </button>

            {onOpenAcademicModal && (
              <button
                onClick={onOpenAcademicModal}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
                <span>Eligibility Specs</span>
              </button>
            )}
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search style={{ width: '17px', height: '17px', color: '#94a3b8', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search grants by topic, partner, or skills (e.g. AI, Goodwall, Tech)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.88rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Quick Filter Pills */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Funding' },
              { id: 'SCHOLARSHIPS', label: 'Scholarships' },
              { id: 'GRANTS', label: 'Research Grants' },
              { id: 'URGENT', label: '⏳ Closing Soon' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  border: filterMode === f.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: filterMode === f.id ? '#eff6ff' : '#ffffff',
                  color: filterMode === f.id ? '#2563eb' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCHOLARSHIPS & GRANTS CARDS GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredScholarships.map(item => {
          const isSaved = savedIds.includes(item.id);

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1.4rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.1rem',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Card Header: Partner Tag + Save Button */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    padding: '0.22rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    <ShieldCheck style={{ width: '13px', height: '13px', color: '#2563eb' }} />
                    <span>{item.verifiedPartner}</span>
                  </div>

                  <button
                    onClick={() => toggleSaveScholarship(item.id)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isSaved ? '#2563eb' : '#64748b'
                    }}
                    title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    <Bookmark style={{ width: '15px', height: '15px', fill: isSaved ? '#2563eb' : 'none' }} />
                  </button>
                </div>

                {/* Organization & Location */}
                <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                  <Building2 style={{ width: '13px', height: '13px' }} />
                  <strong style={{ color: '#0f172a' }}>{item.organization}</strong>
                  <span>•</span>
                  <span>{item.location}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.18rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.3
                }}>
                  {item.title}
                </h3>

                {/* Award Amount Banner */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase' }}>
                      Grant / Scholarship Value
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', letterSpacing: '-0.02em' }}>
                      {item.awardAmount}
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {item.awardType}
                  </span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.82rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: '0 0 0.85rem 0'
                }}>
                  {item.description}
                </p>

                {/* Academic Eligibility */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.78rem',
                  color: '#1e293b',
                  marginBottom: '0.85rem',
                  lineHeight: 1.45
                }}>
                  <strong style={{ color: '#0f172a' }}>Eligibility: </strong>
                  {item.eligibility}
                </div>

                {/* Deadline Urgency Countdown */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    color: item.daysLeft <= 14 ? '#ea580c' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock style={{ width: '13px', height: '13px' }} />
                    <span>⏳ {item.daysLeft} days remaining ({item.deadline})</span>
                  </span>

                  <span style={{ color: '#2563eb', fontWeight: 800 }}>
                    {item.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Action Buttons: Direct Apply & Guidance Wizard */}
              <div style={{
                display: 'flex',
                gap: '0.65rem',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '0.85rem'
              }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                >
                  <span>↗ Apply Directly</span>
                </a>

                {onOpenGuidanceWizard && (
                  <button
                    onClick={() => onOpenGuidanceWizard({
                      id: item.id,
                      title: item.title,
                      organization: item.organization,
                      category: item.category,
                      stipendOrPrize: item.awardAmount,
                      location: item.location,
                      lastApplicationDate: item.deadline,
                      eligibility: item.eligibility,
                      description: item.description,
                      skills: item.skills,
                      url: item.url,
                      matchScore: item.matchScore
                    })}
                    style={{
                      padding: '0.7rem 0.95rem',
                      borderRadius: '12px',
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ea580c'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f97316'; }}
                  >
                    <span>Guide</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
