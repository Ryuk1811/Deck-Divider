/**
 * Tombstone Synchronization Engine
 *
 * Prevents deleted decks, card entries, custom lists, and sealed vault items
 * from resurrecting across logins, device syncs, or deployment updates.
 */

import { safeGetItem, safeSetItem } from '../utils/safeStorage';
import { db, safeSetDoc } from './firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export interface Tombstone {
  id: string; // Key e.g. "deck:deck-123", "entry:deck-123:entry-456", "list:list-789", "sealed:sealed-101"
  type: 'deck' | 'card_entry' | 'list' | 'sealed';
  deletedAt: string;
}

const STORAGE_KEY_TOMBSTONES = 'dd_tombstones_v1';

/**
 * Normalizes tombstone keys for O(1) Set lookups
 */
export function makeTombstoneKey(type: Tombstone['type'], id: string, subId?: string): string {
  if (type === 'card_entry' && subId) {
    return `entry:${id}:${subId}`;
  }
  return `${type}:${id}`;
}

/**
 * Retrieves all active tombstones from safeStorage
 */
export async function getLocalTombstones(userId: string = 'guest_user'): Promise<Tombstone[]> {
  try {
    const key = `${STORAGE_KEY_TOMBSTONES}_${userId}`;
    const raw = safeGetItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to read local tombstones:', err);
    return [];
  }
}

/**
 * Saves tombstones array locally to safeStorage
 */
export async function saveLocalTombstones(userId: string, tombstones: Tombstone[]): Promise<void> {
  try {
    const key = `${STORAGE_KEY_TOMBSTONES}_${userId}`;
    safeSetItem(key, JSON.stringify(tombstones));
  } catch (err) {
    console.warn('Failed to save local tombstones:', err);
  }
}

/**
 * Records an immutable tombstone locally and in Firestore
 */
export async function recordTombstone(
  type: Tombstone['type'],
  id: string,
  subId?: string,
  userId?: string
): Promise<void> {
  const tombKey = makeTombstoneKey(type, id, subId);
  const now = new Date().toISOString();
  const newTombstone: Tombstone = {
    id: tombKey,
    type,
    deletedAt: now,
  };

  const activeUid = userId || 'guest_user';
  const existing = await getLocalTombstones(activeUid);

  // Avoid duplicate tombstone entries
  if (!existing.some((t) => t.id === tombKey)) {
    const updated = [newTombstone, ...existing];
    await saveLocalTombstones(activeUid, updated);
  }

  // If authenticated user, push tombstone doc to Firestore
  if (userId && userId !== 'guest_user') {
    try {
      // 1. Store tombstone record
      const tombRef = doc(db, 'users', userId, 'tombstones', encodeURIComponent(tombKey));
      await safeSetDoc(tombRef, newTombstone, { merge: true });

      // 2. Immediately delete corresponding document from Firestore subcollections if applicable
      if (type === 'deck') {
        await deleteDoc(doc(db, 'users', userId, 'decks', id)).catch(() => {});
      } else if (type === 'list') {
        await deleteDoc(doc(db, 'users', userId, 'customLists', id)).catch(() => {});
      } else if (type === 'sealed') {
        await deleteDoc(doc(db, 'users', userId, 'sealedVault', id)).catch(() => {});
      }
    } catch (err) {
      console.warn('Firestore tombstone sync notice:', err);
    }
  }
}

/**
 * Helper to build an active Tombstones Lookup Set
 */
export function buildTombstoneSet(tombstones: Tombstone[]): Set<string> {
  const set = new Set<string>();
  if (!Array.isArray(tombstones)) return set;
  for (const t of tombstones) {
    if (t?.id) {
      set.add(t.id);
    }
  }
  return set;
}

/**
 * Tests if an item is tombstoned
 */
export function isTombstoned(
  type: Tombstone['type'],
  id: string,
  subId?: string,
  tombstoneSet?: Set<string>
): boolean {
  if (!tombstoneSet || tombstoneSet.size === 0) return false;
  const key = makeTombstoneKey(type, id, subId);
  if (tombstoneSet.has(key)) return true;

  // Generic card entry fallback check
  if (type === 'card_entry' && subId && tombstoneSet.has(`entry::${subId}`)) {
    return true;
  }
  return false;
}
