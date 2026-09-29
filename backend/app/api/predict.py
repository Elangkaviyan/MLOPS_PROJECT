from fastapi import APIRouter, Depends, HTTPException
from backend.app.schemas.schemas import PredictionRequest, PredictionResponse, RecommendationResponse
from backend.app.database.database import get_db
from sqlalchemy.orm import Session
from backend.app.models.models import Prediction
import pandas as pd
from backend.ml.inference.predictor import make_prediction
from backend.ml.features.nlp_features import generate_recommendations

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
def predict_performance(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        # Convert request to df format
        input_data = pd.DataFrame([request.dict()])
        
        # Predict using ML model
        predictions = make_prediction(input_data)
        
        db_prediction = Prediction(
            title=request.title,
            description=request.description,
            platform=request.platform,
            category=request.category,
            content_type=request.content_type,
            predicted_views=predictions['views'],
            predicted_likes=predictions['likes'],
            predicted_comments=predictions['comments'],
            predicted_engagement_rate=predictions['engagement_rate'],
            success_score=predictions['success_score']
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return PredictionResponse(
            id=db_prediction.id,
            predicted_views=predictions['views'],
            predicted_likes=predictions['likes'],
            predicted_comments=predictions['comments'],
            predicted_engagement_rate=predictions['engagement_rate'],
            success_score=predictions['success_score'],
            confidence_score=predictions.get('confidence', 0.85)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(request: PredictionRequest):
    try:
        recommendations = generate_recommendations(request.title, request.description, request.category)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
