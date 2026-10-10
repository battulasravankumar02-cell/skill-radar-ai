// ==============================================================================
// OPPRADAR AI — CHAT ASSISTANT & KNOWLEDGE SERVICE
// Dual-Mode:
// MODE 1: OPPRADAR GUIDANCE (Hackathons, internships, scholarships, eligibility, SerpApi key)
// MODE 2: ACADEMIC & CS TUTOR (DSA, Web Dev, AI/LLMs, System Design, SQL, Python)
// ==============================================================================

export const SYSTEM_PROMPT = `
You are the OPPRADAR AI Student Career & Academic Assistant — "Powered by Samrat".
You operate in two dynamic modes:

MODE 1: OPPORTUNITY & RADAR GUIDANCE
- Guide users on discovering live hackathons, high-stipend internships, and global academic scholarships.
- Explain eligibility scoring, direct application links, SerpApi key integration, and search filters.

MODE 2: ACADEMIC & TECHNICAL TUTOR
- Answer student doubts with clear explanations, algorithms, and code examples.
- Domains Covered:
  * Computer Science: Data Structures & Algorithms, React, Node.js, Python, System Design, SQL.
  * Artificial Intelligence: Machine Learning, Prompt Engineering, Agentic AI, LLM APIs.
  * Career Readiness: Hackathon team building, project architecture, pitch preparation.

FORMATTING RULES:
- Use clean Markdown with bullet points, bold highlights, and code blocks.
- Keep explanations structured, actionable, and encouraging.
`;

// Official Live Opportunity & Student Platforms Knowledge Base
export const OFFICIAL_PORTALS = {
  HACKATHONS: {
    name: "Global & National Hackathon Portals",
    applicationUrl: "https://devpost.com/hackathons",
    calendarUrl: "https://mlh.io/seasons/2026/events",
    latestStatus: "Smart India Hackathon, MLH 2026 Season, and global AI builder challenges active.",
    documents: "GitHub profile, live demo video, project repository, team roster."
  },
  INTERNSHIPS: {
    name: "Student Internship & Tech Jobs Portals",
    applicationUrl: "https://wellfound.com/jobs",
    calendarUrl: "https://internshala.com",
    latestStatus: "Summer & winter technical internships open across AI, full-stack, and product roles.",
    documents: "1-Page resume with clickable project links, LinkedIn, GitHub."
  },
  SCHOLARSHIPS: {
    name: "National & Global Scholarship Portals",
    applicationUrl: "https://www.goodwall.io/",
    calendarUrl: "https://scholarships.gov.in",
    latestStatus: "National Scholarship Portal (NSP), Goodwall monthly awards, and MeitY research grants accepting applications.",
    documents: "Student ID, bonafide certificate, marksheet, 1-page proposal or project summary."
  },
  TECH: {
    name: "Tech Career & Open-Source Fellowships",
    applicationUrl: "https://summerofcode.withgoogle.com",
    calendarUrl: "https://roadmap.sh",
    latestStatus: "Google Summer of Code (GSoC), LFX Mentorship, and open-source stipends.",
    documents: "Git commit history, proposal document, community contributions."
  }
};

/**
 * Solves computer science and technical academic questions.
 */
