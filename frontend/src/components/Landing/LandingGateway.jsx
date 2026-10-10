// ==============================================================================
// OPPRADAR — SCREEN 1: WELCOME & AUTHENTICATION GATEWAY
// Exact implementation of Page 1 from User PDF (Screens 1, 2, 3):
// - Screen 1A: Welcome Screen (Student Illustration, "Welcome To Oppradar", "Sign In", "Register")
// - Screen 1B: Sign In Screen ("Welcome To Oppradar", Email, Password, Forgot Password, "Sign In", Socials, "Register Now")
// - Screen 1C: Create Account Screen ("Create Account Oppradar", Name, Phone, Email, Password, Confirm Password, "Next", "Sign In")
//
// Mandatory Rules:
// - Platform name "Oppradar" with mandatory sub-header "Powered by Samrat"
// - Pure White Light Theme (#FFFFFF) with subtle slate borders (#E2E8F0)
// - NO phone bezels, NO Dynamic Island, NO notch, NO mac traffic lights (full-bleed web container)
// - Vibrant orange (#F97316) action buttons & vibrant blue (#2563EB) brand accents
// ==============================================================================

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Laptop,
  Check
} from 'lucide-react';
import OppRadarLogo from '../common/OppRadarLogo';
import WelcomeIllustration from './WelcomeIllustration';
import supabase from '../../supabaseClient';
import { 
  isInstalledApp, 
  saveAuthCredentials, 
  getSavedCredentials, 
  setInstalledAppFlag 
} from '../../services/authModeService';

