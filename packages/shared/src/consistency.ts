
import { BucketStat } from './types';

export function calculateConsistency(buckets: BucketStat[]): number {
  if (buckets.length < 2) return 100;

  // Calculate WPM for each 2s bucket
  const bucketWpms = buckets.map(b => {
    // 2 seconds is 2/60 of a minute
    return (b.correctChars / 5) / (2 / 60);
  });

  const mean = bucketWpms.reduce((a, b) => a + b, 0) / bucketWpms.length;
  if (mean === 0) return 0;

  const variance = bucketWpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / bucketWpms.length;
  const stdDev = Math.sqrt(variance);

  // Consistency% = clamp( 100 - (std/mean)*100 , 0, 100 )
  const score = 100 - (stdDev / mean) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}
