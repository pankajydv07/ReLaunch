"""
ElevenLabs Text-to-Speech service.
Handles transient VPN/Proxy errors by failing gracefully to text-only mode.
"""

import os
import requests
from typing import Optional

def text_to_speech(text: str) -> Optional[bytes]:
    api_key = os.getenv("ELEVENLABS_API_KEY", "").strip()
    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM").strip()

    if not api_key or api_key == "your_elevenlabs_key_here":
        return None

    # Use the most robust model for free tier
    model_id = "eleven_multilingual_v2"

    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        data = {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print(f"[ElevenLabs] Audio generated successfully.")
            return response.content
        
        # If VPN error or other rejection, log it and return None
        # We don't raise an error because the frontend can still show text.
        print(f"[ElevenLabs] Service rejected request ({response.status_code}): {response.text[:100]}")
        return None

    except Exception as e:
        print(f"[ElevenLabs] Exception: {e}")
        return None

def audio_to_base64(audio_bytes: bytes) -> str:
    import base64
    return base64.b64encode(audio_bytes).decode("utf-8")
