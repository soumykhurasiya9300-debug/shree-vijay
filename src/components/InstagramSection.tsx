import React from 'react';
import { Instagram, ArrowUpRight, Youtube } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';

import bridalWeddingImg from '../assets/images/hero_bridal_wedding_1790317438926.jpg';
import groomSherwaniImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import banarasiSareeImg from '../assets/images/designer_banarasi_saree_1790317467169.jpg';
import bridalLehengaImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';

interface InstagramSectionProps {
  lang: Language;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  lang,
  instagramUrl = 'https://instagram.com/shreevijayshowroom',
  youtubeUrl = 'https://www.youtube.com/channel/UCRSKEwjmz4xltTpOoubrLJw',
}) => {
  const t = translations[lang];

  const galleryItems = [
    {
      img: bridalWeddingImg,
      fallback: '/images/hero_bridal_wedding_1790317438926.jpg',
      caption: 'Regal Crimson Red Bridal Zardozi Lehengas',
      tag: '#ShreeVijayBrides',
    },
    {
      img: groomSherwaniImg,
      fallback: '/images/groom_royal_sherwani_1790317453744.jpg',
      caption: 'Ivory Raw Silk Heritage Sherwani for Royal Grooms',
      tag: '#JabalpurGroomWear',
    },
    {
      img: banarasiSareeImg,
      fallback: '/images/designer_banarasi_saree_1790317467169.jpg',
      caption: 'Authentic Banarasi Katan Silk with Antique Zari',
      tag: '#PureBanarasiSilk',
    },
    {
      img: bridalLehengaImg,
      fallback: '/images/bridal_lehenga_collection_1790317477737.jpg',
      caption: 'Pastel Rose Gold Handcrafted Mirror Work Couture',
      tag: '#BridalFashion2026',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#B89A5A] font-semibold mb-2">
              <Instagram className="w-4 h-4 text-[#D1B875]" />
              <span>@shreevijayshowroom</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#F4EEE4]">
              {t.sections.instagramTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              <span>Follow on Instagram</span>
              <ArrowUpRight className="w-4 h-4 text-[#D1B875]" />
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#181516] hover:bg-[#201C1E] border border-white/20 hover:border-red-500/60 text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-lg group"
            >
              <Youtube className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Watch on YouTube</span>
              <ArrowUpRight className="w-4 h-4 text-[#BDB3A5]" />
            </a>
          </div>
        </div>

        {/* 4 Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, idx) => (
            <a
              key={idx}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-72 sm:h-96 rounded-xs overflow-hidden bg-[#181516] border border-white/10 hover:border-[#B89A5A]/60 block transition-all duration-300 shadow-xl"
            >
              <img
                src={item.img}
                alt={item.caption}
                className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = item.fallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909]/95 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-[#F4EEE4]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D1B875]">{item.tag}</span>
                <p className="text-xs text-[#BDB3A5] font-light line-clamp-2 mt-0.5">{item.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
