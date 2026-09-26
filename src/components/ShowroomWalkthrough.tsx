import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Check } from 'lucide-react';
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
      className="py-20 lg:py-28 bg-[#F7F2EA] text-[#211A18] border-b border-[#B89455]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89455] font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'वर्चुअल वॉकथ्रू' : 'SHOWROOM FLOORPLAN'}</span>
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#4A101C]">
            {lang === 'hi' ? 'शोरूम का डिजिटल भ्रमण' : 'Walk Through the Showroom'}
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#756A63] mt-2">
            {lang === 'hi'
              ? 'बड़ा फुहारा स्थित हमारे भव्य बहुमंजिला स्टोर के प्रत्येक विभाग का इंटरैक्टिव अन्वेषण करें।'
              : 'Explore each floor of our flagship landmark emporium in Bada Fuhara, Jabalpur.'}
          </p>
        </div>

        {/* Showroom Interactive Map Visual */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border-2 border-[#B89455]/40 shadow-2xl bg-[#2A0A12]">
          <img
            src={showroomImg}
            alt="Shree Vijay Showroom Interior Walkthrough"
            className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A12]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Hotspots */}
          {zones.map((zone, idx) => {
            const isActive = activeZone === idx;
            return (
              <button
                key={zone.code}
                onClick={() => setActiveZone(idx)}
                style={{ left: zone.x, top: zone.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none cursor-pointer"
                aria-label={zone.title}
              >
                <div className="relative flex items-center justify-center">
                  {/* Radar pulse animation */}
                  <span
                    className={`absolute w-8 h-8 rounded-full bg-[#B89455]/60 animate-ping ${
                      isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
                    }`}
                  />
                  {/* Core button */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 shadow-xl border-2 ${
                      isActive
                        ? 'bg-[#B89455] text-[#2A0A12] border-white scale-125'
                        : 'bg-[#4A101C] text-[#F7F2EA] border-[#B89455] group-hover:scale-110'
                    }`}
                  >
                    {idx + 1}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Active Hotspot Floating Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-[#2A0A12]/95 text-[#F7F2EA] border border-[#B89455]/50 shadow-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#B89455] uppercase tracking-widest font-semibold pb-2 border-b border-white/10">
              <span>{currentZone.code}</span>
              <span className="font-mono">HOTSPOT #{activeZone + 1} OF 4</span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-2">
              {currentZone.title}
            </h3>

            <p className="text-xs text-[#D8C8B5]/85 mt-1 font-light leading-relaxed">
              {currentZone.desc}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <a
                href={currentZone.anchor}
                className="text-xs font-semibold uppercase tracking-wider text-[#B89455] hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{lang === 'hi' ? 'विभाग में जाएं' : 'Enter Department'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onOpenEnquiry}
                className="text-xs text-[#D8C8B5] hover:underline"
              >
                {lang === 'hi' ? 'पूछताछ करें' : 'Enquire'}
              </button>
            </div>
          </div>
        </div>

        {/* Hotspots Quick Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {zones.map((zone, idx) => (
            <button
              key={zone.code}
              onClick={() => setActiveZone(idx)}
              className={`p-3 text-left border transition-all cursor-pointer ${
                activeZone === idx
                  ? 'bg-[#4A101C] text-[#F7F2EA] border-[#B89455] shadow-md'
                  : 'bg-white hover:bg-[#EDE2D2]/50 text-[#211A18] border-[#B89455]/20'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[#B89455]">
                {zone.code}
              </div>
              <div className="font-display text-xs font-bold mt-0.5 truncate">
                {zone.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
