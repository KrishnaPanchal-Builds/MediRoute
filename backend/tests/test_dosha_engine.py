from app.scoring.dosha_engine import dosha_engine

def test_pitta_dominant_vikriti():
    symptoms = ["hyperacidity", "burning_sensation", "pitta_aggravation"]
    vec = dosha_engine.calculate_dosha_vector(symptoms)
    
    assert vec.pitta > vec.vata
    assert vec.pitta > vec.kapha
    assert "Pitta-Dominant" in vec.dominant_vikriti

def test_vata_dominant_vikriti():
    symptoms = ["joint_stiffness", "constipation_hard", "vata_aggravation"]
    vec = dosha_engine.calculate_dosha_vector(symptoms)
    
    assert vec.vata > vec.pitta
    assert "Vata-Dominant" in vec.dominant_vikriti

def test_insufficient_data():
    symptoms = []
    vec = dosha_engine.calculate_dosha_vector(symptoms)
    assert vec.dominant_vikriti == "Insufficient Data"
