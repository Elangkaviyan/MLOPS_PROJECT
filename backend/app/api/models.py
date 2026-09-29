from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from backend.app.database.database import get_db
from sqlalchemy.orm import Session
from backend.app.models.models import MLModel, Dataset
from backend.ml.training.train import train_model

router = APIRouter()

@router.get("/")
def get_models(db: Session = Depends(get_db)):
    models = db.query(MLModel).all()
    return models

@router.get("/active")
def get_active_model(db: Session = Depends(get_db)):
    model = db.query(MLModel).filter(MLModel.is_active == True).first()
    if not model:
        raise HTTPException(status_code=404, detail="No active model found")
    return model

@router.post("/train")
def trigger_training(dataset_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    # Start training in background
    background_tasks.add_task(train_model, dataset.filename, dataset.id, db)
    return {"message": "Model training started in background"}

@router.post("/{model_id}/promote")
def promote_model(model_id: int, db: Session = Depends(get_db)):
    # Deactivate current
    active_models = db.query(MLModel).filter(MLModel.is_active == True).all()
    for m in active_models:
        m.is_active = False
        
    # Activate new
    model = db.query(MLModel).filter(MLModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model.is_active = True
    db.commit()
    return {"message": f"Model {model.version} promoted to active"}

@router.post("/auto-retrain")
def auto_retrain_and_promote(db: Session = Depends(get_db)):
    try:
        from backend.ml.ingestion.live_fetcher import sync_live_dataset_and_retrain
        res = sync_live_dataset_and_retrain(db, auto_promote=True)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Automated retraining failed: {str(e)}")

