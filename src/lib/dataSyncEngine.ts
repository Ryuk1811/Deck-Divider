import {
  idbGetAllExpansions,
  idbSaveExpansions,
  idbGetCardsBySet,
  idbSaveCards,
  idbGetCardById,
  idbGetSyncMeta,
  idbUpdateSyncMeta,
  idbGetCardCount,
  idbGetExpansionCount,
} from './indexedDB';
import { CardSet, PokemonCard, EnergyType } from '../types';
import { normalizeSet, sortSetsChronologically } from '../utils/setCategorizer';

export interface SyncProgressState {
  isSyncing: boolean;
  progress: number;
  message: string;
  cardCount: number;
  expansionCount: number;
}

type SyncListener = (state: SyncProgressState) => void;
const syncListeners = new Set<SyncListener>();

export function subscribeToSyncProgress(listener: SyncListener) {
  syncListeners.add(listener);
  return () => {
    syncListeners.delete(listener);
  };
}

function notifySyncListeners(state: SyncProgressState) {
  syncListeners.forEach((l) => l(state));
}

// Helper to format image URLs
function formatTCGdexImage(imageStr?: string, quality: 'low' | 'high' = 'low'): string {
  if (!imageStr) return 'https://images.pokemontcg.io/cardback.png';
  if (imageStr.includes('pokemontcg.io')) {
    if (quality === 'high' && !imageStr.includes('_hires.png') && imageStr.endsWith('.png')) {
      return imageStr.replace('.png', '_hires.png');
    }
    if (quality === 'low' && imageStr.includes('_hires.png')) {
      return imageStr.replace('_hires.png', '.png');
    }
    return imageStr;
  }
  if (imageStr.includes('/high.') || imageStr.includes('/low.')) return imageStr;
  const clean = imageStr.replace(/\.(png|webp|jpg)$/i, '');
  return `${clean}/${quality}.webp`;
}

// Map TCGdex Set schema to app CardSet schema
function mapTCGdexSet(set: any): CardSet {
  return normalizeSet(set);
}

// Map TCGdex Card detail schema to app PokemonCard schema
export function mapTCGdexCard(card: any): PokemonCard {
  // Normalize types: Lightning -> Electric, Metal -> Steel, Darkness -> Dark
  const rawTypes = card.types || [];
  const normalizedTypes = rawTypes.map((t: string) => {
    if (t === 'Lightning') return 'Electric';
    if (t === 'Metal') return 'Steel';
    if (t === 'Darkness') return 'Dark';
    return t;
  }) as EnergyType[];

  const hpVal = typeof card.hp === 'number' ? card.hp : parseInt(String(card.hp || 0), 10) || undefined;

  const smallImage = formatTCGdexImage(card.image, 'low');
  const largeImage = formatTCGdexImage(card.image, 'high');

  return {
    id: card.id,
    name: card.name,
    supertype: card.category === 'Pokemon' || card.category === 'Pokémon' ? 'Pokémon' : card.category || 'Pokémon',
    subtypes: card.stage ? [card.stage] : [],
    hp: hpVal,
    types: normalizedTypes.length > 0 ? normalizedTypes : ['Colorless'],
    stage: card.stage,
    category: card.category || 'Pokémon',
    artist: card.illustrator || 'Unknown',
    description: card.description || card.effect,
    attacks: card.attacks
      ? card.attacks.map((a: any) => ({
          name: a.name,
          cost: (a.cost || []).map((c: string) =>
            c === 'Lightning' ? 'Electric' : c === 'Metal' ? 'Steel' : c === 'Darkness' ? 'Dark' : c
          ),
          damage: a.damage ? String(a.damage) : '',
          text: a.effect || a.text || '',
        }))
      : undefined,
    weaknesses: card.weaknesses
      ? card.weaknesses.map((w: any) => ({
          type:
            w.type === 'Lightning'
              ? 'Electric'
              : w.type === 'Metal'
              ? 'Steel'
              : w.type === 'Darkness'
              ? 'Dark'
              : w.type,
          value: w.value || '×2',
        }))
      : undefined,
    resistances: card.resistances
      ? card.resistances.map((r: any) => ({
          type:
            r.type === 'Lightning'
              ? 'Electric'
              : r.type === 'Metal'
              ? 'Steel'
              : r.type === 'Darkness'
              ? 'Dark'
              : r.type,
          value: r.value || '-30',
        }))
      : undefined,
    set: normalizeSet(card.set || { id: 'base1', name: 'Base Set' }),
    number: String(card.localId || '1'),
    rarity: card.rarity || 'Common',
    legalities: {
      standard: card.legalities?.standard ?? true,
      expanded: card.legalities?.expanded ?? true,
    },
    images: {
      small: smallImage,
      large: largeImage,
    },
    cardmarket: {
      url: card.pricing?.cardmarket?.url || '',
      updatedAt: card.pricing?.cardmarket?.updatedAt || new Date().toISOString().split('T')[0],
      price: card.pricing?.cardmarket?.avg1 || 0.5,
      trendPrice: card.pricing?.cardmarket?.trendPrice || 0.6,
      avgSellPrice: card.pricing?.cardmarket?.avg1 || 0.5,
    },
    tcgplayer: {
      url: card.pricing?.tcgplayer?.url || '',
      updatedAt: card.pricing?.tcgplayer?.updatedAt || new Date().toISOString().split('T')[0],
      price: card.pricing?.tcgplayer?.normal?.market || card.pricing?.tcgplayer?.holofoil?.market || 1.25,
      lowPrice: card.pricing?.tcgplayer?.normal?.low || 0.5,
    },
    prices: {
      raw: card.pricing?.tcgplayer?.normal?.market || 1.25,
      psa10Estimate: (card.pricing?.tcgplayer?.normal?.market || 1.25) * 4,
      psa9Estimate: (card.pricing?.tcgplayer?.normal?.market || 1.25) * 2,
      priceHistory: [],
    },
  };
}

