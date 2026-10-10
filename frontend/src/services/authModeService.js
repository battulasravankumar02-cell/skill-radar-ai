// ==============================================================================
// OPPRADAR AI — AUTHENTICATION & DEVICE INSTALLATION MODE SERVICE
// Controls session vs. installed app authentication behavior:
// 1. Web Browser Mode: Prompt user to Sign In / Sign Up on every application open.
// 2. Installed App Mode (Mobile / Laptop PWA): User signs up ONCE, credentials
//    are saved, and all subsequent launches open directly WITHOUT sign in.
// ==============================================================================

/**
 * Checks whether the application is running as an installed app on mobile or laptop.
 * Detects:
 * - Standalone display mode (PWA window on mobile or desktop)
 * - Minimal-UI / Window Controls Overlay display modes
 * - iOS Safari standalone web app mode (navigator.standalone)
 * - Android Trusted Web Activity (android-app:// referrer)
 * - Explicit device installation flag in localStorage
 */
export function isInstalledApp() {
  if (typeof window === 'undefined') return false;

  try {
    const isStandaloneMedia = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isMinimalUi = window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches;
    const isWindowControlsOverlay = window.matchMedia && window.matchMedia('(display-mode: window-controls-overlay)').matches;
    const isIOSStandalone = window.navigator && window.navigator.standalone === true;
    const isAndroidApp = typeof document !== 'undefined' && document.referrer && document.referrer.includes('android-app://');
    const isStoredInstalled = localStorage.getItem('oppradar_is_installed_app') === 'true';

    return Boolean(
      isStandaloneMedia || 
      isMinimalUi || 
      isWindowControlsOverlay || 
      isIOSStandalone || 
      isAndroidApp || 
      isStoredInstalled
    );
  } catch (err) {
    console.warn('[OPPRADAR authModeService] Error checking installed app:', err);
    return localStorage.getItem('oppradar_is_installed_app') === 'true';
  }
}

/**
 * Determines which initial screen to display when the app opens:
 * - 'app': Direct entry to workspace (Installed app with saved login OR active browser tab session)
 * - 'landing': Welcome / Sign In / Register gateway
 */
export function getInitialAppScreen() {
  if (typeof window === 'undefined') return 'landing';

  const installed = isInstalledApp();
  const hasInstalledAuth = localStorage.getItem('oppradar_installed_authenticated') === 'true';
  const hasGeneralAuth = localStorage.getItem('oppradar_authenticated') === 'true';
  const hasCompletedOnboarding = localStorage.getItem('oppradar_onboarded_completed') === 'true';

  // RULE 1: If running as an INSTALLED APP on mobile or laptop:
  // User must have signed in AND completed academic & skills onboarding to open directly!
  if (installed && (hasInstalledAuth || hasGeneralAuth) && hasCompletedOnboarding) {
    return 'app';
  }

  // RULE 2: Standard Web Browser visit:
  // Active session and onboarding completed
  const isBrowserSessionActive = sessionStorage.getItem('oppradar_browser_session_active') === 'true';
  if (isBrowserSessionActive && hasGeneralAuth && hasCompletedOnboarding) {
    return 'app';
  }

  // First it MUST show the Welcome / Landing Gateway (Screen 1)
  return 'landing';
}

/**
 * Saves user credentials and session authentication.
 */
export function saveAuthCredentials({
  email,
  username,
  password,
  isInstalled = false,
  rememberDevice = true
}) {
  if (typeof window === 'undefined') return;

  const userEmail = (email || '').trim();
  const userName = (username || userEmail.split('@')[0] || 'Student').trim();
  const userPass = password || '';

  // 1. Save username/email and password so they are preserved
  if (userEmail) localStorage.setItem('oppradar_user_email', userEmail);
  if (userName) localStorage.setItem('oppradar_saved_username', userName);
  if (userPass) localStorage.setItem('oppradar_saved_password', userPass);
  
  localStorage.setItem('oppradar_authenticated', 'true');
  localStorage.setItem('oppradar_onboarded_completed', 'true');

  // 2. Set active browser session for current browser window
  sessionStorage.setItem('oppradar_browser_session_active', 'true');

  // 3. If running in installed app or user checked remember device, enable permanent auto-login
  if (isInstalled || isInstalledApp() || rememberDevice) {
    localStorage.setItem('oppradar_installed_authenticated', 'true');
    if (isInstalled) {
      localStorage.setItem('oppradar_is_installed_app', 'true');
    }
  }
}

/**
 * Retrieves saved credentials if available for quick auto-fill.
 */
export function getSavedCredentials() {
  if (typeof window === 'undefined') {
    return { email: '', username: '', password: '', hasSaved: false };
  }

  const email = localStorage.getItem('oppradar_user_email') || '';
  const username = localStorage.getItem('oppradar_saved_username') || email.split('@')[0] || '';
  const password = localStorage.getItem('oppradar_saved_password') || '';
  const hasSaved = Boolean(email && password);

  return { email, username, password, hasSaved };
}

/**
 * Marks the device as having installed the OPPRADAR app.
 */
export function setInstalledAppFlag(isInstalled = true) {
  if (typeof window === 'undefined') return;
  if (isInstalled) {
    localStorage.setItem('oppradar_is_installed_app', 'true');
    // If user is already authenticated, activate installed auto-login
    if (localStorage.getItem('oppradar_authenticated') === 'true') {
      localStorage.setItem('oppradar_installed_authenticated', 'true');
    }
  } else {
    localStorage.removeItem('oppradar_is_installed_app');
    localStorage.removeItem('oppradar_installed_authenticated');
  }
}

/**
 * Clears current authentication tokens on explicit Sign Out / Switch Account.
 */
export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('oppradar_authenticated');
  localStorage.removeItem('oppradar_installed_authenticated');
  sessionStorage.removeItem('oppradar_browser_session_active');
}
