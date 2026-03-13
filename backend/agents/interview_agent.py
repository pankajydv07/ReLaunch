"""
Interview Agent — generates interview questions and evaluates user answers.
"""

from services.ai_service import ask_ai, ask_ai_json


def generate_question(role: str) -> str:
    """
    Generate a single realistic interview question for the given role.

    Args:
        role: The job role to generate a question for

    Returns:
        A single interview question as a string
    """
    prompt = f"""
Generate one realistic, role-specific interview question for the position: "{role}".

The question should be:
- Appropriate for someone returning to work after a career break
- Practical and commonly asked in real interviews
- Clear and concise

Return ONLY the question text, nothing else. No numbering, no explanation.
"""
    try:
        return ask_ai(
            prompt,
            system_prompt="You are an experienced interviewer generating realistic interview questions.",
        )
    except Exception as e:
        raise RuntimeError(f"Question generation failed: {str(e)}")


def evaluate_answer(question: str, answer: str) -> dict:
    """
    Evaluate an interview answer and provide a score and feedback.

    Args:
        question: The interview question asked
        answer: The user's answer

    Returns:
        { "score": int (1–10), "feedback": str }
    """
    if not answer or len(answer.strip()) < 5:
        return {
            "score": 0,
            "feedback": "No answer was provided. Try to give a detailed response to the question.",
        }

    prompt = f"""
You are an expert interview coach evaluating a candidate's answer.

Interview Question: "{question}"

Candidate's Answer: "{answer}"

Evaluate the answer on a scale of 1 to 10 and provide specific, encouraging improvement feedback.
Consider:
- Relevance to the question
- Clarity and structure
- Depth of knowledge shown
- Use of examples (STAR method)

Return a JSON object with exactly this structure:
{{
  "score": 7,
  "feedback": "Your answer demonstrates good understanding of the core concept. To improve, add a specific example from your experience using the STAR method (Situation, Task, Action, Result). Also mention the tools or techniques you used."
}}
"""
    try:
        result = ask_ai_json(
            prompt,
            system_prompt="You are an expert interview coach. Evaluate answers fairly and provide constructive feedback.",
        )
        if isinstance(result, dict):
            return {
                "score": int(result.get("score", 0)),
                "feedback": str(result.get("feedback", "")),
            }
        return {"score": 0, "feedback": "Could not evaluate the answer. Please try again."}
    except Exception as e:
        raise RuntimeError(f"Answer evaluation failed: {str(e)}")
