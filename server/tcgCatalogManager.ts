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
let lastExpansionsFetchTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

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

const CANONICAL_SET_DATES: Record<string, string> = {
  // Mega Evolution Series
  'me01': '2025-09-19', 'me02': '2025-11-14', 'me02.5': '2026-01-23', 'me03': '2026-03-27', 'me04': '2026-05-22', 'me05': '2026-07-24',
  // Pokémon TCG Pocket
  'tcgp': '2024-10-30', 'a1': '2024-10-30', 'a1a': '2024-12-16', 'a2': '2025-01-30', 'a2a': '2025-02-28',
  'b1': '2024-10-30', 'b1a': '2024-12-16', 'b2': '2025-01-30', 'b2a': '2025-02-28',
  // Scarlet & Violet
  'svp': '2023-01-06', 'sve': '2023-03-31', 'mfb': '2023-09-29',
  'sv01': '2023-03-31', 'sv1': '2023-03-31', 'sv02': '2023-06-09', 'sv2': '2023-06-09',
  'sv03': '2023-08-11', 'sv3': '2023-08-11', 'sv03.5': '2023-09-22', 'sv3.5': '2023-09-22', 'sv3pt5': '2023-09-22',
  'sv04': '2023-11-03', 'sv4': '2023-11-03', 'sv04.5': '2024-01-26', 'sv4.5': '2024-01-26', 'sv4pt5': '2024-01-26',
  'sv05': '2024-03-22', 'sv5': '2024-03-22', 'sv06': '2024-05-24', 'sv6': '2024-05-24',
  'sv06.5': '2024-08-02', 'sv6.5': '2024-08-02', 'sv6pt5': '2024-08-02',
  'sv07': '2024-09-13', 'sv7': '2024-09-13', 'sv08': '2024-11-08', 'sv8': '2024-11-08',
  'sv08.5': '2025-01-17', 'sv8.5': '2025-01-17', 'sv8pt5': '2025-01-17',
  'sv09': '2025-03-28', 'sv9': '2025-03-28', 'sv10': '2025-05-23', 'sv10.5w': '2025-07-18', 'sv10.5b': '2025-07-18',
  // Sword & Shield
  'swshp': '2019-11-15', 'swsh1': '2020-02-07', 'swsh2': '2020-05-01', 'swsh3': '2020-08-14',
  'swsh3.5': '2020-09-25', 'swsh3pt5': '2020-09-25', 'swsh4': '2020-11-13',
  'swsh4.5': '2021-02-19', 'swsh4pt5': '2021-02-19', 'swsh5': '2021-03-19',
  'swsh6': '2021-06-18', 'swsh7': '2021-08-27', 'cel25': '2021-10-08',
  'swsh8': '2021-11-12', 'swsh9': '2022-02-25', 'swsh10': '2022-05-27',
  'swsh10.5': '2022-07-01', 'swsh10pt5': '2022-07-01', 'swsh11': '2022-09-09',
  'swsh12': '2022-11-11', 'swsh12.5': '2023-01-20', 'swsh12pt5': '2023-01-20',
  // Sun & Moon
  'smp': '2016-11-18', 'sm1': '2017-02-03', 'sm2': '2017-05-05', 'sm3': '2017-08-04',
  'sm3.5': '2017-10-06', 'sm3pt5': '2017-10-06', 'sm4': '2017-11-03', 'sm5': '2018-02-02',
  'sm6': '2018-05-04', 'sm7': '2018-08-03', 'sm7.5': '2018-09-07', 'sm7pt5': '2018-09-07',
  'sm8': '2018-11-02', 'sm9': '2019-02-01', 'det': '2019-03-29', 'sm10': '2019-05-03',
  'sm11': '2019-08-02', 'sm11.5': '2019-08-23', 'sm11pt5': '2019-08-23', 'sma': '2019-08-23', 'sm12': '2019-11-01',
  // XY
  'xyp': '2013-10-12', 'xy0': '2013-11-08', 'xy1': '2014-02-05', 'xy2': '2014-05-07', 'xy3': '2014-08-13',
  'xy4': '2014-11-05', 'xy5': '2015-02-04', 'dc1': '2015-03-25', 'xy6': '2015-05-06', 'xy7': '2015-08-12',
  'xy8': '2015-11-04', 'xy9': '2016-02-03', 'gen': '2016-02-22', 'g1': '2016-02-22',
  'xy10': '2016-05-02', 'xy11': '2016-08-03', 'xy12': '2016-11-02',
  // Black & White
  'bwp': '2011-04-25', 'bw1': '2011-04-25', 'bw2': '2011-08-31', 'bw3': '2011-11-16', 'bw4': '2012-02-08',
  'bw5': '2012-05-09', 'bw6': '2012-08-15', 'dv1': '2012-10-05', 'bw7': '2012-11-07', 'bw8': '2013-02-06',
  'bw9': '2013-05-08', 'bw10': '2013-08-14', 'bw11': '2013-11-06',
  // HeartGold & SoulSilver
  'hgp': '2010-02-10', 'hgss1': '2010-02-10', 'hgss2': '2010-05-12', 'hgss3': '2010-08-18', 'hgss4': '2010-11-03', 'col1': '2011-02-09',
  // Diamond & Pearl / Platinum
  'dpp': '2007-05-23', 'dp1': '2007-05-23', 'dp2': '2007-08-22', 'dp3': '2007-11-07', 'dp4': '2008-02-13',
  'dp5': '2008-05-21', 'dp6': '2008-08-20', 'dp7': '2008-11-05', 'pl1': '2009-02-11', 'pl2': '2009-05-16',
  'pl3': '2009-08-19', 'pl4': '2009-11-04',
  // EX Series
  'np': '2003-06-18', 'ex1': '2003-06-18', 'ex2': '2003-09-18', 'ex3': '2003-11-24', 'ex4': '2004-03-15',
  'ex5': '2004-06-14', 'ex6': '2004-08-30', 'ex7': '2004-11-01', 'ex8': '2005-02-14', 'ex9': '2005-05-09',
  'ex10': '2005-08-22', 'ex11': '2005-10-31', 'ex12': '2006-02-13', 'ex13': '2006-05-03', 'ex14': '2006-08-30',
  'ex15': '2006-11-08', 'ex16': '2007-02-14',
  // E-Card Series
  'ecard1': '2002-09-15', 'ecard2': '2003-01-15', 'ecard3': '2003-05-12',
  // Legendary Collection
  'lc': '2002-05-24',
  // Neo Series
  'neo1': '2000-12-16', 'neo2': '2001-06-01', 'si1': '2001-07-31', 'neo3': '2001-09-21', 'neo4': '2002-02-28',
  // Base & Gym Series
  'base1': '1999-01-09', 'base2': '1999-06-16', 'basep': '1999-07-01', 'wp': '1999-09-01', 'base3': '1999-10-10',
  'base4': '2000-02-24', 'base5': '2000-04-24', 'gym1': '2000-08-14', 'gym2': '2000-10-16',
  'miscp': '2000-01-01', 'jumbo': '2000-01-01',
  // POP Series
  'pop1': '2004-09-01', 'pop2': '2005-08-01', 'pop3': '2006-04-01', 'pop4': '2006-08-01', 'pop5': '2007-03-01',
  'pop6': '2007-09-01', 'pop7': '2008-03-01', 'pop8': '2008-09-01', 'pop9': '2009-03-01',
  // Trainer Kits
  'tk1': '2004-09-01', 'tk2': '2006-03-01'
};

