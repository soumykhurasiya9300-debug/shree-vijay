import React, { useState } from 'react';
import { X, MessageCircle, Check, MapPin } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-sm shadow-2xl border border-[#E8DFD3] overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#1C1611] hover:bg-[#1C1611] hover:text-white transition-colors flex items-center justify-center shadow-xs"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery (Contiguous purchase module sticky pattern) */}
          <div className="md:col-span-6 bg-[#F7F4EE] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DFD3]">
            {/* Primary Main Image Frame */}
            <div className="relative h-80 sm:h-96 w-full rounded-sm overflow-hidden bg-[#ECE4D8] border border-[#E0D6C8]">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1C1611] border border-[#E8DFD3]">
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
                    className={`relative w-16 h-16 rounded-xs overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#B48448] scale-105' : 'border-[#D8CEBE] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* In-Store Guarantee Note */}
            <div className="mt-4 pt-4 border-t border-[#E5DC CF] flex items-center gap-2 text-xs text-[#6B5E50]">
              <MapPin className="w-4 h-4 text-[#B48448] shrink-0" />
              <span>Available for physical trial & fitting at Bada Fuhara, Jabalpur showroom.</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Clean Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#7A6E5F] uppercase tracking-wider mb-2">
                <span>SKU: {product.sku}</span>
                <span aria-hidden="true">·</span>
                <span>{product.stock_status}</span>
                <span aria-hidden="true">·</span>
                <span>Jabalpur Showroom</span>
              </div>

              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#1C1611] leading-tight">
                {lang === 'hi' ? product.name_hi : product.name}
              </h2>

              {/* Price Banner */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#1C1611] font-mono tabular-nums">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {product.offer_price && product.offer_price < product.price && (
                  <span className="text-sm text-[#8A7D6F] line-through font-mono tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
                {product.offer_price && product.offer_price < product.price && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    Save ₹{(product.price - product.offer_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#5A5044] leading-relaxed">
                {lang === 'hi' ? product.description_hi : product.description}
              </p>

              {/* Key Specifications Table */}
              <div className="mt-6 border-t border-b border-[#E8DFD3] py-3 text-xs space-y-2">
                {product.fabric && (
                  <div className="flex justify-between">
                    <span className="text-[#7A6E5F]">{t.product.fabric}:</span>
                    <span className="font-medium text-[#1C1611]">{product.fabric}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-[#7A6E5F]">{t.product.material}:</span>
                    <span className="font-medium text-[#1C1611]">{product.material}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between">
                    <span className="text-[#7A6E5F]">{t.product.size}:</span>
                    <span className="font-medium text-[#1C1611]">{product.size}</span>
                  </div>
                )}
              </div>

              {/* Color / Variant Selector */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#1C1611] uppercase tracking-wider mb-2">
                  {t.product.colour}: <span className="text-[#B48448]">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[product.colour, 'Deep Maroon', 'Royal Gold', 'Emerald Green']
                    .filter((c, i, arr) => c && arr.indexOf(c) === i)
                    .map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedVariant(col as string)}
                        className={`px-3 py-1.5 text-xs rounded-xs border transition-colors ${
                          selectedVariant === col
                            ? 'border-[#1C1611] bg-[#1C1611] text-white font-medium'
                            : 'border-[#D8CEBE] bg-white text-[#5A5044] hover:border-[#1C1611]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-xs font-semibold text-[#1C1611] uppercase tracking-wider">
                  {t.product.qty}:
                </label>
                <div className="flex items-center border border-[#D8CEBE] rounded-xs bg-[#FCFAF7]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-semibold hover:bg-[#EAE2D5]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-sm font-semibold hover:bg-[#EAE2D5]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons (Strict Contiguous Purchase Module) */}
            <div className="pt-4 border-t border-[#E8DFD3] space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnquire(product, selectedVariant, quantity);
                }}
                className="w-full py-3.5 px-4 text-xs font-semibold tracking-wider uppercase text-white bg-[#1C1611] hover:bg-[#B48448] transition-colors rounded-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t.product.enquireNow}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors rounded-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.product.chatWhatsApp}</span>
              </a>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#7A6E5F]">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine Fabrics
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Free In-Store Trial
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
