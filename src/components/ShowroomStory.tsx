import React from 'react';
import { Award, Scissors, Sparkles, HeartHandshake, History } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import showroomImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';
import sareeImg from '../assets/images/designer_banarasi_saree_1790317467169.jpg';

interface ShowroomStoryProps {
  lang: Language;
}

export const ShowroomStory: React.FC<ShowroomStoryProps> = ({ lang }) => {
  const milestones = [
    {
      step: '01',
      period: '1990s',
      title: lang === 'hi' ? 'द बिगिनिंग · बड़ा फुहारा' : 'The Beginning · Bada Fuhara',
      desc: lang === 'hi'
        ? 'जबलपुर के हृदय स्थल बड़ा फुहारा में एक छोटी सी दुकान के रूप में शुरुआत, जहाँ शुद्ध कॉटन और बनारसी साड़ियों की साख स्थापित हुई।'
        : 'Founded in the heritage heart of Jabalpur at Bada Fuhara, built on an uncompromising pledge of pure fabrics and honest pricing.',
    },
    {
      step: '02',
      period: '2000s',
      title: lang === 'hi' ? 'द जर्नी · बुनकर साझीदारी' : 'The Journey · Direct Weaver Guilds',
      desc: lang === 'hi'
        ? 'वाराणसी, चंदेरी और कांजीवरम के पारंपरिक बुनकर परिवारों के साथ सीधा गठजोड़, जिससे बिचौलियों के बिना उच्चतम गुणवत्ता उपलब्ध हुई।'
        : 'Formed direct partnerships with generational weaving clusters across Varanasi and Chanderi, eliminating middlemen.',
    },
    {
      step: '03',
      period: '2010s',
      title: lang === 'hi' ? 'द शोरूम · बहुमंजिला एम्पोरियम' : 'The Showroom · Multi-Floor Flagship',
      desc: lang === 'hi'
        ? 'गढ़ा फाटक रोड पर भव्य बहुमंजिला शोरूम का विस्तार — ब्राइडल लाउंज, दूल्हा संग्रह और ऑन-साइट मास्टर टेलरिंग की शुरुआत।'
        : 'Expanded into our iconic multi-floor landmark with private bridal trials, dedicated groom’s lounge, and master ateliers.',
    },
    {
      step: '04',
      period: 'TODAY',
      title: lang === 'hi' ? 'टुडे · महाकौशल का गौरव' : 'Today · Mahakaushal’s Pride',
      desc: lang === 'hi'
        ? 'तीन दशकों के विश्वास के साथ, 980+ सत्यापित 4.9★ गूगल समीक्षाओं के संग हजारों विवाहों का अविस्मरणीय परिधान साथी।'
        : 'Three decades later, trusted by third-generation families with 980+ verified 4.9★ reviews across Central India.',
    },
  ];

  return (
    <section
      id="story"
      className="py-20 lg:py-28 bg-[#2A0A12] text-[#F7F2EA] border-b border-[#B89455]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Brand Narrative Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89455] font-semibold mb-3">
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'धरोहर एवं विश्वास' : 'HERITAGE & LEGACY'}</span>
            <History className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F2EA] leading-[1.08]">
            {lang === 'hi' ? (
              <>
                उत्सवों को संवारने के <br />
                <span className="font-editorial italic font-normal text-[#EAD8BF]">
                  तीस से अधिक स्वर्णिम वर्ष।
                </span>
              </>
            ) : (
              <>
                30+ YEARS OF <br />
                <span className="font-editorial italic font-normal text-[#EAD8BF]">
                  DRESSING CELEBRATIONS.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#D8C8B5]/85 font-light max-w-2xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'जबलपुर के बड़ा फुहारा में पीढ़ियों का विश्वास। दादी की शादी की कांजीवरम से लेकर आज की दुल्हन के जरदोजी लहंगे तक।'
              : 'From grandmother’s heirloom bridal silk saree to today’s daughter’s reception velvet — three decades of dressing Jabalpur’s most sacred milestones.'}
          </p>
        </div>

        {/* Cinematic Dual Imagery Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] overflow-hidden border border-[#B89455]/40 shadow-2xl bg-black">
              <img
                src={showroomImg}
                alt="Shree Vijay Showroom Heritage"
                className="w-full h-full object-cover filter brightness-[0.88] hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B89455] font-semibold block">
                    BADA FUHARA LANDMARK
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {lang === 'hi' ? 'श्री विजय शोरूम, जबलपुर' : 'Shree Vijay Showroom, Jabalpur'}
                  </h3>
                </div>
                <span className="text-xs text-[#D8C8B5]/80 font-mono">EST. 1990</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] overflow-hidden border border-[#B89455]/40 shadow-2xl bg-black">
              <img
                src={sareeImg}
                alt="Handcrafted Weaves"
                className="w-full h-full object-cover filter brightness-[0.85] hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#B89455] font-semibold block">
                  HEREDITARY WEAVING CLUSTERS
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  {lang === 'hi' ? 'असली रेशम एवं जरी की प्रामाणिकता' : 'Pure Silks & Genuine Gold Zari'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Horizontal Timeline (The Beginning → The Journey → The Showroom → Today) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((item) => (
            <div
              key={item.step}
              className="p-6 bg-white/5 border border-white/10 hover:border-[#B89455]/70 transition-all duration-300 relative text-left group"
            >
              <div className="flex items-center justify-between text-[#B89455] font-mono text-xs font-bold mb-3 pb-2 border-b border-white/10">
                <span>{item.period}</span>
                <span className="text-[#D8C8B5]/50 group-hover:text-[#B89455]">{item.step}</span>
              </div>

              <h4 className="font-display text-base font-bold text-[#F7F2EA] group-hover:text-white mb-2">
                {item.title}
              </h4>

              <p className="text-xs text-[#D8C8B5]/80 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
