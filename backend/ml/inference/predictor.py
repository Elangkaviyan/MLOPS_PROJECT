import pandas as pd
import joblib
import os
from backend.app.database.database import SessionLocal
from backend.app.models.models import MLModel

def get_active_model_path():
    db = SessionLocal()
    model = db.query(MLModel).filter(MLModel.is_active == True).first()
    db.close()
    if model and model.artifact_path and os.path.exists(model.artifact_path):
        return model.artifact_path
    return None

def make_prediction(input_data: pd.DataFrame):
    model_path = get_active_model_path()
    
    # If no model is active or trained yet, return dummy/baseline predictions
    if not model_path:
        views = float(input_data['historical_views'].iloc[0]) * 1.1
        likes = float(input_data['historical_likes'].iloc[0]) * 1.1
        comments = float(input_data['historical_comments'].iloc[0]) * 1.1
        engagement_rate = float(input_data['historical_engagement'].iloc[0]) * 1.05
    else:
        # Load preprocessor and models (Assuming dict format for simplicity)
        artifacts = joblib.load(model_path)
        preprocessor = artifacts['preprocessor']
        
        # Ensure correct features
        features = input_data[['platform', 'category', 'content_type', 'upload_hour', 
                               'historical_views', 'follower_count']]
                               
        processed_features = preprocessor.transform(features)
        
        views = float(artifacts['model_views'].predict(processed_features)[0])
        likes = float(artifacts['model_likes'].predict(processed_features)[0])
        comments = float(artifacts['model_comments'].predict(processed_features)[0])
        engagement_rate = float(artifacts['model_engagement'].predict(processed_features)[0])
    
    # Calculate success score (0-100)
    # Simple heuristic for baseline, complex if real model
    success_score = min(100.0, max(0.0, (views / max(1, float(input_data['follower_count'].iloc[0]))) * 100))
    
    return {
        'views': views,
        'likes': likes,
        'comments': comments,
        'engagement_rate': engagement_rate,
        'success_score': success_score,
        'confidence': 0.85
    }
