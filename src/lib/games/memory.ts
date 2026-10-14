/** Memory-match deck helpers. Pure functions, no React. */

export type Card = { id: number; pair: number };

/** An ordered deck: two cards for each pair, [0, 0, 1, 1, …]. */
export function createDeck(pairs: number): Card[] {
  return Array.from({ length: pairs * 2 }, (_, id) => ({ id, pair: Math.floor(id / 2) }));
}

/** Uniform random integer in [0, max), from the browser's crypto source. */
export function cryptoInt(max: number) {
  // Rejection sampling keeps every value equally likely.
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer);
  while (buffer[0] >= limit);
  return buffer[0] % max;
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], randomInt: (max: number) => number = cryptoInt): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
