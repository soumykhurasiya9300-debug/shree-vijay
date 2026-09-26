import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Product, Category } from '../types/index.ts';
import { submitEnquiry } from '../lib/api.ts';
import { Language, translations } from '../lib/translations.ts';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  initialVariant?: string;
  initialQuantity?: number;
  categories: Category[];
  lang: Language;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  initialVariant,
  initialQuantity = 1,
  categories,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product_name: initialProduct ? initialProduct.name : '',
    product_id: initialProduct ? initialProduct.id : undefined,
    category_id: initialProduct ? initialProduct.category_id : categories[0]?.id,
    variant_info: initialVariant || initialProduct?.colour || '',
    colour: initialProduct?.colour || '',
    size: initialProduct?.size || 'Standard',
    quantity: initialQuantity,
    budget: '',
    preferred_contact: 'WhatsApp' as 'WhatsApp' | 'Call' | 'Showroom Visit',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    enquiry_code: string;
    whatsapp_url: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customer_name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError(lang === 'hi' ? 'कृपया मान्य 10 अंकों का फोन नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitEnquiry(formData);
      setSuccessResult({
        enquiry_code: res.enquiry_code,
        whatsapp_url: res.whatsapp_url,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl border border-[#E8DFD3] overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-[#F7F4EE] border-b border-[#E8DFD3] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B48448] font-semibold block">
              SHREE VIJAY SHOWROOM · JABALPUR
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#1C1611]">
              {t.enquiry.modalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#1C1611] hover:bg-[#1C1611] hover:text-white transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {successResult ? (
            /* Success Confirmation Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-display text-[#1C1611]">
                {t.enquiry.successTitle}
              </h3>

              <p className="text-sm text-[#5A5044] max-w-md mx-auto">
                {t.enquiry.successDesc}
              </p>

              {/* Unique Enquiry Code Box */}
              <div className="bg-[#F7F4EE] border border-[#B48448]/40 py-3 px-6 rounded-sm inline-block my-2">
                <span className="text-xs text-[#7A6E5F] block uppercase tracking-wider">
                  Enquiry Reference Code
                </span>
                <span className="text-xl font-mono font-bold text-[#1C1611] tracking-wider">
                  {successResult.enquiry_code}
                </span>
              </div>

              <p className="text-xs text-[#7A6E5F] max-w-md mx-auto">
                {lang === 'hi'
                  ? 'हमारे जबलपुर शोरूम के वेडिंग सलाहकार आपसे शीघ्र संपर्क करेंगे। त्वरित फोटो एवं वीडियो कॉल के लिए नीचे व्हाट्सएप पर चैट शुरू करें।'
                  : 'Our Jabalpur showroom wedding consultant has received your request. For instant video-trial or fabric swatches, tap below to chat on WhatsApp.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={successResult.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.enquiry.instantWhatsAppBtn}</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-[#EFE9DF] hover:bg-[#E0D6C8] text-[#1C1611] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
                >
                  {t.enquiry.close}
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel / Dr. Meenakshi"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 089898 92476"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>
              </div>

              {/* Row 2: Email and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.email}
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.category}
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'hi' ? c.name_hi : c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Product Name & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.product}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Banarasi Silk Saree or Crimson Bridal Lehenga"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.quantity}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>
              </div>

              {/* Row 4: Budget Range & Preferred Contact Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.budget}
                  </label>
                  <input
                    type="text"
                    placeholder={t.enquiry.budgetPlaceholder}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                    {t.enquiry.preferredContact}
                  </label>
                  <select
                    value={formData.preferred_contact}
                    onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                  >
                    <option value="WhatsApp">{t.enquiry.contactOptions.whatsapp}</option>
                    <option value="Call">{t.enquiry.contactOptions.call}</option>
                    <option value="Showroom Visit">{t.enquiry.contactOptions.visit}</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Notes & Customization Message */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1611] mb-1">
                  {t.enquiry.message}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    lang === 'hi'
                      ? 'विवाह की तारीख, पसंद का रंग या विशेष सिलाई संबंधी आवश्यकताएं यहाँ लिखें...'
                      : 'Wedding date, color preferences, sizing, or in-store appointment request...'
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] disabled:opacity-50 transition-colors rounded-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <span>{t.enquiry.submitting}</span>
                  ) : (
                    <>
                      <span>{t.enquiry.submitBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
