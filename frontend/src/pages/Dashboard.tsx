import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Eye, ThumbsUp, TrendingUp, Activity } from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const dummyChartData = [
  { name: 'Mon', views: 4000, likes: 2400 },
  { name: 'Tue', views: 3000, likes: 1398 },
  { name: 'Wed', views: 2000, likes: 9800 },
  { name: 'Thu', views: 2780, likes: 3908 },
  { name: 'Fri', views: 1890, likes: 4800 },
  { name: 'Sat', views: 2390, likes: 3800 },
  { name: 'Sun', views: 3490, likes: 4300 },
];

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);

  const fetchData = () => {
    api.getOverview().then(res => setOverview(res.data)).catch(console.error);
    api.getPredictionHistory().then(res => {
      if (Array.isArray(res.data)) {
        setRecentPredictions(res.data.slice(0, 5));
      }
    }).catch(console.error);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-widest">[SYSTEM OVERVIEW]</h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">REALTIME PERFORMANCE METRICS & FORECASTS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="TOTAL ANALYZED" value={overview?.total_analyzed ?? 0} icon={<Activity className="text-zinc-100" />} />
        <StatCard title="AVG PREDICTED VIEWS" value={Math.round(overview?.average_predicted_views ?? 0).toLocaleString()} icon={<Eye className="text-zinc-300" />} />
        <StatCard title="AVG ENGAGEMENT" value={`${((overview?.average_predicted_engagement_rate ?? 0) * 100).toFixed(2)}%`} icon={<ThumbsUp className="text-zinc-300" />} />
        <StatCard title="SUCCESS SCORE" value={`${(overview?.average_success_score ?? 0).toFixed(1)}/100`} icon={<TrendingUp className="text-emerald-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pixel-card p-6">
          <div className="pixel-card-header mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">[WEEKLY PERFORMANCE TRENDS]</h3>
          </div>
          <div className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e4e4e7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e4e4e7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '2px solid #52525b', color: '#fff', fontFamily: 'monospace' }} />
                <Area type="step" dataKey="views" stroke="#f4f4f5" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pixel-card p-6">
          <div className="pixel-card-header mb-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">[RECENT PREDICTIONS LOG]</h3>
          </div>
          <div className="overflow-x-auto">
            {recentPredictions.length === 0 ? (
              <p className="text-zinc-500 font-mono text-xs italic py-4">[NO PREDICTIONS YET. RUN A PREDICTION TO VIEW HERE.]</p>
            ) : (
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b-2 border-zinc-800 uppercase text-xs">
                    <th className="pb-3 font-bold">Content Title</th>
                    <th className="pb-3 font-bold">Platform</th>
                    <th className="pb-3 font-bold text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recentPredictions.map((pred: any) => (
                    <tr key={pred.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 text-zinc-300 truncate max-w-[180px]">{pred.title}</td>
                      <td className="py-3 text-zinc-400">{pred.platform}</td>
                      <td className="py-3 text-right text-emerald-400 font-bold">{pred.success_score ? pred.success_score.toFixed(1) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="pixel-card p-5 flex items-start justify-between">
      <div>
        <p className="text-zinc-400 text-xs font-mono font-bold tracking-wider mb-2">{title}</p>
        <h4 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">{value}</h4>
      </div>
      <div className="p-2.5 bg-zinc-900 border border-zinc-700">
        {icon}
      </div>
    </div>
  );
}

