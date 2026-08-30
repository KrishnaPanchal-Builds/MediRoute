import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import ws_gateway, rest_physician, webhooks

# Configure Logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MediRoute.Backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("⚡ Starting MediRoute Integrated Clinical Intelligence Backend Server...")
    logger.info(f"Running on environment: {settings.ENVIRONMENT} | Port: {settings.PORT}")
    yield
    logger.info("🛑 Shutting down MediRoute Backend Server...")

app = FastAPI(
    title="MediRoute — Integrated Clinical Intelligence Engine API",
    description="Production-grade FastAPI backend for MediRoute (SIH Problem Statement ID26047 | Ministry of Ayush / AIIA)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Frontend Next.js / Static UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ws_gateway.router)
app.include_router(rest_physician.router)
app.include_router(webhooks.router)

@app.get("/")
async def root_health_check():
    return {
        "status": "HEALTHY",
        "service": "MediRoute Clinical Intelligence Backend",
        "version": "1.0.0",
        "sih_problem_statement": "ID26047 — Ministry of Ayush / AIIA"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
