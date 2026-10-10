// ==============================================================================
// OPPRADAR — WELCOME HERO EDUCATIONAL ILLUSTRATION
// Matches Page 1 Screen 1: Student sitting on books with laptop, floating
// graduation caps, notebooks, backpack, and learning icons.
// ==============================================================================

import React from 'react';

export default function WelcomeIllustration({ className = '', style = {} }) {
  return (
    <div 
      className={`welcome-illustration-wrap ${className}`} 
      style={{
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style
      }}
    >
      <svg 
        viewBox="0 0 400 360" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: '280px', filter: 'drop-shadow(0 12px 28px rgba(37, 99, 235, 0.12))' }}
      >
        {/* Soft Ambient Background Elements */}
        <circle cx="200" cy="180" r="140" fill="url(#bg_soft_gradient)" opacity="0.45" />
        
        {/* Floating Educational Doodles & Badges */}
        {/* Graduation Cap Top Left */}
        <g transform="translate(45, 45) rotate(-12)" opacity="0.85">
          <polygon points="30,5 55,18 30,31 5,18" fill="#3b82f6" opacity="0.25" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="12,23 12,38 48,38 48,23" fill="#60a5fa" opacity="0.4" />
          <line x1="55" y1="18" x2="55" y2="42" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="55" cy="44" r="3" fill="#f59e0b" />
        </g>

        {/* Floating Graduation Cap Top Right */}
        <g transform="translate(310, 50) rotate(14)" opacity="0.75">
          <polygon points="26,4 48,15 26,26 4,15" fill="#3b82f6" opacity="0.25" stroke="#2563eb" strokeWidth="1.8" />
          <polygon points="10,20 10,32 42,32 42,20" fill="#93c5fd" opacity="0.4" />
          <line x1="48" y1="15" x2="48" y2="35" stroke="#f59e0b" strokeWidth="2" />
        </g>

        {/* Floating Lightbulb / Idea Left */}
        <g transform="translate(40, 160)" opacity="0.8">
          <circle cx="20" cy="20" r="16" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" />
          <path d="M16 28h8M17 31h6" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 18a4 4 0 0 1 8 0c0 2-2 3-2 5h-4c0-2-2-3-2-5z" fill="#fcd34d" />
        </g>

        {/* Floating Code Badge Right */}
        <g transform="translate(320, 150)" opacity="0.85">
          <rect x="0" y="0" width="38" height="28" rx="8" fill="#ffffff" stroke="#60a5fa" strokeWidth="1.8" />
          <path d="M12 10l-4 4 4 4M26 10l4 4-4 4M20 9l-2 10" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Student Backpack Left */}
        <g transform="translate(80, 200)">
          <rect x="10" y="15" width="45" height="60" rx="14" fill="#3b82f6" />
          <rect x="18" y="30" width="29" height="35" rx="8" fill="#1d4ed8" />
          <path d="M22 15V8a8 8 0 0 1 16 0v7" stroke="#60a5fa" strokeWidth="3" fill="none" />
          <rect x="23" y="44" width="19" height="5" rx="2.5" fill="#93c5fd" />
          <circle cx="32" cy="38" r="3" fill="#ffffff" />
        </g>

        {/* Big Stack of Books Base */}
        {/* Book 1 (Bottom Thick Book) */}
        <g transform="translate(130, 245)">
          <path d="M0 45 L150 45 L160 70 L-10 70 Z" fill="#1e3a8a" />
          <rect x="-10" y="55" width="170" height="20" rx="4" fill="#2563eb" />
          <rect x="-6" y="58" width="162" height="14" rx="2" fill="#dbeafe" />
          <path d="M-10 55 L-10 75 L160 75 L160 55" stroke="#1d4ed8" strokeWidth="2" fill="none" />
        </g>

        {/* Book 2 (Middle Book) */}
        <g transform="translate(145, 220)">
          <rect x="-15" y="45" width="150" height="18" rx="4" fill="#0284c7" />
          <rect x="-11" y="48" width="142" height="12" rx="2" fill="#e0f2fe" />
          <line x1="20" y1="45" x2="20" y2="63" stroke="#38bdf8" strokeWidth="3" />
        </g>

        {/* Book 3 (Top Book) */}
        <g transform="translate(155, 195)">
          <rect x="-15" y="45" width="130" height="18" rx="4" fill="#3b82f6" />
          <rect x="-11" y="48" width="122" height="12" rx="2" fill="#eff6ff" />
          <circle cx="15" cy="54" r="4" fill="#fbbf24" />
        </g>

        {/* Student Sitting Character */}
        <g transform="translate(160, 50)">
          {/* Hair & Head */}
          <ellipse cx="65" cy="62" rx="20" ry="22" fill="#ffedd5" />
          {/* Hair */}
          <path d="M48 56 C46 36, 84 32, 85 52 C82 46, 75 42, 65 42 C56 42, 50 48, 48 56 Z" fill="#1e293b" />
          <path d="M46 54 C44 62, 48 70, 50 72 C50 64, 48 58, 46 54 Z" fill="#1e293b" />

          {/* Glasses */}
          <rect x="52" y="56" width="11" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="67" y="56" width="11" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
          <line x1="63" y1="60" x2="67" y2="60" stroke="#0f172a" strokeWidth="1.8" />

          {/* Friendly Smile */}
          <path d="M60 72 Q65 77 70 72" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />

          {/* Student Torso & T-Shirt with Oppradar Logo Symbol */}
          <path d="M45 84 C42 98, 40 135, 40 145 L88 145 C88 135, 86 98, 83 84 C76 80, 52 80, 45 84 Z" fill="#0284c7" />
          <circle cx="64" cy="112" r="8" fill="#38bdf8" opacity="0.9" />
          <circle cx="64" cy="112" r="3.5" fill="#ffffff" />

          {/* Arms Holding Laptop */}
          <path d="M42 92 L28 125 L45 132" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M86 92 L98 125 L80 132" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="43" cy="132" r="6" fill="#ffedd5" />
          <circle cx="81" cy="132" r="6" fill="#ffedd5" />

          {/* Open Laptop */}
          {/* Screen */}
          <polygon points="32,110 92,104 88,135 28,138" fill="#0f172a" />
          <polygon points="36,112 88,107 85,133 33,135" fill="#38bdf8" />
          {/* Keyboard Base */}
          <polygon points="25,138 95,135 105,148 15,150" fill="#94a3b8" />
          <polygon points="28,139 92,136 100,146 20,148" fill="#cbd5e1" />

          {/* Legs Bent Sitting on Books */}
          <path d="M42 145 L32 178 L70 188" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M82 145 L98 178 L65 192" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          {/* Shoes */}
          <ellipse cx="72" cy="190" rx="10" ry="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="63" cy="194" rx="10" ry="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        </g>
        
        {/* Soft Shadow Base */}
        <ellipse cx="200" cy="328" rx="120" ry="14" fill="#94a3b8" opacity="0.25" />

        <defs>
          <radialGradient id="bg_soft_gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 180) rotate(90) scale(140)">
            <stop stopColor="#93c5fd" stopOpacity="0.8" />
            <stop offset="0.6" stopColor="#dbeafe" stopOpacity="0.4" />
            <stop offset="1" stopColor="#eff6ff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
