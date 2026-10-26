/**
 * Cross-Device Cloud Sync & State Deduplication Engine
 *
 * Provides deterministic, conflict-free reconciliation for User Decks,
 * Custom Lists, Sealed Vaults, and Sold records across multiple devices.
 */

import { Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry } from '../types';
import { isMockDeck, isMockCustomList, isMockSealedEntry, isMockCardEntry } from './showcaseSeeder';
import { isTombstoned } from './tombstoneEngine';

export interface ReconciledCollectionState {
  decks: Deck[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  soldEntries: PortfolioCardEntry[];
}

/**
 * Deduplicate card entries within a single deck container
 */
export function deduplicateDeckEntries(
  entries: PortfolioCardEntry[],
  deckId?: string,
  tombstoneSet?: Set<string>
): PortfolioCardEntry[] {
  if (!entries || !Array.isArray(entries)) return [];

  const entryMap = new Map<string, PortfolioCardEntry>();

  for (const entry of entries) {
    if (!entry || (!entry.cardId && !entry.id) || isMockCardEntry(entry)) continue;

    // Check tombstone registry
    if (tombstoneSet && tombstoneSet.size > 0) {
      if (
        (deckId && isTombstoned('card_entry', deckId, entry.id, tombstoneSet)) ||
        isTombstoned('card_entry', entry.cardId || '', entry.id, tombstoneSet)
      ) {
        continue;
      }
    }

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
export function reconcileDecks(
  localDecks: Deck[],
  remoteDecks: Deck[],
  isAuthenticated: boolean = true,
  tombstoneSet?: Set<string>
): Deck[] {
  const deckMap = new Map<string, Deck>();

  // Process remote decks first (cloud baseline)
  for (const deck of remoteDecks || []) {
    if (!deck || !deck.id) continue;
    if (isAuthenticated && isMockDeck(deck)) continue;
    if (tombstoneSet && isTombstoned('deck', deck.id, undefined, tombstoneSet)) continue;

    const cleanedEntries = deduplicateDeckEntries(deck.entries || [], deck.id, tombstoneSet);
    deckMap.set(deck.id, {
      ...deck,
      entries: cleanedEntries,
    });
  }

  // Merge local decks
  for (const deck of localDecks || []) {
    if (!deck || !deck.id) continue;
    if (isAuthenticated && isMockDeck(deck)) continue;
    if (tombstoneSet && isTombstoned('deck', deck.id, undefined, tombstoneSet)) continue;

    const cleanedLocalEntries = deduplicateDeckEntries(deck.entries || [], deck.id, tombstoneSet);
    const existing = deckMap.get(deck.id);
    if (!existing) {
      // Unique local deck not yet in remote snapshot -> preserve
      deckMap.set(deck.id, {
        ...deck,
        entries: cleanedLocalEntries,
      });
    } else {
      // Both exist: compare timestamps and entry count
      const localUpdated = deck.updatedAt ? new Date(deck.updatedAt).getTime() : 0;
      const remoteUpdated = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;

      if (localUpdated > remoteUpdated) {
        // Local is newer: use local deck state
        deckMap.set(deck.id, {
          ...deck,
          entries: cleanedLocalEntries,
        });
      } else if (remoteUpdated > localUpdated) {
        // Remote is newer: keep remote deck state
        // (already in deckMap)
      } else {
        // Timestamps identical: use local entries if different to honor deletions
        deckMap.set(deck.id, {
          ...existing,
          name: deck.name || existing.name,
          description: deck.description || existing.description,
          colorHex: deck.colorHex || existing.colorHex,
          entries: cleanedLocalEntries,
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
  isAuthenticated: boolean = true,
  tombstoneSet?: Set<string>
): CustomList[] {
  const listMap = new Map<string, CustomList>();

  // Process remote lists first
  for (const list of remoteLists || []) {
    if (!list || !list.id) continue;
    if (isAuthenticated && isMockCustomList(list)) continue;
    if (tombstoneSet && isTombstoned('list', list.id, undefined, tombstoneSet)) continue;

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
    if (tombstoneSet && isTombstoned('list', list.id, undefined, tombstoneSet)) continue;

    const existing = listMap.get(list.id);
    if (!existing) {
      listMap.set(list.id, {
        ...list,
        cardIds: Array.from(new Set((list.cardIds || []).filter(Boolean))),
      });
    } else {
      const mergedCardIds = Array.from(
        new Set([...(list.cardIds || [])].filter(Boolean))
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
  isAuthenticated: boolean = true,
  tombstoneSet?: Set<string>
): PortfolioSealedEntry[] {
  const sealedMap = new Map<string, PortfolioSealedEntry>();

  // Process remote entries first
  for (const item of remoteSealed || []) {
    if (!item || !item.id) continue;
    if (isAuthenticated && isMockSealedEntry(item)) continue;
    if (tombstoneSet && isTombstoned('sealed', item.id, undefined, tombstoneSet)) continue;
    sealedMap.set(item.id, item);
  }

  // Merge local entries
  for (const item of localSealed || []) {
    if (!item || !item.id) continue;
    if (isAuthenticated && isMockSealedEntry(item)) continue;
    if (tombstoneSet && isTombstoned('sealed', item.id, undefined, tombstoneSet)) continue;

    const existing = sealedMap.get(item.id);
    if (!existing) {
      sealedMap.set(item.id, item);
    } else {
      const mergedSalePrice = item.salePrice !== undefined ? item.salePrice : existing.salePrice;
      const mergedEntry: PortfolioSealedEntry = {
        ...existing,
        ...item,
        quantity: item.quantity || existing.quantity || 1,
        isSold: item.isSold !== undefined ? item.isSold : existing.isSold,
        notes: item.notes || existing.notes,
      };
      if (mergedSalePrice !== undefined) {
        mergedEntry.salePrice = mergedSalePrice;
      } else {
        delete mergedEntry.salePrice;
      }
      sealedMap.set(item.id, mergedEntry);
    }
  }

  return Array.from(sealedMap.values());
}

/**
 * Reconcile and deduplicate Sold Card / Portfolio items
 */
export function reconcileSoldEntries(
  localSold: PortfolioCardEntry[],
  remoteSold: PortfolioCardEntry[],
  tombstoneSet?: Set<string>
): PortfolioCardEntry[] {
  const soldMap = new Map<string, PortfolioCardEntry>();

  for (const item of remoteSold || []) {
    if (item && item.id) {
      if (tombstoneSet && isTombstoned('card_entry', item.cardId || '', item.id, tombstoneSet)) continue;
      soldMap.set(item.id, item);
    }
  }

  for (const item of localSold || []) {
    if (item && item.id) {
      if (tombstoneSet && isTombstoned('card_entry', item.cardId || '', item.id, tombstoneSet)) continue;
      soldMap.set(item.id, item);
    }
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
  isAuthenticated: boolean = true,
  tombstoneSet?: Set<string>
): ReconciledCollectionState {
  const decks = reconcileDecks(local.decks || [], remote.decks || [], isAuthenticated, tombstoneSet);
  const customLists = reconcileCustomLists(local.customLists || [], remote.customLists || [], isAuthenticated, tombstoneSet);
  const sealedEntries = reconcileSealedVault(local.sealedEntries || [], remote.sealedEntries || [], isAuthenticated, tombstoneSet);
  const soldEntries = reconcileSoldEntries(local.soldEntries || [], remote.soldEntries || [], tombstoneSet);

  return {
    decks,
    customLists,
    sealedEntries,
    soldEntries,
  };
}

