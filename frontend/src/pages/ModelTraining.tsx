import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity, Play, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

export default function ModelTraining() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<number | ''>('');
  const [training, setTraining] = useState(false);
  const [autoRetraining, setAutoRetraining] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const dsRes = await api.getDatasets();
      setDatasets(dsRes.data);
      const modRes = await api.getModels();
      setModels(modRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrain = async () => {
    if (!selectedDataset) return alert("Select dataset first");
    setTraining(true);
    try {
      await api.trainModel(Number(selectedDataset));
      alert("Training started in background!");
      setTimeout(fetchData, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setTraining(false);
    }
  };

  const handleAutoRetrain = async () => {
    setAutoRetraining(true);
    try {
      await api.autoRetrainModel();
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setAutoRetraining(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
            <Activity className="text-zinc-100" /> [MODEL TRAINING & REGISTRY PIPELINE]
          </h2>
          <p className="text-emerald-400 text-xs font-mono mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AUTOMATED CONTINUOUS TRAINING ACTIVE (RETRAINING & AUTO-PROMOTING EVERY 5 SECONDS)
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="pixel-card p-6 md:col-span-1 border-t-4 border-zinc-500 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">[AUTOMATED CI/CD RETRAIN]</h3>
            <button 
              onClick={handleAutoRetrain}
              disabled={autoRetraining}
              className="w-full pixel-btn pixel-btn-accent py-3 flex justify-center items-center gap-2 text-xs"
            >
              <Zap size={16} /> {autoRetraining ? '[INGESTING & RETRAINING...]' : '[AUTO RETRAIN & PROMOTE LIVE]'}
            </button>
            <p className="text-zinc-500 text-xs font-mono mt-2">
              Automatically ingests live YouTube/Reddit trends, trains Random Forest model, and promotes the best model version.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">[MANUAL DATASET RETRAIN]</h3>
            <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase">Select Training Dataset</label>
            <select 
              className="w-full pixel-input px-3 py-2 text-xs mb-4"
              value={selectedDataset}
              onChange={e => setSelectedDataset(Number(e.target.value))}
            >
              <option value="">-- CHOOSE DATASET --</option>
              {datasets.map(d => (
                <option key={d.id} value={d.id}>{d.filename} ({d.row_count} rows)</option>
              ))}
            </select>

            <button 
              onClick={handleTrain}
              disabled={training || !selectedDataset}
              className="w-full pixel-btn py-2.5 flex justify-center items-center gap-2 text-xs disabled:opacity-50"
            >
              <Play size={14} /> {training ? '[TRAINING IN PROGRESS...]' : '[TRAIN SELECTED DATASET]'}
            </button>
          </div>
        </div>

        <div className="pixel-card p-6 md:col-span-2">
          <div className="pixel-card-header mb-4 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">[MODEL REGISTRY & VERSIONS]</h3>
            <button onClick={fetchData} className="text-xs font-mono text-zinc-400 hover:text-zinc-100 flex items-center gap-1">
              <RefreshCw size={12} /> REFRESH
            </button>
          </div>
          {models.length === 0 ? (
            <div className="text-center text-zinc-500 font-mono text-xs py-8">
              [NO MODELS TRAINED YET. RUN AUTO RETRAIN TO INITIALIZE]
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b-2 border-zinc-800 uppercase text-xs">
                    <th className="pb-3 font-bold">Version</th>
                    <th className="pb-3 font-bold">Algorithm</th>
                    <th className="pb-3 font-bold">MAE</th>
                    <th className="pb-3 font-bold">R² Score</th>
                    <th className="pb-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {models.map((m: any) => (
                    <tr key={m.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 text-zinc-100 font-mono font-bold text-xs">{m.version}</td>
                      <td className="py-3 text-zinc-300 text-xs">{m.name}</td>
                      <td className="py-3 text-zinc-400 text-xs">{m.mae?.toFixed(2)}</td>
                      <td className="py-3 text-zinc-400 text-xs">{m.r2_score?.toFixed(4)}</td>
                      <td className="py-3 text-right">
                        {m.is_active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 text-xs font-bold">
                            <CheckCircle2 size={12} /> ACTIVE PROD
                          </span>
                        ) : (
                          <button 
                            className="pixel-btn text-xs px-2 py-0.5"
                            onClick={async () => {
                              await api.post(`/models/${m.id}/promote`);
                              fetchData();
                            }}
                          >
                            PROMOTE
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

