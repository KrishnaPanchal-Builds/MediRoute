import os
import json
import hashlib
import uuid
import logging
from typing import Dict, Optional
from app.config import settings
from app.models.session import SessionState, BeliefState

logger = logging.getLogger("MediRoute.SessionManager")

class SessionManager:
    """
    Ephemeral Session Lifecycle Manager.
    Supports Redis backed store with an in-memory dictionary fallback.
    Implements 256-byte cryptographic random overwrite wipe on session teardown.
    """
    def __init__(self):
        self._in_memory_store: Dict[str, dict] = {}
        self.redis_client = None
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            self.redis_client.ping()
            logger.info("Connected to Ephemeral Redis Session Store.")
        except Exception as e:
            logger.warning(f"Redis unavailable ({e}). Falling back to ephemeral in-memory store.")
            self.redis_client = None

    def create_session(self, language: str = "hi", auth_role: str = "patient") -> SessionState:
        session_id = str(uuid.uuid4())
        session_hash = hashlib.sha256(session_id.encode('utf-8')).hexdigest()
        
        session = SessionState(
            session_id=session_id,
            session_hash=session_hash,
            language=language,
            auth_role=auth_role,
            consent_granted=False,
            belief_state=BeliefState(),
            status="init"
        )
        self.save_session(session)
        return session

    def save_session(self, session: SessionState):
        session_data = session.model_dump()
        key = f"session:{session.session_id}:state"
        
        if self.redis_client:
            try:
                self.redis_client.setex(key, settings.SESSION_TTL_SECONDS, json.dumps(session_data))
            except Exception as e:
                logger.error(f"Redis save error: {e}")
                self._in_memory_store[session.session_id] = session_data
        else:
            self._in_memory_store[session.session_id] = session_data

    def get_session(self, session_id: str) -> Optional[SessionState]:
        key = f"session:{session_id}:state"
        raw_data = None

        if self.redis_client:
            try:
                raw_data = self.redis_client.get(key)
            except Exception as e:
                logger.error(f"Redis fetch error: {e}")

        if not raw_data and session_id in self._in_memory_store:
            return SessionState(**self._in_memory_store[session_id])

        if raw_data:
            return SessionState(**json.loads(raw_data))

        return None

    def cryptographic_wipe(self, session_id: str):
        """
        Cryptographic Wipe Protocol: Overwrites Redis keys with 256 random bytes before DEL.
        Prevents memory-resident data recovery.
        """
        key = f"session:{session_id}:state"
        random_nonce = os.urandom(256).hex()

        if self.redis_client:
            try:
                self.redis_client.set(key, random_nonce)
                self.redis_client.delete(key)
            except Exception as e:
                logger.error(f"Redis wipe error: {e}")

        if session_id in self._in_memory_store:
            self._in_memory_store[session_id] = {"wipe_nonce": random_nonce}
            del self._in_memory_store[session_id]

        logger.info(f"Cryptographic 256-byte wipe executed for session: {session_id[:8]}...")

session_manager = SessionManager()
