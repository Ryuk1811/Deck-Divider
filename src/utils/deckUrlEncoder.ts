import { Deck, PortfolioCardEntry, PokemonCard } from '../types';

export function encodeDeckToUrlParam(deck: Deck): string {
  try {
    // We only need the essential data to reconstruct the deck visually
    const minimizedDeck = {
      i: deck.id,
      n: deck.name,
      c: deck.colorHex,
      p: deck.entries.map((entry) => ({
        i: entry.card.id,
        q: entry.quantity
      }))
    };
    const jsonString = JSON.stringify(minimizedDeck);
    return btoa(jsonString); // Basic base64 encoding
  } catch (err) {
    console.error('Failed to encode deck', err);
    return '';
  }
}

export function decodeUrlParamToDeck(encoded: string): Partial<Deck> | null {
  try {
    const jsonString = atob(encoded);
    const parsed = JSON.parse(jsonString);
    
    // We reconstruct a partial deck. The actual cards will need to be hydrated
    // using the search engine or TCGdex API, but we have their IDs and quantities.
    return {
      id: parsed.i,
      name: parsed.n,
      colorHex: parsed.c,
      entries: parsed.p.map((p: any) => ({
        card: { id: p.i, name: 'Loading...', set: { name: '' }, number: '', rarity: '' } as unknown as PokemonCard, // Placeholder until hydrated
        quantity: p.q
      }))
    } as Partial<Deck>;
  } catch (err) {
    console.error('Failed to decode deck', err);
    return null;
  }
}
