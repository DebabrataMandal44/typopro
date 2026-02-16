
import { UserStats, SessionResult, UserSettings, UserProfile, UserGoals } from '../types';
import { INITIAL_USER_STATS } from '../constants';

const STORAGE_KEY = 'typro_user_data';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  keyboardLayout: 'qwerty',
  showKeyboardHints: true,
  soundEnabled: false,
  enabledPlugins: ['mode-test', 'mode-lessons', 'mode-drills', 'feature-dashboard', 'feature-settings', 'feature-data', 'feature-goals'],
  betaFeatures: {
    codeMode: false,
    multiLayout: false,
    accountSync: false
  }
};

export const storageService = {
  getUserStats: (): UserStats => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { ...INITIAL_USER_STATS, settings: DEFAULT_SETTINGS } as UserStats;
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_USER_STATS,
        ...parsed,
        keyStats: parsed.keyStats || {},
        history: parsed.history || [],
        settings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.settings || {})
        },
        profile: {
          ...INITIAL_USER_STATS.profile,
          ...(parsed.profile || {})
        },
        goals: {
          ...INITIAL_USER_STATS.goals,
          ...(parsed.goals || {})
        }
      } as UserStats;
    } catch (e) {
      return { ...INITIAL_USER_STATS, settings: DEFAULT_SETTINGS } as UserStats;
    }
  },

  saveSettings: (settings: UserSettings) => {
    const stats = storageService.getUserStats();
    const updated = { ...stats, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  saveProfile: (profile: UserProfile) => {
    const stats = storageService.getUserStats();
    const updated = { ...stats, profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  saveGoals: (goals: UserGoals) => {
    const stats = storageService.getUserStats();
    const updated = { ...stats, goals };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  saveSession: (session: SessionResult, updatedKeyStats: UserStats['keyStats']) => {
    const stats = storageService.getUserStats();
    
    const newHistory = [session, ...stats.history].slice(0, 100);
    const totalSessions = stats.totalSessions + 1;
    
    const bestWpm = Math.max(stats.bestWpm, session.wpm);
    const avgWpm = Math.round((stats.avgWpm * stats.totalSessions + session.wpm) / totalSessions);
    const totalTime = stats.totalTime + (session.duration / 60);

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const lastActiveDate = new Date(stats.lastActive).setHours(0, 0, 0, 0);
    const todayDate = new Date(now).setHours(0, 0, 0, 0);
    
    let streak = stats.streak;
    if (todayDate === lastActiveDate) {
      // Stay same
    } else if (todayDate === lastActiveDate + oneDayMs) {
      streak += 1;
    } else {
      streak = 1;
    }

    const updatedStats: UserStats = {
      ...stats,
      totalSessions,
      bestWpm,
      avgWpm,
      totalTime,
      streak,
      lastActive: now,
      keyStats: updatedKeyStats,
      history: newHistory
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  },

  overwriteAll: (stats: UserStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  },

  resetStats: (keepGuestId: boolean) => {
    const current = storageService.getUserStats();
    const guestId = (current as any).guestId; 
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('typro_last_rec'); 
    
    if (keepGuestId && guestId) {
       const fresh = { ...INITIAL_USER_STATS, settings: DEFAULT_SETTINGS, guestId };
       localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  }
};
