from app.models.session import BeliefState, SlotValue
from app.scoring.red_flag_interceptor import red_flag_interceptor

def test_acs_red_flag_trigger():
    state = BeliefState()
    state.socrates.site = SlotValue(value="precordial chest", raw_text="chest")
    state.socrates.character = SlotValue(value="crushing pressure", raw_text="crushing")
    state.socrates.radiation = SlotValue(value="left arm and jaw", raw_text="arm")

    rf = red_flag_interceptor.evaluate(state)
    assert rf is not None
    assert rf.rule_id == "RF-CV-001"
    assert rf.priority == "P0"
    assert rf.action == "EMERGENCY_TRIAGE"

def test_stroke_red_flag_trigger():
    state = BeliefState()
    state.socrates.associations.append(SlotValue(value="facial droop and slurred speech", raw_text="facial droop"))

    rf = red_flag_interceptor.evaluate(state)
    assert rf is not None
    assert rf.rule_id == "RF-NEU-001"
    assert rf.priority == "P0"

def test_no_red_flag_for_normal_symptom():
    state = BeliefState()
    state.socrates.site = SlotValue(value="knee joint", raw_text="knee")
    state.socrates.character = SlotValue(value="dull stiffness", raw_text="dull")

    rf = red_flag_interceptor.evaluate(state)
    assert rf is None
