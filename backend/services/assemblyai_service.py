"""
AssemblyAI Speech-to-Text — REST API v2.
Upload audio → create transcript → poll until complete → return text.
"""

import os
import time
import requests


def transcribe_audio(audio_bytes: bytes, audio_suffix: str = ".webm") -> str:
    api_key = os.getenv("ASSEMBLYAI_API_KEY", "").strip()
    if not api_key or api_key == "your_assemblyai_key_here":
        raise RuntimeError("ASSEMBLYAI_API_KEY missing from .env")

    headers = {
        "authorization": api_key,
        "content-type": "application/json",
    }

    # 1. Upload
    try:
        upload_res = requests.post(
            "https://api.assemblyai.com/v2/upload",
            headers={"authorization": api_key},
            data=audio_bytes,
            timeout=60,
        )
        upload_res.raise_for_status()
        upload_url = upload_res.json()["upload_url"]
    except Exception as e:
        raise RuntimeError(f"AssemblyAI upload error: {e}")

    # 2. Submit - Fixed for latest API requirements
    # The API now enforces "speech_models" as a list for newer models.
    try:
        tx_res = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            json={
                "audio_url": upload_url,
                "speech_models": ["universal-3-pro"] # Use the latest pro model
            },
            headers=headers,
            timeout=30,
        )
        
        # Fallback if universal-3-pro isn't available for the account
        if not tx_res.ok:
            tx_res = requests.post(
                "https://api.assemblyai.com/v2/transcript",
                json={
                    "audio_url": upload_url,
                    "speech_models": ["best"]
                },
                headers=headers,
                timeout=30,
            )
            
        tx_res.raise_for_status()
        tx_id = tx_res.json()["id"]
        print(f"[AssemblyAI] Job Created: {tx_id}")
    except Exception as e:
        body = tx_res.text if 'tx_res' in locals() else ""
        raise RuntimeError(f"AssemblyAI transcript error: {e} - {body}")

    # 3. Poll
    poll_url = f"https://api.assemblyai.com/v2/transcript/{tx_id}"
    for _ in range(120):
        time.sleep(1)
        try:
            poll = requests.get(poll_url, headers={"authorization": api_key})
            res = poll.json()
            if res["status"] == "completed":
                return res["text"]
            if res["status"] == "error":
                raise RuntimeError(res["error"])
        except Exception as e:
            continue
            
    raise RuntimeError("AssemblyAI timed out.")
