# Architecture Overview

## Typing Engine
- State Machine based processing.
- O(1) keystroke updates.
- Incremental metrics aggregation.

## Adaptive Logic
- Weakness scores based on Error Rate + Latency Z-Score.
- Gemini-powered drill generation.

## Data Persistence
- SQLite + Prisma for local/development storage.
- Storage Service abstraction for Guest mode.
