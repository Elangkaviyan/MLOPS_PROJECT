import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart3, TrendingUp, TrendingDown, CheckSquare, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Analytics() {
  const [history, setHistory] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [actualInput, setActualInput] = useState<string>('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.getPredictionHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveActual = async (id: number) => {
    const actualVal = Number(actualInput);
    if (isNaN(actualVal) || actualVal <= 0) return alert("Please enter valid actual view count");
    try {
      await api.recordActualPerformance({
        prediction_id: id,
        actual_views: actualVal
      });
      setEditingId(null);
      setActualInput('');
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Error recording actual performance");
    }
  };

  const chartData = (Array.isArray(history) ? history : []).map((item: any, i) => ({
    name: `P${i + 1}`,
    predicted: item.predicted_views,
    actual: item.actual_views || 0,
    hasActual: item.actual_views !== null
  })).reverse().slice(-10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="text-zinc-100" /> [CONTENT PERFORMANCE ANALYTICS]
          </h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">COMPARE PREDICTED VS ACTUAL METRICS & RECORD POSTED PERFORMANCE</p>
        </div>
      </div>

      <div className="pixel-card p-6">
        <div className="pixel-card-header mb-4">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">[PREDICTED VS ACTUAL VIEWS COMPARISON]</h3>
        </div>
        <div className="h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="2 2" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
              <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '2px solid #52525b', color: '#fff', fontFamily: 'monospace' }} />
              <Legend />
              <Line type="step" dataKey="predicted" name="Predicted Views" stroke="#e4e4e7" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="step" dataKey="actual" name="Actual Published Views" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pixel-card p-6">
        <div className="pixel-card-header mb-4">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">[PREDICTION HISTORY & ACTUALS UPDATE LOG]</h3>
        </div>
        {history.length === 0 ? (
          <p className="text-zinc-500 font-mono text-xs italic py-4">[NO PREDICTIONS RECORDED YET]</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead>
                <tr className="text-zinc-500 border-b-2 border-zinc-800 uppercase text-xs">
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Title</th>
                  <th className="pb-3 font-bold">Predicted Views</th>
                  <th className="pb-3 font-bold">Actual Published Views</th>
                  <th className="pb-3 font-bold">Error Rate</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {history.map((h: any) => {
                  const hasActual = h.actual_views !== null && h.actual_views !== undefined;
                  const errorRate = hasActual ? (Math.abs(h.predicted_views - h.actual_views) / h.actual_views * 100).toFixed(1) + '%' : '-';
                  const isEditing = editingId === h.id;

                  return (
                    <tr key={h.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 text-zinc-400 text-xs">{new Date(h.created_at).toLocaleDateString()}</td>
                      <td className="py-3 text-zinc-200 font-medium truncate max-w-[200px]">{h.title}</td>
                      <td className="py-3 text-zinc-100 font-bold">{Math.round(h.predicted_views).toLocaleString()}</td>
                      <td className="py-3">
                        {isEditing ? (
                          <input 
                            type="number" 
                            placeholder="Enter views" 
                            value={actualInput} 
                            onChange={e => setActualInput(e.target.value)} 
                            className="pixel-input px-2 py-1 text-xs w-28"
                          />
                        ) : hasActual ? (
                          <span className="text-emerald-400 font-bold">{h.actual_views.toLocaleString()}</span>
                        ) : (
                          <span className="text-amber-400 text-xs bg-amber-900/30 px-2 py-0.5 border border-amber-500/30">[PENDING POSTING]</span>
                        )}
                      </td>
                      <td className="py-3 text-xs">
                        {hasActual ? (
                          <span className={`inline-flex items-center gap-1 ${h.predicted_views > h.actual_views ? 'text-zinc-400' : 'text-emerald-400'}`}>
                            {h.predicted_views > h.actual_views ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {errorRate}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <button 
                            onClick={() => handleSaveActual(h.id)} 
                            className="pixel-btn pixel-btn-accent text-xs px-2 py-1"
                          >
                            <CheckSquare size={14} className="inline mr-1" /> SAVE
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setEditingId(h.id); setActualInput(h.actual_views ? String(h.actual_views) : ''); }} 
                            className="pixel-btn text-xs px-2 py-1"
                          >
                            <Edit3 size={14} className="inline mr-1" /> {hasActual ? 'UPDATE' : 'SET ACTUAL'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

