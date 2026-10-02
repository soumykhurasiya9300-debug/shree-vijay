import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface MotionSubtitleProps {
  text: string;
  direction?: 'top' | 'bottom';
  speed?: number;
  stagger?: number;
  className?: string;
}

export const MotionSubtitle: React.FC<MotionSubtitleProps> = ({
  text,
  direction = 'top',
  speed = 1,
  stagger = 0.018,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof text !== 'string' || !text.length) return;

    const chars = el.querySelectorAll('.motion-char');
    if (!chars.length) return;

    const yOffset = direction === 'bottom' ? 12 : -12;
    const duration = 0.4 / Math.max(0.1, speed);

    gsap.killTweensOf(chars);
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: yOffset,
        filter: 'blur(2px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration,
        stagger,
        ease: 'power2.out',
      }
    );
  }, [text, direction, speed, stagger]);

  // Split into characters for cinematic luxury typography reveal
  const safeText = typeof text === 'string' ? text : '';
  const characters = safeText.split('');

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center overflow-hidden ${className}`}
      aria-label={safeText}
    >
      {characters.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="motion-char inline-block whitespace-pre"
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default MotionSubtitle;
