import React from 'react';

interface BrandLogoProps {
  variant?: 'vertical' | 'horizontal' | 'compact';
  lang?: 'en' | 'hi';
  className?: string;
  isDark?: boolean;
  isDarkSurface?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  lang = 'en',
  className = '',
  isDark = true,
  isDarkSurface = true,
}) => {
  const dark = isDark || isDarkSurface;
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Royal Crest Insignia */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#B89A5A]/40 flex items-center justify-center p-1.5 shadow-xs">
            <div className="w-full h-full rounded-full border border-dashed border-[#B89A5A]/50 flex items-center justify-center bg-[#181516]">
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 sm:w-12 sm:h-12"
                fill="none"
              >
                {/* Tiara / Wedding Crown */}
                <path
                  d="M32 30 L40 37 L50 24 L60 37 L68 30 L66 42 L34 42 Z"
                  fill="#B89A5A"
                  fillOpacity="0.25"
                  stroke="#B89A5A"
                  strokeWidth="1.5"
                />
                {/* SV Monogram */}
                <text
                  x="37"
                  y="68"
                  textAnchor="middle"
                  fontFamily="'Cinzel', serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="#F4EEE4"
                >
                  S
                </text>
                <text
                  x="62"
                  y="68"
                  textAnchor="middle"
                  fontFamily="'Cinzel', serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="#D1B875"
                >
                  V
                </text>
                {/* Bottom filigree arch */}
                <path
                  d="M30 76 Q50 82 70 76"
                  stroke="#B89A5A"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="50" cy="80" r="1.5" fill="#D1B875" />
              </svg>
            </div>
          </div>
        </div>

        {/* English Name */}
        <span
          className="font-display text-base sm:text-lg font-bold tracking-[0.08em] leading-tight text-[#F4EEE4]"
        >
          Shree Vijay Showroom
        </span>

        {/* Hindi Name */}
        <span
          className="text-xs sm:text-sm font-semibold tracking-wider mt-0.5 text-[#D1B875]"
        >
          श्री विजय शोरूम
        </span>

        {/* Subtitle */}
        <span className="text-xs tracking-wider text-[#BDB3A5] font-sans mt-1 font-medium">
          Jabalpur · Wedding & Bridal Empire
        </span>
      </div>
    );
  }

  // Horizontal variant (for header & top bar)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Compact Royal Crest */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#B89A5A]/40 flex items-center justify-center p-0.5 shrink-0 bg-[#181516]">
        <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
          <path
            d="M32 30 L40 37 L50 24 L60 37 L68 30 L66 42 L34 42 Z"
            fill="#B89A5A"
            fillOpacity="0.25"
            stroke="#B89A5A"
            strokeWidth="1.5"
          />
          <text
            x="37"
            y="68"
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="28"
            fontWeight="700"
            fill="#F4EEE4"
          >
            S
          </text>
          <text
            x="62"
            y="68"
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="28"
            fontWeight="700"
            fill="#D1B875"
          >
            V
          </text>
          <path d="M30 76 Q50 82 70 76" stroke="#B89A5A" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-base sm:text-lg font-bold tracking-[0.06em] font-display leading-tight text-[#F4EEE4]"
          >
            {lang === 'hi' ? 'श्री विजय शोरूम' : 'Shree Vijay Showroom'}
          </span>
        </div>
        <span className="text-xs tracking-wider font-sans text-[#BDB3A5]">
          Jabalpur · Wedding & Bridal Empire
        </span>
      </div>
    </div>
  );
};
