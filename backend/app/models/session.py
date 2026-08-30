from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from app.models.clinical import DoshaVector, AgniClassification, KoshthaClassification, LabResult

class SlotValue(BaseModel):
    value: str
    raw_text: str
    source: Literal["voice", "touch", "lab_injection"] = "touch"
    anchor_id: Optional[str] = None
    confidence: float = 1.0

class SOCRATESBeliefState(BaseModel):
    site: Optional[SlotValue] = None
    onset: Optional[SlotValue] = None
    character: Optional[SlotValue] = None
    radiation: Optional[SlotValue] = None
    associations: List[SlotValue] = Field(default_factory=list)
    time_course: Optional[SlotValue] = None
    exacerbating: List[SlotValue] = Field(default_factory=list)
    severity: Optional[SlotValue] = None

class AyushBeliefState(BaseModel):
    agni: Optional[AgniClassification] = None
    koshtha: Optional[KoshthaClassification] = None
    dosha_vector: DoshaVector = Field(default_factory=DoshaVector)
    diet_triggers: List[str] = Field(default_factory=list)
    lifestyle_flags: List[str] = Field(default_factory=list)

class BeliefState(BaseModel):
    socrates: SOCRATESBeliefState = Field(default_factory=SOCRATESBeliefState)
    ayush: AyushBeliefState = Field(default_factory=AyushBeliefState)
    labs: List[LabResult] = Field(default_factory=list)
    turn_count: int = 0
    elapsed_ms: int = 0
    red_flag_triggered: bool = False
    completion_entropy: float = 0.0

class MessageEnvelope(BaseModel):
    type: str
    session_id: str
    turn_index: int = 0
    payload: Dict = Field(default_factory=dict)
    hmac_sig: Optional[str] = None

class SessionState(BaseModel):
    session_id: str
    session_hash: str
    language: str = "hi"
    auth_role: str = "patient"
    consent_granted: bool = False
    belief_state: BeliefState = Field(default_factory=BeliefState)
    status: Literal["init", "consent_pending", "active", "red_flag", "synthesis", "complete"] = "init"
