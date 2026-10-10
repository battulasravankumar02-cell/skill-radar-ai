// ==============================================================================
// OPPRADAR AI — OFFICIAL VISUAL IDENTITY COMPONENT
// Matches User Reference Logo Design:
// Magnifying Glass with Cyan/Sky Blue Necktie in Center + "OPPRADAR AI"
// + "POWERED BY SAMRAT" tagline underneath.
// ==============================================================================

import React from 'react';

/**
 * High-Precision Vector Symbol: Magnifying Glass + Cyan Tie
 */
export function OppRadarTieIcon({ size = 38, className = '', style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      <g transform="translate(50, 48)">
        {/* Magnifying Glass Handle at 225 degrees */}
        <line x1="-11" y1="11" x2="-32" y2="32" stroke="#333333" strokeWidth="8" strokeLinecap="round" />
        <line x1="-13" y1="13" x2="-18" y2="18" stroke="#4a4646" strokeWidth="9.5" strokeLinecap="round" />

        {/* Magnifying Glass Lens Ring with Top Collar Opening */}
        <path 
          d="M -7.5 -21.5 A 23 23 0 1 0 7.5 -21.5" 
          fill="none" 
          stroke="#333333" 
          strokeWidth="7.5" 
          strokeLinecap="round" 
        />

        {/* Cyan/Sky Blue Necktie Knot (Top Collar) */}
        <polygon 
          points="-4.8,-27  4.8,-27  3.6,-18.5  -3.6,-18.5" 
          fill="#00a4e4" 
        />

        {/* Cyan/Sky Blue Necktie Blade (Body + Pointed Tip) */}
        <polygon 
          points="-3.6,-17.5  3.6,-17.5  5.2,5  0,12.5  -5.2,5" 
          fill="#00a4e4" 
        />
      </g>
    </svg>
  );
}

/**
 * Master Logo Component
 * @param {'inline' | 'stacked'} variant - 'inline' for header bar, 'stacked' for app cover / splash
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} size
 */
export default function OppRadarLogo({ 
  size = 'md', 
  variant = 'inline', 
  showWordmark = true, 
  showPoweredBy = true,
  className = '',
  textColor
}) {
  const sizeMap = {
    sm: { icon: 30, title: '1.15rem', ai: '0.82rem', sub: '0.62rem' },
    md: { icon: 38, title: '1.30rem', ai: '0.90rem', sub: '0.68rem' },
    lg: { icon: 54, title: '1.75rem', ai: '1.20rem', sub: '0.76rem' },
    xl: { icon: 72, title: '2.20rem', ai: '1.50rem', sub: '0.84rem' },
    '2xl': { icon: 110, title: '3.00rem', ai: '2.00rem', sub: '0.96rem' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  // STACKED VARIANT (App Cover / Splash / Reference Image Style)
  if (variant === 'stacked') {
    return (
      <div 
        className={`oppradar-logo-stacked ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        {/* Icon */}
        <OppRadarTieIcon size={dim.icon} />

        {/* Downside Title: OPPRADAR AI */}
        {showWordmark && (
          <div style={{ marginTop: size === 'sm' ? '0.35rem' : '0.55rem', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: dim.title, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              <span style={{ color: '#00a4e4' }}>OPP</span>
              <span style={{ color: textColor || '#333333' }}>RADAR</span>
            </span>
            <span style={{ fontSize: dim.ai, fontWeight: 900, color: '#00a4e4', marginLeft: '3px' }}>
              AI
            </span>
          </div>
        )}

        {/* Downside Subtitle: POWERED BY SAMRAT */}
        {showPoweredBy && (
          <div style={{
            fontSize: dim.sub,
            fontWeight: 800,
            color: '#475569',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginTop: '0.25rem'
          }}>
            POWERED BY SAMRAT
          </div>
        )}
      </div>
    );
  }

  // INLINE VARIANT (Clean Header Bar Layout)
  return (
    <div 
      className={`oppradar-logo-inline ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.45rem' : '0.65rem',
        userSelect: 'none'
      }}
    >
      <OppRadarTieIcon size={dim.icon} />

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: dim.title, fontWeight: 900, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#00a4e4' }}>Opp</span>
              <span style={{ color: textColor || '#1e293b' }}>radar</span>
            </span>
            <span style={{ fontSize: dim.ai, fontWeight: 900, color: '#00a4e4', marginLeft: '2px' }}>
              AI
            </span>
          </div>

          {showPoweredBy && (
            <span style={{
              fontSize: dim.sub,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '1px'
            }}>
              Powered by Samrat
            </span>
          )}
        </div>
      )}
    </div>
  );
}
