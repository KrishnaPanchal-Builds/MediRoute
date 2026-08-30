import uuid
import time
import logging
from typing import Dict, Any
from app.models.session import SessionState
from app.fhir.namaste_mapper import namaste_mapper

logger = logging.getLogger("MediRoute.FHIRBundleBuilder")

class FHIRBundleBuilder:
    """
    HL7 FHIR R4 Bundle Assembler for MediRoute.
    Assembles Composition, Patient, Allopathic Condition, NAMASTE Condition, and Observation resources.
    """
    def build_bundle(self, session: SessionState) -> Dict[str, Any]:
        bundle_id = str(uuid.uuid4())
        patient_ref = f"Patient/{session.session_hash[:16]}"
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        state = session.belief_state

        entries = []

        # 1. Composition Resource
        composition = {
            "resource": {
                "resourceType": "Composition",
                "id": str(uuid.uuid4()),
                "status": "preliminary",
                "type": {
                    "coding": [{"system": "http://loinc.org", "code": "34117-2", "display": "History and physical note"}]
                },
                "subject": {"reference": patient_ref},
                "date": now_iso,
                "author": [{"display": "MediRoute AI Clinical Engine v1.0"}],
                "title": "Pre-Consultation Integrated Clinical History — MediRoute",
                "section": [
                    {"title": "Chief Complaint", "text": {"div": state.socrates.site.value if state.socrates.site else "Emergency Triage Intake"}},
                    {"title": "Allopathic SOCRATES History", "text": {"div": f"Character: {state.socrates.character.value if state.socrates.character else 'N/A'}"}},
                    {"title": "Ayush Assessment", "text": {"div": f"Vikriti: {state.ayush.dosha_vector.dominant_vikriti} | Agni: {state.ayush.agni.classification if state.ayush.agni else 'Inconclusive'}"}}
                ]
            }
        }
        entries.append(composition)

        # 2. Patient Resource (Masked ABHA Hash)
        patient = {
            "resource": {
                "resourceType": "Patient",
                "id": session.session_hash[:16],
                "identifier": [{"system": "https://abha.abdm.gov.in", "value": session.session_hash}],
                "language": session.language
            }
        }
        entries.append(patient)

        # 3. Allopathic Condition Resource (ICD-11)
        allopathic_cond = {
            "resource": {
                "resourceType": "Condition",
                "id": str(uuid.uuid4()),
                "clinicalStatus": {"coding": [{"code": "active"}]},
                "code": {
                    "coding": [{"system": "http://id.who.int/icd/release/11/mms", "code": "MD80.0", "display": "Epigastric Pain / Acute Distress"}]
                },
                "subject": {"reference": patient_ref}
            }
        }
        entries.append(allopathic_cond)

        # 4. NAMASTE Ayush Condition Resource
        namaste_ext = namaste_mapper.build_namaste_extension("AYU-AML-002", "Amlapitta", "TM2-AML")
        ayush_cond = {
            "resource": {
                "resourceType": "Condition",
                "id": str(uuid.uuid4()),
                "extension": [namaste_ext],
                "code": {"text": "Amlapitta (Hyperacidity / Pitta Aggravation)"},
                "subject": {"reference": patient_ref}
            }
        }
        entries.append(ayush_cond)

        # 5. Dashavidha Observation Resource
        dashavidha_obs = {
            "resource": {
                "resourceType": "Observation",
                "id": str(uuid.uuid4()),
                "status": "preliminary",
                "category": [{"coding": [{"code": "exam"}]}],
                "code": {"coding": [{"system": "http://namaste.ayush.gov.in/codesystem/pariksha", "code": "DASHAVIDHA-CORE4", "display": "Dashavidha Core Assessment"}]},
                "subject": {"reference": patient_ref},
                "component": [
                    {"code": {"text": "Agni"}, "valueCodeableConcept": {"text": state.ayush.agni.classification if state.ayush.agni else "Inconclusive"}},
                    {"code": {"text": "Koshtha"}, "valueCodeableConcept": {"text": state.ayush.koshtha.classification if state.ayush.koshtha else "Inconclusive"}},
                    {"code": {"text": "Dosha Vikriti Vector"}, "valueString": f"Vata:{state.ayush.dosha_vector.vata}|Pitta:{state.ayush.dosha_vector.pitta}|Kapha:{state.ayush.dosha_vector.kapha}"}
                ]
            }
        }
        entries.append(dashavidha_obs)

        # 6. Lab Observations
        for lab in state.labs:
            entries.append({
                "resource": {
                    "resourceType": "Observation",
                    "id": str(uuid.uuid4()),
                    "status": "final",
                    "category": [{"coding": [{"code": "laboratory"}]}],
                    "code": {"text": lab.biomarker},
                    "subject": {"reference": patient_ref},
                    "effectiveDateTime": lab.report_date or now_iso,
                    "valueQuantity": {"value": lab.numeric_value, "unit": lab.unit},
                    "interpretation": [{"coding": [{"code": lab.status.upper()}]}]
                }
            })

        bundle = {
            "resourceType": "Bundle",
            "id": bundle_id,
            "type": "document",
            "timestamp": now_iso,
            "entry": entries
        }

        logger.info(f"HL7 FHIR R4 Bundle created successfully with {len(entries)} resources.")
        return bundle

fhir_bundle_builder = FHIRBundleBuilder()
