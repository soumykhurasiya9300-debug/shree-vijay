import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Crown,
  Calendar
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { Language } from '../lib/translations.ts';
import { getCeremonyReelUrl, openInstagramReel } from '../lib/instagramReels.ts';

// High-fidelity curated images
import occasionImg from '../assets/images/occasion_haldi_festive_1790325578682.jpg';
import haldiImg from '../assets/images/occasion_haldi_festive_1790325578682.jpg';
import weddingImg from '../assets/images/hero_bridal_wedding_1790317438926.jpg';
import bridalImg from '../assets/images/bridal_lehenga_collection_1790317477737.jpg';
import sareeImg from '../assets/images/designer_banarasi_saree_1790317467169.jpg';
import sherwaniImg from '../assets/images/groom_royal_sherwani_1790317453744.jpg';
import familyImg from '../assets/images/family_wedding_ensemble_1790325566253.jpg';
import mehendiImg from '../assets/images/ceremony_mehendi.jpg';
import sangeetImg from '../assets/images/ceremony_sangeet.jpg';
import occasionsBgImg from '../assets/images/occasions_bg.jpg';

interface OccasionShoppingSectionProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
  onEnquireProduct: (product: Product) => void;
}

interface SubcategoryCard {
  id: string;
  name: string;
  name_hi: string;
  tagline: string;
  tagline_hi: string;
  image: string;
  badge: string;
  badge_hi: string;
  query: string;
}

interface OccasionMeta {
  id: string;
  name: string;
  name_hi: string;
  hindiAura: string;
  palette: string;
  paletteHex: string[];
  description: string;
  description_hi: string;
  bannerTagline: string;
  bannerTagline_hi: string;
  image: string;
  subcategories: SubcategoryCard[];
}

