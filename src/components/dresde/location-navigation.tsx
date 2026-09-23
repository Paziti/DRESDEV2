"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { Location } from "@/lib/types";
import { ease, duration } from "@/lib/motion";

type LocationNavigationProps = {
  locations: Location[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Lets the user switch locals without scrolling back up to the grid
 * (brief §14). Sticky under the site header, horizontally scrollable on
 * mobile so it works by touch without wrapping or overflowing the page.
 *
 * The active indicator sits inside each button's own box (bottom edge),
 * never hanging below it: `overflow-x-auto` here also computes
 * `overflow-y: auto` per the CSS spec, which clips anything outside.
 */
export function LocationNavigation({ locations, selectedId, onSelect }: LocationNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  // The active tab's underline is correct the moment `selectedId` changes,
  // but on a narrow screen the tab itself can be scrolled off to the
  // right — picking a local straight from the grid above (skipping the
  // earlier tabs) left the bar sitting at its default scroll position,
  // still showing Estomba first with nothing marked active in view. This
  // scrolls whichever tab is actually selected into the visible area,
  // on every change (including the initial one restored from the URL).
  // Scrolls the nav itself, horizontally only: scrollIntoView would also
  // scroll the window vertically and fight LocationsExperience's own
  // scroll to the detail.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>(`[data-location-id="${selectedId}"]`);
    if (!nav || !active) return;
    nav.scrollTo({
      left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [selectedId, reduce]);

  return (
    <nav
      ref={navRef}
      aria-label="Elegir local"
      // Fixed h-14: LocationDetail's pinned column offsets itself by this
      // height. The edge fade on small screens signals the row scrolls.
      className="sticky top-(--header-h) z-40 -mx-5 flex h-14 gap-7 overflow-x-auto border-b border-dresde-line bg-dresde-black/95 px-5 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-2.5rem),transparent)] sm:-mx-8 sm:gap-9 sm:px-8"
    >
      {locations.map((location) => {
        const active = location.id === selectedId;
        return (
          <button
            key={location.id}
            type="button"
            data-location-id={location.id}
            onClick={() => onSelect(location.id)}
            aria-current={active ? "true" : undefined}
            aria-label={`${location.name}, ${location.address}`}
            className={
              "group relative flex h-full shrink-0 flex-col justify-center whitespace-nowrap text-small font-semibold focus-visible:outline-offset-[-4px] transition-colors duration-(--duration-fast) hover:text-dresde-paper focus-visible:text-dresde-paper " +
              (active ? "text-dresde-paper" : "text-dresde-mute")
            }
          >
            {location.name}
            <span className="absolute inset-x-0 bottom-0 h-px">
              {active && (
                <motion.span
                  layoutId="location-nav-indicator"
                  transition={{ duration: duration.medium, ease: ease.inOut }}
                  className="absolute inset-0 bg-dresde-brass"
                />
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
