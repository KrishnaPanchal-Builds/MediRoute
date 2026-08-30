import json
import logging
from typing import Dict, Any
from app.config import settings
from app.models.session import BeliefState
from app.dialogue.slot_definitions import SLOT_CARD_OPTIONS

logger = logging.getLogger("MediRoute.LLMOrchestrator")

FALLBACK_QUESTIONS = {
    "site": {"hi": "आपका दर्द या समस्या शरीर के किस हिस्से में है?", "en": "Where is your pain or chief symptom located?"},
    "character": {"hi": "दर्द किस तरह का है — जलन, दबाव, या चुभन?", "en": "What does the pain feel like — burning, crushing, or sharp?"},
    "radiation": {"hi": "क्या दर्द हाथ, गर्दन या पीठ की तरफ फैलता है?", "en": "Does the pain radiate to your arm, jaw, neck, or back?"},
    "associations": {"hi": "क्या आपको घबराहट, पसीना या उल्टी जैसा लग रहा है?", "en": "Do you feel nausea, sweating, or shortness of breath?"},
    "onset": {"hi": "यह समस्या कब और कैसे शुरू हुई?", "en": "When and how did this problem start?"},
    "severity": {"hi": "1 से 10 के पैमाने पर दर्द कितना तेज है?", "en": "On a scale of 1 to 10, how severe is the pain?"}
}

class LLMOrchestrator:
    """
    Groq Llama-3-8B JSON-Mode Prompt Engine with Static Template Fallback.
    """
    def generate_next_turn(self, state: BeliefState, next_slot: str, language: str = "hi") -> Dict[str, Any]:
        # Attempt Groq API if key configured
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "gsk_demo_key_placeholder":
            try:
                import groq
                client = groq.Groq(api_key=settings.GROQ_API_KEY)
                prompt = f"""You are MediRoute Clinical Intake Assistant.
Target Slot: {next_slot}
Language: {language}
Current State: {state.model_dump_json()}

Respond ONLY with valid JSON:
{{
  "next_question_text": "<Question in target language>",
  "next_question_english": "<English question>",
  "slot_being_filled": "{next_slot}"
}}"""
                resp = client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    max_tokens=300,
                    temperature=0.1
                )
                res = json.loads(resp.choices[0].message.content)
                res["touch_card_options"] = SLOT_CARD_OPTIONS.get(next_slot, [])
                return res
            except Exception as e:
                logger.error(f"Groq API error ({e}). Using static template fallback.")

        # Static Template Fallback
        fallback = FALLBACK_QUESTIONS.get(next_slot, {"hi": "आप अपनी समस्या के बारे में और बताएं।", "en": "Please describe your symptom further."})
        return {
            "next_question_text": fallback.get(language, fallback["hi"]),
            "next_question_english": fallback["en"],
            "slot_being_filled": next_slot,
            "touch_card_options": SLOT_CARD_OPTIONS.get(next_slot, [])
        }

llm_orchestrator = LLMOrchestrator()
