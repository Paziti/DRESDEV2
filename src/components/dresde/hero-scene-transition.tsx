"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DresdeHero } from "./dresde-hero";

// Not Dresde's own footage — generic stock clip, kept only until real
// content replaces it. See public/video/ and the README.
const VIDEO_SRC = "/video/clipper-curtain.mp4";

// On a wide desktop viewport, `object-cover` barely crops this clip
// horizontally — the whole 16:9 frame is visible, and the actual
// haircut/clipper action sits noticeably right of center, with mostly
// empty blurred background on the left third. On a narrow mobile
// portrait viewport, `object-cover` crops HARD on the horizontal axis
// (a tall/narrow box against a wide clip), so the default 50% center
// anchor was landing squarely on that empty left-of-subject area —
// reported as "seeing the left side" on mobile. Biasing the anchor
// right shifts the visible slice toward where the subject actually is.
const VIDEO_OBJECT_POSITION = "70% center";

// Total scroll the scene takes. Raise it to slow the whole transition
// down, lower it to speed it up; every moment below scales with it.
const SCENE_VH = 260;
// The panel is one viewport tall, so it stays pinned for the rest.
const PINNED_VH = SCENE_VH - 100;
const at = (vh: number) => vh / SCENE_VH;
// A point in the pinned phase, as a share of it (0 = top, 1 = unstick).
const pin = (share: number) => at(PINNED_VH * share);

/**
 * Hero → "Elegí tu Dresde" as one continuous scroll-driven scene, not
 * hero-section, then separate-video-block, then next-section. A single
 * tall container pins both the hero and the video to the viewport.
 *
 * The two are genuinely separate layers, not a cross-dissolve:
 *   - Hero sits in its own stacking context on top (z-10) and fades +
 *     drifts up (pin(0.075) → pin(0.375)).
 *   - Video sits underneath (z-0) and stays fully clipped — zero
 *     visible area, not just opacity 0 — until the hero has finished
 *     retiring. It then reveals from the BOTTOM edge upward via
 *     `clip-path: inset()`, like a scene sliding in from below, rather
 *     than fading in on top of the hero. Because it's a hard geometric
 *     mask (not alpha blending), the video never visually bleeds
 *     through the logo while the logo is still on screen.
 *
 * Everything is a function of scroll progress (useScroll → useTransform),
 * never a fixed-duration animation — scrolling back up reverses it
 * exactly, frame for frame.
 *
 * `progress` 0→1 tracks the WHOLE container (`["start start", "end
 * start"]`): the pinned phase (container − panel height) plus the
 * panel's own 100vh release glide. With the usual "end end" offset,
 * progress froze at 1 the instant the panel unstuck and the whole glide
 * played out as plain black.
 *
 * Moments in the pinned phase are shares of it (`pin(share)`), so one
 * number, SCENE_VH, sets how much scrolling the whole scene takes.
 */
