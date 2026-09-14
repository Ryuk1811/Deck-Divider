import MiniSearch from 'minisearch';
import { get, set } from 'idb-keyval';
import { FALLBACK_CARDS, RawFallbackCard } from '../data/fallbackCards';

const CACHE_KEY = 'tcgdex-cards-index-data';
const CACHE_TIME_KEY = 'tcgdex-cards-index-time';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface TCGdexCard extends RawFallbackCard {}

let miniSearch: MiniSearch<TCGdexCard> | null = null;
let allDocsData: TCGdexCard[] = [...FALLBACK_CARDS];
let isIndexing = false;
let initPromise: Promise<void> | null = null;

function setupMiniSearch(data: TCGdexCard[]) {
  const ms = new MiniSearch<TCGdexCard>({
    fields: ['name', 'types', 'rarity', 'illustrator', 'localId', 'set.name', 'category', 'stage'],
    storeFields: [
      'id', 'localId', 'name', 'hp', 'types', 'rarity', 'illustrator', 'image',
      'category', 'stage', 'regulationMark', 'legal', 'variants', 'set'
    ],
    extractField: (document, fieldName) => {
      if (fieldName === 'set.name') return document.set?.name;
      return document[fieldName as keyof TCGdexCard];
    }
  });
  ms.addAll(data);
  return ms;
}

// Pre-initialize synchronously with fallback cards so search and sets are ready instantly
if (!miniSearch) {
  miniSearch = setupMiniSearch(allDocsData);
}

export const initSearchEngine = async (): Promise<void> => {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    isIndexing = true;
    try {
      // 1. Try local IndexedDB cache first
      let hasIDB = false;
      try {
        hasIDB = typeof window !== 'undefined' && !!window.indexedDB;
      } catch (e) {}
      let data: TCGdexCard[] | undefined;
      let lastFetchTime: number | undefined;
      try {
        if (hasIDB) { data = await get<TCGdexCard[]>(CACHE_KEY);
        lastFetchTime = await get<number>(CACHE_TIME_KEY); }
      } catch (e) {
        console.warn("IDB get failed", e);
      }
      
      const now = Date.now();

      if (data && data.length > 0) {
        allDocsData = data;
        miniSearch = setupMiniSearch(data);
      }

      // 2. Fetch fresh catalog in background if expired or empty with a 6-second timeout
      if (!data || !lastFetchTime || (now - lastFetchTime > CACHE_DURATION_MS)) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {
          const response = await fetch('/api/tcgdex/index-data', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (response.ok) {
            const json = await response.json();
            const fetchedCards: TCGdexCard[] = json?.data?.cards || [];
            if (fetchedCards && fetchedCards.length > 0) {
              allDocsData = fetchedCards;
              miniSearch = setupMiniSearch(fetchedCards);
              if (hasIDB) { try { set(CACHE_KEY, fetchedCards).catch(() => {}); } catch(e) {}
              try { set(CACHE_TIME_KEY, now).catch(() => {}); } catch(e) {} }
            }
          }
        } catch (fetchErr) {
          // Network timeout or error - continue with loaded data or fallback cards
          clearTimeout(timeoutId);
        }
      }
    } catch (error) {
      console.warn('Search Engine Background Sync Notice:', error);
    } finally {
      isIndexing = false;
    }
  })();

  return initPromise;
};

import { PokemonCard, EnergyType, CardRarity, CardSet } from '../types';
import { normalizeSet, sortSetsChronologically } from '../utils/setCategorizer';
import { getPokemonSpeciesTypes } from '../data/pokemonSpeciesTypes';