function enrichSetMetadata(set: any): TCGSet {
  const idClean = String(set.id || '').toLowerCase().trim();
  const relDate = set.releaseDate || CANONICAL_SET_DATES[idClean] || CANONICAL_SET_DATES[set.id] || '2023-01-01';
  return {
    ...set,
    releaseDate: relDate,
  };
}

// 1. Fetch & Cache Expansions (Sets) with Automatic Dynamic Spooling & Auto-Update
export async function getExpansions(forceRefresh: boolean = false): Promise<TCGSet[]> {
  const now = Date.now();
  const cacheFile = path.join(CACHE_DIR, 'expansions.json');

  if (!forceRefresh && memoryExpansionsCache && memoryExpansionsCache.length > 0 && (now - lastExpansionsFetchTime < CACHE_TTL_MS)) {
    return memoryExpansionsCache;
  }

  if (!forceRefresh && !memoryExpansionsCache && fs.existsSync(cacheFile)) {
    try {
      const stats = fs.statSync(cacheFile);
      const isFresh = now - stats.mtimeMs < CACHE_TTL_MS;
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        memoryExpansionsCache = data.map(enrichSetMetadata);
        lastExpansionsFetchTime = stats.mtimeMs;
        if (!isFresh) {
          // Asynchronously refresh in background if cache is older than TTL
          refreshExpansionsInBackground();
        }
        return memoryExpansionsCache;
      }
    } catch (e) {
      console.warn('Failed to parse cached expansions, re-fetching...');
    }
  }

  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/sets', { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`TCGdex API error: ${res.statusText}`);
    const rawSets: TCGSet[] = await res.json();
    const sets = rawSets.map(enrichSetMetadata);
    
    // Sort by release date / id descending (newest sets first)
    sets.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
    
    memoryExpansionsCache = sets;
    lastExpansionsFetchTime = Date.now();
    fs.writeFileSync(cacheFile, JSON.stringify(sets, null, 2));

    // Dynamic auto-spooling: trigger background pre-caching of newest sets
    spoolLatestSetsInBackground(sets.slice(0, 15));

    return sets;
  } catch (err) {
    console.error('Failed to fetch expansions from TCGdex:', err);
    return (memoryExpansionsCache || []).map(enrichSetMetadata);
  }
}

