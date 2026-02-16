
# Multiplayer Race: Design Doc

## Overview
A real-time competitive mode where users type the same text simultaneously. Progress is visualized as "cars" or "cursors" moving across the screen.

## Technical Architecture
### 1. Transport
- **WebSocket (Socket.io)**: Low-latency, bi-directional communication for progress updates.
- **Protocol**: 
  - `join_room(roomId)`
  - `progress_update(currentIndex, wpm, errors)`
  - `game_start(countdownTs, targetText)`
  - `game_end(results[])`

### 2. Anti-Cheat approach
- **Server-side validation**: Check timestamp deltas against `currentIndex` jumps. If a user types 300 WPM with perfect accuracy for 10 seconds, flag for review.
- **Entropy Check**: Analysis of inter-keystroke intervals to detect robotic (perfectly uniform) input.

### 3. Fairness
- **Keyboard Matching**: Optionally restrict rooms by layout (QWERTY only) or speed bracket (e.g., 40-60 WPM).

## UI Requirements
- Live leaderboard showing WPM and percentage complete.
- Visual track with avatars.
- Chat/Emotes (optional).
