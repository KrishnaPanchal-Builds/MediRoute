import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.config import settings
from app.core.session_manager import session_manager
from app.core.consent_engine import consent_engine
from app.core.security import verify_hmac_signature
from app.dialogue.state_machine import clinical_fsm
from app.dialogue.llm_orchestrator import llm_orchestrator
from app.dialogue.arbitration_engine import arbitration_engine
from app.scoring.red_flag_interceptor import red_flag_interceptor

logger = logging.getLogger("MediRoute.WSGateway")
router = APIRouter()

@router.websocket("/ws/session")
async def websocket_session_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Step 1: Session Provisioning
    session = session_manager.create_session(language="hi", auth_role="patient")
    await websocket.send_json({
        "type": "consent_required",
        "session_id": session.session_id,
        "consent_statement_hi": "क्या आप अपने स्वास्थ्य संबंधी डेटा का उपयोग परामर्श के लिए करने की सहमति देते हैं?"
    })

    try:
        while True:
            raw_data = await websocket.receive_text()
            msg = json.loads(raw_data)

            m_type = msg.get("type")
            turn_idx = msg.get("turn_index", 0)
            payload = msg.get("payload", {})
            sig = msg.get("hmac_sig")

            # Verify HMAC signature
            if not verify_hmac_signature(session.session_id, turn_idx, payload, sig):
                await websocket.send_json({"type": "error", "message": "HMAC Signature Mismatch"})
                break

            # Handle Consent
            if m_type == "consent_granted":
                session.consent_granted = True
                session.status = "active"
                consent_engine.create_consent_record(session.session_id, True, session.language)
                session_manager.save_session(session)

                # Send initial turn
                next_slot = clinical_fsm.select_next_slot(session.belief_state)
                next_turn = llm_orchestrator.generate_next_turn(session.belief_state, next_slot, session.language)

                await websocket.send_json({
                    "type": "question",
                    "session_id": session.session_id,
                    "turn_index": session.belief_state.turn_count,
                    "payload": next_turn
                })

            # Handle Touch Event Input
            elif m_type == "touch_event":
                arbitration_engine.acquire_touch_lock()
                slot_id = payload.get("slot_id")
                slot_val = payload.get("value")

                # Update State Machine
                session.belief_state = clinical_fsm.update_slot(
                    session.belief_state, slot_id, slot_val, slot_val, source="touch"
                )
                session_manager.save_session(session)

                # Check Red Flags
                rf = red_flag_interceptor.evaluate(session.belief_state)
                if rf:
                    await websocket.send_json({
                        "type": "red_flag_alert",
                        "rule_id": rf.rule_id,
                        "priority": rf.priority,
                        "action": rf.action,
                        "summary": rf.description
                    })
                    break

                # Enforce Budget Constraints (6 turns / 3 mins)
                if session.belief_state.turn_count >= settings.MAX_SESSION_TURNS:
                    await websocket.send_json({
                        "type": "session_complete",
                        "reason": "Max turns reached",
                        "summary_ready": True
                    })
                    break

                # Generate Next Turn
                next_slot = clinical_fsm.select_next_slot(session.belief_state)
                if not next_slot:
                    await websocket.send_json({
                        "type": "session_complete",
                        "reason": "All mandatory slots captured",
                        "summary_ready": True
                    })
                    break

                next_turn = llm_orchestrator.generate_next_turn(session.belief_state, next_slot, session.language)
                await websocket.send_json({
                    "type": "question",
                    "session_id": session.session_id,
                    "turn_index": session.belief_state.turn_count,
                    "payload": next_turn
                })

    except WebSocketDisconnect:
        logger.info(f"WebSocket Client Disconnected. Executing Cryptographic Wipe for session: {session.session_id[:8]}...")
    finally:
        # Cryptographic Wipe on Teardown
        session_manager.cryptographic_wipe(session.session_id)
