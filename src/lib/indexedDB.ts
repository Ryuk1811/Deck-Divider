import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PokemonCard, CardSet, Deck, PortfolioCardEntry, CustomList, PortfolioSealedEntry } from '../types';
import { setEncryptedItem, getEncryptedItem } from './encryptedVault';

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

export function resetIndexedDB() {
  dbPromise = null;
}

export async function getIndexedDB(): Promise<IDBPDatabase<DeckDividerDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<DeckDividerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
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
      blocked() {
        dbPromise = null;
      },
      blocking() {
        dbPromise = null;
      },
      terminated() {
        dbPromise = null;
      },
    }).then((db) => {
      db.onclose = () => {
        dbPromise = null;
      };
      db.onversionchange = () => {
        try {
          db.close();
        } catch (_) {}
        dbPromise = null;
      };
      return db;
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }

  try {
    const db = await dbPromise;
    return db;
  } catch (err) {
    dbPromise = null;
    throw err;
  }
}

/**
 * Safe transaction executor that handles "Database is closing/hidden" or connection drops,
 * automatically resetting the cached connection promise and retrying once.
 */
async function execDB<T>(
  action: (db: IDBPDatabase<DeckDividerDBSchema>) => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const db = await getIndexedDB();
    return await action(db);
  } catch (err: any) {
    // Reset connection cached promise
    dbPromise = null;
    try {
      const freshDb = await getIndexedDB();
      return await action(freshDb);
    } catch (retryErr: any) {
      console.warn('IndexedDB connection resilient fallback triggered:', retryErr?.message || retryErr);
      return fallback;
    }
  }
}

// Cards Operations
export async function idbSaveCards(cards: PokemonCard[]): Promise<void> {
  return execDB(async (db) => {
    const tx = db.transaction('cards', 'readwrite');
    for (const card of cards) {
      await tx.store.put(card);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetAllCards(): Promise<PokemonCard[]> {
  return execDB(async (db) => db.getAll('cards'), []);
}

export async function idbGetCardsBySet(setId: string): Promise<PokemonCard[]> {
  return execDB(async (db) => db.getAllFromIndex('cards', 'by-setId', setId), []);
}

export async function idbGetCardById(id: string): Promise<PokemonCard | undefined> {
  return execDB(async (db) => db.get('cards', id), undefined);
}

export async function idbGetCardCount(): Promise<number> {
  return execDB(async (db) => db.count('cards'), 0);
}

// Expansions Operations
export async function idbSaveExpansions(expansions: CardSet[]): Promise<void> {
  return execDB(async (db) => {
    const tx = db.transaction('expansions', 'readwrite');
    for (const exp of expansions) {
      await tx.store.put(exp);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetAllExpansions(): Promise<CardSet[]> {
  return execDB(async (db) => db.getAll('expansions'), []);
}

export async function idbGetExpansionCount(): Promise<number> {
  return execDB(async (db) => db.count('expansions'), 0);
}

// Sync Metadata Operations
const DEFAULT_SYNC_META = {
  key: 'global',
  lastSyncedAt: 0,
  cardCount: 0,
  expansionCount: 0,
  isSyncing: false,
  syncProgress: 0,
  message: 'Idle',
};

export async function idbGetSyncMeta() {
  return execDB(async (db) => {
    const meta = await db.get('syncMeta', 'global');
    return meta || DEFAULT_SYNC_META;
  }, DEFAULT_SYNC_META);
}

export async function idbUpdateSyncMeta(metaPartial: Partial<Awaited<ReturnType<typeof idbGetSyncMeta>>>) {
  return execDB(async (db) => {
    const current = (await db.get('syncMeta', 'global')) || DEFAULT_SYNC_META;
    const updated = { ...current, ...metaPartial, key: 'global' };
    await db.put('syncMeta', updated);
    return updated;
  }, { ...DEFAULT_SYNC_META, ...metaPartial });
}

// User Local Cache Sync with Encrypted Local Storage integration
export async function idbSaveUserDecks(decks: Deck[], userId: string = 'guest_user'): Promise<void> {
  // Store in encrypted vault
  setEncryptedItem('user_decks', decks, userId);
  return execDB(async (db) => {
    const tx = db.transaction('userDecks', 'readwrite');
    await tx.store.clear();
    for (const deck of decks) {
      await tx.store.put(deck);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetUserDecks(userId: string = 'guest_user'): Promise<Deck[]> {
  const encrypted = await getEncryptedItem<Deck[]>('user_decks', userId);
  if (encrypted && encrypted.length > 0) {
    return encrypted;
  }
  return execDB(async (db) => db.getAll('userDecks'), []);
}

export async function idbSaveUserPortfolio(items: PortfolioCardEntry[], userId: string = 'guest_user'): Promise<void> {
  setEncryptedItem('user_portfolio', items, userId);
  return execDB(async (db) => {
    const tx = db.transaction('userPortfolio', 'readwrite');
    await tx.store.clear();
    for (const item of items) {
      await tx.store.put(item);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetUserPortfolio(userId: string = 'guest_user'): Promise<PortfolioCardEntry[]> {
  const encrypted = await getEncryptedItem<PortfolioCardEntry[]>('user_portfolio', userId);
  if (encrypted && encrypted.length > 0) {
    return encrypted;
  }
  return execDB(async (db) => db.getAll('userPortfolio'), []);
}

export async function idbSaveSealedVault(items: PortfolioSealedEntry[], userId: string = 'guest_user'): Promise<void> {
  setEncryptedItem('sealed_vault', items, userId);
  return execDB(async (db) => {
    const tx = db.transaction('sealedVault', 'readwrite');
    await tx.store.clear();
    for (const item of items) {
      await tx.store.put(item);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetSealedVault(userId: string = 'guest_user'): Promise<PortfolioSealedEntry[]> {
  const encrypted = await getEncryptedItem<PortfolioSealedEntry[]>('sealed_vault', userId);
  if (encrypted && encrypted.length > 0) {
    return encrypted;
  }
  return execDB(async (db) => db.getAll('sealedVault'), []);
}

export async function idbSaveCustomLists(lists: CustomList[], userId: string = 'guest_user'): Promise<void> {
  setEncryptedItem('custom_lists', lists, userId);
  return execDB(async (db) => {
    const tx = db.transaction('customLists', 'readwrite');
    await tx.store.clear();
    for (const list of lists) {
      await tx.store.put(list);
    }
    await tx.done;
  }, undefined);
}

export async function idbGetCustomLists(userId: string = 'guest_user'): Promise<CustomList[]> {
  const encrypted = await getEncryptedItem<CustomList[]>('custom_lists', userId);
  if (encrypted && encrypted.length > 0) {
    return encrypted;
  }
  return execDB(async (db) => db.getAll('customLists'), []);
}

