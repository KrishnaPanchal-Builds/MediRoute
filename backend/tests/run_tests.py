import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tests.test_red_flag_interceptor import test_acs_red_flag_trigger, test_stroke_red_flag_trigger, test_no_red_flag_for_normal_symptom
from tests.test_dosha_engine import test_pitta_dominant_vikriti, test_vata_dominant_vikriti, test_insufficient_data
from tests.test_fhir_bundle_builder import test_fhir_bundle_assembly, test_session_creation_and_wipe

print("Running MediRoute Backend Test Suite...")

try:
    test_acs_red_flag_trigger()
    print("  [PASS] test_acs_red_flag_trigger")
    test_stroke_red_flag_trigger()
    print("  [PASS] test_stroke_red_flag_trigger")
    test_no_red_flag_for_normal_symptom()
    print("  [PASS] test_no_red_flag_for_normal_symptom")
    test_pitta_dominant_vikriti()
    print("  [PASS] test_pitta_dominant_vikriti")
    test_vata_dominant_vikriti()
    print("  [PASS] test_vata_dominant_vikriti")
    test_insufficient_data()
    print("  [PASS] test_insufficient_data")
    test_fhir_bundle_assembly()
    print("  [PASS] test_fhir_bundle_assembly")
    test_session_creation_and_wipe()
    print("  [PASS] test_session_creation_and_wipe")
    print("\nALL 8 BACKEND TESTS PASSED CLEANLY!")
except Exception as e:
    print(f"\n[FAIL] Test Failure: {e}")
    sys.exit(1)
