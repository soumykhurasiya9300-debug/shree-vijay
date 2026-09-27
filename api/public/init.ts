import initialData from '../../src/data/initialData.json';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    categories: initialData.categories || [],
    subcategories: initialData.subcategories || [],
    products: initialData.products || [],
    settings: initialData.settings || {},
    sections: initialData.website_sections || [],
    socialLinks: [
      { platform: 'whatsapp', url: 'https://wa.me/918989892476' },
      { platform: 'instagram', url: 'https://www.instagram.com/shree_vijay_showroom' },
      { platform: 'phone', url: 'tel:08989892476' }
    ]
  });
}
