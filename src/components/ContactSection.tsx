import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';
import { submitEnquiry } from '../lib/api.ts';
import showroomImg from '../assets/images/showroom_interior_ambiance_1790317495781.jpg';

interface ContactSectionProps {
  lang: Language;
  settings?: WebsiteSettings;
  onOpenEnquiry: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  settings,
  onOpenEnquiry,
}) => {
  const phone = settings?.phone || '089898 92476';
  const whatsappNumber = settings?.whatsapp_number || '918989892476';
  const address =
    lang === 'hi'
      ? settings?.address_hi ||
        '२६/१, श्री विजय शोरूम, जैन डेयरी के सामने, गढ़ा फाटक रोड, फुहारा रोड, बड़ा, जबलपुर, मध्य प्रदेश ४८२००२'
      : settings?.address ||
        '26/1, Shree Vijay Showroom Infront of Jain Dairy Garha Phatak Road, Fuhara Rd, Bada, Jabalpur, Madhya Pradesh 482002';

  const mapUrl = 'https://maps.google.com/?q=5WGJ%2B4G+Jabalpur';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Namaste Shree Vijay Showroom Jabalpur, I am planning a visit to your showroom. Please guide me.'
  )}`;

  // Inline Consultation Form
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    occasion: 'Wedding',
    category: 'Bridal Lehenga',
    preferred_contact: 'Showroom Visit' as 'WhatsApp' | 'Call' | 'Showroom Visit',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryCode, setEnquiryCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || formData.phone.trim().length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना नाम एवं मान्य १० अंकों का फोन नंबर भरें।' : 'Please enter your name and 10-digit phone number.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
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
    <section id="visit" className="py-20 lg:py-28 bg-[#F7F2EA] text-[#211A18] border-b border-[#B89455]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Destination Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89455] font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'शोरूम पधारें' : 'FINAL DESTINATION'}</span>
            <MapPin className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#4A101C]">
            {lang === 'hi' ? 'प्रत्यक्ष पधारें, भव्यता अनुभव करें' : 'Come See It In Person.'}
          </h2>

          <p className="font-editorial italic text-base sm:text-lg text-[#756A63] mt-2">
            {lang === 'hi'
              ? 'बड़ा फुहारा, गढ़ा फाटक रोड, जबलपुर स्थित हमारे बहुमंजिला स्टोर में आपका सप्रेम स्वागत है।'
              : 'Step into our landmark multi-floor showroom at Bada Fuhara, Jabalpur for personal trials and royal hospitality.'}
          </p>
        </div>

        {/* Showroom Destination Hero Spread */}
        <div className="relative rounded-none overflow-hidden border-2 border-[#B89455]/40 shadow-2xl mb-16 bg-[#2A0A12]">
          <div className="aspect-[16/7] sm:aspect-[16/6] w-full overflow-hidden relative">
            <img
              src={showroomImg}
              alt="Shree Vijay Showroom Bada Fuhara Jabalpur"
              className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A12] via-transparent to-black/30 pointer-events-none" />

            <div className="absolute bottom-6 left-6 sm:left-10 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#B89455] font-semibold block">
                  FLAGSHIP STORE · JABALPUR
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                  Shree Vijay Showroom
                </h3>
                <p className="text-xs text-[#D8C8B5] mt-1 font-light max-w-md">
                  Infront of Jain Dairy, Garha Phatak Road, Bada Fuhara, Jabalpur (M.P.)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#F7F2EA] text-[#2A0A12] hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-1.5"
                >
                  <span>{lang === 'hi' ? 'दिशानिर्देश (गूगल मैप)' : 'Get Directions'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="px-5 py-2.5 bg-[#4A101C] text-white hover:bg-[#340B13] border border-[#B89455]/60 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Booking Consultation Form & Interactive Map Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: "LET'S FIND YOUR LOOK" Consultation Booking */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 border border-[#B89455]/30 shadow-xl text-left">
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#B89455] font-semibold block mb-1">
                {lang === 'hi' ? 'व्यक्तिगत स्टाइलिंग अपॉइंटमेंट' : 'BESPOKE STYLING APPOINTMENT'}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#4A101C]">
                {lang === 'hi' ? 'आइए, आपका परफेक्ट लुक खोजें' : "Let's Find Your Look."}
              </h3>
              <p className="text-xs text-[#756A63] mt-1 font-light">
                {lang === 'hi'
                  ? 'अपनी पसंद बताएं — हमारे मास्टर स्टाइलिस्ट ट्रायल रूम तैयार रखेंगे।'
                  : 'Tell us your occasion and preferences. Our showroom stylists will keep curated options ready for your arrival.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#EDE2D2]/40 border border-[#B89455]/50 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#B89455] mx-auto" />
                <h4 className="font-display text-xl font-bold text-[#4A101C]">
                  {lang === 'hi' ? 'आपका अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'YOUR ENQUIRY HAS BEEN RECEIVED.'}
                </h4>
                <p className="text-xs text-[#756A63] max-w-sm mx-auto leading-relaxed">
                  {lang === 'hi'
                    ? `हम आपको आपके परिधान चयन में सहायता करने के लिए उत्सुक हैं। अनुरोध कोड: ${enquiryCode}`
                    : `We look forward to helping you find your perfect look. Your Showroom Priority Code: ${enquiryCode}`}
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Showroom Directly</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                      {lang === 'hi' ? 'आपका नाम *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EA] border border-[#B89455]/30 focus:border-[#4A101C] text-xs text-[#211A18] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                      {lang === 'hi' ? 'व्हाट्सएप / फोन नंबर *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98989 24760"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EA] border border-[#B89455]/30 focus:border-[#4A101C] text-xs text-[#211A18] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                      {lang === 'hi' ? 'विवाह अनुष्ठान / अवसर' : 'Occasion'}
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EA] border border-[#B89455]/30 focus:border-[#4A101C] text-xs text-[#211A18] focus:outline-none"
                    >
                      <option value="Wedding">Wedding Mandap (फेरे)</option>
                      <option value="Reception">Royal Reception</option>
                      <option value="Sangeet">Sangeet Night</option>
                      <option value="Haldi">Haldi & Mehendi</option>
                      <option value="Family">Family Ensemble</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                      {lang === 'hi' ? 'प्राथमिक श्रेणी' : 'Preferred Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F7F2EA] border border-[#B89455]/30 focus:border-[#4A101C] text-xs text-[#211A18] focus:outline-none"
                    >
                      <option value="Bridal Lehenga">Bridal Lehenga</option>
                      <option value="Groom Sherwani">Groom's Sherwani</option>
                      <option value="Banarasi Silk Saree">Pure Banarasi Silk Saree</option>
                      <option value="Indo-Western">Indo-Western & Tuxedo</option>
                      <option value="Complete Family">Complete Family Shopping</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                    {lang === 'hi' ? 'परामर्श माध्यम' : 'Consultation Preference'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['Showroom Visit', 'WhatsApp', 'Call'] as const).map((pref) => (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => setFormData({ ...formData, preferred_contact: pref })}
                        className={`py-2 px-1 text-center border font-medium cursor-pointer ${
                          formData.preferred_contact === pref
                            ? 'bg-[#4A101C] text-white border-[#4A101C]'
                            : 'bg-[#F7F2EA] text-[#756A63] border-[#B89455]/30 hover:bg-[#EDE2D2]'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A101C] mb-1">
                    {lang === 'hi' ? 'विवाह तिथि व विशेष आवश्यकता (ऐच्छिक)' : 'Wedding Date & Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wedding on 18 Nov, need matching maroon safa and bridal dupatta."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F7F2EA] border border-[#B89455]/30 focus:border-[#4A101C] text-xs text-[#211A18] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#4A101C] hover:bg-[#340B13] text-[#F7F2EA] text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? lang === 'hi'
                      ? 'अनुरोध दर्ज किया जा रहा है...'
                      : 'Registering Consultation...'
                    : lang === 'hi'
                    ? 'अपॉइंटमेंट दर्ज करें →'
                    : 'START MY ENQUIRY →'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Map & Showroom Hours Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="relative overflow-hidden border border-[#B89455]/30 shadow-md bg-white h-72 sm:h-80">
              <iframe
                title="Shree Vijay Showroom Jabalpur Map"
                src="https://maps.google.com/maps?q=Shree%20Vijay%20Showroom%20Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {/* Timings & Address Details */}
            <div className="bg-white p-6 border border-[#B89455]/20 shadow-xs space-y-4 text-left">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#B89455] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#4A101C]">
                    {lang === 'hi' ? 'शोरूम खुलने का समय' : 'Store Timings'}
                  </h4>
                  <p className="text-sm font-semibold text-[#211A18]">
                    10:30 AM – 10:00 PM
                  </p>
                  <span className="text-xs text-emerald-800 font-medium block">
                    ● Open All 7 Days (Including Sundays & Holidays)
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDE2D2] flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#B89455] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#4A101C]">
                    {lang === 'hi' ? 'सटीक पता' : 'Full Address'}
                  </h4>
                  <p className="text-xs text-[#756A63] leading-relaxed">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
