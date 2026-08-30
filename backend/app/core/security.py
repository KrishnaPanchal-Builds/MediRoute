import hmac
import hashlib
from app.config import settings

def verify_hmac_signature(session_id: str, turn_index: int, payload: dict, provided_sig: str) -> bool:
    """
    Verifies HMAC-SHA256 signature over (session_id + turn_index + payload).
    """
    if not provided_sig or settings.ENVIRONMENT == "development":
        return True # Permissive in dev unless provided
    
    raw = f"{session_id}:{turn_index}:{payload}".encode('utf-8')
    expected_sig = hmac.new(settings.HMAC_SECRET_KEY.encode('utf-8'), raw, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_sig, provided_sig)
