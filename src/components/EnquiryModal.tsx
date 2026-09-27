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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#181516] text-[#F4EEE4] w-full max-w-2xl rounded-xs shadow-2xl border border-[#B89A5A]/30 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-[#121011] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold block">
              SHREE VIJAY SHOWROOM · JABALPUR
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#F4EEE4] mt-0.5">
              {t.enquiry.modalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181516] text-[#BDB3A5] hover:text-[#F4EEE4] hover:bg-[#201C1E] border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
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
              <div className="w-16 h-16 bg-[#4A1724]/40 text-[#D1B875] rounded-full flex items-center justify-center mx-auto border border-[#B89A5A]/40">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-display text-[#F4EEE4]">
                {t.enquiry.successTitle}
              </h3>

              <p className="text-sm text-[#BDB3A5] max-w-md mx-auto font-light">
                {t.enquiry.successDesc}
              </p>

              {/* Unique Enquiry Code Box */}
              <div className="bg-[#121011] border border-[#B89A5A]/40 py-3 px-6 rounded-xs inline-block my-2">
                <span className="text-[10px] text-[#B89A5A] block uppercase tracking-widest font-mono">
                  Enquiry Reference Code
                </span>
                <span className="text-xl font-mono font-bold text-[#F4EEE4] tracking-wider">
                  {successResult.enquiry_code}
                </span>
              </div>

              <p className="text-xs text-[#BDB3A5] max-w-md mx-auto font-light">
                {lang === 'hi'
                  ? 'हमारे जबलपुर शोरूम के वेडिंग सलाहकार आपसे शीघ्र संपर्क करेंगे। त्वरित फोटो एवं वीडियो कॉल के लिए नीचे व्हाट्सएप पर चैट शुरू करें।'
                  : 'Our Jabalpur showroom wedding consultant has received your request. For instant video-trial or fabric swatches, tap below to chat on WhatsApp.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={successResult.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#D1B875]" />
                  <span>{t.enquiry.instantWhatsAppBtn}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-white/5 border border-white/15 text-[#BDB3A5] hover:text-[#F4EEE4] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  {t.enquiry.close}
                </button>
              </div>
            </div>
          ) : (
            /* CRM Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Product Reference Banner */}
              {initialProduct && (
                <div className="p-3 bg-[#121011] border border-[#B89A5A]/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#B89A5A] uppercase text-[10px] tracking-wider font-semibold block">
                      Enquiring For Ensemble
                    </span>
                    <span className="font-display font-bold text-[#F4EEE4] text-sm">
                      {initialProduct.name}
                    </span>
                    <span className="text-[#BDB3A5] ml-2 font-mono text-[11px]">
                      (SKU: {initialProduct.sku})
                    </span>
                  </div>
                  <span className="font-display font-bold text-sm text-[#D1B875] font-mono">
                    ₹{(initialProduct.offer_price || initialProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.enquiry.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Ananya Tiwari"
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.enquiry.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Category and Preferred Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.enquiry.category}
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: Number(e.target.value),
                        product_name:
                          categories.find((c) => c.id === Number(e.target.value))?.name || '',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {lang === 'hi' ? cat.name_hi : cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.enquiry.preferredContact}
                  </label>
                  <select
                    value={formData.preferred_contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferred_contact: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value="WhatsApp">{t.enquiry.contactOptions.whatsapp}</option>
                    <option value="Call">{t.enquiry.contactOptions.call}</option>
                    <option value="Showroom Visit">{t.enquiry.contactOptions.visit}</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Variant / Colour and Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.product.colour} / {t.product.size}
                  </label>
                  <input
                    type="text"
                    value={formData.variant_info}
                    onChange={(e) => setFormData({ ...formData, variant_info: e.target.value })}
                    placeholder="e.g. Crimson Red / Gold Zari / Size 38"
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                    {t.enquiry.quantity}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: Budget Range */}
              <div>
                <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                  {t.enquiry.budget}
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="">{t.enquiry.budgetPlaceholder}</option>
                  <option value="Under ₹15,000">Under ₹15,000</option>
                  <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000</option>
                  <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000</option>
                  <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000</option>
                  <option value="Above ₹1,50,000 (Royal Bridal / Groom)">Above ₹1,50,000 (Royal Bridal / Groom)</option>
                </select>
              </div>

              {/* Row 5: Notes / Message */}
              <div>
                <label className="text-[11px] font-medium text-[#BDB3A5] uppercase tracking-wider block mb-1">
                  {t.enquiry.message}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Looking for pure velvet crimson lehenga with double dupatta..."
                  className="w-full px-3.5 py-2 bg-[#121011] border border-white/15 focus:border-[#B89A5A] text-xs text-[#F4EEE4] focus:outline-none transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/50 text-[#F4EEE4] text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? t.enquiry.submitting : t.enquiry.submitBtn}</span>
                  <ArrowRight className="w-4 h-4 text-[#D1B875]" />
                </button>
                <p className="text-[10px] text-[#BDB3A5]/60 text-center mt-2">
                  🔒 We respect your privacy. Inquiries are handled directly by our Jabalpur showroom bridal consultants.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
