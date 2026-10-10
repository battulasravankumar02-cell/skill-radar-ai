// ==============================================================================
// NEXGUIDE LIVE — AI SEARCH PLANNER SERVICE
// Translates student profile, career goals, and skills into optimized SerpApi search intents.
// ==============================================================================

/**
 * Maps career tracks to rich search keywords and synonyms
 */
const TRACK_KEYWORD_MAP = {
  'agentic-ai': {
    primary: 'Agentic AI Engineer',
    keywords: ['Agentic AI', 'Autonomous Agents', 'LangGraph', 'AI Agent Intern', 'LLM Developer'],
    defaultLocations: ['India', 'Bengaluru', 'Remote'],
    suggestedSkills: ['Python', 'LangChain', 'Multi-Agent', 'FastAPI', 'VectorDB']
  },
  'forward-deployed-ai': {
    primary: 'Forward Deployed AI Engineer',
    keywords: ['Forward Deployed Engineer', 'Applied AI', 'Enterprise AI Intern', 'RAG Engineer'],
    defaultLocations: ['India', 'Bengaluru', 'Hyderabad', 'Remote'],
    suggestedSkills: ['Python', 'TypeScript', 'LLMs', 'RAG', 'Cloud']
  },
  'tech-fullstack': {
    primary: 'Full Stack Developer',
    keywords: ['Full Stack Developer Intern', 'React Node Developer', 'Software Engineer Intern', 'Junior Web Developer'],
    defaultLocations: ['India', 'Remote', 'Bengaluru', 'Pune'],
    suggestedSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind']
  },
  'data-analyst': {
    primary: 'Data Analyst',
    keywords: ['Data Analyst Intern', 'Junior Business Intelligence', 'SQL Python Analyst', 'Data Analytics Trainee'],
    defaultLocations: ['India', 'Bengaluru', 'Mumbai', 'Remote'],
    suggestedSkills: ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel']
  },
  'data-scientist': {
    primary: 'Data Scientist',
    keywords: ['Data Science Intern', 'Junior Data Scientist', 'Machine Learning Intern', 'Predictive Modeling'],
    defaultLocations: ['India', 'Bengaluru', 'Hyderabad', 'Remote'],
    suggestedSkills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn', 'Statistics']
  }
};

/**
 * Intelligent Search Planner
 * Analyzes the user profile, target role, active skills, and selected category to form
 * targeted queries for SerpApi while respecting credit limits.
 */
