import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Database, Upload, PlayCircle, Globe, RefreshCw } from 'lucide-react';

export default function DatasetExplorer() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingLive, setSyncingLive] = useState(false);

  useEffect(() => {
    fetchDatasets();
    const interval = setInterval(fetchDatasets, 5000);
    return () => clearInterval(interval);
  }, []);


  const fetchDatasets = async () => {
    try {
      const res = await api.getDatasets();
      setDatasets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateSample = async () => {
    setLoading(true);
    try {
      await api.generateSampleDataset();
      await fetchDatasets();
    } catch (error) {
      alert("Error generating sample data");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLive = async () => {
    setSyncingLive(true);
    try {
      const res = await api.syncLiveDataset();
      alert(`Live Internet Data Synced!\n${res.data.rows_synced} trending creator posts fetched.\nModel ${res.data.model_version || ''} automatically trained & promoted via CI/CD Continuous Training!`);
      await fetchDatasets();
    } catch (error) {
      console.error(error);
      alert("Error syncing live internet data");
    } finally {
      setSyncingLive(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="text-blue-500" /> Dataset Explorer
          </h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Real-Time Internet Ingestion & Automated Model Pipeline Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncLive}
            disabled={syncingLive}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <RefreshCw size={18} className={syncingLive ? "animate-spin" : ""} />
            {syncingLive ? 'Fetching Internet Data & Retraining...' : 'Sync Real-Time Internet Data'}
          </button>

          <button 
            onClick={handleGenerateSample}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-slate-700"
          >
            <PlayCircle size={18} /> {loading ? 'Generating...' : 'Generate Synthetic Sample'}
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 mb-8 cursor-pointer hover:bg-slate-800 transition-colors text-slate-400">
          <div className="text-center">
            <Upload size={32} className="mx-auto mb-2 text-slate-500" />
            <p>Click or drag CSV file to upload</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-200 mb-4">Available Datasets</h3>
        {datasets.length === 0 ? (
          <p className="text-slate-400 italic">No datasets available. Sync live internet data or generate a sample to start.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Filename</th>
                  <th className="pb-3 font-medium">Rows</th>
                  <th className="pb-3 font-medium">Data Origin</th>
                  <th className="pb-3 font-medium">Uploaded Date</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(datasets) ? datasets : []).map((d: any) => (
                  <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-4 text-slate-200 font-medium flex items-center gap-2">
                      {d.is_live && <Globe size={16} className="text-purple-400" />}
                      {d.filename}
                    </td>
                    <td className="py-4 text-slate-300">{d.row_count}</td>
                    <td className="py-4">
                      {d.is_live ? (
                        <span className="bg-purple-900/40 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                          Live Internet Feed
                        </span>
                      ) : d.is_sample ? (
                        <span className="bg-yellow-900/40 text-yellow-500 px-2.5 py-1 rounded-full text-xs font-medium">Synthetic Data</span>
                      ) : (
                        <span className="bg-green-900/40 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium">Uploaded CSV</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-400 text-sm">{new Date(d.uploaded_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

