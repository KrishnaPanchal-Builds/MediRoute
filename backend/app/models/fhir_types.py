from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class FHIRCoding(BaseModel):
    system: str
    code: str
    display: Optional[str] = None

class FHIRCodeableConcept(BaseModel):
    coding: List[FHIRCoding] = Field(default_factory=list)
    text: Optional[str] = None

class FHIRReference(BaseModel):
    reference: str
    display: Optional[str] = None

class FHIRResource(BaseModel):
    resourceType: str
    id: str
    meta: Optional[Dict[str, Any]] = None

class FHIRComposition(FHIRResource):
    resourceType: str = "Composition"
    status: str = "preliminary"
    type: FHIRCodeableConcept
    subject: FHIRReference
    date: str
    author: List[Dict[str, str]]
    title: str
    section: List[Dict[str, Any]]

class FHIRBundle(BaseModel):
    resourceType: str = "Bundle"
    id: str
    type: str = "document"
    timestamp: str
    entry: List[Dict[str, Any]] = Field(default_factory=list)
