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

  const cleanNum = cardNumber ? String(cardNumber).replace(/^0+/, '') : '';
  const paddedNum = cardNumber ? String(cardNumber) : '';
  const cleanSet = setId ? setId.toLowerCase().trim() : '';

  if (cleanSet && paddedNum) {
    if (preferHighRes) {
      candidates.push(`https://assets.tcgdex.net/en/${cleanSet}/${paddedNum}/high.webp`);
      candidates.push(`https://assets.tcgdex.net/en/${cleanSet}/${paddedNum}/high.png`);
      candidates.push(`https://images.pokemontcg.io/${cleanSet}/${paddedNum}_hires.png`);
    }

    // Fast-path low WebP (ultra-lightweight, loads in ~30-50ms)
    candidates.push(`https://assets.tcgdex.net/en/${cleanSet}/${paddedNum}/low.webp`);
    candidates.push(`https://assets.tcgdex.net/en/${cleanSet}/${paddedNum}/low.png`);
    
    // PokémonTCG.io standard CDN
    candidates.push(`https://images.pokemontcg.io/${cleanSet}/${paddedNum}.png`);
    if (cleanNum !== paddedNum) {
      candidates.push(`https://images.pokemontcg.io/${cleanSet}/${cleanNum}.png`);
    }
  }

  if (src) {
    // If src contains high.png, provide low.webp equivalent first for fast streaming
    if (src.includes('tcgdex.net') && src.includes('/high.')) {
      candidates.unshift(src.replace('/high.png', '/low.webp').replace('/high.webp', '/low.webp'));
    }
    candidates.push(src);
  }

  // Remove duplicates and known failed URLs
  return Array.from(new Set(candidates)).filter((url) => !failedUrlSet.has(url));
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
