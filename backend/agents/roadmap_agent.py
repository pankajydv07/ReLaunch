"""
Roadmap Agent — generates a personalized month-by-month learning roadmap.
"""

from services.ai_service import ask_ai_json


def generate_roadmap(profile: dict, missing_skills: list) -> list:
    """
    Generate a structured learning roadmap for the user.

    Args:
        profile: dict with user profile info
        missing_skills: list of skills the user needs to learn

    Returns:
        List of strings, e.g. ["Month 1: Python Fundamentals", "Month 2: ..."]
    """
    target_role = profile.get("target_role", "")
    previous_role = profile.get("previous_role", "")
    experience_years = profile.get("experience_years", 0)
    career_gap_years = profile.get("career_gap_years", 0)
    skills_str = ", ".join(missing_skills) if missing_skills else "general industry skills"

    prompt = f"""
You are a career coach creating a personalized learning roadmap for a woman re-entering the workforce.

User Profile:
- Previous Role: {previous_role}
- Years of Experience: {experience_years}
- Career Break: {career_gap_years} years
- Target Role: {target_role}
- Skills to Learn: {skills_str}

Create a practical month-by-month learning roadmap to help them become job-ready for "{target_role}".
The roadmap should be realistic, encouraging, and actionable.

Return a JSON array of strings. Each string is one roadmap item:
[
  "Month 1: Topic and what to focus on",
  "Month 2: Next topic",
  ...
]

Provide 4 to 6 months of roadmap. Keep each item concise (one line).
"""
    try:
        result = ask_ai_json(prompt)
        if isinstance(result, list):
            return result
        if isinstance(result, dict) and "roadmap" in result:
            return result["roadmap"]
        return []
    except Exception as e:
        raise RuntimeError(f"Roadmap generation failed: {str(e)}")
