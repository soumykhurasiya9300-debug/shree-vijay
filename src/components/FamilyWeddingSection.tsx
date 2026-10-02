import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shirt, Crown, Check } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import { Product } from '../types/index.ts';
import { getFamilyWeddingReelUrl, openInstagramReel } from '../lib/instagramReels.ts';

// High-fidelity curated imagery for editorial wardrobe entries & categories
import weddingBgImg from '../assets/images/family_wedding_bg.jpg';
import maleModelImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import femaleModelImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';
import sareeImg from '../assets/images/designer_banarasi_saree_1790317467169.jpg';
import familyImg from '../assets/images/family_wedding_ensemble_1790325566253.jpg';
import occasionImg from '../assets/images/occasion_haldi_festive_1790325578682.jpg';

interface FamilyWeddingSectionProps {
  products?: Product[];
  lang: Language;
  onViewProduct?: (product: Product) => void;
  onEnquireProduct?: (product: Product) => void;
  onOpenEnquiry: () => void;
  whatsappNumber?: string;
}

type GenderType = 'male' | 'female';

interface SubcategoryCard {
  id: string;
  name: string;
  name_hi: string;
  tagline: string;
  tagline_hi: string;
  image: string;
  badge: string;
  badge_hi: string;
  filterQuery: string;
}

