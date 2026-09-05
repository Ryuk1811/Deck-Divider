import { Deck, PortfolioCardEntry, PokemonCard } from '../types';
import { getCardById, mapToPokemonCard } from '../lib/searchEngine';

export function encodeDeckToUrlParam(deck: Deck): string {
  try {
    // We only need the essential data to reconstruct the deck visually
    const minimizedDeck = {
      i: deck.id,
      n: deck.name,
      c: deck.colorHex,
      p: (deck.entries || []).map((entry) => ({
        i: entry.card?.id || (entry as any).cardId || entry.id,
        q: entry.quantity || 1,
        n: entry.card?.name || undefined,
      }))
    };
    const jsonString = JSON.stringify(minimizedDeck);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error('Failed to encode deck', err);
    return '';
  }
}

export function decodeUrlParamToDeck(encoded: string): Partial<Deck> | null {
  try {
    let jsonString: string;
    try {
      const decodedUrl = decodeURIComponent(encoded);
      const binary = atob(decodedUrl);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonString = new TextDecoder().decode(bytes);
    } catch {
      // Fallback for legacy raw atob
      jsonString = atob(encoded);
    }
    const parsed = JSON.parse(jsonString);

    return {
      id: parsed.i,
      name: parsed.n || 'Shared Deck',
      colorHex: parsed.c || '#DC143C',
      entries: (parsed.p || []).map((p: any) => {
        const fullCard = p.i ? getCardById(p.i) : null;
        const setCode = p.i && p.i.includes('-') ? p.i.split('-')[0] : 'base1';
        const cardNum = p.i && p.i.includes('-') ? p.i.split('-')[1] : (p.i || '1');

        const cardObj: PokemonCard = fullCard ? mapToPokemonCard(fullCard) : ({
          id: p.i || `card-${Math.random()}`,
          name: p.n || ('Card ' + (p.i || '')),
          number: cardNum,
          rarity: 'Common',
          supertype: 'Pokémon',
          subtypes: [],
          set: { id: setCode, name: 'Pokémon TCG', series: 'Pokémon', printedTotal: 1, total: 1, releaseDate: '2024' },
          artist: 'Unknown',
          prices: { raw: 1.5, psa10Estimate: 4.8, psa9Estimate: 2.4, priceHistory: [] },
          images: {
            small: `https://assets.tcgdex.net/en/${setCode}/${cardNum}/low.webp`,
            large: `https://assets.tcgdex.net/en/${setCode}/${cardNum}/high.webp`,
          },
        } as PokemonCard);

        return {
          id: `${parsed.i || 'deck'}-${p.i || Math.random()}`,
          cardId: p.i,
          quantity: p.q || 1,
          card: cardObj,
          condition: 'NM' as const,
          purchasePrice: 1.5,
          purchaseCurrency: 'USD' as const,
          purchaseDate: new Date().toISOString(),
          isSold: false,
        };
      })
    } as Partial<Deck>;
  } catch (err) {
    console.error('Failed to decode deck', err);
    return null;
  }
}

