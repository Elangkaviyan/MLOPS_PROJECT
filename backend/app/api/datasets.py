from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from backend.app.database.database import get_db
from sqlalchemy.orm import Session
from backend.app.models.models import Dataset
import pandas as pd
import os

router = APIRouter()
DATASETS_DIR = "datasets"

os.makedirs(DATASETS_DIR, exist_ok=True)

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    file_path = os.path.join(DATASETS_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    df = pd.read_csv(file_path)
    
    dataset_record = Dataset(
        filename=file.filename,
        row_count=len(df),
        is_sample=False
    )
    db.add(dataset_record)
    db.commit()
    db.refresh(dataset_record)
    
    return {"message": "Dataset uploaded successfully", "dataset_id": dataset_record.id, "rows": len(df)}

@router.get("/")
def get_datasets(db: Session = Depends(get_db)):
    datasets = db.query(Dataset).all()
    return datasets

@router.post("/generate_sample")
def generate_sample_dataset(db: Session = Depends(get_db)):
    # Simple synthetic dataset logic here
    file_name = "synthetic_sample_data.csv"
    file_path = os.path.join(DATASETS_DIR, file_name)
    
    import numpy as np
    
    n_samples = 1000
    data = {
        "title": ["Sample Title " + str(i) for i in range(n_samples)],
        "description": ["Sample Description " + str(i) for i in range(n_samples)],
        "platform": np.random.choice(["YouTube", "Instagram", "TikTok"], n_samples),
        "category": np.random.choice(["Tech", "Gaming", "Vlog", "Education"], n_samples),
        "content_type": np.random.choice(["Video", "Reel", "Short"], n_samples),
        "historical_views": np.random.randint(100, 100000, n_samples),
        "follower_count": np.random.randint(50, 500000, n_samples),
        "views": np.random.randint(50, 150000, n_samples),
        "likes": np.random.randint(10, 15000, n_samples),
        "comments": np.random.randint(0, 1000, n_samples),
    }
    df = pd.DataFrame(data)
    df['engagement_rate'] = (df['likes'] + df['comments']) / df['views']
    df['engagement_rate'] = df['engagement_rate'].fillna(0)
    
    df.to_csv(file_path, index=False)
    
    dataset_record = Dataset(
        filename=file_name,
        row_count=len(df),
        is_sample=True
    )
    db.add(dataset_record)
    db.commit()
    db.refresh(dataset_record)
    
    return {"message": "Sample dataset generated", "dataset_id": dataset_record.id}

@router.post("/sync_live")
def sync_live_data(db: Session = Depends(get_db)):
    try:
        from backend.ml.ingestion.live_fetcher import sync_live_dataset_and_retrain
        result = sync_live_dataset_and_retrain(db, auto_promote=True)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live data sync failed: {str(e)}")

