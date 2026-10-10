# OPPRADAR AI 📡
### *Real-Time Student Opportunity Radar & Academic Intelligence Platform*
> **Tagline:** *"Discover. Explore. Act."* • **Powered by Samrat**  
> **Core Mission:** Discover live hackathons, high-stipend internships, and global academic scholarships with automated SerpApi intelligence and transparent match scoring.

---

## 🗂️ Clean Modular Project Architecture

The codebase is organized into clean, dedicated domains:

```
skill-radar-ai/
├── frontend/                     # Modern React Mobile Application (Client)
│   ├── index.html                # App entry document & PWA configuration
│   ├── public/                   # Static icons, logo-app-cover.svg, manifest.json
│   └── src/                      # Source UI components & services
│       ├── components/
│       │   ├── Landing/          # Screen 1 Gateway (Welcome, Sign In, Register)
│       │   ├── OpportunityRadar/ # Hackathons & Internships live feed & details
│       │   ├── Scholarships/     # Awards & Scholarships Hub (Screen 4)
│       │   ├── Onboarding/       # Academic & Skills onboarding modal (Screen 2)
│       │   ├── Chat/             # Dual-mode AI assistant drawer
│       │   └── common/           # AppCoverModal, OppRadarLogo, SerpApiKeyModal
│       └── services/
│           ├── opportunityService.js  # Search API client & bookmarking
│           ├── storageService.js      # Student profile persistence
│           ├── chatKnowledgeService.js# Academic tutor & opportunity engine
│           ├── sanitizeService.js     # Input sanitization
│           └── supabaseClient.js      # Supabase connection
│
├── backend/                      # Backend Intelligence & Search Pipeline (Server)
│   ├── apiRouter.js              # Unified API request dispatcher
│   ├── services/
│   │   ├── serpApiService.js     # Live Google Search & Google Jobs crawler
│   │   ├── searchPlanner.js      # Profile-aware boolean query synthesizer
│   │   ├── scoringEngine.js      # 0–100% eligibility & skill match scorer
│   │   ├── dedupService.js       # Real-time listing deduplication
│   │   ├── normalizerService.js  # Date, stipend & URL extraction
│   │   ├── skillGapEngine.js     # Student missing-skills analyzer
│   │   └── actionPlanEngine.js   # Preparation roadmap generator
│   └── routes/                   # Serverless endpoint handlers
│
├── database/                     # PostgreSQL Database & Persistence (Database)
│   ├── schema.sql                # Unified Supabase schema (Profiles, Bookmarks, Cache, RLS)
│   └── README.md                 # Database setup instructions
│
├── vite.config.js                # Vite build configuration (configured with root: 'frontend')
├── package.json                  # Dependencies & scripts
└── .env.example                  # Environment credentials template
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
```
Add your free SerpApi Key from [serpapi.com](https://serpapi.com):
```env
SERPAPI_KEY=your_serpapi_key_here
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). The full mobile app gateway, live opportunity feed, and backend API handlers start simultaneously.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🌟 Key Features

* **Real-Time Live Web Intelligence:** Automated SerpApi pipeline tracking Indian & global hackathons and internships.
* **Awards & Scholarships Hub (Screen 4):** Curated grant directory (Goodwall $1,000, AICTE, MeitY) with urgent countdown timers.
* **Dual-Mode AI Assistant:** Integrated chat answering student career queries and providing technical code breakdowns (DSA, Python, React, SQL).
* **Transparent Match Scoring:** 0–100% fit scores based on student degree, branch, year, and skills.
* **Standalone PWA & App Cover:** Official app cover preview and one-tap install for mobile home screens.

---

## 📄 License
MIT License © 2026 OPPRADAR AI.
