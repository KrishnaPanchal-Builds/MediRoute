from typing import List, Dict

SLOT_PRIORITY_TIERS = {
    "TIER_1": ["site", "character", "radiation", "associations"],
    "TIER_2": ["onset", "severity", "time_course", "exacerbating"],
    "TIER_3": ["agni", "koshtha"],
}

SLOT_CARD_OPTIONS: Dict[str, List[Dict[str, str]]] = {
    "site": [
        {"label": "Chest / Precordial", "value": "chest/precordial", "icon": "🫀"},
        {"label": "Upper Abdomen", "value": "epigastric/upper_abdomen", "icon": "🤢"},
        {"label": "Head / Brain", "value": "head/brain", "icon": "🧠"},
        {"label": "Knee / Joint", "value": "knee/joint", "icon": "🦴"}
    ],
    "character": [
        {"label": "Burning / Amlapitta", "value": "burning/acid", "icon": "🔥"},
        {"label": "Crushing / Heavy", "value": "crushing/heavy", "icon": "⚡"},
        {"label": "Stabbing / Sharp", "value": "stabbing/sharp", "icon": "🔪"},
        {"label": "Dull Ache / Stiffness", "value": "dull_ache/stiffness", "icon": "🩹"}
    ],
    "radiation": [
        {"label": "Left Arm / Jaw", "value": "left arm/jaw/shoulder", "icon": "⚠️"},
        {"label": "Back / Spinal", "value": "back/spinal", "icon": "🦴"},
        {"label": "Stomach / Lower Abdomen", "value": "stomach/lower_abdomen", "icon": "🤢"},
        {"label": "No Radiation", "value": "none", "icon": "❌"}
    ],
    "onset": [
        {"label": "Sudden / Acute (<2 hours)", "value": "acute_sudden", "icon": "🚨"},
        {"label": "Recent (1-2 Days)", "value": "recent_2days", "icon": "📅"},
        {"label": "Gradual (Weeks)", "value": "gradual_weeks", "icon": "⏳"}
    ],
    "severity": [
        {"label": "Mild Pain (1-3/10)", "value": "3/10", "icon": "🟢"},
        {"label": "Moderate Pain (4-6/10)", "value": "6/10", "icon": "🟡"},
        {"label": "Severe Pain (7-10/10)", "value": "9/10", "icon": "🔴"}
    ]
}