export function HeroSceneTransition() {
  const reduce = usePrefersReducedMotion();
  const sceneRef = useRef<HTMLElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end start"],
  });

  // A short dead zone first: the hero starting to fade on the very
  // first pixel scrolled read as premature. Then it fades and drifts up.
  const heroOpacity = useTransform(scrollYProgress, [pin(0.075), pin(0.375)], [1, 0]);
  const heroY = useTransform(scrollYProgress, [pin(0.075), pin(0.375)], [0, -48]);

  // The video reveal starts only once the hero has fully retired, so the
  // two never share the screen. `clipTop` is the share still masked off
  // the TOP: 100 → 0 reads as the video rising from the bottom edge. The
  // dolly-in (0.88 → 1 → 1.08) ends exactly when the panel unsticks.
  const videoClipTop = useTransform(scrollYProgress, [pin(0.375), pin(0.72)], [100, 0]);
  const videoScale = useTransform(
    scrollYProgress,
    [pin(0.375), pin(0.66), pin(1)],
    [0.88, 1, 1.08]
  );
  // Fade into "Elegí tu Dresde" only in the last stretch of the release
  // glide, reaching 0 right as the panel leaves the viewport: the video
  // keeps accompanying the scroll instead of leaving a black gap.
  const videoOpacity = useTransform(scrollYProgress, [at(SCENE_VH - 27), 1], [1, 0]);

  // `opacity` (and, for the same reason, `clip-path`) are deliberately
  // NOT passed through the motion component's `style` prop here —
  // verified in the browser that non-transform CSS properties don't
  // reliably survive there on this element. The MotionValue itself
  // recalculates correctly every frame (confirmed via its own "change"
  // event), but mixed into the same style object as transform values
  // (scale, y), Framer's own render pass kept re-committing a stale
  // cached value right after any manual write, reverting it every
  // frame. Framer still owns scale/y normally (that path is
  // unaffected); opacity and clip-path are written directly off their
  // MotionValues instead, so nothing fights the manual write.
  //
  // clip-path and scale are also deliberately on TWO DIFFERENT elements
  // (mask wrapper vs. video), not the same one. `scale` shrinks the
  // whole element toward its center — combined on the same element as
  // a clip-path reveal, the video's own box was smaller than the
  // viewport for most of the range (0.88 at the start), leaving black
  // margins on every edge instead of true edge-to-edge coverage, which
  // is what actually read as "cut off, using only half the screen".
  // The mask (always exactly viewport-sized) owns the clip-path reveal;
  // the video inside it is oversized (130%) and owns the scale dolly,
  // so it always more than covers the mask's window regardless of
  // scale.
  useMotionValueEvent(heroOpacity, "change", (latest) => {
    if (heroLayerRef.current) heroLayerRef.current.style.opacity = String(latest);
  });
  useMotionValueEvent(videoClipTop, "change", (latest) => {
    if (videoMaskRef.current) videoMaskRef.current.style.clipPath = `inset(${latest}% 0% 0% 0%)`;
  });
  useMotionValueEvent(videoOpacity, "change", (latest) => {
    if (videoMaskRef.current) videoMaskRef.current.style.opacity = String(latest);
  });
  // Same reasoning as above: set the mask's starting clip imperatively
  // once, rather than via the style prop, so nothing ever resets it to
  // "fully visible" before the first scroll-driven update arrives.
  useEffect(() => {
    if (videoMaskRef.current) videoMaskRef.current.style.clipPath = "inset(100% 0% 0% 0%)";
  }, []);

  // Play only while the scene is actually part of the transition, not
  // for the whole time it merely exists in the DOM — pauses decoding
  // once the user has scrolled well past it (or hasn't reached it yet).
  // Continuous (no `once`), so scrolling back into range resumes it.
  const inView = useInView(sceneRef);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reduce]);

  if (reduce) {
    return (
      <>
        <DresdeHero />
        <section
          aria-hidden="true"
          className="relative h-[70svh] w-full overflow-hidden bg-dresde-black"
        >
          {/* A still frame, not a loop: reduced motion means no autoplay.
              The #t fragment makes the browser paint that frame. */}
          <video
            src={`${VIDEO_SRC}#t=0.5`}
            muted
            playsInline
            preload="metadata"
            style={{ objectPosition: VIDEO_OBJECT_POSITION }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </section>
      </>
    );
  }

  return (
    <section ref={sceneRef} className="relative w-full bg-dresde-black" style={{ height: `${SCENE_VH}vh` }}>
      {/* h-lvh, not h-svh: when the mobile browser bar collapses, the
          visible viewport grows to lvh, and an svh panel left a strip of
          bare black under the video. The hero layer stays h-svh, top
          aligned, so the logo centers in the area that is always visible. */}
      <div className="sticky top-0 h-lvh w-full overflow-hidden">
        {/* z-10: an explicit stacking context above the video, not just
            DOM-order luck — the hero must never be paintable-under the
            video even for a single frame. */}
        <motion.div
          ref={heroLayerRef}
          style={{ y: heroY }}
          className="absolute inset-x-0 top-0 z-10 h-svh"
        >
          <DresdeHero pinned />
        </motion.div>

        {/* Always exactly viewport-sized — owns the clip-path reveal
            only. Never scaled itself, so the reveal window is always
            the true full screen, edge to edge. */}
        <div ref={videoMaskRef} className="absolute inset-0 z-0 overflow-hidden">
          {/* Oversized (130%) so that even at the smallest scale in
              videoScale's range (0.88), it still more than covers the
              mask above — no black margins at any point in the dolly. */}
          <motion.video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            style={{
              scale: videoScale,
              top: "-15%",
              left: "-15%",
              width: "130vw",
              height: "130lvh",
              maxWidth: "none",
              objectPosition: VIDEO_OBJECT_POSITION,
            }}
            className="absolute object-cover"
          />
        </div>
      </div>
    </section>
  );
}
