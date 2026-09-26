import React, { useState, useEffect } from 'react';
import showroomAmbianceImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';

interface BrandIntroPreloaderProps {
  /** Callback triggered after intro and exit transition finishes */
  onComplete: () => void;
  /** Whether the underlying page data has loaded */
  isDataReady?: boolean;
}

export const BrandIntroPreloader: React.FC<BrandIntroPreloaderProps> = ({
  onComplete,
  isDataReady = true,
}) => {
  const [phase, setPhase] = useState<'logo' | 'reveal' | 'ready'>('logo');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('reveal');
    }, 400);

    const t2 = setTimeout(() => {
      setPhase('ready');
    }, 1100);

    // Auto transition after 3.2s if user doesn't click
    const autoExit = setTimeout(() => {
      handleEnter();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(autoExit);
    };
  }, []);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to Shree Vijay Showroom Jabalpur"
      className={`fixed inset-0 w-screen h-screen z-[99999] flex flex-col items-center justify-center bg-[#0A0909] text-[#F4EEE4] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Cinematic subtle showroom background with dark vignette scrim */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={showroomAmbianceImg}
          alt=""
          className="w-full h-full object-cover opacity-15 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/95 via-[#121011]/90 to-[#0A0909]/98" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A1724]/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-xl">
        {/* Royal Crest Insignia */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            phase !== 'logo'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-3'
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#B89A5A]/40 flex items-center justify-center p-1.5 shadow-2xl bg-[#181516]/90 backdrop-blur-md mx-auto mb-5">
            <div className="w-full h-full rounded-full border border-dashed border-[#B89A5A]/60 flex items-center justify-center bg-[#351019]/60">
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 sm:w-11 sm:h-11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 30 L40 37 L50 23 L60 37 L68 30 L66 43 L34 43 Z"
                  fill="#B89A5A"
                  fillOpacity="0.3"
                  stroke="#B89A5A"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="22" r="1.8" fill="#D1B875" />
                <circle cx="40" cy="36" r="1.2" fill="#D1B875" />
                <circle cx="60" cy="36" r="1.2" fill="#D1B875" />
                <text
                  x="37"
                  y="69"
                  textAnchor="middle"
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="#F4EEE4"
                >
                  S
                </text>
                <text
                  x="62"
                  y="69"
                  textAnchor="middle"
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="#D1B875"
                >
                  V
                </text>
                <path
                  d="M28 77 Q50 84 72 77"
                  stroke="#B89A5A"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="81" r="1.5" fill="#D1B875" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name & Statement */}
        <div
          className={`transition-all duration-800 delay-150 ease-out transform ${
            phase !== 'logo'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#B89A5A] font-medium mb-2">
            Jabalpur · Est. 1990
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.16em] text-[#F4EEE4] uppercase leading-tight">
            SHREE VIJAY
          </h1>
          <div className="font-editorial text-lg sm:text-xl lg:text-2xl text-[#D1B875] italic mt-2">
            The Wedding House of Jabalpur
          </div>
          <p className="text-xs sm:text-sm text-[#BDB3A5] mt-3 font-light tracking-wide max-w-md mx-auto">
            Three decades of trust, tradition & timeless elegance.
          </p>
        </div>

        {/* Enter Showroom CTA */}
        <div
          className={`mt-8 sm:mt-10 transition-all duration-700 delay-300 ease-out transform ${
            phase === 'ready'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-3 px-7 py-3 rounded-none border border-[#B89A5A]/70 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] text-xs uppercase tracking-[0.24em] font-medium transition-all duration-300 hover:border-[#D1B875] hover:scale-105 shadow-2xl cursor-pointer"
          >
            <span>Enter Showroom</span>
            <span className="text-[#D1B875] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

