from fastapi import FastAPI

from app.schemas import StartActivationRequest, StartActivationResponse
from app.services.orchestrator import ActivationOrchestrator


app = FastAPI(
    title="Everyone Agent Service",
    version="0.1.0",
    description="Minimal FastAPI service for orchestration and context generation.",
)
orchestrator = ActivationOrchestrator()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/activations/start", response_model=StartActivationResponse)
def start_activation(payload: StartActivationRequest) -> StartActivationResponse:
    return orchestrator.start(payload)


