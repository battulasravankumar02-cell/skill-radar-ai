// ==============================================================================
// NEXGUIDE LIVE — OPPORTUNITY SCORING ENGINE
// Computes transparent multi-factor AI Match Score (0 - 100%)
// Career: 30% | Skills: 25% | Eligibility: 15% | Experience: 10% | Location: 10% | Recency: 10%
// ==============================================================================

export function calculateOpportunityScore(opportunity, profile = {}, activeTrack = {}) {
  const studentSkills = (profile.existing_skills || ['Python', 'SQL']).map(s => s.toLowerCase());
  const userCountry = (profile.dream_country || 'India').toLowerCase();
  const trackName = (activeTrack?.name || activeTrack?.shortName || 'Agentic AI Specialist').toLowerCase();
  const isStudent = (profile.academic_status || 'Undergraduate').toLowerCase().includes('undergraduate') ||
                    (profile.academic_status || '').toLowerCase().includes('student');

  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase());
  const oppTitle = (opportunity.title || '').toLowerCase();
  const oppDesc = (opportunity.description || '').toLowerCase();
  const oppLoc = (opportunity.location || '').toLowerCase();

  const reasons = [];
  const missingSkills = [];

  // --- 1. Career Relevance (30%) ---
  let careerScore = 15; // baseline
  const trackKeywords = trackName.split(/\s+/).filter(w => w.length > 2);
  const matchedKeywords = trackKeywords.filter(k => oppTitle.includes(k) || oppDesc.includes(k));

  if (matchedKeywords.length >= 2 || oppTitle.includes('ai') || oppTitle.includes('engineer') || oppTitle.includes('analyst')) {
    careerScore = 30;
    reasons.push(`Direct alignment with your career goal (${activeTrack?.shortName || 'AI Specialist'})`);
  } else if (matchedKeywords.length === 1) {
    careerScore = 22;
    reasons.push(`Substantial overlap with target specialization keywords`);
  } else {
    careerScore = 12;
  }

  // --- 2. Skill Match (25%) ---
  let skillScore = 0;
  const matchedStudentSkills = [];

  for (const s of opportunity.skills || []) {
    const sLower = s.toLowerCase();
    if (studentSkills.includes(sLower) || studentSkills.some(usrS => usrS.includes(sLower) || sLower.includes(usrS))) {
      matchedStudentSkills.push(s);
    } else {
      missingSkills.push(s);
    }
  }

  if (oppSkills.length > 0) {
    const matchRatio = matchedStudentSkills.length / oppSkills.length;
    skillScore = Math.round(matchRatio * 25);
  } else {
    // If opportunity lists no explicit skill keywords, check student skill in text
    const inText = studentSkills.filter(s => oppDesc.includes(s));
    skillScore = inText.length > 0 ? 18 : 12;
  }

  if (matchedStudentSkills.length > 0) {
    reasons.push(`Key skills matched: ${matchedStudentSkills.slice(0, 3).join(', ')}`);
  }

  // --- 3. Eligibility / Student Fit (15%) ---
  let eligibilityScore = 10;
  if (isStudent && (opportunity.category === 'INTERNSHIP' || opportunity.category === 'HACKATHON' || opportunity.category === 'COMPETITION')) {
    eligibilityScore = 15;
    reasons.push('Ideal candidate fit for undergraduate/college students');
  } else if (opportunity.eligibility?.toLowerCase().includes('b.tech') || opportunity.eligibility?.toLowerCase().includes('student')) {
    eligibilityScore = 14;
    reasons.push(`Matches academic credentials (${profile.degree || 'B.Tech'})`);
  }

  // --- 4. Experience Fit (10%) ---
  let expScore = 7;
  if (opportunity.experience?.toLowerCase().includes('student') || opportunity.experience?.toLowerCase().includes('0-1')) {
    expScore = 10;
    reasons.push('Entry-level requirement: zero industry gatekeeping');
  } else if (opportunity.experience?.toLowerCase().includes('entry')) {
    expScore = 9;
  }

  // --- 5. Location Fit (10%) ---
  let locScore = 5;
  if (opportunity.remote) {
    locScore = 10;
    reasons.push('Remote flexibility: work from anywhere in India');
  } else if (oppLoc.includes(userCountry) || oppLoc.includes('india') || oppLoc.includes('bengaluru') || oppLoc.includes('hyderabad')) {
    locScore = 9;
    reasons.push(`Location matches your target hub (${opportunity.location})`);
  }

  // --- 6. Recency / Deadline (10%) ---
  let deadlineScore = 8;
  if (opportunity.daysLeft !== null && opportunity.daysLeft <= 7) {
    deadlineScore = 10;
    reasons.push('High-priority deadline: immediate action recommended');
  } else if (opportunity.deadlineUrgency === 'OPEN') {
    deadlineScore = 9;
  }

  // Aggregate Total Match Score (Clamped 0 - 100)
  const totalScore = Math.min(100, Math.max(35, careerScore + skillScore + eligibilityScore + expScore + locScore + deadlineScore));

  return {
    matchScore: totalScore,
    scoreBreakdown: {
      careerRelevance: careerScore,
      skillMatch: skillScore,
      eligibility: eligibilityScore,
      experienceFit: expScore,
      locationFit: locScore,
      recency: deadlineScore
    },
    matchedSkills: matchedStudentSkills,
    missingSkills,
    reasons: reasons.slice(0, 4),
    confidence: totalScore >= 80 ? 'HIGH' : 'ESTIMATED'
  };
}
