import React, { useState } from 'react';
import { MapPin, Phone, Clock, Calendar, CheckCircle2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Language, translations } from '../lib/translations.ts';
import { WebsiteSettings } from '../types/index.ts';
import { submitEnquiry } from '../lib/api.ts';

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

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visit_date: '',
    product: 'Lehenga',
    heard_about: 'Instagram',
    visited_before: 'No',
    requirement: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryCode, setEnquiryCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    const cleanPhoneDigits = formData.phone.trim().replace(/\D/g, '');
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का मान्य फोन नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.visit_date) {
      setErrorMsg(lang === 'hi' ? 'कृपया आने की तिथि चुनें।' : 'Please select your intended date of visit.');
      return;
    }

    setSubmitting(true);
    try {
      const summaryMessage = [
        `Visit Date: ${formData.visit_date}`,
        `Interested In: ${formData.product}`,
        `Heard Via: ${formData.heard_about}`,
        `Visited Store Before: ${formData.visited_before}`,
        formData.requirement ? `Requirement: ${formData.requirement}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await submitEnquiry({
        customer_name: formData.name.trim(),
        phone: formData.phone.trim(),
        product_name: formData.product,
        preferred_contact: 'WhatsApp',
        message: summaryMessage,
        quantity: 1,
      });

      setEnquiryCode(res.enquiry_code || `SV-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Showroom Location & Amenities */}
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
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#B89A5A] mb-2">
                {lang === 'hi' ? 'निःशुल्क विशेष सुविधाएं' : 'Exclusive In-Store Amenities'}
              </h3>
              <ul className="text-xs text-[#BDB3A5] space-y-2">
                <li>✓ Dedicated private bridal mirror suite & family lounge</li>
                <li>✓ On-site master tailoring for alterations & custom blouse cuts</li>
                <li>✓ Professional groom pagdi/turban tying & stole coordination</li>
                <li>✓ Direct manufacturer rates with 100% genuine silk certification</li>
              </ul>
            </div>
          </div>

          {/* Right Column: In-Store Visit & Requirement Inquiry Form (Selected Element) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#181516] border border-[#B89A5A]/30 shadow-xl text-left">
              <div className="mb-6 text-center sm:text-left">
                <span className="text-xs uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block">
                  SHOWROOM VISIT & CONSULTATION
                </span>
                <h3 className="font-display text-2xl font-bold text-[#F4EEE4] mt-1">
                  {lang === 'hi' ? 'शोरूम विज़िट एवं परामर्श अपॉइंटमेंट' : 'Plan Your Showroom Visit'}
                </h3>
                <p className="text-xs text-[#BDB3A5] mt-1 font-light">
                  {lang === 'hi'
                    ? 'कृपया अपने आने की जानकारी साझा करें ताकि हमारी टीम आपके पसंदीदा परिधान पहले से तैयार रख सके।'
                    : 'Share your visit details so our stylists and bridal coordinators have your curated collection ready.'}
                </p>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#4A1724] border border-[#B89A5A] flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-[#D1B875]" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-[#F4EEE4]">
                    {lang === 'hi' ? 'विज़िट अपॉइंटमेंट सफलतापूर्वक दर्ज!' : 'Showroom Visit Scheduled!'}
                  </h4>
                  <p className="text-xs text-[#BDB3A5] max-w-md mx-auto leading-relaxed">
                    {lang === 'hi'
                      ? `नमस्ते ${formData.name}, हमने ${formData.visit_date} को ${formData.product} के लिए आपका अपॉइंटमेंट दर्ज कर लिया है।`
                      : `Thank you, ${formData.name}! Your visit for ${formData.product} on ${formData.visit_date} has been confirmed.`}
                  </p>
                  <div className="inline-block py-2.5 px-6 bg-[#121011] border border-[#B89A5A]/50 font-mono text-sm text-[#D1B875] tracking-wider">
                    APPOINTMENT REF: {enquiryCode}
                  </div>
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Namaste Shree Vijay Showroom, I have booked a showroom visit for ${formData.product} on ${formData.visit_date}. Appointment Code: ${enquiryCode}. Customer: ${formData.name} (${formData.phone}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wine text-xs w-full sm:w-auto"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'व्हाट्सएप पर पुष्टि करें' : 'Confirm via WhatsApp'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          visit_date: '',
                          product: 'Lehenga',
                          heard_about: 'Instagram',
                          visited_before: 'No',
                          requirement: '',
                        });
                      }}
                      className="btn-secondary text-xs w-full sm:w-auto"
                    >
                      <span>{lang === 'hi' ? 'अन्य अपॉइंटमेंट बुक करें' : 'Book Another Visit'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-200 rounded-none">
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. Name & 2. Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                        {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === 'hi' ? 'उदा. राधिका शर्मा' : 'e.g. Radhika Sharma'}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] placeholder:text-[#BDB3A5]/50 focus:outline-none transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                        {lang === 'hi' ? 'फोन नंबर (व्हाट्सएप) *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={lang === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] placeholder:text-[#BDB3A5]/50 focus:outline-none transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  {/* 3. Date to Visit & 4. Product */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                        {lang === 'hi' ? 'पधारने की तिथि *' : 'Date to Visit *'}
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={formData.visit_date}
                        onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors rounded-none [color-scheme:dark]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                        {lang === 'hi' ? 'परिधान चयन (उत्पाद) *' : 'Product *'}
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors rounded-none [color-scheme:dark]"
                      >
                        <option value="Lehenga">Lehenga (लहंगा - ब्राइडल व पार्टी)</option>
                        <option value="Saree">Saree (शुद्ध बनारसी व सिल्क साड़ी)</option>
                        <option value="Kurti">Kurti (डिज़ाइनर कुर्ती व ट्यूनिक)</option>
                        <option value="Kurta">Kurta (कुर्ता पजामा व एथनिक)</option>
                        <option value="Sherwani">Sherwani (रॉयल ग्रूम शेरवानी)</option>
                        <option value="Coat">Coat / Blazer (ब्लेज़र व फॉर्मल कोट)</option>
                        <option value="3 Piece Suit">3 Piece Suit (3 पीस सूट व टक्सिडो)</option>
                        <option value="Complete Family Wedding Wear">Complete Family Wedding Wear (संपूर्ण परिवार)</option>
                        <option value="Other">Other (अन्य परिधान)</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. How did you hear about Shree Vijay? */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                      {lang === 'hi'
                        ? 'श्री विजय शोरूम के बारे में कैसे पता चला? *'
                        : 'How Did You Hear About Shree Vijay? *'}
                    </label>
                    <select
                      value={formData.heard_about}
                      onChange={(e) => setFormData({ ...formData, heard_about: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors rounded-none [color-scheme:dark]"
                    >
                      <option value="Instagram">Instagram (इंस्टाग्राम)</option>
                      <option value="YouTube">YouTube (यूट्यूब)</option>
                      <option value="Facebook">Facebook (फेसबुक)</option>
                      <option value="Family Member">Family Member / Relative (परिवार के सदस्य)</option>
                      <option value="Friend / Recommendation">Friend / Recommendation (मित्र की सिफारिश)</option>
                      <option value="Walk-in Landmark">Direct Showroom / Bada Fuhara (डायरेक्ट शोरूम)</option>
                    </select>
                  </div>

                  {/* 6. Have you ever visited our store before? */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                      {lang === 'hi'
                        ? 'क्या आप पहले कभी हमारे स्टोर आए हैं? *'
                        : 'Have You Ever Visited Our Store Before? *'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visited_before: 'Yes' })}
                        className={`py-2 px-3 text-xs font-medium border text-center transition-all cursor-pointer rounded-none ${
                          formData.visited_before === 'Yes'
                            ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A] shadow-sm'
                            : 'bg-[#121011] text-[#BDB3A5] border-white/15 hover:border-white/30'
                        }`}
                      >
                        {lang === 'hi' ? 'हाँ (Yes, Visited Before)' : 'Yes, Visited Before'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visited_before: 'No' })}
                        className={`py-2 px-3 text-xs font-medium border text-center transition-all cursor-pointer rounded-none ${
                          formData.visited_before === 'No'
                            ? 'bg-[#4A1724] text-[#F4EEE4] border-[#B89A5A] shadow-sm'
                            : 'bg-[#121011] text-[#BDB3A5] border-white/15 hover:border-white/30'
                        }`}
                      >
                        {lang === 'hi' ? 'नहीं (No, First Visit)' : 'No, First Time Visit'}
                      </button>
                    </div>
                  </div>

                  {/* 7. Describe your requirement */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#D1B875] block mb-1.5">
                      {lang === 'hi' ? 'अपनी आवश्यकता का विवरण दें' : 'Describe Your Requirement'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder={
                        lang === 'hi'
                          ? 'उदा. शादी की तारीख, रंग, बजट या कोई विशेष डिज़ाइन पसंद...'
                          : 'e.g. Wedding date, color preferences, budget, or specific tailoring needs...'
                      }
                      className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] placeholder:text-[#BDB3A5]/50 focus:outline-none transition-colors rounded-none"
                    />
                  </div>

                  {/* Submit Button - Uiverse.io by Gaurang7717 */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="uiverse-confirm-btn noselect"
                    >
                      <span className="text">
                        {submitting
                          ? lang === 'hi'
                            ? 'पुष्टि हो रही है...'
                            : 'Booking...'
                          : 'Confirm showroom visit'}
                      </span>
                      <span className="icon">
                        <svg
                          viewBox="0 0 24 24"
                          height="24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
