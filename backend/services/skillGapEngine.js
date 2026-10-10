// ==============================================================================
// NEXGUIDE LIVE — SKILL-GAP ENGINE
// Compares Student Skills against Live Opportunity Requirements.
// Identifies strengths, pinpointed gaps, and prioritized bridge actions.
// ==============================================================================

export function analyzeSkillGaps(opportunity, studentSkills = []) {
  const oppSkills = opportunity.skills || [];
  const normalizedStudent = studentSkills.map(s => s.toLowerCase().trim());

  const matched = [];
  const missing = [];

  for (const skill of oppSkills) {
    const sLower = skill.toLowerCase().trim();
    const isMatched = normalizedStudent.some(st => st === sLower || st.includes(sLower) || sLower.includes(st));
    if (isMatched) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Determine gap severity
  const matchPercentage = oppSkills.length > 0 ? Math.round((matched.length / oppSkills.length) * 100) : 75;
  let gapSeverity = 'LOW';
  let summary = '';

  if (missing.length === 0) {
    gapSeverity = 'NONE';
    summary = 'Outstanding skill alignment! Your current technical toolkit covers all listed requirements.';
  } else if (missing.length <= 2) {
    gapSeverity = 'LOW';
    summary = `Strong match overall! ${missing[0]} is your primary identified gap to bridge before applying.`;
  } else if (matchPercentage >= 40) {
    gapSeverity = 'MODERATE';
    summary = `Viable opportunity. You possess the foundational stack (${matched.slice(0, 2).join(', ')}), but should review ${missing.slice(0, 2).join(' & ')}.`;
  } else {
    gapSeverity = 'HIGH';
    summary = `Stretch opportunity. Requires significant ramp-up in ${missing.slice(0, 3).join(', ')}.`;
  }

  // Recommended bridge actions
  const recommendedLearningSteps = missing.slice(0, 3).map((gapSkill, index) => {
    return {
      step: index + 1,
      skill: gapSkill,
      action: `Review 2-hour tutorial on ${gapSkill} fundamentals`,
      deliverable: `Build a minimal 1-file demo showing ${gapSkill} integration in GitHub repo`
    };
  });

  return {
    matched,
    missing,
    matchPercentage,
    gapSeverity,
    summary,
    recommendedLearningSteps
  };
}
