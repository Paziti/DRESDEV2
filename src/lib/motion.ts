/**
 * Motion system — the JS-side mirror of the CSS tokens in globals.css.
 * Same curves, same durations, one source of truth in two syntaxes
 * (Framer Motion wants cubic-bezier arrays; CSS wants the string form).
 */

export const ease = {
  /** Entering or exiting. */
  out: [0.23, 1, 0.32, 1] as const,
  /** Moving / morphing on screen. */
  inOut: [0.77, 0, 0.175, 1] as const,
  /** iOS-like drawer / panel curve. */
  drawer: [0.32, 0.72, 0, 1] as const,
};

export const duration = {
  fast: 0.15,
  medium: 0.35,
  slow: 0.7,
  cinematic: 1.2,
};

/** Standard entrance: never scale(0) — nothing appears from nothing. */
export const reveal = {
  initial: { opacity: 0, transform: "translateY(24px) scale(0.98)" },
  animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
  transition: { duration: duration.slow, ease: ease.out },
};

/** Stagger window for groups entering together (30–80ms per item). */
export const stagger = (index: number, step = 0.06, base = 0) => ({
  delay: base + index * step,
});
