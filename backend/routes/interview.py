"""
Routes: POST /interview-question, POST /evaluate-answer
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from agents.interview_agent import evaluate_answer, generate_question

router = APIRouter()


class InterviewQuestionRequest(BaseModel):
    role: str = Field(..., description="Job role to generate a question for")


class EvaluateAnswerRequest(BaseModel):
    question: str = Field(..., description="The interview question")
    answer: str = Field(..., description="The candidate's answer")


@router.post("/interview-question")
async def interview_question(request: InterviewQuestionRequest):
    if not request.role.strip():
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    try:
        question = generate_question(request.role)
        return {"question": question}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/evaluate-answer")
async def evaluate_answer_endpoint(request: EvaluateAnswerRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not request.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")

    try:
        result = evaluate_answer(request.question, request.answer)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Answer evaluation failed: {str(e)}")
