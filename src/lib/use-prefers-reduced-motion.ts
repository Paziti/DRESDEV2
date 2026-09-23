import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion. That
 * hook reads matchMedia during the first client render, so components that
 * render a different tree when motion is reduced didn't match the server
 * HTML (React error #418). Here hydration uses the server value (false)
 * and React re-renders with the real preference right after.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
