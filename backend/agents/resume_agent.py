"""
Resume Agent — analyzes a resume and provides ATS score + improvement suggestions.
"""

from services.ai_service import ask_ai_json


def analyze_resume(resume_text: str, target_role: str) -> dict:
    """
    Analyze a resume for a specific target role.

    Args:
        resume_text: Extracted text content of the resume
        target_role: The role the user is targeting

    Returns:
        {
            "ats_score": int (0–100),
            "missing_keywords": ["keyword1", ...],
            "suggestions": ["suggestion1", ...]
        }
    """
    if not resume_text or len(resume_text.strip()) < 50:
        return {
            "ats_score": 0,
            "missing_keywords": [],
            "suggestions": ["Could not extract enough text from the resume. Please upload a text-based PDF."],
        }

    # Trim very long resumes to avoid token limits
    truncated_text = resume_text[:4000] if len(resume_text) > 4000 else resume_text

    prompt = f"""
You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Target Role: {target_role}

Resume Content:
\"\"\"
{truncated_text}
\"\"\"

Analyze this resume for the target role "{target_role}" and provide:
1. An ATS compatibility score from 0 to 100
2. Important keywords/skills missing from the resume that recruiters look for
3. Specific, actionable improvement suggestions

Return a JSON object with exactly this structure:
{{
  "ats_score": 75,
  "missing_keywords": ["keyword1", "keyword2", ...],
  "suggestions": ["Clear actionable suggestion 1", "Actionable suggestion 2", ...]
}}

Provide 3–6 missing keywords and 3–5 suggestions. Be specific and constructive.
"""
    try:
        result = ask_ai_json(prompt)
        if isinstance(result, dict):
            return {
                "ats_score": int(result.get("ats_score", 0)),
                "missing_keywords": result.get("missing_keywords", []),
                "suggestions": result.get("suggestions", []),
            }
        return {"ats_score": 0, "missing_keywords": [], "suggestions": []}
    except Exception as e:
        raise RuntimeError(f"Resume analysis failed: {str(e)}")
