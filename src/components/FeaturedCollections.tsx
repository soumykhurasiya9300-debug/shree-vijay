import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { Category, Subcategory, Product } from '../types/index.ts';
import { Language, translations } from '../lib/translations.ts';

interface FeaturedCollectionsProps {
  categories: Category[];
  subcategories?: Subcategory[];
  products?: Product[];
  lang: Language;
  onSelectCategory?: (categoryId: number) => void;
  onViewProduct?: (product: Product) => void;
  onEnquireProduct?: (product: Product) => void;
  whatsappNumber?: string;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  categories,
  subcategories = [],
  products = [],
  lang,
  onViewProduct,
  onEnquireProduct,
  whatsappNumber = '918989892476',
}) => {
  const t = translations[lang];

  // Track which category items are expanded (by category id)
  // By default, Bridal Lehengas (category 1) can be primed or open so users immediately see the experience
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<number[]>([1]);

  // Track the active subcategory for each category: { [categoryId]: subcategoryId }
  const [activeSubcategoryMap, setActiveSubcategoryMap] = useState<Record<number, number | 'all'>>({});

  // Toggle category expansion
  const toggleCategory = (catId: number, targetSubId?: number) => {
    setExpandedCategoryIds((prev) => {
      const isAlreadyExpanded = prev.includes(catId);
      if (isAlreadyExpanded && !targetSubId) {
        return prev.filter((id) => id !== catId);
      }
      if (!isAlreadyExpanded) {
        return [...prev, catId];
      }
      return prev;
    });

    if (targetSubId !== undefined) {
      setActiveSubcategoryMap((prev) => ({
        ...prev,
        [catId]: targetSubId,
      }));
    }
  };

  // Helper to get subcategories for a given category
  const getSubcategoriesForCategory = (categoryId: number): Subcategory[] => {
    const list = subcategories.filter((s) => s.category_id === categoryId);
    if (list.length > 0) return list;

    // Fallback occasion subcategories if not yet loaded from DB
    if (categoryId === 1) {
      return [
        { id: 12, category_id: 1, name: 'Haldi Lehengas', name_hi: 'हल्दी लहंगा', slug: 'haldi-lehengas' },
        { id: 13, category_id: 1, name: 'Sangeet & Mehendi Lehengas', name_hi: 'संगीत एवं मेहंदी लहंगा', slug: 'sangeet-lehengas' },
        { id: 14, category_id: 1, name: 'Mandap & Phera Bridal Lehengas', name_hi: 'मंडप एवं फेरा दुल्हन लहंगा', slug: 'mandap-lehengas' },
        { id: 15, category_id: 1, name: 'Royal Reception Lehengas', name_hi: 'शाही रिसेप्शन लहंगा', slug: 'reception-lehengas' },
      ];
    }
    if (categoryId === 2) {
      return [
        { id: 16, category_id: 2, name: 'Haldi & Yellow Silk Sarees', name_hi: 'हल्दी व फेस्टिव सिल्क', slug: 'haldi-sarees' },
        { id: 17, category_id: 2, name: 'Pure Banarasi Katan Silk', name_hi: 'शुद्ध बनारसी कतान सिल्क', slug: 'pure-banarasi-silk' },
        { id: 18, category_id: 2, name: 'Mandap & Wedding Silk Sarees', name_hi: 'मंडप व विवाह सिल्क साड़ियाँ', slug: 'mandap-wedding-sarees' },
        { id: 19, category_id: 2, name: 'Reception Party-Wear & Organza', name_hi: 'रिसेप्शन पार्टी वियर व ऑर्गेंजा', slug: 'reception-party-sarees' },
      ];
    }
    if (categoryId === 3) {
      return [
        { id: 20, category_id: 3, name: 'Haldi Kurta & Bundi Jacket', name_hi: 'हल्दी कुर्ता व बंडी जैकेट', slug: 'haldi-kurta-mens' },
        { id: 21, category_id: 3, name: 'Sangeet Indo-Western & Jodhpuri', name_hi: 'संगीत इंडो-वेस्टर्न व जोधपुरी', slug: 'sangeet-mens' },
        { id: 22, category_id: 3, name: 'Mandap Royal Sherwani & Safa', name_hi: 'मंडप राजसी शेरवानी व साफा', slug: 'mandap-sherwani' },
        { id: 23, category_id: 3, name: 'Reception Bandhgala & Tuxedo', name_hi: 'रिसेप्शन बंदगला व सूट', slug: 'reception-bandhgala' },
      ];
    }

    return [];
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper for WhatsApp click
  const handleWhatsAppEnquiry = (productName: string, categoryName: string, subcategoryName?: string) => {
    const text = lang === 'hi'
      ? `नमस्ते श्री विजय शोरूम जबलपुर! मैं आपके ${categoryName} संग्रह में ${subcategoryName ? subcategoryName + ' - ' : ''}${productName} के बारे में जानकारी लेना चाहता/चाहती हूँ। कृपया डिज़ाइन और इन-स्टोर ट्रायल की जानकारी दें।`
      : `Hello Shree Vijay Showroom Jabalpur! I would like to enquire about ${productName} from your ${categoryName}${subcategoryName ? ` (${subcategoryName})` : ''} collection. Please share availability and trial details.`;
    
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="collections" className="py-16 sm:py-20 bg-[#FCFAF7] border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B48448] font-semibold block mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B48448]" />
            <span>{lang === 'hi' ? 'राजसी पोशाक संग्रह' : 'SACRED ATTIRE'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-[#1C1611]">
            {t.sections.curatedCollections}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6E6356] leading-relaxed">
            {lang === 'hi'
              ? 'प्रत्येक कलेक्शन पर क्लिक करके रस्म अनुसार सब-कैटेगरी (हल्दी, संगीत, मंडप, रिसेप्शन) के डिज़ाइन देखें।'
              : 'Click any collection below to reveal occasion sub-categories like Haldi, Sangeet, Mandap, and Reception.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {categories.map((cat) => {
            const isExpanded = expandedCategoryIds.includes(cat.id);
            const catSubcategories = getSubcategoriesForCategory(cat.id);
            const activeSubId = activeSubcategoryMap[cat.id] ?? 'all';

            // Filter products for this category & active subcategory
            const catProducts = products.filter((p) => p.category_id === cat.id);
            const filteredProducts = activeSubId === 'all'
              ? catProducts
              : catProducts.filter((p) => p.subcategory_id === activeSubId);

            // Active subcategory object if any
            const activeSub = typeof activeSubId === 'number'
              ? catSubcategories.find((s) => s.id === activeSubId)
              : null;

            return (
              <div
                key={cat.id}
                className={`relative bg-[#FBF9F5] border rounded-sm overflow-hidden transition-all duration-300 shadow-xs ${
                  isExpanded
                    ? 'border-[#B48448] ring-1 ring-[#B48448]/30 shadow-md col-span-1 md:col-span-2 lg:col-span-3'
                    : 'border-[#E8DFD3] hover:border-[#B48448]/60 hover:shadow-md'
                }`}
              >
                {/* Main Category Header Block (Click to Toggle Sub-category view) */}
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className="cursor-pointer group"
                >
                  {/* Category Image Header */}
                  <div className={`relative overflow-hidden bg-[#ECE4D8] transition-all duration-500 ${isExpanded ? 'h-52 sm:h-64' : 'h-64'}`}>
                    <img
                      src={cat.image_url || '/src/assets/images/hero_bridal_wedding_1790317438926.jpg'}
                      alt={lang === 'hi' ? cat.name_hi : cat.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_bridal_wedding_1790317438926.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Expand/Collapse Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-[#1C1611] group-hover:bg-[#B48448] group-hover:text-white transition-colors shadow-xs text-xs font-semibold">
                      <span>{isExpanded ? (lang === 'hi' ? 'सब-कैटेगरी बंद करें' : 'Hide Sub-categories') : (lang === 'hi' ? 'सब-कैटेगरी देखें' : 'View Sub-categories')}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Image Title Overlay */}
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="text-[10px] tracking-[0.22em] uppercase text-[#E0B97B] font-semibold block mb-0.5">
                        {lang === 'hi' ? 'वेडिंग कलेक्शन' : 'WEDDING COLLECTION'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                        {lang === 'hi' ? cat.name_hi : cat.name}
                      </h3>
                      {cat.description && (
                        <p className="mt-1 text-xs text-white/85 line-clamp-1 font-sans">
                          {lang === 'hi' ? cat.description_hi : cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Occasions Preview Strip (visible on unexpanded cards) */}
                  {!isExpanded && catSubcategories.length > 0 && (
                    <div className="p-4 bg-white border-t border-[#E8DFD3]">
                      <div className="text-[11px] font-semibold text-[#8C7A68] uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>{lang === 'hi' ? 'रस्म अनुसार सब-कैटेगरी' : 'Occasion Sub-categories'}</span>
                        <span className="text-[#B48448] text-xs font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          {lang === 'hi' ? 'खोलें' : 'Explore'} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {catSubcategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(cat.id, sub.id);
                            }}
                            className="px-2.5 py-1 text-xs bg-[#F5EFE6] hover:bg-[#B48448] text-[#4A3B2C] hover:text-white rounded-full font-medium transition-colors border border-[#E5DACD]"
                          >
                            {lang === 'hi' ? sub.name_hi : sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub category of the curated wedding collection (Inside this item only) */}
                {isExpanded && (
                  <div
                    className="p-5 sm:p-7 bg-[#FCFAF7] border-t border-[#E8DFD3] transition-all animate-fadeIn"
                    role="region"
                    aria-label={`${cat.name} Sub-categories`}
                  >
                    {/* Sub-section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFD3] gap-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#B48448] uppercase">
                          {lang === 'hi' ? 'रस्म अनुसार सब-कलेक्शन' : 'OCCASIONS & SUB-CATEGORIES'}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold font-display text-[#1C1611]">
                          {lang === 'hi' ? `${cat.name_hi} — रस्म एवं उत्सव अनुसार` : `${cat.name} by Occasion`}
                        </h4>
                        <p className="text-xs text-[#7A6E5F] mt-0.5">
                          {lang === 'hi'
                            ? 'हल्दी, संगीत, मंडप और रिसेप्शन की खास पोशाकें देखें'
                            : 'Select an occasion below to view tailored designs with price and fabric details'}
                        </p>
                      </div>

                      {/* Close / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#665440] hover:text-[#1C1611] bg-[#EFE9DF] hover:bg-[#E4DCCE] rounded-sm transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'कलेक्शन समेटें' : 'Collapse Item'}</span>
                      </button>
                    </div>

                    {/* Occasion Sub-category Filter Tabs */}
                    <div className="py-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveSubcategoryMap((prev) => ({ ...prev, [cat.id]: 'all' }))}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                          activeSubId === 'all'
                            ? 'bg-[#1C1611] text-white shadow-xs'
                            : 'bg-white text-[#55473A] border border-[#DDD3C5] hover:border-[#B48448]'
                        }`}
                      >
                        {lang === 'hi' ? 'सभी रस्में (All Occasions)' : 'All Occasions'}
                      </button>

                      {catSubcategories.map((sub) => {
                        const isActive = activeSubId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setActiveSubcategoryMap((prev) => ({ ...prev, [cat.id]: sub.id }))}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-[#B48448] text-white ring-2 ring-[#B48448]/30 shadow-xs'
                                : 'bg-white text-[#55473A] border border-[#DDD3C5] hover:border-[#B48448] hover:text-[#1C1611]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                            <span>{lang === 'hi' ? sub.name_hi : sub.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Occasion Sub-category Title Banner */}
                    {activeSub && (
                      <div className="mb-5 p-3.5 bg-[#F4ECE1] border-l-4 border-[#B48448] rounded-r-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8E6D38]">
                            {lang === 'hi' ? 'चयनित सब-कैटेगरी' : 'SELECTED OCCASION SUB-CATEGORY'}
                          </span>
                          <h5 className="text-sm sm:text-base font-bold text-[#1C1611]">
                            {lang === 'hi' ? activeSub.name_hi : activeSub.name}
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppEnquiry(
                            cat.name,
                            lang === 'hi' ? cat.name_hi : cat.name,
                            lang === 'hi' ? activeSub.name_hi : activeSub.name
                          )}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-sm transition-colors self-start sm:self-auto shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'इस रस्म की और किस्में पूछें' : 'Enquire on WhatsApp'}</span>
                        </button>
                      </div>
                    )}

                    {/* Products Grid for this Category & Subcategory */}
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
                        {filteredProducts.map((prod) => {
                          const displayPrice = prod.offer_price || prod.price;
                          const hasDiscount = Boolean(prod.offer_price && prod.offer_price < prod.price);
                          const subObj = catSubcategories.find((s) => s.id === prod.subcategory_id);

                          return (
                            <div
                              key={prod.id}
                              className="bg-white border border-[#E8DFD3] rounded-sm overflow-hidden flex flex-col hover:border-[#B48448] hover:shadow-md transition-all group/item"
                            >
                              {/* Product Thumbnail */}
                              <div
                                onClick={() => onViewProduct?.(prod)}
                                className="relative h-48 bg-[#ECE4D8] overflow-hidden cursor-pointer"
                              >
                                <img
                                  src={prod.images?.[0] || '/src/assets/images/hero_bridal_wedding_1790317438926.jpg'}
                                  alt={lang === 'hi' ? prod.name_hi : prod.name}
                                  className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-500 ease-out"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/src/assets/images/hero_bridal_wedding_1790317438926.jpg';
                                  }}
                                />

                                {/* Subcategory Badge */}
                                {subObj && (
                                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-[#1C1611]/80 backdrop-blur-xs text-[10px] font-semibold text-[#E5D7BE]">
                                    {lang === 'hi' ? subObj.name_hi : subObj.name}
                                  </div>
                                )}

                                {hasDiscount && (
                                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-xs bg-[#B48448] text-white text-[10px] font-bold">
                                    {lang === 'hi' ? 'विशेष छूट' : 'Special Offer'}
                                  </div>
                                )}

                                {/* Hover Eye Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#1C1611] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{lang === 'hi' ? 'विवरण देखें' : 'View Piece'}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="p-3.5 flex-1 flex flex-col justify-between">
                                <div>
                                  <span className="text-[10px] font-mono text-[#8C7A68]">
                                    {prod.sku}
                                  </span>
                                  <h6
                                    onClick={() => onViewProduct?.(prod)}
                                    className="text-xs sm:text-sm font-bold font-display text-[#1C1611] line-clamp-1 cursor-pointer hover:text-[#B48448] transition-colors"
                                  >
                                    {lang === 'hi' ? prod.name_hi : prod.name}
                                  </h6>

                                  {prod.fabric && (
                                    <p className="text-[11px] text-[#7A6E5F] line-clamp-1 mt-0.5">
                                      {prod.fabric}
                                    </p>
                                  )}

                                  {/* Price */}
                                  <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-sm sm:text-base font-bold font-sans text-[#1C1611]">
                                      {formatPrice(displayPrice)}
                                    </span>
                                    {hasDiscount && (
                                      <span className="text-xs line-through text-[#9E8E7E]">
                                        {formatPrice(prod.price)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-3 pt-2.5 border-t border-[#EFE9DF] grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onViewProduct?.(prod)}
                                    className="w-full py-1.5 px-2 text-[11px] font-semibold text-[#1C1611] bg-[#F7F3EB] hover:bg-[#ECE4D8] border border-[#DDD3C5] rounded-xs transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>{lang === 'hi' ? 'विवरण' : 'Details'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleWhatsAppEnquiry(
                                      prod.name,
                                      lang === 'hi' ? cat.name_hi : cat.name,
                                      subObj ? (lang === 'hi' ? subObj.name_hi : subObj.name) : undefined
                                    )}
                                    className="w-full py-1.5 px-2 text-[11px] font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{lang === 'hi' ? 'पूछें' : 'Enquire'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Occasion Consultation Card if specific products are loading or showcased in store */
                      <div className="bg-white border border-dashed border-[#B48448]/40 rounded-sm p-6 sm:p-8 text-center my-2">
                        <Sparkles className="w-8 h-8 text-[#B48448] mx-auto mb-2 opacity-80" />
                        <h6 className="text-base sm:text-lg font-bold font-display text-[#1C1611]">
                          {lang === 'hi'
                            ? `${activeSub ? activeSub.name_hi : cat.name_hi} - 200+ विशेष डिज़ाइन शोरूम में उपलब्ध`
                            : `Over 200+ Handpicked ${activeSub ? activeSub.name : cat.name} Designs Available In-Store`}
                        </h6>
                        <p className="mt-1.5 text-xs sm:text-sm text-[#7A6E5F] max-w-lg mx-auto">
                          {lang === 'hi'
                            ? 'हमारे बड़ा फुहारा शोरूम में हर बजट और पसंद के अनुसार लेटेस्ट हल्दी, मेहंदी, संगीत, मंडप और रिसेप्शन परिधान उपलब्ध हैं। फोटो व वीडियो कॉल ट्रायल हेतु व्हाट्सएप करें।'
                            : 'Visit our flagship Bada Fuhara showroom in Jabalpur or request high-definition catalog photos & video consultation over WhatsApp directly.'}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleWhatsAppEnquiry(
                              activeSub ? activeSub.name : cat.name,
                              lang === 'hi' ? cat.name_hi : cat.name,
                              activeSub ? (lang === 'hi' ? activeSub.name_hi : activeSub.name) : undefined
                            )}
                            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-sm transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              {lang === 'hi'
                                ? `व्हाट्सएप पर ${activeSub ? activeSub.name_hi : cat.name_hi} के फोटो मंगाएं`
                                : `Request ${activeSub ? activeSub.name : cat.name} Photos on WhatsApp`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEnquireProduct?.(filteredProducts[0] || (products[0] as Product))}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1C1611] bg-[#F7F3EB] hover:bg-[#ECE4D8] border border-[#D5C9B8] rounded-sm transition-colors"
                          >
                            <span>{lang === 'hi' ? 'स्टोर विज़िट बुक करें' : 'Book Showroom Trial'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
