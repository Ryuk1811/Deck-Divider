import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PokemonCard, CardSet, Deck, PortfolioCardEntry, CustomList, PortfolioSealedEntry } from '../types';

interface DeckDividerDBSchema extends DBSchema {
  cards: {
    key: string;
    value: PokemonCard;
    indexes: {
      'by-setId': string;
      'by-category': string;
      'by-rarity': string;
    };
  };
  expansions: {
    key: string;
    value: CardSet;
    indexes: {
      'by-releaseDate': string;
    };
  };
  syncMeta: {
    key: string;
    value: {
      key: string;
      lastSyncedAt: number;
      cardCount: number;
      expansionCount: number;
      isSyncing: boolean;
      syncProgress: number; // 0 to 100
      message?: string;
    };
  };
  userDecks: {
    key: string;
    value: Deck;
  };
  userPortfolio: {
    key: string;
    value: PortfolioCardEntry;
  };
  sealedVault: {
    key: string;
    value: PortfolioSealedEntry;
  };
  customLists: {
    key: string;
    value: CustomList;
  };
}

const DB_NAME = 'DeckDividerDB';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<DeckDividerDBSchema>> | null = null;

export function getIndexedDB() {
  if (!dbPromise) {
    dbPromise = openDB<DeckDividerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
          cardStore.createIndex('by-setId', 'set.id');
          cardStore.createIndex('by-category', 'category');
          cardStore.createIndex('by-rarity', 'rarity');
        }

        if (!db.objectStoreNames.contains('expansions')) {
          const expStore = db.createObjectStore('expansions', { keyPath: 'id' });
          expStore.createIndex('by-releaseDate', 'releaseDate');
        }

        if (!db.objectStoreNames.contains('syncMeta')) {
          db.createObjectStore('syncMeta', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('userDecks')) {
          db.createObjectStore('userDecks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('userPortfolio')) {
          db.createObjectStore('userPortfolio', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sealedVault')) {
          db.createObjectStore('sealedVault', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customLists')) {
          db.createObjectStore('customLists', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Cards Operations
export async function idbSaveCards(cards: PokemonCard[]): Promise<void> {
  const db = await getIndexedDB();
  const tx = db.transaction('cards', 'readwrite');
  for (const card of cards) {
    await tx.store.put(card);
  }
  await tx.done;
}

export async function idbGetAllCards(): Promise<PokemonCard[]> {
  const db = await getIndexedDB();
  return db.getAll('cards');
}

export async function idbGetCardsBySet(setId: string): Promise<PokemonCard[]> {
  const db = await getIndexedDB();
  return db.getAllFromIndex('cards', 'by-setId', setId);
}

export async function idbGetCardById(id: string): Promise<PokemonCard | undefined> {
  const db = await getIndexedDB();
  return db.get('cards', id);
}

export async function idbGetCardCount(): Promise<number> {
  const db = await getIndexedDB();
  return db.count('cards');
}

// Expansions Operations
export async function idbSaveExpansions(expansions: CardSet[]): Promise<void> {
  const db = await getIndexedDB();
  const tx = db.transaction('expansions', 'readwrite');
  for (const exp of expansions) {
    await tx.store.put(exp);
  }
  await tx.done;
}

export async function idbGetAllExpansions(): Promise<CardSet[]> {
  const db = await getIndexedDB();
  return db.getAll('expansions');
}

export async function idbGetExpansionCount(): Promise<number> {
  const db = await getIndexedDB();
  return db.count('expansions');
}

// Sync Metadata Operations
export async function idbGetSyncMeta() {
  const db = await getIndexedDB();
  const meta = await db.get('syncMeta', 'global');
  return meta || {
    key: 'global',
    lastSyncedAt: 0,
    cardCount: 0,
    expansionCount: 0,
    isSyncing: false,
    syncProgress: 0,
    message: 'Idle',
  };
}

export async function idbUpdateSyncMeta(metaPartial: Partial<Awaited<ReturnType<typeof idbGetSyncMeta>>>) {
  const db = await getIndexedDB();
  const current = await idbGetSyncMeta();
  const updated = { ...current, ...metaPartial, key: 'global' };
  await db.put('syncMeta', updated);
  return updated;
}

// User Local Cache Sync
export async function idbSaveUserDecks(decks: Deck[]): Promise<void> {
  const db = await getIndexedDB();
  const tx = db.transaction('userDecks', 'readwrite');
  await tx.store.clear();
  for (const deck of decks) {
    await tx.store.put(deck);
  }
  await tx.done;
}

export async function idbGetUserDecks(): Promise<Deck[]> {
  const db = await getIndexedDB();
  return db.getAll('userDecks');
}

export async function idbSaveUserPortfolio(items: PortfolioCardEntry[]): Promise<void> {
  const db = await getIndexedDB();
  const tx = db.transaction('userPortfolio', 'readwrite');
  await tx.store.clear();
  for (const item of items) {
    await tx.store.put(item);
  }
  await tx.done;
}

export async function idbGetUserPortfolio(): Promise<PortfolioCardEntry[]> {
  const db = await getIndexedDB();
  return db.getAll('userPortfolio');
}

export async function idbSaveSealedVault(items: PortfolioSealedEntry[]): Promise<void> {
  const db = await getIndexedDB();
  const tx = db.transaction('sealedVault', 'readwrite');
  await tx.store.clear();
  for (const item of items) {
    await tx.store.put(item);
  }
  await tx.done;
}

export async function idbGetSealedVault(): Promise<PortfolioSealedEntry[]> {
  const db = await getIndexedDB();
  return db.getAll('sealedVault');
}
