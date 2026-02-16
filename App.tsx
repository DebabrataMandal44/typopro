
import React, { useState, useEffect } from 'react';
import { UserStats, SessionResult, UserSettings } from './types';
import { storageService } from './services/storageService';
import { initializePlugins } from './plugins/manifest';
import { registry } from './plugins/registry';
import { bus } from './bus/bus';
import { initializeNetworkListener } from './lib/network';

// Pages
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import CodeMode from './components/CodeMode';
import ModeHost from './pages/ModeHost';
import TopNav from './components/TopNav';

// System initialization
initializePlugins();
initializeNetworkListener();

const App: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const stats = storageService.getUserStats();
    // Pre-initialize global pointer so it's available during the first render pass
    (window as any)._typro_stats = stats;
    return stats;
  });
  
  const [hash, setHash] = useState(window.location.hash);
  const [activeResult, setActiveResult] = useState<SessionResult | null>(null);

  // Keep global pointer in sync whenever userStats changes
  (window as any)._typro_stats = userStats;

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    
    const handleStatsUpdate = () => {
      setUserStats(storageService.getUserStats());
    };
    window.addEventListener('typro-stats-updated', handleStatsUpdate);

    bus.emit('app/ready', { timestamp: Date.now() });

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('typro-stats-updated', handleStatsUpdate);
    };
  }, []);

  const handleSaveSettings = (newSettings: UserSettings) => {
    const oldSettings = userStats.settings;
    const updated = storageService.saveSettings(newSettings);
    setUserStats(updated);
    
    const changedKeys = Object.keys(newSettings).filter(
      k => JSON.stringify((newSettings as any)[k]) !== JSON.stringify((oldSettings as any)[k])
    );
    bus.emit('settings/changed', { changedKeys, settings: newSettings });
  };

  const handleComplete = (result: SessionResult) => {
    setUserStats(storageService.getUserStats());
    setActiveResult(result);
  };

  const navTo = (path: string) => window.location.hash = `#${path}`;

  const renderContent = () => {
    if (activeResult) return <ResultView result={activeResult} onDone={() => setActiveResult(null)} />;
    const path = hash.replace('#', '') || '/';
    if (path === '/' || path === '/home' || path === '/home/') return <Home settings={userStats.settings} stats={userStats} />;
    if (path === '/dashboard') return <div className="max-w-6xl mx-auto w-full pt-12 px-6"><h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter">Your Progress.</h1><Dashboard stats={userStats} /></div>;
    if (path === '/settings') return <Settings settings={userStats.settings} onSave={handleSaveSettings} onClose={() => navTo('/home')} />;
    if (path.startsWith('/typing/')) {
      const parts = path.split('/');
      const modeId = parts[2] || 'test';
      const context = parts[3];
      return <ModeHost modeId={modeId} context={context} settings={userStats.settings} onComplete={handleComplete} onCancel={() => navTo('/home')} />;
    }
    if (path === '/lessons') return <Lessons />;
    if (path === '/code') return <CodeMode onSelect={(text) => navTo(`/typing/code/${encodeURIComponent(text)}`)} />;
    return <div className="p-12 text-center text-gray-500 uppercase font-black">404 - Request Unknown</div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f1a] text-gray-200 selection:bg-amber-400 selection:text-black">
      <TopNav settings={userStats.settings} streak={userStats.streak} />
      <main className="flex-1 flex flex-col">{renderContent()}</main>
      <footer className="py-8 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        TypoPro &bull; Capabilities Bus Enabled &bull; Master Your Flow
      </footer>
    </div>
  );
};

const ResultView = ({ result, onDone }: { result: SessionResult, onDone: () => void }) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="max-w-3xl w-full bg-gray-900/50 border border-gray-800 p-12 rounded-[3.5rem] text-center space-y-10 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-12">
      <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Session Complete</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-8 bg-black/40 rounded-[2rem] border border-gray-800">
           <div className="text-4xl font-black text-amber-400">{result.wpm}</div>
           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">WPM</div>
        </div>
        <div className="p-8 bg-black/40 rounded-[2rem] border border-gray-800">
           <div className="text-4xl font-black text-amber-400">{result.accuracy}%</div>
           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Accuracy</div>
        </div>
        <div className="p-8 bg-black/40 rounded-[2rem] border border-gray-800">
           <div className="text-4xl font-black text-amber-400">{result.errors}</div>
           <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mistakes</div>
        </div>
      </div>
      <button className="w-full bg-amber-400 text-black font-black py-5 rounded-2xl hover:bg-amber-300 transition-all uppercase tracking-widest text-sm" onClick={onDone}>Finish Training</button>
    </div>
  </div>
);

export default App;
