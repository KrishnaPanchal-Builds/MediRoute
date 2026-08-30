from typing import List, Dict
from app.models.clinical import LabResult
from app.models.session import BeliefState

class TemporalNormalizer:
    """
    Normalizes report dates and builds chronological biomarker trends.
    """
    def build_timeline(self, labs: List[LabResult]) -> List[Dict]:
        grouped: Dict[str, List] = {}
        for lab in labs:
            grouped.setdefault(lab.biomarker, []).append({
                "date": lab.report_date or "2026-08-30",
                "value": lab.numeric_value,
                "status": lab.status
            })

        timelines = []
        for bio, entries in grouped.items():
            entries_sorted = sorted(entries, key=lambda x: x["date"])
            trend = "stable"
            if len(entries_sorted) > 1:
                trend = "worsening" if entries_sorted[-1]["value"] > entries_sorted[0]["value"] else "improving"
            timelines.append({
                "biomarker": bio,
                "timeline": entries_sorted,
                "trend": trend,
                "latest_status": entries_sorted[-1]["status"]
            })
        return timelines

class CrossCorrelator:
    """
    Lab Anomaly ↔ Symptom Context Injector.
    Cross-correlates scanned lab anomalies with active SOCRATES slots.
    """
    def correlate(self, state: BeliefState):
        for lab in state.labs:
            if lab.biomarker == "hba1c" and lab.numeric_value > 7.0:
                state.ayush.lifestyle_flags.append("Uncontrolled Diabetes (HbA1c > 7.0%)")
            if lab.biomarker == "ldl_cholesterol" and lab.numeric_value > 160:
                state.ayush.lifestyle_flags.append("Elevated LDL (Hyperlipidemia Risk)")

temporal_normalizer = TemporalNormalizer()
cross_correlator = CrossCorrelator()
