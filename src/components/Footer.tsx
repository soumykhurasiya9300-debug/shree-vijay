import React from 'react';
import { Instagram, Facebook, MessageCircle, MapPin, Shield, Play, Youtube } from 'lucide-react';
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
  const youtubeUrl = settings?.youtube_url || 'https://www.youtube.com/channel/UCRSKEwjmz4xltTpOoubrLJw';
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || '918989892476'}`;
  const linkedinUrl = 'https://www.linkedin.com/company/shree-vijay-showroom';

  return (
    <footer className="bg-[#0A0909] text-[#F4EEE4] border-t border-[#B89A5A]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Headline Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-white/10 gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89A5A] font-semibold block mb-2">
              JABALPUR · EST. 1990
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-[0.12em] text-[#F4EEE4] uppercase">
              SHREE VIJAY
            </h2>
            <p className="font-editorial text-lg sm:text-xl text-[#D1B875] italic mt-1">
              The Wedding House of Jabalpur
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#BDB3A5]">
            <a
              href="https://maps.google.com/?q=5WGJ%2B4G+Jabalpur"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4EEE4] transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B89A5A]" />
              <span>Bada Fuhara, Jabalpur</span>
            </a>
            <span className="opacity-30">·</span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hover:text-[#F4EEE4] transition-colors text-[#D1B875]"
            >
              {phone}
            </a>
            <span className="opacity-30">·</span>
            <span className="text-[#BDB3A5]/80">Open 7 Days (10:30 AM – 10:00 PM)</span>
          </div>
        </div>

        {/* Clean 4-Column Minimal Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs text-left">
          {/* Departments */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89A5A] mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-[#BDB3A5] font-light">
              <li>
                <a href="#bridal-edit" className="hover:text-[#F4EEE4] transition-colors">
                  The Bridal Suite
                </a>
              </li>
              <li>
                <a href="#groom-edit" className="hover:text-[#F4EEE4] transition-colors">
                  The Groom's Lounge
                </a>
              </li>
              <li>
                <a href="#showroom-floor" className="hover:text-[#F4EEE4] transition-colors">
                  Pure Banarasi Sarees
                </a>
              </li>
              <li>
                <a href="#family-wedding" className="hover:text-[#F4EEE4] transition-colors">
                  Family Wedding Ensembles
                </a>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89A5A] mb-3">
              Occasions
            </h4>
            <ul className="space-y-2 text-[#BDB3A5] font-light">
              <li>
                <a href="#occasions" className="hover:text-[#F4EEE4] transition-colors">
                  Haldi & Mehendi
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-[#F4EEE4] transition-colors">
                  Sangeet Twirl
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-[#F4EEE4] transition-colors">
                  Wedding Mandap
                </a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-[#F4EEE4] transition-colors">
                  Royal Reception
                </a>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89A5A] mb-3">
              Experience
            </h4>
            <ul className="space-y-2 text-[#BDB3A5] font-light">
              <li>
                <a href="#digital-rack" className="hover:text-[#F4EEE4] transition-colors">
                  The Digital Rack
                </a>
              </li>
              <li>
                <a href="#walkthrough" className="hover:text-[#F4EEE4] transition-colors">
                  Showroom Walkthrough
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-[#F4EEE4] transition-colors">
                  30+ Years Heritage
                </a>
              </li>
              <li>
                <a href="#visit" className="hover:text-[#F4EEE4] transition-colors">
                  Visit Showroom
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B89A5A] mb-3">
              Connect
            </h4>
            <div id="SocailIcons" className="pt-2 pb-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icons instaIcon"
                aria-label="Instagram"
              >
                <p className="iconName">Instagram</p>
                <div className="icon insta">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-800 dark:text-white"
                  >
                    <path
                      clipRule="evenodd"
                      d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                      fillRule="evenodd"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icons linkedin"
                aria-label="LinkedIn"
              >
                <p className="iconName">Linkedin</p>
                <div className="icon link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <circle cx="4.983" cy="5.009" r="2.188" fill="currentColor"></circle>
                    <path
                      d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icons whatsapp"
                aria-label="WhatsApp"
              >
                <p className="iconName">WhatsApp</p>
                <div className="icon whats">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icons youtube"
                aria-label="YouTube"
              >
                <p className="iconName">YouTube</p>
                <div className="icon tube">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path
                      d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </a>
            </div>
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="text-[11px] text-[#B89A5A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#D1B875]" />
                <span>Replay Brand Intro</span>
              </button>
            )}
          </div>
        </div>

        {/* Thin Divider & Bottom Metadata */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BDB3A5]/60 font-light">
          <div>
            © {new Date().getFullYear()} Shree Vijay Showroom, Jabalpur. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>26/1 Garha Phatak Road, Jabalpur (M.P.)</span>
            <span className="opacity-30">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#BDB3A5]/50 hover:text-[#B89A5A] transition-colors flex items-center gap-1 cursor-pointer"
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
