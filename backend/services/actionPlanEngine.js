// ==============================================================================
// NEXGUIDE LIVE — ACTION PLAN & NEXT BEST ACTION ENGINE
// Turns raw opportunity data into concrete, high-confidence student actions.
// ==============================================================================

export function generateApplicationPlan({ opportunity, profile = {}, skillGapAnalysis = {} }) {
  const missing = skillGapAnalysis.missing || [];
  const matched = skillGapAnalysis.matched || [];
  const org = opportunity.organization || 'Hiring Team';
  const role = opportunity.title || 'Specialist';

  // 1. Determine Immediate Next Best Action
  let nextBestAction = {
    actionType: 'APPLY_NOW',
    headline: 'Apply Now on Official Portal',
    reason: 'Your verified skills align directly with all stated criteria.',
    urgency: opportunity.deadlineUrgency === 'URGENT' ? 'HIGH' : 'STANDARD'
  };

  if (missing.length > 0 && missing.includes('Docker')) {
    nextBestAction = {
      actionType: 'BRIDGE_SKILL',
      headline: 'Quickly containerize one GitHub project with Docker before applying',
      reason: 'Docker is specified in requirements and is an immediate differentiator.',
      urgency: 'HIGH'
    };
  } else if (missing.length >= 2) {
    nextBestAction = {
      actionType: 'PREPARE_PROJECT',
      headline: `Build a quick demo combining ${matched[0] || 'Python'} with ${missing[0]}`,
      reason: `Demonstrates active learning agility to ${org} recruiters.`,
      urgency: 'MEDIUM'
    };
  } else if (opportunity.daysLeft !== null && opportunity.daysLeft <= 3) {
    nextBestAction = {
      actionType: 'URGENT_APPLY',
      headline: `Submit application immediately (${opportunity.daysLeft} days remaining)`,
      reason: 'Application window is closing rapidly.',
      urgency: 'CRITICAL'
    };
  }

  // 2. Formulate 5-Point Application Blueprint
  const plan = {
    opportunityId: opportunity.id,
    targetRole: role,
    targetCompany: org,
    officialUrl: opportunity.url,
    immediateAction: nextBestAction,

    // Step 1: Technical Focus
    revisionTopics: [
      `Review core ${matched[0] || 'Python'} & Data Structures interview questions`,
      ...(missing.length > 0 ? [`Read official documentation for ${missing[0]}`] : []),
      'Prepare to explain end-to-end architecture of your top project'
    ],

    // Step 2: Portfolio Highlight
    recommendedProject: {
      title: `${role} Proof-of-Concept Project`,
      description: `Create a clean GitHub repository highlighting ${matched.slice(0, 2).join(' & ')}. Include a clear README with architecture diagram and live demonstration link.`,
      tags: [...matched.slice(0, 2), ...(missing.length > 0 ? [missing[0]] : [])]
    },

    // Step 3: Resume Bullets to Emphasize
    resumeBulletSuggestions: [
      `Engineered scalable ${matched[0] || 'Python'} application utilizing ${matched[1] || 'SQL'} with focus on low latency and reliability.`,
      `Integrated automated workflows reducing manual processing time by over 35%.`,
      `Documented clean code, unit test coverage, and modular design hosted on GitHub.`
    ],

    // Step 4: Submission Checklist
    submissionChecklist: [
      { id: 'chk-1', text: 'Verify academic passing year against job eligibility criteria', completed: false },
      { id: 'chk-2', text: 'Tailor resume summary to mention target role keywords', completed: false },
      { id: 'chk-3', text: 'Ensure GitHub and LinkedIn links are public and working', completed: false },
      { id: 'chk-4', text: `Submit application directly on official ${opportunity.sourceDomain || 'careers'} portal`, completed: false }
    ],

    generatedAt: new Date().toISOString()
  };

  return plan;
}
