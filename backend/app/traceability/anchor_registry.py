import uuid
from typing import Dict, Optional, Any

class AnchorRegistry:
    """
    Evidence Anchor Registry.
    Stores bounding boxes for Document OCR & audio transcript turn offsets for full clinical traceability.
    """
    def __init__(self):
        self.anchors: Dict[str, Dict[str, Any]] = {}

    def register_transcript_anchor(self, session_hash: str, turn_index: int, raw_text: str, inference: str) -> str:
        anchor_id = f"anc_{uuid.uuid4().hex[:8]}"
        self.anchors[anchor_id] = {
            "anchor_id": anchor_id,
            "type": "transcript",
            "session_hash": session_hash,
            "turn_index": turn_index,
            "raw_text": raw_text,
            "derived_inference": inference
        }
        return anchor_id

    def register_ocr_anchor(self, session_hash: str, biomarker: str, value: float, unit: str, bbox: Dict = None) -> str:
        anchor_id = f"anc_ocr_{biomarker}"
        self.anchors[anchor_id] = {
            "anchor_id": anchor_id,
            "type": "document",
            "session_hash": session_hash,
            "bounding_box": bbox or {"x1": 100, "y1": 200, "x2": 400, "y2": 220},
            "biomarker": biomarker,
            "extracted_value": f"{value} {unit}"
        }
        return anchor_id

    def get_anchor(self, anchor_id: str) -> Optional[Dict[str, Any]]:
        return self.anchors.get(anchor_id)

anchor_registry = AnchorRegistry()
