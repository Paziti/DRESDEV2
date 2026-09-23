"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Headline that first appears as an outline, then floods with fill from
 * left to right the first time it scrolls into view. The idea is React
 * Bits' StrokeText, rebuilt in CSS (no GSAP, no fixed-size SVG) so it
 * wraps and scales like normal text. The outline echoes the engraved
 * inline stroke of the Dresde wordmark.
 */
export function OutlineFillHeading({
  as: Tag = "h2",
  text,
  className,
}: {
  as?: HeadingTag;
  text: string;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  // Observed on the whole heading, not on the clipped fill layer: a layer
  // clipped to nothing never reported itself as in view.
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="block text-transparent [-webkit-text-stroke:1px_rgba(244,241,234,0.45)]"
      >
        {text}
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block"
        // Vertical insets are negative: at this tight line-height the
        // accent on "Í" rises above the box and a 0% inset clipped it.
        initial={{ clipPath: "inset(-25% 100% -25% 0%)" }}
        animate={{ clipPath: inView ? "inset(-25% 0% -25% 0%)" : "inset(-25% 100% -25% 0%)" }}
        transition={{ duration: 1.1, ease: ease.inOut, delay: 0.2 }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}

/**
 * A name whose letters roll up into place on mount, adapted from Animate
 * UI's RollingText (roll-in half only, on framer-motion). Mounted fresh
 * each time the selected local changes, so the motion says "this changed".
 */
export function RollingName({
  as: Tag = "h3",
  text,
  className,
}: {
  as?: HeadingTag;
  text: string;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const words = text.split(" ");
  let index = 0;

  return (
    <Tag className={cn("[perspective:900px]", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, ci) => {
                const delay = index++ * 0.035;
                return (
                  <motion.span
                    key={ci}
                    className="inline-block"
                    style={{ transformOrigin: "50% 100%", backfaceVisibility: "hidden" }}
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.55, ease: ease.out, delay }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
