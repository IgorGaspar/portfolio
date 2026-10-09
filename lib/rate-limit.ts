const DEFAULT_MAX = 20;
const DEFAULT_WINDOW = "1 h";
// Whole-site ceiling per UTC day: the last line of defence for the API bill.
const DEFAULT_DAILY_LIMIT = 200;

const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/** Parses durations such as "1 h" or "30m". */
export function parseWindow(value: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(value.trim());
  if (!match) throw new Error(`Invalid AGENT_RATE_LIMIT_WINDOW: "${value}"`);
  return Number(match[1]) * UNIT_MS[match[2]];
}

type Limiter = (key: string) => Promise<{ success: boolean }>;

/**
 * Fixed-window limiter kept in process memory. The site runs as a single instance, so no
 * shared store is needed; the counters reset when the container restarts.
 */
export function createMemoryLimiter(max: number, windowMs: number, now = Date.now): Limiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return async (key) => {
    const time = now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= time) {
      // Drop expired entries so the map does not grow without bound.
      for (const [k, v] of hits) if (v.resetAt <= time) hits.delete(k);
      hits.set(key, { count: 1, resetAt: time + windowMs });
      return { success: true };
    }

    entry.count += 1;
    return { success: entry.count <= max };
  };
}

let limiter: Limiter | undefined;

function getLimiter(): Limiter {
  if (limiter) return limiter;

  const max = Number(process.env.AGENT_RATE_LIMIT_MAX) || DEFAULT_MAX;
  const window = process.env.AGENT_RATE_LIMIT_WINDOW || DEFAULT_WINDOW;
  const windowMs = parseWindow(window);

  limiter = createMemoryLimiter(max, windowMs);

  return limiter;
}

export const checkRateLimit = (ip: string) => getLimiter()(ip);

const dayKey = () => new Date().toISOString().slice(0, 10);
const dailyHits = new Map<string, number>();

/**
 * Counts one agent call against the site-wide daily ceiling (AGENT_DAILY_LIMIT) and
 * says whether it is still within it. Kept in process memory, so it resets on restart.
 */
export async function checkDailyBudget(): Promise<boolean> {
  const limit = Number(process.env.AGENT_DAILY_LIMIT) || DEFAULT_DAILY_LIMIT;
  const key = dayKey();

  for (const day of dailyHits.keys()) if (day !== key) dailyHits.delete(day);
  const count = (dailyHits.get(key) ?? 0) + 1;
  dailyHits.set(key, count);
  return count <= limit;
}
