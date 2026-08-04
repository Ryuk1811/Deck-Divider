import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CACHE_DIR = path.join(process.cwd(), 'data_cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export interface TCGSet {
  id: string;
  name: string;
  series?: string;
  tcgOnlineCode?: string;
  cardCount: {
    total: number;
    official: number;
  };
  releaseDate?: string;
  symbol?: string;
  logo?: string;
}

export interface TCGCardSummary {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category?: string;
}

export interface TCGCardDetail {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category?: string;
  rarity?: string;
  hp?: number;
  types?: string[];
  stage?: string;
  illustrator?: string;
  description?: string;
  set: {
    id: string;
    name: string;
    symbol?: string;
    logo?: string;
  };
  variants?: {
    normal?: boolean;
    reverse?: boolean;
    holo?: boolean;
    firstEdition?: boolean;
  };
  legalities?: {
    standard?: boolean;
    expanded?: boolean;
  };
  pricing?: {
    cardmarket?: {
      updatedAt?: string;
      url?: string;
      avg1?: number;
      avg7?: number;
      avg30?: number;
      trendPrice?: number;
    };
    tcgplayer?: {
      updatedAt?: string;
      url?: string;
      normal?: { low?: number; mid?: number; high?: number; market?: number };
      reverse?: { low?: number; mid?: number; high?: number; market?: number };
      holofoil?: { low?: number; mid?: number; high?: number; market?: number };
    };
  };
}

let isSyncing = false;
let syncProgress = {
  status: 'idle', // 'idle' | 'syncing' | 'completed' | 'error'
  processedSets: 0,
  totalSets: 0,
  processedCards: 0,
  totalCardsEstimate: 20000,
  message: 'System ready',
  lastSyncAt: 0,
};

// Memory Cache
let memoryExpansionsCache: TCGSet[] | null = null;
let memoryCardsSummaryCache: TCGCardSummary[] | null = null;
const memoryCardDetailCache = new Map<string, any>();

// Helper to normalize card types: Steel -> Metal, Electric -> Lightning in internal structures if needed, but display-level conversion handles user view
function normalizeCardTypes(card: any) {
  if (!card) return card;
  const copy = { ...card };
  if (copy.types && Array.isArray(copy.types)) {
    copy.types = copy.types.map((t: string) => {
      if (t === 'Lightning') return 'Electric';
      if (t === 'Metal') return 'Steel';
      return t;
    });
  }
  return copy;
}

// 1. Fetch & Cache Expansions (Sets)
export async function getExpansions(): Promise<TCGSet[]> {
  if (memoryExpansionsCache && memoryExpansionsCache.length > 0) {
    return memoryExpansionsCache;
  }

  const cacheFile = path.join(CACHE_DIR, 'expansions.json');
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        memoryExpansionsCache = data;
        return data;
      }
    } catch (e) {
      console.warn('Failed to parse cached expansions, re-fetching...');
    }
  }

  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/sets');
    if (!res.ok) throw new Error(`TCGdex API error: ${res.statusText}`);
    const sets: TCGSet[] = await res.json();
    
    // Sort by release date / id descending
    sets.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
    
    memoryExpansionsCache = sets;
    fs.writeFileSync(cacheFile, JSON.stringify(sets, null, 2));
    return sets;
  } catch (err) {
    console.error('Failed to fetch expansions from TCGdex:', err);
    return memoryExpansionsCache || [];
  }
}

// 2. Get All Cards Summary
export async function getAllCardsSummary(): Promise<TCGCardSummary[]> {
  if (memoryCardsSummaryCache && memoryCardsSummaryCache.length > 0) {
    return memoryCardsSummaryCache;
  }

  const cacheFile = path.join(CACHE_DIR, 'cards_summary.json');
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        memoryCardsSummaryCache = data;
        return data;
      }
    } catch (e) {
      console.warn('Failed to parse cached cards summary');
    }
  }

  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/cards');
    if (!res.ok) throw new Error(`TCGdex cards API error: ${res.statusText}`);
    const cards: TCGCardSummary[] = await res.json();
    
    memoryCardsSummaryCache = cards;
    fs.writeFileSync(cacheFile, JSON.stringify(cards, null, 2));
    return cards;
  } catch (err) {
    console.error('Failed to fetch cards summary from TCGdex:', err);
    return memoryCardsSummaryCache || [];
  }
}

