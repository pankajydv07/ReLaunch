"""
Routes: Voice Interview Coach
POST /voice/question   — generate question + TTS
POST /voice/transcribe — STT from audio file
POST /voice/evaluate   — evaluate answer + TTS feedback
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from agents.interview_agent import evaluate_answer, generate_question
from services.assemblyai_service import transcribe_audio
from services.elevenlabs_service import audio_to_base64, text_to_speech

router = APIRouter(prefix="/voice", tags=["voice"])


# ─── Request models ────────────────────────────────────────────────────────────

class QuestionRequest(BaseModel):
    role: str


class EvaluateRequest(BaseModel):
    question: str
    transcript: str
    role: str


# ─── Helper ────────────────────────────────────────────────────────────────────

def _tts_payload(text: str) -> dict:
    """Return TTS audio as base64 or None if ElevenLabs not configured."""
    audio_bytes = text_to_speech(text)
    return {
        "audio_base64": audio_to_base64(audio_bytes) if audio_bytes else None,
        "content_type": "audio/mpeg" if audio_bytes else None,
    }


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/question")
async def voice_question(req: QuestionRequest):
    if not req.role.strip():
        raise HTTPException(400, "Role cannot be empty.")

    try:
        question = generate_question(req.role)
    except Exception as e:
        raise HTTPException(500, f"Question generation failed: {e}")

    return {"question": question, **_tts_payload(question)}


@router.post("/transcribe")
async def voice_transcribe(
    file: UploadFile = File(..., description="Recorded audio (webm/ogg/mp4)"),
):
    try:
        audio_bytes = await file.read()
    except Exception as e:
        raise HTTPException(400, f"Could not read audio file: {e}")

    if not audio_bytes:
        raise HTTPException(400, "Audio file is empty.")

    # Determine suffix from MIME type for temp file
    content_type = file.content_type or ""
    if "ogg" in content_type:
        suffix = ".ogg"
    elif "mp4" in content_type or "m4a" in content_type:
        suffix = ".mp4"
    else:
        suffix = ".webm"

    try:
        text = transcribe_audio(audio_bytes, audio_suffix=suffix)
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception as e:
        raise HTTPException(500, f"Transcription error: {e}")

    return {"transcript": text}


@router.post("/evaluate")
async def voice_evaluate(req: EvaluateRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty.")
    if not req.transcript.strip():
        raise HTTPException(400, "Transcript cannot be empty.")

    try:
        result = evaluate_answer(req.question, req.transcript)
    except Exception as e:
        raise HTTPException(500, f"Evaluation failed: {e}")

    score: int = result.get("score", 0)
    feedback: str = result.get("feedback", "")

    # Build a spoken version of the feedback
    spoken = f"I'd give this answer a {score} out of 10. {feedback}"

    return {
        "score": score,
        "feedback": feedback,
        **_tts_payload(spoken),
    }
