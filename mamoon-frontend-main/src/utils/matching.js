export function computeMatch(candidate, job) {
  const requiredSkills = job.requiredSkills || [];
  const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
  const matchedSkills = requiredSkills.filter((s) => candidateSkillsLower.includes(s.toLowerCase()));
  const skillsScore = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 100;

  const experienceScore = Math.max(0, Math.min(100, Math.round((candidate.years / 8) * 100)));

  const traits = ["collaboration", "focus", "initiative", "resilience"];
  const targets = job.personalityTargets || {};
  const diffs = traits.map((t) => 100 - Math.abs((targets[t] ?? 70) - candidate.personality[t]));
  const personalityScore = Math.max(0, Math.min(100, Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)));

  const overall = Math.max(
    0,
    Math.min(100, Math.round(skillsScore * 0.4 + experienceScore * 0.25 + personalityScore * 0.35))
  );

  return {
    skillsScore,
    experienceScore,
    personalityScore,
    overall,
    matchedSkills,
  };
}

export function rankCandidates(candidatePool, job) {
  return candidatePool
    .map((candidate) => ({ candidate, match: computeMatch(candidate, job) }))
    .sort((a, b) => b.match.overall - a.match.overall);
}