// 1. Get Expansions (IndexedDB -> Server Proxy API -> TCGdex Direct )
export async function getExpansionsCatalog(): Promise<CardSet[]> {
  const cached = await idbGetAllExpansions();
  if (cached && cached.length > 10) {
    refreshExpansionsInBackground();
    return sortSetsChronologically(cached.map(normalizeSet));
  }

  try {
    const res = await fetch('/api/tcg/expansions');
    if (res.ok) {
      const rawSets = await res.json();
      if (Array.isArray(rawSets) && rawSets.length > 0) {
        const mappedSets = sortSetsChronologically(rawSets.map(mapTCGdexSet));
        await idbSaveExpansions(mappedSets);
        return mappedSets;
      }
    }
  } catch (err) {}

  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/sets');
    if (res.ok) {
      const rawSets = await res.json();
      const mappedSets = sortSetsChronologically(rawSets.map(mapTCGdexSet));
      await idbSaveExpansions(mappedSets);
      return mappedSets;
    }
  } catch (err) {}

  return [];
}

async function refreshExpansionsInBackground() {
  try {
    const res = await fetch('/api/tcg/expansions');
    if (res.ok) {
      const rawSets = await res.json();
      if (Array.isArray(rawSets) && rawSets.length > 0) {
        const mappedSets = rawSets.map(mapTCGdexSet);
        await idbSaveExpansions(mappedSets);
      }
    }
  } catch (e) {}
}

// 2. Get Cards By Set (IndexedDB -> Server Proxy -> TCGdex Direct -> Fallback)
export async function getCardsBySetCatalog(setId: string): Promise<PokemonCard[]> {
  const cachedCards = await idbGetCardsBySet(setId);
  if (cachedCards && cachedCards.length > 0) {
    return cachedCards;
  }

  try {
    const proxyRes = await fetch(`/api/tcg/sets/${encodeURIComponent(setId)}`);
    if (proxyRes.ok) {
      const setDetail = await proxyRes.json();
      if (setDetail && Array.isArray(setDetail.cards)) {
        const mappedCards: PokemonCard[] = setDetail.cards.map((c: any) =>
          mapTCGdexCard({
            ...c,
            set: {
              id: setDetail.id,
              name: setDetail.name,
              series: setDetail.series,
              cardCount: setDetail.cardCount,
              logo: setDetail.logo,
              symbol: setDetail.symbol,
            },
          })
        );
        await idbSaveCards(mappedCards);
        return mappedCards;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(setId)}`);
    if (res.ok) {
      const setDetail = await res.json();
      if (setDetail && Array.isArray(setDetail.cards)) {
        const mappedCards: PokemonCard[] = setDetail.cards.map((c: any) =>
          mapTCGdexCard({
            ...c,
            set: {
              id: setDetail.id,
              name: setDetail.name,
              series: setDetail.series,
              cardCount: setDetail.cardCount,
              logo: setDetail.logo,
              symbol: setDetail.symbol,
            },
          })
        );
        await idbSaveCards(mappedCards);
        return mappedCards;
      }
    }
  } catch (e) {}

  return [];
}

// 3. Get Single Card Detail
export async function getCardDetailCatalog(cardId: string): Promise<PokemonCard | null> {
  const cached = await idbGetCardById(cardId);
  if (cached && cached.hp && cached.attacks) {
    return cached;
  }

  try {
    const proxyRes = await fetch(`/api/tcg/cards/${encodeURIComponent(cardId)}`);
    if (proxyRes.ok) {
      const rawData = await proxyRes.json();
      const mapped = mapTCGdexCard(rawData);
      await idbSaveCards([mapped]);
      return mapped;
    }
  } catch (e) {}

  try {
    const directRes = await fetch(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`);
    if (directRes.ok) {
      const rawData = await directRes.json();
      const mapped = mapTCGdexCard(rawData);
      await idbSaveCards([mapped]);
      return mapped;
    }
  } catch (e) {}

  return cached || null;
}

// 4. Background Lazy Loading Catalog Sync (Non-blocking & Loop-Free)
export async function startFullCatalogBackgroundSync() {
  const meta = await idbGetSyncMeta();
  if (meta.isSyncing) return;

  try {
    const expansions = await getExpansionsCatalog();
    await idbSaveExpansions(expansions);

    const expCount = await idbGetExpansionCount();
    const cardCount = await idbGetCardCount();

    await idbUpdateSyncMeta({
      isSyncing: false,
      syncProgress: 100,
      lastSyncedAt: Date.now(),
      cardCount,
      expansionCount: expCount,
      message: 'Expansion library ready',
    });

    notifySyncListeners({
      isSyncing: false,
      progress: 100,
      message: 'Expansion library ready',
      cardCount,
      expansionCount: expCount,
    });
  } catch (err: any) {
    await idbUpdateSyncMeta({ isSyncing: false });
  }
}
