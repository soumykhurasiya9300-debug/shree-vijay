import React from 'react';
import { Instagram, Facebook, MessageCircle, MapPin, Shield, Play } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';

interface FooterProps {
  lang: Language;
  settings?: WebsiteSettings;
  onOpenAdmin: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  settings,
  onOpenAdmin,
  onReplayIntro,
}) => {
  const phone = settings?.phone || '089898 92476';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com/shreevijayshowroom';
  const facebookUrl = settings?.facebook_url || 'https://facebook.com/shreevijayshowroom';
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || '918989892476'}`;

  return (
    <footer className="bg-[#1C060B] text-[#F7F2EA] border-t border-[#B89455]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Headline Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-white/10 gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89455] font-semibold block mb-2">
              JABALPUR · EST. 1990
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-[0.12em] text-[#F7F2EA] uppercase">
              SHREE VIJAY
            </h2>
            <p className="font-editorial text-lg sm:text-xl text-[#D8C8B5]/85 italic mt-1">
              The Wedding House of Jabalpur
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#D8C8B5]/80">
            <a
              href="https://maps.google.com/?q=5WGJ%2B4G+Jabalpur"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B89455]" />
              <span>Bada Fuhara, Jabalpur</span>
            </a>
            <span className="opacity-30">·</span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hover:text-white transition-colors"
            >
              {phone}
            </a>
            <span className="opacity-30">·</span>
            <span className="text-emerald-400">Open 7 Days (10:30 AM – 10:00 PM)</span>
          </div>
        </div>

        {/* Clean 4-Column Minimal Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs text-left">
          {/* Departments */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89455] mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-[#D8C8B5]/75 font-light">
              <li>
                <a href="#bridal-edit" className="hover:text-white transition-colors">
                  The Bridal Suite
                </a>
              </li>
              <li>
                <a href="#groom-edit" className="hover:text-white transition-colors">
                  The Groom's Lounge
                </a>
              </li>
              <li>
                <a href="#showroom-floor" className="hover:text-white transition-colors">
                  Pure Banarasi Sarees
                </a>
              </li>
              <li>
                <a href="#family-wedding" className="hover:text-white transition-colors">
                  Family Wedding Ensembles
                </a>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89455] mb-3">
              Occasions
            </h4>
            <ul className="space-y-2 text-[#D8C8B5]/75 font-light">
              <li>
                <a href="#occasions" className="hover:text-white transition-colors">
                  Haldi & Mehendi
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-white transition-colors">
                  Sangeet Twirl
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-white transition-colors">
                  Wedding Mandap
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-white transition-colors">
                  Royal Reception
                </a>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89455] mb-3">
              Experience
            </h4>
            <ul className="space-y-2 text-[#D8C8B5]/75 font-light">
              <li>
                <a href="#digital-rack" className="hover:text-white transition-colors">
                  The Digital Rack
                </a>
              </li>
              <li>
                <a href="#walkthrough" className="hover:text-white transition-colors">
                  Showroom Walkthrough
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">
                  30+ Years Heritage
                </a>
              </li>
              <li>
                <a href="#visit" className="hover:text-white transition-colors">
                  Visit Showroom
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89455] mb-3">
              Connect
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-white/20 hover:border-[#B89455] flex items-center justify-center text-[#D8C8B5] hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-white/20 hover:border-[#B89455] flex items-center justify-center text-[#D8C8B5] hover:text-white transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-white/20 hover:border-[#B89455] flex items-center justify-center text-[#D8C8B5] hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="text-[11px] text-[#B89455] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Replay Brand Intro</span>
              </button>
            )}
          </div>
        </div>

        {/* Thin Divider & Bottom Metadata */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#D8C8B5]/60 font-light">
          <div>
            © {new Date().getFullYear()} Shree Vijay Showroom, Jabalpur. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>26/1 Garha Phatak Road, Jabalpur (M.P.)</span>
            <span className="opacity-30">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#D8C8B5]/50 hover:text-[#B89455] transition-colors flex items-center gap-1 cursor-pointer"
              title="Staff Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
