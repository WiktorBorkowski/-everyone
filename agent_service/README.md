# Agent Service (FastAPI)

Minimal Python service scaffold for orchestration + context summarization.

## Where to write business logic

Use this structure:

- `app/main.py`: HTTP routes only (keep thin)
- `app/services/orchestrator.py`: main activation workflow
- `app/services/contact_routing.py`: ranking/selection rules for contacts
- `app/clients/gemini_client.py`: Gemini prompt + API calls
- `app/clients/twilio_client.py`: Twilio call orchestration
- `app/schemas.py`: request/response and domain payload models
- `app/config.py`: environment/config access

Recommended rule: routes should delegate to services; services call clients.

## Run locally

```bash
cd agent_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Endpoints

- `GET /health`
- `POST /v1/activations/start`

Example request:

```bash
curl -X POST http://localhost:8001/v1/activations/start \
  -H "Content-Type: application/json" \
  -d '{
    "activation_id": "act_123",
    "user_id": 1,
    "intake": {
      "feeling": "overwhelmed",
      "trigger": "panic_attack",
      "urgency": "high"
    }
  }'
```
