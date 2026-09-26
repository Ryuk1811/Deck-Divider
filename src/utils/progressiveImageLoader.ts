/**
 * Progressive Card Image Loader & Batch Prewarming Engine
 * 
 * Provides:
 * 1. Fast-path WebP/PNG candidate resolver for Pokémon TCG artwork
 * 2. In-memory resolved image cache
 * 3. Staggered background prefetch queue (loads a steady percentage of cards per second
 *    without locking the network thread or blocking UI rendering)
 */

interface ImageCacheEntry {
  url: string;
  isLoaded: boolean;
  isFailed: boolean;
}

// Global In-Memory Cache for verified image URLs
const resolvedUrlCache = new Map<string, string>();
const failedUrlSet = new Set<string>();
const memoryImageCache = new Map<string, ImageCacheEntry>();

// Prefetch queue for progressive batching
const prefetchQueue: string[] = [];
let isQueueProcessing = false;

// Set mappings between pokemontcg.io and tcgdex path formats
const SET_PATH_MAPPINGS: Record<string, { tcgdexSeries?: string; tcgdexSet?: string; pokemontcgSet?: string }> = {
  '30th': { tcgdexSeries: 'me', tcgdexSet: '30th', pokemontcgSet: '30th' },
  '30th-c': { tcgdexSeries: 'me', tcgdexSet: '30th-c', pokemontcgSet: '30th-c' },
  me01: { tcgdexSeries: 'me', tcgdexSet: 'me01', pokemontcgSet: 'me01' },
  me02: { tcgdexSeries: 'me', tcgdexSet: 'me02', pokemontcgSet: 'me02' },
  'me02.5': { tcgdexSeries: 'me', tcgdexSet: 'me02.5', pokemontcgSet: 'me02.5' },
  me03: { tcgdexSeries: 'me', tcgdexSet: 'me03', pokemontcgSet: 'me03' },
  me04: { tcgdexSeries: 'me', tcgdexSet: 'me04', pokemontcgSet: 'me04' },
  me05: { tcgdexSeries: 'me', tcgdexSet: 'me05', pokemontcgSet: 'me05' },
  b1: { tcgdexSeries: 'tcgp', tcgdexSet: 'B1', pokemontcgSet: 'b1' },
  b1a: { tcgdexSeries: 'tcgp', tcgdexSet: 'B1a', pokemontcgSet: 'b1a' },
  b2: { tcgdexSeries: 'tcgp', tcgdexSet: 'B2', pokemontcgSet: 'b2' },
  b2a: { tcgdexSeries: 'tcgp', tcgdexSet: 'B2a', pokemontcgSet: 'b2a' },
  sv3pt5: { tcgdexSeries: 'sv', tcgdexSet: 'sv03.5', pokemontcgSet: 'sv3pt5' },
  'sv03.5': { tcgdexSeries: 'sv', tcgdexSet: 'sv03.5', pokemontcgSet: 'sv3pt5' },
  '151': { tcgdexSeries: 'sv', tcgdexSet: 'sv03.5', pokemontcgSet: 'sv3pt5' },
  swsh1: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh1', pokemontcgSet: 'swsh1' },
  swsh01: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh1', pokemontcgSet: 'swsh1' },
  swsh2: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh2', pokemontcgSet: 'swsh2' },
  swsh02: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh2', pokemontcgSet: 'swsh2' },
  swsh3: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh3', pokemontcgSet: 'swsh3' },
  swsh03: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh3', pokemontcgSet: 'swsh3' },
  'swsh3.5': { tcgdexSeries: 'swsh', tcgdexSet: 'swsh3.5', pokemontcgSet: 'swsh3.5' },
  swsh4: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh4', pokemontcgSet: 'swsh4' },
  swsh04: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh4', pokemontcgSet: 'swsh4' },
  'swsh4.5': { tcgdexSeries: 'swsh', tcgdexSet: 'swsh4.5', pokemontcgSet: 'swsh4.5' },
  swsh5: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh5', pokemontcgSet: 'swsh5' },
  swsh05: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh5', pokemontcgSet: 'swsh5' },
  swsh6: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh6', pokemontcgSet: 'swsh6' },
  swsh06: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh6', pokemontcgSet: 'swsh6' },
  swsh7: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh7', pokemontcgSet: 'swsh7' },
  swsh07: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh7', pokemontcgSet: 'swsh7' },
  swsh8: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh8', pokemontcgSet: 'swsh8' },
  swsh08: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh8', pokemontcgSet: 'swsh8' },
  swsh9: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh9', pokemontcgSet: 'swsh9' },
  swsh09: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh9', pokemontcgSet: 'swsh9' },
  swsh10: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh10', pokemontcgSet: 'swsh10' },
  'swsh10.5': { tcgdexSeries: 'swsh', tcgdexSet: 'swsh10.5', pokemontcgSet: 'swsh10.5' },
  swsh11: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh11', pokemontcgSet: 'swsh11' },
  swsh12: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh12', pokemontcgSet: 'swsh12' },
  swsh12pt5: { tcgdexSeries: 'swsh', tcgdexSet: 'swsh12.5', pokemontcgSet: 'swsh12pt5' },
  'swsh12.5': { tcgdexSeries: 'swsh', tcgdexSet: 'swsh12.5', pokemontcgSet: 'swsh12pt5' },
  sv1: { tcgdexSeries: 'sv', tcgdexSet: 'sv01', pokemontcgSet: 'sv1' },
  sv01: { tcgdexSeries: 'sv', tcgdexSet: 'sv01', pokemontcgSet: 'sv1' },
  sv2: { tcgdexSeries: 'sv', tcgdexSet: 'sv02', pokemontcgSet: 'sv2' },
  sv02: { tcgdexSeries: 'sv', tcgdexSet: 'sv02', pokemontcgSet: 'sv2' },
  sv3: { tcgdexSeries: 'sv', tcgdexSet: 'sv03', pokemontcgSet: 'sv3' },
  sv03: { tcgdexSeries: 'sv', tcgdexSet: 'sv03', pokemontcgSet: 'sv3' },
  sv4: { tcgdexSeries: 'sv', tcgdexSet: 'sv04', pokemontcgSet: 'sv4' },
  sv04: { tcgdexSeries: 'sv', tcgdexSet: 'sv04', pokemontcgSet: 'sv4' },
  sv4pt5: { tcgdexSeries: 'sv', tcgdexSet: 'sv04.5', pokemontcgSet: 'sv4pt5' },
  'sv04.5': { tcgdexSeries: 'sv', tcgdexSet: 'sv04.5', pokemontcgSet: 'sv4pt5' },
  sv5: { tcgdexSeries: 'sv', tcgdexSet: 'sv05', pokemontcgSet: 'sv5' },
  sv05: { tcgdexSeries: 'sv', tcgdexSet: 'sv05', pokemontcgSet: 'sv5' },
  sv6: { tcgdexSeries: 'sv', tcgdexSet: 'sv06', pokemontcgSet: 'sv6' },
  sv06: { tcgdexSeries: 'sv', tcgdexSet: 'sv06', pokemontcgSet: 'sv6' },
  svp: { tcgdexSeries: 'sv', tcgdexSet: 'svp', pokemontcgSet: 'svp' },
  base1: { tcgdexSeries: 'base', tcgdexSet: 'base1', pokemontcgSet: 'base1' },
};

