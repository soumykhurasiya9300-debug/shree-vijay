"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { MotionSubtitle } from "@/components/unlumen-ui/motion-subtitle";
import defaultLehengaFallback from "@/assets/images/bridal_lehenga_collection_1790317477737.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface OrbitalImageWheelImage {
  src: string;
  alt?: string;
  label?: string;
  subtitle?: string;
  sku?: string;
  price?: number;
  category?: string;
  onView?: () => void;
  onEnquire?: () => void;
}

export interface OrbitalImageWheelProps {
  /** Images displayed around the wheel. */
  images: OrbitalImageWheelImage[];
  /** Number of full wheel turns during the scroll range. @default 4 */
  turns?: number;
  /** Maximum blur amount (px) away from the focus zone. @default 4 */
  blur?: number;
  /** Minimum brightness (%) away from focus. @default 40 */
  dim?: number;
  /** Extra brightness boost (%) around the active card. @default 30 */
  brightnessBoost?: number;
  /** Multiplier for out-of-focus darkening intensity. @default 1.05 */
  darknessStrength?: number;
  /** Minimum saturation (%) away from focus. @default 55 */
  minSaturation?: number;
  /** Multiplier for out-of-focus desaturation intensity. @default 0.6 */
  saturationStrength?: number;
  /** Focus zone width as normalized angular range. @default 0.34 */
  focusSpread?: number;
  /** Scale reduction amount away from focus. @default 0.06 */
  scaleEffect?: number;
  /** Scroll sensitivity multiplier. Lower values require longer scrolling. @default 0.7 */
  scrollSensitivity?: number;
  /** Card width in pixels. @default 220 */
  itemWidth?: number;
  /** Card height in pixels. @default 300 */
  itemHeight?: number;
  /** Optional fixed wheel diameter in pixels. Defaults to a responsive value based on viewport width. */
  wheelSize?: number;
  /** How much of the wheel sits below the viewport (0..1). `0.5` keeps only the top half visible. @default 0.75 */
  cropRatio?: number;
  /** Scroll section height in viewport units. @default 330 */
  scrollLength?: number;
  /** Bottom offset of the caption block in viewport units. @default 8 */
  captionOffset?: number;
  /** Show or hide the centered caption. @default true */
  showCaption?: boolean;
  /** Subtitle animation direction. @default "top" */
  subtitleDirection?: "top" | "bottom";
  /** Subtitle animation speed multiplier. @default 1 */
  subtitleSpeed?: number;
  /** Delay between subtitle character reveals in seconds. @default 0.018 */
  subtitleStagger?: number;
  /** Optional scrollable container element used as the animation scroller. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** Additional class name on the root element. */
  className?: string;
  /** Optional callback when an image becomes active */
  onActiveIndexChange?: (index: number) => void;
}

const DEFAULT_TURNS = 2.5;
const DEFAULT_BLUR = 4;
const DEFAULT_DIM = 40;
const DEFAULT_BRIGHTNESS_BOOST = 30;
const DEFAULT_DARKNESS_STRENGTH = 1.05;
const DEFAULT_MIN_SATURATION = 55;
const DEFAULT_SATURATION_STRENGTH = 0.6;
const DEFAULT_FOCUS_SPREAD = 0.34;
const DEFAULT_SCALE_EFFECT = 0.06;
const DEFAULT_SCROLL_SENSITIVITY = 0.7;
const DEFAULT_ITEM_WIDTH = 260;
const DEFAULT_ITEM_HEIGHT = 360;
const DEFAULT_SCROLL_LENGTH = 280;
const DEFAULT_CROP_RATIO = 0.75;
const DEFAULT_CAPTION_OFFSET = 12;
const DEFAULT_SUBTITLE_DIRECTION = "top";
const DEFAULT_SUBTITLE_SPEED = 1;
const DEFAULT_SUBTITLE_STAGGER = 0.018;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function shortestAngleDistance(a: number, b: number) {
  const full = Math.PI * 2;
  const raw = ((a - b + Math.PI) % full) - Math.PI;
  const normalized = raw < -Math.PI ? raw + full : raw;
  return Math.abs(normalized);
}

