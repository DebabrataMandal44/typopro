
# TypoPro Profile & Goals

TypoPro uses a Deliberate Practice model where progress is tracked against specific user-defined milestones.

## Goal Metrics

### 1. Daily Minutes
- **Formula**: `Sum(session.duration) for sessions where session.date == today`.
- **Logic**: Encourages time-on-task. Scientific research suggests 15-20 minutes of daily practice is the "sweet spot" for muscle memory retention.

### 2. Weekly Sessions
- **Formula**: `Count(sessions) where session.date >= now - 7 days`.
- **Logic**: Frequency over intensity. Aiming for 10 sessions/week usually means 1-2 sessions every day.

### 3. Target WPM
- **Formula**: `Best WPM recorded in history`.
- **Logic**: High-water mark benchmarking.

### 4. Accuracy Goal
- **Formula**: `Average(session.accuracy) for today's sessions`.
- **Logic**: Accuracy is the prerequisite for speed. If this goal isn't met, the system recommends "Lessons" or "Drills" via the Recommendation engine.

## Experience Levels
- **Beginner**: Focused on "Lessons" (Mastery Path).
- **Intermediate**: Focused on "Adaptive Drills" (Gemini-powered).
- **Advanced**: Focused on "Code Mode" and "Tests".

## Storage
Goals are stored in `localStorage` under the `typro_user_data` key as part of the `UserStats` object. They are included in JSON backups.
