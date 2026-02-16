
import React, { useState, useEffect } from 'react';
import { UserSettings, UserStats } from '../types';
import { registry } from '../plugins/registry';
import { bus } from '../bus/bus';
import GoalsCard from '../components/GoalsCard';

interface Props {
  settings: UserSettings;
  stats: UserStats;
}

const Home: React.FC<Props> = ({ settings, stats }) => {
  const [recommendation, setRecommendation] = useState<{ text: string; actionHash: string } | null>(() => {
    const saved = localStorage.getItem('typro_last_rec');
    return saved ? JSON.parse(saved) : null;
  });

  const [reminderVisible, setReminderVisible] = useState(false);

  const cards = registry.getHomeCards(settings);

  useEffect(() => {
    // Expose stats for the plugin system (lightweight singleton access)
    (window as any)._typro_stats = stats;
    
    // Check if practiced today for reminder
    const today = new Date().setHours(0,0,0,0);
    const practicedToday = stats.history.some(s => new Date(s.timestamp).setHours(0,0,0,0) === today);
    if (!practicedToday && stats.totalSessions > 0) {
      setReminderVisible(true);
    }

    return bus.on('recommendation/updated', (data) => setRecommendation(data));
  }, [stats]);

  const handleQuickStart = () => {
    const mode = stats.profile?.preferredMode || 'test';
    window.location.hash = `#/typing/${mode}`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full pt-12 px-6">
      {/* Reminder Notification */}
      {reminderVisible && (
        <div className="mb-8 p-4 bg-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl flex justify-between items-center animate-in slide-in-from-top-4">
          <span>You haven't practiced today. 10 minutes is enough to stay sharp!</span>
          <button onClick={() => setReminderVisible(false)} className="opacity-50 hover:opacity-100 px-2">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-7xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
              Welcome back, <br/>
              <span className="text-amber-400 italic">{stats.profile?.displayName || 'Typist'}</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
              Target your weaknesses, build muscle memory, and track every keystroke.
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
               onClick={handleQuickStart}
               className="bg-amber-400 text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"
             >
               Quick Start: {stats.profile?.preferredMode || 'Test'}
             </button>
             {recommendation && (
                <button 
                  onClick={() => window.location.hash = recommendation.actionHash}
                  className="bg-gray-800 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-gray-700 hover:border-amber-400 transition-colors"
                >
                  Recommended: {recommendation.text.split('.')[0]}
                </button>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map(card => (
              <div key={card.id} onClick={card.onClick} className="group p-8 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] hover:border-amber-400/50 hover:bg-gray-900 transition-all cursor-pointer shadow-xl flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-gray-100">{card.title}</h3>
                    {card.beta && <span className="text-[8px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>}
                  </div>
                  <p className="text-gray-500 text-sm leading-snug">{card.description}</p>
                </div>
                <div className="text-amber-400 font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Enter →
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GoalsCard stats={stats} />
          
          <div className="p-8 bg-black/40 border border-gray-800 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Global Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Total Sessions</span>
                <span className="text-lg font-black text-white">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Streak</span>
                <span className="text-lg font-black text-amber-400">🔥 {stats.streak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