/**
 * Generates an array of prioritized image candidate URLs
 * (Fastest modern WebP low-res first, followed by fallbacks)
 */
export function getOptimizedCardImageCandidates(
  src?: string,
  setId?: string,
  cardNumber?: string | number,
  preferHighRes: boolean = false
): string[] {
  const candidates: string[] = [];

  // Extract set & card number if not provided explicitly but src matches pokemontcg URL
  let cleanSet = setId ? setId.toLowerCase().trim() : '';
  let rawNum = cardNumber ? String(cardNumber).trim() : '';

  if ((!cleanSet || !rawNum) && src) {
    const ptcgMatch = src.match(/images\.pokemontcg\.io\/([^/]+)\/([a-zA-Z0-9_\-]+)/i);
    if (ptcgMatch) {
      if (!cleanSet) cleanSet = ptcgMatch[1].toLowerCase().trim();
      if (!rawNum) rawNum = ptcgMatch[2];
    }
  }

  // Strip _hires and file extensions from card number
  const paddedNum = rawNum.replace(/_hires$/i, '').replace(/\.(png|jpg|webp)$/i, '');
  const cleanNum = paddedNum.replace(/^0+/, '');

  // 1. WebP / AVIF modern compressed candidates from TCGDex CDN if set and card number exist
  if (cleanSet && paddedNum) {
    const mapping = SET_PATH_MAPPINGS[cleanSet];
    const tSeries =
      mapping?.tcgdexSeries ||
      (cleanSet.startsWith('30th') || cleanSet.startsWith('me')
        ? 'me'
        : cleanSet.startsWith('b1') || cleanSet.startsWith('b2') || cleanSet.startsWith('tcgp')
        ? 'tcgp'
        : cleanSet.startsWith('za')
        ? 'za'
        : cleanSet.startsWith('sv')
        ? 'sv'
        : cleanSet.startsWith('swsh')
        ? 'swsh'
        : undefined);
    
    // Normalizing tcgdexSet: e.g. swsh08 -> swsh8, sv03.5 -> sv03.5
    let tSet = mapping?.tcgdexSet || cleanSet;
    if (tSeries === 'swsh' && /^swsh0\d$/.test(tSet)) {
      tSet = tSet.replace('swsh0', 'swsh');
    }

    if (tSeries && tSet) {
      // Possible number formats in tcgdex (e.g. '004' for SV, '4' for SWSH, or '271')
      const numVariants: string[] = [paddedNum];
      if (cleanNum && cleanNum !== paddedNum) numVariants.push(cleanNum);
      if (tSeries === 'sv' && cleanNum && cleanNum.length < 3) {
        numVariants.unshift(cleanNum.padStart(3, '0'));
      }

      for (const num of numVariants) {
        if (preferHighRes) {
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/high.webp`);
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/high.avif`);
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/high.png`);
        } else {
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/low.webp`);
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/low.avif`);
          candidates.push(`https://assets.tcgdex.net/en/${tSeries}/${tSet}/${num}/low.png`);
        }
      }
    }
  }

  // 2. Direct src if provided (prioritize standard non-hires)
  if (src && !src.includes('cardback.png') && !src.includes('undefined')) {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      if (preferHighRes) {
        if (src.includes('.png') && !src.includes('_hires.png') && src.includes('pokemontcg.io')) {
          candidates.push(src.replace('.png', '_hires.png'));
        }
        candidates.push(src);
      } else {
        if (src.includes('_hires.png')) {
          candidates.push(src.replace('_hires.png', '.png'));
        } else {
          candidates.push(src);
        }
      }
    } else if (src.startsWith('/')) {
      candidates.push(src);
    }
  }

  // 3. pokemontcg.io CDN candidates (Standard PNG fallback)
  if (cleanSet && paddedNum) {
    const mapping = SET_PATH_MAPPINGS[cleanSet];
    const ptcgSet = mapping?.pokemontcgSet || cleanSet;

    candidates.push(`https://images.pokemontcg.io/${ptcgSet}/${paddedNum}.png`);
    if (cleanNum && cleanNum !== paddedNum) {
      candidates.push(`https://images.pokemontcg.io/${ptcgSet}/${cleanNum}.png`);
    }

    candidates.push(`https://images.pokemontcg.io/${cleanSet}/${paddedNum}.png`);

    // ONLY push hires if preferHighRes is explicitly requested
    if (preferHighRes) {
      candidates.push(`https://images.pokemontcg.io/${ptcgSet}/${paddedNum}_hires.png`);
      if (cleanNum && cleanNum !== paddedNum) {
        candidates.push(`https://images.pokemontcg.io/${ptcgSet}/${cleanNum}_hires.png`);
      }
      candidates.push(`https://images.pokemontcg.io/${cleanSet}/${paddedNum}_hires.png`);
    }
  }

  // Remove duplicates and known failed URLs
  const unique = Array.from(new Set(candidates)).filter((url) => !failedUrlSet.has(url));
  return unique;
}

