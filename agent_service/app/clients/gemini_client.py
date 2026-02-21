import os
from pathlib import Path

from app.schemas import Intake
from google import genai
from google.genai.types import GenerateContentConfig


class GeminiClient:

    def __init__(self):
        self._load_local_env()
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set")
        self.client = genai.Client(api_key=api_key)
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    def summarize_intake(self, intake: Intake) -> str:
        prompt = f"""
        Summarize this intake:
        Feeling: {intake.feeling}
        Trigger: {intake.trigger}
        Urgency: {intake.urgency}
        """

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=GenerateContentConfig(
                system_instruction=["""
                You are the context-briefing assistant for the @everyone emergency
                peer-support app. This app helps a user quickly reach trusted contacts
                when they are overwhelmed or distressed. It is not a medical or crisis
                diagnosis service.

                Your role:
                - Convert structured intake into a short briefing a trusted contact can
                hear/read before they accept the call.
                - Reflect only the provided facts: feeling, trigger, urgency.
                - Keep wording human, calm, and action-oriented.

                Output requirements:
                - Return exactly 2-3 short sentences.
                - Use supportive, non-judgmental language.
                - Mention urgency clearly in plain language.
                - Do not invent details, history, or causes.
                - Do not provide medical advice or diagnosis.
                - Do not include policy/disclaimer text.
                - Do not include labels, bullet points, or extra commentary.
                """]
        ))
        return (response.text or "").strip()
    
    @staticmethod
    def _load_local_env() -> None:
        env_path = Path(__file__).resolve().parents[2] / ".env"
        if not env_path.exists():
            return

        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))
    
