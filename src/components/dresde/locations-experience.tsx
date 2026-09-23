"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { locations } from "@/lib/locations";
import { useSelection } from "@/lib/selection-context";
import { LocationsGrid } from "./locations-grid";
import { LocationNavigation } from "./location-navigation";
import { LocationDetail } from "./location-detail";
import { OutlineFillHeading } from "./motion-text";
import { ease, duration } from "@/lib/motion";

const isValidId = (id: string) => locations.some((l) => l.id === id);

/**
 * Orchestrates the core flow the brief names in §8:
 * LOCALES → ELIGE LOCAL → DESCUBRE → INFORMACIÓN → RESERVA.
 *
 * Selecting a local doesn't navigate away — it reveals the detail in place
 * and scrolls to it, so switching locals never means losing your place
 * (brief §12/§14). The selection is also mirrored to the URL hash so a
 * chosen local is shareable and survives a refresh or the back button.
 */
export function LocationsExperience() {
  const { selectedId, setSelectedId } = useSelection();
  const reduce = usePrefersReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);
  // Set when a shared #dresde-XX link restores a selection, so the page
  // lands on that local instead of staying on the hero.
  const pendingRestoreScroll = useRef(false);

  // Restore selection from the URL hash on load (#dresde-01, etc.) — this
  // runs once on mount, client-side only, so it never fights hydration.
  //
  // The browser's own scroll restoration was fighting this: no element on
  // the page actually has an id matching the hash (it's bookkeeping, not
  // a real anchor), so a plain visit landed wherever the browser's
  // back/forward cache happened to remember from a previous visit to the
  // same URL — reported as "sometimes at the top, sometimes a bit lower".
  // Taking manual control and forcing (0, 0) for a plain link makes every
  // fresh visit start from the same place regardless of that history.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const hash = window.location.hash.replace("#dresde-", "");
    if (isValidId(hash)) {
      pendingRestoreScroll.current = true;
      setSelectedId(hash);
    } else {
      window.scrollTo(0, 0);
    }
    // setSelectedId is a useState setter (via context) — stable across
    // renders, so listing it here doesn't cause extra runs; it only
    // satisfies exhaustive-deps.
  }, [setSelectedId]);

  // In-page links to a local (#dresde-02, e.g. from the footer) point at
  // no real element, so the browser wouldn't scroll, and clicking the
  // hash already in the URL fires no hashchange. Handle the click itself.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#dresde-"]');
      const id = link?.getAttribute("href")?.replace("#dresde-", "");
      if (!id || !isValidId(id)) return;
      event.preventDefault();
      handleSelectRef.current(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const url = selected ? `#dresde-${selected.id}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [selected]);

  // A fixed `scroll-mt` fought the sticky site header: that header's
  // real height isn't constant (it wraps differently at some widths),
  // so a hardcoded offset landed right for one viewport and wrong for
  // another. Reading the header's actual height at scroll time lands the
  // nav exactly where the fixed header ends, with no dead gap.
  function scrollToDetail(behavior: ScrollBehavior) {
    const el = detailRef.current;
    if (!el) return;
    const fixedHeader = document.querySelector("header");
    const headerHeight = fixedHeader?.getBoundingClientRect().height ?? 0;
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: targetY, behavior });
  }

  // The first selection shrinks the grid above the detail with an
  // animated `transition-[height]`. Scrolling before that finishes
  // measures a target that then moves up, overshooting (reported on
  // mobile as landing on the second gallery photo instead of the
  // location header), so that case waits the shrink out.
  const gridShrinkMs = duration.medium * 1000 + 30;

  useEffect(() => {
    if (!selected || !pendingRestoreScroll.current) return;
    // "instant", not "auto": html has `scroll-behavior: smooth`, which
    // "auto" would inherit and animate the whole way down from the hero.
    const timer = setTimeout(() => {
      pendingRestoreScroll.current = false;
      scrollToDetail("instant");
    }, reduce ? 0 : gridShrinkMs);
    return () => clearTimeout(timer);
    // Runs once per restore; scrollToDetail only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSelectRef = useRef(handleSelect);
  useEffect(() => {
    handleSelectRef.current = handleSelect;
  });

  function handleSelect(id: string) {
    const gridIsShrinking = selectedId === null;
    setSelectedId(id);

    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    if (gridIsShrinking && !reduce) {
      setTimeout(() => scrollToDetail(behavior), gridShrinkMs);
    } else {
      requestAnimationFrame(() => scrollToDetail(behavior));
    }
  }

  return (
    <section id="locales" className="relative w-full px-5 py-16 sm:px-8 sm:py-24">
      <header className="mb-10 grid gap-5 sm:mb-14 md:grid-cols-12 md:items-end md:gap-10">
        <OutlineFillHeading
          text="Elegí tu Dresde"
          className="font-display text-display-xl font-extrabold uppercase text-dresde-paper md:col-span-8"
        />
        <p className="max-w-[34ch] text-body text-dresde-paper-dim md:col-span-4 md:justify-self-end md:pb-3">
          Cinco locales en Bahía Blanca. Elegí uno para ver horarios, servicios y equipo, y reservá
          tu turno por WhatsApp.
        </p>
      </header>

      <LocationsGrid locations={locations} selectedId={selectedId} onSelect={handleSelect} />

      {/* Announces the selection change for screen-reader users — the
          visual reveal + scroll already carries this for sighted users. */}
      <p role="status" className="sr-only">
        {selected ? `Mostrando ${selected.name}, ${selected.address}` : ""}
      </p>

      {/*
       * No AnimatePresence here: its exit-tracking turned out unreliable
       * in this framer-motion version — verified against a production
       * build, not just dev/Strict Mode noise. Exiting content would
       * sometimes never unmount (stuck mid-fade forever) or, worse,
       * neither the outgoing nor incoming panel would animate at all when
       * swapping between two already-selected locals, leaving the old
       * content on screen. Dropping the exit animation and keying the
       * panel by `selected.id` sidesteps it entirely: React unmounts the
       * old panel and mounts the new one in the same commit (no broken
       * exit phase to get stuck in), and Motion still runs the panel's
       * own fade-in on every mount (the name's letter roll marks the change).
       */}
      <div ref={detailRef}>
        {/* Not inside the keyed motion.div below on purpose: this is
            persistent navigation chrome, not content being revealed —
            it should just update which tab is active, not fade/clip in
            again on every switch the way the actual detail content does. */}
        {selected && (
          <LocationNavigation
            locations={locations}
            selectedId={selected.id}
            onSelect={handleSelect}
          />
        )}
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.medium, ease: ease.out }}
          >
            <LocationDetail location={selected} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
