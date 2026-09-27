import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';
import { submitEnquiry } from '../lib/api.ts';
import showroomImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';

interface ContactSectionProps {
  lang: Language;
  settings?: WebsiteSettings;
  onOpenEnquiry?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  settings,
}) => {
  const t = translations[lang];
  const phone = settings?.phone || '089898 92476';
  const whatsappNumber = settings?.whatsapp_number || '918989892476';
  const mapUrl = 'https://maps.google.com/?q=5WGJ%2B4G+Jabalpur';

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    occasion: 'Wedding',
    category: 'Bridal Lehenga',
    visit_date: '',
    preferred_contact: 'WhatsApp' as 'WhatsApp' | 'Call' | 'Showroom Visit',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryCode, setEnquiryCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.customer_name.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का फोन नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitEnquiry({
        customer_name: formData.customer_name,
        phone: formData.phone,
        preferred_contact: formData.preferred_contact,
        product_name: `${formData.category} (${formData.occasion})`,
        message: `Occasion: ${formData.occasion}, Category: ${formData.category}. ${formData.message}`,
        quantity: 1,
      });
      setEnquiryCode(res.enquiry_code);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="visit" className="py-20 lg:py-28 bg-[#0A0909] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Destination Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#D1B875]" />
            <span>{lang === 'hi' ? 'शोरूम पधारें' : 'FINAL DESTINATION'}</span>
            <MapPin className="w-3.5 h-3.5 text-[#D1B875]" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4]">
            {lang === 'hi' ? 'प्रत्यक्ष पधारें, भव्यता अनुभव करें' : 'Come See It In Person.'}
          </h2>

          <p className="font-editorial italic text-base sm:text-lg text-[#D1B875] mt-2">
            {lang === 'hi'
              ? 'बड़ा फुहारा, गढ़ा फाटक रोड, जबलपुर स्थित हमारे बहुमंजिला स्टोर में आपका सप्रेम स्वागत है।'
              : 'Step into our landmark multi-floor showroom at Bada Fuhara, Jabalpur for personal trials and royal hospitality.'}
          </p>
        </div>

        {/* Showroom Destination Hero Spread */}
        <div className="relative rounded-xs overflow-hidden border border-[#B89A5A]/30 shadow-2xl mb-16 bg-[#121011]">
          <div className="aspect-[16/7] sm:aspect-[16/6] w-full overflow-hidden relative">
            <img
              src={showroomImg}
              alt="Shree Vijay Showroom Bada Fuhara Jabalpur"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909]/95 via-transparent to-black/40 pointer-events-none" />

            <div className="absolute bottom-6 left-6 sm:left-10 right-6 text-[#F4EEE4] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#B89A5A] font-semibold block">
                  FLAGSHIP STORE · JABALPUR
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4EEE4] mt-0.5">
                  Shree Vijay Showroom
                </h3>
                <p className="text-xs text-[#BDB3A5] mt-1 font-light max-w-md">
                  Infront of Jain Dairy, Garha Phatak Road, Bada Fuhara, Jabalpur (M.P.)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#F4EEE4] text-[#0A0909] hover:bg-[#D1B875] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'दिशानिर्देश (गूगल मैप)' : 'Get Directions'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="px-5 py-2.5 bg-[#4A1724] text-[#F4EEE4] hover:bg-[#351019] border border-[#B89A5A]/60 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Column: Showroom Vital Info vs Personal Consultation Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Landmark Details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 bg-[#181516] border border-white/10 space-y-4">
              <h3 className="font-display text-xl font-bold text-[#F4EEE4] border-b border-white/10 pb-3">
                {lang === 'hi' ? 'शोरूम की जानकारी' : 'Flagship Store Sanctuary'}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D1B875] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4EEE4] block">Full Address:</span>
                    <span className="text-[#BDB3A5]">
                      Shree Vijay Showroom, 26/1 Garha Phatak Road, Infront of Jain Dairy, Bada Fuhara, Jabalpur, Madhya Pradesh 482002
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D1B875] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4EEE4] block">Showroom Timings:</span>
                    <span className="text-[#BDB3A5]">10:30 AM – 10:00 PM (Open All 7 Days)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D1B875] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4EEE4] block">Phone & Desk:</span>
                    <span className="text-[#BDB3A5] font-mono">{phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#181516] border border-white/10">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#B89A5A] mb-2">
                {lang === 'hi' ? 'निःशुल्क विशेष सुविधाएं' : 'Exclusive In-Store Amenities'}
              </h4>
              <ul className="text-xs text-[#BDB3A5] space-y-2">
                <li>✓ Dedicated private bridal mirror suite & family lounge</li>
                <li>✓ On-site master tailoring for alterations & custom blouse cuts</li>
                <li>✓ Professional groom pagdi/turban tying & stole coordination</li>
                <li>✓ Direct manufacturer rates with 100% genuine silk certification</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Personal Trial Booking Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#181516] border border-[#B89A5A]/30 shadow-xl text-left">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block">
                  BESPOKE ASSISTANCE
                </span>
                <h3 className="font-display text-2xl font-bold text-[#F4EEE4] mt-1">
                  {lang === 'hi' ? 'व्यक्तिगत ट्रायल व परामर्श बुक करें' : 'Book a Personal Bridal/Wedding Trial'}
                </h3>
                <p className="text-xs text-[#BDB3A5] mt-1 font-light">
                  {lang === 'hi'
                    ? 'अपनी पसंदीदा तारीख और परिधान श्रेणी चुनें, हमारे मुख्य स्टाइलिस्ट आपके लिए विशिष्ट कलेक्शन तैयार रखेंगे।'
                    : 'Select your preferred date & ensemble category. Our senior stylists will keep curated options ready for your arrival.'}
                </p>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#D1B875] mx-auto" />
                  <h4 className="font-display text-2xl font-bold text-[#F4EEE4]">
                    {lang === 'hi' ? 'परामर्श सफलतापूर्वक बुक हुआ' : 'Consultation Booked Successfully'}
                  </h4>
                  <p className="text-xs text-[#BDB3A5] max-w-md mx-auto">
                    {lang === 'hi'
                      ? 'धन्यवाद! आपके अनुरोध का संदर्भ कोड नीचे है। हमारी टीम आपसे शीघ्र संपर्क करेगी।'
                      : 'Thank you! Your consultation reference code is generated below. Our bridal coordinator will connect with you.'}
                  </p>
                  <div className="inline-block py-2 px-4 bg-[#121011] border border-[#B89A5A]/40 font-mono text-sm text-[#F4EEE4]">
                    CODE: {enquiryCode}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                        {lang === 'hi' ? 'आपका नाम *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        placeholder="e.g. Radhika Sharma"
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                        {lang === 'hi' ? 'फोन नंबर (व्हाट्सएप) *' : 'Mobile / WhatsApp Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit number"
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                        {lang === 'hi' ? 'अवसर / सेरेमनी' : 'Occasion'}
                      </label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="Wedding / Mandap">Wedding / Mandap</option>
                        <option value="Royal Reception">Royal Reception</option>
                        <option value="Sangeet Twirl">Sangeet Twirl</option>
                        <option value="Haldi & Mehendi">Haldi & Mehendi</option>
                        <option value="Complete Family Wedding">Complete Family Wedding</option>
                        <option value="Festive & Puja">Festive & Puja</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                        {lang === 'hi' ? 'परिधान श्रेणी' : 'Ensemble Category'}
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="Bridal Lehenga">Bridal Lehenga</option>
                        <option value="Groom Royal Sherwani">Groom Royal Sherwani</option>
                        <option value="Pure Banarasi Silk Saree">Pure Banarasi Silk Saree</option>
                        <option value="Jodhpuri & Bandhgala Suit">Jodhpuri & Bandhgala Suit</option>
                        <option value="Reception Evening Gown">Reception Evening Gown</option>
                        <option value="Family Coordination Sets">Family Coordination Sets</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                      {lang === 'hi' ? 'संपर्क का पसंदीदा माध्यम' : 'Preferred Communication'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['WhatsApp', 'Call', 'Showroom Visit'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferred_contact: method })}
                          className={`py-2 text-xs font-semibold transition-colors cursor-pointer border ${
                            formData.preferred_contact === method
                              ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A]'
                              : 'bg-[#121011] text-[#BDB3A5] border-white/10 hover:border-white/30'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                      {lang === 'hi' ? 'विशेष आवश्यकता या संदेश' : 'Special Preferences or Notes'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Looking for pure velvet crimson lehenga with double dupatta..."
                      className="w-full px-3.5 py-2 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting
                      ? lang === 'hi'
                        ? 'पंजीकरण हो रहा है...'
                        : 'Submitting Request...'
                      : lang === 'hi'
                      ? 'परामर्श हेतु अनुरोध भेजें'
                      : 'Request Personal Showroom Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