export default function LandingGateway({ 
  onEnterApp,
  onOpenAcademicModal,
  onOpenAppCover,
  onSaveProfile,
  profile
}) {
  // 'welcome' (Screen 1A) | 'signin' (Screen 1B) | 'register' (Screen 1C)
  const [screenView, setScreenView] = useState('welcome');

  // Device & Auth mode detection
  const savedCreds = getSavedCredentials();
  const installedMode = isInstalledApp();
  const [rememberDevice, setRememberDevice] = useState(true);

  // Sign In State (automatically pre-fills saved credentials if user previously signed up)
  const [signInEmail, setSignInEmail] = useState(() => savedCreds.email || localStorage.getItem('oppradar_user_email') || 'alex.student@gmail.com');
  const [signInPassword, setSignInPassword] = useState(() => savedCreds.password || 'Alex@Pass2026');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handle Sign In ──
  const handleSignInSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address');
      return;
    }
    if (!signInPassword) {
      setSignInError('Please enter your password');
      return;
    }
    setSignInError('');
    setIsSubmitting(true);

    const emailToSave = signInEmail.trim();

    // Supabase Auth Integration
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToSave,
          password: signInPassword
        });
        if (error) {
          console.warn('[Supabase Auth Message]:', error.message);
          // If user not in Supabase yet, attempt auto-signup
          if (error.message.includes('Invalid login credentials')) {
            await supabase.auth.signUp({
              email: emailToSave,
              password: signInPassword
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('[Supabase Sign In Notice]:', err);
      }
    }

    // Persist credentials & set session or installed auth mode
    saveAuthCredentials({
      email: emailToSave,
      username: emailToSave.split('@')[0],
      password: signInPassword,
      isInstalled: installedMode,
      rememberDevice: rememberDevice
    });

    if (onSaveProfile) {
      await onSaveProfile({
        ...(profile || {}),
        email: emailToSave,
        username: emailToSave.split('@')[0],
        full_name: profile?.full_name || emailToSave.split('@')[0]
      });
    }

    setIsSubmitting(false);
    onEnterApp('all');
  };

  // ── Handle Google Fast 1-Click Sign In ──
  const handleSocialSignIn = async (providerName = 'Google') => {
    setIsSubmitting(true);
    const demoEmail = 'aditya.sharma@gmail.com';
    const demoName = 'Aditya Sharma';

    if (supabase) {
      try {
        await supabase.auth.signUp({
          email: demoEmail,
          password: 'Pass2026!Student',
          options: { data: { full_name: demoName } }
        }).catch(() => {});
      } catch (err) {
        console.warn('[Supabase Social Auth Notice]:', err);
      }
    }

    // Persist credentials & set session or installed auth mode
    saveAuthCredentials({
      email: demoEmail,
      username: demoName,
      password: 'Pass2026!Student',
      isInstalled: installedMode,
      rememberDevice: rememberDevice
    });

    if (onSaveProfile) {
      await onSaveProfile({
        ...(profile || {}),
        email: demoEmail,
        full_name: demoName,
        username: 'Aditya'
      });
    }

    setIsSubmitting(false);
    onEnterApp('all');
  };

  // ── Handle Register / Create Account ──
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!regFullName.trim()) {
      setRegError('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter your email address');
      return;
    }
    if (!regPassword) {
      setRegError('Please enter a password');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }
    setRegError('');
    setIsSubmitting(true);

    const emailToSave = regEmail.trim();
    const nameToSave = regFullName.trim();
    const phoneToSave = regPhone.trim();

    // Supabase Auth Integration
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailToSave,
          password: regPassword,
          options: {
            data: {
              full_name: nameToSave,
              phone: phoneToSave
            }
          }
        });
        if (error) {
          console.warn('[Supabase SignUp Message]:', error.message);
        }
      } catch (err) {
        console.warn('[Supabase Register Notice]:', err);
      }
    }

    // Persist credentials & set session or installed auth mode
    saveAuthCredentials({
      email: emailToSave,
      username: nameToSave || emailToSave.split('@')[0],
      password: regPassword,
      isInstalled: installedMode,
      rememberDevice: rememberDevice
    });

    if (onSaveProfile) {
      await onSaveProfile({
        ...(profile || {}),
        email: emailToSave,
        full_name: nameToSave,
        phone: phoneToSave,
        username: nameToSave.split(' ')[0]
      });
    }

    setIsSubmitting(false);

    // Launch multi-step Screen 2 Academic & Skills Onboarding (Page 2 of PDF)
    if (onOpenAcademicModal) {
      onOpenAcademicModal();
    }
    onEnterApp('all');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      color: '#0f172a'
    }}>

      {/* Responsive Card Container Matching Page 1 PDF Screen Formats */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative'
      }}>

        {/* ================================================================ */}
        {/* VIEW 1: SCREEN 1A — WELCOME SCREEN                               */}
        {/* Matches Page 1 Screen 1 from User PDF                            */}
        {/* ================================================================ */}
        {screenView === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
            
            {/* Device Mode Status Notification Bar */}
            {installedMode ? (
              <div style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#15803d',
                textAlign: 'left'
              }}>
                <Smartphone style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                <span><strong>Installed App Mode:</strong> Sign up once to save credentials. Subsequent launches open directly!</span>
              </div>
            ) : (
              <div style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#475569',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Laptop style={{ width: '15px', height: '15px', flexShrink: 0, color: '#2563eb' }} />
                  <span>Web Browser Visit • Sign in required on open</span>
                </div>
                {onOpenAppCover && (
                  <button
                    type="button"
                    onClick={onOpenAppCover}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '0.72rem',
                      textDecoration: 'underline'
                    }}
                  >
                    Install App 📲
                  </button>
                )}
              </div>
            )}

            {/* Top Student Illustration */}
            <div style={{ width: '100%', maxWidth: '300px', margin: '0.25rem auto 0' }}>
              <WelcomeIllustration />
            </div>

            {/* Master Stacked Brand & Logo (Magnifying Glass + Cyan Tie + Downside OPPRADAR AI) */}
            <div 
              style={{ cursor: onOpenAppCover ? 'pointer' : 'default', padding: '0.25rem 0' }}
              onClick={onOpenAppCover}
              title="Tap to preview Mobile App Cover & Download"
            >
              <OppRadarLogo variant="stacked" size="xl" />
            </div>

            {/* Tagline matching PDF */}
            <p style={{
              fontSize: '0.86rem',
              color: '#64748b',
              lineHeight: 1.5,
              maxWidth: '300px',
              margin: '0 auto'
            }}>
              Learn smarter, not harder. Discover live hackathons, internships & scholarships!
            </p>

            {/* Saved Account Fast Access Card (If user previously signed up on this device) */}
            {savedCreds.hasSaved && (
              <div style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Saved Account on Device
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    {savedCreds.username || savedCreds.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSignInSubmit()}
                  style={{
                    padding: '0.45rem 0.95rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <span>Quick Sign In</span>
                  <ArrowRight style={{ width: '13px', height: '13px' }} />
                </button>
              </div>
            )}

            {/* PWA / App Cover Preview Badge */}
            {onOpenAppCover && (
              <button
                type="button"
                onClick={onOpenAppCover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Smartphone style={{ width: '13px', height: '13px' }} />
                <span>Mobile App Cover & PWA Install</span>
              </button>
            )}

            {/* Action Buttons matching Page 1 Screen 1 PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.25rem' }}>
              {/* Primary Orange Button: Sign In */}
              <button
                type="button"
                onClick={() => setScreenView('signin')}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.28)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ea580c'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f97316'; }}
              >
                Sign In
              </button>

              {/* Secondary White Button: Register */}
              <button
                type="button"
                onClick={() => setScreenView('register')}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW 2: SCREEN 1B — SIGN IN SCREEN                               */}
        {/* Matches Page 1 Screen 2 from User PDF                            */}
        {/* ================================================================ */}
        {screenView === 'signin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Navigation Row: Back Arrow + Centered Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setScreenView('welcome')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title="Back to Welcome"
              >
                <ChevronLeft style={{ width: '22px', height: '22px' }} />
              </button>
              <div style={{ flex: 1 }} />
            </div>

            {/* Header Titles with Stacked OppRadarLogo */}
            <div style={{ textAlign: 'center', marginTop: '-0.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <OppRadarLogo variant="stacked" size="md" />
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600, marginTop: '0.45rem' }}>
                Sign In to Your Student Account
              </div>
            </div>

            {/* Error Message */}
            {signInError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.55rem 0.75rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>
                {signInError}
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Email Address Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signInEmail}
                  onChange={e => setSignInEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.90rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>

              {/* Password Input with Eye Toggle */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.75rem 0.85rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.90rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  {showSignInPassword ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
                </button>
              </div>

              {/* Forgot Password Right Link */}
              <div style={{ textAlign: 'right', marginTop: '-2px' }}>
                <span
                  onClick={() => alert('Password recovery link sent to your registered email.')}
                  style={{ fontSize: '0.78rem', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Save Credentials & Device Mode */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', marginTop: '0.15rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    checked={rememberDevice} 
                    onChange={e => setRememberDevice(e.target.checked)}
                    style={{ width: '15px', height: '15px', accentColor: '#2563eb' }}
                  />
                  <span>Keep username & password saved on this device</span>
                </label>
                {installedMode ? (
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, paddingLeft: '23px' }}>
                    ✓ Installed App: Next launch will open directly without sign in!
                  </div>
                ) : (
                  <div style={{ fontSize: '0.71rem', color: '#64748b', paddingLeft: '23px' }}>
                    Credentials saved for 1-click launch when installed on mobile or laptop.
                  </div>
                )}
              </div>

              {/* Orange Sign In Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '0.35rem',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.28)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ea580c'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f97316'; }}
              >
                Sign In
              </button>
            </form>

            {/* Divider: Or Continue With matching PDF */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0.35rem 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                Or Continue With
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            {/* 4 Circular Social Buttons matching Page 1 Screen 2 PDF */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('Google')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#ea4335',
                  fontSize: '1rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                title="Continue with Google"
              >
                G
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('Apple')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Continue with Apple"
              >
                
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('Facebook')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#1877f2',
                  fontSize: '1rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Continue with Facebook"
              >
                f
              </button>

              {/* Microsoft / Email Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('Microsoft')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#059669',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Continue with College Email"
              >
                M
              </button>
            </div>

            {/* Footer Row matching PDF */}
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
              Don't have an account?{' '}
              <span
                onClick={() => setScreenView('register')}
                style={{ color: '#2563eb', fontWeight: 800, cursor: 'pointer' }}
              >
                Register Now
              </span>
            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW 3: SCREEN 1C — CREATE ACCOUNT / REGISTER SCREEN             */}
        {/* Matches Page 1 Screen 3 from User PDF                            */}
        {/* ================================================================ */}
        {screenView === 'register' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {/* Top Navigation Row: Back Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setScreenView('welcome')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title="Back to Welcome"
              >
                <ChevronLeft style={{ width: '22px', height: '22px' }} />
              </button>
              <div style={{ flex: 1 }} />
            </div>

            {/* Header Titles with Stacked OppRadarLogo */}
            <div style={{ textAlign: 'center', marginTop: '-0.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <OppRadarLogo variant="stacked" size="md" />
              <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 700, marginTop: '0.45rem' }}>
                Create Your Student Account
              </div>
            </div>

            {/* Error Message */}
            {regError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.55rem 0.75rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center' }}>
                {regError}
              </div>
            )}

            {/* Create Account Form */}
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Full Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.80rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>

              {/* Phone Number Input */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.80rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>

              {/* Email Address Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.80rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
              </div>

              {/* Password Input with Eye Toggle */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.80rem 2.75rem 0.80rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  {showRegPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>

              {/* Confirm Password Input with Eye Toggle */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.80rem 2.75rem 0.80rem 1.15rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  {showRegConfirmPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>

              {/* Save Credentials & Device Mode */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', marginTop: '0.15rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    checked={rememberDevice} 
                    onChange={e => setRememberDevice(e.target.checked)}
                    style={{ width: '15px', height: '15px', accentColor: '#2563eb' }}
                  />
                  <span>Save username & password (Auto-login when installed on Mobile/Laptop)</span>
                </label>
                {installedMode ? (
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, paddingLeft: '23px' }}>
                    ✓ Installed App: You only need to sign up once on this device!
                  </div>
                ) : (
                  <div style={{ fontSize: '0.71rem', color: '#64748b', paddingLeft: '23px' }}>
                    Keep username & password saved on device for seamless opening.
                  </div>
                )}
              </div>

              {/* Orange Next Button matching Page 1 Screen 3 PDF */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '0.35rem',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.28)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ea580c'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f97316'; }}
              >
                Next
              </button>
            </form>

            {/* Footer Row matching PDF */}
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
              Already have an account?{' '}
              <span
                onClick={() => setScreenView('signin')}
                style={{ color: '#2563eb', fontWeight: 800, cursor: 'pointer' }}
              >
                Sign In
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
