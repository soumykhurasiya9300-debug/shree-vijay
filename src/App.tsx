import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ShowroomFloor } from './components/ShowroomFloor.tsx';
import { BridalEditSection } from './components/BridalEditSection.tsx';
import { DigitalRackSection } from './components/DigitalRackSection.tsx';
import { OccasionShoppingSection } from './components/OccasionShoppingSection.tsx';
import { GroomEditSection } from './components/GroomEditSection.tsx';
import { FamilyWeddingSection } from './components/FamilyWeddingSection.tsx';
import { FeaturedLookSpotlight } from './components/FeaturedLookSpotlight.tsx';
import { ShowroomWalkthrough } from './components/ShowroomWalkthrough.tsx';
import { ShowroomStory } from './components/ShowroomStory.tsx';
import { GoogleReviewsSection } from './components/GoogleReviewsSection.tsx';
import { InstagramSection } from './components/InstagramSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { FloatingActions } from './components/FloatingActions.tsx';
import { Footer } from './components/Footer.tsx';
import { SectionBorderDivider } from './components/SectionBorderDivider.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { EnquiryModal } from './components/EnquiryModal.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { BrandIntroPreloader } from './components/BrandIntroPreloader.tsx';

import { fetchPublicInit, checkSession } from './lib/api.ts';
import { Language } from './lib/translations.ts';
import { Category, Subcategory, Product, WebsiteSettings, WebsiteSection } from './types/index.ts';
import { safeStorage } from './lib/storage.ts';
import initialData from './data/initialData.json';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (safeStorage.getItem('sv_language') as Language) || 'en';
  });

  const [loading, setLoading] = useState(false);
  const [showBrandIntro, setShowBrandIntro] = useState(false);
  const [categories, setCategories] = useState<Category[]>((initialData.categories as any) || []);
  const [subcategories, setSubcategories] = useState<Subcategory[]>((initialData.subcategories as any) || []);
  const [products, setProducts] = useState<Product[]>((initialData.products as any) || []);
  const [settings, setSettings] = useState<WebsiteSettings | undefined>((initialData.settings as any) || undefined);
  const [sections, setSections] = useState<WebsiteSection[]>((initialData.website_sections as any) || []);

  // Selection & Modals
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiringProduct, setEnquiringProduct] = useState<Product | null>(null);
  const [enquiringVariant, setEnquiringVariant] = useState<string | undefined>(undefined);
  const [enquiringQuantity, setEnquiringQuantity] = useState<number>(1);

  // Admin Portal State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<any | null>(null);
  const [isInAdminPortal, setIsInAdminPortal] = useState(false);

  const loadData = async () => {
    try {
      const initData = await fetchPublicInit();
      setCategories(initData.categories || []);
      setSubcategories(initData.subcategories || []);
      setProducts(initData.products || []);
      setSettings(initData.settings);
      setSections(initData.sections || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check active admin session
    checkSession()
      .then((res) => {
        if (res.authenticated && res.admin) {
          setAdminSession(res.admin);
        }
      })
      .catch(() => {
        // Not authenticated
      });
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    safeStorage.setItem('sv_language', newLang);
  };

  const handleOpenEnquiryForProduct = (product: Product, variantInfo?: string, qty: number = 1) => {
    setEnquiringProduct(product);
    setEnquiringVariant(variantInfo);
    setEnquiringQuantity(qty);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenGeneralEnquiry = () => {
    setEnquiringProduct(null);
    setEnquiringVariant(undefined);
    setEnquiringQuantity(1);
    setIsEnquiryModalOpen(true);
  };

  // Check section visibility from CMS
  const isSectionActive = (key: string): boolean => {
    const sec = sections.find((s) => s.section_key === key);
    return sec ? Boolean(sec.is_enabled) : true;
  };

  // If in Admin Management Portal
  if (isInAdminPortal && adminSession) {
    return (
      <AdminLayout
        admin={adminSession}
        onLogout={() => {
          setAdminSession(null);
          setIsInAdminPortal(false);
        }}
        onExitToStore={() => {
          setIsInAdminPortal(false);
          loadData();
        }}
      />
    );
  }

  // Customer-Facing Storefront: The Dark Royal Indian Luxury Fashion House
  return (
    <div className="min-h-screen bg-[#0A0909] text-[#F4EEE4] flex flex-col selection:bg-[#4A1724] selection:text-[#F4EEE4] antialiased">
      {/* 1. Opening Experience: Brand Intro & Enter Showroom */}
      {showBrandIntro && (
        <BrandIntroPreloader
          onComplete={() => setShowBrandIntro(false)}
          isDataReady={!loading}
        />
      )}

      {/* 2. Editorial Top Navigation Bar & Showroom Directory */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        settings={settings}
        onOpenAdmin={() => {
          if (adminSession) {
            setIsInAdminPortal(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenEnquiry={handleOpenGeneralEnquiry}
      />

      <main className="flex-1">
        {/* 3. Hero Experience: Full-Screen Cinematic Fashion Visual */}
        {isSectionActive('hero') && (
          <Hero
            lang={lang}
            settings={settings}
            onOpenEnquiry={handleOpenGeneralEnquiry}
          />
        )}

        <SectionBorderDivider />

        {/* 4. Showroom Floor: Department Directory (01 Bridal, 02 Women, 03 Men, 04 Family, 05 Occasions) */}
        <ShowroomFloor lang={lang} />

        <SectionBorderDivider />

        {/* 5. The Bridal Edit: "For the Moment You'll Remember Forever" */}
        <BridalEditSection
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
          whatsappNumber={settings?.whatsapp_number}
        />

        <SectionBorderDivider />

        {/* 6. The Digital Rack Experience: Horizontal Scrolling Showroom Rails */}
        <DigitalRackSection
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
        />

        <SectionBorderDivider />

        {/* 7. Occasion-First Styling: "What Are You Dressing For?" */}
        <OccasionShoppingSection
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
        />

        <SectionBorderDivider />

        {/* 8. The Groom's Edit: Royal Sherwanis & Silk Bandhgalas */}
        <GroomEditSection
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
          whatsappNumber={settings?.whatsapp_number}
        />

        <SectionBorderDivider />

        {/* 9. The Complete Family Wedding: "One Wedding. Everyone's Look." */}
        <FamilyWeddingSection
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
          onOpenEnquiry={handleOpenGeneralEnquiry}
          whatsappNumber={settings?.whatsapp_number}
        />

        <SectionBorderDivider />

        {/* 10. Curator's Choice: Look of the Week Spotlight */}
        <FeaturedLookSpotlight
          products={products}
          lang={lang}
          onViewProduct={(p) => setViewingProduct(p)}
          onEnquireProduct={(p) => handleOpenEnquiryForProduct(p)}
        />

        <SectionBorderDivider />

        {/* 11. Walk Through the Showroom: Multi-Floor Interactive Hotspots */}
        <ShowroomWalkthrough
          lang={lang}
          onOpenEnquiry={handleOpenGeneralEnquiry}
        />

        {/* 12. 30+ Years Heritage Story: The Journey from 1990s to Today */}
        {isSectionActive('craft_story') && (
          <>
            <SectionBorderDivider />
            <ShowroomStory lang={lang} />
          </>
        )}

        {/* 13. Real Google Reviews (4.9★ Customer Voice) */}
        {isSectionActive('reviews') && (
          <>
            <SectionBorderDivider />
            <GoogleReviewsSection lang={lang} />
          </>
        )}

        {/* 14. Instagram Showcase: Real Brides & Showroom Reels */}
        {isSectionActive('instagram') && (
          <>
            <SectionBorderDivider />
            <InstagramSection
              lang={lang}
              instagramUrl={settings?.instagram_url}
              youtubeUrl={settings?.youtube_url}
            />
          </>
        )}

        {/* 15. Showroom Visit & "Let's Find Your Look" Consultation Booking */}
        {isSectionActive('contact') && (
          <>
            <SectionBorderDivider />
            <ContactSection
              lang={lang}
              settings={settings}
              onOpenEnquiry={handleOpenGeneralEnquiry}
            />
          </>
        )}
      </main>

      <SectionBorderDivider />

      {/* 16. Minimal Luxury Editorial Footer */}
      <Footer
        lang={lang}
        settings={settings}
        onOpenAdmin={() => {
          if (adminSession) {
            setIsInAdminPortal(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onReplayIntro={() => setShowBrandIntro(true)}
      />

      {/* 17. Floating Actions: Continuous Blinking Circular WhatsApp + Phone */}
      <FloatingActions settings={settings} />

      {/* 18. Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          lang={lang}
          onClose={() => setViewingProduct(null)}
          onEnquire={(p, variant, qty) => {
            setViewingProduct(null);
            handleOpenEnquiryForProduct(p, variant, qty);
          }}
          whatsappNumber={settings?.whatsapp_number}
        />
      )}

      {/* 19. CRM Customer Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialProduct={enquiringProduct}
        initialVariant={enquiringVariant}
        initialQuantity={enquiringQuantity}
        categories={categories}
        lang={lang}
      />

      {/* 20. Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLogin
          onLoginSuccess={(admin) => {
            setAdminSession(admin);
            setIsAdminLoginOpen(false);
            setIsInAdminPortal(true);
          }}
          onCancel={() => setIsAdminLoginOpen(false)}
        />
      )}
    </div>
  );
}