export const mapToPokemonCard = (card: TCGdexCard): PokemonCard => {
  const isTrainerOrEnergy = card.category && ['trainer', 'energy', 'item', 'supporter', 'stadium'].some(c => card.category?.toLowerCase().includes(c));
  const speciesTypes = isTrainerOrEnergy
    ? (card.types as EnergyType[] | undefined)
    : (getPokemonSpeciesTypes(card.name, card.category, card.types) as EnergyType[]);

  const normalizedTypes = speciesTypes && speciesTypes.length > 0
    ? speciesTypes
    : card.types ? (Array.from(new Set(card.types)) as EnergyType[]) : undefined;

  return {
    id: card.id,
    name: card.name,
    supertype: card.category || 'Pokémon',
    subtypes: card.stage ? [card.stage] : [],
    category: card.category,
    stage: card.stage,
    hp: card.hp,
    types: normalizedTypes,
    rarity: (card.rarity as CardRarity) || 'Common',
    regulationMark: card.regulationMark,
    legalities: card.legal ? {
      standard: Boolean(card.legal.standard),
      expanded: Boolean(card.legal.expanded)
    } : undefined,
    variants: card.variants ? {
      normal: Boolean(card.variants.normal),
      reverse: Boolean(card.variants.reverse),
      holo: Boolean(card.variants.holo),
      firstEdition: Boolean(card.variants.firstEdition),
      wPrerelease: Boolean(card.variants.wPrerelease),
      secret100: Boolean(card.variants.secret100),
    } : undefined,
    set: normalizeSet(
      card.set
        ? {
            id: card.set.id,
            name: card.set.name,
            symbolUrl: card.set.symbol
              ? `/api/tcgdex/image${card.set.symbol.replace('https://assets.tcgdex.net', '')}.png`
              : undefined,
            logoUrl: card.set.logo
              ? `/api/tcgdex/image${card.set.logo.replace('https://assets.tcgdex.net', '')}.png`
              : undefined,
          }
        : { id: 'unknown', name: 'Unknown Set' }
    ),
    artist: card.illustrator || 'Unknown',
    number: card.localId,
    images: {
      small: card.image
        ? (card.image.startsWith('http')
            ? card.image
            : `https://assets.tcgdex.net${card.image}/low.webp`)
        : 'https://images.pokemontcg.io/cardback.png',
      large: card.image
        ? (card.image.startsWith('http')
            ? card.image
            : `https://assets.tcgdex.net${card.image}/high.webp`)
        : 'https://images.pokemontcg.io/cardback.png',
    },
    prices: {
      raw: generateRealisticCardPrice(card.id, card),
      psa10Estimate: Number((generateRealisticCardPrice(card.id, card) * 3.2).toFixed(2)),
      psa9Estimate: Number((generateRealisticCardPrice(card.id, card) * 1.6).toFixed(2)),
      priceHistory: generatePriceHistory(card.id, generateRealisticCardPrice(card.id, card))
    }
  };
};

export const generatePriceHistory = (cardId: string, basePrice: number, daysCount: number = 30): { date: string; price: number }[] => {
  const points: { date: string; price: number }[] = [];
  const now = new Date();
  
  // Hash function helper for deterministic noise
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    hash = ((hash << 5) - hash) + cardId.charCodeAt(i);
    hash |= 0;
  }

  // Create smooth trend curve leading up to basePrice today
  const trendSlope = (((Math.abs(hash) % 20) - 10) / 100); // -10% to +10% overall 30d movement
  
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Sine wave + pseudo noise
    const dayProgress = (daysCount - 1 - i) / (daysCount - 1);
    const noise = Math.sin((i + Math.abs(hash % 17)) * 0.7) * 0.04;
    const factor = 1 - (1 - dayProgress) * trendSlope + noise;
    
    const calculatedPrice = Number(Math.max(0.10, basePrice * factor).toFixed(2));
    points.push({ date: dateStr, price: calculatedPrice });
  }

  return points;
};

// Known iconic card prices for benchmark accuracy
const KNOWN_ICONIC_PRICES: Record<string, number> = {
  'sv3pt5-199': 148.50, // Charizard ex SIR 151
  'swsh7-215': 985.00,  // Umbreon VMAX Alt (Moonbreon)
  'swsh8-271': 420.00,  // Gengar VMAX Alt
  'swsh11-177': 440.00, // Giratina V Alt
  'swsh11-186': 440.00, // Giratina V Alt Alt
  'swsh12-186': 215.00, // Lugia V Alt
  'sv4pt5-232': 135.00, // Bubble Mew ex SIR
  'svp-085': 245.00,    // Pikachu Grey Felt Hat
  'sv3pt5-200': 68.00,  // Blastoise ex SIR 151
  'sv3pt5-198': 58.00,  // Venusaur ex SIR 151
  'sv2-269': 82.00,     // Iono SIR
  'sv3-225': 28.00,     // Pidgeot ex SIR
  'sv5-157': 24.50,     // Prime Catcher
  'sv1-249': 22.00,     // Arven SIR
  'base1-4': 320.00,    // Base Set Charizard Holo
  'base1-2': 85.00,     // Base Set Blastoise Holo
  'base1-15': 75.00,    // Base Set Venusaur Holo
  'sv3pt5-025': 18.50,  // Pikachu 151 IR
  'sv3pt5-151': 14.00,  // Mew ex Ultra Rare
  'sv4-182': 62.00,     // Roaring Moon ex SIR
  'sv4-251': 38.00,     // Iron Valiant ex SIR
  'sv1-086': 42.00,     // Gardevoir ex SIR
  'sv1-185': 8.50,      // Professor's Research
  'sv2-185': 26.00,     // Iono Ultra Rare
};

