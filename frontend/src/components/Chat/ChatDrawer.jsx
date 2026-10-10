// ==============================================================================
// OPPRADAR — ULTRA-LUXURY SERPAPI CHATBOT ASSISTANT (ChatDrawer.jsx)
// Executive Frosted Glass • Real-Time SerpApi Google Web Intelligence
// Answers ALL user questions (Hackathons, Internships, Deadlines, Academics, Code)
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  MessageSquare,
  Key,
  ExternalLink,
  CheckCheck,
  Radio,
  HelpCircle,
  Trophy,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { generateChatResponse } from '../../services/chatKnowledgeService';
import { getStoredSerpApiKey } from '../../services/opportunityService';
import { sanitizeText } from '../../services/sanitizeService';
import SerpApiKeyModal from '../common/SerpApiKeyModal';

export default function ChatDrawer({ 
  profile, 
  activeTrack, 
  readiness, 
  targets, 
  streak,
  onNavigateTab,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val) => {
    if (val) {
      if (controlledOnOpen) controlledOnOpen();
      setInternalIsOpen(true);
    } else {
      if (controlledOnClose) controlledOnClose();
      setInternalIsOpen(false);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasSerpKey, setHasSerpKey] = useState(Boolean(getStoredSerpApiKey()));

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello **${profile?.full_name || 'Aspirant'}**! 👋\n\nI am your **OPPRADAR AI Assistant** • Connected directly to **SerpApi Live Web Intelligence**.\n\nAsk me **ANY** question:\n• 🏆 Available **Hackathons** (SIH 2026, Devpost, eligibility, team rules)\n• 💼 High-paying **Internships** & qualification criteria\n• 📅 **Last Application Dates** & registration deadlines\n• 🎓 **Academic & Coding Doubts** (DSA, Python, SQL, Math, Systems)\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        { title: 'SerpApi Live Intelligence', url: 'https://serpapi.com' }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setHasSerpKey(Boolean(getStoredSerpApiKey()));
  }, [isOpen, isKeyModalOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const rawText = textToSend || inputMessage;
    const text = sanitizeText(rawText);
    if (!text || isTyping) return;

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await generateChatResponse(text, {
        profile,
        activeTrack,
        readiness,
        targets,
        streak
      });

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response.text,
        sources: response.sources || [],
        isLiveApi: response.isLiveApi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: "I encountered a brief connection glitch while scanning SerpApi. Please verify your internet connection or ask again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    '🏆 SIH 2026 eligibility & dates',
    '💼 Best AI internships for 3rd year',
    '📅 Deadlines closing this month',
    '🎓 Explain Binary Search with Python'
  ];

  return (
    <>
      {/* ── ULTRA-LUXURY HOLOGRAPHIC AI RADAR ORB (Floating Trigger) ── */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: 'calc(66px + env(safe-area-inset-bottom, 0px))', right: '14px', zIndex: 990 }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1e1b4b 55%, #09090b 100%)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.40)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.5), 0 0 18px rgba(59, 130, 246, 0.45)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.65), 0 0 28px rgba(99, 102, 241, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.5), 0 0 18px rgba(59, 130, 246, 0.45)';
            }}
            title="Ask SerpApi Real-Time Radar AI"
            aria-label="Open AI Assistant"
          >
            {/* Pulsing Aura Rings */}
            <span 
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                animation: 'oppRadarPulse 2.4s infinite ease-out',
                pointerEvents: 'none'
              }} 
            />

            {/* Glowing Center Holographic Radar Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Radio style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
              <Sparkles style={{ width: '11px', height: '11px', color: '#facc15', position: 'absolute', top: '-5px', right: '-6px' }} />
            </div>

            {/* Miniature AI Tag */}
            <span style={{
              fontSize: '0.50rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#e2e8f0',
              marginTop: '1px',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              SERP
            </span>

            {/* Live Green Online Status Pip */}
            <span style={{
              position: 'absolute',
              top: '1px',
              right: '1px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: '2px solid #09090b',
              boxShadow: '0 0 6px #10b981'
            }} />
          </button>
        </div>
      )}


      {/* ── SLIDE-OUT CHAT PANEL (Ultra-Luxury Frosted Glass) ── */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'oppFadeIn 0.2s ease-out'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100vh',
              backgroundColor: 'var(--bg-glass-card, rgba(18, 18, 22, 0.95))',
              backdropFilter: 'blur(32px) saturate(190%)',
              WebkitBackdropFilter: 'blur(32px) saturate(190%)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.4)',
              borderLeft: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header: Executive Obsidian Frosted Glass */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated, #16161a)',
              borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
              padding: '0.9rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #000000 0%, #27272a 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  <Sparkles style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 900, margin: 0, color: 'var(--text-primary, #ffffff)', lineHeight: 1.2 }}>
                    OPPRADAR Assistant
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #a1a1aa)', fontWeight: 600 }}>
                      SerpApi Live Web Intelligence
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {/* SerpApi Key Configure Button */}
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '0.32rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
                    backgroundColor: 'var(--bg-glass-input, rgba(255, 255, 255, 0.05))',
                    color: 'var(--text-primary, #ffffff)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Configure SerpApi Key"
                >
                  <Key style={{ width: '13px', height: '13px', color: hasSerpKey ? '#10b981' : '#f59e0b' }} />
                  <span>{hasSerpKey ? 'Key: Active' : 'API Key'}</span>
                </button>

                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary, #ffffff)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close Assistant"
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '86%',
                      backgroundColor: isUser 
                        ? 'var(--primary, #000000)' 
                        : 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.06))',
                      color: isUser 
                        ? 'var(--bg-core, #ffffff)' 
                        : 'var(--text-primary, #ffffff)',
                      border: isUser 
                        ? '1px solid rgba(255, 255, 255, 0.15)' 
                        : '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '0.85rem 1rem',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      position: 'relative'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.text}
                    </div>

                    {/* Verified SerpApi Sources Pill */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted, #a1a1aa)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Verified Sources:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {msg.sources.map((src, sIdx) => {
                            const title = typeof src === 'string' ? src : src.title || 'Source';
                            const url = typeof src === 'string' ? '#' : src.url || '#';
                            return (
                              <a
                                key={sIdx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  padding: '0.18rem 0.5rem',
                                  borderRadius: '6px',
                                  fontSize: '0.68rem',
                                  color: 'var(--text-primary, #ffffff)',
                                  textDecoration: 'none',
                                  fontWeight: 600
                                }}
                              >
                                <span>{title.length > 28 ? title.slice(0, 28) + '...' : title}</span>
                                <ExternalLink style={{ width: '10px', height: '10px', opacity: 0.7 }} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      fontSize: '0.66rem',
                      color: 'var(--text-muted, #71717a)',
                      marginTop: '6px'
                    }}>
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck style={{ width: '13px', height: '13px', color: '#10b981' }} />}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.06))',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary, #ffffff)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#10b981', animation: 'spin 2s linear infinite' }} />
                  <span>Scanning live web with SerpApi Google Intelligence...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.03))',
              padding: '0.55rem 0.85rem',
              borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              display: 'flex',
              gap: '0.45rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.replace(/^[^\w\s]+\s*/, ''))}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.12))',
                    backgroundColor: 'var(--bg-glass-input, rgba(255, 255, 255, 0.06))',
                    color: 'var(--text-primary, #ffffff)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              style={{
                backgroundColor: 'var(--bg-surface-elevated, #16161a)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))'
              }}
            >
              <input 
                type="text" 
                placeholder="Ask anything (e.g. eligibility for SIH 2026, AI internships)..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.15rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
                  backgroundColor: 'var(--bg-glass-input, rgba(255, 255, 255, 0.05))',
                  color: 'var(--text-primary, #ffffff)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary, #000000)',
                  color: 'var(--bg-core, #ffffff)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: (!inputMessage.trim() || isTyping) ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SerpApi Key Configuration Modal */}
      <SerpApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={(newKey) => setHasSerpKey(Boolean(newKey))}
      />
    </>
  );
}
