# TypoPro: Advanced Typing Trainer

TypoPro is a modern, high-performance typing trainer designed to help users achieve typing mastery through accuracy-first progression and adaptive, deliberate practice.

## Core Features
- **Deterministic Typing Engine**: High-frequency O(1) input handling for a lag-free 60fps experience.
- **Gemini-Powered Adaptive Drills**: Intelligent text generation that focuses specifically on your weak keys and bigram latencies.
- **Mastery-Based Lessons**: A structured curriculum for touch typing with accuracy gates for progression.
- **Comprehensive Analytics**: Track WPM, raw speed, accuracy, consistency, and error distribution.
- **Guest-First Persistence**: Robust local storage with automatic backend synchronization.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand, Recharts.
- **Backend**: Fastify (Node.js), Prisma, Zod.
- **Persistence**: SQLite.
- **Intelligence**: Google Gemini API (Gemini 3 Flash).

## Quick Start
The fastest way to run TypoPro is using Docker Compose.

```bash
# Set your API Key
export API_KEY=your_google_gemini_api_key

# Start the stack
pnpm docker:up
```
Visit `http://localhost:3000` to start training.

## Development
```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:migrate

# Start development environment
pnpm dev
```

## Testing
TypoPro includes unit tests for the core engine and E2E smoke tests for the UI.
- `pnpm test`: Run unit tests for shared logic.
- `pnpm test:e2e`: Run Playwright smoke tests.

---
Master your keyboard. Master your flow. TypoPro.