export const generateRealisticCardPrice = (id: string, card?: Partial<TCGdexCard>): number => {
  if (KNOWN_ICONIC_PRICES[id]) {
    return KNOWN_ICONIC_PRICES[id];
  }

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const variance = (Math.abs(hash) % 100) / 100; // 0.00 to 0.99

  const rarity = card?.rarity || 'Common';
  const category = card?.category || 'Pokémon';

  if (rarity === 'Special Illustration Rare' || rarity === 'Alternate Art') {
    return Number((35.00 + variance * 95.00).toFixed(2));
  }
  if (rarity === 'Secret Rare' || rarity === 'Hyper Rare') {
    return Number((22.00 + variance * 65.00).toFixed(2));
  }
  if (rarity === 'Illustration Rare' || rarity === 'Trainer Gallery') {
    return Number((6.50 + variance * 28.00).toFixed(2));
  }
  if (rarity === 'Ultra Rare' || rarity === 'Double Rare' || rarity === 'Radiant Rare') {
    return Number((3.50 + variance * 12.00).toFixed(2));
  }
  if (rarity === 'Rare Holo' || rarity === 'Rare') {
    return Number((1.20 + variance * 3.50).toFixed(2));
  }
  if (rarity === 'Uncommon') {
    return Number((0.35 + variance * 0.90).toFixed(2));
  }
  if (category === 'Energy' || category === 'Trainer') {
    return Number((0.20 + variance * 0.70).toFixed(2));
  }

  // Standard Common
  return Number((0.15 + variance * 0.45).toFixed(2));
};

const generateDeterministicPrice = (id: string): number => {
  return generateRealisticCardPrice(id);
};

export interface SearchFilters {
  query?: string;
  types?: string[];
  category?: string;
  stage?: string;
  hpMin?: number;
  hpMax?: number;
  priceMin?: number;
  priceMax?: number;
  rarities?: string[];
  artist?: string;
  illustrator?: string;
  setId?: string;
  regulationMark?: string;
  variant?: string;
  legality?: 'standard' | 'expanded';
}

export const getCardByIdFromEngine = (id: string): TCGdexCard | null => {
  const doc = allDocsData.find((d) => d.id === id);
  return doc || null;
};

export const getAvailableSets = (): CardSet[] => {
  const setsMap = new Map<string, CardSet>();
  for (const doc of allDocsData) {
    if (doc.set && !setsMap.has(doc.set.id)) {
      const normalized = normalizeSet({
        id: doc.set.id,
        name: doc.set.name,
        symbolUrl: doc.set.symbol ? `/api/tcgdex/image${doc.set.symbol.replace('https://assets.tcgdex.net', '')}.png` : undefined,
        logoUrl: doc.set.logo ? `/api/tcgdex/image${doc.set.logo.replace('https://assets.tcgdex.net', '')}.png` : undefined,
      });
      setsMap.set(doc.set.id, normalized);
    }
  }
  return sortSetsChronologically(Array.from(setsMap.values()));
};

