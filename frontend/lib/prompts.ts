export const SKILL_GAP_SYSTEM = `You are an expert career counselor specializing in women returning to tech after a career break. 
Analyze profiles and return ONLY valid JSON. No markdown, no explanation — pure JSON.`;

export function skillGapPrompt(profile: {
  previous_role: string;
  years_experience: number;
  break_duration: number;
  skills: string[];
  target_role: string;
}) {
  return `User profile:
- Previous Role: ${profile.previous_role}
- Years of Experience: ${profile.years_experience}
- Career Break Duration: ${profile.break_duration} year(s)
- Skills Known: ${profile.skills.join(', ')}
- Target Role: ${profile.target_role}

Return a JSON object with this EXACT structure (no extra fields):
{
  "missing_skills": ["skill1", "skill2", "skill3"],
  "known_skills": ["skill1", "skill2"],
  "roadmap": ["Month 1: ...", "Month 2: ...", "Month 3: ...", "Month 4: ...", "Month 5: ...", "Month 6: ..."],
  "recommended_roles": ["Role 1", "Role 2", "Role 3"],
  "returnship_programs": [
    { "name": "Amazon Returnship", "company": "Amazon", "url": "https://amazon.jobs/en/landing_pages/returnship" },
    { "name": "Microsoft LEAP", "company": "Microsoft", "url": "https://leap.microsoft.com/" },
    { "name": "IBM SkillsBuild", "company": "IBM", "url": "https://skillsbuild.org/" },
    { "name": "Salesforce Returnship", "company": "Salesforce", "url": "https://salesforce.com/careers" },
    { "name": "Accenture Returns", "company": "Accenture", "url": "https://accenture.com/us-en/careers/local/returns" }
  ]
}`;
}

export const RESUME_SYSTEM = `You are an expert ATS resume analyst. Analyze resumes for ATS compatibility. 
Return ONLY valid JSON. No markdown, no explanation — pure JSON.`;

export function resumePrompt(resumeText: string, targetRole: string) {
  return `Analyze this resume for the role: ${targetRole}

Resume text:
${resumeText.slice(0, 4000)}

Return a JSON object with this EXACT structure:
{
  "ats_score": 75,
  "missing_keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4"]
}`;
}

export const INTERVIEW_SYSTEM = `You are an expert technical interviewer. Generate realistic, role-specific interview questions.
Return ONLY valid JSON. No markdown, no explanation — pure JSON.`;

export function interviewQuestionPrompt(role: string) {
  return `Generate one realistic, behavioral or technical interview question for a ${role} role.
Return JSON: { "question": "Your question here?" }`;
}

export const EVALUATE_SYSTEM = `You are an expert interview coach who gives constructive, specific feedback.
Return ONLY valid JSON. No markdown, no explanation — pure JSON.`;

export function evaluateAnswerPrompt(question: string, answer: string) {
  return `Interview Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate this answer. Return JSON:
{
  "score": 7,
  "feedback": "Specific, actionable feedback in 2-3 sentences.",
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"]
}`;
}
