"""
Route: POST /analyze-resume
Accepts a PDF file + target_role, extracts text, runs resume agent.
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from agents.resume_agent import analyze_resume
from utils.resume_parser import extract_text_from_pdf

router = APIRouter()


@router.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(..., description="Resume PDF file"),
    target_role: str = Form(..., description="Target job role"),
):
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Read file bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Extract text from PDF
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {str(e)}")

    # Analyze with AI
    try:
        result = analyze_resume(resume_text, target_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

    return result
