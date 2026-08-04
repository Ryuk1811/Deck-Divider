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
import { MOCK_SETS, MOCK_CARDS } from '../data/mockData';

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

// Map TCGdex Set schema to app CardSet schema
function mapTCGdexSet(set: any): CardSet {
  return {
    id: set.id,
    name: set.name,
    series: set.series || 'Pokémon TCG',
    printedTotal: set.cardCount?.official || set.cardCount?.total || 100,
    total: set.cardCount?.total || set.cardCount?.official || 100,
    releaseDate: set.releaseDate || '2020-01-01',
    symbolUrl: set.symbol ? `${set.symbol}.png` : 'https://images.pokemontcg.io/base1/symbol.png',
    logoUrl: set.logo ? `${set.logo}.png` : 'https://images.pokemontcg.io/base1/logo.png',
  };
}

// Map TCGdex Card detail schema to app PokemonCard schema
export function mapTCGdexCard(card: any): PokemonCard {
  // Normalize types: Lightning -> Electric, Metal -> Steel
  const rawTypes = card.types || [];
  const normalizedTypes = rawTypes.map((t: string) => {
    if (t === 'Lightning') return 'Electric';
    if (t === 'Metal') return 'Steel';
    return t;
  }) as EnergyType[];

  const hpVal = typeof card.hp === 'number' ? card.hp : parseInt(String(card.hp || 0), 10) || undefined;

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
          cost: (a.cost || []).map((c: string) => (c === 'Lightning' ? 'Electric' : c === 'Metal' ? 'Steel' : c)),
          damage: a.damage ? String(a.damage) : '',
          text: a.effect || a.text || '',
        }))
      : undefined,
    weaknesses: card.weaknesses
      ? card.weaknesses.map((w: any) => ({
          type: w.type === 'Lightning' ? 'Electric' : w.type === 'Metal' ? 'Steel' : w.type,
          value: w.value || '×2',
        }))
      : undefined,
    resistances: card.resistances
      ? card.resistances.map((r: any) => ({
          type: r.type === 'Lightning' ? 'Electric' : r.type === 'Metal' ? 'Steel' : r.type,
          value: r.value || '-30',
        }))
      : undefined,
    set: {
      id: card.set?.id || 'base1',
      name: card.set?.name || 'Base Set',
      series: card.set?.series || 'Original',
      printedTotal: card.set?.cardCount?.official || 102,
      total: card.set?.cardCount?.total || 102,
      releaseDate: card.set?.releaseDate || '1999-01-09',
      symbolUrl: card.set?.symbol ? `${card.set.symbol}.png` : 'https://images.pokemontcg.io/base1/symbol.png',
      logoUrl: card.set?.logo ? `${card.set.logo}.png` : 'https://images.pokemontcg.io/base1/logo.png',
    },
    number: String(card.localId || '1'),
    rarity: card.rarity || 'Common',
    legalities: {
      standard: card.legalities?.standard ?? true,
      expanded: card.legalities?.expanded ?? true,
    },
    images: {
      small: card.image ? `${card.image}/low.png` : `https://images.pokemontcg.io/${card.set?.id || 'base1'}/${card.localId || '1'}.png`,
      large: card.image ? `${card.image}/high.png` : `https://images.pokemontcg.io/${card.set?.id || 'base1'}/${card.localId || '1'}_hires.png`,
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

// 1. Get Expansions (IndexedDB -> Server Proxy API -> TCGdex Direct -> Mock Fallback)
export async function getExpansionsCatalog(): Promise<CardSet[]> {
  const cached = await idbGetAllExpansions();
  if (cached && cached.length > 10) {
    refreshExpansionsInBackground();
    return cached;
  }

  try {
    const res = await fetch('/api/tcg/expansions');
    if (res.ok) {
      const rawSets = await res.json();
      if (Array.isArray(rawSets) && rawSets.length > 0) {
        const mappedSets = rawSets.map(mapTCGdexSet);
        await idbSaveExpansions(mappedSets);
        return mappedSets;
      }
    }
  } catch (err) {}

  try {
    const res = await fetch('https://api.tcgdex.net/v2/en/sets');
    if (res.ok) {
      const rawSets = await res.json();
      const mappedSets = rawSets.map(mapTCGdexSet);
      await idbSaveExpansions(mappedSets);
      return mappedSets;
    }
  } catch (err) {}

  await idbSaveExpansions(MOCK_SETS);
  return MOCK_SETS;
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

// 2. Get Cards By Set
export async function getCardsBySetCatalog(setId: string): Promise<PokemonCard[]> {
  const cachedCards = await idbGetCardsBySet(setId);
  if (cachedCards && cachedCards.length > 0) {
    return cachedCards;
  }

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

  const mockSetCards = MOCK_CARDS.filter((c) => c.set?.id === setId);
  if (mockSetCards.length > 0) {
    await idbSaveCards(mockSetCards);
    return mockSetCards;
  }

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

  return cached || MOCK_CARDS.find((c) => c.id === cardId) || null;
}

// 4. Background Lazy Loading Catalog Sync
export async function startFullCatalogBackgroundSync() {
  const meta = await idbGetSyncMeta();
  if (meta.isSyncing) return;

  await idbUpdateSyncMeta({ isSyncing: true, syncProgress: 5 });
  notifySyncListeners({
    isSyncing: true,
    progress: 5,
    message: 'Indexing official TCG sets...',
    cardCount: await idbGetCardCount(),
    expansionCount: await idbGetExpansionCount(),
  });

  try {
    const expansions = await getExpansionsCatalog();
    await idbSaveExpansions(expansions);

    fetch('/api/tcg/sync/trigger', { method: 'POST' }).catch(() => {});

    if (MOCK_CARDS.length > 0) {
      await idbSaveCards(MOCK_CARDS);
    }

    let processedSets = 0;
    const totalSetsToPreload = Math.min(expansions.length, 30);

    for (let i = 0; i < totalSetsToPreload; i++) {
      const set = expansions[i];
      try {
        const cards = await getCardsBySetCatalog(set.id);
        processedSets++;
        const pct = Math.min(99, Math.round(10 + (processedSets / totalSetsToPreload) * 85));
        const totalCardsCount = await idbGetCardCount();
        const totalExpCount = await idbGetExpansionCount();

        await idbUpdateSyncMeta({
          syncProgress: pct,
          cardCount: totalCardsCount,
          expansionCount: totalExpCount,
        });

        notifySyncListeners({
          isSyncing: true,
          progress: pct,
          message: `Indexed set ${processedSets}/${totalSetsToPreload}: ${set.name}`,
          cardCount: totalCardsCount,
          expansionCount: totalExpCount,
        });

        await new Promise((r) => setTimeout(r, 100));
      } catch (e) {}
    }

    const finalCardCount = await idbGetCardCount();
    const finalExpCount = await idbGetExpansionCount();

    await idbUpdateSyncMeta({
      isSyncing: false,
      syncProgress: 100,
      lastSyncedAt: Date.now(),
      cardCount: finalCardCount,
      expansionCount: finalExpCount,
    });

    notifySyncListeners({
      isSyncing: false,
      progress: 100,
      message: 'Full TCG Catalog synced locally in IndexedDB',
      cardCount: finalCardCount,
      expansionCount: finalExpCount,
    });
  } catch (err: any) {
    await idbUpdateSyncMeta({
      isSyncing: false,
    });
  }
}
