import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const getOverview = () => axiosInstance.get('/analytics/overview');
export const getDatasets = () => axiosInstance.get('/datasets');
export const generateSampleDataset = () => axiosInstance.post('/datasets/generate_sample');
export const getModels = () => axiosInstance.get('/models');
export const trainModel = (datasetId: number) => axiosInstance.post(`/models/train?dataset_id=${datasetId}`);
export const predictPerformance = (data: any) => axiosInstance.post('/predict', data);
export const getRecommendations = (data: any) => axiosInstance.post('/predict/recommendations', data);
export const getPredictionHistory = () => axiosInstance.get('/analytics/history');

export const syncLiveDataset = () => axiosInstance.post('/datasets/sync_live');
export const analyzeVideo = (formData: FormData) => axiosInstance.post('/videos/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const recordActualPerformance = (data: {
  prediction_id: number;
  actual_views: number;
  actual_likes?: number;
  actual_comments?: number;
  actual_engagement_rate?: number;
}) => axiosInstance.post('/analytics/actual-performance', data);

export const autoRetrainModel = () => axiosInstance.post('/models/auto-retrain');

export const api = Object.assign(axiosInstance, {
  getOverview,
  getDatasets,
  generateSampleDataset,
  syncLiveDataset,
  getModels,
  trainModel,
  autoRetrainModel,
  predictPerformance,
  getRecommendations,
  getPredictionHistory,
  analyzeVideo,
  recordActualPerformance,
});



export default api;


