
import React from 'react';
import { UserStats, KeyStats } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  stats: UserStats;
}

const Dashboard: React.FC<Props> = ({ stats }) => {
  const chartData = stats.history.slice().reverse().map((s, idx) => ({
    name: idx + 1,
    wpm: s.wpm,
    acc: s.accuracy
  }));

  // Goals Trend: Last 7 days minutes
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dayStr = d.setHours(0,0,0,0);
    const mins = stats.history
      .filter(s => new Date(s.timestamp).setHours(0,0,0,0) === dayStr)
      .reduce((acc, s) => acc + (s.duration / 60), 0);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: Math.round(mins)
    };
  });

  const sortedKeys = (Object.entries(stats.keyStats) as [string, KeyStats][])
    .filter(([_, kStats]) => kStats.attempts > 0)
    .sort((a, b) => (b[1].errors / b[1].attempts) - (a[1].errors / a[1].attempts))
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 animate-fade-in pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Best WPM" value={stats.bestWpm} unit="words/min" color="text-amber-400" />
        <StatCard title="Target WPM" value={stats.goals.targetWpm} unit="words/min" color="text-blue-400" />
        <StatCard title="Daily Streak" value={stats.streak} unit="days" color="text-emerald-400" />
        <StatCard title="Practice Time" value={Math.round(stats.totalTime)} unit="mins" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Chart */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-xl font-black mb-8 text-gray-100 uppercase italic">Speed History</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '12px' }}
                    itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#fbbf24" strokeWidth={4} dot={false} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goals Trend Chart */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-xl font-black mb-8 text-gray-100 uppercase italic">Weekly Habit</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(251, 191, 36, 0.05)' }}
                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '12px' }}
                  />
                  <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Problem Keys */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black mb-8 text-gray-100 uppercase italic">Key Mastery</h3>
          <div className="space-y-6">
            {sortedKeys.length > 0 ? sortedKeys.map(([key, kStats]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="mono text-2xl font-black text-white uppercase">{key}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    {Math.round((kStats.errors / kStats.attempts) * 100)}% error
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-1000" 
                    style={{ width: `${(kStats.errors / kStats.attempts) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic text-sm text-center py-20">Keep practicing to generate key stats.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, color }: any) => (
  <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] hover:border-gray-700 transition-all group">
    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 group-hover:text-amber-400 transition-colors">{title}</div>
    <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
    <div className="text-[10px] text-gray-600 mt-2 font-bold uppercase">{unit}</div>
  </div>
);

export default Dashboard;