function solveAcademicDoubt(lowerMsg, userMessage) {
  // CS & Coding doubts
  if (
    lowerMsg.includes('dsa') || lowerMsg.includes('algorithm') || lowerMsg.includes('binary search') ||
    lowerMsg.includes('dynamic programming') || lowerMsg.includes('dp') || lowerMsg.includes('sql') ||
    lowerMsg.includes('graph') || lowerMsg.includes('tree') || lowerMsg.includes('recursion') ||
    lowerMsg.includes('array') || lowerMsg.includes('linked list') || lowerMsg.includes('react') ||
    lowerMsg.includes('python') || lowerMsg.includes('system design') || lowerMsg.includes('acid') ||
    lowerMsg.includes('big o') || lowerMsg.includes('database') || lowerMsg.includes('code')
  ) {
    if (lowerMsg.includes('binary search')) {
      return {
        text: `### 🎓 Computer Science Tutor: Binary Search Algorithm\n\n` +
              `**Core Principle:** Binary Search operates on a **sorted array** using divide-and-conquer to locate a target in logarithmic time.\n\n` +
              `#### 1. Step-by-Step Algorithm:\n` +
              `* **Step 1:** Initialize pointers: \`low = 0\` and \`high = len(arr) - 1\`.\n` +
              `* **Step 2:** Compute midpoint: \`mid = low + (high - low) // 2\` *(prevents integer overflow)*.\n` +
              `* **Step 3:** If \`arr[mid] == target\`, return index \`mid\`.\n` +
              `* **Step 4:** If \`arr[mid] < target\`, search right half: \`low = mid + 1\`.\n` +
              `* **Step 5:** If \`arr[mid] > target\`, search left half: \`high = mid - 1\`.\n\n` +
              `#### 2. Python Implementation:\n` +
              `\`\`\`python\n` +
              `def binary_search(arr: list[int], target: int) -> int:\n` +
              `    low, high = 0, len(arr) - 1\n` +
              `    while low <= high:\n` +
              `        mid = low + (high - low) // 2\n` +
              `        if arr[mid] == target:\n` +
              `            return mid\n` +
              `        elif arr[mid] < target:\n` +
              `            low = mid + 1\n` +
              `        else:\n` +
              `            high = mid - 1\n` +
              `    return -1  # Target not found\n` +
              `\`\`\`\n\n` +
              `#### 3. Complexity:\n` +
              `* **Time Complexity:** $\\mathcal{O}(\\log N)$ worst/average case | $\\mathcal{O}(1)$ best case.\n` +
              `* **Space Complexity:** $\\mathcal{O}(1)$ iterative auxiliary memory.`,
        actionSuggestion: "Filter AI & Coding Opportunities",
        modeUsed: "ACADEMIC"
      };
    }

    if (lowerMsg.includes('acid') || lowerMsg.includes('transaction')) {
      return {
        text: `### 🎓 Database Systems: ACID Properties\n\n` +
              `In relational databases (e.g. PostgreSQL), transactions guarantee data consistency through **ACID**:\n\n` +
              `* **Atomicity:** All operations succeed together or all roll back completely.\n` +
              `* **Consistency:** Transitions database only from one valid state to another, preserving constraints.\n` +
              `* **Isolation:** Concurrent transactions execute without cross-contamination.\n` +
              `* **Durability:** Committed transactions persist safely even during crashes or power cuts.\n\n` +
              `\`\`\`sql\n` +
              `BEGIN TRANSACTION;\n` +
              `UPDATE accounts SET balance = balance - 500 WHERE id = 1;\n` +
              `UPDATE accounts SET balance = balance + 500 WHERE id = 2;\n` +
              `COMMIT;\n` +
              `\`\`\``,
        actionSuggestion: "Explore Backend Internships",
        modeUsed: "ACADEMIC"
      };
    }

    return {
      text: `### 🎓 Computer Science Tutor\n\n` +
            `Here is the key architectural guidance for your question:\n\n` +
            `* **Clean Modularity:** Separate business logic from data access and view layers.\n` +
            `* **Complexity Analysis:** Always evaluate time and space requirements for production scalability.\n` +
            `* **Robust Error Handling:** Validate input schemas and gracefully recover from API or database exceptions.`,
      actionSuggestion: "Explore Live Hackathons",
      modeUsed: "ACADEMIC"
    };
  }

  return null;
}

/**
 * Main chat response generator for OPPRADAR AI.
 */
