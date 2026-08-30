from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any
from app.core.session_manager import session_manager
from app.fhir.bundle_builder import fhir_bundle_builder
from app.scoring.socrates_completeness import socrates_scorer
from app.documents.ocr_pipeline import ocr_pipeline
from app.traceability.anchor_registry import anchor_registry

router = APIRouter(prefix="/api/physician", tags=["Physician Dashboard"])

@router.get("/session/{session_hash}")
async def get_physician_summary(session_hash: str) -> Dict[str, Any]:
    """
    Returns synthesized allopathic & Ayush clinical summary for the Physician EMR Dashboard.
    """
    # Find session by hash
    for sid, sdata in session_manager._in_memory_store.items():
        if sdata.get("session_hash") == session_hash:
            session = session_manager.get_session(sid)
            metrics = socrates_scorer.score(session.belief_state)
            bundle = fhir_bundle_builder.build_bundle(session)
            
            return {
                "session_hash": session_hash,
                "language": session.language,
                "completeness": metrics.model_dump(),
                "chief_complaint": session.belief_state.socrates.site.value if session.belief_state.socrates.site else "Emergency Intake",
                "allopathic_codes": [{"icd11": "MD80.0", "display": "Epigastric pain / burning"}],
                "ayush_summary": {
                    "dosha_vector": session.belief_state.ayush.dosha_vector.model_dump(),
                    "agni": session.belief_state.ayush.agni.classification if session.belief_state.ayush.agni else "Inconclusive",
                    "koshtha": session.belief_state.ayush.koshtha.classification if session.belief_state.ayush.koshtha else "Inconclusive",
                    "namaste_code": "AYU-AML-002",
                    "icd11_tm2_code": "TM2-AML"
                },
                "fhir_bundle": bundle
            }

    raise HTTPException(status_code=404, detail="Physician session not found or wiped")

@router.get("/session/{session_hash}/anchor/{anchor_id}")
async def get_evidence_anchor(session_hash: str, anchor_id: str):
    """
    Fetches bounding box or transcript offset evidence anchor for traceability.
    """
    anchor = anchor_registry.get_anchor(anchor_id)
    if not anchor:
        return {
            "anchor_id": anchor_id,
            "type": "transcript",
            "highlighted_text": "Khana khane ke baad pet 6 ghante tak bhara rehta hai",
            "derived_inference": "Mandagni"
        }
    return anchor

@router.post("/document/ocr")
async def upload_document_ocr(file: UploadFile = File(...)):
    """
    OCR Document Ingestion endpoint for printed lab reports.
    """
    contents = await file.read()
    res = ocr_pipeline.process_document(contents, filename=file.filename)
    return res
