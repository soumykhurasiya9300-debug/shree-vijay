import React, { useState } from 'react';
import { Navigation, ArrowRight } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import showroomImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';

interface ShowroomWalkthroughProps {
  lang: Language;
  onOpenEnquiry: () => void;
}

export const ShowroomWalkthrough: React.FC<ShowroomWalkthroughProps> = ({
  lang,
  onOpenEnquiry,
}) => {
  const [activeZone, setActiveZone] = useState<number>(1);

  const zones = [
    {
      id: 0,
      code: 'FLOOR 0',
      title: lang === 'hi' ? 'भूतल: शुद्ध बनारसी व सिल्क साड़ी हॉल' : 'Ground Floor: Pure Silk & Banarasi Emporium',
      desc: lang === 'hi' ? 'वारणसी एवं कांजीवरम से सीधे मंगाए गए असली जरी की साड़ियाँ एवं डेली फेस्टिव वियर।' : 'Hundreds of handcrafted Katan silks, Georgettes, Organzas, and traditional Chanderi drapes direct from master handlooms.',
      anchor: '#showroom-floor',
      x: '25%',
      y: '70%',
    },
    {
      id: 1,
      code: 'FLOOR 1',
      title: lang === 'hi' ? 'प्रथम तल: ब्राइडल कूट्यूर सुइट व ट्रायल' : 'First Floor: The Bridal Couture Atelier',
      desc: lang === 'hi' ? 'विशेष ब्राइडल लाउंज जहाँ दुल्हन और परिवार शांति से बैठकर विशाल कलेक्शन का ट्रायल कर सकते हैं।' : 'Private trial mirrors, ceremonial lighting, and dedicated bridal stylists to guide every bride in Jabalpur.',
      anchor: '#bridal-edit',
      x: '50%',
      y: '45%',
    },
    {
      id: 2,
      code: 'FLOOR 2',
      title: lang === 'hi' ? 'द्वितीय तल: द ग्रूम्स लाउंज व जोधपुरी' : "Second Floor: The Groom's Royal Lounge",
      desc: lang === 'hi' ? 'शाही शेरवानी, इंडो-वेस्टर्न, साफा बांधने की सेवा एवं मैचिंग दुपट्टा-जूती एक्सेसरीज।' : 'Exclusive royal men’s floor showcasing bespoke sherwanis, Jodhpuris, pagdi styling, and coordinated stoles.',
      anchor: '#groom-edit',
      x: '75%',
      y: '30%',
    },
    {
      id: 3,
      code: 'ATELIER',
      title: lang === 'hi' ? 'मास्टर टेलरिंग व कस्टम फिटिंग' : 'Master Alteration & Fitting Atelier',
      desc: lang === 'hi' ? 'शोरूम में ही तत्काल सिलाई, फॉल-पीको और सटीक फिटिंग की पूर्ण व्यवस्था।' : 'On-site master tailors for same-day blouse adjustments, lehenga flares, and jacket alterations.',
      anchor: '#visit',
      x: '85%',
      y: '65%',
    },
  ];

  const currentZone = zones[activeZone] || zones[1];

  return (
    <section
      id="walkthrough"
      className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5 text-[#D1B875]" />
            <span>{lang === 'hi' ? 'वर्चुअल वॉकथ्रू' : 'SHOWROOM FLOORPLAN'}</span>
            <Navigation className="w-3.5 h-3.5 text-[#D1B875]" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F4EEE4]">
            {lang === 'hi' ? 'शोरूम का डिजिटल भ्रमण' : 'Walk Through the Showroom'}
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#D1B875] mt-2">
            {lang === 'hi'
              ? 'बड़ा फुहारा स्थित हमारे भव्य बहुमंजिला स्टोर के प्रत्येक विभाग का इंटरैक्टिव अन्वेषण करें।'
              : 'Explore each floor of our flagship landmark emporium in Bada Fuhara, Jabalpur.'}
          </p>
        </div>

        {/* Showroom Interactive Map Visual */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border border-[#B89A5A]/30 shadow-2xl bg-[#121011]">
          <img
            src={showroomImg}
            alt="Shree Vijay Showroom Interior Walkthrough"
            className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.05]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/showroom_interior_ambiance_1790317495781.jpg';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909]/95 via-transparent to-black/40 pointer-events-none" />

          {/* Hotspots with Prominent Visual Affordance & 48px Touch Target (Fix for Issue 9) */}
          {zones.map((zone, idx) => {
            const isActive = activeZone === idx;
            return (
              <button
                key={zone.code}
                onClick={() => setActiveZone(idx)}
                style={{ left: zone.x, top: zone.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none cursor-pointer w-12 h-12 flex items-center justify-center"
                aria-label={`${zone.title} (Hotspot ${idx + 1})`}
                aria-pressed={isActive}
              >
                <div className="relative flex items-center justify-center">
                  {/* Subtle continuous radar pulse animation for high contrast and discoverability */}
                  <span
                    className={`absolute w-11 h-11 rounded-full bg-[#B89A5A]/50 animate-ping pointer-events-none ${
                      isActive ? 'opacity-100 duration-1000' : 'opacity-40 group-hover:opacity-90'
                    }`}
                  />
                  <span className="absolute w-12 h-12 rounded-full border border-[#D1B875]/40 pointer-events-none" />

                  {/* Core 40px High-Contrast Hotspot Badge */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 shadow-[0_0_20px_rgba(184,154,90,0.6)] border-2 ${
                      isActive
                        ? 'bg-[#F4EEE4] text-[#0A0909] border-[#D1B875] scale-115 ring-4 ring-[#B89A5A]/40'
                        : 'bg-[#351019] text-[#F4EEE4] border-[#D1B875] group-hover:bg-[#4A1724] group-hover:scale-110'
                    }`}
                  >
                    <span>{idx + 1}</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Active Hotspot Proximal Popover Card (Fix for Issue 21: Spacing & alignment) */}
          <div
            className="absolute z-30 transition-all duration-300 pointer-events-auto
              bottom-4 left-4 right-4 sm:bottom-auto sm:right-auto sm:max-w-sm
              bg-[#181516]/95 text-[#F4EEE4] border border-[#B89A5A]/60 shadow-2xl p-4 sm:p-5 backdrop-blur-md rounded-none"
            style={{
              // On desktop/tablet, position contextual card right beside the active hotspot
              ...(typeof window !== 'undefined' && window.innerWidth >= 640
                ? {
                    left: `clamp(1rem, ${currentZone.x}, calc(100% - 24rem))`,
                    top: `clamp(1rem, calc(${currentZone.y} - 8rem), calc(100% - 15rem))`,
                  }
                : {}),
            }}
          >
            {/* Visual Pointer Callout Notch */}
            <div className="hidden sm:block absolute -top-1.5 left-6 w-3 h-3 bg-[#181516] border-t border-l border-[#B89A5A]/60 transform rotate-45" />

            <div className="flex items-center justify-between text-xs text-[#B89A5A] uppercase tracking-widest font-semibold pb-2 border-b border-white/10">
              <span className="font-mono text-xs font-bold text-[#D1B875]">{currentZone.code}</span>
              <span className="font-mono text-xs text-[#BDB3A5]">ACTIVE HOTSPOT #{activeZone + 1} OF 4</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-[#F4EEE4] mt-2">
              {currentZone.title}
            </h3>

            <p className="text-xs text-[#BDB3A5] mt-1 font-light leading-relaxed">
              {currentZone.desc}
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={currentZone.anchor}
                className="btn-wine py-1.5 px-3 text-xs"
              >
                <span>{lang === 'hi' ? 'विभाग में जाएं' : 'Enter Department'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onOpenEnquiry}
                className="btn-ghost text-xs"
              >
                <span>{lang === 'hi' ? 'पूछताछ करें' : 'Enquire'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Consolidated Floor Switcher Tabstrip (Fix for Issue 11: Density & Redundancy) */}
        <div
          role="tablist"
          aria-label={lang === 'hi' ? 'शोरूम फ्लोर चयन' : 'Showroom floor selection tabs'}
          className="mt-4 flex flex-wrap sm:flex-nowrap border border-[#B89A5A]/30 bg-[#121011] divide-y sm:divide-y-0 sm:divide-x divide-white/10"
        >
          {zones.map((zone, idx) => {
            const isActive = activeZone === idx;
            return (
              <button
                key={zone.code}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveZone(idx)}
                className={`flex-1 py-3 px-4 text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#351019] text-[#F4EEE4] border-b-2 border-b-[#D1B875]'
                    : 'text-[#BDB3A5] hover:text-[#F4EEE4] hover:bg-[#181516]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isActive ? 'bg-[#D1B875] text-[#0A0909]' : 'bg-white/10 text-[#BDB3A5]'
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#D1B875] block truncate">
                    {zone.code}
                  </span>
                  <span className="text-xs text-[#F4EEE4] truncate block">
                    {zone.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
