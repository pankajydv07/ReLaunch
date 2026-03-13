"""
Route: POST /analyze-profile
Combines skill gap analysis, roadmap generation, and returnship matching.
"""

import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from agents.skill_gap_agent import analyze_skill_gap
from agents.roadmap_agent import generate_roadmap
from services.ai_service import ask_ai_json

router = APIRouter()

# Path to seed data
DATA_DIR = Path(__file__).parent.parent / "data"


def _load_returnships() -> list:
    try:
        with open(DATA_DIR / "returnships.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _get_recommended_roles(profile: dict, missing_skills: list) -> list:
    """Use AI to recommend specific job roles based on the target role."""
    target_role = profile.get("target_role", "")
    skills_str = ", ".join(missing_skills[:5])

    prompt = f"""
A user is targeting the role: "{target_role}".
Skills they need to learn: {skills_str}.

List 3–4 specific job titles they could apply for (including their target and related roles).
These should be realistic roles for someone re-entering after a career break.

Return a JSON array of strings:
["Role Title 1", "Role Title 2", "Role Title 3"]
"""
    try:
        result = ask_ai_json(prompt)
        if isinstance(result, list):
            return result
        return [target_role]
    except Exception:
        return [target_role]


class UserProfile(BaseModel):
    previous_role: str = Field(..., description="e.g. Software Tester")
    experience_years: int = Field(..., ge=0, description="Years of prior experience")
    career_gap_years: int = Field(..., ge=0, description="Career break duration in years")
    skills: list[str] = Field(..., description="List of current skills")
    target_role: str = Field(..., description="Desired role to transition into")


@router.post("/analyze-profile")
async def analyze_profile(profile: UserProfile):
    profile_dict = profile.model_dump()

    try:
        # 1. Skill gap analysis
        skill_gap_result = analyze_skill_gap(profile_dict)
        missing_skills = skill_gap_result.get("missing_skills", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")

    try:
        # 2. Roadmap generation
        roadmap = generate_roadmap(profile_dict, missing_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

    try:
        # 3. Recommended roles
        recommended_roles = _get_recommended_roles(profile_dict, missing_skills)
    except Exception:
        recommended_roles = [profile.target_role]

    # 4. Returnship programs — return all (frontend can filter/display)
    returnship_programs = _load_returnships()

    return {
        "missing_skills": missing_skills,
        "roadmap": roadmap,
        "recommended_roles": recommended_roles,
        "returnship_programs": returnship_programs,
    }
