from typing import Dict, Any

class NAMASTEMapper:
    """
    Injects NAMASTE Ayurvedic Morbidity Codes & WHO ICD-11 TM2 Extensions into FHIR Conditions.
    """
    def build_namaste_extension(self, namaste_code: str, namaste_term: str, icd11_tm2_code: str = "") -> Dict[str, Any]:
        return {
            "url": "http://namaste.ayush.gov.in/fhir/StructureDefinition/ayush-condition",
            "extension": [
                {
                    "url": "namasteCode",
                    "valueCodeableConcept": {
                        "coding": [{
                            "system": "http://namaste.ayush.gov.in/codesystem",
                            "code": namaste_code,
                            "display": namaste_term
                        }]
                    }
                },
                {
                    "url": "icd11TM2Code",
                    "valueString": icd11_tm2_code
                }
            ]
        }

namaste_mapper = NAMASTEMapper()
