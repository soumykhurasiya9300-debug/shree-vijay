import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';
import heroImg from '../assets/images/hero_bridal_wedding_1790317438926.jpg';

interface HeroProps {
  lang: Language;
  settings?: WebsiteSettings;
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, settings, onOpenEnquiry }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce muted for browser autoplay policy
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry muted if autoplay is restricted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // Ensure continuous repetitive playback
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-[94vh] flex items-end justify-center overflow-hidden bg-[#0A0909] text-[#F4EEE4]"
    >
      {/* Immersive Full-Frame Continuous Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroImg}
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08]"
        >
          <source src="/videos/hero_background_video.mp4" type="video/mp4" />
          <source
            src="https://v1.pinimg.com/videos/iht/expMp4/5e/78/0d/5e780df6b1a5c2a8c4e3408c95772ac7_720w.mp4"
            type="video/mp4"
          />
          {/* Fallback image */}
          <img
            src={heroImg}
            alt="Shree Vijay Showroom Bridal Collection Jabalpur"
            className="w-full h-full object-cover object-center"
          />
        </video>

        {/* Editorial Multi-Stop Gradient Scrim for contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-[#0A0909]/45 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0909]/70 via-transparent to-[#0A0909]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[#351019]/20 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Ambient Audio Toggle */}
      <div className="absolute top-28 right-4 sm:right-8 z-20">
        <button
          onClick={toggleSound}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181516]/80 hover:bg-[#201C1E] border border-white/20 text-[#F4EEE4] text-xs backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#B89A5A]" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#BDB3A5]">Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#D1B875] animate-pulse" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#F4EEE4]">Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-32 text-center flex flex-col items-center">
        {/* Editorial Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
          <span className="w-8 sm:w-12 h-px bg-[#B89A5A]/70" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#BDB3A5] font-medium">
            {lang === 'hi' ? 'वेडिंग 2026 · महाकौशल का गौरव' : 'WEDDING 2026 · JABALPUR'}
          </span>
          <span className="w-8 sm:w-12 h-px bg-[#B89A5A]/70" />
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#F4EEE4] leading-[1.05] max-w-4xl text-balance">
          {lang === 'hi' ? (
            <>
              आपके सबसे खास दिन के लिए, <br />
              <span className="font-editorial italic font-normal text-[#D1B875]">
                एक यादगार परिधान।
              </span>
            </>
          ) : (
            <>
              YOUR WEDDING DESERVES <br />
              <span className="font-editorial italic font-normal text-[#D1B875]">
                A LOOK TO REMEMBER.
              </span>
            </>
          )}
        </h1>

        {/* Editorial Supporting Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#BDB3A5]/90 font-light tracking-wide max-w-2xl">
          {lang === 'hi'
            ? 'दुल्हन लहंगा · शाही शेरवानी · असली बनारसी साड़ियाँ · संपूर्ण परिवार का वेडिंग कलेक्शन'
            : 'Bridal Couture · Royal Groom · Pure Banarasi Brocades · Complete Family Wedding Wear'}
        </p>

        {/* Minimal High-End CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <a
            href="#showroom-floor"
            className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0909] bg-[#F4EEE4] hover:bg-[#EDE2D2] transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <span>{lang === 'hi' ? 'शोरूम एक्सप्लोर करें' : 'Explore The Collection'}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#4A1724]" />
          </a>

          <a
            href="#visit"
            className="inline-flex items-center px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#F4EEE4] bg-transparent hover:bg-white/5 border border-[#B89A5A]/50 hover:border-[#D1B875] transition-all duration-300 cursor-pointer"
          >
            {lang === 'hi' ? 'शोरूम पधारें' : 'Visit Showroom'}
          </a>

          <button
            onClick={onOpenEnquiry}
            className="hidden md:inline-flex items-center px-6 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D1B875] hover:text-[#F4EEE4] underline underline-offset-8 transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'स्टाइलिश परामर्श' : 'Book Consultation'}
          </button>
        </div>

        {/* Quiet Trust Indicator */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center gap-6 sm:gap-8 text-xs text-[#BDB3A5]/75 font-light tracking-wider">
          <div>
            <span className="font-semibold text-[#F4EEE4]">4.9 ★</span> 980+ Reviews
          </div>
          <span className="opacity-30">·</span>
          <div>
            <span className="font-semibold text-[#F4EEE4]">30+ Years</span> Trust
          </div>
          <span className="opacity-30">·</span>
          <div>
            <span className="font-semibold text-[#F4EEE4]">Bada Fuhara</span> Jabalpur
          </div>
        </div>

        {/* Vertical Scroll Indicator */}
        <a
          href="#showroom-floor"
          className="mt-8 flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-[#BDB3A5]/60 hover:text-[#F4EEE4] transition-colors cursor-pointer group"
          aria-label="Scroll to Showroom Floor"
        >
          <span className="font-light">Enter Showroom</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#B89A5A] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
