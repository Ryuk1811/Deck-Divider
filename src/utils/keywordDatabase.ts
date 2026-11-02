/**
 * Client-Side Keyword Database & Dynamic Meta Tag Engine
 * Maximizes search engine indexing and relevance for sets, thematic decks, graded slabs, and collectors.
 */

import { CardSet, PokemonCard, deck } from '../types';

export interface KeywordCluster {
  id: string;
  category: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailQueries: string[];
}

export const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    id: 'master-set-checklists',
    category: 'Expansion Sets & Master Binders',
    primaryKeywords: [
      'Pokémon TCG master set checklist',
      'Pokémon card binder checklist complete',
      'Pokémon card checklist with prices',
      'Prismatic Evolutions complete card list',
      'Surging Sparks set list with reverse holos',
      'Scarlet and Violet 151 master set tracker',
      'Crown Zenith secret rare checklist'
    ],
    secondaryKeywords: [
      'Pokéball holo masterball checklist',
      'Secret Illustration Rare list by set',
      'Special Art Rare full visual checklist',
      'Print run master binder spreadsheet',
      'Pokémon card numbers master checklist',
      'TCGplayer market value guide'
    ],
    longTailQueries: [
      'how to track reverse holos and masterball holos',
      'what cards are needed for complete binder',
      'free interactive Pokémon TCG master set tracker no ads',
      'all secret illustration rares with market prices'
    ]
  },
  {
    id: 'artistic-display-decks',
    category: 'Artistic Collection decks',
    primaryKeywords: [
      'Pokémon TCG artistic display decks',
      'curated Pokémon card showcases',
      'thematic binder deck builder',
      'luxury Pokémon card collection studio',
      'art-style Pokémon binder layouts',
      'master set display organization'
    ],
    secondaryKeywords: [
      'Modern Mid-Era Vintage classification',
      '60-item Pokémon showcase decks',
      'thematic card arrangement guide',
      'luxury asset Pokémon tracking',
      'display deck capacity caps',
      'high-fidelity card export'
    ],
    longTailQueries: [
      'how to organize cards by artistic era',
      'best way to display thematic Pokémon decks',
      'calculate total market value of curated decks',
      'top artistic collection showcases shared by trainers'
    ]
  },
  {
    id: 'graded-slabs-psa',
    category: 'Graded Slabs & Certifications',
    primaryKeywords: [
      'PSA 10 Pokémon card value tracker',
      'BGS 9.5 vs PSA 10 price comparison Pokémon',
      'Pokémon slab collection certificate registry',
      'Beckett Black Label 10 tracker',
      'CGC Pristine 10 Pokémon card values'
    ],
    secondaryKeywords: [
      'Raw Near Mint to PSA 10 price multiplier',
      'ACE Grading slab certificate lookup app',
      'Graded card portfolio insurance value'
    ],
    longTailQueries: [
      'is my card worth grading PSA 10 calculator',
      'how to track Pokémon graded slab certificates free',
      'track Beckett subgrades centering corners edges surface online'
    ]
  },
  {
    id: 'socials-and-reviews',
    category: 'Community, Social Badges & Trainer Reviews',
    primaryKeywords: [
      'DECK divider Reddit r/DeckDivider community',
      'DECK divider Instagram @deckdivider card showcases',
      'DECK divider X Twitter @DeckDivider market updates',
      'Pokémon TCG collector reddit discussions',
      'DECK divider app reviews and ratings',
      'Pokémon card tracker reviews',
      'best free Pokémon TCG deck studio review',
      'community feedback Pokémon TCG tracker'
    ],
    secondaryKeywords: [
      'official Pokémon TCG collector socials',
      'join r/DeckDivider reddit Pokémon cards',
      'follow @deckdivider on Instagram Pokémon slabs',
      'DECK divider Twitter updates and patch notes',
      'trainer feedback and ratings',
      'verified Pokémon card collection portfolio reviews'
    ],
    longTailQueries: [
      'where to find Pokémon card collector reddit community r/DeckDivider',
      'how to submit reviews for Pokémon TCG portfolio tracker',
      'follow Pokémon card slab showcases on Instagram @deckdivider',
      'unbiased reviews of Pokémon card checklist apps'
    ]
  }
];

/**
 * Generates tailored, high-intent SEO keywords and metadata for an expansion set.
 */
