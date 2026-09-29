import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import { LayoutDashboard, Wand2, Video, BarChart3, Database, Activity, Sparkles, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import Analytics from './pages/Analytics';
import DatasetExplorer from './pages/DatasetExplorer';
import ModelTraining from './pages/ModelTraining';
import VideoAnalyzer from './pages/VideoAnalyzer';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Content Predictor', path: '/predict', icon: <Wand2 size={18} /> },
    { name: 'Video Analyzer', path: '/video-analysis', icon: <Video size={18} /> },
    { name: 'AI Recommendations', path: '/recommendations', icon: <Sparkles size={18} /> },
    { name: 'Content Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Dataset Explorer', path: '/datasets', icon: <Database size={18} /> },
    { name: 'Model Training', path: '/training', icon: <Activity size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-black border-r-2 border-zinc-800 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 border-b-2 border-zinc-800 bg-zinc-950">
        <h1 className="text-xl font-bold text-zinc-100 tracking-wider flex items-center gap-2">
          <span className="w-3 h-3 bg-zinc-100 inline-block animate-pulse"></span>
          CREATOR_IQ
        </h1>
        <p className="text-zinc-500 text-xs mt-1 font-mono">[PIXEL MLOPS v2.0]</p>
      </div>
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 transition-all text-sm uppercase font-bold tracking-wider ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 border-2 border-zinc-500 shadow-[3px_3px_0px_#000000]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 hover:border-2 hover:border-zinc-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const Topbar = () => (
  <div className="h-16 border-b-2 border-zinc-800 bg-black/90 sticky top-0 z-10 flex items-center justify-between px-8">
    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
      <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block"></span>
      <span>SYSTEM_STATUS: ONLINE</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-xs font-mono text-zinc-400 border border-zinc-700 px-3 py-1 bg-zinc-900">
        MODEL: RF_MULTI_OUTPUT_ACTIVE
      </span>
      <div className="w-6 h-6 bg-zinc-700 border border-zinc-500 shadow-[2px_2px_0px_#000]"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-zinc-200 flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Topbar />
          <main className="flex-1 p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predict" element={<Predictor />} />
              <Route path="/video-analysis" element={<VideoAnalyzer />} />
              <Route path="/recommendations" element={<Predictor />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/datasets" element={<DatasetExplorer />} />
              <Route path="/training" element={<ModelTraining />} />
              <Route path="*" element={<div className="text-center text-zinc-500 mt-20 font-mono">[404: PAGE UNDER CONSTRUCTION]</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}



export default App;
