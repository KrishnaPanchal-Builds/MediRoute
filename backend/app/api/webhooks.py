from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/webhooks", tags=["ABDM HIE Webhooks"])

@router.post("/abdm/on-fetch-modes")
async def abdm_on_fetch_modes_webhook(payload: Dict[str, Any]):
    return {"status": "SUCCESS", "message": "ABDM Auth Modes Received"}

@router.post("/abdm/consent/request")
async def abdm_consent_request_webhook(payload: Dict[str, Any]):
    return {"status": "GRANTED", "consent_id": "abdm_consent_9910"}