export const generateChatResponse = async ({
  message,
  profile = {},
  activeTrack = { id: 'agentic-ai', name: 'Software & AI Explorer' },
  readiness = 85,
  streak = { current_streak: 5 }
}) => {
  const userMessage = (message || '').trim();
  const lowerMsg = userMessage.toLowerCase();

  // Try direct technical/academic doubt solver first
  const academicResult = solveAcademicDoubt(lowerMsg, userMessage);
  if (academicResult) return academicResult;

  // Hackathons & Competitions
  if (lowerMsg.includes('hackathon') || lowerMsg.includes('competition') || lowerMsg.includes('sih') || lowerMsg.includes('prize')) {
    return {
      text: `### 🏆 Live Hackathon Guidance\n\n` +
            `OPPRADAR continuously tracks student hackathons across India and globally:\n\n` +
            `* **How to Find:** Switch to the **Hackathons** tab in the bottom navigation to view verified hackathons with cash prizes and direct registration.\n` +
            `* **Winning Strategy:** Focus on solving a real-world problem with a functional prototype, clear architecture, and clean UI.\n` +
            `* **Eligibility:** Filter by branch, graduation year, or undergraduate status in your Academic Profile.`,
      actionSuggestion: "View Hackathons",
      modeUsed: "OPPORTUNITY"
    };
  }

  // Internships
  if (lowerMsg.includes('intern') || lowerMsg.includes('stipend') || lowerMsg.includes('job') || lowerMsg.includes('hiring')) {
    return {
      text: `### 💼 Student Internships Radar\n\n` +
            `Discover live verified internships matched to your degree and skill set:\n\n` +
            `* **How to Find:** Switch to the **Internships** tab in the bottom bar.\n` +
            `* **Live Web Intelligence:** If you add your free SerpApi Key in Settings, OPPRADAR pulls real-time listings directly from Google Jobs & LinkedIn.\n` +
            `* **Match Score:** Opportunities are scored against your known skills (${(profile.skills || ['Python', 'React']).join(', ')}).`,
      actionSuggestion: "View Internships",
      modeUsed: "OPPORTUNITY"
    };
  }

  // Scholarships & Grants
  if (lowerMsg.includes('scholarship') || lowerMsg.includes('grant') || lowerMsg.includes('funding') || lowerMsg.includes('financial aid')) {
    return {
      text: `### 🎓 Awards & Scholarships Hub\n\n` +
            `Explore verified scholarship programs and research grants:\n\n` +
            `* **Screen 4 (Scholarships Tab):** Tap **Scholarships** in the bottom bar to view student grants, Goodwall monthly awards ($1,000 USD), and government schemes.\n` +
            `* **Application Details:** Each card displays deadline countdowns, partner verification, eligibility rules, and official direct application links.`,
      actionSuggestion: "View Scholarships",
      modeUsed: "OPPORTUNITY"
    };
  }

  // SerpApi Web Engine
  if (lowerMsg.includes('serpapi') || lowerMsg.includes('api key') || lowerMsg.includes('google search')) {
    return {
      text: `### ⚡ SerpApi Real-Time Web Intelligence\n\n` +
            `OPPRADAR is powered by an automated SerpApi pipeline that performs real-time queries against Google Search and Google Jobs:\n\n` +
            `* **Setup:** Tap **Settings** in the bottom right &rarr; Click **Manage API Key**.\n` +
            `* **Free Key:** Get a free key at [serpapi.com](https://serpapi.com) (100 free searches/month).\n` +
            `* **Benefit:** Instant access to 2026 hackathons, summer internships, and new opportunities as soon as they go live.`,
      actionSuggestion: "Manage API Key",
      modeUsed: "OPPORTUNITY"
    };
  }

  // Universal Default
  return {
    text: `### 🧭 OPPRADAR AI Student Assistant\n\n` +
          `Hello **${profile.full_name || 'Student'}**! I am your AI Opportunity & Academic Guide:\n\n` +
          `* **Discover Opportunities:** Ask me about live hackathons, high-stipend internships, and student scholarships.\n` +
          `* **Technical Doubts:** Ask me any programming or CS doubt in Python, React, DSA, System Design, or Databases!\n` +
          `* **Personalization:** Update your degree and skills in the Academic Profile to tune opportunity match scores.`,
    actionSuggestion: "Explore Opportunities",
    modeUsed: "OPPORTUNITY"
  };
};

export const QUICK_PROMPTS_PLATFORM = [
  "How do I find live hackathons with cash prizes?",
  "Show summer internships matching my skills",
  "How do I apply for Goodwall & student scholarships?",
  "How does the SerpApi real-time engine work?"
];

export const QUICK_PROMPTS_ACADEMIC = [
  "Explain Binary Search with Python code and complexity",
  "Explain ACID database properties with an SQL example",
  "What skills should I learn for AI engineer internships?",
  "How do hackathon teams prepare high-scoring projects?"
];

export const QUICK_PROMPTS = [...QUICK_PROMPTS_PLATFORM, ...QUICK_PROMPTS_ACADEMIC];

export default {
  SYSTEM_PROMPT,
  OFFICIAL_PORTALS,
  generateChatResponse,
  QUICK_PROMPTS
};
