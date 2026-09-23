"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { locations } from "@/lib/locations";
import { whatsappBookingUrl } from "@/lib/whatsapp";
import { asset } from "@/lib/utils";
import { useSelection } from "@/lib/selection-context";
import { ease, duration } from "@/lib/motion";

// Same file as the hero, at a small fixed size. Native aspect ratio
// (675×347) — height is set via className, width follows automatically.
const LOGO_WIDTH = 675;
const LOGO_HEIGHT = 347;

/**
 * Purpose: spatial consistency — a persistent, minimal way back to the top
 * and to booking once the hero has scrolled away. Absent for the hero
 * itself so the brand entrance stays uncluttered (brief §9).
 *
 * The CTA reflects whichever local is actually selected (shared via
 * SelectionContext) rather than silently defaulting to one the visitor
 * never chose. Before a choice is made, it points at the locals section
 * instead of guessing.
 */
export function SiteHeader() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const { selectedId } = useSelection();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > (typeof window !== "undefined" ? window.innerHeight * 0.7 : 480);
    setVisible((prev) => (prev === next ? prev : next));
  });

  // Publishes the header's real height as --header-h so the sticky
  // location nav sits flush under it instead of guessing a pixel value
  // (safe-area padding on iOS changes it).
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--header-h", `${el.getBoundingClientRect().height}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(-12px)",
      }}
      transition={{ duration: duration.fast, ease: ease.out }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      // While hidden over the hero it must not take keyboard focus either:
      // tabbing landed on two invisible links before the first tile.
      inert={!visible}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-dresde-line bg-dresde-black/90 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md sm:px-8"
    >
      <a
        href="#top"
        aria-label="Dresde, volver arriba"
        className="inline-flex min-h-11 shrink-0 items-center transition-opacity duration-(--duration-fast) hover:opacity-80"
      >
        <Image
          src={asset("/brand/dresde-logo.png")}
          alt="Dresde"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          className="h-7 w-auto select-none sm:h-8"
        />
      </a>
      {selected ? (
        <a
          href={whatsappBookingUrl(selected)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-dresde-line-strong px-4 text-small font-semibold text-dresde-paper transition-colors duration-(--duration-fast) hover:border-dresde-brass hover:text-dresde-brass focus-visible:border-dresde-brass"
        >
          Reservar en {selected.name}
        </a>
      ) : (
        <a
          href="#locales"
          className="inline-flex min-h-11 items-center border border-dresde-line-strong px-4 text-small font-semibold text-dresde-paper transition-colors duration-(--duration-fast) hover:border-dresde-brass hover:text-dresde-brass focus-visible:border-dresde-brass"
        >
          Elegir local
        </a>
      )}
    </motion.header>
  );
}
