"""
AI Service — wraps the Nebius-hosted OpenAI-compatible API.

Uses the openai Python SDK pointed at Nebius's base URL.
Model: openai/gpt-oss-20b
"""

import json
import os
import re

from openai import OpenAI

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("NEBIUS_API_KEY")
        if not api_key:
            raise RuntimeError("NEBIUS_API_KEY environment variable is not set.")
        _client = OpenAI(
            base_url="https://api.tokenfactory.nebius.com/v1/",
            api_key=api_key,
        )
    return _client


def ask_ai(prompt: str, system_prompt: str = "You are a helpful AI career assistant.") -> str:
    """Send a prompt and return the plain text response."""
    client = _get_client()
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": [{"type": "text", "text": prompt}]},
        ],
    )
    return response.choices[0].message.content.strip()


def ask_ai_json(prompt: str, system_prompt: str = "You are a helpful AI career assistant. Always respond with valid JSON only.") -> dict | list:
    """Send a prompt expecting a JSON response. Parses and returns it."""
    client = _get_client()
    full_prompt = f"{prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, no code fences."
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": [{"type": "text", "text": full_prompt}]},
        ],
    )
    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if the model wraps with them anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Last resort: try to extract the first JSON object/array from the text
        match = re.search(r"(\{.*\}|\[.*\])", raw, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        raise ValueError(f"Could not parse JSON from AI response: {raw[:300]}")
