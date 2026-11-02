/**
 * Curated Collection Decks Compatibility Bridge
 * Re-exports curated art collection decks for server-side rendering and legacy route mapping.
 */

import {
  CollectionDeck,
  CollectionDeckEntry,
  COLLECTION_DECKS,
  getCollectionDeckBySlug,
} from './collectionDecks.js';

export type TournamentDeck = CollectionDeck;
export type TournamentDeckEntry = CollectionDeckEntry;

export const TOURNAMENT_DECKS: Record<string, CollectionDeck> = COLLECTION_DECKS;

export function getTournamentDeckBySlug(slug: string): CollectionDeck | undefined {
  return getCollectionDeckBySlug(slug);
}

export {
  COLLECTION_DECKS,
  getCollectionDeckBySlug,
};