export function generateSetSeoMetadata(set: CardSet | null, cards: PokemonCard[] = [], page: number = 1) {
  if (!set) {
    return {
      title: 'Pokémon Expansion Checklists & Market Values | DECK / divider',
      description: 'Explore 218 catalogued sets (148+ master checklists), secret illustration rares, and live TCGplayer market prices.',
      canonical: 'https://deckdivider.app/sets',
      canonicalPath: '/sets',
      keywords: [
        'pokemon tcg expansion',
        'pokemon card checklist',
        'pokemon card set list',
        'tcgplayer card prices',
        'master set tracker'
      ]
    };
  }

  const setName = set.name;
  const seriesName = set.series || 'Pokémon TCG';
  const totalCount = set.total || cards.length || 0;

  // Extract notable cards / rarities present
  const notableCardNames = cards
    .slice(0, 8)
    .map(c => c.name)
    .filter((v, i, a) => a.indexOf(v) === i);

  const rarityKeywords: string[] = [];
  if (seriesName.toLowerCase().includes('scarlet') || seriesName.toLowerCase().includes('violet')) {
    rarityKeywords.push(
      `${setName} Secret Illustration Rare (SIR)`,
      `${setName} Illustration Rare (IR)`,
      `${setName} Special Art Rare (SAR)`,
      `${setName} Hyper Rare Gold cards`
    );
  } else if (seriesName.toLowerCase().includes('sword') || seriesName.toLowerCase().includes('shield')) {
    rarityKeywords.push(
      `${setName} Alternate Art Secret Rares`,
      `${setName} VMAX VSTAR card list`,
      `${setName} Rainbow Rare trainer list`
    );
  } else {
    rarityKeywords.push(
      `${setName} Holo Rares`,
      `${setName} Secret Rares`,
      `${setName} Vintage card checklist`
    );
  }

  const pageSuffix = page > 1 ? ` | Page ${page}` : '';

  const keywords = Array.from(
    new Set([
      `${setName} card list`,
      `${setName} checklist`,
      `${setName} master set`,
      `${setName} price guide`,
      `${setName} chase cards`,
      `${setName} ${seriesName}`,
      `${setName} binder checklist`,
      `${setName} reverse holos`,
      `${setName} TCGplayer market prices`,
      'Pokémon TCG master set checklist',
      'Pokémon card binder tracker no ads',
      ...rarityKeywords,
      ...notableCardNames.map(n => `${setName} ${n}`),
      'TCGplayer lowest verified prices'
    ])
  );

  const description = `Complete ${setName} (${seriesName}) card checklist with all ${totalCount} cards. Track Secret Illustration Rares, reverse holos, and real-time TCGplayer market values.${page > 1 ? ` (Page ${page})` : ''}`;
  const title = `${setName} Checklist, Card Prices & Market Value | DECK / divider${pageSuffix}`;
  const canonicalPath = `/set/${set.id}`;
  const canonical = `https://deckdivider.app${canonicalPath}`;

  return {
    title,
    description,
    canonical,
    canonicalPath,
    keywords
  };
}

/**
 * Generates tailored, high-intent SEO keywords and metadata for a curated display deck.
 */
export function generatedeckSeoMetadata(deck: deck | null, deckId?: string) {
  if (!deck) {
    return {
      title: 'Pokémon TCG deck Display & Curation | DECK / divider',
      description: 'View curated display decks, era-based classifications, and premium collection showcases.',
      canonical: 'https://deckdivider.app/decks',
      canonicalPath: '/decks',
      keywords: [
        'pokemon tcg deck list',
        'curated card showcase',
        'artistic display deck',
        '60 item deck studio',
        'era based collection guide'
      ]
    };
  }

  const deckName = deck.name || 'Artistic Display deck';
  const cardCount = deck.entries?.reduce((acc, c) => acc + (c.quantity || 1), 0) || 60;
  
  // Extract key Pokémon and Trainers
  const keyCards = (deck.entries || [])
    .map(e => e.card?.name)
    .filter(Boolean)
    .slice(0, 10) as string[];

  const keywords = Array.from(
    new Set([
      `${deckName} deck list`,
      `${deckName} curated display build`,
      `${deckName} collection showcase`,
      `${deckName} Pokémon artistic list`,
      `${deckName} era based curation`,
      `${deckName} item counts and aesthetics`,
      'Pokémon TCG display decks 2026',
      'Artistic deck organization guide',
      'Thematic binder arrangement rules',
      '60-item Pokémon deck studio',
      ...keyCards.map(c => `${deckName} ${c}`)
    ])
  );

  const targetId = deck.id || deckId || 'deck';
  const canonicalPath = `/deck/${targetId}`;
  const canonical = `https://deckdivider.app${canonicalPath}`;
  const title = `${deckName} — Pokémon TCG deck | DECK / divider`;
  const description = `View ${deckName} (${cardCount} items) with real-time TCGplayer deck pricing, full item counts, and artistic display layouts.`;

  return {
    title,
    description,
    canonical,
    canonicalPath,
    keywords
  };
}

/**
 * Universal imperative helper to dynamically update document <meta> tags
 * (canonical, description, keywords, Open Graph, Twitter, JSON-LD).
 */
export function updateDocumentMetaTags(options: {
  title: string;
  description: string;
  canonicalPath: string;
  keywords: string[] | string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}): void {
  if (typeof document === 'undefined') return;

  const { title, description, canonicalPath, keywords, ogImage = 'https://deckdivider.app/og-image.png?v=2', ogType = 'website', jsonLd } = options;

  // 1. Update Title
  const formattedTitle = title.includes('DECK / divider') ? title : `${title} | DECK / divider`;
  document.title = formattedTitle;

  // Helper to upsert meta tag
  const setMeta = (attributeName: string, attributeValue: string, content: string) => {
    let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attributeValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Update Description
  if (description) {
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
  }

  // 3. Update Keywords
  if (keywords) {
    const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    setMeta('name', 'keywords', keywordsStr);
  }

  // 4. Update Canonical Link
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const fullCanonicalUrl = `https://deckdivider.app${cleanPath === '/' ? '' : cleanPath.replace(/\/$/, '')}`;

  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    linkCanonical.id = 'canonical-link';
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', fullCanonicalUrl);

  // 5. Update Open Graph & Twitter Cards
  setMeta('property', 'og:title', formattedTitle);
  setMeta('property', 'og:url', fullCanonicalUrl);
  setMeta('property', 'og:type', ogType);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:site_name', 'DECK / divider');

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', formattedTitle);
  setMeta('name', 'twitter:image', ogImage);

  // 6. Update JSON-LD Schema
  if (jsonLd) {
    let scriptTag = document.getElementById('route-specific-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'route-specific-jsonld';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);
  }
}
