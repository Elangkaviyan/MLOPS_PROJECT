from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api import datasets, models, predict, analytics, videos
from backend.app.database.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CreatorIQ AI API",
    description="MLOps Backend for AI Creator Success Predictor",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(models.router, prefix="/api/models", tags=["Models"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction & Recommendation"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(videos.router, prefix="/api/videos", tags=["Video Upload & Analysis"])


import asyncio
from backend.app.database.database import SessionLocal

async def automated_retraining_loop():
    """
    Automated Continuous Training (CT) worker loop.
    Fetches real-time internet data and auto-promotes retrained models every 5 seconds.
    """
    await asyncio.sleep(2)
    while True:
        try:
            db = SessionLocal()
            try:
                from backend.ml.ingestion.live_fetcher import sync_live_dataset_and_retrain
                res = sync_live_dataset_and_retrain(db, auto_promote=True)
                print(f"[Auto CT Pipeline] Retrained & Promoted Model Version: {res.get('model_version')}")
            finally:
                db.close()
        except Exception as e:
            print(f"[Auto CT Pipeline] Worker loop warning: {e}")
        await asyncio.sleep(5)

@app.on_event("startup")
def start_automated_ct():
    asyncio.create_task(automated_retraining_loop())

@app.get("/")
def root():
    return {
        "title": "CreatorIQ AI API",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "auto_ct_active": True,
        "auto_ct_interval": "5 seconds"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CreatorIQ API is running with 5s Automated CT Pipeline."}


