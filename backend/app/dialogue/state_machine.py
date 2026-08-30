import logging
from typing import Optional, Tuple
from app.models.session import BeliefState, SlotValue
from app.dialogue.slot_definitions import SLOT_PRIORITY_TIERS
from app.scoring.red_flag_interceptor import red_flag_interceptor
from app.scoring.dosha_engine import dosha_engine
from app.scoring.agni_classifier import agni_classifier, koshtha_classifier

logger = logging.getLogger("MediRoute.ClinicalFSM")

class ClinicalFSM:
    """
    Clinical State Machine (FSM). Holds BeliefState & enforces priority slot filling.
    """
    def select_next_slot(self, state: BeliefState) -> Optional[str]:
        socrates = state.socrates
        
        # Check Tier 1
        for slot in SLOT_PRIORITY_TIERS["TIER_1"]:
            if getattr(socrates, slot, None) is None:
                return slot
        
        # Check Tier 2
        for slot in SLOT_PRIORITY_TIERS["TIER_2"]:
            if getattr(socrates, slot, None) is None:
                return slot

        return None

    def update_slot(self, state: BeliefState, slot_name: str, value: str, raw_text: str, source: str = "touch") -> BeliefState:
        slot_obj = SlotValue(value=value, raw_text=raw_text, source=source)

        if hasattr(state.socrates, slot_name):
            if slot_name in ["associations", "exacerbating"]:
                current_list = getattr(state.socrates, slot_name)
                current_list.append(slot_obj)
            else:
                setattr(state.socrates, slot_name, slot_obj)

        state.turn_count += 1
        
        # Re-evaluate Red Flags
        rf = red_flag_interceptor.evaluate(state)
        if rf:
            state.red_flag_triggered = True

        # Re-evaluate Ayush Dosha, Agni, Koshtha
        extracted_texts = [raw_text, value]
        if state.socrates.character: extracted_texts.append(state.socrates.character.value)
        if state.socrates.associations: extracted_texts.extend([a.value for a in state.socrates.associations])
        
        state.ayush.dosha_vector = dosha_engine.calculate_dosha_vector(extracted_texts)
        state.ayush.agni = agni_classifier.classify(extracted_texts)
        state.ayush.koshtha = koshtha_classifier.classify(extracted_texts)

        return state

clinical_fsm = ClinicalFSM()
