from typing import List, Dict
from app.models.clinical import DoshaVector

DOSHA_WEIGHTS: Dict[str, Dict[str, float]] = {
    "burning_sensation":    {"vata": 0.5, "pitta": 3.0, "kapha": 0.0},
    "hyperacidity":         {"vata": 0.0, "pitta": 3.5, "kapha": 0.0},
    "joint_stiffness":      {"vata": 3.0, "pitta": 0.5, "kapha": 1.0},
    "heaviness_post_meal":  {"kapha": 3.0, "vata": 0.5, "pitta": 0.0},
    "constipation_hard":    {"vata": 3.0, "pitta": 0.0, "kapha": 0.0},
    "pitta_aggravation":   {"pitta": 3.5, "vata": 0.5, "kapha": 0.0},
    "vata_aggravation":    {"vata": 3.5, "pitta": 0.0, "kapha": 0.5},
    "kapha_worsening":      {"kapha": 3.5, "pitta": 0.0, "vata": 0.5},
}

class DoshaEngine:
    """
    Ayurvedic Weighted Dosha Vector Accumulator & Vikriti Dominance Classifier.
    """
    def calculate_dosha_vector(self, indicator_tags: List[str]) -> DoshaVector:
        s_v, s_p, s_k = 0.0, 0.0, 0.0

        for tag in indicator_tags:
            tag_clean = tag.lower().strip()
            if tag_clean in DOSHA_WEIGHTS:
                weights = DOSHA_WEIGHTS[tag_clean]
                s_v += weights["vata"]
                s_p += weights["pitta"]
                s_k += weights["kapha"]

        # Classification Rule
        max_val = max(s_v, s_p, s_k)
        if max_val < 3.0:
            dominant = "Insufficient Data"
        elif s_p >= 1.5 * max(s_v, s_k):
            dominant = "Pitta-Dominant Vikriti"
        elif s_v >= 1.5 * max(s_p, s_k):
            dominant = "Vata-Dominant Vikriti"
        elif s_k >= 1.5 * max(s_v, s_p):
            dominant = "Kapha-Dominant Vikriti"
        else:
            dominant = "Mixed Vikriti"

        return DoshaVector(vata=s_v, pitta=s_p, kapha=s_k, dominant_vikriti=dominant)

dosha_engine = DoshaEngine()
