from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal

class DoshaVector(BaseModel):
    vata: float = 0.0
    pitta: float = 0.0
    kapha: float = 0.0
    dominant_vikriti: str = "Balanced"

class AgniClassification(BaseModel):
    classification: Literal["Manda", "Tikshna", "Vishama", "Sama", "Inconclusive"] = "Inconclusive"
    confidence: float = 0.0
    scores: Dict[str, float] = Field(default_factory=dict)

class KoshthaClassification(BaseModel):
    classification: Literal["Krura", "Mridu", "Madhyama", "Inconclusive"] = "Inconclusive"
    confidence: float = 0.0

class LabResult(BaseModel):
    biomarker: str
    numeric_value: float
    unit: str
    status: Literal["normal", "high", "low", "critical_high", "critical_low", "unknown"]
    reference_range: Dict[str, float] = Field(default_factory=dict)
    report_date: Optional[str] = None
    anchor_id: Optional[str] = None

class RedFlagRule(BaseModel):
    rule_id: str
    name: str
    description: str
    priority: Literal["P0", "P1", "P2"]
    action: str
    triggered_slots: Dict[str, str] = Field(default_factory=dict)

class QualityMetrics(BaseModel):
    socrates_precision: float = 0.0
    socrates_recall: float = 0.0
    socrates_f1: float = 0.0
    ayush_recall: float = 0.0
    quality_flag: bool = False
