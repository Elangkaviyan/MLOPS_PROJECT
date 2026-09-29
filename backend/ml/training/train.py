import pandas as pd
import numpy as np
import os
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import mlflow
from backend.app.models.models import MLModel

def train_model(dataset_filename: str, dataset_id: int, db_session):
    try:
        # 1. Load Data
        dataset_path = os.path.join("datasets", dataset_filename)
        df = pd.read_csv(dataset_path)
        
        # 2. Preprocessing & Feature Engineering
        categorical_features = ['platform', 'category', 'content_type']
        numeric_features = ['upload_hour', 'historical_views', 'follower_count']
        
        # We need these columns in dataset or we simulate them for training if missing
        for col in categorical_features + numeric_features + ['views', 'likes', 'comments', 'engagement_rate']:
            if col not in df.columns:
                if col in categorical_features:
                    df[col] = "Unknown"
                else:
                    df[col] = 0
                    
        X = df[categorical_features + numeric_features]
        
        # Targets
        y_views = df['views']
        y_likes = df['likes']
        y_comments = df['comments']
        y_engagement = df['engagement_rate']
        
        X_train, X_test, y_views_train, y_views_test, y_likes_train, y_likes_test, y_comments_train, y_comments_test, y_eng_train, y_eng_test = train_test_split(
            X, y_views, y_likes, y_comments, y_engagement, test_size=0.2, random_state=42
        )
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numeric_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
            ])
            
        X_train_processed = preprocessor.fit_transform(X_train)
        X_test_processed = preprocessor.transform(X_test)
        
        # MLflow Tracking
        mlflow.set_tracking_uri("sqlite:///mlflow.db")
        mlflow.set_experiment("CreatorIQ_Prediction")
        
        with mlflow.start_run():
            # 3. Model Training (Random Forest)
            model_views = RandomForestRegressor(n_estimators=50, random_state=42)
            model_views.fit(X_train_processed, y_views_train)
            
            model_likes = RandomForestRegressor(n_estimators=50, random_state=42)
            model_likes.fit(X_train_processed, y_likes_train)
            
            model_comments = RandomForestRegressor(n_estimators=50, random_state=42)
            model_comments.fit(X_train_processed, y_comments_train)
            
            model_engagement = RandomForestRegressor(n_estimators=50, random_state=42)
            model_engagement.fit(X_train_processed, y_eng_train)
            
            # 4. Evaluation (using views as primary metric for DB record)
            preds_views = model_views.predict(X_test_processed)
            mae = mean_absolute_error(y_views_test, preds_views)
            rmse = np.sqrt(mean_squared_error(y_views_test, preds_views))
            r2 = r2_score(y_views_test, preds_views)
            
            mlflow.log_metric("mae_views", mae)
            mlflow.log_metric("rmse_views", rmse)
            mlflow.log_metric("r2_views", r2)
            
            # 5. Save Artifacts
            version = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            os.makedirs("models", exist_ok=True)
            artifact_path = os.path.join("models", f"model_v{version}.joblib")
            
            joblib.dump({
                "preprocessor": preprocessor,
                "model_views": model_views,
                "model_likes": model_likes,
                "model_comments": model_comments,
                "model_engagement": model_engagement
            }, artifact_path)
            
            # 6. Database Entry
            new_model = MLModel(
                version=f"v{version}",
                name="RandomForest Multi-Target",
                dataset_id=dataset_id,
                mae=mae,
                rmse=rmse,
                r2_score=r2,
                is_active=False,
                artifact_path=artifact_path
            )
            db_session.add(new_model)
            db_session.commit()
            
    except Exception as e:
        print(f"Error during training: {e}")
