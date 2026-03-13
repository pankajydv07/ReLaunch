"""
Skill Gap Agent — analyzes which skills a user is missing for their target role.
"""

from services.ai_service import ask_ai_json


def analyze_skill_gap(profile: dict) -> dict:
    """
    Analyze the skill gap between a user's current skills and their target role.

    Args:
        profile: dict with keys:
            - previous_role (str)
            - experience_years (int)
            - career_gap_years (int)
            - skills (list[str])
            - target_role (str)

    Returns:
        { "missing_skills": ["Python", "Selenium", ...] }
    """
    previous_role = profile.get("previous_role", "")
    experience_years = profile.get("experience_years", 0)
    career_gap_years = profile.get("career_gap_years", 0)
    skills = ", ".join(profile.get("skills", []))
    target_role = profile.get("target_role", "")

    prompt = f"""
You are a career coach specializing in helping women re-enter the workforce.

A user has the following profile:
- Previous Role: {previous_role}
- Years of Experience: {experience_years}
- Career Break Duration: {career_gap_years} years
- Current Skills: {skills}
- Target Role: {target_role}

Identify the most important skills that are MISSING from their profile but required for the target role "{target_role}".
Focus on practical, industry-standard skills that employers look for today.

Return a JSON object with exactly this structure:
{{
  "missing_skills": ["skill1", "skill2", "skill3", ...]
}}

List between 5 and 10 missing skills. Be specific (e.g., "Selenium WebDriver" not just "testing").
"""
    try:
        result = ask_ai_json(prompt)
        if isinstance(result, dict) and "missing_skills" in result:
            return result
        return {"missing_skills": []}
    except Exception as e:
        raise RuntimeError(f"Skill gap analysis failed: {str(e)}")
