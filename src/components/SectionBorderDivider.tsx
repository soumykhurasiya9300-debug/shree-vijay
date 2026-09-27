import React from 'react';
import borderImg from '../assets/images/greek_key_floral_border.svg';

interface SectionBorderDividerProps {
  className?: string;
}

export const SectionBorderDivider: React.FC<SectionBorderDividerProps> = ({
  className = '',
}) => {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`w-full overflow-hidden select-none pointer-events-none relative z-20 ${className}`}
    >
      {/* Royal Black & Antique Gold Greek Key Floral Meander Ribbon */}
      <div
        className="w-full h-9 sm:h-11 md:h-12 border-y border-[#DEC28A]/40 shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
        style={{
          backgroundImage: `url(${borderImg})`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundSize: 'auto 100%',
        }}
      />
    </div>
  );
};
