from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from backend.app.database.database import get_db
from sqlalchemy.orm import Session
from backend.app.models.models import Prediction
from backend.ml.analysis.video_analyzer import analyze_video_file

router = APIRouter()

@router.post("/analyze")
async def analyze_uploaded_video(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    platform: str = Form("YouTube"),
    category: str = Form("Tech"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded video file is empty")

        analysis_result = analyze_video_file(
            file_name=file.filename,
            file_bytes=content,
            title=title,
            description=description,
            platform=platform,
            category=category
        )

        pred_data = analysis_result["prediction"]

        # Record prediction into SQLite DB
        db_pred = Prediction(
            title=title,
            description=description,
            platform=platform,
            category=category,
            content_type="Uploaded Video",
            predicted_views=pred_data["views"],
            predicted_likes=pred_data["likes"],
            predicted_comments=pred_data["comments"],
            predicted_engagement_rate=pred_data["engagement_rate"],
            success_score=pred_data["success_score"]
        )
        db.add(db_pred)
        db.commit()

        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")
