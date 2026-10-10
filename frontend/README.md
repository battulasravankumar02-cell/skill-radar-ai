# OPPRADAR AI — Frontend Architecture

This directory houses the client application for **OPPRADAR AI** ("Discover. Explore. Act." • Powered by Samrat).

## Directory Structure
* **`index.html`**: Entry HTML document with PWA icons, Google Fonts (Outfit & Plus Jakarta Sans), and meta viewport.
* **`public/`**: Static public assets:
  * `logo-app-cover.svg`: Standalone vector app cover card.
  * `favicon.svg` & `icons.svg`: Vector icon set.
  * `manifest.json`: Web App Manifest for mobile installation (PWA).
  * `sw.js`: Service worker registration.
* **`src/`**:
  * **`App.jsx`**: Core mobile container routing between Gateway (Screen 1) and Workspace (Screens 2–4).
  * **`components/`**:
    * **`Landing/`**: Welcome & authentication gateway (Screen 1A Welcome, 1B Sign In, 1C Register).
    * **`OpportunityRadar/`**: Live hackathons and internships discovery feed, filtering, and detail modal.
    * **`Scholarships/`**: Awards & scholarships hub (Goodwall $1,000, AICTE, MeitY grants).
    * **`Onboarding/`**: Academic & skills onboarding modal (degree, branch, year, known skills).
    * **`Chat/`**: Dual-mode AI assistant drawer with real-time web intelligence.
    * **`common/`**: Brand logos (`OppRadarLogo`, `OppRadarTieIcon`), `AppCoverModal`, and `SerpApiKeyModal`.
  * **`services/`**:
    * `opportunityService.js`: Frontend opportunity radar search adapter and bookmarking storage.
    * `storageService.js`: User profile management with local persistence & Supabase sync.
    * `chatKnowledgeService.js`: Dual-mode academic tutor & opportunity guidance engine.
    * `sanitizeService.js`: Input sanitization and security utility.
    * `supabaseClient.js`: Shared Supabase connection singleton.
  * **`index.css`**: Executive Monochrome design system with macOS frosted glass and custom variables.
