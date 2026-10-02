import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';
import featureImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';

interface FeaturedLookSpotlightProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
}

export const FeaturedLookSpotlight: React.FC<FeaturedLookSpotlightProps> = ({
  products,
  lang,
  onViewProduct,
  onEnquireProduct,
}) => {
  // Select the primary featured product or fallback
  const heroPiece = products.find((p) => p.is_featured === 1) || products[0];

  return (
    <section className="py-20 lg:py-28 bg-[#121011] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'विशेष चयन' : 'EDITORIAL SPOTLIGHT'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F4EEE4] mt-1">
            {lang === 'hi' ? 'सप्ताह का श्रेष्ठ परिधान' : 'The Curator’s Look of the Week'}
          </h2>
        </div>

        {/* Asymmetric Center Composition */}
        <div className="relative bg-[#181516] border border-[#B89A5A]/30 shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Subtle architectural gold corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#B89A5A]" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#B89A5A]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#B89A5A] font-bold block">
                {heroPiece?.category_name || 'BRIDAL HEIRLOOM'}
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4EEE4] leading-snug">
                {heroPiece?.name || 'Rajwada Crimson Zardozi Bridal Lehenga'}
              </h3>

              <p className="text-xs sm:text-sm text-[#BDB3A5] font-light leading-relaxed">
                {heroPiece?.description ||
                  'Meticulously hand-embroidered by veteran artisans over 240 man-hours. Combines antique dabka metal coil work, fine cutdana embellishments, and pure velvet silk flair.'}
              </p>

              <div className="pt-2 space-y-1.5 text-xs text-[#F4EEE4] font-medium border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-[#BDB3A5]">Craft:</span>
                  <span>Handcrafted Zardozi & Zari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BDB3A5]">Fabric:</span>
                  <span>{heroPiece?.fabric || 'Pure Velvet Silk'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BDB3A5]">Occasion:</span>
                  <span>Wedding Mandap / Reception</span>
                </div>
              </div>
            </div>

            {/* Central Prominent Garment Showcase (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#B89A5A]/40 shadow-xl bg-[#0A0909] mx-auto">
                <img
                  src={heroPiece?.images?.[0] || featureImg}
                  alt={heroPiece?.name || 'Featured Look'}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 filter brightness-[0.92]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/bridal_lehenga_collection_1790317477737.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#4A1724] text-[#F4EEE4] text-[10px] tracking-widest px-3 py-1 font-mono uppercase border border-[#B89A5A]/30">
                  SKU: {heroPiece?.sku || 'SV-BR-01'}
                </div>
              </div>
            </div>

            {/* Right Action & Value Column (3 cols) */}
            <div className="lg:col-span-3 text-left lg:text-center flex flex-col justify-center space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#BDB3A5] block">
                  Showroom Price
                </span>
                <span className="font-display text-3xl font-bold text-[#F4EEE4]">
                  ₹{heroPiece?.price?.toLocaleString('en-IN') || '48,500'}
                </span>
                <span className="text-[11px] text-[#D1B875] block mt-0.5">
                  Includes Custom Fitting & Blouse Stitching
                </span>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                {heroPiece && (
                  <button
                    onClick={() => onViewProduct(heroPiece)}
                    className="w-full py-3 px-4 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] text-xs font-semibold uppercase tracking-[0.16em] transition-colors shadow-xs cursor-pointer text-center border border-[#B89A5A]/50"
                  >
                    {lang === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Details'}
                  </button>
                )}

                {heroPiece && (
                  <button
                    onClick={() => onEnquireProduct(heroPiece)}
                    className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer text-center"
                  >
                    {lang === 'hi' ? 'पूछताछ करें' : 'Enquire Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
