// Mulberry32 deterministic pseudo-random number generator
export class PRNG {
  private state: number;

  constructor(seedString: string) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = Math.imul(31, hash) + seedString.charCodeAt(i) | 0;
    }
    this.state = hash;
  }

  // Returns random float in range [0, 1)
  public next(): number {
    let t = (this.state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Integer range [min, max]
  public rangeInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  public choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  // Shuffle array in place
  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
