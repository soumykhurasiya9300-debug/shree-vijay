import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Product, Category } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { Language, translations } from '../lib/translations.ts';

interface ProductCatalogueProps {
  products: Product[];
  categories: Category[];
  lang: Language;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
  whatsappNumber?: string;
}

export const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  products,
  categories,
  lang,
  selectedCategoryId,
  onSelectCategory,
  onViewProduct,
  onEnquireProduct,
  whatsappNumber,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryId && p.category_id !== selectedCategoryId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query) || (p.name_hi && p.name_hi.includes(query));
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchFabric = p.fabric?.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchFabric) return false;
      }

      // Price filter
      const effectivePrice = p.offer_price || p.price;
      if (priceFilter === 'budget' && effectivePrice > 5000) return false;
      if (priceFilter === 'mid' && (effectivePrice <= 5000 || effectivePrice > 25000)) return false;
      if (priceFilter === 'luxury' && effectivePrice <= 25000) return false;

      return true;
    });
  }, [products, selectedCategoryId, searchQuery, priceFilter]);

  return (
    <section id="catalogue" className="py-16 sm:py-20 bg-[#F7F4EE] border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#B48448] font-semibold block mb-2">
              {lang === 'hi' ? 'सम्पूर्ण वेडिंग कलेक्शन' : 'THE COMPLETE WEDDING WARDROBE'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-[#1C1611]">
              {t.sections.signatureCatalogue}
            </h2>
          </div>
          <p className="text-sm text-[#7A6E5F] max-w-md">
            {lang === 'hi'
              ? 'बड़ा फुहारा जबलपुर स्थित हमारे स्टोर में सभी रेंज उपलब्ध हैं — रिटेल एवं होलसेल।'
              : 'Available for in-store trial at Bada Fuhara, Jabalpur and video-call ordering across India.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-sm border border-[#E8DFD3] shadow-xs mb-8 space-y-4">
          {/* Top row: Search input + Price Segmented tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A7D6F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'hi' ? 'साड़ी, लहंगा, शेरवानी खोजें...' : 'Search sarees, lehengas, sherwanis...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#FCFAF7] border border-[#E0D6C8] rounded-xs focus:outline-hidden focus:border-[#B48448] text-[#1C1611]"
              />
            </div>

            {/* Price Segmented Filter (Allowed interactive buttons with clean segmented state) */}
            <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-sm text-xs font-medium w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap ${
                  priceFilter === 'all' ? 'bg-white text-[#1C1611] shadow-xs font-semibold' : 'text-[#6E6152] hover:text-[#1C1611]'
                }`}
              >
                {lang === 'hi' ? 'सभी मूल्य' : 'All Prices'}
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter('budget')}
                className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap ${
                  priceFilter === 'budget' ? 'bg-white text-[#1C1611] shadow-xs font-semibold' : 'text-[#6E6152] hover:text-[#1C1611]'
                }`}
              >
                {lang === 'hi' ? 'किफायती (< ₹5,000)' : 'Daily & Festive (< ₹5,000)'}
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter('mid')}
                className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap ${
                  priceFilter === 'mid' ? 'bg-white text-[#1C1611] shadow-xs font-semibold' : 'text-[#6E6152] hover:text-[#1C1611]'
                }`}
              >
                {lang === 'hi' ? 'वेडिंग सिल्क (₹5k - ₹25k)' : 'Pure Silk (₹5k - ₹25k)'}
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter('luxury')}
                className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap ${
                  priceFilter === 'luxury' ? 'bg-white text-[#1C1611] shadow-xs font-semibold' : 'text-[#6E6152] hover:text-[#1C1611]'
                }`}
              >
                {lang === 'hi' ? 'शाही दुल्हन व दूल्हा (> ₹25k)' : 'Royal Couture (> ₹25k)'}
              </button>
            </div>
          </div>

          {/* Category Tabs Row (Allowed interactive segmented buttons) */}
          <div className="pt-2 border-t border-[#F0E8DC] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xs whitespace-nowrap transition-colors ${
                selectedCategoryId === null
                  ? 'bg-[#1C1611] text-white'
                  : 'bg-[#F7F4EE] text-[#5A5044] hover:bg-[#EAE2D5]'
              }`}
            >
              {lang === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs whitespace-nowrap transition-colors ${
                  selectedCategoryId === c.id
                    ? 'bg-[#1C1611] text-white'
                    : 'bg-[#F7F4EE] text-[#5A5044] hover:bg-[#EAE2D5]'
                }`}
              >
                {lang === 'hi' ? c.name_hi : c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Count Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#7A6E5F]">
          <span>
            {lang === 'hi'
              ? `${filteredProducts.length} परिधान प्रदर्शित`
              : `Showing ${filteredProducts.length} curated design${filteredProducts.length === 1 ? '' : 's'}`}
          </span>
          {(selectedCategoryId || searchQuery || priceFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onSelectCategory(null);
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="text-[#B48448] hover:underline font-medium"
            >
              {lang === 'hi' ? 'सभी फिल्टर हटाएं' : 'Clear all filters'}
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                lang={lang}
                onViewDetails={onViewProduct}
                onQuickEnquire={onEnquireProduct}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E8DFD3] rounded-sm py-16 px-6 text-center max-w-md mx-auto">
            <p className="text-base font-semibold text-[#1C1611]">
              {lang === 'hi' ? 'कोई परिधान नहीं मिला' : 'No matching clothing found'}
            </p>
            <p className="mt-1 text-xs text-[#7A6E5F]">
              {lang === 'hi'
                ? 'कृपया अलग शब्द खोजें अथवा अपने फिल्टर रीसेट करें।'
                : 'Try adjusting your search criteria or explore our complete showroom collection.'}
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory(null);
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1611] text-white rounded-xs"
            >
              {lang === 'hi' ? 'सभी परिधान देखें' : 'Show All Designs'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
