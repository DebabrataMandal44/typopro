
import { z } from 'zod';

export const ProfileSchema = z.object({
  displayName: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  preferredMode: z.enum(['test', 'lesson', 'drill', 'code']),
  createdAt: z.string().datetime()
});

export const GoalsSchema = z.object({
  targetWpm: z.number().min(5).max(300),
  dailyMinutesGoal: z.number().min(1).max(240),
  accuracyGoal: z.number().min(80).max(100),
  weeklySessionsGoal: z.number().min(1).max(100),
  streakGoal: z.number().min(1).max(365)
});
