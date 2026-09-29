from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PredictionRequest(BaseModel):
    title: str
    description: str
    platform: str
    category: str
    hashtags: str
    content_type: str
    video_duration: Optional[float] = 0
    upload_hour: int
    upload_day: int
    historical_views: float
    historical_likes: float
    historical_comments: float
    historical_engagement: float
    follower_count: int

class PredictionResponse(BaseModel):
    id: Optional[int]
    predicted_views: float
    predicted_likes: float
    predicted_comments: float
    predicted_engagement_rate: float
    success_score: float
    confidence_score: float

class RecommendationResponse(BaseModel):
    improved_titles: List[str]
    suggested_hashtags: List[str]
    best_posting_times: List[str]
    content_improvements: List[str]

class ActualPerformanceRequest(BaseModel):
    prediction_id: int
    actual_views: float
    actual_likes: Optional[float] = None
    actual_comments: Optional[float] = None
    actual_engagement_rate: Optional[float] = None

