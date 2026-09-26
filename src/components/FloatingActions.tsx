import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface FloatingActionsProps {
  settings?: WebsiteSettings;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ settings }) => {
  const isEnabled = settings?.whatsapp_floating_enabled !== 'false';
  if (!isEnabled) return null;

  const phone = settings?.phone || '089898 92476';
  const whatsappNumber = settings?.whatsapp_number || '918989892476';
  const message =
    settings?.whatsapp_default_message ||
    'Hello Shree Vijay Showroom Jabalpur, I would like to enquire about your wedding clothing collection.';

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 no-print">
      {/* Quick Phone Call Button (Mobile visible) */}
      <a
        href={`tel:${phone.replace(/\s+/g, '')}`}
        className="w-11 h-11 bg-white hover:bg-[#F7F4EE] text-[#1C1611] rounded-full shadow-lg border border-[#D8CEBE] flex items-center justify-center transition-all hover:scale-105"
        title="Call Showroom"
        aria-label="Call Shree Vijay Showroom"
      >
        <Phone className="w-5 h-5 text-[#B48448]" />
      </a>

      {/* Floating WhatsApp CTA - Circle frame with continuous blinking */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl border-2 border-white/95 flex items-center justify-center transition-transform hover:scale-110 animate-blink-continuous"
        title="Chat on WhatsApp"
        aria-label="Chat with Shree Vijay Showroom on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/70 animate-ping pointer-events-none" />
        <MessageCircle className="relative z-10 w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
