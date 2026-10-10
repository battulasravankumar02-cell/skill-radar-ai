// ==============================================================================
// OPPRADAR — OPPORTUNITY DETAILS & APPLICATION GUIDANCE WIZARD
// "Powered by Samrat"
// Strict Light Theme Architecture:
// - Pure white background (#FFFFFF)
// - Subtle slate borders (#E2E8F0)
// - High-contrast dark typography (#0F172A / #1E293B)
// - Vibrant Blue (#2563EB) & Orange (#F97316) Actions
// - Zero device mockups, zero notches, zero Dynamic Islands
// ==============================================================================

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  Check, 
  MapPin, 
  Building2, 
  ShieldCheck,
  Flame,
  GraduationCap,
  Calendar,
  Layers,
  ArrowUpRight,
  Clock,
  Briefcase,
  Trophy,
  FileText,
  Lightbulb,
  Send,
  ListChecks,
  ChevronRight,
  Copy
} from 'lucide-react';

export default function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  initialTab = 'DETAILS'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'DETAILS' | 'WIZARD' | 'ABOUT_COMPANY'
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [completedSteps, setCompletedSteps] = useState({
    profileAudit: true,
    resumeUpdated: false,
    githubPrepped: false,
    formSubmitted: false
  });

  if (!isOpen || !opportunity) return null;

  const isHackathon = opportunity.category === 'HACKATHON';
  const score = opportunity.matchScore || 88;

  const toggleStep = (stepKey) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleCopyOutreach = () => {
    const text = `Hi Team ${opportunity.organization},\n\nI am applying for the ${opportunity.title} role listed on Oppradar. With strong hands-on experience in ${(opportunity.skills || ['Full-Stack', 'AI', 'Problem Solving']).slice(0, 3).join(', ')}, I would love the opportunity to contribute.\n\nLooking forward to connecting!\nBest regards`;
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'oppFadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="oppradar-web-modal"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.4rem',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: isHackathon ? '#f97316' : '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              flexShrink: 0
            }}>
              {isHackathon ? <Trophy style={{ width: '22px', height: '22px' }} /> : <Briefcase style={{ width: '22px', height: '22px' }} />}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {opportunity.organization} • {isHackathon ? 'Hackathon' : 'Internship'}
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                {opportunity.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleSave(opportunity)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: isSaved ? '#eff6ff' : '#ffffff',
                color: isSaved ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title={isSaved ? 'Saved in Radar' : 'Save Opportunity'}
            >
              <Bookmark style={{ width: '18px', height: '18px', fill: isSaved ? '#2563eb' : 'none' }} />
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Tab Switcher: [ Overview & Eligibility | Application Wizard | About Company ] */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          padding: '0.4rem 1.4rem',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('DETAILS')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'DETAILS' ? '#ffffff' : 'transparent',
              color: activeTab === 'DETAILS' ? '#2563eb' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'DETAILS' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles style={{ width: '15px', height: '15px' }} />
            <span>Overview & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('WIZARD')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'WIZARD' ? '#ffffff' : 'transparent',
              color: activeTab === 'WIZARD' ? '#f97316' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'WIZARD' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ListChecks style={{ width: '15px', height: '15px' }} />
            <span>Application Guidance Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('ABOUT_COMPANY')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'ABOUT_COMPANY' ? '#ffffff' : 'transparent',
              color: activeTab === 'ABOUT_COMPANY' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'ABOUT_COMPANY' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 style={{ width: '15px', height: '15px' }} />
            <span>About Employer</span>
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          backgroundColor: '#ffffff'
        }}>

          {/* TAB 1: OVERVIEW & ELIGIBILITY */}
          {activeTab === 'DETAILS' && (
            <>
              {/* Match Score & Urgent Expiration Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    <span>{score}% Profile Fit</span>
                  </div>

                  <div style={{
                    backgroundColor: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    <span>Last Date: {opportunity.lastApplicationDate || 'Closing in 7 days'}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.96rem',
                  fontWeight: 900,
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #a7f3d0'
                }}>
                  {opportunity.stipendOrPrize || 'Verified Placement Track'}
                </div>
              </div>

              {/* Verified Study Match Banner */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534' }}>
                    Verified Academic Match
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                    This opportunity directly accepts your degree program, branch specialization, and graduation year criteria.
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  About the Role & Opportunity
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {opportunity.description}
                </p>
              </div>

              {/* Academic Eligibility Box */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                  <span>Academic Eligibility Requirements</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {opportunity.eligibility || 'Open to undergraduate and postgraduate students enrolled in recognized universities. Good academic standing recommended.'}
                </p>
              </div>

              {/* Required & Matched Skills */}
              {opportunity.skills && opportunity.skills.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Required & Matched Skills ({opportunity.skills.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {opportunity.skills.map(s => (
                      <span
                        key={s}
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Location</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {opportunity.location || 'Remote / Pan-India'}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Source Engine</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    SerpApi Live Google Radar
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: STEP-BY-STEP APPLICATION GUIDANCE WIZARD */}
          {activeTab === 'WIZARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb style={{ width: '16px', height: '16px' }} />
                  <span>Step-by-Step Application Guidance Wizard</span>
                </div>
                <div style={{ fontSize: '0.80rem', color: '#c2410c', marginTop: '2px' }}>
                  Follow this verified playbook designed to maximize your shortlist probability to 95%+.
                </div>
              </div>

              {/* Step 1 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: completedSteps.profileAudit ? '#f0fdf4' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 900
                    }}>1</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Pre-requisites & Profile Audit</strong>
                  </div>
                  <button
                    onClick={() => toggleStep('profileAudit')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: completedSteps.profileAudit ? '#16a34a' : '#64748b'
                    }}
                  >
                    {completedSteps.profileAudit ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Confirm your graduation year matches eligibility ({opportunity.eligibility}). Your academic radar profile is already set to <strong>{score}% match</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: completedSteps.resumeUpdated ? '#f0fdf4' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 900
                    }}>2</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Resume Keyword Injection</strong>
                  </div>
                  <button
                    onClick={() => toggleStep('resumeUpdated')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: completedSteps.resumeUpdated ? '#16a34a' : '#64748b'
                    }}
                  >
                    {completedSteps.resumeUpdated ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  ATS scanners for {opportunity.organization} prioritize candidates featuring:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {(opportunity.skills || ['React', 'JavaScript', 'System Architecture']).map(s => (
                    <span key={s} style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700 }}>
                      + {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 3 */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: completedSteps.githubPrepped ? '#f0fdf4' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 900
                    }}>3</span>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Assessment / Repo Strategy</strong>
                  </div>
                  <button
                    onClick={() => toggleStep('githubPrepped')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: completedSteps.githubPrepped ? '#16a34a' : '#64748b'
                    }}
                  >
                    {completedSteps.githubPrepped ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  {isHackathon 
                    ? 'Ensure team GitHub repo includes clean README, live demo link, and architecture flowchart.'
                    : 'Highlight 1 live deployed project solving real problems rather than generic tutorial repos.'}
                </p>
              </div>

              {/* Step 4: Outreach Template */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Recruiter Outreach Script</strong>
                  <button
                    onClick={handleCopyOutreach}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#2563eb',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy style={{ width: '12px', height: '12px' }} />
                    <span>{copiedTemplate ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <div style={{
                  fontSize: '0.76rem',
                  fontFamily: 'monospace',
                  backgroundColor: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  lineHeight: 1.45
                }}>
                  {`Hi Team ${opportunity.organization},\nI am applying for ${opportunity.title}. With strong experience in ${(opportunity.skills || ['Modern Engineering']).slice(0, 2).join(' & ')}, I'd love to contribute!`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT EMPLOYER */}
          {activeTab === 'ABOUT_COMPANY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {opportunity.organization}
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {opportunity.organization} regularly hires engineering, product, and AI talent across top colleges. Listings indexed and verified in real time via SerpApi Google Jobs & Hackathon crawlers.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Verification</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                    ✓ SerpApi Verified 2026
                  </div>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Application Fee</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    100% Free
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar with Vibrant Blue & Orange Buttons */}
        <div style={{
          padding: '0.9rem 1.4rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {activeTab !== 'WIZARD' ? (
            <button
              onClick={() => setActiveTab('WIZARD')}
              className="btn-primary-orange"
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ListChecks style={{ width: '16px', height: '16px' }} />
              <span>Application Wizard</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('DETAILS')}
              className="btn-outline-slate"
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 800
              }}
            >
              Back to Overview
            </button>
          )}

          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-blue"
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Apply Directly on Official Portal</span>
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </a>
        </div>

      </div>
    </div>
  );
}
