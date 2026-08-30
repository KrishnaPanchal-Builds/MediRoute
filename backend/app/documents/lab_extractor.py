import re
from typing import List, Dict
from app.models.clinical import LabResult

BIOMARKER_PATTERNS = {
    "fasting_blood_sugar": {
        "regex": r"(?i)fasting\s+blood\s+sugar|FBS|fasting\s+glucose",
        "unit": "mg/dL",
        "normal_range": (70.0, 100.0),
        "critical_high": 350.0
    },
    "hba1c": {
        "regex": r"(?i)HbA1c|glycated\s+haemoglobin|A1C",
        "unit": "%",
        "normal_range": (4.0, 5.7),
        "critical_high": 10.0
    },
    "ldl_cholesterol": {
        "regex": r"(?i)LDL|low\s+density\s+lipoprotein",
        "unit": "mg/dL",
        "normal_range": (0.0, 100.0),
        "critical_high": 190.0
    },
    "triglycerides": {
        "regex": r"(?i)triglycerides|TG",
        "unit": "mg/dL",
        "normal_range": (0.0, 150.0),
        "critical_high": 500.0
    },
    "serum_creatinine": {
        "regex": r"(?i)serum\s+creatinine|s\.?\s*cr",
        "unit": "mg/dL",
        "normal_range": (0.5, 1.3),
        "critical_high": 5.0
    },
    "uric_acid": {
        "regex": r"(?i)uric\s+acid|serum\s+urate",
        "unit": "mg/dL",
        "normal_range": (2.4, 7.0),
        "critical_high": 10.0
    }
}

class LabExtractor:
    """
    Key-Value Biomarker Regex Parser & Range Anomaly Detector.
    """
    def parse_text(self, text: str, report_date: str = "2026-08-30") -> List[LabResult]:
        results: List[LabResult] = []

        for key, meta in BIOMARKER_PATTERNS.items():
            pattern = meta["regex"] + r"[\s:=]+([0-9]+\.?[0-9]*)"
            match = re.search(pattern, text)
            if match:
                val = float(match.group(1))
                norm_min, norm_max = meta["normal_range"]
                
                status = "normal"
                if val > meta["critical_high"]:
                    status = "critical_high"
                elif val > norm_max:
                    status = "high"
                elif val < norm_min:
                    status = "low"

                results.append(LabResult(
                    biomarker=key,
                    numeric_value=val,
                    unit=meta["unit"],
                    status=status,
                    reference_range={"min": norm_min, "max": norm_max},
                    report_date=report_date,
                    anchor_id=f"anc_ocr_{key}"
                ))

        return results

lab_extractor = LabExtractor()