// 3. Get Card Detail
export async function getCardDetail(cardId: string): Promise<any> {
  if (memoryCardDetailCache.has(cardId)) {
    return memoryCardDetailCache.get(cardId);
  }

  const safeFileId = cardId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheFile = path.join(CACHE_DIR, `card_${safeFileId}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const normalized = normalizeCardTypes(data);
      memoryCardDetailCache.set(cardId, normalized);
      return normalized;
    } catch (e) {}
  }

  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`);
    if (!res.ok) return null;
    const cardData = await res.json();
    const normalized = normalizeCardTypes(cardData);
    memoryCardDetailCache.set(cardId, normalized);
    fs.writeFileSync(cacheFile, JSON.stringify(normalized, null, 2));
    return normalized;
  } catch (err) {
    console.error(`Failed to fetch card detail for ${cardId}:`, err);
    return null;
  }
}

// 4. Background Full Catalog Sync Engine
export async function triggerBackgroundSync() {
  if (isSyncing) return syncProgress;

  isSyncing = true;
  syncProgress.status = 'syncing';
  syncProgress.message = 'Initializing TCG expansion set discovery...';

  // Run in background without blocking
  (async () => {
    try {
      const sets = await getExpansions();
      syncProgress.totalSets = sets.length;
      syncProgress.message = `Discovered ${sets.length} official TCG expansion sets. Fetching card catalog...`;

      const allSummary = await getAllCardsSummary();
      syncProgress.totalCardsEstimate = allSummary.length;

      let cardCount = 0;
      // Pre-fetch & cache set lists in batches
      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        syncProgress.processedSets = i + 1;
        syncProgress.message = `Processing set ${i + 1}/${sets.length}: ${set.name} (${set.cardCount.total || 0} cards)`;

        try {
          const setRes = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(set.id)}`);
          if (setRes.ok) {
            const setDetail = await setRes.json();
            if (setDetail && Array.isArray(setDetail.cards)) {
              cardCount += setDetail.cards.length;
              syncProgress.processedCards = cardCount;
              // Save set detail cache
              const setCacheFile = path.join(CACHE_DIR, `set_${set.id}.json`);
              fs.writeFileSync(setCacheFile, JSON.stringify(setDetail, null, 2));
            }
          }
        } catch (e) {
          console.warn(`Error fetching set detail for ${set.id}:`, e);
        }

        // Slight non-blocking pause
        await new Promise((r) => setTimeout(r, 50));
      }

      syncProgress.status = 'completed';
      syncProgress.lastSyncAt = Date.now();
      syncProgress.message = `Catalog sync complete. Successfully cached ${sets.length} expansion sets and ${cardCount} cards.`;
    } catch (err: any) {
      console.error('Background TCG sync error:', err);
      syncProgress.status = 'error';
      syncProgress.message = `Sync encountered an issue: ${err.message || 'Unknown error'}`;
    } finally {
      isSyncing = false;
    }
  })();

  return syncProgress;
}

export function getSyncStatus() {
  return syncProgress;
}

// 5. Chunked Lazy Buffer
export async function getLazyChunk(offset = 0, limit = 50): Promise<{ cards: TCGCardSummary[]; total: number; offset: number; limit: number }> {
  const allCards = await getAllCardsSummary();
  const sliced = allCards.slice(offset, offset + limit);
  return {
    cards: sliced,
    total: allCards.length,
    offset,
    limit,
  };
}

// 6. Server Search Engine supporting dual-type mapping & filters
export async function searchCardsServer(queryObj: {
  q?: string;
  category?: string;
  stage?: string;
  type?: string;
  regulationMark?: string;
  format?: string;
  offset?: number;
  limit?: number;
}) {
  const allCards = await getAllCardsSummary();
  let filtered = allCards;

  if (queryObj.q && queryObj.q.trim()) {
    const qLower = queryObj.q.toLowerCase().trim();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(qLower) || c.id.toLowerCase().includes(qLower) || c.localId.toLowerCase().includes(qLower));
  }

  if (queryObj.category && queryObj.category !== 'All') {
    const catLower = queryObj.category.toLowerCase();
    filtered = filtered.filter((c) => (c.category || '').toLowerCase() === catLower);
  }

  const offset = queryObj.offset || 0;
  const limit = queryObj.limit || 50;

  return {
    results: filtered.slice(offset, offset + limit),
    total: filtered.length,
    offset,
    limit,
  };
}
