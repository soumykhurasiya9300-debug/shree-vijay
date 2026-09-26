import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';

interface DigitalRackSectionProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
}

export const DigitalRackSection: React.FC<DigitalRackSectionProps> = ({
  products,
  lang,
  onViewProduct,
  onEnquireProduct,
}) => {
  const rackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (rackRef.current) {
      rackRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rackRef.current) {
      rackRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Curate display items from products list
  const rackItems = products.slice(0, 10);

  return (
    <section
      id="digital-rack"
      className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-[#B89A5A] font-semibold mb-2">
              {lang === 'hi' ? 'शोरूम हैंगर एक्सपीरियंस' : 'THE DIGITAL RACK EXPERIENCE'}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4EEE4]">
              {lang === 'hi' ? 'द शोरूम कूट्यूर रैक' : 'Browse the Couture Rack'}
            </h2>
            <p className="font-editorial italic text-base sm:text-lg text-[#D1B875] mt-1.5">
              {lang === 'hi'
                ? 'जैसे आप शोरूम में हैंगर पर लगे मास्टरपीस को छूकर देखते हैं।'
                : 'Browse curated hanging ensembles just as you would browse our brass boutique racks.'}
            </p>
          </div>

          {/* Desktop Scroll Navigators */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 border border-[#B89A5A]/40 hover:border-[#D1B875] bg-[#181516] hover:bg-[#201C1E] text-[#F4EEE4] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Previous rack garments"
            >
              <ChevronLeft className="w-5 h-5 text-[#B89A5A]" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 border border-[#B89A5A]/40 hover:border-[#D1B875] bg-[#181516] hover:bg-[#201C1E] text-[#F4EEE4] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Next rack garments"
            >
              <ChevronRight className="w-5 h-5 text-[#B89A5A]" />
            </button>
          </div>
        </div>

        {/* Brass Showroom Rail (Physical Showroom Detail) */}
        <div className="relative mb-6">
          <div className="h-1 bg-gradient-to-r from-[#5C4520] via-[#B89A5A] to-[#5C4520] shadow-sm rounded-full w-full" />
          <div className="flex justify-between px-10 -mt-2.5">
            <span className="w-2.5 h-4 bg-[#B89A5A]/80 rounded-xs" />
            <span className="w-2.5 h-4 bg-[#B89A5A]/80 rounded-xs" />
            <span className="w-2.5 h-4 bg-[#B89A5A]/80 rounded-xs" />
            <span className="w-2.5 h-4 bg-[#B89A5A]/80 rounded-xs" />
          </div>
        </div>

        {/* Horizontal Scrolling Rack Container */}
        <div
          ref={rackRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 px-2 -mx-2 focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Digital garment rack"
        >
          {rackItems.map((prod, index) => {
            const lookNumber = (index + 1).toString().padStart(2, '0');
            return (
              <div
                key={prod.id}
                className="group shrink-0 w-[270px] sm:w-[310px] bg-[#181516] border border-white/10 hover:border-[#B89A5A]/60 transition-all duration-300 shadow-xl flex flex-col text-left"
              >
                {/* Brass Hanger Hook Aesthetic */}
                <div className="flex justify-center -mt-3.5 mb-1 z-10 pointer-events-none">
                  <div className="w-5 h-5 rounded-full border-2 border-[#B89A5A] bg-[#181516] shadow-xs" />
                </div>

                {/* Vertical Garment Visual */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0909]">
                  <img
                    src={prod.images?.[0] || '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg'}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Look Code Overlay */}
                  <div className="absolute top-3 left-3 bg-[#121011]/95 text-[#F4EEE4] text-[10px] font-mono tracking-widest px-2.5 py-1 uppercase border border-[#B89A5A]/30 backdrop-blur-xs">
                    LOOK {lookNumber}
                  </div>

                  {/* Quick View Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                      onClick={() => onViewProduct(prod)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#D1B875] text-xs font-semibold uppercase tracking-wider shadow-xl transition-transform transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0A0909]" />
                      <span>{lang === 'hi' ? 'लुक देखें' : 'View Look'}</span>
                    </button>
                  </div>
                </div>

                {/* Garment Identification */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#B89A5A] uppercase tracking-[0.18em] font-semibold">
                      <span>{prod.category_name || 'Couture Look'}</span>
                      <span className="font-mono text-[#BDB3A5] text-[10px]">{prod.sku}</span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-[#F4EEE4] group-hover:text-[#D1B875] mt-1 line-clamp-1 transition-colors">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-[#BDB3A5] mt-1 line-clamp-2 font-light">
                      {prod.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#BDB3A5] uppercase block">Price:</span>
                      <span className="font-display font-bold text-base text-[#F4EEE4] font-mono">
                        ₹{prod.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => onEnquireProduct(prod)}
                      className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] hover:text-[#F4EEE4] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{lang === 'hi' ? 'पूछताछ' : 'Enquire'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B89A5A]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe Hint for Mobile */}
        <div className="sm:hidden text-center mt-4 text-[11px] text-[#BDB3A5] tracking-widest uppercase">
          ← Swipe to explore rack →
        </div>
      </div>
    </section>
  );
};
