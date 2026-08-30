from app.models.session import BeliefState
from app.models.clinical import QualityMetrics

class SOCRATESCompletenessScorer:
    """
    Computes SOCRATES & Ayush precision, recall, and F1 information completeness metrics.
    """
    SOCRATES_SLOTS = ["site", "onset", "character", "radiation", "associations", "time_course", "exacerbating", "severity"]
    AYUSH_SLOTS = ["agni", "koshtha", "dosha_vector"]

    def score(self, state: BeliefState) -> QualityMetrics:
        socrates = state.socrates
        ayush = state.ayush

        filled_socrates = 0
        if socrates.site: filled_socrates += 1
        if socrates.onset: filled_socrates += 1
        if socrates.character: filled_socrates += 1
        if socrates.radiation: filled_socrates += 1
        if socrates.associations: filled_socrates += 1
        if socrates.time_course: filled_socrates += 1
        if socrates.exacerbating: filled_socrates += 1
        if socrates.severity: filled_socrates += 1

        recall_soc = round(filled_socrates / len(self.SOCRATES_SLOTS), 3)
        precision_soc = 1.0 if filled_socrates > 0 else 0.0
        f1_soc = round(2 * (precision_soc * recall_soc) / (precision_soc + recall_soc), 3) if (precision_soc + recall_soc) > 0 else 0.0

        filled_ayush = 0
        if ayush.agni and ayush.agni.classification != "Inconclusive": filled_ayush += 1
        if ayush.koshtha and ayush.koshtha.classification != "Inconclusive": filled_ayush += 1
        if ayush.dosha_vector and ayush.dosha_vector.dominant_vikriti != "Insufficient Data": filled_ayush += 1

        recall_ayush = round(filled_ayush / len(self.AYUSH_SLOTS), 3)
        quality_flag = recall_soc < 0.625

        return QualityMetrics(
            socrates_precision=precision_soc,
            socrates_recall=recall_soc,
            socrates_f1=f1_soc,
            ayush_recall=recall_ayush,
            quality_flag=quality_flag
        )

socrates_scorer = SOCRATESCompletenessScorer()
