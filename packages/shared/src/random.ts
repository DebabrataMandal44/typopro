
/**
 * A fast, simple seeded PRNG.
 */
export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export class SeededRandom {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  random(): number {
    return this.next();
  }

  pick<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  pickWeighted<T>(items: { item: T; weight: number }[]): T {
    const totalWeight = items.reduce((acc, curr) => acc + curr.weight, 0);
    let r = this.random() * totalWeight;
    for (const { item, weight } of items) {
      if (r <= weight) return item;
      r -= weight;
    }
    return items[items.length - 1].item;
  }
}
