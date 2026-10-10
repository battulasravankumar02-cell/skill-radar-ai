// ==============================================================================
// OPPRADAR AI — APP COVER & MOBILE DOWNLOAD / INSTALL MODAL
// Matches user reference: Magnifying Glass + Blue Tie, "OPPRADAR AI",
// "POWERED BY SAMRAT", and Phone Home Screen App icon preview.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Laptop, Check, Share2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import OppRadarLogo, { OppRadarTieIcon } from './OppRadarLogo';
import { setInstalledAppFlag, isInstalledApp } from '../../services/authModeService';

export default function AppCoverModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => isInstalledApp());

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const installedHandler = () => {
      setInstalledAppFlag(true);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setInstalledAppFlag(true);
      }
      setDeferredPrompt(null);
    } else {
      // Mark installed mode on device
      setInstalledAppFlag(true);
      setInstalled(true);
      alert(
        '✓ OPPRADAR AI Installed App Mode Activated!\n\n' +
        '1. Mobile: Tap Share / Menu (⋮) → "Add to Home Screen"\n' +
        '2. Laptop / PC: Click the install icon (⊕) in the browser address bar or menu → "Install OPPRADAR AI"\n\n' +
        'Your username and password are saved. The next time you open the app, it will open directly without asking for sign in!'
      );
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'oppFadeIn 0.2s ease-out'
      }}
    >
      <div
        className="app-cover-card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.4rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone style={{ width: '18px', height: '18px', color: '#00a4e4' }} />
            <span style={{ fontSize: '0.90rem', fontWeight: 800, color: '#0f172a' }}>
              Mobile App Cover & Installation
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          backgroundColor: '#ffffff'
        }}>

          {/* THE MASTER APP COVER CARD (Exact match to User Reference) */}
          <div style={{
            width: '100%',
            maxWidth: '340px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            {/* Magnifying Glass with Blue Tie Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              backgroundColor: '#ffffff'
            }}>
              <OppRadarTieIcon size={110} />
            </div>

            {/* Downside Branding */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  <span style={{ color: '#00a4e4' }}>OPP</span>
                  <span style={{ color: '#333333' }}>RADAR</span>
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00a4e4', marginLeft: '3px' }}>
                  AI
                </span>
              </div>
              <div style={{
                fontSize: '0.70rem',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                marginTop: '0.35rem'
              }}>
                POWERED BY SAMRAT
              </div>
            </div>
          </div>

          {/* Phone Home Screen Simulation */}
          <div style={{
            width: '100%',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* App Icon Badge */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <OppRadarTieIcon size={40} />
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.90rem', fontWeight: 800, color: '#0f172a' }}>
                  OPPRADAR AI
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                  Mobile & Laptop Standalone App
                </div>
              </div>
            </div>

            <span style={{
              fontSize: '0.70rem',
              fontWeight: 800,
              color: installed ? '#15803d' : '#0284c7',
              backgroundColor: installed ? '#dcfce7' : '#e0f2fe',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px'
            }}>
              {installed ? '✓ Installed' : 'Ready'}
            </span>
          </div>

          {/* Download / Install Trigger Button */}
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              width: '100%',
              padding: '0.88rem',
              borderRadius: '12px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.94rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0369a1'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0284c7'; }}
          >
            <Download style={{ width: '18px', height: '18px' }} />
            <span>{installed ? 'Re-install / Sync Installed App' : 'Download / Install on Mobile & Laptop'}</span>
          </button>

          {/* Instruction Note */}
          <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.5, textAlign: 'center' }}>
            {installed ? (
              <span style={{ color: '#15803d', fontWeight: 700 }}>
                ✓ Installed App Mode Active! Your username & password are saved. The app opens directly without asking for sign in.
              </span>
            ) : (
              <span>
                Installs <strong>OPPRADAR AI</strong> on your phone or laptop. Sign up <strong>once</strong>, your username & password stay saved, and next time the app opens <strong>without sign in</strong>!
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
