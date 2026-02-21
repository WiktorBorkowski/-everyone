from app.schemas import StartActivationRequest


class ContactRouter:
    def select_contacts(self, payload: StartActivationRequest) -> list[dict]:
        """
        TODO:
        1) Pull active + consented contacts for user from Rails API/DB.
        2) Sort by tier, priority, and reliability metrics.
        3) Return normalized call targets for Twilio orchestration.
        """
        return []