// Background non-blocking expansion updater
async function refreshExpansionsInBackground() {
  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/sets', { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const rawSets: TCGSet[] = await res.json();
      const sets = rawSets.map(enrichSetMetadata);
      sets.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
      memoryExpansionsCache = sets;
      lastExpansionsFetchTime = Date.now();
      const cacheFile = path.join(CACHE_DIR, 'expansions.json');
      fs.writeFileSync(cacheFile, JSON.stringify(sets, null, 2));
      spoolLatestSetsInBackground(sets.slice(0, 15));
    }
  } catch (e) {}
}

// Spool card lists for latest sets in background
async function spoolLatestSetsInBackground(targetSets: TCGSet[]) {
  for (const set of targetSets) {
    if (!set?.id) continue;
    const safeFileId = set.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cacheFile = path.join(CACHE_DIR, `set_${safeFileId}.json`);
    if (!fs.existsSync(cacheFile)) {
      try {
        const res = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(set.id)}`, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const detail = await res.json();
          if (detail && Array.isArray(detail.cards)) {
            fs.writeFileSync(cacheFile, JSON.stringify(detail, null, 2));
          }
        }
      } catch (err) {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
}

// Automated Periodic Server Metronome (Runs every 30 minutes to auto-poll for new sets)
setInterval(() => {
  refreshExpansionsInBackground();
}, 30 * 60 * 1000);

// Initial bootstrap kick on module load
setTimeout(() => {
  refreshExpansionsInBackground();
}, 2000);

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

// 3.5. Get Set Detail (Cached on disk)
export async function getSetDetail(setId: string): Promise<any> {
  const safeFileId = setId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheFile = path.join(CACHE_DIR, `set_${safeFileId}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (data && Array.isArray(data.cards)) {
        return data;
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(setId)}`);
    if (!res.ok) return null;
    const setDetail = await res.json();
    if (setDetail && Array.isArray(setDetail.cards)) {
      fs.writeFileSync(cacheFile, JSON.stringify(setDetail, null, 2));
    }
    return setDetail;
  } catch (err) {
    console.error(`Failed to fetch set detail for ${setId}:`, err);
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