export function generateSearchPlan({
  profile = {},
  activeTrackId = 'agentic-ai',
  activeTrackName = 'Agentic AI Specialist',
  category = 'ALL', // 'ALL' | 'INTERNSHIP' | 'JOB' | 'HACKATHON' | 'COMPETITION' | 'SCHOLARSHIP'
  location = 'India',
  searchMode = 'PERSONALIZED', // 'PERSONALIZED' | 'EXPLORE' | 'CAREER' | 'SKILL'
  customQuery = ''
}) {
  const trackInfo = TRACK_KEYWORD_MAP[activeTrackId] || {
    primary: activeTrackName || 'Software Engineer',
    keywords: [activeTrackName || 'Software Engineer', 'Tech Intern'],
    defaultLocations: ['India', 'Remote'],
    suggestedSkills: ['Python', 'SQL', 'Git']
  };

  const studentSkills = Array.isArray(profile.existing_skills)
    ? profile.existing_skills
    : ['Python', 'SQL'];

  const degree = profile.degree || 'B.Tech / B.E.';
  const isStudent = (profile.academic_status || 'Undergraduate').toLowerCase().includes('undergraduate') ||
                    (profile.academic_status || '').toLowerCase().includes('student');

  const intents = [];
  let primaryQuery = '';
  let engine = 'google_jobs';

  // 1. Determine Search Strategy based on Category
  const cleanRole = (trackInfo.primary || 'AI Engineer').replace(/Agentic\s*/i, '').trim();

  if (category === 'HACKATHON') {
    engine = 'google';
    primaryQuery = `${cleanRole} hackathon 2026 India student registration`;
    intents.push({
      intent: 'Discover Live Hackathons',
      query: primaryQuery,
      engine: 'google',
      rationale: `Targeting nationwide innovation competitions for ${cleanRole} students.`
    });
  } else if (category === 'COMPETITION') {
    engine = 'google';
    primaryQuery = `${studentSkills[0] || 'AI'} coding competition challenge 2026 college students`;
    intents.push({
      intent: 'Coding Competitions & Challenges',
      query: primaryQuery,
      engine: 'google',
      rationale: `Searching student-eligible technical contests testing ${studentSkills.join(', ')}.`
    });
  } else if (category === 'SCHOLARSHIP') {
    engine = 'google';
    primaryQuery = `Engineering student scholarship fellowship India 2026`;
    intents.push({
      intent: 'Academic & Fellowship Discovery',
      query: primaryQuery,
      engine: 'google',
      rationale: 'Targeting merit fellowships and STEM student education grants in India.'
    });
  } else if (category === 'INTERNSHIP') {
    engine = 'google_jobs';
    const topSkill = studentSkills[0] || 'Python';
    primaryQuery = `${cleanRole} Intern ${topSkill} ${location || 'India'}`;
    intents.push({
      intent: 'Role & Skill Tailored Internships',
      query: primaryQuery,
      engine: 'google_jobs',
      rationale: `Matching career goal (${cleanRole}) with foundational skill (${topSkill}) in ${location}.`
    });
  } else if (category === 'COURSE' || category === 'COURSES') {
    engine = 'google';
    const topSkill = studentSkills[0] || cleanRole;
    primaryQuery = `${topSkill} online course specialization syllabus 2026`;
    intents.push({
      intent: 'Technical Course Discovery',
      query: primaryQuery,
      engine: 'google',
      rationale: `Locating curated learning programs and university courses for ${topSkill}.`
    });
  } else if (category === 'CERTIFICATION' || category === 'CERTIFICATIONS') {
    engine = 'google';
    const topSkill = studentSkills[0] || cleanRole;
    primaryQuery = `${topSkill} professional certification voucher exam 2026`;
    intents.push({
      intent: 'Industry Certification Discovery',
      query: primaryQuery,
      engine: 'google',
      rationale: `Searching accredited industry certifications for ${topSkill}.`
    });
  } else {
    // 'ALL' - Personalized Multi-Category Radar
    if (customQuery && customQuery.trim().length > 0) {
      primaryQuery = `${customQuery.trim()} ${location || 'India'}`;
      engine = 'google_jobs';
      intents.push({
        intent: 'Direct Query Search',
        query: primaryQuery,
        engine: 'google_jobs',
        rationale: 'Searching user-specified keywords with profile geo-targeting.'
      });
    } else if (isStudent) {
      engine = 'google_jobs';
      const topSkill = studentSkills[0] || 'Python';
      primaryQuery = `${cleanRole} Intern ${topSkill} ${location || 'India'}`;
      intents.push({
        intent: 'Student Personalized Radar',
        query: primaryQuery,
        engine: 'google_jobs',
        rationale: `Prioritizing student internships combining ${cleanRole} and ${topSkill}.`
      });
    } else {
      engine = 'google_jobs';
      primaryQuery = `${cleanRole} ${location || 'India'}`;
      intents.push({
        intent: 'Role Career Radar',
        query: primaryQuery,
        engine: 'google_jobs',
        rationale: `Broad radar across all openings for ${cleanRole}.`
      });
    }
  }

  return {
    studentProfileSummary: {
      role: trackInfo.primary,
      skills: studentSkills,
      degree,
      location: location || 'India',
      isStudent
    },
    engine,
    primaryQuery,
    intents,
    executionPlan: {
      recommendedEngine: engine,
      primaryQuery,
      location: location || 'India',
      timestamp: new Date().toISOString()
    }
  };
}