export const FamilyWeddingSection: React.FC<FamilyWeddingSectionProps> = ({
  products = [],
  lang,
  onViewProduct,
  onEnquireProduct,
  onOpenEnquiry,
  whatsappNumber = '918989892476',
}) => {
  const [activeGender, setActiveGender] = useState<GenderType>('male');

  // Subcategories configured directly as main card displays with high-fidelity visual and title below image
  const subcategoriesConfig: Record<GenderType, SubcategoryCard[]> = {
    male: [
      {
        id: 'kurta',
        name: 'Kurta',
        name_hi: 'कुर्ता व बंडी',
        tagline: 'Festive raw silk kurtas, Nehru jackets & churidar sets',
        tagline_hi: 'रॉ सिल्क व टसर कुर्ते, कढ़ाईदार बंडी जैकेट एवं चूड़ीदार',
        image: occasionImg,
        badge: 'Groom & Family',
        badge_hi: 'उत्सव व हल्दी',
        filterQuery: 'kurta',
      },
      {
        id: 'sharvani',
        name: 'Sherwani',
        name_hi: 'शाही शेरवानी',
        tagline: 'Hand-embroidered zardozi raw silk & Jamawar royal sherwanis',
        tagline_hi: 'जरदोजी, कटदाना व जामावार वीव में सजी राजसी शेरवानी',
        image: maleModelImg,
        badge: 'Royal Heritage',
        badge_hi: 'शाही फेरे व बारात',
        filterQuery: 'sherwani',
      },
      {
        id: 'blazers',
        name: 'Blazers & Bandhgala',
        name_hi: 'ब्लेजर्स व जोधपुरी बंदगला',
        tagline: 'Bespoke tailored wool & velvet high-neck royal suits',
        tagline_hi: 'इटैलियन वूल व वेलवेट में मास्टर-टेलर जोधपुरी बंदगला',
        image: weddingBgImg,
        badge: 'Bespoke Cut',
        badge_hi: 'रिसेप्शन व संगीत',
        filterQuery: 'blazer',
      },
      {
        id: 'indo-western',
        name: 'Indo-Western & Achkan',
        name_hi: 'इंडो-वेस्टर्न व अचकन',
        tagline: 'Contemporary asymmetric pleated drape fusion silhouettes',
        tagline_hi: 'आधुनिक असिमेट्रिक ड्रेप व मेटैलिक ब्रोकेड अचकन',
        image: familyImg,
        badge: 'Couture Fusion',
        badge_hi: 'कॉकटेल व संगीत',
        filterQuery: 'indo',
      },
    ],
    female: [
      {
        id: 'saree',
        name: 'Saree',
        name_hi: 'हेरिटेज साड़ी',
        tagline: 'Authentic Banarasi Katan silk, Kadwa zari & pure Chanderi weaves',
        tagline_hi: 'शुद्ध बनारसी कतान, कड़वा जरी, चंदेरी व महेश्वरी सिल्क साड़ियां',
        image: sareeImg,
        badge: 'Pure Silk Weave',
        badge_hi: 'विरासत बनारसी',
        filterQuery: 'saree',
      },
      {
        id: 'gown',
        name: 'Gown',
        name_hi: 'रिसेप्शन गाउन',
        tagline: 'Trail silhouette evening gowns with Swarovski & metallic threadwork',
        tagline_hi: 'स्वरावेस्की, कटदाना व ट्रेल फ्लेयर में सजे डिजाइनर गाउन',
        image: occasionImg,
        badge: 'Evening Glamour',
        badge_hi: 'रिसेप्शन व कॉकटेल',
        filterQuery: 'gown',
      },
      {
        id: 'lehenga',
        name: 'Lehenga',
        name_hi: 'ब्राइडल लहंगा',
        tagline: 'Heirloom zardozi crimson velvet & pastel floral bridal lehengas',
        tagline_hi: 'शाही जरदोजी वेलवेट, डबल दुपट्टा व पेस्टल सिल्क लहंगा',
        image: femaleModelImg,
        badge: 'Master Bridal',
        badge_hi: 'राजपूताना ब्राइडल',
        filterQuery: 'lehenga',
      },
      {
        id: 'kurti',
        name: 'Kurti & Suits',
        name_hi: 'कुर्ती, सूट व शरारा',
        tagline: 'Festive silk anarkalis, embroidered sharara sets & straight suits',
        tagline_hi: 'सिल्क अनारकली, गोटा-पट्टी शरारा सेट्स एवं फेस्टिव सूट',
        image: familyImg,
        badge: 'Celebration Wear',
        badge_hi: 'मेहंदी व उत्सव',
        filterQuery: 'kurti',
      },
    ],
  };

  const currentDisplayList = subcategoriesConfig[activeGender];

  // Helper to find a featured product in this subcategory if user clicks to view details
  const handleSubcategoryClick = (sub: SubcategoryCard) => {
    // Primary Objective: Retrieve item's assigned Instagram Reel, validate destination and redirect
    const reelUrl = getFamilyWeddingReelUrl(activeGender, sub.id);
    if (reelUrl) {
      const opened = openInstagramReel(reelUrl);
      if (opened) return;
    }

    // Safe fallback if reel URL is missing or cannot be opened
    const matched = products.find((p) => {
      const text = `${p.name} ${p.name_hi || ''} ${p.description || ''} ${p.category_name || ''}`.toLowerCase();
      return text.includes(sub.filterQuery) || text.includes(sub.name.toLowerCase());
    });

    if (matched && onViewProduct) {
      onViewProduct(matched);
    } else {
      const queryParam = encodeURIComponent(
        `Namaste Shree Vijay Showroom, I want to explore your ${sub.name} collection (${activeGender === 'male' ? 'Men' : 'Women'}).`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${queryParam}`, '_blank');
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('wardrobe-collection-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectGender = (gender: GenderType) => {
    setActiveGender(gender);
  };

  return (
    <section
      id="family-wedding"
      className="relative py-20 lg:py-32 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      {/* Background Atmosphere Layer */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={weddingBgImg}
          alt="Shree Vijay Complete Wedding Wardrobe Atmosphere"
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.1] saturate-[1.05]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/family_wedding_bg.jpg';
          }}
        />
        {/* Tuned Scrims for high background visibility while preserving typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/75 via-[#0A0909]/35 to-[#0A0909]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,9,9,0.65)_100%)]" />
        <div className="absolute inset-0 bg-[#4A1724]/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#B89A5A]/30 bg-[#121011]/80 backdrop-blur-md mb-3 text-xs uppercase tracking-[0.28em] text-[#D1B875] font-semibold">
            <Crown className="w-3.5 h-3.5 text-[#B89A5A]" />
            <span>{lang === 'hi' ? 'वार्डरोब चयन' : 'THE WARDROBE'}</span>
            <Crown className="w-3.5 h-3.5 text-[#B89A5A]" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4] leading-[1.08] text-balance">
            {lang === 'hi' ? (
              <>
                अपना परिधान संसार चुनें <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  मेंस व विमेन्स कूट्यूर।
                </span>
              </>
            ) : (
              <>
                CHOOSE YOUR WARDROBE <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  DISCOVER YOUR STYLE.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#BDB3A5] font-light max-w-xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'जबलपुर के प्रतिष्ठित श्री विजय शोरूम में वर-वधू एवं संपूर्ण परिवार के लिए विशेष रूप से क्यूरेट किए गए दो राजसी संग्रह।'
              : 'Two distinguished worlds of Indian festive fashion. Step into our tailored men’s lounge or our heritage bridal atelier.'}
          </p>
        </div>

        {/* TWO LARGE EDITORIAL WARDROBE CAMPAIGN ENTRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-20">
          {/* 1. MALE WARDROBE CAMPAIGN ENTRY */}
          <div
            onClick={() => handleSelectGender('male')}
            className={`group relative cursor-pointer transition-all duration-500 rounded-xs overflow-hidden border ${
              activeGender === 'male'
                ? 'border-[#D1B875] ring-2 ring-[#B89A5A]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#181516]'
                : 'border-white/10 hover:border-[#B89A5A]/60 opacity-80 hover:opacity-100 bg-[#121011]'
            }`}
          >
            {/* Architectural Gold Corner Details */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[#B89A5A]/80 z-20 pointer-events-none transition-transform group-hover:scale-110" />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-[#B89A5A]/80 z-20 pointer-events-none transition-transform group-hover:scale-110" />

            {/* Campaign Portrait Frame */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0A0909]">
              <img
                src={maleModelImg}
                alt="Shree Vijay Male Royal Groom & Festive Wardrobe"
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.04] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/groom_royal_sherwani_1790317453744.jpg';
                }}
              />

              {/* Editorial Gradient Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0909]/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Chapter Tag */}
              <div className="absolute top-5 right-5 z-20 bg-[#0A0909]/90 border border-[#B89A5A]/40 text-[#F4EEE4] font-mono text-[10px] tracking-widest px-3 py-1 uppercase backdrop-blur-md">
                CHAPTER 01 · MEN
              </div>

              {/* Active Selection Badge */}
              {activeGender === 'male' && (
                <div className="absolute top-5 left-14 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A] text-[#0A0909] text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Selected</span>
                </div>
              )}

              {/* Hover Cue Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="px-6 py-2.5 bg-[#0A0909]/85 border border-[#D1B875] text-[#F4EEE4] font-display text-xs uppercase tracking-[0.26em] backdrop-blur-md shadow-2xl">
                  {lang === 'hi' ? 'मेंस कलेक्शन देखें' : 'EXPLORE MEN’S COLLECTION'}
                </span>
              </div>
            </div>

            {/* Editorial Label & Supporting Information */}
            <div className="p-6 sm:p-8 bg-[#181516] flex flex-col justify-between border-t border-white/10 text-left">
              <div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold mb-1">
                  <span>MALE WARDROBE</span>
                  <span className="font-mono text-[#BDB3A5] text-[10px]">4 CATEGORIES</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                  {lang === 'hi' ? 'पुरुष संग्रह (मेंस कूट्यूर)' : "Men's Collection"}
                </h3>

                <p className="text-xs text-[#BDB3A5] font-light mt-2 leading-relaxed">
                  {lang === 'hi'
                    ? 'शाही शेरवानी, जोधपुरी बंदगला, इंडो-वेस्टर्न व सिल्क कुर्ता बंडी — दूल्हा एवं परिजनों के लिए विशेष रूप से तैयार।'
                    : 'Handcrafted zardozi sherwanis, Italian wool bandhgalas, asymmetrical Indo-Western cuts, and pure raw silk kurta sets.'}
                </p>
              </div>

              {/* Interaction Indicator */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D1B875] group-hover:text-[#F4EEE4] inline-flex items-center gap-2 transition-colors">
                  <span>{lang === 'hi' ? 'मेंस परिधान देखें' : "Explore Men's Wardrobe"}</span>
                  <ArrowRight className="w-4 h-4 text-[#B89A5A] transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>

                <span
                  className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 border ${
                    activeGender === 'male'
                      ? 'border-[#B89A5A] text-[#D1B875] bg-[#4A1724]'
                      : 'border-white/10 text-[#BDB3A5]'
                  }`}
                >
                  {activeGender === 'male' ? 'VIEWING' : 'CLICK TO VIEW'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. FEMALE WARDROBE CAMPAIGN ENTRY */}
          <div
            onClick={() => handleSelectGender('female')}
            className={`group relative cursor-pointer transition-all duration-500 rounded-xs overflow-hidden border lg:translate-y-6 ${
              activeGender === 'female'
                ? 'border-[#D1B875] ring-2 ring-[#B89A5A]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#181516]'
                : 'border-white/10 hover:border-[#B89A5A]/60 opacity-80 hover:opacity-100 bg-[#121011]'
            }`}
          >
            {/* Architectural Gold Corner Details */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[#B89A5A]/80 z-20 pointer-events-none transition-transform group-hover:scale-110" />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-[#B89A5A]/80 z-20 pointer-events-none transition-transform group-hover:scale-110" />

            {/* Campaign Portrait Frame */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0A0909]">
              <img
                src={femaleModelImg}
                alt="Shree Vijay Female Bridal & Festive Wardrobe"
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.04] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/bridal_lehenga_collection_1790317477737.jpg';
                }}
              />

              {/* Editorial Gradient Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0909]/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Chapter Tag */}
              <div className="absolute top-5 right-5 z-20 bg-[#0A0909]/90 border border-[#B89A5A]/40 text-[#F4EEE4] font-mono text-[10px] tracking-widest px-3 py-1 uppercase backdrop-blur-md">
                CHAPTER 02 · WOMEN
              </div>

              {/* Active Selection Badge */}
              {activeGender === 'female' && (
                <div className="absolute top-5 left-14 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A] text-[#0A0909] text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Selected</span>
                </div>
              )}

              {/* Hover Cue Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="px-6 py-2.5 bg-[#0A0909]/85 border border-[#D1B875] text-[#F4EEE4] font-display text-xs uppercase tracking-[0.26em] backdrop-blur-md shadow-2xl">
                  {lang === 'hi' ? 'विमेन्स कलेक्शन देखें' : 'EXPLORE WOMEN’S COLLECTION'}
                </span>
              </div>
            </div>

            {/* Editorial Label & Supporting Information */}
            <div className="p-6 sm:p-8 bg-[#181516] flex flex-col justify-between border-t border-white/10 text-left">
              <div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold mb-1">
                  <span>FEMALE WARDROBE</span>
                  <span className="font-mono text-[#BDB3A5] text-[10px]">4 CATEGORIES</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                  {lang === 'hi' ? 'महिला संग्रह (विमेन्स कूट्यूर)' : "Women's Collection"}
                </h3>

                <p className="text-xs text-[#BDB3A5] font-light mt-2 leading-relaxed">
                  {lang === 'hi'
                    ? 'राजपूताना जरदोजी दुल्हन लहंगा, शुद्ध बनारसी कतान साड़ियां, ट्रेल रिसेप्शन गाउन व अनारकली सूट।'
                    : 'Heirloom crimson bridal lehengas, pure Banarasi silk weaves, Swarovski reception evening gowns, and festive shararas.'}
                </p>
              </div>

              {/* Interaction Indicator */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D1B875] group-hover:text-[#F4EEE4] inline-flex items-center gap-2 transition-colors">
                  <span>{lang === 'hi' ? 'विमेन्स परिधान देखें' : "Explore Women's Wardrobe"}</span>
                  <ArrowRight className="w-4 h-4 text-[#B89A5A] transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>

                <span
                  className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 border ${
                    activeGender === 'female'
                      ? 'border-[#B89A5A] text-[#D1B875] bg-[#4A1724]'
                      : 'border-white/10 text-[#BDB3A5]'
                  }`}
                >
                  {activeGender === 'female' ? 'VIEWING' : 'CLICK TO VIEW'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUBCATEGORY REVEAL CHAPTER HEADER */}
        <div id="wardrobe-collection-grid" className="pt-8 mb-10 border-t border-[#B89A5A]/30">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-1 flex items-center gap-2">
                <span>ACTIVE CHAPTER:</span>
                <span className="font-mono text-[#D1B875]">
                  {activeGender === 'male' ? '01 / 02' : '02 / 02'}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#F4EEE4]">
                {activeGender === 'male'
                  ? lang === 'hi'
                    ? 'मेंस कलेक्शन: 4 मुख्य श्रेणियां'
                    : "Men's Collection: 4 Curated Categories"
                  : lang === 'hi'
                  ? 'विमेन्स कलेक्शन: 4 मुख्य श्रेणियां'
                  : "Women's Collection: 4 Curated Categories"}
              </h3>
            </div>

            {/* Quick Switcher Control */}
            <div className="flex items-center gap-2 bg-[#181516] p-1 border border-white/10 rounded-full self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleSelectGender('male')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeGender === 'male'
                    ? 'bg-[#B89A5A] text-[#0A0909] font-bold shadow-xs'
                    : 'text-[#BDB3A5] hover:text-[#F4EEE4]'
                }`}
              >
                Men's Wear
              </button>
              <button
                type="button"
                onClick={() => handleSelectGender('female')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeGender === 'female'
                    ? 'bg-[#B89A5A] text-[#0A0909] font-bold shadow-xs'
                    : 'text-[#BDB3A5] hover:text-[#F4EEE4]'
                }`}
              >
                Women's Wear
              </button>
            </div>
          </div>
        </div>

        {/* REVEALED SUBCATEGORIES MAIN DISPLAY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {currentDisplayList.map((sub, index) => (
            <div
              key={`${activeGender}-${sub.id}`}
              onClick={() => handleSubcategoryClick(sub)}
              className="group bg-[#181516] hover:bg-[#201C1E] border border-white/10 hover:border-[#B89A5A]/60 rounded-xs overflow-hidden flex flex-col transition-all duration-500 shadow-md hover:shadow-2xl cursor-pointer hover:-translate-y-1"
            >
              {/* Main Subcategory Image Display */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0909]">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_bridal_wedding_1790317438926.jpg';
                  }}
                />

                {/* Decorative Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Subcategory Index & Badge on Image Top-Left */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#B89A5A] text-[#0A0909] text-[10px] font-bold flex items-center justify-center shadow-xs font-mono">
                    0{index + 1}
                  </span>
                  <span className="bg-[#121011]/90 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#D1B875] font-semibold px-2 py-0.5 border border-[#B89A5A]/40 shadow-xs">
                    {lang === 'hi' ? sub.badge_hi : sub.badge}
                  </span>
                </div>

                {/* Hover Indicator Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#B89A5A] text-[#0A0909] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Subcategory Details Below Image */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left bg-[#181516]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5A] font-semibold mb-1">
                    {activeGender === 'male' ? "MALE COLLECTION" : "FEMALE COLLECTION"} · 0{index + 1}
                  </div>

                  {/* Subcategory Title */}
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                    {lang === 'hi' ? sub.name_hi : sub.name}
                  </h4>

                  {/* Subcategory Short Description / Tagline */}
                  <p className="text-xs text-[#BDB3A5] mt-2 line-clamp-2 font-light leading-relaxed">
                    {lang === 'hi' ? sub.tagline_hi : sub.tagline}
                  </p>
                </div>

                {/* Bottom Action Prompt */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D1B875] group-hover:text-[#F4EEE4] transition-colors inline-flex items-center gap-1.5">
                    <span>{lang === 'hi' ? 'संग्रह देखें' : 'Explore Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] text-[#BDB3A5]/60 font-mono">
                    SV · 2026
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Consultation Box */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#351019] via-[#4A1724] to-[#181516] border border-[#B89A5A]/30 text-left text-[#F4EEE4] flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xs shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block mb-1">
              COMPLETE FAMILY & COUPLE STYLING
            </span>
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4]">
              {lang === 'hi' ? 'मेंस व विमेन्स मैचिंग फैमिली कंसल्टेशन' : 'Male & Female Coordinated Styling Atelier'}
            </h4>
            <p className="text-xs sm:text-sm text-[#BDB3A5] mt-2 font-light leading-relaxed">
              {lang === 'hi'
                ? 'वर-वधू, माता-पिता एवं पूरे परिवार के लिए मैचिंग कलर पैलेट, फैब्रिक चयन और ऑन-साइट ट्रायल की विशेष सुविधा।'
                : 'Need coordinated wedding wardrobes? Schedule a styling session at Bada Fuhara Jabalpur to coordinate bridal lehengas, sarees, gowns with groom sherwanis, bandhgalas and kurtas.'}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              {lang === 'hi' ? 'कंसल्टेशन बुक करें' : 'Book Consultation'}
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Namaste Shree Vijay Showroom, I am looking for male and female wedding collection outfits (Kurta, Sherwani, Blazers for Men and Saree, Gown, Lehenga, Kurti for Women).'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-transparent hover:bg-white/5 text-[#F4EEE4] border border-[#B89A5A]/40 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyWeddingSection;
