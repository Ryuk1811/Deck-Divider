/**
 * Single Source of Truth for Platform Identity, Facts, and SEO Constants
 * Used across Server SSR, Sitemaps, Robots, LLMs.txt, and CI Linters.
 */

export const SITE_CONFIG = {
  // Brand & Domain
  brandName: 'DECK / divider — Pokémon TCG Studio',
  shortBrandName: 'DECK / divider',
  alternateNames: ['DECK / divider', 'DeckDivider', 'The Deck Divider'],
  canonicalOrigin: 'https://deckdivider.app',
  tagline: 'Pokémon TCG Collection Tracker, Graded Slab Registry & 60-Card Deckbuilder',
  description: 'An ad-free digital software studio for Pokémon TCG collectors and tournament players. Log raw cards, track PSA slabs, verify 2026 Standard legal decks, and browse live market comps.',
  
  // Organization Details
  organization: {
    name: 'DECK / divider — Pokémon TCG Studio',
    url: 'https://deckdivider.app',
    logo: 'https://deckdivider.app/logo.png',
    founder: 'Alex Thorne',
    sameAs: [
      'https://www.producthunt.com/products/deck-divider',
      'https://www.reddit.com/r/DeckDivider/',
      'https://www.instagram.com/deckdivider/',
      'https://x.com/DeckDivider',
      'https://neeed.directory',
      'https://findly.tools/deck-divider',
      'https://smollaunch.com',
      'https://www.nxgntools.com/tools/deck-divider',
      'https://super-launch.app',
      'https://www.foundrlist.com/product/deckdivider'
    ],
  },

  // Authoritative Metrics (All pages, metadata, and linters must align with these)
  metrics: {
    totalExpansions: 218,
    mainlineExpansions: 148,
    totalCardsIndexed: '18,400+',
    totalCardsIndexedNumeric: 18400,
    supportedCurrenciesCount: 20,
    supportedCurrenciesList: [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK',
      'NZD', 'SGD', 'HKD', 'BRL', 'MXN', 'INR', 'CNY', 'KRW', 'PLN', 'TRY'
    ],
    supportedGraders: ['PSA', 'BGS', 'CGC', 'ACE'],
    priceRefreshCadence: 'Daily automatic sync from verified public market sales',
    marketDataSource: 'Market comps aggregated daily from verified public market sales and historical auction records',
  },

  // Legality & Format Invariants
  formats: {
    standardSeason: '2026–2027 Season',
    standardRotationDate: 'April 10, 2026',
    standardMarks: ['H', 'I', 'J'] as const,
    expandedSeriesRange: 'Black & White through modern Scarlet & Violet expansions',
  },

  // Indexability Gate Rules
  seoGate: {
    edgeCacheTtlSeconds: 120,
    staleWhileRevalidateSeconds: 86400,
    disallowedBotPrefixes: ['/app', '/api', '/dashboard'],
    supportedAliases: {
      '/formats/standard': '/format/standard',
      '/formats/expanded': '/format/expanded',
      '/formats/glc': '/format/glc',
      '/card/chien-pao-ex': '/card/pao-chien-ex',
      '/deck/standard': '/format/standard',
    } as Record<string, string>,
  },
};
