
import { Lesson, UserStats } from './types';

export const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "her", "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government", "company", "number", "group", "problem", "fact"
];

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Home Row: Index Fingers',
    description: 'The foundation: f, j, d, k.',
    keys: ['f', 'j', 'd', 'k'],
    content: 'fff jjj ddd kkk fjf jfj dkd kdk fjd kjf dkf jkd fjkd dfjk',
    requiredAccuracy: 97,
    locked: false
  },
  {
    id: 'l2',
    title: 'Home Row: Full Set',
    description: 'Expanding to a, s, l, ;.',
    keys: ['a', 's', 'l', ';'],
    content: 'aaa sss lll ;;; asdf jkl; asdf jkl; a; s l dk fj a;sldkfj',
    requiredAccuracy: 97,
    locked: true
  },
  {
    id: 'l3',
    title: 'Home Row: Reach Keys',
    description: 'Stretching to g and h.',
    keys: ['g', 'h'],
    content: 'ggg hhh fgf jhj gh gh hg hg fgh jhg ghgh ghf jhg fghj',
    requiredAccuracy: 97,
    locked: true
  },
  {
    id: 'l4',
    title: 'Top Row: Core reaches',
    description: 'r, t, y, u mechanics.',
    keys: ['r', 't', 'y', 'u'],
    content: 'rrr ttt yyy uuu frf ftf jyj juj rt yu ty ru rtyu uytr',
    requiredAccuracy: 97,
    locked: true
  },
  {
    id: 'l5',
    title: 'Bottom Row: Core reaches',
    description: 'v, b, n, m mechanics.',
    keys: ['v', 'b', 'n', 'm'],
    content: 'vvv bbb nnn mmm fvf fbf jnj jmj vb nm bn mv vbnm mnbv',
    requiredAccuracy: 97,
    locked: true
  }
];

export const INITIAL_USER_STATS: Partial<UserStats> = {
  totalSessions: 0,
  bestWpm: 0,
  avgWpm: 0,
  totalTime: 0,
  streak: 0,
  lastActive: Date.now(),
  keyStats: {},
  history: [],
  profile: {
    experienceLevel: 'beginner',
    preferredMode: 'test',
    createdAt: new Date().toISOString()
  },
  goals: {
    targetWpm: 40,
    dailyMinutesGoal: 20,
    accuracyGoal: 97,
    weeklySessionsGoal: 10,
    streakGoal: 7
  }
};
