import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Shield, Compass, MapPin, Youtube, Instagram } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  settings?: WebsiteSettings;
  onOpenAdmin: () => void;
  onOpenEnquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  settings,
  onOpenAdmin,
  onOpenEnquiry,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[lang];

  const phone = settings?.phone || '089898 92476';
  const whatsappNumber = settings?.whatsapp_number || '918989892476';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com/shreevijayshowroom';
  const youtubeUrl = settings?.youtube_url || 'https://www.youtube.com/channel/UCRSKEwjmz4xltTpOoubrLJw';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    settings?.whatsapp_default_message ||
      'Namaste Shree Vijay Showroom, I would like to book a bridal/wedding consultation.'
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const departments = [
    {
      num: '01',
      title: lang === 'hi' ? 'द ब्राइडल सुइट' : 'The Bridal Suite',
      subtitle: lang === 'hi' ? 'राजसी दुल्हन लहंगा, मंडप व रिसेप्शन' : 'Heritage Bridal Lehengas & Reception',
      href: '#bridal-edit',
    },
    {
      num: '02',
      title: lang === 'hi' ? 'द ग्रूम्स लाउंज' : "The Groom's Lounge",
      subtitle: lang === 'hi' ? 'शाही शेरवानी, जोधपुरी व साफा' : 'Royal Sherwanis, Bandhgalas & Stoles',
      href: '#groom-edit',
    },
    {
      num: '03',
      title: lang === 'hi' ? 'विमेन्स हेरिटेज' : "Women's Heritage",
      subtitle: lang === 'hi' ? 'बनारसी सिल्क, कांजीवरम व साड़ियाँ' : 'Pure Banarasi, Silk Sarees & Drapes',
      href: '#showroom-floor',
    },
    {
      num: '04',
      title: lang === 'hi' ? 'फैमिली वेडिंग' : 'Family Wedding Edit',
      subtitle: lang === 'hi' ? 'माता-पिता, भाई-बहन व परिवार परिधान' : 'Coordinated Looks for Parents & Siblings',
      href: '#family-wedding',
    },
    {
      num: '05',
      title: lang === 'hi' ? 'वेडिंग ऑकेजन' : 'Wedding Occasions',
      subtitle: lang === 'hi' ? 'हल्दी, मेहंदी, संगीत, मंडप व रिसेप्शन' : 'Haldi, Mehendi, Sangeet & Reception',
      href: '#occasions',
    },
    {
      num: '06',
      title: lang === 'hi' ? 'द डिजिटल रैक' : 'The Digital Rack',
      subtitle: lang === 'hi' ? 'शोरूम हैंगर स्टाइल लुकबुक' : 'Horizontal Couture Showcase',
      href: '#digital-rack',
    },
    {
      num: '07',
      title: lang === 'hi' ? 'शोरूम वॉकथ्रू' : 'Showroom Walkthrough',
      subtitle: lang === 'hi' ? 'बड़ा फुहारा, जबलपुर स्टोर विजिट' : 'Bada Fuhara, Jabalpur Multi-Floor Store',
      href: '#walkthrough',
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0909]/95 backdrop-blur-md border-b border-[#B89A5A]/25 shadow-2xl text-[#F4EEE4]'
            : 'bg-[#0A0909]/80 backdrop-blur-sm border-b border-white/10 text-[#F4EEE4]'
        }`}
      >
        {/* Main 3-Zone Top Bar Contract */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Zone 1: Royal Brand Wordmark */}
          <a href="#home" className="group flex items-center gap-3">
            <BrandLogo
              variant="horizontal"
              lang={lang}
              isDarkSurface={true}
            />
          </a>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-medium text-[#F4EEE4]/90">
            <a
              href="#showroom-floor"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'शोरूम फ्लोर' : 'Showroom'}
            </a>
            <a
              href="#bridal-edit"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'ब्राइडल' : 'Bridal'}
            </a>
            <a
              href="#groom-edit"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'ग्रूम्स' : 'Groom'}
            </a>
            <a
              href="#family-wedding"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'फैमिली' : 'Family'}
            </a>
            <a
              href="#occasions"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'ऑकेजन' : 'Occasions'}
            </a>
            <a
              href="#digital-rack"
              className="hover:text-[#D1B875] transition-colors whitespace-nowrap"
            >
              {lang === 'hi' ? 'द रैक' : 'The Rack'}
            </a>
          </nav>

          {/* Zone 3: 1-2 Primary Actions + Language Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Showroom Directory Trigger */}
            <button
              onClick={() => setDirectoryOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium border border-[#B89A5A]/40 text-[#F4EEE4] hover:bg-[#181516] hover:border-[#D1B875] transition-all cursor-pointer"
              title="Open Showroom Directory"
            >
              <Compass className="w-3.5 h-3.5 text-[#B89A5A]" />
              <span>{lang === 'hi' ? 'निर्देशिका' : 'Directory'}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-none p-0.5 text-[11px] font-semibold border bg-[#121011] border-white/10 text-[#F4EEE4]">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#4A1724] text-[#F4EEE4] shadow-xs'
                    : 'text-[#BDB3A5] hover:text-[#F4EEE4]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 transition-colors cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-[#4A1724] text-[#F4EEE4] shadow-xs'
                    : 'text-[#BDB3A5] hover:text-[#F4EEE4]'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Primary Action: Book Consultation */}
            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#F4EEE4] bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 transition-all duration-200 shadow-lg cursor-pointer whitespace-nowrap"
            >
              {lang === 'hi' ? 'परामर्श बुक करें' : 'Book Visit'}
            </button>

            {/* Admin Key */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#BDB3A5] hover:text-[#D1B875] transition-colors cursor-pointer"
              title="Staff & Management Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#F4EEE4] hover:text-[#D1B875] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#121011] text-[#F4EEE4] border-t border-[#B89A5A]/25 px-6 py-6 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-3 text-sm font-medium tracking-wide">
              {departments.map((dept) => (
                <a
                  key={dept.num}
                  href={dept.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#D1B875] transition-colors"
                >
                  <span className="font-semibold">{dept.title}</span>
                  <span className="text-[10px] text-[#B89A5A] tracking-widest uppercase">
                    {dept.num} →
                  </span>
                </a>
              ))}
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3 px-4 text-xs font-semibold tracking-[0.2em] uppercase text-[#F4EEE4] bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 text-center"
              >
                {lang === 'hi' ? 'परामर्श बुक करें' : 'Book Showroom Visit'}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-xs font-semibold text-center text-emerald-300 bg-[#0F2318] hover:bg-[#173625] border border-emerald-700/50 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'व्हाट्सएप चैट' : 'WhatsApp Consultation'}</span>
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-[11px] font-semibold text-[#F4EEE4] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#D1B875]" />
                  <span>Instagram</span>
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-[11px] font-semibold text-[#F4EEE4] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Showroom Directory Mega Modal */}
      {directoryOpen && (
        <div
          role="dialog"
          aria-label="Shree Vijay Showroom Directory"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setDirectoryOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#121011] text-[#F4EEE4] border border-[#B89A5A]/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#B89A5A]/20">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold">
                  {lang === 'hi' ? 'डिजिटल वॉकथ्रू' : 'Digital Walkthrough'}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] mt-0.5">
                  {lang === 'hi' ? 'शोरूम फ्लोर निर्देशिका' : 'Showroom Department Directory'}
                </h3>
              </div>
              <button
                onClick={() => setDirectoryOpen(false)}
                className="p-2 text-[#BDB3A5] hover:text-[#F4EEE4] hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close directory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {departments.map((dept) => (
                <a
                  key={dept.num}
                  href={dept.href}
                  onClick={() => setDirectoryOpen(false)}
                  className="group flex items-start gap-4 p-4 bg-[#181516] hover:bg-[#201C1E] border border-white/5 hover:border-[#B89A5A]/50 transition-all duration-200"
                >
                  <span className="font-display text-lg text-[#B89A5A] font-semibold mt-0.5">
                    {dept.num}
                  </span>
                  <div className="flex-1">
                    <div className="font-display text-base font-bold text-[#F4EEE4] group-hover:text-[#D1B875] flex items-center justify-between transition-colors">
                      <span>{dept.title}</span>
                      <span className="text-[#B89A5A] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-[#BDB3A5] mt-1 line-clamp-1">{dept.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#B89A5A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BDB3A5]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B89A5A]" />
                <span>26/1 Bada Fuhara, Garha Phatak Road, Jabalpur (M.P.)</span>
              </div>
              <button
                onClick={() => {
                  setDirectoryOpen(false);
                  onOpenEnquiry();
                }}
                className="px-5 py-2 text-xs uppercase tracking-widest font-semibold text-[#F4EEE4] bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Showroom Trial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

