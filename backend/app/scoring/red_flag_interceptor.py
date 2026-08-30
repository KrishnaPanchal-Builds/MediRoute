import logging
from typing import Optional, List
from app.models.session import BeliefState
from app.models.clinical import RedFlagRule

logger = logging.getLogger("MediRoute.RedFlagInterceptor")

class RedFlagInterceptor:
    """
    Deterministic Red-Flag Emergency Triage Interceptor.
    Zero ML involvement. Evaluates P0/P1 rules on every belief state update.
    """
    def __init__(self):
        self.rules = [
            {
                "rule_id": "RF-CV-001",
                "name": "Acute Coronary Syndrome",
                "description": "Crushing chest pain radiating to arm, jaw, or shoulder",
                "priority": "P0",
                "action": "EMERGENCY_TRIAGE",
                "sites": ["chest", "precordial", "sternal"],
                "characters": ["crushing", "pressure", "heavy", "dull", "tightness"],
                "radiations": ["left arm", "arm", "jaw", "neck", "shoulder"]
            },
            {
                "rule_id": "RF-NEU-001",
                "name": "Stroke / TIA",
                "description": "Facial droop, unilateral weakness, or sudden speech difficulty",
                "priority": "P0",
                "action": "EMERGENCY_TRIAGE",
                "association_keywords": ["facial droop", "arm weakness", "slurred speech", "numbness", "dysarthria", "paralysis"]
            },
            {
                "rule_id": "RF-MET-001",
                "name": "Hyperglycemic Crisis",
                "description": "Fasting blood sugar > 350 mg/dL or Random > 450 mg/dL",
                "priority": "P0",
                "action": "EMERGENCY_TRIAGE"
            }
        ]

    def evaluate(self, state: BeliefState) -> Optional[RedFlagRule]:
        socrates = state.socrates

        # Rule 1: Acute Coronary Syndrome (ACS)
        site_val = socrates.site.value.lower() if socrates.site else ""
        char_val = socrates.character.value.lower() if socrates.character else ""
        rad_val = socrates.radiation.value.lower() if socrates.radiation else ""

        if any(s in site_val for s in ["chest", "precordial"]) and \
           any(c in char_val for c in ["crushing", "heavy", "pressure", "tightness"]) and \
           any(r in rad_val for r in ["arm", "jaw", "neck", "shoulder"]):
            logger.warning("P0 RED FLAG TRIGGERED: Acute Coronary Syndrome (RF-CV-001)")
            return RedFlagRule(
                rule_id="RF-CV-001",
                name="Acute Coronary Syndrome",
                description="Crushing precordial chest pain with radiation",
                priority="P0",
                action="EMERGENCY_TRIAGE",
                triggered_slots={"site": site_val, "character": char_val, "radiation": rad_val}
            )

        # Rule 2: Stroke / TIA
        assoc_texts = [a.value.lower() for a in socrates.associations]
        if any(kw in text for text in assoc_texts for kw in ["facial droop", "slurred speech", "weakness", "paralysis"]):
            logger.warning("P0 RED FLAG TRIGGERED: Suspected Stroke / TIA (RF-NEU-001)")
            return RedFlagRule(
                rule_id="RF-NEU-001",
                name="Stroke / TIA",
                description="Acute neurological deficits reported",
                priority="P0",
                action="EMERGENCY_TRIAGE",
                triggered_slots={"associations": ", ".join(assoc_texts)}
            )

        # Rule 3: Hyperglycemic Emergency from Lab Results
        for lab in state.labs:
            if lab.biomarker == "fasting_blood_sugar" and lab.numeric_value > 350:
                return RedFlagRule(
                    rule_id="RF-MET-001",
                    name="Hyperglycemic Crisis",
                    description=f"Critical Fasting Blood Sugar ({lab.numeric_value} mg/dL)",
                    priority="P0",
                    action="EMERGENCY_TRIAGE",
                    triggered_slots={"fasting_blood_sugar": str(lab.numeric_value)}
                )

        return None

red_flag_interceptor = RedFlagInterceptor()
