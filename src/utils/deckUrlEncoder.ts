import { Deck, PortfolioCardEntry } from '../types';

interface CompactDeckPayload {
  i: string; // id
  n: string; // name
  d?: string; // description
  c?: string; // colorHex
  cc?: string; // coverCardId
  t?: string[]; // tags
  p?: Array<{
    i: string; // card id
    q: number; // quantity
    f?: number; // foil
    g?: { c: string; g: string }; // grading
    v?: number; // purchase price
  }>;
}

export function encodeDeckToUrlParam(deck: Deck): string {
  try {
    const compact: CompactDeckPayload = {
      i: deck.id,
      n: deck.name,
      d: deck.description,
      c: deck.colorHex,
      cc: deck.coverCardId,
      t: deck.tags,
      p: (deck.entries || []).map((e) => ({
        i: e.card?.id || (e as any).cardId || e.id || '',
        q: e.quantity || 1,
        ...(e.notes?.includes('Foil') ? { f: 1 } : {}),
        ...(e.gradingInfo ? { g: { c: e.gradingInfo.company, g: e.gradingInfo.grade } } : {}),
        ...(e.purchasePrice ? { v: e.purchasePrice } : {}),
      })).filter((e) => Boolean(e.i)),
    };
    const jsonString = JSON.stringify(compact);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error('Failed to encode deck to URL param:', err);
    return '';
  }
}

export function decodeUrlParamToDeck(param: string): Deck | null {
  try {
    if (!param) return null;
    const jsonString = atob(decodeURIComponent(param));
    const bytes = new Uint8Array(jsonString.length);
    for (let i = 0; i < jsonString.length; i++) {
      bytes[i] = jsonString.charCodeAt(i);
    }
    const decodedJson = new TextDecoder().decode(bytes);
    const compact: CompactDeckPayload = JSON.parse(decodedJson);
    if (!compact || !compact.i || !compact.n) return null;

    const deck: Deck = {
      id: compact.i,
      name: compact.n,
      description: compact.d || '',
      colorHex: compact.c || '#DC143C',
      isPublic: true,
      coverCardId: compact.cc,
      tags: compact.t || [],
      entries: (compact.p || []).map((p, idx): PortfolioCardEntry => ({
        id: `entry-${idx}-${p.i}`,
        cardId: p.i,
        quantity: p.q || 1,
        condition: 'NM',
        purchasePrice: p.v || 0,
        purchaseCurrency: 'USD',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: p.f ? 'Foil' : undefined,
        gradingInfo: p.g ? { company: p.g.c as any, grade: p.g.g } : undefined,
        isSold: false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return deck;
  } catch (err) {
    console.error('Failed to decode URL param to deck:', err);
    return null;
  }
}

// Backward compatibility aliases
export const encodedeckToUrlParam = encodeDeckToUrlParam;
export const decodeUrlParamTodeck = decodeUrlParamToDeck;
