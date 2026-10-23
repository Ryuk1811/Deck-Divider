import { Deck, CustomList, PortfolioSealedEntry, SharedPortfolioSnapshot } from '../types';
import { getCardById, mapToPokemonCard } from '../lib/searchEngine';

interface CompactPortfolioPayload {
  u?: string; // Display Name
  t?: string; // Tier
  c?: string; // Currency
  d?: Array<{
    i: string;
    n: string;
    c?: string;
    p: Array<{
      i: string; // card id
      q: number; // quantity
      f?: number; // foil (1/0)
      g?: { c: string; g: string }; // grading
      v?: number; // custom value
    }>;
  }>;
  s?: Array<{
    i: string;
    n: string;
    t?: string;
    q: number;
    p?: number;
    m?: number;
    img?: string;
    set?: string;
  }>;
  l?: Array<{
    i: string;
    n: string;
    c?: string;
    ids: string[];
  }>;
}

/**
 * Compactly encodes user portfolio state into a URL-safe Base64 string
 */
export function encodePortfolioToUrl(portfolio: {
  decks: Deck[];
  customLists?: CustomList[];
  sealedEntries?: PortfolioSealedEntry[];
  displayName?: string;
  tier?: string;
  currency?: string;
}): string {
  try {
    const compact: CompactPortfolioPayload = {
      u: portfolio.displayName || 'Collector',
      t: portfolio.tier || 'Stack',
      c: portfolio.currency || 'USD',
      d: (portfolio.decks || []).map((deck) => ({
        i: deck.id,
        n: deck.name,
        c: deck.colorHex,
        p: (deck.entries || []).map((e) => ({
          i: e.card?.id || (e as any).cardId || e.id || '',
          q: e.quantity || 1,
          ...(e.notes?.includes('Foil') ? { f: 1 } : {}),
          ...(e.gradingInfo ? { g: { c: e.gradingInfo.company, g: e.gradingInfo.grade } } : {}),
          ...(e.purchasePrice ? { v: e.purchasePrice } : {}),
        })).filter((e) => Boolean(e.i)),
      })),
      s: (portfolio.sealedEntries || []).map((s) => ({
        i: s.id,
        n: s.product?.name || 'Sealed Product',
        t: s.product?.type,
        q: s.quantity || 1,
        p: s.purchasePrice || 0,
        m: s.product?.marketPrice || 0,
        img: s.product?.imageUrl,
        set: s.product?.set?.name,
      })),
      l: (portfolio.customLists || []).map((list) => ({
        i: list.id,
        n: list.name,
        c: '#0078D4',
        ids: list.cardIds || [],
      })),
    };

    const jsonString = JSON.stringify(compact);
    // URL safe base64
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error('Failed to encode portfolio to URL:', err);
    return '';
  }
}

/**
 * Decodes URL parameter string and hydrates complete Portfolio Snapshot state
 */
export function decodeUrlParamToPortfolio(encodedStr: string): SharedPortfolioSnapshot | null {
  try {
    let jsonStr: string;
    try {
      const decodedUrl = decodeURIComponent(encodedStr);
      const binary = atob(decodedUrl);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder().decode(bytes);
    } catch {
      jsonStr = atob(encodedStr);
    }
    const parsed = JSON.parse(jsonStr) as CompactPortfolioPayload;

    const decks: Deck[] = (parsed.d || []).map((d) => ({
      id: d.i,
      name: d.n,
      description: 'Shared Deck Link',
      colorHex: d.c || '#DC143C',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entries: (d.p || []).map((p) => {
        const fullCard = p.i ? getCardById(p.i) : null;
        const setCode = p.i && p.i.includes('-') ? p.i.split('-')[0] : 'base1';
        const cardNum = p.i && p.i.includes('-') ? p.i.split('-')[1] : (p.i || '1');

        const cardObj = fullCard ? mapToPokemonCard(fullCard) : ({
          id: p.i || `card-${Math.random()}`,
          name: 'Card ' + (p.i || ''),
          number: cardNum,
          rarity: 'Common',
          supertype: 'Pokémon',
          subtypes: [],
          set: { id: setCode, name: 'Pokémon TCG', series: 'Pokémon', printedTotal: 1, total: 1, releaseDate: '2024' },
          artist: 'Unknown',
          prices: { raw: p.v || 1.5, psa10Estimate: 4.8, psa9Estimate: 2.4, priceHistory: [] },
          images: {
            small: `https://assets.tcgdex.net/en/${setCode}/${cardNum}/low.webp`,
            large: `https://assets.tcgdex.net/en/${setCode}/${cardNum}/high.webp`,
          },
        } as any);

        return {
          id: `${d.i}-${p.i}`,
          cardId: p.i,
          quantity: p.q,
          card: cardObj,
          condition: 'NM' as const,
          purchasePrice: p.v || 0,
          purchaseCurrency: 'USD' as const,
          purchaseDate: new Date().toISOString(),
          isSold: false,
          notes: p.f ? 'Foil' : undefined,
          gradingInfo: p.g ? { company: p.g.c as any, grade: p.g.g, certNumber: '' } : undefined,
        };
      }),
    }));

    const customLists: CustomList[] = (parsed.l || []).map((l) => ({
      id: l.i,
      name: l.n,
      description: 'Shared List',
      cardIds: l.ids || [],
      createdAt: new Date().toISOString(),
    }));

    const sealedEntries: PortfolioSealedEntry[] = (parsed.s || []).map((s) => ({
      id: s.i,
      productId: s.i,
      product: {
        id: s.i,
        name: s.n,
        type: (s.t as any) || 'Booster Box',
        language: 'English',
        set: { id: 'sealed', name: s.set || 'Sealed Set', series: 'Sealed', printedTotal: 1, total: 1, releaseDate: '2024' },
        releaseDate: '2024',
        msrp: s.m || 0,
        marketPrice: s.m || s.p || 0,
        imageUrl: s.img || undefined,
        packCount: 36,
      },
      quantity: s.q || 1,
      purchasePrice: s.p || 0,
      purchaseCurrency: 'USD',
      purchaseDate: new Date().toISOString(),
      condition: 'Factory Sealed',
      isSold: false,
    }));

    return {
      version: 2,
      userId: 'public_share',
      updatedAt: new Date().toISOString(),
      profile: {
        displayName: parsed.u || 'Collector',
        tier: (parsed.t as any) || 'Stack',
        currency: (parsed.c as any) || 'USD',
        isPublicProfile: true,
      },
      decks,
      customLists,
      sealedEntries,
      soldEntries: [],
      recentActivities: [],
    };
  } catch (err) {
    console.error('Failed to decode URL param to portfolio:', err);
    return null;
  }
}
