/**
 * Central Instagram Reel Registry for Shree Vijay Showroom
 * 
 * Reusable mapping and safe URL resolver for final outfit and subcategory items.
 * Single source of truth across:
 *  - Structure A: Curated by Ceremony (Haldi, Mehendi, Sangeet, Wedding, Royal Reception, Festival & Puja)
 *  - Structure B: Groom Edits
 *  - Structure C: Complete Wedding Collection (Male & Female)
 */

export const INSTAGRAM_REELS = {
  LEHENGA_REEL:
    'https://www.instagram.com/reel/Ddbr3Fgvdqz/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  SAREE_REEL:
    'https://www.instagram.com/reel/DdU8sU3KGpW/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  SUITS_KURTI_REEL:
    'https://www.instagram.com/reel/DYmcAiMPp0g/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  GOWN_REEL:
    'https://www.instagram.com/reel/DdbrDBWvEpD/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  KURTA_REEL:
    'https://www.instagram.com/reel/DYHlMqfPnge/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  SHERWANI_REEL:
    'https://www.instagram.com/reel/DW5QN67igEn/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  INDOWESTERN_REEL:
    'https://www.instagram.com/reel/DXhH0PcjKZY/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  JODHPURI_BANDHGALA_REEL:
    'https://www.instagram.com/reel/DX9QDIUyt-C/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
  BLAZER_BANDHGALA_REEL:
    'https://www.instagram.com/reel/DYpBmf5t9-T/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==',
} as const;

export type ReelKey = keyof typeof INSTAGRAM_REELS;

/**
 * Validates that the provided URL is a safe, non-empty HTTPS Instagram URL.
 */
export function isValidInstagramUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'instagram.com' ||
        parsed.hostname === 'www.instagram.com' ||
        parsed.hostname.endsWith('.instagram.com'))
    );
  } catch {
    return false;
  }
}

/**
 * Safely navigates the browser to the target Instagram Reel URL in a new tab.
 */
export function openInstagramReel(url: string | undefined | null): boolean {
  if (!url || !isValidInstagramUrl(url)) {
    console.warn('Instagram Reel URL not available or invalid:', url);
    return false;
  }

  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback in case popup blocker intercepts
      window.location.assign(url);
    }
    return true;
  } catch (err) {
    console.error('Failed to open Instagram Reel:', err);
    return false;
  }
}

/**
 * Structure A: Curated by Ceremony subcategory mapper.
 * Applied uniformly across all 6 ceremonies (Haldi, Mehendi, Sangeet, Wedding, Royal, Festival).
 */
export function getCeremonyReelUrl(subcategoryIdOrQuery: string): string | null {
  const key = subcategoryIdOrQuery.toLowerCase().trim();
  switch (key) {
    case 'lehenga':
      return INSTAGRAM_REELS.LEHENGA_REEL;
    case 'saree':
      return INSTAGRAM_REELS.SAREE_REEL;
    case 'suits':
    case 'suit':
      return INSTAGRAM_REELS.SUITS_KURTI_REEL;
    case 'kurti':
      return INSTAGRAM_REELS.SUITS_KURTI_REEL;
    case 'gown':
      return INSTAGRAM_REELS.GOWN_REEL;
    case 'kurta':
      return INSTAGRAM_REELS.KURTA_REEL;
    case 'sherwani':
    case 'sharvani':
      return INSTAGRAM_REELS.SHERWANI_REEL;
    default:
      return null;
  }
}

/**
 * Structure B: Groom Edits subcategory mapper.
 */
export function getGroomEditReelUrl(itemId: string): string | null {
  const key = itemId.toLowerCase().trim();
  switch (key) {
    case 'sherwani':
    case 'royal-sherwani':
      return INSTAGRAM_REELS.SHERWANI_REEL;
    case 'indo-western':
    case 'indowestern':
    case 'achkan':
      return INSTAGRAM_REELS.INDOWESTERN_REEL;
    case 'jodhpuri':
    case 'jodhpuri-bandhgala':
    case 'bandhgala':
      return INSTAGRAM_REELS.JODHPURI_BANDHGALA_REEL;
    case 'kurta':
    case 'kurta-bundi':
    case 'kurta-bundi-jacket-set':
      return INSTAGRAM_REELS.KURTA_REEL;
    default:
      return null;
  }
}

/**
 * Structure C: Complete Wedding Collection (Male & Female) subcategory mapper.
 */
export function getFamilyWeddingReelUrl(gender: 'male' | 'female', itemId: string): string | null {
  const key = itemId.toLowerCase().trim();

  if (gender === 'male') {
    switch (key) {
      case 'kurta':
        return INSTAGRAM_REELS.KURTA_REEL;
      case 'sherwani':
      case 'sharvani':
        return INSTAGRAM_REELS.SHERWANI_REEL;
      case 'blazers':
      case 'blazer':
      case 'blazer-bandhgala':
        return INSTAGRAM_REELS.BLAZER_BANDHGALA_REEL;
      case 'indo-western':
      case 'indowestern':
      case 'achkan':
        return INSTAGRAM_REELS.INDOWESTERN_REEL;
      default:
        return null;
    }
  }

  // female
  switch (key) {
    case 'saree':
      return INSTAGRAM_REELS.SAREE_REEL;
    case 'gown':
      return INSTAGRAM_REELS.GOWN_REEL;
    case 'lehenga':
      return INSTAGRAM_REELS.LEHENGA_REEL;
    case 'kurti':
    case 'suits':
    case 'kurti-suits':
    case 'kurti-and-suits':
      return INSTAGRAM_REELS.SUITS_KURTI_REEL;
    default:
      return null;
  }
}
