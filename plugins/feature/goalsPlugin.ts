
import React from 'react';
import { TypoProPlugin } from '../types';
import ProfileGoals from '../../components/ProfileGoals';
import { storageService } from '../../services/storageService';

export const goalsPlugin: TypoProPlugin = {
  id: 'feature-goals',
  name: 'Goals & Profile',
  type: 'feature',
  order: 120,
  defaultEnabled: true,
  isEnabled: (s) => s.enabledPlugins.includes('feature-goals'),

  settingsSections: [
    {
      id: 'profile-goals',
      title: 'Profile & Targets',
      description: 'Define your identity and set typing milestones.',
      render: (settings, onUpdate) => {
        const stats = (window as any)._typro_stats || storageService.getUserStats();
        
        return React.createElement(ProfileGoals, { 
          stats: stats, 
          onUpdate: () => window.dispatchEvent(new CustomEvent('typro-stats-updated'))
        });
      }
    }
  ],

  onExport: () => {
    const stats = (window as any)._typro_stats || storageService.getUserStats();
    return {
      profile: stats.profile,
      goals: stats.goals
    };
  },

  onImport: (data: any) => {
    if (data.profile || data.goals) {
      const stats = storageService.getUserStats();
      if (data.profile) stats.profile = data.profile;
      if (data.goals) stats.goals = data.goals;
      storageService.overwriteAll(stats);
      window.dispatchEvent(new CustomEvent('typro-stats-updated'));
    }
  }
};
