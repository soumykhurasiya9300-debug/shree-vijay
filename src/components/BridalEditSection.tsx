import React, { useState } from 'react';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';
import bridalHeroImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';
import bridalSectionBgImg from '../assets/images/bridal_section_bg.png';

interface BridalEditSectionProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
  whatsappNumber?: string;
}

export const BridalEditSection: React.FC<BridalEditSectionProps> = ({
  products,
  lang,
  onViewProduct,
  onEnquireProduct,
  whatsappNumber = '918989892476',
}) => {
  const [selectedSubOccasion, setSelectedSubOccasion] = useState<string>('all');

  const occasions = [
    { id: 'all', label: lang === 'hi' ? 'समस्त ब्राइडल' : 'All Bridal' },
    { id: 'mandap', label: lang === 'hi' ? 'फेरे / मंडप' : 'Mandap / Wedding' },
    { id: 'reception', label: lang === 'hi' ? 'रिसेप्शन' : 'Royal Reception' },
    { id: 'sangeet', label: lang === 'hi' ? 'संगीत' : 'Sangeet Twirl' },
    { id: 'mehendi', label: lang === 'hi' ? 'हल्दी व मेहंदी' : 'Haldi & Mehendi' },
  ];

  // Filter bridal / lehenga products
  const bridalProducts = products.filter((p) => {
    const text = `${p.name} ${p.description} ${p.category_name || ''} ${p.fabric || ''}`.toLowerCase();
    const isBridal =
      text.includes('bridal') ||
      text.includes('lehenga') ||
      text.includes('लहंगा') ||
      p.category_id === 1;

    if (!isBridal) return false;
    if (selectedSubOccasion === 'all') return true;
    if (selectedSubOccasion === 'mandap') {
      return text.includes('mandap') || text.includes('red') || text.includes('zardozi') || text.includes('crimson');
    }
    if (selectedSubOccasion === 'reception') {
      return text.includes('reception') || text.includes('velvet') || text.includes('gold') || text.includes('champagne');
    }
    if (selectedSubOccasion === 'sangeet') {
      return text.includes('sangeet') || text.includes('sequin') || text.includes('flair') || text.includes('blue');
    }
    if (selectedSubOccasion === 'mehendi') {
      return text.includes('haldi') || text.includes('mehendi') || text.includes('yellow') || text.includes('green');
    }
    return true;
  });

  const featuredBridal = bridalProducts[0];
  const secondaryBridal = bridalProducts.slice(1, 4);

  return (
    <section
      id="bridal-edit"
      className="relative py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      {/* Background Ambience Layer with Pinterest Reference Image (fitted to frame and properly visible) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={bridalSectionBgImg}
          alt="Shree Vijay Bridal Edit Background"
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] saturate-[1.05]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://i.pinimg.com/originals/4e/81/3d/4e813dacf02cbfa695a891a3bb55327b.png';
          }}
        />
        {/* Editorial Atmospheric Scrims tuned for high visibility and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/75 via-[#0A0909]/30 to-[#0A0909]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,9,9,0.65)_100%)]" />
        <div className="absolute inset-0 bg-[#4A1724]/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'द ब्राइडल एडिट' : 'THE BRIDAL EDIT'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4] leading-[1.1] text-balance">
            {lang === 'hi' ? (
              <>
                उस पल के लिए, <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  जो सदा के लिए अमर रहेगा।
                </span>
              </>
            ) : (
              <>
                FOR THE MOMENT <br />
                <span className="font-editorial italic font-normal text-[#D1B875]">
                  YOU'LL REMEMBER FOREVER.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#BDB3A5] font-light max-w-xl mx-auto">
            {lang === 'hi'
              ? 'शुद्ध रेशम, जरी व जरदोजी कारीगरी से अलंकृत दुल्हन परिधान — परंपरा और आधुनिक भव्यता का अनूठा संगम।'
              : 'Handcrafted zardozi, raw silks, and antique dori embroideries designed for every ceremonial milestone of your bridal journey.'}
          </p>

          {/* Occasion Segmented Filter (Anti-slop clean text buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                onClick={() => setSelectedSubOccasion(occ.id)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 cursor-pointer ${
                  selectedSubOccasion === occ.id
                    ? 'bg-[#4A1724] text-[#F4EEE4] shadow-lg border border-[#B89A5A]/60 border-b-2 border-b-[#B89A5A]'
                    : 'bg-[#181516] text-[#BDB3A5] hover:text-[#F4EEE4] hover:bg-[#201C1E] border border-white/10'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Magazine Composition Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Showcase Hero Tile (Large Image: 7 columns) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden border border-[#B89A5A]/35 shadow-2xl bg-[#0A0909]">
              <img
                src={featuredBridal?.images?.[0] || bridalHeroImg}
                alt="Shree Vijay Bridal Couture"
                className="w-full h-full object-cover object-top filter brightness-[0.88] transition-transform duration-1000 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-[#0A0909]/30 to-transparent pointer-events-none" />

              {/* Architectural Accent Frame */}
              <div className="absolute top-5 left-5 border-t border-l border-[#B89A5A]/60 w-10 h-10 pointer-events-none" />
              <div className="absolute bottom-5 right-5 border-b border-r border-[#B89A5A]/60 w-10 h-10 pointer-events-none" />

              {/* Feature Content Overlay */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block mb-1">
                  SIGNATURE PIECE · JABALPUR SHOWROOM
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4EEE4]">
                  {featuredBridal?.name || 'Rajwada Crimson Zardozi Bridal Lehenga'}
                </h3>
                <p className="text-xs sm:text-sm text-[#BDB3A5] mt-1 max-w-lg line-clamp-2 font-light">
                  {featuredBridal?.description ||
                    'Pure raw velvet silk with intricate hand zardozi, beaten gold bullion wire work, and dual organza dupattas.'}
                </p>

                <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-[#BDB3A5] text-xs mr-2">Couture Price:</span>
                    <span className="font-display font-bold text-lg text-[#F4EEE4]">
                      ₹{featuredBridal?.price?.toLocaleString('en-IN') || '48,500'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {featuredBridal && (
                      <button
                        onClick={() => onViewProduct(featuredBridal)}
                        className="px-4 py-2 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#EDE2D2] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        {lang === 'hi' ? 'विवरण देखें' : 'View Look'}
                      </button>
                    )}
                    {featuredBridal && (
                      <button
                        onClick={() => onEnquireProduct(featuredBridal)}
                        className="px-4 py-2 bg-[#4A1724] text-[#F4EEE4] hover:bg-[#351019] border border-[#B89A5A]/60 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        {lang === 'hi' ? 'पूछताछ करें' : 'Enquire'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stacked Magazine Tiles (5 columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {secondaryBridal.map((prod) => (
              <div
                key={prod.id}
                className="group relative flex flex-col sm:flex-row items-center gap-5 p-4 sm:p-5 bg-[#181516] border border-white/10 hover:border-[#B89A5A]/50 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Thumbnail Image */}
                <div className="w-full sm:w-36 h-48 sm:h-36 overflow-hidden bg-[#0A0909] shrink-0 relative">
                  <img
                    src={prod.images?.[0] || bridalHeroImg}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-[#4A1724] text-[#F4EEE4] text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium border border-[#B89A5A]/30">
                    {prod.sku}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-left w-full">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#B89A5A] font-semibold">
                    {prod.fabric || 'Pure Silk / Zardozi'}
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors mt-0.5 line-clamp-1">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-[#BDB3A5] mt-1 line-clamp-2 font-light">
                    {prod.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-display font-bold text-sm text-[#F4EEE4]">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onViewProduct(prod)}
                      className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] hover:text-[#F4EEE4] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{lang === 'hi' ? 'विवरण' : 'Explore'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* In-Store Bespoke Consultation Card */}
            <div className="p-6 bg-gradient-to-br from-[#4A1724] to-[#1E0911] text-[#F4EEE4] border border-[#B89A5A]/40 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#D1B875] font-semibold block mb-1">
                PRIVATE BRIDAL LOUNGE
              </span>
              <h4 className="font-display text-xl font-bold text-[#F4EEE4]">
                {lang === 'hi' ? 'निजी ब्राइडल ट्रायल बुक करें' : 'Book a Private Bridal Trial'}
              </h4>
              <p className="text-xs text-[#BDB3A5] mt-2 font-light leading-relaxed">
                {lang === 'hi'
                  ? 'हमारे जबलपुर शोरूम के प्रथम तल पर विशेष ब्राइडल लाउंज में संपूर्ण परिवार सहित पधारें। मास्टर स्टाइलिस्ट द्वारा व्यक्तिगत परामर्श।'
                  : 'Experience a dedicated private trial suite on our 1st floor with dedicated lighting, full jewelry matching, and master alteration specialists.'}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Namaste Shree Vijay Showroom, I would like to schedule a private bridal trial appointment.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Trial</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
