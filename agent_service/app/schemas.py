from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class Intake(BaseModel):
    feeling: str = Field(..., examples=["overwhelmed"])
    trigger: str = Field(..., examples=["panic_attack"])
    urgency: Literal["low", "medium", "high"]


class StartActivationRequest(BaseModel):
    activation_id: str
    user_id: int
    intake: Intake


class StartActivationResponse(BaseModel):
    activation_id: str
    status: Literal["accepted"]
    summary_text: str
    started_at: datetime