function applyScrollSensitivity(progress: number, sensitivity: number) {
  const safeSensitivity = clamp(sensitivity, 0.25, 1.6);
  const exponent = 1 / safeSensitivity;
  return Math.pow(clamp(progress, 0, 1), exponent);
}

function getFocusedImageIndexWithHysteresis(
  progress: number,
  total: number,
  turns: number,
  currentIndex: number,
  hysteresis = 0.18,
) {
  if (total <= 0 || turns <= 0) return 0;

  const phaseRaw = total * (0.25 + progress * turns);
  const phase = ((phaseRaw % total) + total) % total;

  if (currentIndex < 0) {
    return Math.round(phase) % total;
  }

  let next = currentIndex;
  let delta = phase - next;

  if (delta > total / 2) delta -= total;
  if (delta < -total / 2) delta += total;

  const threshold = 0.5 + clamp(hysteresis, 0, 0.35);

  while (delta > threshold) {
    next = (next + 1) % total;
    delta -= 1;
  }

  while (delta < -threshold) {
    next = (next - 1 + total) % total;
    delta += 1;
  }

  return next;
}

function getSnapProgressForIndex(
  index: number,
  total: number,
  turns: number,
  currentProgress: number,
) {
  if (total <= 0 || turns <= 0) return clamp(currentProgress, 0, 1);

  const safeIndex = ((index % total) + total) % total;
  const minCycle = Math.floor(-turns - 2);
  const maxCycle = Math.ceil(turns + 2);
  let nearest = clamp(currentProgress, 0, 1);
  let minDistance = Number.POSITIVE_INFINITY;

  for (let cycle = minCycle; cycle <= maxCycle; cycle += 1) {
    const progress = (safeIndex / total - 0.25 - cycle) / turns;
    if (progress < 0 || progress > 1) continue;

    const distance = Math.abs(progress - currentProgress);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = progress;
    }
  }

  if (!Number.isFinite(minDistance)) {
    return clamp((safeIndex / total - 0.25) / turns, 0, 1);
  }

  return nearest;
}

function useViewportWidth(viewportRef: RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () => setWidth(viewport.clientWidth || 1200);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [viewportRef]);

  return width;
}

