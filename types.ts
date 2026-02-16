
export type AppMode = 'test' | 'lesson' | 'drill' | 'dashboard' | 'settings' | 'code' | 'home';

export interface KeyStats {
  attempts: number;
  errors: number;
  totalLatency: number; // ms
  confusions: Record<string, number>; // key -> count of times it was typed instead of expected
}

export interface SessionResult {
  id: string;
  timestamp: number;
  mode: AppMode;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  duration: number; // seconds
  problemKeys: string[];
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  keyboardLayout: 'qwerty' | 'azerty' | 'dvorak';
  showKeyboardHints: boolean;
  soundEnabled: boolean;
  enabledPlugins: string[]; // List of plugin IDs that are explicitly enabled
  betaFeatures: {
    codeMode: boolean;
    multiLayout: boolean;
    accountSync: boolean;
  };
}

export interface UserProfile {
  displayName?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredMode: AppMode;
  createdAt: string;
}

export interface UserGoals {
  targetWpm: number;
  dailyMinutesGoal: number;
  accuracyGoal: number;
  weeklySessionsGoal: number;
  streakGoal: number;
}

export interface UserStats {
  totalSessions: number;
  bestWpm: number;
  avgWpm: number;
  totalTime: number; // minutes
  streak: number;
  lastActive: number;
  keyStats: Record<string, KeyStats>;
  history: SessionResult[];
  settings: UserSettings;
  profile: UserProfile;
  goals: UserGoals;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  keys: string[];
  content: string;
  requiredAccuracy: number;
  locked: boolean;
}

export interface WordData {
  text: string;
  isTyped: boolean;
  isCurrent: boolean;
  hasError: boolean;
}
