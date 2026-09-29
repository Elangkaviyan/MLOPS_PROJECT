import React, { useState } from 'react';
import { api } from '../services/api';
import { UploadCloud, Video, Film, Award, Sparkles, CheckCircle, AlertCircle, Play } from 'lucide-react';

export default function VideoAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('Top 10 Tech Gadgets 2026 You Need!');
  const [description, setDescription] = useState('Comprehensive review of the best productivity tech gadgets coming in 2026.');
  const [platform, setPlatform] = useState('YouTube');
  const [category, setCategory] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setVideoPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select or upload a video file first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("platform", platform);
      formData.append("category", category);

      const res = await api.analyzeVideo(formData);
      setAnalysis(res.data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing video file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Video className="text-purple-500" /> Video File & Content Analyzer
          </h2>
          <p className="text-slate-400 text-sm mt-1">Upload video files for instant technical quality checks, ML view predictions & NLP recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload & Form Section */}
        <div className="glass-card p-6 space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* File Upload Box */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Video File (.mp4, .webm, .mov)</label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={36} className="mx-auto text-purple-400 mb-2" />
                {file ? (
                  <div>
                    <p className="text-slate-200 font-semibold">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-300 font-medium">Click or drag & drop video file</p>
                    <p className="text-xs text-slate-500">Supports MP4, WebM, MOV (Max 500MB)</p>
                  </div>
                )}
              </div>
            </div>

            {videoPreviewUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
                <video src={videoPreviewUrl} controls className="w-full max-h-48 object-contain" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Video Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Video Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 h-20 focus:outline-none focus:border-purple-500" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200">
                  <option>YouTube</option>
                  <option>Instagram</option>
                  <option>TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200">
                  <option>Tech</option>
                  <option>Gaming</option>
                  <option>Vlog</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={18} /> {loading ? 'Analyzing Video Content...' : 'Run Video Deep Analysis'}
            </button>
          </form>
        </div>

        {/* Results & Analysis Report */}
        <div className="space-y-6">
          {!analysis ? (
            <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <Film size={48} className="mb-4 text-slate-700" />
              <p className="text-lg font-medium text-slate-400">No Video Analyzed Yet</p>
              <p className="text-sm text-slate-500 max-w-sm mt-1">Upload a video file on the left and click 'Run Video Deep Analysis' to view specs & forecasts.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Quality & Score Overview */}
              <div className="glass-card p-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-purple-950/30 rounded-xl border border-purple-800/40 text-center">
                  <Award size={28} className="text-purple-400 mb-1" />
                  <p className="text-xs text-slate-400 uppercase font-semibold">Video Quality Score</p>
                  <h3 className="text-3xl font-extrabold text-purple-300 mt-1">{analysis.scores.overall_quality_score}/100</h3>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-blue-950/30 rounded-xl border border-blue-800/40 text-center">
                  <Play size={28} className="text-blue-400 mb-1" />
                  <p className="text-xs text-slate-400 uppercase font-semibold">Predicted Views</p>
                  <h3 className="text-3xl font-extrabold text-blue-300 mt-1">{Math.round(analysis.prediction.views).toLocaleString()}</h3>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="glass-card p-6">
                <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Film size={20} className="text-purple-400" /> Technical Video Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-xs">Resolution</span>
                    <span className="text-slate-200 font-semibold">{analysis.file_info.estimated_resolution}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-xs">Est. Duration</span>
                    <span className="text-slate-200 font-semibold">{analysis.file_info.estimated_duration_formatted}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-xs">File Size</span>
                    <span className="text-slate-200 font-semibold">{analysis.file_info.file_size_mb} MB ({analysis.file_info.format})</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-xs">Est. Bitrate</span>
                    <span className="text-slate-200 font-semibold">{analysis.file_info.bitrate}</span>
                  </div>
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div className="glass-card p-6">
                <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-400" /> Actionable Optimization Tips
                </h4>
                <ul className="space-y-3 text-sm">
                  {analysis.video_optimization_tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                  {analysis.recommendations.content_improvements.map((tip: string, idx: number) => (
                    <li key={`rec-${idx}`} className="flex items-start gap-2 text-slate-300">
                      <AlertCircle size={16} className="text-purple-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
