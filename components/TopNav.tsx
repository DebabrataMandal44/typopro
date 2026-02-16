
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { registry } from '../plugins/registry';
import { bus } from '../bus/bus';

interface Props {
  settings: UserSettings;
  streak: number;
}

const TopNav: React.FC<Props> = ({ settings, streak }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const links = registry.getNavLinks(settings);

  useEffect(() => {
    const unsubNet = bus.on('network/status', (data) => setIsOnline(data.online));
    const unsubSync = bus.on('sync/pending', (data) => setPendingCount(data.pendingCount));
    
    return () => {
      unsubNet();
      unsubSync();
    };
  }, []);

  return (
    <header className="bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => window.location.hash = '#/home'}>
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center font-black text-black">T</div>
          <span className="text-2xl font-black tracking-tighter uppercase">TypoPro</span>
        </div>
        
        <nav className="flex items-center space-x-1 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800">
          {links.map(link => (
            <button key={link.id} onClick={() => window.location.hash = `#${link.to}`} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${window.location.hash === `#${link.to}` ? 'bg-amber-400 text-black' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
              {link.label} {link.beta && <span className="ml-1 text-[7px] bg-purple-500 px-1 rounded text-white">BETA</span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 mr-4">
             <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
             <span className="text-[10px] text-gray-500 font-bold uppercase">{isOnline ? 'Cloud' : 'Offline'}</span>
             {pendingCount > 0 && <span className="text-[8px] bg-blue-500 text-white px-1.5 rounded-full font-bold ml-2">{pendingCount}</span>}
          </div>
          <button onClick={() => window.location.hash = '#/settings'} className="text-gray-500 hover:text-white transition-colors">
            <SettingsIcon />
          </button>
          <div className="hidden md:block">
            <span className="text-[10px] text-gray-500 font-black uppercase block leading-none mb-1">Streak</span>
            <span className="text-sm font-bold text-amber-400">🔥 {streak}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

export default TopNav;
