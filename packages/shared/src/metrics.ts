
import { TypingState, SessionStats } from './types';
import { calculateConsistency } from './consistency';

export function computeSessionStatsFromState(state: TypingState): SessionStats {
  const lastEvent = state.typedEvents[state.typedEvents.length - 1];
  const durationMs = state.startTime && lastEvent ? lastEvent.timestamp - state.startTime : 0;
  const durationMins = durationMs / 60000;

  const wpm = durationMins > 0 ? (state.correctCount / 5) / durationMins : 0;
  const rawWpm = durationMins > 0 ? (state.totalTypedCount / 5) / durationMins : 0;
  const accuracy = state.totalTypedCount > 0 ? (state.correctCount / state.totalTypedCount) * 100 : 100;

  const consistency = calculateConsistency(state.buckets);

  const problemKeys = Object.entries(state.keyStats)
    .filter(([_, stats]) => stats.attempts > 3 && (stats.errors / stats.attempts) > 0.15)
    .map(([key]) => key);

  const wpmSeries = state.buckets.map((b, i) => ({
    time: i * 2,
    wpm: Math.round((b.correctChars / 5) / (2 / 60))
  }));

  return {
    wpm: Math.round(wpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy),
    consistency,
    errors: state.errorCount,
    durationMs,
    problemKeys,
    wpmSeries
  };
}
