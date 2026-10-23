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
import { addDynamicCardsToSearchEngine, TCGdexCard } from './searchEngine';

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
function formatTCGdexImage(imageStr?: string, quality: 'low' | 'high' = 'low', setId?: string, localId?: string): string {
  if (!imageStr && setId && localId) {
    const rawSet = String(setId).toLowerCase().trim();
    const cleanNum = String(localId).trim();
    const SET_CODE_REMAP: Record<string, string> = {
      '2011bw': 'mcd11', '2012bw': 'mcd12', '2016xy': 'mcd16',
      '2019sm': 'mcd19', '2021swsh': 'mcd21', '2022swsh': 'mcd22',
      'swsh9tg': 'swsh9tg', 'swsh10tg': 'swsh10tg', 'swsh11tg': 'swsh11tg',
      'swsh12tg': 'swsh12tg', 'swsh12.5gg': 'swsh12pt5gg', 'swsh12pt5gg': 'swsh12pt5gg',
    };
    const cleanSet = SET_CODE_REMAP[rawSet] || rawSet;
    return `https://images.pokemontcg.io/${cleanSet}/${cleanNum}.png`;
  }
  if (!imageStr) return '';
  let url = String(imageStr).trim();
  if (!url.startsWith('http') && url.startsWith('/')) {
    url = `https://assets.tcgdex.net${url}`;
  }
  if (url.includes('pokemontcg.io')) {
    if (quality === 'high' && !url.includes('_hires.png') && url.endsWith('.png')) {
      return url.replace('.png', '_hires.png');
    }
    if (quality === 'low' && url.includes('_hires.png')) {
      return url.replace('_hires.png', '.png');
    }
    return url;
  }
  if (url.includes('/high.') || url.includes('/low.')) return url;
  const clean = url.replace(/\.(png|webp|jpg|avif)$/i, '');
  return `${clean}/${quality}.webp`;
}

// Map TCGdex Set schema to app CardSet schema
import { getPokemonSpeciesTypes } from '../data/pokemonSpeciesTypes';

function mapTCGdexSet(set: any): CardSet {
  return normalizeSet(set);
}

