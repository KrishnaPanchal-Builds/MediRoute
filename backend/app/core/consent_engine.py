import hashlib
import time
import logging
from typing import Dict

logger = logging.getLogger("MediRoute.ConsentEngine")

class ConsentEngine:
    """
    DPDP Act 2023 Consent Workflow Manager.
    Logs immutable SHA-256 hashed audit events (zero plaintext PHI in consent logs).
    """
    def __init__(self):
        self.consent_log: list = []

    def create_consent_record(self, session_id: str, consent_granted: bool, language: str = "hi") -> Dict:
        session_hash = hashlib.sha256(session_id.encode('utf-8')).hexdigest()
        record = {
            "session_hash": session_hash,
            "consent_granted": consent_granted,
            "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "language": language,
            "consent_version": "v1.2-DPDP-2023"
        }
        self.consent_log.append(record)
        logger.info(f"DPDP Consent Record created: session_hash={session_hash[:8]}... granted={consent_granted}")
        return record

consent_engine = ConsentEngine()
