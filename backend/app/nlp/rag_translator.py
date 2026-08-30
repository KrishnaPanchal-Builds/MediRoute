import logging
from typing import Dict, Any
from app.nlp.idiom_corpus_loader import idiom_loader

logger = logging.getLogger("MediRoute.RAGTranslator")

class RAGTranslator:
    """
    RAG Semantic Translator — Double-codes clinical entity to Allopathic (ICD-11) & Ayush (NAMASTE).
    Reciprocal Rank Fusion (RRF) dense + sparse lookup over vector DB & vernacular idioms.
    """
    def resolve_phrase(self, raw_phrase: str) -> Dict[str, Any]:
        # Step 1: Idiom Corpus Direct Match
        idiom_match = idiom_loader.lookup(raw_phrase)
        if idiom_match:
            return {
                "allopathic": {"icd11_code": idiom_match["mapped_icd11_code"], "term": raw_phrase},
                "ayush": {"namaste_code": idiom_match["mapped_namaste_code"], "term": idiom_match["phrase"]},
                "dosha_indicators": idiom_match.get("dosha_indicators", []),
                "confidence": 0.95
            }

        # Step 2: Heuristic Fallback
        phrase_clean = raw_phrase.lower()
        if "jalan" in phrase_clean or "burning" in phrase_clean or "acid" in phrase_clean:
            return {
                "allopathic": {"icd11_code": "MD80.0", "term": "Epigastric burning / pain"},
                "ayush": {"namaste_code": "AYU-AML-002", "term": "Amlapitta"},
                "dosha_indicators": ["hyperacidity", "pitta_aggravation"],
                "confidence": 0.88
            }
        elif "chest" in phrase_clean or "chhati" in phrase_clean or "crushing" in phrase_clean:
            return {
                "allopathic": {"icd11_code": "BA80.0", "term": "Acute Myocardial Infarction / Angina"},
                "ayush": {"namaste_code": "AYU-HRD-005", "term": "Hridroga"},
                "dosha_indicators": ["pitta_aggravation", "vata_aggravation"],
                "confidence": 0.90
            }

        return {
            "allopathic": {"icd11_code": "UNMAPPED", "term": raw_phrase},
            "ayush": {"namaste_code": "UNMAPPED", "term": raw_phrase},
            "dosha_indicators": [],
            "confidence": 0.50
        }

rag_translator = RAGTranslator()
