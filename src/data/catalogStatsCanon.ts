/**
 * Canonical Database & Expansion Statistics
 * Single source of truth across DECK / divider
 */

export const CATALOG_STATS = {
  // Sets & Expansions
  totalSetsAndProducts: 218,
  totalSetsLabel: '218 catalogued sets & series',
  mainlineMasterExpansions: 148,
  mainlineMasterExpansionsLabel: '148+ mainline master-set checklists',
  specialSubsetsAndPromos: 70,
  setsExplanation:
    '218 catalogued Pokémon TCG sets & series: 148 mainline master-set expansions (Base Set through 2026 Scarlet & Violet: Prismatic Evolutions, Surging Sparks, Stellar Crown, Shrouded Fable, Twilight Masquerade, Temporal Forces) plus 70 promotional series and special subsets.',

  // Cards
  totalCardsIndexed: '18,400+',
  totalCardsNumber: 18400,
  totalCardsLabel: '18,400+ card records in full database',
  cardsExplanation:
    '18,400+ individual Pokémon card records indexed across Vintage (1999–2003), Mid-Era (2003–2019), and Modern (2019–2026+) eras with real-time TCGplayer market prices.',
  
  // Public Catalogue Spotlight
  publicSpotlightCount: 301,
  publicSpotlightLabel: '301 curated spotlight cards',
  publicSpotlightExplanation:
    '301 curated spotlight cards pre-loaded for instant in-browser browsing, with ⌘K search querying the complete 18,400+ database records on demand.',
  
  // Update cadence
  priceUpdateCadence: 'Daily market-price updates from verified TCGplayer sales & eBay sold listings',
  portfolioRecalculation: 'Instant portfolio NAV recalculation upon entry, trade, or currency switch',
} as const;
