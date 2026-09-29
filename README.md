# AI Creator Success Predictor & Recommendation System

## Project Overview
CreatorIQ AI is a complete Machine Learning Operations (MLOps) project that helps social media content creators predict the potential performance of their content and receive personalized recommendations.

## Features
- **Content Success Predictor:** Predicts views, likes, comments, and engagement rate using XGBoost/RandomForest.
- **AI Recommendation System:** NLP-based title & hashtag optimization.
- **Real-Time Internet Data Ingestion:** Live fetcher connecting to YouTube & Reddit RSS/API feeds for up-to-date creator trends.
- **Continuous Training (CT) Pipeline:** Automatic retraining and auto-promotion of newly trained models when fresh data arrives.
- **GitHub Actions CI/CD Pipeline:** Automated linting, pytest suite, model validation, and Docker container build checks.
- **Dashboard & Analytics:** Interactive React/Recharts dashboard with MLflow experiment tracking.

## Technology Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **ML/MLOps:** Scikit-learn, XGBoost, MLflow, Pandas, Pytest
- **CI/CD & DevOps:** GitHub Actions, Docker, Docker Compose

## Installation & Setup

1. **Run using Docker Compose (Recommended)**
   ```bash
   docker-compose up --build
   ```

2. **Run Locally (Alternative)**
   - Backend:
     ```powershell
     $env:PYTHONPATH="E:\MLOPS PROJECT"
     .\venv\Scripts\activate
     uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

## Real-Time Data Sync & CI/CD Pipeline
- **Sync Real-Time Data:** Click **"Sync Real-Time Internet Data"** in Dataset Explorer or call `POST /api/datasets/sync_live`.
- **Automated CI/CD:** GitHub Actions pipeline configured in `.github/workflows/mlops-pipeline.yml`.
- **Run Unit Tests:**
  ```bash
  python -m pytest tests/
  ```

