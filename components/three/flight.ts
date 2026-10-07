// A one-off flight of the agent's core across the screen: when the inline chat
// scrolls away, the core comes down from it and settles in the corner as the
// floating button. The button asks for the flight; the WebGL scene performs it.

export const FLIGHT_MS = 650;

type Point = { x: number; y: number };
export type Flight = { start: number; from: Point; to: Point };

let sceneReady = false;
let current: Flight | null = null;
const listeners = new Set<() => void>();

/** Called by the scene while it is mounted and able to draw. */
export function setSceneReady(ready: boolean) {
  sceneReady = ready;
  if (!ready) current = null;
}

/** Starts a flight between two screen points. Returns false when there is no scene to draw it. */
export function startFlight(from: Point, to: Point): boolean {
  if (!sceneReady) return false;
  current = { start: performance.now(), from, to };
  listeners.forEach((listener) => listener());
  return true;
}

/** The flight in progress, if any. */
export function getFlight(): Flight | null {
  if (current && performance.now() - current.start > FLIGHT_MS) current = null;
  return current;
}

export function onFlightStart(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
