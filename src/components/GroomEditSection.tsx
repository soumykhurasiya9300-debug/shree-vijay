import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';
import { getGroomEditReelUrl, openInstagramReel } from '../lib/instagramReels.ts';

// High-fidelity image assets for Groom subcategories
import groomHeroImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import weddingBgImg from '../assets/images/family_wedding_bg.jpg';
import occasionImg from '../assets/images/occasion_haldi_festive_1790325578682.jpg';
import familyImg from '../assets/images/family_wedding_ensemble_1790325566253.jpg';

interface GroomEditSectionProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
  whatsappNumber?: string;
}

interface GroomSubcategoryCard {
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

export const GroomEditSection: React.FC<GroomEditSectionProps> = ({
  products,
  lang,
  onViewProduct,
  onEnquireProduct,
  whatsappNumber = '918989892476',
}) => {
  // Groom Subcategories configured as main visual displays (Image on top, details below)
  const groomSubcategories: GroomSubcategoryCard[] = [
    {
      id: 'sherwani',
      name: 'Royal Sherwani',
      name_hi: 'शाही शेरवानी',
      tagline: 'Hand-embroidered zardozi, raw silk & Jamawar royal groom sherwanis',
      tagline_hi: 'हाथ की जरदोजी, कटदाना व जामावार वीव में सजी राजसी दूल्हा शेरवानी',
      image: groomHeroImg,
      badge: 'Heritage Vows',
      badge_hi: 'शाही फेरे व बारात',
      filterQuery: 'sherwani',
    },
    {
      id: 'indo-western',
      name: 'Indo-Western & Achkan',
      name_hi: 'इंडो-वेस्टर्न व अचकन',
      tagline: 'Modern asymmetric cuts, metallic brocade drapes & cowl silhouettes',
      tagline_hi: 'आधुनिक असिमेट्रिक ड्रेप, मेटैलिक ब्रोकेड व फ्यूज़न कूट्यूर अचकन',
      image: familyImg,
      badge: 'Modern Fusion',
      badge_hi: 'कॉकटेल व संगीत',
      filterQuery: 'indo',
    },
    {
      id: 'jodhpuri',
      name: 'Jodhpuri & Bandhgala',
      name_hi: 'जोधपुरी व बंदगला',
      tagline: 'Structured royal high-neck bandhgalas, velvet tuxedos & Italian suiting',
      tagline_hi: 'शाही हाई-नेक बंदगला, वेलवेट टक्सिडो व जोधपुरी सूट का परिष्कृत रूप',
      image: weddingBgImg,
      badge: 'Bespoke Tailored',
      badge_hi: 'रिसेप्शन व डिनर',
      filterQuery: 'bandhgala',
    },
    {
      id: 'kurta',
      name: 'Kurta & Bundi Jacket Sets',
      name_hi: 'कुर्ता व बंडी जैकेट सेट्स',
      tagline: 'Pure raw silk kurtas with embroidered Nehru bundi jackets & dhoti styling',
      tagline_hi: 'प्योर रॉ सिल्क कुर्ते, कढ़ाईदार नेहरू बंडी जैकेट एवं धोती-चूड़ीदार स्टाइलिंग',
      image: occasionImg,
      badge: 'Haldi & Festive',
      badge_hi: 'हल्दी, मेहंदी व पूजा',
      filterQuery: 'kurta',
    },
  ];

  // Helper when clicking a subcategory card
  const handleCardClick = (sub: GroomSubcategoryCard) => {
    // Primary Objective: Retrieve item's assigned Instagram Reel, validate destination and redirect
    const reelUrl = getGroomEditReelUrl(sub.id);
    if (reelUrl) {
      const opened = openInstagramReel(reelUrl);
      if (opened) return;
    }

    // Safe fallback if reel URL is missing or cannot be opened
    const matched = products.find((p) => {
      const text = `${p.name} ${p.name_hi || ''} ${p.description || ''} ${p.category_name || ''}`.toLowerCase();
      return text.includes(sub.filterQuery) || text.includes(sub.name.toLowerCase());
    });

    if (matched) {
      onViewProduct(matched);
    } else {
      const message = encodeURIComponent(
        `Namaste Shree Vijay Showroom, I am inquiring about the ${sub.name} collection in The Groom's Lounge.`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <section
      id="groom-edit"
      className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'द ग्रूम्स लाउंज · द्वितीय तल' : "THE GROOM'S EDIT · 2ND FLOOR"}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4]">
            {lang === 'hi' ? 'शाही दूल्हा व मेंस कूट्यूर' : "The Groom's Edit"}
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#D1B875] mt-2">
            {lang === 'hi'
              ? 'राजसी शेरवानी, जोधपुरी बंदगला, इंडो-वेस्टर्न एवं कुर्ता-बंडी — दूल्हे के लिए मुख्य श्रेणियां।'
              : 'Raw silk sherwanis, bespoke Jodhpuris, Indo-Western fusion, and ceremonial kurta sets tailored for royal majesty.'}
          </p>
        </div>

        {/* Subcategories as Main Displays (Image with subcategory details below) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {groomSubcategories.map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleCardClick(sub)}
              className="group bg-[#181516] hover:bg-[#201C1E] border border-white/10 hover:border-[#B89A5A]/60 rounded-xs overflow-hidden flex flex-col transition-all duration-500 shadow-xl cursor-pointer hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0909]">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Subcategory Badge on Image */}
                <div className="absolute top-3 left-3 bg-[#121011]/90 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#D1B875] font-semibold px-2.5 py-1 border border-[#B89A5A]/40 shadow-xs">
                  {lang === 'hi' ? sub.badge_hi : sub.badge}
                </div>

                {/* Hover Indicator Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#B89A5A] text-[#0A0909] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Subcategory Details Below Image */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left bg-[#181516]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold mb-1">
                    {lang === 'hi' ? 'मेंस कूट्यूर' : "GROOM'S ATELIER"}
                  </div>

                  {/* Subcategory Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                    {lang === 'hi' ? sub.name_hi : sub.name}
                  </h3>

                  {/* Subcategory Tagline */}
                  <p className="text-xs text-[#BDB3A5] mt-2 line-clamp-2 font-light leading-relaxed">
                    {lang === 'hi' ? sub.tagline_hi : sub.tagline}
                  </p>
                </div>

                {/* Bottom Action Prompt */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D1B875] group-hover:text-[#F4EEE4] transition-colors inline-flex items-center gap-1.5">
                    <span>{lang === 'hi' ? 'संग्रह एक्सप्लोर करें' : 'Explore Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] text-[#BDB3A5] font-mono">
                    FLOOR 2
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Tailoring & Safa Atelier Feature Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#351019] via-[#4A1724] to-[#181516] border border-[#B89A5A]/30 text-left flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block mb-1">
              MASTER ATELIER ON-SITE · 2ND FLOOR
            </span>
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4]">
              {lang === 'hi' ? 'परफेक्ट फिटिंग व विवाह पगड़ी/साफा स्टाइलिंग' : 'Bespoke Fitting & Safa / Turban Atelier'}
            </h4>
            <p className="text-xs sm:text-sm text-[#BDB3A5] mt-2 font-light leading-relaxed">
              {lang === 'hi'
                ? 'हमारे इन-हाउस मास्टर दर्जी द्वारा सटीक माप, कस्टमाइजेशन एवं विवाह के दिन पगड़ी/साफा बांधने की विशेष सेवा उपलब्ध है।'
                : 'Experience bespoke fit consultations with our master tailors. Matching safas, ceremonial dupattas, mojaris, and jewellery brooches curated on-site.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Namaste Shree Vijay Showroom, I want to book a groom sherwani fitting consultation in Jabalpur.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <span>{lang === 'hi' ? 'ट्रायल अपॉइंटमेंट लें' : 'Book Groom Trial'}</span>
              <ArrowRight className="w-4 h-4 text-[#B89A5A]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