function normalizeText(str?: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const getCardById = (id: string): TCGdexCard | undefined => {
  return allDocsData.find(c => c.id === id);
};

export const searchCards = (filters: SearchFilters): TCGdexCard[] => {
  const normCategory = normalizeText(filters.category);
  const normStage = normalizeText(filters.stage);
  const normReg = normalizeText(filters.regulationMark);
  const normArtist = normalizeText(filters.artist || filters.illustrator);
  const normVariant = normalizeText(filters.variant);

  // Robust filter function applied to documents
  const filterFn = (doc: any): boolean => {
    if (!doc) return false;

    // 1. Type matching (Species types and energy types)
    if (filters.types && filters.types.length > 0) {
      const speciesTypes = getPokemonSpeciesTypes(doc.name, doc.category, doc.types);
      const allTypes = [...(speciesTypes || []), ...(Array.isArray(doc.types) ? doc.types : [])];
      if (allTypes.length === 0) {
        return false;
      }
      const hasMatchingType = filters.types.some((reqType) =>
        allTypes.some((cardType: string) => {
          if (cardType.toLowerCase() === reqType.toLowerCase()) return true;
          if (reqType === 'Electric' && cardType === 'Lightning') return true;
          if (reqType === 'Dark' && cardType === 'Darkness') return true;
          if (reqType === 'Steel' && cardType === 'Metal') return true;
          if (reqType === 'Normal' && cardType === 'Colorless') return true;
          return false;
        })
      );
      if (!hasMatchingType) return false;
    }

    // 2. Category matching ('Pokemon' matches 'Pokémon')
    if (normCategory) {
      const docCategory = normalizeText(doc.category);
      if (docCategory !== normCategory) return false;
    }

    // 3. Stage matching
    if (normStage) {
      const docStage = normalizeText(doc.stage);
      if (normStage === 'ex') {
        const isEx = docStage.includes('ex') || normalizeText(doc.name).includes(' ex');
        if (!isEx) return false;
      } else if (docStage !== normStage) {
        return false;
      }
    }

    // 4. Regulation mark
    if (normReg) {
      const docReg = normalizeText(doc.regulationMark);
      if (docReg !== normReg) return false;
    }

    // 5. Legality
    if (filters.legality) {
      if (filters.legality === 'standard') {
        if (doc.regulationMark) {
          const reg = doc.regulationMark.toUpperCase();
          if (!['H', 'I', 'J'].includes(reg)) {
            return false;
          }
        } else if (!doc.legal || !doc.legal.standard) {
          return false;
        }
      } else {
        if (!doc.legal || !doc.legal[filters.legality]) return false;
      }
    }

    // 6. Variant
    if (normVariant) {
      if (!doc.variants) return false;
      const key = filters.variant as keyof typeof doc.variants;
      if (!doc.variants[key]) return false;
    }

    // 7. HP range
    if (filters.hpMin !== undefined) {
      const hp = typeof doc.hp === 'number' ? doc.hp : parseInt(String(doc.hp || 0), 10);
      if (isNaN(hp) || hp < filters.hpMin) return false;
    }
    if (filters.hpMax !== undefined) {
      const hp = typeof doc.hp === 'number' ? doc.hp : parseInt(String(doc.hp || 0), 10);
      if (isNaN(hp) || hp > filters.hpMax) return false;
    }

    // 8. Rarity
    if (filters.rarities && filters.rarities.length > 0) {
      if (!doc.rarity || !filters.rarities.some((r) => r.toLowerCase() === (doc.rarity || '').toLowerCase())) {
        return false;
      }
    }

    // 9. Set ID
    if (filters.setId) {
      if (!doc.set || doc.set.id !== filters.setId) return false;
    }

    // 10. Artist / Illustrator
    if (normArtist) {
      const docArtist = normalizeText(doc.illustrator);
      if (!docArtist.includes(normArtist)) return false;
    }

    // 11. Price filtering using deterministic price calculation
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const price = generateDeterministicPrice(doc.id);
      if (filters.priceMin !== undefined && price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && price > filters.priceMax) return false;
    }

    return true;
  };

  const rawQuery = (filters.query || '').trim();

  // If a text query is present
  if (rawQuery.length > 0) {
    let results: TCGdexCard[] = [];

    // Try MiniSearch first
    if (miniSearch) {
      try {
        const miniSearchResults = miniSearch.search(rawQuery, {
          prefix: true,
          fuzzy: 0.2,
          combineWith: 'OR',
          filter: filterFn,
        });

        if (miniSearchResults && miniSearchResults.length > 0) {
          results = miniSearchResults.map((r) => {
            const { id, score, match, terms, ...rest } = r;
            return { id, ...rest } as unknown as TCGdexCard;
          });
        }
      } catch (err) {
        console.warn('MiniSearch fallback to token scan:', err);
      }
    }

    // If MiniSearch returned nothing or failed, perform high-performance token substring matching
    if (results.length === 0) {
      const queryTokens = normalizeText(rawQuery).split(/\s+/).filter(Boolean);
      results = allDocsData.filter((doc) => {
        if (!filterFn(doc)) return false;
        const searchableCorpus = normalizeText(
          `${doc.name || ''} ${doc.set?.name || ''} ${doc.localId || ''} ${doc.illustrator || ''} ${doc.category || ''} ${doc.stage || ''} ${doc.rarity || ''} ${(doc.types || []).join(' ')}`
        );
        return queryTokens.every((token) => searchableCorpus.includes(token));
      });
    }

    return results;
  }

  // If no text query, filter directly on all documents
  const results: TCGdexCard[] = [];
  for (const doc of allDocsData) {
     if (filterFn(doc)) {
       results.push(doc);
     }
     if (results.length > 300) break; // Limit to 300 to prevent rendering freezes
  }
  return results;
};
