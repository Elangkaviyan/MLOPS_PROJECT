from fastapi import APIRouter, Depends, HTTPException
from backend.app.database.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.models import Prediction
from backend.app.schemas.schemas import ActualPerformanceRequest

router = APIRouter()

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    total_analyzed = db.query(Prediction).count()
    avg_pred_views = db.query(func.avg(Prediction.predicted_views)).scalar() or 0
    avg_pred_engagement = db.query(func.avg(Prediction.predicted_engagement_rate)).scalar() or 0
    avg_success_score = db.query(func.avg(Prediction.success_score)).scalar() or 0
    total_actual_views = db.query(func.sum(Prediction.actual_views)).filter(Prediction.actual_views != None).scalar() or 0
    
    return {
        "total_analyzed": total_analyzed,
        "average_predicted_views": avg_pred_views,
        "average_predicted_engagement_rate": avg_pred_engagement,
        "average_success_score": avg_success_score,
        "total_actual_views": total_actual_views
    }

@router.post("/actual-performance")
def record_actual_performance(request: ActualPerformanceRequest, db: Session = Depends(get_db)):
    prediction = db.query(Prediction).filter(Prediction.id == request.prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
        
    actual_likes = request.actual_likes if request.actual_likes is not None else round(request.actual_views * 0.05)
    actual_comments = request.actual_comments if request.actual_comments is not None else round(request.actual_views * 0.005)
    actual_engagement = request.actual_engagement_rate if request.actual_engagement_rate is not None else round((actual_likes + actual_comments) / max(request.actual_views, 1.0), 4)

    prediction.actual_views = request.actual_views
    prediction.actual_likes = actual_likes
    prediction.actual_comments = actual_comments
    prediction.actual_engagement_rate = actual_engagement
    
    db.commit()
    return {"message": "Actual performance recorded", "prediction_id": prediction.id, "actual_views": prediction.actual_views}


@router.get("/history")
def get_prediction_history(db: Session = Depends(get_db)):
    return db.query(Prediction).order_by(Prediction.created_at.desc()).all()
