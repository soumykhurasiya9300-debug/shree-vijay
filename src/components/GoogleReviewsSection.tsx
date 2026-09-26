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
    <section id="reviews" className="py-16 sm:py-24 bg-[#F7F4EE] border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B48448] font-semibold block mb-2">
            {lang === 'hi' ? 'गूगल सत्यापित समीक्षाएं' : 'VERIFIED GOOGLE REVIEWS'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-[#1C1611]">
            {t.sections.reviewsTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6E6356]">
            {t.sections.reviewsSubtitle}
          </p>
        </div>

        {/* Aggregate Score Card with Gemini Summary */}
        <div className="bg-white border border-[#E8DFD3] rounded-sm p-6 sm:p-8 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Rating Number */}
            <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#E8DFD3] pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-5xl font-bold font-display text-[#1C1611]">4.8</span>
                <div className="flex flex-col text-left">
                  <div className="flex items-center text-[#B48448]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#7A6E5F] mt-0.5 font-medium">
                    (987 Reviews on Google)
                  </span>
                </div>
              </div>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
                #1 Rated Wedding Store in Jabalpur
              </span>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <a
                  href="https://maps.google.com/?q=5WGJ%2B4G+Jabalpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#1C1611] hover:bg-[#B48448] text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E0B97B]" />
                  <span>{t.reviews.directionsBtn}</span>
                </a>
                <a
                  href="tel:08989892476"
                  className="px-4 py-2.5 bg-[#F7F4EE] hover:bg-[#EAE2D5] text-[#1C1611] text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#D8CEBE] flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.reviews.callBtn}</span>
                </a>
              </div>
            </div>

            {/* AI Review Summary (From Google Maps Gemini synthesis) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B48448] uppercase tracking-wider">
                <MessageSquareQuote className="w-4 h-4" />
                <span>Google Review Synthesis · What Jabalpur Says</span>
              </div>
              <p className="text-sm sm:text-base text-[#4A4036] leading-relaxed italic font-editorial">
                "{t.reviews.summaryText}"
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#7A6E5F]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sarees: 78+ mentions
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kurtas & Sherwani: 61+ mentions
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bridal Lehengas: 35+ mentions
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
              className="bg-white border border-[#E8DFD3] rounded-sm p-6 flex flex-col justify-between hover:border-[#B48448] transition-colors"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1611]">{rev.author}</h4>
                    <span className="text-[11px] text-[#8A7D6F] block">{rev.stats}</span>
                  </div>
                  <div className="flex text-[#B48448]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-[#4A4036] leading-relaxed italic">
                  "{rev.content}"
                </p>
              </div>

              {/* Owner Response */}
              <div className="mt-5 pt-3 border-t border-[#F0E8DC] bg-[#FAF8F5] -mx-6 -mb-6 p-4 rounded-b-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B48448] block mb-0.5">
                  Response from Owner
                </span>
                <p className="text-[11px] text-[#6E6356] line-clamp-2">
                  {rev.ownerResponse}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
