import time
import logging

logger = logging.getLogger("MediRoute.ArbitrationEngine")

class InputArbitrationEngine:
    """
    Input Arbitration Engine — Resolves Acoustic-Noise Input Race Condition (ASR vs Touch).
    Prefers immediate Touch input, cancels pending ASR, and adjusts confidence threshold based on ambient dB noise.
    """
    def __init__(self):
        self.touch_lock: bool = False
        self.lock_timestamp: float = 0.0

    def calculate_noise_adjusted_threshold(self, ambient_rms_db: float) -> float:
        """
        Dynamic ASR Confidence Threshold Decay:
        α_threshold(t) = 0.70 + 0.15 × (RMS_ambient / 95.0)
        """
        thresh = 0.70 + 0.15 * (ambient_rms_db / 95.0)
        return min(round(thresh, 2), 0.90)

    def acquire_touch_lock(self) -> bool:
        self.touch_lock = True
        self.lock_timestamp = time.time()
        logger.info("TOUCH_LOCK acquired immediately. Cancelling ASR audio stream.")
        return True

    def reset_window(self):
        self.touch_lock = False
        self.lock_timestamp = 0.0

arbitration_engine = InputArbitrationEngine()
