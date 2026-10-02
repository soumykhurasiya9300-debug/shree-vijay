import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';
import DepthCarousel, { DepthCarouselItem } from './DepthCarousel.tsx';

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
  const [activeDepthIndex, setActiveDepthIndex] = useState(0);

  // Curate display items from products list
  const rackItems = products.slice(0, 10);

  // Map to depth carousel items
  const depthItems: DepthCarouselItem[] = rackItems.map((prod) => ({
    image: prod.images?.[0] || '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg',
    alt: prod.name,
    title: prod.name,
    category: prod.category_name || 'Couture Look',
    price: prod.price,
    subtitle: `₹${prod.price?.toLocaleString('en-IN')}`,
    onView: () => onViewProduct(prod),
    onEnquire: () => onEnquireProduct(prod),
  }));

  return (
    <section
      id="digital-rack"
      className="relative bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      {/* Top Section Header Container - Centered and Bold */}
      <div className="pt-20 lg:pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-bold mb-3 px-4 py-1 rounded-full bg-[#181516]/80 border border-[#B89A5A]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#D1B875]" />
          <span>{lang === 'hi' ? 'शोरूम हैंगर एक्सपीरियंस' : 'THE DIGITAL RACK EXPERIENCE'}</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4EEE4] max-w-4xl mx-auto leading-tight">
          {lang === 'hi' ? 'द शोरूम कूट्यूर रैक' : 'Browse the Couture Rack'}
        </h2>

        <p className="font-editorial italic text-base sm:text-xl text-[#D1B875] mt-3 max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'जैसे आप शोरूम में हैंगर पर लगे मास्टरपीस को छूकर देखते हैं।'
            : 'Browse curated hanging ensembles in immersive depth, just as you would browse our brass atelier racks.'}
        </p>

        {/* Brass Atelier Rail Accent Line */}
        <div className="relative mt-8 mb-4 max-w-3xl mx-auto">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#B89A5A]/60 to-transparent w-full" />
        </div>
      </div>

      {/* Clean Carousel with Non-Overlapping Spacing (Fix for Issue 8) */}
      <div className="relative w-full max-w-6xl mx-auto px-4 pb-20">
        <div style={{ height: '520px', position: 'relative' }} className="w-full">
          <DepthCarousel
            items={depthItems}
            depth={60}
            spread={330}
            tilt={4}
            tiltDirection="right"
            perspective={1400}
            visibleCards={2}
            falloff={0.15}
            blur={2}
            autoplay
            autoplayDelay={3600}
            loop
            cardWidth={300}
            cardHeight={410}
            radius={0}
            tint="#0A0909"
            showControls
            showIndicators
            onChange={(index) => setActiveDepthIndex(index)}
          />
        </div>

        {/* Active Garment Spotlight Details Bar */}
        {depthItems[activeDepthIndex] && (
          <div className="mt-6 max-w-xl mx-auto p-4 bg-[#141112]/95 border border-[#B89A5A]/40 rounded-none shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs text-[#B89A5A] uppercase tracking-[0.18em] font-bold block mb-0.5">
                {depthItems[activeDepthIndex].category}
              </span>
              {/* Natural multi-line wrapping without truncating ellipsis (Fix for Issue 12) */}
              <h3 className="font-display text-base sm:text-lg font-bold text-[#F4EEE4] line-clamp-2 break-words">
                {depthItems[activeDepthIndex].title}
              </h3>
              <span className="font-mono text-sm text-[#D1B875] font-bold">
                ₹{depthItems[activeDepthIndex].price?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => depthItems[activeDepthIndex].onView?.()}
                className="btn-wine"
              >
                <span>{lang === 'hi' ? 'लुक देखें' : 'View Look'}</span>
              </button>
              <button
                type="button"
                onClick={() => depthItems[activeDepthIndex].onEnquire?.()}
                className="btn-primary"
              >
                <span>{lang === 'hi' ? 'पूछताछ' : 'Enquire'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DigitalRackSection;
