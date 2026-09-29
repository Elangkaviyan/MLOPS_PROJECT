import pytest
import pandas as pd
from backend.ml.inference.predictor import make_prediction
from backend.ml.features.nlp_features import generate_recommendations

def test_make_prediction():
    sample_df = pd.DataFrame([{
        "title": "CI/CD Test Video",
        "description": "Testing automated MLOps pipeline",
        "platform": "YouTube",
        "category": "Tech",
        "content_type": "Video",
        "video_duration": 10,
        "upload_hour": 18,
        "upload_day": 5,
        "historical_views": 50000,
        "historical_likes": 2500,
        "historical_comments": 300,
        "historical_engagement": 0.05,
        "follower_count": 100000
    }])
    
    preds = make_prediction(sample_df)
    assert "views" in preds
    assert "likes" in preds
    assert "comments" in preds
    assert "engagement_rate" in preds
    assert "success_score" in preds
    assert preds["views"] > 0

def test_generate_recommendations():
    recs = generate_recommendations("Awesome Tech Review 2026", "Check out the best gadgets", "Tech")
    assert "improved_titles" in recs
    assert "suggested_hashtags" in recs
    assert "best_posting_times" in recs
    assert len(recs["improved_titles"]) > 0
