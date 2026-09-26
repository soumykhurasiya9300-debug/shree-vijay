import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Language } from '../lib/translations.ts';

// High-fidelity image assets
import showroomInteriorImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';
import bridalImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';
import womenImg from '../assets/images/designer_banarasi_saree_1790317467169.jpg';
import menImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import familyImg from '../assets/images/family_wedding_ensemble_1790325566253.jpg';
import occasionImg from '../assets/images/occasion_haldi_festive_1790325578682.jpg';

interface ShowroomFloorProps {
  lang: Language;
}

export const ShowroomFloor: React.FC<ShowroomFloorProps> = ({ lang }) => {
  const [activeDept, setActiveDept] = useState<number>(0);

  const departments = [
    {
      id: 0,
      code: '01',
      title: lang === 'hi' ? 'द ब्राइडल सुइट' : 'THE BRIDAL SUITE',
      subtitle: lang === 'hi' ? 'राजसी दुल्हन लहंगा, मंडप व रिसेप्शन' : 'Heritage Bridal Lehengas & Reception Gowns',
      anchor: '#bridal-edit',
      image: bridalImg,
      tag: 'FLOOR 1 · COUTURE ATELIER',
    },
    {
      id: 1,
      code: '02',
      title: lang === 'hi' ? 'विमेन्स हेरिटेज' : "WOMEN'S HERITAGE",
      subtitle: lang === 'hi' ? 'शुद्ध बनारसी, कांजीवरम जरी व अनारकली' : 'Pure Banarasi Brocades, Katan Silks & Sarees',
      anchor: '#showroom-floor',
      image: womenImg,
      tag: 'GROUND FLOOR · SILK WEAVES',
    },
    {
      id: 2,
      code: '03',
      title: lang === 'hi' ? 'द ग्रूम्स लाउंज' : "THE GROOM'S LOUNGE",
      subtitle: lang === 'hi' ? 'शाही शेरवानी, जोधपुरी सूट व साफा' : 'Royal Sherwanis, Silk Bandhgalas & Stoles',
      anchor: '#groom-edit',
      image: menImg,
      tag: 'FLOOR 2 · ROYAL MEN',
    },
    {
      id: 3,
      code: '04',
      title: lang === 'hi' ? 'फैमिली वेडिंग' : 'FAMILY WEDDING',
      subtitle: lang === 'hi' ? 'माता-पिता, भाई-बहन व संपूर्ण परिवार' : 'Coordinated Ceremonial Ensembles for All',
      anchor: '#family-wedding',
      image: familyImg,
      tag: 'ALL FLOORS · FAMILY COORDINATION',
    },
    {
      id: 4,
      code: '05',
      title: lang === 'hi' ? 'वेडिंग ऑकेजन' : 'WEDDING OCCASIONS',
      subtitle: lang === 'hi' ? 'हल्दी, मेहंदी, संगीत व फेरे' : 'Haldi, Mehendi, Sangeet & Reception Edits',
      anchor: '#occasions',
      image: occasionImg,
      tag: 'GALLERY · FESTIVE CURATION',
    },
  ];

  const currentDisplay = departments[activeDept] || departments[0];

  return (
    <section
      id="showroom-floor"
      className="relative py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-[#B89A5A] font-semibold mb-2">
              <span>{lang === 'hi' ? 'डिजिटल अनुभव' : 'Digital Floorplan'}</span>
              <span>·</span>
              <span>{lang === 'hi' ? 'बड़ा फुहारा, जबलपुर' : 'Bada Fuhara, Jabalpur'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EEE4]">
              {lang === 'hi' ? 'श्री विजय शोरूम में आपका स्वागत है' : 'Welcome to Shree Vijay'}
            </h2>
            <p className="font-editorial italic text-lg sm:text-xl text-[#D1B875] mt-2">
              {lang === 'hi'
                ? 'महाकौशल के सबसे भव्य वेडिंग शोरूम के विभिन्न विभागों में विचरण करें।'
                : 'Step inside Jabalpur’s iconic multi-floor wedding fashion sanctuary.'}
            </p>
          </div>
          <div className="text-xs text-[#BDB3A5] max-w-xs font-light">
            {lang === 'hi'
              ? 'प्रत्येक विभाग पर कर्सर ले जाएं और उस हॉल के विशेष परिधानों की एक झलक देखें।'
              : 'Hover or tap each department to preview its curated ceremonial hall.'}
          </div>
        </div>

        {/* Interactive Showroom Floor Visual Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Department Interactive Roster */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {departments.map((dept, idx) => {
              const isSelected = activeDept === idx;
              return (
                <a
                  key={dept.code}
                  href={dept.anchor}
                  onMouseEnter={() => setActiveDept(idx)}
                  className={`group relative p-5 sm:p-6 transition-all duration-300 border text-left block cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A] shadow-2xl translate-x-1 sm:translate-x-2'
                      : 'bg-[#121011] hover:bg-[#181516] text-[#F4EEE4] border-white/10 hover:border-[#B89A5A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs uppercase tracking-[0.24em] font-semibold ${
                        isSelected ? 'text-[#D1B875]' : 'text-[#B89A5A]'
                      }`}
                    >
                      {dept.code} — {dept.tag}
                    </span>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isSelected
                          ? 'text-[#D1B875] translate-x-0.5 -translate-y-0.5'
                          : 'text-[#BDB3A5] opacity-60 group-hover:opacity-100'
                      }`}
                    />
                  </div>

                  <h3
                    className={`font-display text-lg sm:text-xl font-bold tracking-wide mt-2 ${
                      isSelected ? 'text-[#F4EEE4]' : 'text-[#F4EEE4] group-hover:text-[#D1B875]'
                    }`}
                  >
                    {dept.title}
                  </h3>

                  <p
                    className={`text-xs mt-1 font-light ${
                      isSelected ? 'text-[#F4EEE4]/85' : 'text-[#BDB3A5]'
                    }`}
                  >
                    {dept.subtitle}
                  </p>
                </a>
              );
            })}
          </div>

          {/* Right: Cinematic Department Visual Portal */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden border border-[#B89A5A]/40 shadow-2xl bg-[#0A0909]">
              {/* Dynamic Image with Smooth Cross-fade */}
              <img
                key={currentDisplay.code}
                src={currentDisplay.image}
                alt={currentDisplay.title}
                className="w-full h-full object-cover object-top filter brightness-[0.85] transition-all duration-700 ease-out hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-transparent to-black/30 pointer-events-none" />

              {/* Architectural Framing Detail */}
              <div className="absolute top-4 left-4 border-t border-l border-[#B89A5A]/70 w-8 h-8 pointer-events-none" />
              <div className="absolute bottom-4 right-4 border-b border-r border-[#B89A5A]/70 w-8 h-8 pointer-events-none" />

              {/* Department Overlay Caption */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block">
                    {currentDisplay.tag}
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] mt-1">
                    {currentDisplay.title}
                  </h4>
                  <p className="text-xs text-[#BDB3A5] mt-0.5 max-w-md font-light">
                    {currentDisplay.subtitle}
                  </p>
                </div>
                <a
                  href={currentDisplay.anchor}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#EDE2D2] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shrink-0 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'प्रवेश करें' : 'Enter'}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
