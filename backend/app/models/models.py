from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database.database import Base

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    row_count = Column(Integer)
    is_sample = Column(Boolean, default=False)
    is_live = Column(Boolean, default=False)
    source_url = Column(String, nullable=True)


class MLModel(Base):
    __tablename__ = "models"
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, unique=True, index=True)
    name = Column(String)
    trained_at = Column(DateTime, default=datetime.utcnow)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    mae = Column(Float)
    rmse = Column(Float)
    r2_score = Column(Float)
    is_active = Column(Boolean, default=False)
    artifact_path = Column(String)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    platform = Column(String)
    category = Column(String)
    content_type = Column(String)
    predicted_views = Column(Float)
    predicted_likes = Column(Float)
    predicted_comments = Column(Float)
    predicted_engagement_rate = Column(Float)
    success_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Track actuals
    actual_views = Column(Float, nullable=True)
    actual_likes = Column(Float, nullable=True)
    actual_comments = Column(Float, nullable=True)
    actual_engagement_rate = Column(Float, nullable=True)
