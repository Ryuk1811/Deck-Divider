/**
 * Curated Collection Deck Archetypes
 * Complete art-style decks for thematic display
 */

export interface CollectionDeckEntry {
  cardId: string;
  name: string;
  quantity: number;
  category: 'Pokemon' | 'Trainer' | 'Energy';
  setName: string;
  number: string;
  price: number;
  image?: string;
}

export interface CollectionDeck {
  id: string;
  slug: string;
  name: string;
  era: string;
  source?: string;
  curationDate?: string;
  description: string;
  keyPokemon: string;
  colorHex: string;
  estPrice: number;
  entries: CollectionDeckEntry[];
}

export const COLLECTION_DECKS: Record<string, CollectionDeck> = {
  'gardevoir-ex': {
    id: 'deck-gardevoir-ex',
    slug: 'gardevoir-ex',
    source: 'Artistic Curation (2026 Collection Cycle)',
    curationDate: 'Modern Era curation as of April 2026',
    name: 'Gardevoir ex',
    era: 'Modern (Scarlet & Violet)',
    description: 'High-synergy Psychic-themed collection utilizing thematic artwork to showcase the evolution of Gardevoir across the Scarlet & Violet series.',
    keyPokemon: 'Gardevoir ex, Scream Tail, Drifloon, Munkidori, Fezandipiti ex',
    colorHex: '#9333EA',
    estPrice: 85.50,
    entries: [
      { cardId: 'sv01-086', name: 'Gardevoir ex', quantity: 2, category: 'Pokemon', setName: 'Scarlet & Violet', number: '86', price: 4.50 },
      { cardId: 'sv01-085', name: 'Kirlia', quantity: 4, category: 'Pokemon', setName: 'Scarlet & Violet', number: '85', price: 0.75 },
      { cardId: 'sv01-084', name: 'Ralts', quantity: 4, category: 'Pokemon', setName: 'Scarlet & Violet', number: '84', price: 0.35 },
      { cardId: 'sv04-086', name: 'Scream Tail', quantity: 2, category: 'Pokemon', setName: 'Paradox Rift', number: '86', price: 1.25 },
      { cardId: 'sv01-089', name: 'Drifloon', quantity: 2, category: 'Pokemon', setName: 'Scarlet & Violet', number: '89', price: 0.50 },
      { cardId: 'sv06-095', name: 'Munkidori', quantity: 2, category: 'Pokemon', setName: 'Twilight Masquerade', number: '95', price: 3.50 },
      { cardId: 'sv04-089', name: 'Flutter Mane', quantity: 1, category: 'Pokemon', setName: 'Paradox Rift', number: '89', price: 0.90 },
      { cardId: 'sv06pt5-038', name: 'Fezandipiti ex', quantity: 1, category: 'Pokemon', setName: 'Shrouded Fable', number: '38', price: 11.50 },
      { cardId: 'sv05-144', name: 'Buddy-Buddy Poffin', quantity: 4, category: 'Trainer', setName: 'Temporal Forces', number: '144', price: 1.80 },
      { cardId: 'sv01-196', name: 'Ultra Ball', quantity: 4, category: 'Trainer', setName: 'Scarlet & Violet', number: '196', price: 0.40 },
      { cardId: 'sv01-181', name: 'Nest Ball', quantity: 2, category: 'Trainer', setName: 'Scarlet & Violet', number: '181', price: 0.40 },
      { cardId: 'sv01-191', name: 'Rare Candy', quantity: 2, category: 'Trainer', setName: 'Scarlet & Violet', number: '191', price: 0.35 },
      { cardId: 'sv02-188', name: 'Super Rod', quantity: 2, category: 'Trainer', setName: 'Paldea Evolved', number: '188', price: 0.75 },
      { cardId: 'sv04-163', name: 'Counter Catcher', quantity: 2, category: 'Trainer', setName: 'Paradox Rift', number: '160', price: 1.10 },
      { cardId: 'sv04-166', name: 'Earthen Vessel', quantity: 2, category: 'Trainer', setName: 'Paradox Rift', number: '163', price: 2.20 },
      { cardId: 'sv06-165', name: 'Unfair Stamp', quantity: 1, category: 'Trainer', setName: 'Twilight Masquerade', number: '165', price: 9.50 },
      { cardId: 'sv01-166', name: 'Arven', quantity: 2, category: 'Trainer', setName: 'Scarlet & Violet', number: '166', price: 1.50 },
      { cardId: 'sv01-169', name: 'Boss Orders', quantity: 2, category: 'Trainer', setName: 'Scarlet & Violet', number: '169', price: 0.60 },
      { cardId: 'sv03-186', name: 'Iono', quantity: 4, category: 'Trainer', setName: 'Obsidian Flames', number: '186', price: 4.50 },
      { cardId: 'sv02-192', name: 'Professor Research', quantity: 2, category: 'Trainer', setName: 'Paldea Evolved', number: '192', price: 0.50 },
      { cardId: 'sv03-195', name: 'Super Effective Glasses', quantity: 1, category: 'Trainer', setName: 'Obsidian Flames', number: '195', price: 0.30 },
      { cardId: 'sv03-193', name: 'Town Store', quantity: 2, category: 'Trainer', setName: 'Obsidian Flames', number: '193', price: 0.40 },
      { cardId: 'sv01-172', name: 'Collated Stadium', quantity: 1, category: 'Trainer', setName: 'Scarlet & Violet', number: '172', price: 0.30 },
      { cardId: 'sv01-092', name: 'Basic Psychic Energy', quantity: 7, category: 'Energy', setName: 'Basic Energy', number: '5', price: 0.20 },
    ],
  },
  'charizard-ex': {
    id: 'deck-charizard-ex',
    slug: 'charizard-ex',
    source: 'Artistic Curation (2026 Collection Cycle)',
    curationDate: 'Modern Era curation as of April 2026',
    name: 'Charizard ex & Pidgeot ex',
    era: 'Modern (Scarlet & Violet)',
    description: 'Iconic Fire-type high-power showcase combining Charizard ex with Pidgeot ex search engine and cascading energy acceleration.',
    keyPokemon: 'Charizard ex, Pidgeot ex, Lumineon V, Rotom V',
    colorHex: '#EA580C',
    estPrice: 112.00,
    entries: [
      { cardId: 'sv03-125', name: 'Charizard ex', quantity: 3, category: 'Pokemon', setName: 'Obsidian Flames', number: '125', price: 22.00 },
      { cardId: 'sv03-027', name: 'Charmander', quantity: 4, category: 'Pokemon', setName: 'Obsidian Flames', number: '27', price: 1.50 },
      { cardId: 'sv03-164', name: 'Pidgeot ex', quantity: 2, category: 'Pokemon', setName: 'Obsidian Flames', number: '164', price: 8.50 },
      { cardId: 'sv03-163', name: 'Pidgey', quantity: 2, category: 'Pokemon', setName: 'Obsidian Flames', number: '163', price: 0.40 },
      { cardId: 'swsh11-049', name: 'Lumineon V', quantity: 1, category: 'Pokemon', setName: 'Lost Origin', number: '49', price: 3.20 },
      { cardId: 'swsh8-058', name: 'Rotom V', quantity: 1, category: 'Pokemon', setName: 'Brilliant Stars', number: '58', price: 1.50 },
      { cardId: 'sv05-144', name: 'Buddy-Buddy Poffin', quantity: 4, category: 'Trainer', setName: 'Temporal Forces', number: '144', price: 1.80 },
      { cardId: 'sv01-196', name: 'Ultra Ball', quantity: 4, category: 'Trainer', setName: 'Scarlet & Violet', number: '196', price: 0.40 },
      { cardId: 'sv01-181', name: 'Nest Ball', quantity: 2, category: 'Trainer', setName: 'Scarlet & Violet', number: '181', price: 0.40 },
      { cardId: 'sv01-191', name: 'Rare Candy', quantity: 4, category: 'Trainer', setName: 'Scarlet & Violet', number: '191', price: 0.35 },
      { cardId: 'sv02-188', name: 'Super Rod', quantity: 2, category: 'Trainer', setName: 'Paldea Evolved', number: '188', price: 0.75 },
      { cardId: 'sv04-163', name: 'Counter Catcher', quantity: 1, category: 'Trainer', setName: 'Paradox Rift', number: '160', price: 1.10 },
      { cardId: 'sv04-166', name: 'Earthen Vessel', quantity: 3, category: 'Trainer', setName: 'Paradox Rift', number: '163', price: 2.20 },
      { cardId: 'sv05-160', name: 'Prime Catcher', quantity: 1, category: 'Trainer', setName: 'Temporal Forces', number: '157', price: 14.50 },
      { cardId: 'sv06pt5-061', name: 'Night Stretcher', quantity: 1, category: 'Trainer', setName: 'Shrouded Fable', number: '61', price: 1.80 },
      { cardId: 'sv04-178', name: 'Technical Machine: Evolution', quantity: 2, category: 'Trainer', setName: 'Paradox Rift', number: '178', price: 0.50 },
      { cardId: 'sv01-092', name: 'Basic Fire Energy', quantity: 6, category: 'Energy', setName: 'Basic Energy', number: '2', price: 0.20 },
      { cardId: 'sv05-161', name: 'Mist Energy', quantity: 1, category: 'Energy', setName: 'Temporal Forces', number: '161', price: 1.20 },
    ],
  },
};

export function getCollectionDeckBySlug(slug: string): CollectionDeck | undefined {
  return COLLECTION_DECKS[slug];
}

// Backward compatibility aliases
export type CollectiondeckEntry = CollectionDeckEntry;
export type Collectiondeck = CollectionDeck;
export const COLLECTION_deckS = COLLECTION_DECKS;
export const getCollectiondeckBySlug = getCollectionDeckBySlug;
