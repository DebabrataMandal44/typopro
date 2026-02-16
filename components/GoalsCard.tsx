
import React from 'react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
}

const GoalsCard: React.FC<Props> = ({ stats }) => {
  const { goals, history } = stats;
  
  // Daily Minutes Calculation
  const today = new Date().setHours(0,0,0,0);
  const todaySessions = history.filter(s => new Date(s.timestamp).setHours(0,0,0,0) === today);
  const minutesToday = todaySessions.reduce((acc, s) => acc + (s.duration / 60), 0);
  const minProgress = Math.min(100, (minutesToday / goals.dailyMinutesGoal) * 100);

  // Weekly Sessions Calculation
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyCount = history.filter(s => s.timestamp > sevenDaysAgo).length;
  const weekProgress = Math.min(100, (weeklyCount / goals.weeklySessionsGoal) * 100);

  // Status checks
  const bestWpmMet = stats.bestWpm >= goals.targetWpm;
  const avgAccuracyToday = todaySessions.length > 0 
    ? todaySessions.reduce((acc, s) => acc + s.accuracy, 0) / todaySessions.length 
    : 0;
  const accuracyMet = avgAccuracyToday >= goals.accuracyGoal;

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Your Progress</h3>
        <div className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Daily Goal</div>
      </div>

      <div className="space-y-6">
        {/* Minutes Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase">Today's Practice</span>
            <span className="text-xs font-bold text-white">{Math.round(minutesToday)} / {goals.dailyMinutesGoal}m</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${minProgress}%` }} />
          </div>
        </div>

        {/* Weekly Sessions Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase">Weekly Frequency</span>
            <span className="text-xs font-bold text-white">{weeklyCount} / {goals.weeklySessionsGoal}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${weekProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border ${bestWpmMet ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-950 border-gray-800'}`}>
          <div className="text-[8px] font-black uppercase text-gray-500 mb-1">Target WPM</div>
          <div className={`text-xl font-black ${bestWpmMet ? 'text-green-400' : 'text-gray-300'}`}>
             {stats.bestWpm} <span className="text-[10px] text-gray-600">/ {goals.targetWpm}</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${accuracyMet ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-950 border-gray-800'}`}>
          <div className="text-[8px] font-black uppercase text-gray-500 mb-1">Accuracy Today</div>
          <div className={`text-xl font-black ${accuracyMet ? 'text-green-400' : 'text-gray-300'}`}>
             {Math.round(avgAccuracyToday)}% <span className="text-[10px] text-gray-600">/ {goals.accuracyGoal}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsCard;
