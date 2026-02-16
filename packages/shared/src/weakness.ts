
import { KeyStat, WeaknessKeyModel } from './types';

export function computeKeyWeaknessScores(
  allKeyStats: Record<string, KeyStat>
): WeaknessKeyModel[] {
  const entries = Object.entries(allKeyStats).filter(([_, s]) => s.attempts > 0);
  if (entries.length === 0) return [];

  // Calculate Global Latency Mean/Std for Z-Score
  const latencies = entries.map(([_, s]) => s.totalLatency / s.attempts);
  const meanLat = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const stdLat = Math.sqrt(latencies.reduce((a, b) => a + Math.pow(b - meanLat, 2), 0) / latencies.length) || 1;

  return entries.map(([key, stats]) => {
    const errorRate = stats.errors / stats.attempts;
    const avgLat = stats.totalLatency / stats.attempts;
    const zScore = (avgLat - meanLat) / stdLat;
    const normalizedZ = Math.max(0, Math.min(1, (zScore + 3) / 6));
    
    const confusionCount = Object.values(stats.confusions).reduce((a, b) => a + b, 0);
    const confusionRate = confusionCount / stats.attempts;

    // weakness(key) = 0.55*error_rate + 0.35*latency_zscore_normalized + 0.10*confusion_rate
    const score = (0.55 * errorRate) + (0.35 * normalizedZ) + (0.10 * confusionRate);

    return {
      key,
      errorRate,
      latencyZScore: zScore,
      confusionRate,
      score
    };
  }).sort((a, b) => b.score - a.score);
}
