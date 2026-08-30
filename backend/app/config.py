try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # Server
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    HMAC_SECRET_KEY: str = "mediroute_super_secret_hmac_key_2026"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Groq API
    GROQ_API_KEY: str = "gsk_demo_key_placeholder"
    GROQ_MODEL: str = "llama3-8b-8192"
    
    # Bhashini API
    BHASHINI_API_KEY: str = "bhashini_demo_key"
    BHASHINI_PIPELINE_ID: str = "64392e2c2c9d4a0b8b6f3d9a"
    
    # Session Constraints
    MAX_SESSION_TURNS: int = 6
    MAX_SESSION_TIME_MS: int = 180000 # 3 minutes
    SESSION_TTL_SECONDS: int = 900 # 15 mins

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