export function OrbitalImageWheel({
  images,
  turns = DEFAULT_TURNS,
  blur = DEFAULT_BLUR,
  dim = DEFAULT_DIM,
  brightnessBoost = DEFAULT_BRIGHTNESS_BOOST,
  darknessStrength = DEFAULT_DARKNESS_STRENGTH,
  minSaturation = DEFAULT_MIN_SATURATION,
  saturationStrength = DEFAULT_SATURATION_STRENGTH,
  focusSpread = DEFAULT_FOCUS_SPREAD,
  scaleEffect = DEFAULT_SCALE_EFFECT,
  scrollSensitivity = DEFAULT_SCROLL_SENSITIVITY,
  itemWidth = DEFAULT_ITEM_WIDTH,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  wheelSize,
  cropRatio = DEFAULT_CROP_RATIO,
  scrollLength = DEFAULT_SCROLL_LENGTH,
  captionOffset = DEFAULT_CAPTION_OFFSET,
  showCaption = true,
  subtitleDirection = DEFAULT_SUBTITLE_DIRECTION,
  subtitleSpeed = DEFAULT_SUBTITLE_SPEED,
  subtitleStagger = DEFAULT_SUBTITLE_STAGGER,
  scrollContainerRef,
  className,
  onActiveIndexChange,
}: OrbitalImageWheelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const titleClickTweenRef = useRef<gsap.core.Tween | null>(null);
  const titleViewportRef = useRef<HTMLDivElement>(null);
  const titleTrackRef = useRef<HTMLDivElement>(null);
  const titleStartSpacerRef = useRef<HTMLSpanElement>(null);
  const titleEndSpacerRef = useRef<HTMLSpanElement>(null);
  const titleTrackXToRef = useRef<((value: number) => void) | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewportWidth = useViewportWidth(viewportRef);

  const boundedTurns = clamp(turns, 0.2, 4);
  const boundedBlur = clamp(blur, 0, 36);
  const boundedDim = clamp(dim, 0, 100);
  const boundedBrightnessBoost = clamp(brightnessBoost, 0, 120);
  const boundedDarknessStrength = clamp(darknessStrength, 0.2, 3);
  const boundedMinSaturation = clamp(minSaturation, 0, 100);
  const boundedSaturationStrength = clamp(saturationStrength, 0.2, 3);
  const boundedFocusSpread = clamp(focusSpread, 0.08, 0.8);
  const boundedScaleEffect = clamp(scaleEffect, 0, 0.3);
  const boundedScrollSensitivity = clamp(scrollSensitivity, 0.25, 1.6);
  const boundedItemWidth = clamp(itemWidth, 140, 520);
  const boundedItemHeight = clamp(itemHeight, 180, 620);
  const boundedCropRatio = clamp(cropRatio, 0.2, 0.8);
  const boundedScrollLength = clamp(scrollLength, 180, 700);
  const boundedCaptionOffset = clamp(captionOffset, 2, 22);
  const boundedSubtitleSpeed = clamp(subtitleSpeed, 0.3, 3);
  const boundedSubtitleStagger = clamp(subtitleStagger, 0, 0.08);
  const boundedSubtitleDirection =
    subtitleDirection === "bottom" ? "bottom" : "top";

  const responsiveWheelSize = clamp(viewportWidth * 1.65, 900, 2400);
  const boundedWheelSize = clamp(wheelSize ?? responsiveWheelSize, 700, 2600);
  const radius = boundedWheelSize / 2;
  const titleLabels = useMemo(
    () => images.map((img, i) => img.label ?? img.alt ?? `Look ${i + 1}`),
    [images],
  );
  const titleTrackLabels = useMemo(() => titleLabels, [titleLabels]);
  const activeTitleTrackIndex = Math.max(
    0,
    Math.min(activeIndex, titleTrackLabels.length - 1),
  );

  const handleTitleClick = useCallback(
    (index: number) => {
      const trigger = wheelScrollTriggerRef.current;
      if (!trigger || images.length === 0) return;

      const currentProgress = clamp(trigger.progress, 0, 1);
      const targetProgress = getSnapProgressForIndex(
        index,
        images.length,
        boundedTurns,
        currentProgress,
      );

      const scrollStart = trigger.start;
      const scrollEnd = trigger.end;
      const scrollRange = scrollEnd - scrollStart;
      if (scrollRange <= 0) return;

      const fromScroll = scrollStart + currentProgress * scrollRange;
      const toScroll = scrollStart + targetProgress * scrollRange;

      setActiveIndex(index);
      if (onActiveIndexChange) onActiveIndexChange(index);
      titleClickTweenRef.current?.kill();

      const proxy = { scroll: fromScroll };
      titleClickTweenRef.current = gsap.to(proxy, {
        scroll: toScroll,
        duration: 0.58,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          trigger.scroll(proxy.scroll);
        },
        onComplete: () => {
          setActiveIndex(index);
          if (onActiveIndexChange) onActiveIndexChange(index);
        },
      });
    },
    [images.length, boundedTurns, onActiveIndexChange],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    if (!section || !wheel || images.length === 0) return;

    let previousActive = -1;

    const context = gsap.context(() => {
      const cards = Array.from(
        wheel.querySelectorAll<HTMLElement>(".oiw-item"),
      );
      if (cards.length === 0) return;

      const topAnchor = -Math.PI / 2;
      const focusArc = Math.PI * boundedFocusSpread;

      const applyState = (rawProgress: number) => {
        const p = applyScrollSensitivity(rawProgress, boundedScrollSensitivity);
        const rotation = -p * boundedTurns * Math.PI * 2;
        const focusedIndex = getFocusedImageIndexWithHysteresis(
          p,
          cards.length,
          boundedTurns,
          previousActive,
        );

        cards.forEach((card, index) => {
          const base = (index / cards.length) * Math.PI * 2 - Math.PI;
          const theta = base + rotation;
          const x = Math.cos(theta) * radius;
          const y = Math.sin(theta) * radius;

          const distanceToFocus = shortestAngleDistance(theta, topAnchor);
          const focusIntensity = clamp(distanceToFocus / focusArc, 0, 1);

          const darkIntensity = clamp(
            focusIntensity * boundedDarknessStrength,
            0,
            1,
          );
          const saturationIntensity = clamp(
            focusIntensity * boundedSaturationStrength,
            0,
            1,
          );

          const currentBlur = darkIntensity * boundedBlur;
          const peakBrightness = clamp(100 + boundedBrightnessBoost, 100, 220);
          const currentBrightness =
            boundedDim + (1 - darkIntensity) * (peakBrightness - boundedDim);
          const currentSaturation =
            boundedMinSaturation +
            (1 - saturationIntensity) * (100 - boundedMinSaturation);
          const currentScale = 1 - darkIntensity * boundedScaleEffect;
          const drift = clamp(x / radius, -1, 1);
          const tilt = drift * 8;
          const depth = clamp((1 - focusIntensity) * 100, 0, 100);

          gsap.set(card, {
            x,
            y,
            xPercent: -50,
            yPercent: -50,
            z: depth,
            rotate: tilt,
            scale: currentScale,
            filter: `blur(${currentBlur}px) brightness(${currentBrightness}%) saturate(${currentSaturation}%)`,
            zIndex: Math.round(depth) + 10,
          });
        });

        if (focusedIndex !== previousActive) {
          previousActive = focusedIndex;
          setActiveIndex(focusedIndex);
          if (onActiveIndexChange) onActiveIndexChange(focusedIndex);
        }
      };

      applyState(0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainerRef?.current ?? undefined,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          applyState(self.progress);
        },
      });

      wheelScrollTriggerRef.current = trigger;
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [
    scrollContainerRef,
    images,
    radius,
    boundedTurns,
    boundedBlur,
    boundedDim,
    boundedBrightnessBoost,
    boundedDarknessStrength,
    boundedMinSaturation,
    boundedSaturationStrength,
    boundedFocusSpread,
    boundedScaleEffect,
    boundedScrollSensitivity,
    onActiveIndexChange,
  ]);

  useEffect(() => {
    return () => {
      titleClickTweenRef.current?.kill();
      wheelScrollTriggerRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    try {
      const viewport = titleViewportRef.current;
      const track = titleTrackRef.current;
      const startSpacer = titleStartSpacerRef.current;
      const endSpacer = titleEndSpacerRef.current;
      if (!viewport || !track || titleTrackLabels.length === 0) return;

      if (!titleTrackXToRef.current) {
        try {
          titleTrackXToRef.current = gsap.quickTo(track, "x", {
            duration: 0.62,
            ease: "power4.out",
            overwrite: true,
          });
        } catch (e) {
          console.warn("GSAP quickTo fallback", e);
        }
      }

      const firstTitle = track.querySelector<HTMLElement>(
        `[data-title-index="0"]`,
      );
      const lastTitle = track.querySelector<HTMLElement>(
        `[data-title-index="${titleTrackLabels.length - 1}"]`,
      );

      const activeTitle = track.querySelector<HTMLElement>(
        `[data-title-index="${activeTitleTrackIndex}"]`,
      );
      if (!activeTitle || !firstTitle || !lastTitle) return;

      const viewportWidthPx = viewport.clientWidth;

      // Add edge spacers so the first and last pills can be centered.
      const startPad = Math.max(
        0,
        viewportWidthPx / 2 - firstTitle.offsetWidth / 2,
      );
      const endPad = Math.max(0, viewportWidthPx / 2 - lastTitle.offsetWidth / 2);

      if (startSpacer) {
        startSpacer.style.width = `${Math.round(startPad)}px`;
      }

      if (endSpacer) {
        endSpacer.style.width = `${Math.round(endPad)}px`;
      }

      const activeCenter = activeTitle.offsetLeft + activeTitle.offsetWidth / 2;

      let targetX = Math.round(viewportWidthPx / 2 - activeCenter);

      if (track.scrollWidth <= viewportWidthPx) {
        targetX = Math.round((viewportWidthPx - track.scrollWidth) / 2);
      } else {
        const minX = viewportWidthPx - track.scrollWidth;
        targetX = Math.round(clamp(targetX, minX, 0));
      }

      if (titleTrackXToRef.current) {
        titleTrackXToRef.current(targetX);
      } else {
        gsap.set(track, { x: targetX });
      }
    } catch (e) {
      console.warn("OrbitalImageWheel useLayoutEffect caught error:", e);
    }
  }, [activeTitleTrackIndex, titleTrackLabels, viewportWidth]);

  const activeImage = useMemo(() => {
    if (images.length === 0) return null;
    return images[activeIndex] ?? images[0];
  }, [images, activeIndex]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full select-none", className)}
      style={{ height: `${boundedScrollLength}vh` }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Background Atmosphere & Heritage Light Rays */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_75%,rgba(74,23,36,0.35),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(184,154,90,0.12),transparent_60%)]" />

        {/* Top Couture Brass Showroom Rail Detail */}
        <div className="relative z-20 pt-8 sm:pt-12 px-4 sm:px-8 max-w-6xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#B89A5A]/30 bg-[#121011]/80 backdrop-blur-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.24em] text-[#D1B875]">
              Couture Orbital Wheel • Scroll to Rotate Rack
            </span>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#B89A5A]/70 to-transparent w-full max-w-2xl mx-auto my-2" />
        </div>

        {/* Center 3D Orbital Wheel */}
        <div
          ref={wheelRef}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: boundedWheelSize,
            height: boundedWheelSize,
            bottom: `-${boundedWheelSize * boundedCropRatio}px`,
          }}
        >
          <div
            className="relative h-full w-full"
            style={{ perspective: "1400px" }}
          >
            {images.map((img, i) => {
              const isCurrent = i === activeIndex;
              return (
                <figure
                  key={i}
                  onClick={() => handleTitleClick(i)}
                  className={cn(
                    "oiw-item absolute left-1/2 top-1/2 m-0 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 group shadow-2xl",
                    isCurrent
                      ? "border-[#D1B875] ring-2 ring-[#B89A5A]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
                      : "border-white/10 hover:border-[#B89A5A]/50 bg-[#121011]"
                  )}
                  style={{ width: boundedItemWidth, height: boundedItemHeight }}
                >
                  {/* Brass Hanger Accent at top of card */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div className="w-6 h-6 rounded-full border-2 border-[#D1B875] bg-[#0A0909]/90 shadow-md" />
                  </div>

                  {/* Garment Image */}
                  <div
                    className="absolute inset-0 h-full w-full overflow-hidden"
                    role="img"
                    aria-label={img.alt ?? img.label ?? `Image ${i + 1}`}
                  >
                    <img
                      src={img.src || defaultLehengaFallback}
                      alt={img.alt ?? img.label ?? `Image ${i + 1}`}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultLehengaFallback;
                      }}
                    />
                  </div>

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-transparent to-black/30 pointer-events-none" />

                  {/* Look badge */}
                  <div className="absolute top-4 left-4 z-20 bg-[#0A0909]/90 border border-[#B89A5A]/40 text-[#F4EEE4] font-mono text-[10px] tracking-widest px-2.5 py-1 uppercase rounded-xs backdrop-blur-md">
                    LOOK {(i + 1).toString().padStart(2, "0")}
                  </div>

                  {/* Bottom Info & Quick Action on Card */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end bg-gradient-to-t from-[#0A0909] via-[#0A0909]/80 to-transparent">
                    {img.category && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89A5A] font-semibold truncate">
                        {img.category}
                      </span>
                    )}
                    <h4 className="font-display text-sm sm:text-base font-bold text-[#F4EEE4] truncate drop-shadow-sm">
                      {img.label ?? img.alt}
                    </h4>

                    {img.price && (
                      <div className="text-xs font-mono font-medium text-[#D1B875] mt-0.5">
                        ₹{img.price.toLocaleString("en-IN")}
                      </div>
                    )}

                    {/* Quick Action buttons */}
                    <div className="mt-2.5 flex items-center gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
                      {img.onView && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            img.onView?.();
                          }}
                          className="flex-1 py-1.5 px-2 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#D1B875] text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors shadow-md text-center"
                        >
                          View Look
                        </button>
                      )}
                      {img.onEnquire && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            img.onEnquire?.();
                          }}
                          className="flex-1 py-1.5 px-2 bg-[#4A1724] border border-[#B89A5A]/50 text-[#F4EEE4] hover:bg-[#5C1D2D] text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors shadow-md text-center"
                        >
                          Enquire
                        </button>
                      )}
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Bottom Centered Caption and Navigation Rail */}
        {showCaption && activeImage && (
          <div
            className="pointer-events-none absolute inset-x-0 z-30 flex justify-center pb-6"
            style={{ bottom: `${boundedCaptionOffset}vh` }}
          >
            <div className="px-4 text-center max-w-4xl mx-auto w-full">
              {/* Animated Editorial Subtitle */}
              <div className="mb-2">
                <MotionSubtitle
                  text={activeImage.subtitle ?? activeImage.alt ?? "Royal Heritage Couture"}
                  direction={boundedSubtitleDirection}
                  speed={boundedSubtitleSpeed}
                  stagger={boundedSubtitleStagger}
                  className="font-editorial text-sm sm:text-base md:text-lg italic tracking-[0.06em] text-[#D1B875]"
                />
              </div>

              {/* Title Track Horizontal Pills */}
              <div
                ref={titleViewportRef}
                className="pointer-events-auto mx-auto w-[min(94vw,840px)] overflow-hidden py-2"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
              >
                <div ref={titleTrackRef} className="flex w-max items-center">
                  <span
                    ref={titleStartSpacerRef}
                    aria-hidden
                    className="block h-px shrink-0"
                  />

                  {titleTrackLabels.map((title, i) => {
                    const isCurr = i === activeTitleTrackIndex;
                    return (
                      <button
                        type="button"
                        key={`${title}-${i}`}
                        data-title-index={i}
                        onClick={() => handleTitleClick(i)}
                        aria-current={isCurr ? "true" : undefined}
                        style={{
                          opacity:
                            Math.abs(i - activeTitleTrackIndex) === 0
                              ? 1
                              : Math.abs(i - activeTitleTrackIndex) === 1
                                ? 0.65
                                : Math.abs(i - activeTitleTrackIndex) === 2
                                  ? 0.35
                                  : 0.18,
                          transform:
                            Math.abs(i - activeTitleTrackIndex) === 0
                              ? "scale(1.04)"
                              : "scale(0.95)",
                        }}
                        className={cn(
                          "oiw-title-item mr-3 inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-full border px-5 sm:px-7 py-2 sm:py-2.5 text-center leading-none text-xs sm:text-sm md:text-base font-medium tracking-wide transition-all duration-300",
                          isCurr
                            ? "border-[#D1B875] bg-[#181516]/90 text-[#F4EEE4] shadow-[0_0_20px_rgba(184,154,90,0.3)] ring-1 ring-[#B89A5A]"
                            : "border-white/15 bg-[#0A0909]/60 text-[#BDB3A5] hover:border-[#B89A5A]/40 hover:text-[#F4EEE4]",
                        )}
                      >
                        <span className="font-mono text-[10px] text-[#B89A5A] mr-2">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-display">{title}</span>
                      </button>
                    );
                  })}

                  <span
                    ref={titleEndSpacerRef}
                    aria-hidden
                    className="block h-px shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrbitalImageWheel;
