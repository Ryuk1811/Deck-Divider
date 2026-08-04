import MiniSearch from 'minisearch';
import { get, set } from 'idb-keyval';

const CACHE_KEY = 'tcgdex-cards-index-data';
const CACHE_TIME_KEY = 'tcgdex-cards-index-time';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface TCGdexCard {
  id: string;
  localId: string;
  name: string;
  hp?: number;
  types?: string[];
  rarity?: string;
  illustrator?: string;
  image?: string;
  category?: string;
  stage?: string;
  regulationMark?: string;
  legal?: {
    standard?: boolean;
    expanded?: boolean;
  };
  variants?: {
    normal?: boolean;
    reverse?: boolean;
    holo?: boolean;
    firstEdition?: boolean;
    wPrerelease?: boolean;
    secret100?: boolean;
  };
  set?: {
    id: string;
    name: string;
    symbol?: string;
    logo?: string;
  };
}

let miniSearch: MiniSearch<TCGdexCard> | null = null;
let allDocsData: TCGdexCard[] = [];
let isIndexing = false;
let initPromise: Promise<void> | null = null;

export const initSearchEngine = async (): Promise<void> => {
  if (miniSearch) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    isIndexing = true;
    try {
      const lastFetchTime = await get<number>(CACHE_TIME_KEY);
      const now = Date.now();
      let data: TCGdexCard[] | undefined = await get<TCGdexCard[]>(CACHE_KEY);

      if (!data || !lastFetchTime || (now - lastFetchTime > CACHE_DURATION_MS)) {
        // Fetch new data
        const response = await fetch('/api/tcgdex/index-data');
        if (!response.ok) throw new Error('Failed to fetch index data');
        const json = await response.json();
        data = json?.data?.cards || [];
        
        if (data && data.length > 0) {
          // Fire and forget cache update
          set(CACHE_KEY, data).catch(console.error);
          set(CACHE_TIME_KEY, now).catch(console.error);
        }
      }

      if (!data) data = [];
      allDocsData = data;

      miniSearch = new MiniSearch<TCGdexCard>({
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

      miniSearch.addAll(data);
    } catch (error) {
      console.error('Search Engine Initialization Failed:', error);
    } finally {
      isIndexing = false;
    }
  })();

  return initPromise;
};

import { PokemonCard, EnergyType, CardRarity, CardSet } from '../types';

export const mapToPokemonCard = (card: TCGdexCard): PokemonCard => {
  const normalizedTypes = card.types
    ? (card.types.map((t) => (t === 'Lightning' ? 'Electric' : t === 'Metal' ? 'Steel' : t)) as EnergyType[])
    : undefined;

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
    set: {
      id: card.set?.id || 'unknown',
      name: card.set?.name || 'Unknown Set',
      series: 'Unknown',
      printedTotal: 0,
      total: 0,
      releaseDate: '',
      symbolUrl: card.set?.symbol ? `${card.set.symbol}.png` : undefined,
      logoUrl: card.set?.logo ? `${card.set.logo}.png` : undefined,
    },
    artist: card.illustrator || 'Unknown',
    number: card.localId,
    images: {
      small: card.image ? `/api/tcgdex/image${card.image.replace('https://assets.tcgdex.net', '')}/high.webp` : 'https://images.pokemontcg.io/cardback.png',
      large: card.image ? `/api/tcgdex/image${card.image.replace('https://assets.tcgdex.net', '')}/high.webp` : 'https://images.pokemontcg.io/cardback.png',
    },
    prices: {
      raw: generateDeterministicPrice(card.id),
      psa10Estimate: generateDeterministicPrice(card.id) * 3,
      psa9Estimate: generateDeterministicPrice(card.id) * 1.5,
      priceHistory: []
    }
  };
};

const generateDeterministicPrice = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const val = Math.abs(hash) % 10000;
  return Number((val / 100).toFixed(2)) || 0.50;
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

