import React, { useState } from 'react';
import { X, MessageCircle, MapPin } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language, translations } from '../lib/translations.ts';

interface ProductDetailModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  onEnquire: (product: Product, variantInfo?: string, quantity?: number) => void;
  whatsappNumber?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  onClose,
  onEnquire,
  whatsappNumber = '918989892476',
}) => {
  if (!product) return null;
  const t = translations[lang];

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/src/assets/images/hero_bridal_wedding_1790317438926.jpg'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>(product.colour || 'Standard');
  const [quantity, setQuantity] = useState(1);

  const effectivePrice = product.offer_price || product.price;

  // Generate product WhatsApp URL
  const waText = `Hello Shree Vijay Showroom Jabalpur, I am interested in ${product.name} (SKU: ${product.sku}) in ${selectedVariant} (Qty: ${quantity}). Please provide availability, price details and video-call showcase.`;
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#181516] text-[#F4EEE4] w-full max-w-4xl rounded-xs shadow-2xl border border-[#B89A5A]/30 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#121011]/90 text-[#BDB3A5] hover:text-[#F4EEE4] hover:bg-[#201C1E] border border-white/10 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-[#121011] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            {/* Primary Main Image Frame */}
            <div className="relative h-80 sm:h-96 w-full rounded-xs overflow-hidden bg-[#0A0909] border border-white/10">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0A0909]/90 px-2.5 py-1 text-xs font-semibold text-[#D1B875] border border-[#B89A5A]/40 backdrop-blur-xs font-mono">
                {product.stock_status}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xs overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#D1B875] scale-105 ring-1 ring-[#B89A5A]' : 'border-white/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* In-Store Guarantee Note */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#BDB3A5]">
              <MapPin className="w-4 h-4 text-[#B89A5A] shrink-0" />
              <span>Available for physical trial & fitting at Bada Fuhara, Jabalpur showroom.</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
            <div>
              {/* Clean Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#BDB3A5] uppercase tracking-wider mb-2 font-mono">
                <span>SKU: {product.sku}</span>
                <span aria-hidden="true">·</span>
                <span>{product.stock_status}</span>
                <span aria-hidden="true">·</span>
                <span>Jabalpur Showroom</span>
              </div>

              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#F4EEE4] leading-tight">
                {lang === 'hi' ? product.name_hi : product.name}
              </h2>

              {/* Price Banner */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#F4EEE4] font-mono tabular-nums">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {product.offer_price && product.offer_price < product.price && (
                  <span className="text-sm text-[#BDB3A5] line-through font-mono tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
                {product.offer_price && product.offer_price < product.price && (
                  <span className="text-xs font-semibold text-[#D1B875] bg-[#4A1724]/50 px-2 py-0.5 rounded-xs border border-[#B89A5A]/40">
                    Save ₹{(product.price - product.offer_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#BDB3A5] leading-relaxed font-light">
                {lang === 'hi' ? product.description_hi : product.description}
              </p>

              {/* Key Specifications Table */}
              <div className="mt-6 border-t border-b border-white/10 py-3 text-xs space-y-2">
                {product.fabric && (
                  <div className="flex justify-between">
                    <span className="text-[#BDB3A5]">{t.product.fabric}:</span>
                    <span className="font-medium text-[#F4EEE4]">{product.fabric}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-[#BDB3A5]">{t.product.material}:</span>
                    <span className="font-medium text-[#F4EEE4]">{product.material}</span>
                  </div>
                )}
                {product.occasion && (
                  <div className="flex justify-between">
                    <span className="text-[#BDB3A5]">Occasion:</span>
                    <span className="font-medium text-[#F4EEE4]">{product.occasion}</span>
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              {product.colour && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-[#BDB3A5] block uppercase tracking-wider mb-1.5">
                    {t.product.colour}: <span className="text-[#F4EEE4]">{selectedVariant}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[product.colour].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedVariant(c)}
                        className={`px-3 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                          selectedVariant === c
                            ? 'border-[#D1B875] bg-[#4A1724] text-[#F4EEE4]'
                            : 'border-white/15 bg-[#121011] text-[#BDB3A5] hover:border-[#B89A5A]/50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-semibold text-[#BDB3A5] uppercase tracking-wider">
                  {t.product.qty}:
                </label>
                <div className="flex items-center border border-white/20">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-xs hover:bg-white/10 text-[#F4EEE4] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-semibold text-[#F4EEE4] bg-[#121011]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-xs hover:bg-white/10 text-[#F4EEE4] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onEnquire(product, selectedVariant, quantity)}
                className="w-full py-3.5 px-6 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] text-xs font-semibold uppercase tracking-[0.2em] border border-[#B89A5A]/50 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.product.enquireNow}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-transparent hover:bg-white/5 text-[#D1B875] hover:text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider border border-[#B89A5A]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{t.product.chatWhatsApp}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
