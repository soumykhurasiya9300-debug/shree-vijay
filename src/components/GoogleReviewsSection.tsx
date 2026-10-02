import React from 'react';
import { Star, MapPin, Phone, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';

interface GoogleReviewsSectionProps {
  lang: Language;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const realReviews = [
    {
      author: 'Ramkesh Sahu',
      stats: '2 reviews · 5 photos',
      date: 'a month ago',
      rating: 5,
      content:
        'Meri saas ko cotton saree pasand hai aur yahan pe sach mein pure cotton mila. Ajkal synthetic mix bahut milta hai par yahan genuine quality hai. Shree Vijay Showroom is trustworthy.',
      tag: 'Cotton Sarees',
      ownerResponse:
        'Hi Ramkesh Sahu, Greetings from Shree Vijay Showroom! We sincerely appreciate your kind feedback. Thank you for your positive review.',
    },
    {
      author: 'Aryan Patel',
      stats: '1 review · 1 photo',
      date: 'a month ago',
      rating: 5,
      content:
        'Shree Vijay Showroom is the best place for family ethnic wear shopping in Jabalpur. Everyone finds something they love. Quality is excellent and staff is very helpful. Highly recommend.',
      tag: 'Family Ethnic Shopping',
      ownerResponse:
        'Hi Aryan Patel, Greetings from Shree Vijay Showroom! Amazing feedback, thank you for trusting us for your family shopping.',
    },
    {
      author: 'Sarika Kanojiya',
      stats: '1 review · 1 photo',
      date: 'a month ago',
      rating: 5,
      content:
        'Jabalpur mein ladies clothing ke liye ek consistent place chahiye tha. Yahan aakar laga sahi jagah mili. Salwar suit li, quality pe genuinely satisfied hoon. Aaungi dobara.',
      tag: 'Salwar Suits & Fitting',
      ownerResponse:
        'Hi Sarika Kanojiya, Greetings from Shree Vijay Showroom! We are thrilled to know you loved the suit fitting. Looking forward to welcoming you again!',
    },
  ];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block mb-2">
            {lang === 'hi' ? 'गूगल सत्यापित समीक्षाएं' : 'VERIFIED GOOGLE REVIEWS'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#F4EEE4]">
            {t.sections.reviewsTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#BDB3A5] font-light max-w-2xl mx-auto">
            {t.sections.reviewsSubtitle}
          </p>
        </div>

        {/* Aggregate Score Card with Synthesis */}
        <div className="bg-[#181516] border border-[#B89A5A]/30 rounded-xs p-6 sm:p-8 shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Rating Number & Quick Actions */}
            <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="text-5xl font-bold font-display text-[#F4EEE4]">4.9</span>
                <div className="flex flex-col text-left">
                  <div className="flex items-center text-[#D1B875]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#BDB3A5] mt-1 font-mono">
                    980+ Verified Google Ratings
                  </span>
                </div>
              </div>
              <div className="mt-3 text-xs text-[#D1B875] tracking-wide font-medium">
                #1 Rated Wedding Showroom in Jabalpur
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <a
                  href="https://maps.google.com/?q=5WGJ%2B4G+Jabalpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D1B875]" />
                  <span>{t.reviews.directionsBtn}</span>
                </a>
                <a
                  href="tel:08989892476"
                  className="px-4 py-2.5 bg-transparent hover:bg-white/5 text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider border border-white/15 hover:border-[#B89A5A]/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B89A5A]" />
                  <span>{t.reviews.callBtn}</span>
                </a>
              </div>
            </div>

            {/* AI Review Summary */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B89A5A] uppercase tracking-wider">
                <MessageSquareQuote className="w-4 h-4 text-[#D1B875]" />
                <span>Google Review Synthesis · What Jabalpur Says</span>
              </div>
              <p className="text-sm sm:text-base text-[#F4EEE4]/90 leading-relaxed italic font-editorial">
                "{t.reviews.summaryText}"
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#BDB3A5]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D1B875]" /> Pure Sarees: 78+ mentions
                </span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D1B875]" /> Kurtas & Sherwani: 61+ mentions
                </span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D1B875]" /> Bridal Lehengas: 35+ mentions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Customer Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {realReviews.map((rev, index) => (
            <div
              key={index}
              className="bg-[#181516] border border-white/10 hover:border-[#B89A5A]/50 transition-colors p-6 flex flex-col justify-between text-left rounded-xs shadow-md"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {/* H3 maintains clean document outline following H2 (Fix for Issue 15) */}
                    <h3 className="font-display font-bold text-sm text-[#F4EEE4]">
                      {rev.author}
                    </h3>
                    <span className="text-xs text-[#BDB3A5] block font-mono">
                      {rev.stats}
                    </span>
                  </div>
                  <div className="flex items-center text-[#D1B875]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#BDB3A5] font-light leading-relaxed mb-4">
                  "{rev.content}"
                </p>
              </div>

              {/* Tag & Response */}
              <div className="pt-3 border-t border-white/10 text-xs">
                <span className="text-[#B89A5A] uppercase tracking-wider font-semibold block mb-1">
                  Verified for: {rev.tag}
                </span>
                {/* 12px body copy ensures readability (Fix for Issue 13) */}
                <p className="text-[#BDB3A5] text-xs italic">
                  Owner response: {rev.ownerResponse}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
