"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Location } from "@/lib/types";
import { PlaceholderImage } from "./placeholder-image";
import { ease, duration } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LocationsGridProps = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/**
 * Desktop: an editorial hover-expand row — each local claims most of the
 * frame while previewed, adapted from the installed @skiper-ui/skiper52
 * pattern (HoverExpand_001), animating `flex-grow` directly. Not Motion's
 * `layout` prop: its FLIP animation resizes the tile with `scale`, which
 * stretched the photo, the text and the corners for the whole transition.
 * Animating the real size makes the absolutely positioned photo re-crop
 * instead, at the cost of five elements reflowing during a hover.
 *
 * Mobile: a plain vertical scroll — oversized photography, no hover
 * mechanic a touch screen can't express (brief §11/§20).
 *
 * Both variants also carry upstream's other transition effect: the whole
 * row fades and settles up (opacity + translateY) the first time it
 * scrolls into view — `whileInView`, not `animate`, since this section
 * sits well below the fold and would otherwise finish before anyone
 * scrolls to see it.
 *
 * `viewport.amount` is 0.1, not the more typical 0.3 — on mobile the
 * five stacked buttons make this one very tall element (5 × ~58vh), so
 * 30% of it meant scrolling nearly a full screen past the section title
 * before anything appeared. 10% fires as soon as a sensible slice of the
 * first tile is on screen, on both layouts.
 */
export function LocationsGrid({ locations, selectedId, onSelect }: LocationsGridProps) {
  // Only the ephemeral hover/focus preview lives in state. The tile that
  // actually appears expanded is derived each render — hovered, else the
  // real selection (so the sticky nav tabs and a restored URL hash stay
  // in sync without an effect reconciling two copies of the same state),
  // else the first location as a resting default.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activePreviewId = hoveredId ?? selectedId ?? locations[0]?.id;
  const hasSelection = selectedId !== null;

  return (
    <>
      {/* Desktop / tablet: hover-expand row. Once a local is selected, the
          row itself shrinks — the picker has done its job and the detail
          below is now the focus, so it doesn't need to keep holding a
          full-height slot on screen. A one-time state change (not a
          frequent hover interaction), so animating height directly here
          is the same tolerated exception as an accordion. */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        className={cn(
          "hidden gap-1 transition-[height] duration-(--duration-medium) ease-out-strong md:flex md:w-full",
          hasSelection ? "md:h-[42vh] md:min-h-[300px]" : "md:h-[62vh] md:min-h-[420px]"
        )}
        onMouseLeave={() => setHoveredId(null)}
      >
        {locations.map((location) => {
          const isPreview = activePreviewId === location.id;
          const isSelected = selectedId === location.id;
          return (
            <motion.button
              key={location.id}
              type="button"
              // Slower and softer than the rest of the site's UI motion
              // (duration.slow + ease.out, not the snappier medium/inOut
              // pair) — this flex-grow resize fires on every hover sweep
              // across the row, so a quick, hard-eased snap read as
              // jarring where a settling, decelerating move reads calm.
              initial={false}
              animate={{ flexGrow: isPreview ? 2.4 : 1 }}
              transition={{ duration: duration.slow, ease: ease.out }}
              onMouseEnter={() => setHoveredId(location.id)}
              onFocus={() => setHoveredId(location.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => onSelect(location.id)}
              aria-pressed={isSelected}
              aria-label={`Ver ${location.name}, ${location.address}`}
              // 6:1 (the original ratio) squeezed the other four real
              // photos into ~130px slivers — barely recognizable rather
              // than "oversized, editorial". 2.4:1 still gives the
              // previewed tile clear priority (~37% of the row vs ~16%
              // each) without making the rest illegible.
              className="hover-zoom group relative h-full min-w-0 basis-0 overflow-hidden rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dresde-brass"
            >
              <span className="hover-zoom-img absolute inset-0 block transition-transform duration-(--duration-slow) ease-out-strong">
                <PlaceholderImage
                  alt={location.images[0]?.alt ?? location.name}
                  src={location.images[0]?.src}
                  label={location.address}
                  priority={location.id === locations[0]?.id}
                  // A tile is never full viewport width here — it's one
                  // of 5 flex-grow columns, roughly 8–60% depending on
                  // preview state. 100vw (the default) told Next to fetch
                  // a needlessly large image for every tile.
                  sizes="(min-width: 768px) 60vw, 100vw"
                />
              </span>

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-opacity duration-(--duration-slow) ease-out-strong"
                style={{ opacity: isPreview ? 1 : 0.55 }}
              />

              {/* Only the previewed tile carries its name: the narrow ones
                  are too slim for it at any size, and nowrap text clipped
                  mid-word ("WASHIN", "SALLIQU") read as broken. The button's
                  aria-label still names every tile. */}
              <span
                className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 overflow-hidden p-6 transition-opacity duration-(--duration-slow) ease-out-strong"
                style={{ opacity: isPreview ? 1 : 0 }}
              >
                <span className="whitespace-nowrap font-display text-display-m font-extrabold uppercase text-dresde-paper">
                  {location.name}
                </span>
                <span className="whitespace-nowrap text-small text-dresde-paper-dim">
                  {location.address}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Mobile: natural vertical scroll */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        className="flex flex-col gap-3 md:hidden"
      >
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location.id)}
            aria-pressed={selectedId === location.id}
            aria-label={`Ver ${location.name}, ${location.address}`}
            className={cn(
              "relative block w-full overflow-hidden rounded-lg text-left transition-[height] duration-(--duration-medium) ease-out-strong",
              hasSelection ? "h-[34vh] min-h-[240px]" : "h-[52vh] min-h-[360px]"
            )}
          >
            <PlaceholderImage
              alt={location.images[0]?.alt ?? location.name}
              src={location.images[0]?.src}
              label={location.address}
              priority={location.id === locations[0]?.id}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
              <span className="font-display text-display-m font-extrabold uppercase text-dresde-paper">
                {location.name}
              </span>
              <span className="text-small text-dresde-paper-dim">{location.address}</span>
            </span>
          </button>
        ))}
      </motion.div>
    </>
  );
}