export const getAvailableSets = (): CardSet[] => {
  const setsMap = new Map<string, CardSet>();
  for (const doc of allDocsData) {
    if (doc.set && !setsMap.has(doc.set.id)) {
      setsMap.set(doc.set.id, {
        id: doc.set.id,
        name: doc.set.name,
        series: 'Unknown',
        printedTotal: 0,
        total: 0,
        releaseDate: '',
        symbolUrl: doc.set.symbol ? `/api/tcgdex/image${doc.set.symbol.replace('https://assets.tcgdex.net', '')}.png` : undefined,
        logoUrl: doc.set.logo ? `/api/tcgdex/image${doc.set.logo.replace('https://assets.tcgdex.net', '')}.png` : undefined,
      });
    }
  }
  return Array.from(setsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const searchCards = (filters: SearchFilters): TCGdexCard[] => {
  if (!miniSearch) return [];

  // Filter function applied to all matches (or all documents if no query is provided)
  const filterFn = (result: any) => {
    let match = true;
    if (filters.types && filters.types.length > 0) {
      if (!result.types) {
        match = false;
      } else {
        const expandedFilterTypes = filters.types.flatMap(t => {
          if (t === 'Electric' || t === 'Lightning') return ['Electric', 'Lightning'];
          if (t === 'Steel' || t === 'Metal') return ['Steel', 'Metal'];
          return [t];
        });
        if (!expandedFilterTypes.some(t => result.types.includes(t))) match = false;
      }
    }
    if (filters.category && filters.category !== '') {
      if (!result.category || result.category.toLowerCase() !== filters.category.toLowerCase()) match = false;
    }
    if (filters.stage && filters.stage !== '') {
      if (!result.stage || result.stage.toLowerCase() !== filters.stage.toLowerCase()) match = false;
    }
    if (filters.regulationMark && filters.regulationMark !== '') {
      if (!result.regulationMark || result.regulationMark.toLowerCase() !== filters.regulationMark.toLowerCase()) match = false;
    }
    if (filters.legality) {
      if (!result.legal || !result.legal[filters.legality]) match = false;
    }
    if (filters.variant && filters.variant !== '') {
      if (!result.variants || !result.variants[filters.variant]) match = false;
    }
    if (filters.hpMin !== undefined) {
      if (result.hp === undefined || result.hp < filters.hpMin) match = false;
    }
    if (filters.hpMax !== undefined) {
      if (result.hp === undefined || result.hp > filters.hpMax) match = false;
    }
    if (filters.rarities && filters.rarities.length > 0) {
      if (!result.rarity || !filters.rarities.includes(result.rarity)) match = false;
    }
    if (filters.setId) {
      if (!result.set || result.set.id !== filters.setId) match = false;
    }
    const artistSearch = filters.artist || filters.illustrator;
    if (artistSearch && artistSearch.trim() !== '') {
      if (!result.illustrator || !result.illustrator.toLowerCase().includes(artistSearch.toLowerCase())) match = false;
    }
    
    // Price filtering using deterministic price
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const price = generateDeterministicPrice(result.id);
      if (filters.priceMin !== undefined && price < filters.priceMin) match = false;
      if (filters.priceMax !== undefined && price > filters.priceMax) match = false;
    }

    return match;
  };

  if (filters.query && filters.query.trim().length > 0) {
    // Text search + filtering
    const searchResults = miniSearch.search(filters.query, {
      prefix: true,
      fuzzy: 0.2,
      filter: filterFn,
    });
    // miniSearch.search returns matching items with id, score, match, and stored fields
    return searchResults.map(r => {
      const { id, score, match, terms, ...rest } = r;
      return { id, ...rest } as unknown as TCGdexCard;
    });
  } else {
    // If no query, we filter directly on the raw data
    const results: TCGdexCard[] = [];
    for (const doc of allDocsData) {
       if (filterFn(doc)) {
         results.push(doc);
       }
       if (results.length > 300) break; // Limit to 300 to prevent rendering freezes
    }
    return results;
  }
};
