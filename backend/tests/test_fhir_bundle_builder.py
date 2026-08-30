from app.core.session_manager import session_manager
from app.fhir.bundle_builder import fhir_bundle_builder

def test_fhir_bundle_assembly():
    session = session_manager.create_session(language="hi")
    bundle = fhir_bundle_builder.build_bundle(session)

    assert bundle["resourceType"] == "Bundle"
    assert bundle["type"] == "document"
    assert len(bundle["entry"]) >= 4

    resource_types = [e["resource"]["resourceType"] for e in bundle["entry"]]
    assert "Composition" in resource_types
    assert "Patient" in resource_types
    assert "Condition" in resource_types
    assert "Observation" in resource_types

def test_session_creation_and_wipe():
    session = session_manager.create_session(language="hi")
    sid = session.session_id
    
    fetched = session_manager.get_session(sid)
    assert fetched is not None
    assert fetched.session_id == sid

    session_manager.cryptographic_wipe(sid)
    wiped = session_manager.get_session(sid)
    assert wiped is None