/**
 * Returns the cached working URL if previously resolved
 */
export function getCachedWorkingUrl(cacheKey: string): string | undefined {
  return resolvedUrlCache.get(cacheKey);
}

/**
 * Records a successfully loaded image URL
 */
export function markUrlWorking(cacheKey: string, url: string) {
  resolvedUrlCache.set(cacheKey, url);
  memoryImageCache.set(url, { url, isLoaded: true, isFailed: false });
}

/**
 * Records a failed URL to skip future retries
 */
export function markUrlFailed(url: string) {
  failedUrlSet.add(url);
  const entry = memoryImageCache.get(url);
  if (entry) {
    entry.isFailed = true;
  }
}

/**
 * Pre-warms an individual image URL in the browser memory cache
 */
export function prefetchSingleImage(url: string): Promise<boolean> {
  if (memoryImageCache.get(url)?.isLoaded) {
    return Promise.resolve(true);
  }
  if (failedUrlSet.has(url)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      memoryImageCache.set(url, { url, isLoaded: true, isFailed: false });
      resolve(true);
    };
    img.onerror = () => {
      markUrlFailed(url);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Queue a list of card image candidates for progressive background prewarming.
 * Dispatches a steady stream of ~12-16 images per second so that
 * as the user explores or scrolls, card images are already cached in RAM.
 */
export function queueCardsForProgressivePrewarm(
  cards: Array<{ id: string; images?: { small?: string; large?: string }; set?: { id: string }; number?: string | number }>,
  priority: 'high' | 'normal' = 'normal'
) {
  const newUrls: string[] = [];

  for (const card of cards) {
    const candidates = getOptimizedCardImageCandidates(
      card.images?.small || card.images?.large,
      card.set?.id,
      card.number,
      false
    );
    if (candidates[0] && !memoryImageCache.get(candidates[0])?.isLoaded && !failedUrlSet.has(candidates[0])) {
      newUrls.push(candidates[0]);
    }
  }

  if (priority === 'high') {
    prefetchQueue.unshift(...newUrls);
  } else {
    prefetchQueue.push(...newUrls);
  }

  processPrefetchQueue();
}

/**
 * Continuous staggered scheduler:
 * Processes batches of ~4 images every 250ms (~16 images/second)
 */
function processPrefetchQueue() {
  if (isQueueProcessing || prefetchQueue.length === 0) return;
  isQueueProcessing = true;

  const BATCH_SIZE = 4;
  const INTERVAL_MS = 250;

  const tick = () => {
    if (prefetchQueue.length === 0) {
      isQueueProcessing = false;
      return;
    }

    const batch = prefetchQueue.splice(0, BATCH_SIZE);
    Promise.all(batch.map((url) => prefetchSingleImage(url))).finally(() => {
      setTimeout(tick, INTERVAL_MS);
    });
  };

  tick();
}
