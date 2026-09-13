/**
 * Cross-Device Cloud Sync & State Deduplication Engine
 *
 * Provides deterministic, conflict-free reconciliation for User Decks,
 * Custom Lists, Sealed Vaults, and Sold records across multiple devices.
 */

import { Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry } from '../types';
import { isMockDeck, isMockCustomList, isMockSealedEntry, isMockCardEntry } from './showcaseSeeder';

export interface ReconciledCollectionState {
  decks: Deck[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  soldEntries: PortfolioCardEntry[];
}

/**
 * Deduplicate card entries within a single deck container
 */
export function deduplicateDeckEntries(entries: PortfolioCardEntry[]): PortfolioCardEntry[] {
  if (!entries || !Array.isArray(entries)) return [];

  const entryMap = new Map<string, PortfolioCardEntry>();

  for (const entry of entries) {
    if (!entry || !entry.cardId || isMockCardEntry(entry)) continue;

    // Compound key for identifying logically identical card copies
    const certKey = entry.gradingInfo?.certNumber?.trim() || '';
    const gradeKey = entry.gradingInfo ? `${entry.gradingInfo.company}_${entry.gradingInfo.grade}` : 'raw';
    const compoundKey = `${entry.cardId}::${entry.condition || 'NM'}::${gradeKey}::${certKey}::${entry.purchaseDate || ''}::${entry.purchasePrice || 0}`;

    const existing = entryMap.get(compoundKey);
    if (existing) {
      // If exact same card entry exists, merge quantity cleanly
      existing.quantity = (existing.quantity || 1) + (entry.quantity || 1);
      if (entry.notes && !existing.notes) {
        existing.notes = entry.notes;
      }
    } else {
      entryMap.set(compoundKey, {
        ...entry,
        quantity: entry.quantity || 1,
      });
    }
  }

  return Array.from(entryMap.values());
}

/**
 * Reconcile and deduplicate Decks between local cache and cloud snapshot
 */
export function reconcileDecks(localDecks: Deck[], remoteDecks: Deck[], isAuthenticated: boolean = true): Deck[] {
  const deckMap = new Map<string, Deck>();

  // Process remote decks first (cloud baseline)
  for (const deck of remoteDecks || []) {
    if (!deck || !deck.id) continue;
    if (isAuthenticated && isMockDeck(deck)) continue;

    const cleanedEntries = deduplicateDeckEntries(deck.entries || []);
    deckMap.set(deck.id, {
      ...deck,
      entries: cleanedEntries,
    });
  }

  // Merge local decks
  for (const deck of localDecks || []) {
    if (!deck || !deck.id) continue;
    if (isAuthenticated && isMockDeck(deck)) continue;

    const existing = deckMap.get(deck.id);
    if (!existing) {
      // Unique local deck not yet in remote snapshot -> preserve
      deckMap.set(deck.id, {
        ...deck,
        entries: deduplicateDeckEntries(deck.entries || []),
      });
    } else {
      // Both exist: compare timestamps and entry count
      const localUpdated = deck.updatedAt ? new Date(deck.updatedAt).getTime() : 0;
      const remoteUpdated = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;

      if (localUpdated > remoteUpdated) {
        // Local is newer: use local deck state
        deckMap.set(deck.id, {
          ...deck,
          entries: deduplicateDeckEntries(deck.entries || []),
        });
      } else if (remoteUpdated > localUpdated) {
        // Remote is newer: keep remote deck state
        // (already in deckMap)
      } else {
        // Timestamps identical or missing: union entries to prevent data loss
        const combinedEntries = [...(existing.entries || []), ...(deck.entries || [])];
        deckMap.set(deck.id, {
          ...existing,
          name: deck.name || existing.name,
          description: deck.description || existing.description,
          colorHex: deck.colorHex || existing.colorHex,
          entries: deduplicateDeckEntries(combinedEntries),
        });
      }
    }
  }

  return Array.from(deckMap.values());
}

/**
 * Reconcile and deduplicate Custom Lists between local cache and cloud snapshot
 */
export function reconcileCustomLists(
  localLists: CustomList[],
  remoteLists: CustomList[],
  isAuthenticated: boolean = true
): CustomList[] {
  const listMap = new Map<string, CustomList>();

  // Process remote lists first
  for (const list of remoteLists || []) {
    if (!list || !list.id) continue;
    if (isAuthenticated && isMockCustomList(list)) continue;

    const uniqueCardIds = Array.from(new Set((list.cardIds || []).filter(Boolean)));
    listMap.set(list.id, {
      ...list,
      cardIds: uniqueCardIds,
    });
  }

  // Merge local lists
  for (const list of localLists || []) {
    if (!list || !list.id) continue;
    if (isAuthenticated && isMockCustomList(list)) continue;

    const existing = listMap.get(list.id);
    if (!existing) {
      listMap.set(list.id, {
        ...list,
        cardIds: Array.from(new Set((list.cardIds || []).filter(Boolean))),
      });
    } else {
      // Union unique card IDs across devices so no added cards disappear
      const mergedCardIds = Array.from(
        new Set([...(existing.cardIds || []), ...(list.cardIds || [])].filter(Boolean))
      );
      listMap.set(list.id, {
        ...existing,
        name: list.name || existing.name,
        description: list.description || existing.description,
        coverImageUrl: list.coverImageUrl || existing.coverImageUrl,
        cardIds: mergedCardIds,
      });
    }
  }

  return Array.from(listMap.values());
}

/**
 * Reconcile and deduplicate Sealed Vault entries between local cache and cloud snapshot
 */
export function reconcileSealedVault(
  localSealed: PortfolioSealedEntry[],
  remoteSealed: PortfolioSealedEntry[],
  isAuthenticated: boolean = true
): PortfolioSealedEntry[] {
  const sealedMap = new Map<string, PortfolioSealedEntry>();

  // Process remote entries first
  for (const item of remoteSealed || []) {
    if (!item || !item.id) continue;
    if (isAuthenticated && isMockSealedEntry(item)) continue;
    sealedMap.set(item.id, item);
  }

  // Merge local entries
  for (const item of localSealed || []) {
    if (!item || !item.id) continue;
    if (isAuthenticated && isMockSealedEntry(item)) continue;

    const existing = sealedMap.get(item.id);
    if (!existing) {
      sealedMap.set(item.id, item);
    } else {
      // Keep most up-to-date sold status and notes
      sealedMap.set(item.id, {
        ...existing,
        ...item,
        quantity: Math.max(existing.quantity || 1, item.quantity || 1),
        isSold: item.isSold !== undefined ? item.isSold : existing.isSold,
        salePrice: item.salePrice !== undefined ? item.salePrice : existing.salePrice,
        notes: item.notes || existing.notes,
      });
    }
  }

  return Array.from(sealedMap.values());
}

/**
 * Reconcile and deduplicate Sold Card / Portfolio items
 */
export function reconcileSoldEntries(
  localSold: PortfolioCardEntry[],
  remoteSold: PortfolioCardEntry[]
): PortfolioCardEntry[] {
  const soldMap = new Map<string, PortfolioCardEntry>();

  for (const item of remoteSold || []) {
    if (item && item.id) soldMap.set(item.id, item);
  }

  for (const item of localSold || []) {
    if (item && item.id) soldMap.set(item.id, item);
  }

  return Array.from(soldMap.values());
}

/**
 * Full State Reconciliation function combining all collections
 */
export function reconcileFullCollectionState(
  local: {
    decks: Deck[];
    customLists: CustomList[];
    sealedEntries: PortfolioSealedEntry[];
    soldEntries?: PortfolioCardEntry[];
  },
  remote: {
    decks: Deck[];
    customLists: CustomList[];
    sealedEntries: PortfolioSealedEntry[];
    soldEntries?: PortfolioCardEntry[];
  },
  isAuthenticated: boolean = true
): ReconciledCollectionState {
  const decks = reconcileDecks(local.decks || [], remote.decks || [], isAuthenticated);
  const customLists = reconcileCustomLists(local.customLists || [], remote.customLists || [], isAuthenticated);
  const sealedEntries = reconcileSealedVault(local.sealedEntries || [], remote.sealedEntries || [], isAuthenticated);
  const soldEntries = reconcileSoldEntries(local.soldEntries || [], remote.soldEntries || []);

  return {
    decks,
    customLists,
    sealedEntries,
    soldEntries,
  };
}
