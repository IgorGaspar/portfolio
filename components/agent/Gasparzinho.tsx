export type GasparzinhoState = "still" | "idle" | "happy" | "thinking" | "flying";

type Props = {
  state?: GasparzinhoState;
  /** Rendered width in px; the sprite scales from its 256 px native frame. */
  size?: number;
  className?: string;
};

/**
 * The agent's mascot: a frame of /assets/gasparzinho-spritesheet.webp (11 frames of 256x255,
 * laid out horizontally). The frame stepping is pure CSS (see `.gaspar` in globals.css), so
 * it costs no JavaScript and stops under prefers-reduced-motion. Decorative: the control or
 * heading next to it carries the accessible name.
 */
export function Gasparzinho({ state = "idle", size = 72, className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      data-state={state}
      className={`gaspar ${className}`}
      style={{ "--gaspar-size": `${size}px` } as React.CSSProperties}
    />
  );
}
