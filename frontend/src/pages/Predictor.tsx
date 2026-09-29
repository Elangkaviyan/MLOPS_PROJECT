import React, { useState } from 'react';
import { api } from '../services/api';
import { Wand2, Sparkles, TrendingUp } from 'lucide-react';

export default function Predictor() {
  const [formData, setFormData] = useState({
    title: 'Top 10 Tech Gadgets 2026',
    description: 'Here are the best gadgets you must have this year.',
    platform: 'YouTube',
    category: 'Tech',
    hashtags: '#tech #gadgets #2026',
    content_type: 'Video',
    video_duration: 10,
    upload_hour: 18,
    upload_day: 5,
    historical_views: 50000,
    historical_likes: 2500,
    historical_comments: 300,
    historical_engagement: 0.05,
    follower_count: 100000
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['upload_hour', 'upload_day', 'historical_views', 'historical_likes', 'historical_comments', 'historical_engagement', 'follower_count', 'video_duration'].includes(name) ? Number(value) : value
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const predRes = await api.predictPerformance(formData);
      setPrediction(predRes.data);
      const recRes = await api.getRecommendations(formData);
      setRecommendations(recRes.data);
    } catch (error) {
      console.error(error);
      alert("Error predicting performance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
            <Wand2 className="text-zinc-100" /> [CONTENT SUCCESS PREDICTOR]
          </h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">INPUT METADATA FOR ML MULTI-TARGET INFERENCE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="pixel-card p-6">
          <div className="pixel-card-header mb-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">[CONTENT CONFIGURATION]</h3>
          </div>
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Content Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm h-20" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Platform</label>
                <select name="platform" value={formData.platform} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm">
                  <option>YouTube</option>
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>Twitter</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm">
                  <option>Tech</option>
                  <option>Gaming</option>
                  <option>Vlog</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t-2 border-zinc-800">
              <h4 className="text-xs font-bold font-mono text-zinc-400 mb-4 uppercase">[HISTORICAL BASELINE METRICS]</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-1">FOLLOWERS</label>
                  <input type="number" name="follower_count" value={formData.follower_count} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-1">AVG VIEWS</label>
                  <input type="number" name="historical_views" value={formData.historical_views} onChange={handleChange} className="w-full pixel-input px-3 py-2 text-sm" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 pixel-btn pixel-btn-accent py-3 flex items-center justify-center gap-2">
              <Sparkles size={16} /> {loading ? '[CALCULATING INFERENCE...]' : '[EXECUTE PREDICTION]'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {prediction ? (
            <div className="pixel-card p-6 bg-zinc-950">
              <div className="pixel-card-header mb-4 flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" /> [INFERENCE RESULTS]
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-900 border-2 border-zinc-800 p-4 text-center">
                  <p className="text-zinc-500 text-xs font-mono uppercase">Predicted Views</p>
                  <p className="text-2xl font-bold font-mono text-zinc-100 mt-1">{Math.round(prediction.predicted_views).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-700 p-4 text-center">
                  <p className="text-zinc-500 text-xs font-mono uppercase">Success Score</p>
                  <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{prediction.success_score.toFixed(1)}/100</p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 p-4 text-center">
                  <p className="text-zinc-500 text-xs font-mono uppercase">Predicted Likes</p>
                  <p className="text-lg font-bold font-mono text-zinc-300 mt-1">{Math.round(prediction.predicted_likes).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 p-4 text-center">
                  <p className="text-zinc-500 text-xs font-mono uppercase">Engagement Rate</p>
                  <p className="text-lg font-bold font-mono text-zinc-300 mt-1">{(prediction.predicted_engagement_rate * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="pixel-card p-12 flex flex-col items-center justify-center text-center h-64 border-2 border-dashed border-zinc-800">
              <Wand2 size={36} className="text-zinc-700 mb-4" />
              <p className="text-zinc-500 font-mono text-sm">[FILL CONFIGURATION & RUN INFERENCE]</p>
            </div>
          )}

          {recommendations && (
            <div className="pixel-card p-6">
              <div className="pixel-card-header mb-4">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-zinc-300" /> [NLP OPTIMIZATION ENGINE]
                </h3>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">OPTIMIZED TITLES:</h4>
                  <ul className="space-y-1.5">
                    {recommendations.improved_titles.map((t: string, i: number) => (
                      <li key={i} className="text-zinc-200 bg-zinc-900 border border-zinc-700 py-1.5 px-3 text-xs">{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase mb-1">SUGGESTED HASHTAGS:</h4>
                  <p className="text-zinc-300 text-xs bg-zinc-900 border border-zinc-800 p-2">{recommendations.suggested_hashtags.join(' ')}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase mb-1">ALGORITHMIC FEEDBACK:</h4>
                  <ul className="list-square list-inside text-xs text-zinc-400 space-y-1">
                    {recommendations.content_improvements.map((t: string, i: number) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

