import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';

interface InstagramSectionProps {
  lang: Language;
  instagramUrl?: string;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  lang,
  instagramUrl = 'https://instagram.com/shreevijayshowroom',
}) => {
  const t = translations[lang];

  const galleryItems = [
    {
      img: '/src/assets/images/hero_bridal_wedding_1790317438926.jpg',
      caption: 'Regal Crimson Red Bridal Zardozi Lehengas',
      tag: '#ShreeVijayBrides',
    },
    {
      img: '/src/assets/images/groom_royal_sherwani_1790317453744.jpg',
      caption: 'Ivory Raw Silk Heritage Sherwani for Royal Grooms',
      tag: '#JabalpurGroomWear',
    },
    {
      img: '/src/assets/images/designer_banarasi_saree_1790317467169.jpg',
      caption: 'Authentic Banarasi Katan Silk with Antique Zari',
      tag: '#PureBanarasiSilk',
    },
    {
      img: '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg',
      caption: 'Pastel Rose Gold Handcrafted Mirror Work Couture',
      tag: '#BridalFashion2026',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FCFAF7] border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B48448] font-semibold mb-2">
              <Instagram className="w-4 h-4" />
              <span>@shreevijayshowroom</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1C1611]">
              {t.sections.instagramTitle}
            </h2>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1611] hover:bg-[#B48448] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors self-start sm:self-auto"
          >
            <span>Follow on Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <a
              key={idx}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-64 sm:h-80 rounded-sm overflow-hidden bg-[#E8DFD3] border border-[#E0D6C8] block"
            >
              <img
                src={item.img}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[11px] font-semibold text-[#E0B97B]">{item.tag}</span>
                <p className="text-xs text-white/90 line-clamp-2 mt-0.5">{item.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