// Map TCGdex Card detail schema to app PokemonCard schema
export function mapTCGdexCard(card: any): PokemonCard {
  const rawTypes = card.types || [];
  const isTrainerOrEnergy = card.category && ['trainer', 'energy', 'item', 'supporter', 'stadium'].some((c: string) => card.category?.toLowerCase().includes(c));
  const speciesTypes = (
    isTrainerOrEnergy
      ? (rawTypes as EnergyType[])
      : (getPokemonSpeciesTypes(card.name, card.category, rawTypes) as EnergyType[])
  ) || [];

  const normalizedTypes: EnergyType[] = speciesTypes.length > 0
    ? speciesTypes
    : (rawTypes.length > 0 ? (rawTypes as EnergyType[]) : ['Normal']);

  const hpVal = typeof card.hp === 'number' ? card.hp : parseInt(String(card.hp || 0), 10) || undefined;

  const smallImage = formatTCGdexImage(card.image, 'low', card.set?.id, card.localId);
  const largeImage = formatTCGdexImage(card.image, 'high', card.set?.id, card.localId);

  return {
    id: card.id,
    name: card.name,
    supertype: card.category === 'Pokemon' || card.category === 'Pokémon' ? 'Pokémon' : card.category || 'Pokémon',
    subtypes: card.stage ? [card.stage] : [],
    hp: hpVal,
    types: normalizedTypes.length > 0 ? normalizedTypes : ['Normal'],
    stage: card.stage,
    category: card.category || 'Pokémon',
    artist: card.illustrator || 'Unknown',
    description: card.description || card.effect,
    attacks: card.attacks
      ? card.attacks.map((a: any) => ({
          name: a.name,
          cost: (a.cost || []).map((c: string) => c as EnergyType),
          damage: a.damage ? String(a.damage) : '',
          text: a.effect || a.text || '',
        }))
      : undefined,
    weaknesses: card.weaknesses
      ? card.weaknesses.map((w: any) => ({
          type: w.type,
          value: w.value || '×2',
        }))
      : undefined,
    resistances: card.resistances
      ? card.resistances.map((r: any) => ({
          type: r.type,
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
export async function getExpansionsCatalog(forceRefresh: boolean = false): Promise<CardSet[]> {
  if (!forceRefresh) {
    const cached = await idbGetAllExpansions();
    if (cached && cached.length > 10) {
      refreshExpansionsInBackground();
      return sortSetsChronologically(cached.map(normalizeSet));
    }
  }

  try {
    const res = await fetch(`/api/tcg/expansions${forceRefresh ? '?refresh=true' : ''}`);
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

  const fallbackCached = await idbGetAllExpansions();
  return fallbackCached ? sortSetsChronologically(fallbackCached.map(normalizeSet)) : [];
}

export async function forceRefreshExpansions(): Promise<CardSet[]> {
  return getExpansionsCatalog(true);
}

async function refreshExpansionsInBackground() {
  try {
    const res = await fetch('/api/tcg/expansions');
    if (res.ok) {
      const rawSets = await res.json();
      if (Array.isArray(rawSets) && rawSets.length > 0) {
        const mappedSets = sortSetsChronologically(rawSets.map(mapTCGdexSet));
        const currentCount = await idbGetExpansionCount();
        if (mappedSets.length !== currentCount) {
          await idbSaveExpansions(mappedSets);
          window.dispatchEvent(new CustomEvent('deckdivider:catalog-updated', { detail: { sets: mappedSets } }));
        }
      }
    }
  } catch (e) {}
}

// 2. Get Cards By Set (IndexedDB -> Server Proxy -> TCGdex Direct -> Fallback)
export async function getCardsBySetCatalog(setId: string): Promise<PokemonCard[]> {
  const cleanId = String(setId || '').trim();
  if (!cleanId) return [];

  const cachedCards = await idbGetCardsBySet(cleanId);
  if (cachedCards && cachedCards.length > 0) {
    return cachedCards;
  }

  try {
    const proxyRes = await fetch(`/api/tcg/sets/${encodeURIComponent(cleanId)}`);
    if (proxyRes.ok) {
      const setDetail = await proxyRes.json();
      if (setDetail && Array.isArray(setDetail.cards)) {
        const mappedCards: PokemonCard[] = setDetail.cards.map((c: any) =>
          mapTCGdexCard({
            ...c,
            set: {
              id: setDetail.id || cleanId,
              name: setDetail.name,
              series: setDetail.series,
              cardCount: setDetail.cardCount,
              logo: setDetail.logo,
              symbol: setDetail.symbol,
            },
          })
        );
        await idbSaveCards(mappedCards);
        addDynamicCardsToSearchEngine(
          mappedCards.map((c) => ({
            id: c.id,
            localId: c.number,
            name: c.name,
            hp: c.hp,
            types: c.types as string[],
            rarity: c.rarity,
            illustrator: c.artist,
            image: c.images?.small || c.images?.large,
            category: c.category,
            stage: c.stage,
            set: {
              id: c.set.id,
              name: c.set.name,
              logo: c.set.logoUrl,
              symbol: c.set.symbolUrl,
              cardCount: { official: c.set.printedTotal || 0, total: c.set.total || 0 },
            },
          }))
        );
        return mappedCards;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const setDetail = await res.json();
      if (setDetail && Array.isArray(setDetail.cards)) {
        const mappedCards: PokemonCard[] = setDetail.cards.map((c: any) =>
          mapTCGdexCard({
            ...c,
            set: {
              id: setDetail.id || cleanId,
              name: setDetail.name,
              series: setDetail.series,
              cardCount: setDetail.cardCount,
              logo: setDetail.logo,
              symbol: setDetail.symbol,
            },
          })
        );
        await idbSaveCards(mappedCards);
        addDynamicCardsToSearchEngine(
          mappedCards.map((c) => ({
            id: c.id,
            localId: c.number,
            name: c.name,
            hp: c.hp,
            types: c.types as string[],
            rarity: c.rarity,
            illustrator: c.artist,
            image: c.images?.small || c.images?.large,
            category: c.category,
            stage: c.stage,
            set: {
              id: c.set.id,
              name: c.set.name,
              logo: c.set.logoUrl,
              symbol: c.set.symbolUrl,
              cardCount: { official: c.set.printedTotal || 0, total: c.set.total || 0 },
            },
          }))
        );
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

// 4. Background Lazy Loading Catalog Sync & Automated Dynamic Spooling
export async function startFullCatalogBackgroundSync() {
  const meta = await idbGetSyncMeta();
  if (meta.isSyncing) return;

  try {
    const currentExpCount = await idbGetExpansionCount();
    const currentCardCount = await idbGetCardCount();
    await idbUpdateSyncMeta({ isSyncing: true, message: 'Syncing expansions catalog...' });
    notifySyncListeners({
      isSyncing: true,
      progress: 10,
      message: 'Syncing expansions catalog...',
      cardCount: currentCardCount,
      expansionCount: currentExpCount,
    });

    const expansions = await getExpansionsCatalog();
    await idbSaveExpansions(expansions);

    // Spool top 16 newest sets non-blockingly into local cache
    const prioritySets = expansions.slice(0, 16);
    for (let i = 0; i < prioritySets.length; i++) {
      const s = prioritySets[i];
      if (s && s.id) {
        try {
          const cached = await idbGetCardsBySet(s.id);
          if (!cached || cached.length === 0) {
            await getCardsBySetCatalog(s.id);
          }
        } catch (err) {}
      }
    }

    const expCount = await idbGetExpansionCount();
    const cardCount = await idbGetCardCount();

    await idbUpdateSyncMeta({
      isSyncing: false,
      syncProgress: 100,
      lastSyncedAt: Date.now(),
      cardCount,
      expansionCount: expCount,
      message: 'Expansion library updated',
    });

    notifySyncListeners({
      isSyncing: false,
      progress: 100,
      message: 'Expansion library updated',
      cardCount,
      expansionCount: expCount,
    });
  } catch (err: any) {
    await idbUpdateSyncMeta({ isSyncing: false });
    const fallbackExpCount = await idbGetExpansionCount();
    const fallbackCardCount = await idbGetCardCount();
    notifySyncListeners({
      isSyncing: false,
      progress: 100,
      message: 'Library active',
      cardCount: fallbackCardCount,
      expansionCount: fallbackExpCount,
    });
  }
}

// Client-side auto-update metronome (Polls every 15 minutes for new sets)
if (typeof window !== 'undefined') {
  setInterval(() => {
    refreshExpansionsInBackground();
  }, 15 * 60 * 1000);
}
