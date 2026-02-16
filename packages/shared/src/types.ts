
export type SessionMode = 'test' | 'lesson' | 'drill';
export type BackspaceMode = 'normal' | 'strict';

export interface TypedEvent {
  index: number;
  typed: string;
  expected: string;
  isCorrect: boolean;
  timestamp: number;
  latency: number;
}

export interface SessionConfig {
  mode: SessionMode;
  backspaceMode: BackspaceMode;
  targetText: string;
  startTime?: number;
}

export interface BucketStat {
  timestamp: number;
  correctChars: number;
  totalChars: number;
}

export interface KeyStat {
  attempts: number;
  errors: number;
  totalLatency: number;
  confusions: Record<string, number>;
}

export interface TypingState {
  config: SessionConfig;
  caretIndex: number;
  typedEvents: TypedEvent[];
  startTime: number | null;
  isFinished: boolean;
  
  // Incremental counters for O(1) updates
  correctCount: number;
  errorCount: number;
  totalTypedCount: number;
  
  // Key metrics maps
  keyStats: Record<string, KeyStat>;
  bigramStats: Record<string, KeyStat>;
  
  // Consistency buckets (2s)
  buckets: BucketStat[];
}

export interface SessionStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  durationMs: number;
  problemKeys: string[];
  wpmSeries: { time: number; wpm: number }[];
}

export interface WeaknessKeyModel {
  key: string;
  errorRate: number;
  latencyZScore: number;
  confusionRate: number;
  score: number;
}

export interface DrillSpec {
  seed: number;
  targetKeys: string[];
  targetBigrams: string[];
  wordCount: number;
}

export interface DrillText {
  words: string[];
  text: string;
}
