
import React, { useState } from 'react';
import { UserStats, UserProfile, UserGoals } from '../types';
import { storageService } from '../services/storageService';
import { ProfileSchema, GoalsSchema } from '../lib/profile';

interface Props {
  stats: UserStats;
  onUpdate: () => void;
}

const ProfileGoals: React.FC<Props> = ({ stats, onUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>(stats.profile);
  const [goals, setGoals] = useState<UserGoals>(stats.goals);

  // Handle profile field updates
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...profile, [name]: value };
    setProfile(updated);
    
    // Validate with Zod schema and save to storage service
    const result = ProfileSchema.safeParse(updated);
    if (result.success) {
      storageService.saveProfile(updated);
      onUpdate();
    }
  };

  // Handle goals field updates
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    const updated = { ...goals, [name]: numValue };
    setGoals(updated);

    // Validate with Zod schema and save to storage service
    const result = GoalsSchema.safeParse(updated);
    if (result.success) {
      storageService.saveGoals(updated);
      onUpdate();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Profile Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Profile</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={profile.displayName || ''}
              onChange={handleProfileChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
              placeholder="Typist"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Experience Level</label>
            <select
              name="experienceLevel"
              value={profile.experienceLevel}
              onChange={handleProfileChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Preferred Mode</label>
            <select
              name="preferredMode"
              value={profile.preferredMode}
              onChange={handleProfileChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            >
              <option value="test">Test</option>
              <option value="lesson">Lesson</option>
              <option value="drill">Drill</option>
              <option value="code">Code</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h4 className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Typing Goals</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Target WPM</label>
            <input
              type="number"
              name="targetWpm"
              value={goals.targetWpm}
              onChange={handleGoalChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Accuracy Goal %</label>
            <input
              type="number"
              name="accuracyGoal"
              value={goals.accuracyGoal}
              onChange={handleGoalChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Daily Minutes</label>
            <input
              type="number"
              name="dailyMinutesGoal"
              value={goals.dailyMinutesGoal}
              onChange={handleGoalChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold">Weekly Sessions</label>
            <input
              type="number"
              name="weeklySessionsGoal"
              value={goals.weeklySessionsGoal}
              onChange={handleGoalChange}
              className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGoals;