export const OccasionShoppingSection: React.FC<OccasionShoppingSectionProps> = ({
  products,
  lang,
  onViewProduct,
  onEnquireProduct,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('haldi');

  // Standard requested silhouettes for each ceremony
  // Ceremony flow: Haldi -> Mehendi -> Sangeet -> Wedding -> Royal (Reception) -> Festival
  // Subcategories in order: Lehenga, Saree, Suits, Kurti, Gown, Kurta, Sherwani
  const occasions: OccasionMeta[] = [
    {
      id: 'haldi',
      name: 'Haldi Ceremony',
      name_hi: 'हल्दी सेरेमनी',
      hindiAura: 'पीत वर्ण अनुष्ठान एवं मांगलिक हल्दी रस्म',
      palette: 'Sunlit Yellows, Gota Patti, Floral Silks',
      paletteHex: ['#F59E0B', '#FBBF24', '#FEF08A', '#B45309'],
      description: 'Joyous turmeric yellows, breezy mulmul, and light gota patti for intimate rituals.',
      description_hi: 'शुभ पीत वर्ण के परिधान — गोटा पत्ती, हल्के मलमल व फ्लोरल वर्क।',
      bannerTagline: 'Haldi Ceremony Special: Sunshine lehengas, sarees, suits, kurtis, gowns, kurtas & sherwanis.',
      bannerTagline_hi: 'हल्दी रस्म के लिए खास सुंदर पीताम्बरी लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन व कुर्ते।',
      image: haldiImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'हल्दी लहंगा',
          tagline: 'Sunlit yellow gota-patti flare organza & raw silk lehengas',
          tagline_hi: 'वासंती पीला गोटा-पत्ती ऑर्गेंजा एवं सिल्क लहंगा',
          image: haldiImg,
          badge: 'Haldi Flare',
          badge_hi: 'हल्दी स्पेशल',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'हल्दी साड़ी',
          tagline: 'Lightweight Chanderi, bandhani & temple border yellow sarees',
          tagline_hi: 'चंदेरी, बंधेज व जरी बॉर्डर पीताम्बरी साड़ियाँ',
          image: sareeImg,
          badge: 'Yellow Silk',
          badge_hi: 'पीत सिल्क',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'हल्दी सूट',
          tagline: 'Embroidered festive sharara & palazzo suit ensembles',
          tagline_hi: 'गोटा-वर्क शरारा एवं पलाज़ो सूट सेट्स',
          image: familyImg,
          badge: 'Ritual Comfort',
          badge_hi: 'उत्सव सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'हल्दी कुर्ती',
          tagline: 'Breezy mirror-work festive straight & flared kurtis',
          tagline_hi: 'मिरर वर्क एवं फ्लोरल प्रिंट हल्दी कुर्तियाँ',
          image: bridalImg,
          badge: 'Breezy Chic',
          badge_hi: 'हल्की कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'हल्दी गाउन',
          tagline: 'Fluid sunshine georgette drapes & cape silhouette gowns',
          tagline_hi: 'हल्के जॉर्जेट व फ्लोरल केप गाउन',
          image: weddingImg,
          badge: 'Modern Flare',
          badge_hi: 'मॉडर्न गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'हल्दी कुर्ता',
          tagline: 'Pure yellow raw silk kurtas with bundi Nehru jackets',
          tagline_hi: 'प्योर रॉ सिल्क पीला कुर्ता एवं नेहरू बंडी',
          image: haldiImg,
          badge: 'Groom & Brother',
          badge_hi: 'सिल्क कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'हल्दी शेरवानी',
          tagline: 'Pastel sunshine lightweight achkan & soft silk sherwanis',
          tagline_hi: 'सॉफ्ट सिल्क व पेस्टल टोन लाइट अचकन शेरवानी',
          image: sherwaniImg,
          badge: 'Pastel Royal',
          badge_hi: 'लाइट शेरवानी',
          query: 'sherwani',
        },
      ],
    },
    {
      id: 'mehendi',
      name: 'Mehendi Ceremony',
      name_hi: 'मेहंदी सेरेमनी',
      hindiAura: 'मरकत हरित, आभला दर्पण व उत्सव परिधान',
      palette: 'Emerald Greens, Mirror Work, Fluid Georgette',
      paletteHex: ['#047857', '#10B981', '#6EE7B7', '#064E3B'],
      description: 'Vibrant emerald greens and mirror embellishments crafted for effortless movement.',
      description_hi: 'हरे व फिरोजी रंग के आरामदायक लहंगे, मिरर वर्क कुर्ते व फ्लोरल साड़ियाँ।',
      bannerTagline: 'Mehendi Ceremony Special: Henna-friendly lehengas, sarees, suits, kurtis, gowns, kurtas & sherwanis.',
      bannerTagline_hi: 'मेहंदी रस्म के लिए खास हरे रंग के लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन, कुर्ते व शेरवानी।',
      image: mehendiImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'मेहंदी लहंगा',
          tagline: 'Emerald & sage green mirror-work lightweight festive lehengas',
          tagline_hi: 'मरकत हरा मिरर-वर्क एवं गोटा-पत्ती लहंगा',
          image: bridalImg,
          badge: 'Emerald Twirl',
          badge_hi: 'मेहंदी ट्विर्ल',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'मेहंदी साड़ी',
          tagline: 'Pure Katan silk green weaves & organza floral printed sarees',
          tagline_hi: 'हरी बनारसी कतान सिल्क व फ्लोरल ऑर्गेंजा साड़ियाँ',
          image: sareeImg,
          badge: 'Mehendi Green',
          badge_hi: 'हरी सिल्क साड़ी',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'मेहंदी सूट',
          tagline: 'Henna-friendly 3/4 sleeve anarkali & tiered sharara sets',
          tagline_hi: 'सुविधाजनक अनारकली व टियर्ड शरारा सेट्स',
          image: familyImg,
          badge: 'Henna Cut',
          badge_hi: 'उत्सव सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'मेहंदी कुर्ती',
          tagline: 'Vibrant olive, mint & bottle green festive party kurtis',
          tagline_hi: 'ऑलिव, मिंट व बॉटल ग्रीन डिजाइनर कुर्तियाँ',
          image: haldiImg,
          badge: 'Comfort Silk',
          badge_hi: 'आरामदायक कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'मेहंदी गाउन',
          tagline: 'Contemporary teal & sea-green asymmetric flared gowns',
          tagline_hi: 'टील व सी-ग्रीन असिमेट्रिक फ्लेयर्ड गाउन',
          image: weddingImg,
          badge: 'Teal Elegance',
          badge_hi: 'डिजाइनर गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'मेहंदी कुर्ता',
          tagline: 'Mint green silk threadwork kurtas with matching bundis',
          tagline_hi: 'मिंट ग्रीन रेशमी कुर्ता व एम्ब्रॉयडर्ड बंडी',
          image: occasionImg,
          badge: 'Mint & Olive',
          badge_hi: 'रेशमी कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'मेहंदी शेरवानी',
          tagline: 'Sage green & olive Jamawar raw silk festive sherwanis',
          tagline_hi: 'सेज ग्रीन व ऑलिव जामावार सिल्क शेरवानी',
          image: sherwaniImg,
          badge: 'Heritage Jamawar',
          badge_hi: 'रॉयल शेरवानी',
          query: 'sherwani',
        },
      ],
    },
    {
      id: 'sangeet',
      name: 'Sangeet Ceremony',
      name_hi: 'संगीत सेरेमनी',
      hindiAura: 'नक्षत्र रात्रि — ३६०° ट्विर्ल व सीक्विन्स',
      palette: 'Jewel Tones, Glittering Sequins, 360° Twirl',
      paletteHex: ['#1E3A8A', '#3B82F6', '#831843', '#E0E7FF'],
      description: 'Glamorous twilight jewel hues with high-impact sparkle designed for the stage.',
      description_hi: 'ग्लैमरस सीक्विन्स लहंगे, इंडो-वेस्टर्न बंदगला व कॉकटेल गाउन।',
      bannerTagline: 'Sangeet Night Special: Glamorous lehengas, sarees, suits, kurtis, gowns, kurtas & sherwanis.',
      bannerTagline_hi: 'संगीत नाइट के लिए खास चमकदार लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन, कुर्ते व शेरवानी।',
      image: sangeetImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'संगीत लहंगा',
          tagline: '360° spinning flare metallic sequin & jewel-tone lehengas',
          tagline_hi: '३६०° घूमने वाला सीक्विन्स व कटदाना संगीत लहंगा',
          image: bridalImg,
          badge: '360° Twirl',
          badge_hi: '३६०° ट्विर्ल',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'संगीत साड़ी',
          tagline: 'Cocktail pre-draped & metallic shimmer tissue silk sarees',
          tagline_hi: 'रेडी-टू-वियर ड्रेप व मेटैलिक शिमर साड़ियाँ',
          image: sareeImg,
          badge: 'Met Gala Drape',
          badge_hi: 'शिमर साड़ी',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'संगीत सूट',
          tagline: 'Deep navy & wine embellished peplum & jacket suits',
          tagline_hi: 'नेवी व वाइन रंग के हैवी वर्क पेपलम सूट',
          image: familyImg,
          badge: 'Evening Suit',
          badge_hi: 'इवनिंग सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'संगीत कुर्ती',
          tagline: 'Swarovski studded velvet & georgette partywear kurtis',
          tagline_hi: 'वेलवेट व जॉर्जेट पार्टीवियर कस्टमाइज्ड कुर्ती',
          image: haldiImg,
          badge: 'Glam Velvet',
          badge_hi: 'पार्टी कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'संगीत गाउन',
          tagline: 'Red carpet trail gowns with high-sparkle crystal handwork',
          tagline_hi: 'रेड-कार्पेट ट्रेल गाउन एवं क्रिस्टल वर्क',
          image: weddingImg,
          badge: 'Red Carpet',
          badge_hi: 'कॉकटेल गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'संगीत कुर्ता',
          tagline: 'Asymmetric cowl drape silk kurtas with metallic brooches',
          tagline_hi: 'असिमेट्रिक काउल ड्रेप कुर्ता व मेटैलिक ब्रोच',
          image: occasionImg,
          badge: 'Cowl Drape',
          badge_hi: 'ड्रेप कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'संगीत शेरवानी',
          tagline: 'Midnight blue velvet & deep wine tailored evening sherwanis',
          tagline_hi: 'मिडनाइट ब्लू वेलवेट व जोधपुरी इवनिंग शेरवानी',
          image: sherwaniImg,
          badge: 'Midnight Royal',
          badge_hi: 'शाही शेरवानी',
          query: 'sherwani',
        },
      ],
    },
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      name_hi: 'विवाह सेरेमनी',
      hindiAura: 'शाश्वत वैदिक फेरे व राजसी सिंदूरी परिधान',
      palette: 'Heritage Crimson, Royal Zardozi, Pure Brocade',
      paletteHex: ['#991B1B', '#DC2626', '#B45309', '#FDE68A'],
      description: 'Heirloom vermilion reds, beaten gold zardozi, and regal raw silks for sacred vows.',
      description_hi: 'शाश्वत राजपूताना लाल लहंगे, सिल्क शेरवानी व बनारसी कतान साड़ियाँ।',
      bannerTagline: 'Wedding Ceremony Special: Sacred bridal lehengas, sarees, suits, kurtis, gowns, kurtas & groom sherwanis.',
      bannerTagline_hi: 'शुभ विवाह फेरों के लिए राजसी दुल्हन लहंगा, बनारसी साड़ी, सूट, कुर्ती, गाउन, कुर्ता व दूल्हा शेरवानी।',
      image: weddingImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'दुल्हन लहंगा',
          tagline: 'Crimson heirloom zardozi velvet & double dupatta bridal lehengas',
          tagline_hi: 'सिंदूरी लाल जरदोजी वेलवेट व डबल दुपट्टा ब्राइडल लहंगा',
          image: bridalImg,
          badge: 'Master Bridal',
          badge_hi: 'राजपूताना ब्राइडल',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'मंडप साड़ी',
          tagline: 'Pure Banarasi Katan silk, Kadwa gold zari & traditional red drapes',
          tagline_hi: 'शुद्ध बनारसी कतान, कड़वा जरी व विवाह चुनरी साड़ी',
          image: sareeImg,
          badge: 'Pure Heritage',
          badge_hi: 'शुद्ध कतान',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'विवाह सूट',
          tagline: 'Bridal trousseau silk gota anarkali & heavy zardozi suits',
          tagline_hi: 'सिल्क गोटा अनारकली व हैवी जरदोजी ब्राइडल सूट',
          image: familyImg,
          badge: 'Bridal Trousseau',
          badge_hi: 'ब्राइडल सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'विवाह कुर्ती',
          tagline: 'Heirloom brocade & zari embroidered ceremony kurtis',
          tagline_hi: 'ब्रोकेड व जरी एम्ब्रॉयडरी मांगलिक कुर्तियाँ',
          image: haldiImg,
          badge: 'Silk Brocade',
          badge_hi: 'जरी कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'विवाह गाउन',
          tagline: 'Royal crimson & rose gold heritage reception and mandap gowns',
          tagline_hi: 'शाही लाल व रोज़ गोल्ड ट्रेलिंग वेडिंग गाउन',
          image: weddingImg,
          badge: 'Royal Trail',
          badge_hi: 'शाही गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'मंडप कुर्ता',
          tagline: 'Sacred ivory tussar & raw silk kurtas with ceremonial stoles',
          tagline_hi: 'आइवरी टसर व रॉ सिल्क फेरे कुर्ता व साफा',
          image: occasionImg,
          badge: 'Vows Pure Silk',
          badge_hi: 'फेरे कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'शाही शेरवानी',
          tagline: 'Imperial gold Jamawar & beaten zardozi groom sherwanis',
          tagline_hi: 'इंपीरियल गोल्ड जामावार व हाथ की जरदोजी दूल्हा शेरवानी',
          image: sherwaniImg,
          badge: 'Imperial Groom',
          badge_hi: 'दूल्हा शेरवानी',
          query: 'sherwani',
        },
      ],
    },
    {
      id: 'reception',
      name: 'Reception Ceremony',
      name_hi: 'रिसेप्शन सेरेमनी',
      hindiAura: 'शाही रिसेप्शन एवं आधुनिक भव्यता',
      palette: 'Champagne Gold, Deep Wine, Velvet Bandhgalas',
      paletteHex: ['#701A75', '#831843', '#D97706', '#FEF3C7'],
      description: 'Contemporary grandeur, sculpted velvet silhouettes, and opulent champagne gold tones.',
      description_hi: 'आधुनिक भव्यता — मखमली गाउन, जोधपुरी सूट व मेटैलिक साड़ियाँ।',
      bannerTagline: 'Reception Ceremony Special: Grand lehengas, sarees, suits, kurtis, gowns, kurtas & bandhgalas.',
      bannerTagline_hi: 'रॉयल रिसेप्शन के लिए भव्य लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन, कुर्ते व जोधपुरी बंदगला।',
      image: familyImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'रॉयल लहंगा',
          tagline: 'Champagne gold, wine & metallic dust couture lehengas',
          tagline_hi: 'शैम्पेन गोल्ड, वाइन व मेटैलिक डस्ट कूट्यूर लहंगा',
          image: bridalImg,
          badge: 'Champagne Couture',
          badge_hi: 'रिसेप्शन लहंगा',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'रॉयल साड़ी',
          tagline: 'Modern organza tissue & French chantilly border silk sarees',
          tagline_hi: 'टिश्यू सिल्क व मॉडर्न ड्रेप रिसेप्शन साड़ियाँ',
          image: sareeImg,
          badge: 'Tissue Silk',
          badge_hi: 'टिश्यू साड़ी',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'रॉयल सूट',
          tagline: 'Velvet palazzo suits & structured floor-length couture sets',
          tagline_hi: 'वेलवेट पलाज़ो सूट व फ्लोर-लेंथ कूट्यूर सेट्स',
          image: familyImg,
          badge: 'Sculpted Suit',
          badge_hi: 'रॉयल सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'रॉयल कुर्ती',
          tagline: 'High-neck embellished luxury silk evening kurtis',
          tagline_hi: 'हाई-नेक एम्ब्रॉयडर्ड लग्जरी सिल्क इवनिंग कुर्ती',
          image: haldiImg,
          badge: 'Luxury Silk',
          badge_hi: 'इवनिंग कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'रॉयल गाउन',
          tagline: 'Swarovski studded ball-gown trail with structured corsetry',
          tagline_hi: 'स्वरावेस्की कटदाना बॉल-गाउन व ट्रेल स्लीव्स',
          image: weddingImg,
          badge: 'Grand Ball Gown',
          badge_hi: 'ग्रैंड गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'रॉयल कुर्ता',
          tagline: 'Textured Italian silk kurtas with metallic weave jackets',
          tagline_hi: 'इटैलियन सिल्क कुर्ता व मेटैलिक वीव बंडी',
          image: occasionImg,
          badge: 'Italian Silk',
          badge_hi: 'प्रीमियम कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'रॉयल बंदगला / शेरवानी',
          tagline: 'Bespoke velvet tuxedo, Jodhpuri bandhgalas & evening sherwanis',
          tagline_hi: 'जोधपुरी बंदगला, वेलवेट टक्सिडो व इवनिंग शेरवानी',
          image: sherwaniImg,
          badge: 'Bespoke Bandhgala',
          badge_hi: 'जोधपुरी बंदगला',
          query: 'sherwani',
        },
      ],
    },
    {
      id: 'festival',
      name: 'Festival Ceremony',
      name_hi: 'फेस्टिवल सेरेमनी',
      hindiAura: 'मांगल्य एवं पारम्परिक देव पूजन संग्रह',
      palette: 'Pure Banarasi Katan, Tussar, Chanderi Silks',
      paletteHex: ['#EA580C', '#C2410C', '#CA8A04', '#FEF9C3'],
      description: 'Authentic master-woven Banarasi silk sarees, temple borders, and festive cottons.',
      description_hi: 'असली हथकरघा साड़ियाँ, चंदेरी जरी बॉर्डर व पारम्परिक धोती कुर्ता।',
      bannerTagline: 'Festival Ceremony Special: Auspicious lehengas, sarees, suits, kurtis, gowns, kurtas & achkans.',
      bannerTagline_hi: 'दीपावली, करवाचौथ व पूजन हेतु हथकरघा साड़ियाँ, लहंगे, सूट, कुर्ती, गाउन व कुर्ते।',
      image: sareeImg,
      subcategories: [
        {
          id: 'lehenga',
          name: 'Lehenga',
          name_hi: 'फेस्टिव लहंगा',
          tagline: 'Traditional bandhani & festive gotta brocade lightweight lehengas',
          tagline_hi: 'बंधेज, लहरिया व फेस्टिव गोटा ब्रोकेड लहंगा',
          image: bridalImg,
          badge: 'Bandhani Heritage',
          badge_hi: 'बंधेज लहंगा',
          query: 'lehenga',
        },
        {
          id: 'saree',
          name: 'Saree',
          name_hi: 'पूजन साड़ी',
          tagline: 'Sacred temple border Kanjivaram & pure Banarasi weaves',
          tagline_hi: 'मंदिर बॉर्डर कांजीवरम व शुद्ध बनारसी हथकरघा साड़ियाँ',
          image: sareeImg,
          badge: 'Temple Weave',
          badge_hi: 'मंदिर बॉर्डर',
          query: 'saree',
        },
        {
          id: 'suits',
          name: 'Suits',
          name_hi: 'फेस्टिव सूट',
          tagline: 'Chanderi silk straight suits with Banarasi dupattas',
          tagline_hi: 'चंदेरी सिल्क स्ट्रेट सूट व बनारसी दुपट्टा',
          image: familyImg,
          badge: 'Chanderi Classic',
          badge_hi: 'चंदेरी सूट',
          query: 'suit',
        },
        {
          id: 'kurti',
          name: 'Kurti',
          name_hi: 'फेस्टिव कुर्ती',
          tagline: 'Resham embroidery & auspicious red/yellow festive kurtis',
          tagline_hi: 'रेशम कढ़ाईदार लाल व पीले रंग की मांगलिक कुर्तियाँ',
          image: haldiImg,
          badge: 'Festive Classic',
          badge_hi: 'मांगलिक कुर्ती',
          query: 'kurti',
        },
        {
          id: 'gown',
          name: 'Gown',
          name_hi: 'फेस्टिव गाउन',
          tagline: 'Ethnic flare ankle-length floor touch festive gowns',
          tagline_hi: 'पारम्परिक एथनिक एंकल-लेंथ फेस्टिव गाउन',
          image: weddingImg,
          badge: 'Ethnic Flare',
          badge_hi: 'एथनिक गाउन',
          query: 'gown',
        },
        {
          id: 'kurta',
          name: 'Kurta',
          name_hi: 'पूजन कुर्ता',
          tagline: 'Sacred pure cotton-silk & tussar puja kurtas with dhoti',
          tagline_hi: 'पवित्र कॉटन-सिल्क व टसर पूजन कुर्ता एवं धोती',
          image: occasionImg,
          badge: 'Sacred Puja',
          badge_hi: 'पूजा कुर्ता',
          query: 'kurta',
        },
        {
          id: 'sharvani',
          name: 'Sherwani',
          name_hi: 'फेस्टिव शेरवानी / अचकन',
          tagline: 'Subtle handloom brocade achkans & silk jackets for festive gatherings',
          tagline_hi: 'हैंडलूम ब्रोकेड अचकन व रेशमी फेस्टिव शेरवानी',
          image: sherwaniImg,
          badge: 'Handloom Achkan',
          badge_hi: 'फेस्टिव अचकन',
          query: 'sherwani',
        },
      ],
    },
  ];

  const currentOccasion =
    occasions.find(
      (o) => o.id === selectedOccasion || (o.id === 'reception' && selectedOccasion === 'royal')
    ) || occasions[0];

  const subsectionsRef = useRef<HTMLDivElement>(null);

  const handleSelectOccasion = (occId: string) => {
    setSelectedOccasion(occId);
    // Smoothly and automatically reveal sub-sections right in front of user's eyes immediately
    setTimeout(() => {
      if (subsectionsRef.current) {
        const headerOffset = 85;
        const elementPosition = subsectionsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 40);
  };

  const handleSubcategoryClick = (sub: SubcategoryCard) => {
    // Primary Objective: Retrieve item's assigned Instagram Reel, validate destination and redirect
    const reelUrl = getCeremonyReelUrl(sub.id) || getCeremonyReelUrl(sub.query);
    if (reelUrl) {
      const opened = openInstagramReel(reelUrl);
      if (opened) return;
    }

    // Safe fallback if reel URL is missing or cannot be opened
    const matched = products.find((p) => {
      const text = `${p.name} ${p.name_hi || ''} ${p.description || ''} ${p.category_name || ''}`.toLowerCase();
      return text.includes(sub.query) || text.includes(sub.name.toLowerCase());
    });

    if (matched) {
      onViewProduct(matched);
    } else {
      const msg = encodeURIComponent(
        `Namaste Shree Vijay Showroom, I am looking for ${currentOccasion.name} - ${sub.name} collection.`
      );
      window.open(`https://wa.me/918989892476?text=${msg}`, '_blank');
    }
  };

  return (
    <section
      id="occasions"
      className="relative py-20 lg:py-28 bg-[#0D0B0C] text-[#F4EEE4] border-b border-[#B89A5A]/20 overflow-hidden"
    >
      {/* Editorial Ceremonial Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={occasionsBgImg}
          alt="Curated Ceremony Background"
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08] saturate-[1.12] transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://i.pinimg.com/originals/f5/32/2f/f5322f735b693c70b06d5637e19b4752.jpg';
          }}
        />
        {/* Soft, balanced scrims to maintain high background visibility while preserving crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/70 via-[#0A0909]/30 to-[#0A0909]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,9,9,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[#351019]/10 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#B89A5A] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'सेरेमनी एवं मांगलिक उत्सव' : 'OCCASION-FIRST CEREMONIAL STYLING'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EEE4] leading-[1.1]">
            {lang === 'hi' ? 'मांगलिक सेरेमनी संग्रह' : 'Curated by Ceremony'}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#BDB3A5] font-light max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'हल्दी, मेहंदी, संगीत, विवाह मंडप, रिसेप्शन एवं पूजन उत्सव के लिए हर श्रेणी का मुख्य विज़ुअल डिस्प्ले।'
              : 'Select any ceremony below to instantly reveal its dedicated sub-sections: Lehenga, Saree, Suits, Kurti, Gown, Kurta & Sherwani.'}
          </p>

          {/* Ceremony Selectors Bar (Attractive Ceremonial Cards with Photo on Top & Name Below) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mt-8 sm:mt-10">
            {occasions.map((occ, idx) => {
              const isSelected =
                selectedOccasion === occ.id || (occ.id === 'reception' && selectedOccasion === 'royal');
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`group relative flex flex-col items-center p-3 sm:p-4 rounded-xs border transition-all duration-300 cursor-pointer text-center overflow-hidden active:scale-95 ${
                    isSelected
                      ? 'bg-[#351019]/90 border-[#D1B875] ring-2 ring-[#D1B875]/70 shadow-[0_0_24px_rgba(209,184,117,0.35)] scale-[1.03]'
                      : 'bg-[#181516]/85 hover:bg-[#201C1E] border-white/10 hover:border-[#B89A5A]/60 hover:scale-[1.01]'
                  }`}
                  title={`${lang === 'hi' ? occ.name_hi : occ.name} - ${lang === 'hi' ? '७ सब-सेक्शन देखें' : 'View 7 Sub-sections'}`}
                >
                  {/* Top Image Frame according to the ceremony */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full overflow-hidden border-2 mb-3 transition-transform duration-500 ease-out group-hover:scale-105 shadow-xl">
                    <img
                      src={occ.image}
                      alt={occ.name}
                      className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-105 group-hover:scale-110 transition-all duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Subtle gradient wash */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                    {/* Active golden border pulse */}
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-[#D1B875] rounded-full animate-pulse pointer-events-none" />
                    )}

                    {/* Step Tag */}
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 border border-[#B89A5A]/60 flex items-center justify-center text-[10px] text-[#D1B875] font-bold shadow-xs">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* Written ceremony name below image */}
                  <div className="w-full">
                    <span className="block text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors leading-tight">
                      {lang === 'hi' ? occ.name_hi : occ.name}
                    </span>
                    <span className="inline-flex items-center justify-center gap-1 text-[10px] text-[#B89A5A] mt-1 font-mono tracking-wider">
                      <span>7 Sub-sections</span>
                      <span className="text-[9px] text-[#D1B875]">↓</span>
                    </span>
                  </div>

                  {/* Active selection indicator line */}
                  {isSelected ? (
                    <div className="mt-2.5 w-10 h-1 bg-[#D1B875] rounded-full shadow-[0_0_8px_#D1B875]" />
                  ) : (
                    <div className="mt-2.5 w-4 h-0.5 bg-transparent group-hover:bg-[#B89A5A]/50 rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Ceremony Subsections Reveal Container */}
        <div ref={subsectionsRef} id="ceremony-subsections" className="scroll-mt-24 sm:scroll-mt-28">
          {/* Selected Ceremony Header Banner */}
          <div className="bg-gradient-to-r from-[#351019] via-[#4A1724] to-[#181516] text-[#F4EEE4] p-5 sm:p-7 rounded-xs shadow-xl border border-[#B89A5A]/30 mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-2.5 py-0.5 bg-[#B89A5A] text-[#0A0909] rounded-xs">
                {lang === 'hi' ? 'सेरेमनी मुख्य डिस्प्ले' : 'CEREMONY MAIN DISPLAY'}
              </span>
              <span className="text-xs text-[#D1B875] font-editorial italic">
                {currentOccasion.hindiAura}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#F4EEE4]">
              {lang === 'hi' ? currentOccasion.name_hi : currentOccasion.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#BDB3A5] mt-1.5 max-w-2xl font-light">
              {lang === 'hi' ? currentOccasion.bannerTagline_hi : currentOccasion.bannerTagline}
            </p>

            {/* Ceremony Color Palette */}
            <div className="mt-3 flex items-center gap-2 text-xs text-[#BDB3A5]">
              <span className="font-medium text-[#B89A5A]">
                {lang === 'hi' ? 'रंग पैलेट:' : 'Ceremony Palette:'}
              </span>
              <div className="flex items-center gap-1.5">
                {currentOccasion.paletteHex.map((hex, idx) => (
                  <span
                    key={idx}
                    className="w-3.5 h-3.5 rounded-full border border-white/30"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <span className="hidden sm:inline-block">({currentOccasion.palette})</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-[#B89A5A] font-semibold block">
              FLOW OF STYLING
            </span>
            <span className="text-xs text-[#BDB3A5] font-mono mt-1 block">
              7 Curated Categories
            </span>
          </div>
        </div>

        {/* Subcategories Main Display Grid: Image on Top, Details Below */}
        {/* Flow: Lehenga -> Saree -> Suits -> Kurti -> Gown -> Kurta -> Sherwani */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mb-16">
          {currentOccasion.subcategories.map((sub, index) => (
            <div
              key={`${currentOccasion.id}-${sub.id}`}
              onClick={() => handleSubcategoryClick(sub)}
              className="group bg-[#181516] hover:bg-[#201C1E] border border-white/10 hover:border-[#B89A5A]/60 rounded-xs overflow-hidden flex flex-col transition-all duration-500 shadow-md hover:shadow-2xl cursor-pointer hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0909]">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient Wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Subcategory Sequence Marker & Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#B89A5A] text-[#0A0909] text-[10px] font-bold flex items-center justify-center shadow-xs">
                    0{index + 1}
                  </span>
                  <span className="bg-black/80 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#D1B875] font-semibold px-2 py-0.5 border border-[#B89A5A]/40 shadow-xs">
                    {lang === 'hi' ? sub.badge_hi : sub.badge}
                  </span>
                </div>

                {/* Hover Arrow Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#B89A5A] text-[#0A0909] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Subcategory Details Below Image */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left bg-[#181516]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[#B89A5A] font-semibold mb-1">
                    {currentOccasion.name.split(' ')[0]} · {sub.name.toUpperCase()}
                  </div>

                  {/* Subcategory Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4EEE4] group-hover:text-[#D1B875] transition-colors">
                    {lang === 'hi' ? sub.name_hi : sub.name}
                  </h3>

                  {/* Subcategory Tagline */}
                  <p className="text-xs text-[#BDB3A5] mt-2 line-clamp-2 font-light leading-relaxed">
                    {lang === 'hi' ? sub.tagline_hi : sub.tagline}
                  </p>
                </div>

                {/* Bottom Action Prompt */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D1B875] group-hover:text-[#F4EEE4] transition-colors inline-flex items-center gap-1.5">
                    <span>{lang === 'hi' ? 'संग्रह देखें' : 'Explore Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] text-[#BDB3A5] font-mono">
                    SV · JABALPUR
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Ceremony Concierge Assistance Bar */}
        <div className="bg-[#181516] border border-[#B89A5A]/30 p-6 sm:p-8 rounded-xs shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#351019] text-[#D1B875] flex items-center justify-center shrink-0 border border-[#B89A5A]/40">
              <Crown className="w-6 h-6 text-[#B89455]" />
            </div>
            <div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-[#F4EEE4]">
                {lang === 'hi'
                  ? `${currentOccasion.name_hi} हेतु संपूर्ण परिवार का मैचिंग परिधान परामर्श`
                  : `Family Styling & Coordination for ${currentOccasion.name}`}
              </h4>
              <p className="text-xs sm:text-sm text-[#BDB3A5] mt-1 max-w-xl font-light">
                {lang === 'hi'
                  ? 'वर-वधू, माता-पिता एवं भाई-बहन के लिए एक ही थीम और कलर पैलेट में परिधानों का चयन व ऑन-साइट मास्टर ट्रायल।'
                  : 'Coordinate lehengas, sarees, suits, kurtis, gowns, kurtas & sherwanis in synchronized ceremonial palettes at our Bada Fuhara showroom in Jabalpur.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/918989892476?text=${encodeURIComponent(
                `Namaste Shree Vijay Showroom, I want to book an occasion styling consultation for ${currentOccasion.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/50 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>{lang === 'hi' ? 'परामर्श बुक करें' : 'Book Consultation'}</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 bg-transparent text-[#F4EEE4] hover:bg-white/5 border border-[#B89A5A]/40 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B89455]" />
                {lang === 'hi' ? 'स्टोर विजिट' : 'Store Visit'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
