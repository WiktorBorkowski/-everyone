import os


class Settings:
    """Minimal config container. Expand with pydantic-settings if needed."""

    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    twilio_account_sid: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_from_number: str = os.getenv("TWILIO_FROM_NUMBER", "")


settings = Settings()
