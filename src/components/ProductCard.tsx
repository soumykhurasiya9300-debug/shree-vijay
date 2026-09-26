import React from 'react';
import { MessageCircle, Eye } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language, translations } from '../lib/translations.ts';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onViewDetails: (product: Product) => void;
  onQuickEnquire: (product: Product) => void;
  whatsappNumber?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onViewDetails,
  onQuickEnquire,
  whatsappNumber = '918989892476',
}) => {
  const t = translations[lang];
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/src/assets/images/hero_bridal_wedding_1790317438926.jpg';

  // Format WhatsApp direct link with product specifics
  const waMessage = `Namaste Shree Vijay Showroom, I am interested in ${product.name} (${product.sku}) priced around ₹${(
    product.offer_price || product.price
  ).toLocaleString('en-IN')}. Please confirm availability and share more photos.`;
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  const isLowStock = product.stock_status === 'Low Stock';
  const isOutOfStock = product.stock_status === 'Out of Stock';

  return (
    <div className="group bg-[#181516] border border-white/10 rounded-sm overflow-hidden flex flex-col hover:border-[#B89A5A]/60 hover:shadow-2xl transition-all duration-300">
      {/* Product Image Frame (Takes ~68% height) */}
      <div
        className="relative h-80 sm:h-96 overflow-hidden bg-[#0A0909] cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={primaryImage}
          alt={lang === 'hi' ? product.name_hi : product.name}
          className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_bridal_wedding_1790317438926.jpg';
          }}
        />

        {/* Subtle Stock Text (Zero-pill discipline: quiet inline label) */}
        <div className="absolute top-3 left-3 bg-[#121011]/95 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-[#F4EEE4] border border-[#B89A5A]/30">
          {isOutOfStock ? (
            <span className="text-red-400">{t.product.outOfStock}</span>
          ) : isLowStock ? (
            <span className="text-amber-400">{t.product.lowStock}</span>
          ) : (
            <span className="text-emerald-400">{t.product.inStock}</span>
          )}
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1 py-2 px-3 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#D1B875] hover:text-[#0A0909] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.product.viewDetails}</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#181516]">
        <div>
          {/* Unboxed Metadata: SKU & Fabric */}
          <div className="flex items-center gap-2 text-[11px] text-[#BDB3A5] uppercase tracking-wider mb-1 font-sans">
            <span>{product.sku}</span>
            {product.fabric && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{product.fabric}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-semibold text-[#F4EEE4] line-clamp-2 cursor-pointer hover:text-[#D1B875] transition-colors leading-snug"
          >
            {lang === 'hi' ? product.name_hi : product.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#F4EEE4] font-mono tabular-nums">
              ₹{(product.offer_price || product.price).toLocaleString('en-IN')}
            </span>
            {product.offer_price && product.offer_price < product.price && (
              <span className="text-xs text-[#BDB3A5] line-through font-mono tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            {product.offer_price && product.offer_price < product.price && (
              <span className="text-[11px] text-emerald-400 font-semibold ml-auto">
                Save ₹{(product.price - product.offer_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickEnquire(product)}
              className="w-full py-2 px-2 text-xs font-semibold tracking-wider uppercase text-[#F4EEE4] bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/40 transition-colors rounded-xs text-center truncate cursor-pointer"
            >
              {t.product.enquireNow}
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2 text-xs font-semibold text-emerald-300 bg-[#0F2318] hover:bg-[#173625] border border-emerald-700/50 transition-colors rounded-xs flex items-center justify-center gap-1 truncate"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
