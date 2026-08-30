import json
import os
import logging
from typing import List, Dict

logger = logging.getLogger("MediRoute.IdiomCorpusLoader")

class IdiomCorpusLoader:
    """
    Loads vernacular folk idioms (Hindi, Marathi, Gujarati) for double-coding resolution.
    """
    def __init__(self):
        self.corpus: List[Dict] = []
        self._load_corpus()

    def _load_corpus(self):
        file_path = os.path.join(os.path.dirname(__file__), "../../data/vernacular_idioms/hindi_idioms.jsonl")
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        self.corpus.append(json.loads(line.strip()))
            logger.info(f"Loaded {len(self.corpus)} vernacular folk idiom entries.")

    def lookup(self, phrase: str) -> Optional[Dict]:
        phrase_clean = phrase.lower().strip()
        for entry in self.corpus:
            if entry["phrase"] in phrase_clean:
                return entry
        return None

idiom_loader = IdiomCorpusLoader()
