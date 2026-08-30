from typing import List
from app.models.clinical import AgniClassification, KoshthaClassification

class AgniClassifier:
    """
    Agni (Digestive Fire) Classifier: Mandagni, Tikshnagni, Vishamagni, Samagni.
    """
    def classify(self, symptoms: List[str]) -> AgniClassification:
        scores = {"Mandagni": 0.0, "Tikshnagni": 0.0, "Vishamagni": 0.0, "Samagni": 0.0}
        
        for s in symptoms:
            sl = s.lower()
            if any(k in sl for k in ["heaviness", "sour", "acid", "sluggish", "bloating", "fullness"]):
                scores["Mandagni"] += 2.0
            if any(k in sl for k in ["burning", "intense hunger", "hyperacidity", "sharp"]):
                scores["Tikshnagni"] += 2.0
            if any(k in sl for k in ["irregular", "variable", "sometimes full", "gas"]):
                scores["Vishamagni"] += 2.0
            if any(k in sl for k in ["normal", "regular", "good digestion"]):
                scores["Samagni"] += 2.0

        best_class = max(scores, key=scores.get)
        max_score = scores[best_class]
        
        if max_score < 2.0:
            return AgniClassification(classification="Inconclusive", confidence=0.0, scores=scores)
        
        total = sum(scores.values())
        confidence = round(max_score / total, 2) if total > 0 else 0.0
        return AgniClassification(classification=best_class, confidence=confidence, scores=scores)

class KoshthaClassifier:
    """
    Koshtha (Bowel Habit) Classifier: Krura (Hard/Vata), Mridu (Soft/Pitta), Madhyama (Balanced).
    """
    def classify(self, symptoms: List[str]) -> KoshthaClassification:
        krura, mridu, madhyama = 0.0, 0.0, 0.0
        
        for s in symptoms:
            sl = s.lower()
            if any(k in sl for k in ["constipation", "hard stool", "straining"]):
                krura += 2.0
            if any(k in sl for k in ["loose", "frequent", "diarrhea", "soft"]):
                mridu += 2.0
            if any(k in sl for k in ["regular stool", "daily", "normal bowel"]):
                madhyama += 2.0

        if max(krura, mridu, madhyama) < 2.0:
            return KoshthaClassification(classification="Inconclusive", confidence=0.0)

        if krura > max(mridu, madhyama):
            return KoshthaClassification(classification="Krura", confidence=0.85)
        elif mridu > max(krura, madhyama):
            return KoshthaClassification(classification="Mridu", confidence=0.85)
        else:
            return KoshthaClassification(classification="Madhyama", confidence=0.90)

agni_classifier = AgniClassifier()
koshtha_classifier = KoshthaClassifier()
