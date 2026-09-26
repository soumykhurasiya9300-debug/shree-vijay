import React, { useState } from 'react';
import { Users, ArrowRight, Sparkles, Shirt } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import { Product } from '../types/index.ts';
import { getFamilyWeddingReelUrl, openInstagramReel } from '../lib/instagramReels.ts';

// Curated high-fidelity imagery for each category display
import weddingBgImg from '../assets/images/family_wedding_bg.jpg';
import menImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import bridalImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';
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
        badge: "Groom & Family",
        badge_hi: 'उत्सव व हल्दी',
        filterQuery: 'kurta',
      },
      {
        id: 'sharvani',
        name: 'Sherwani',
        name_hi: 'शाही शेरवानी',
        tagline: 'Hand-embroidered zardozi raw silk & Jamawar royal sherwanis',
        tagline_hi: 'जरदोजी, कटदाना व जामावार वीव में सजी राजसी शेरवानी',
        image: menImg,
        badge: "Royal Heritage",
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
        badge: "Bespoke Cut",
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
        badge: "Couture Fusion",
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
        badge: "Pure Silk Weave",
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
        badge: "Evening Glamour",
        badge_hi: 'रिसेप्शन व कॉकटेल',
        filterQuery: 'gown',
      },
      {
        id: 'lehenga',
        name: 'Lehenga',
        name_hi: 'ब्राइडल लहंगा',
        tagline: 'Heirloom zardozi crimson velvet & pastel floral bridal lehengas',
        tagline_hi: 'शाही जरदोजी वेलवेट, डबल दुपट्टा व पेस्टल सिल्क लहंगा',
        image: bridalImg,
        badge: "Master Bridal",
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
        badge: "Celebration Wear",
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

  return (
    <section
      id="family-wedding"
      className="relative py-20 lg:py-28 text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      {/* Background Image Layer (from https://pin.it/35jHrOzcs) with high visibility */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={weddingBgImg}
          alt="Shree Vijay Complete Wedding Wardrobe Atmosphere"
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.05]"
        />
        {/* Delicate edge blend so the background photo is vividly visible throughout the section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/60 via-transparent to-[#0A0909]/70" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with frosted luxury backdrop ensuring sharp legibility over the vivid background */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 bg-[#181516]/90 backdrop-blur-md py-8 px-6 sm:px-10 rounded-xs border border-[#B89A5A]/35 shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मेंस व विमेन्स वेडिंग परिधान' : 'MALE & FEMALE WEDDING WARDROBE'}</span>
            <Users className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4] leading-[1.1]">
            {lang === 'hi' ? (
              <>
                मेंस एवं विमेन्स परिधान <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  विवाह व उत्सव की संपूर्ण खरीदारी।
                </span>
              </>
            ) : (
              <>
                MALE & FEMALE <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  COMPLETE WEDDING COLLECTION.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#BDB3A5] font-light max-w-xl mx-auto">
            {lang === 'hi'
              ? 'पुरुषों के लिए कुर्ता, शेरवानी, ब्लेजर्स व इंडो-वेस्टर्न एवं महिलाओं के लिए साड़ी, गाउन, लहंगा व कुर्ती का विशेष मुख्य संग्रह।'
              : 'Explore each signature category with high-definition visuals tailored for both men and women under one heritage roof in Jabalpur.'}
          </p>

          {/* Primary Gender Segmented Switch: MALE & FEMALE */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => setActiveGender('male')}
              className={`px-7 py-3 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                activeGender === 'male'
                  ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A] shadow-lg scale-105'
                  : 'bg-[#121011]/85 hover:bg-[#181516] text-[#BDB3A5] border-white/10 hover:border-[#B89A5A]/50 hover:text-[#F4EEE4]'
              }`}
            >
              <Shirt className="w-4 h-4 text-[#B89A5A]" />
              <span>{lang === 'hi' ? 'पुरुष (मेंस सेक्शन)' : 'MALE SECTION'}</span>
            </button>

            <button
              onClick={() => setActiveGender('female')}
              className={`px-7 py-3 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                activeGender === 'female'
                  ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A] shadow-lg scale-105'
                  : 'bg-[#121011]/85 hover:bg-[#181516] text-[#BDB3A5] border-white/10 hover:border-[#B89A5A]/50 hover:text-[#F4EEE4]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#B89A5A]" />
              <span>{lang === 'hi' ? 'महिला (विमेन्स सेक्शन)' : 'FEMALE SECTION'}</span>
            </button>
          </div>
        </div>

        {/* Main Display of Subcategories: Image on top, Subcategory Details Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {currentDisplayList.map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleSubcategoryClick(sub)}
              className="group bg-[#181516]/95 hover:bg-[#201C1E] border border-white/10 hover:border-[#B89A5A]/60 rounded-xs overflow-hidden flex flex-col transition-all duration-500 shadow-md hover:shadow-2xl cursor-pointer"
            >
              {/* Main Subcategory Image Display */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0909]">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Decorative Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Subcategory Badge on Image Top-Left */}
                <div className="absolute top-3 left-3 bg-[#121011]/90 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#D1B875] font-semibold px-2.5 py-1 border border-[#B89A5A]/40 shadow-xs">
                  {lang === 'hi' ? sub.badge_hi : sub.badge}
                </div>

                {/* Hover Indicator Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#B89A5A] text-[#0A0909] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Subcategory Details Displayed Clearly Below Image */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left bg-[#181516]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5A] font-semibold mb-1">
                    {activeGender === 'male' ? "MALE COLLECTION" : "FEMALE COLLECTION"}
                  </div>

                  {/* Subcategory Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                    {lang === 'hi' ? sub.name_hi : sub.name}
                  </h3>

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
                  <span className="text-[10px] text-[#BDB3A5] font-mono">
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
