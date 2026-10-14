export type AccountTier = 'Starter' | 'Bunch' | 'Stack' | 'Deck' | 'Collection';

export interface TierEntitlement {
  id: AccountTier;
  name: string;
  tagline: string;
  popular?: boolean;
  pricing: {
    monthly: number;
    yearly: number;
    yearlyDiscountPercent: number;
  };
  limits: {
    decks: number;
    cardsPerDeck: number;
    wishlists: number;
    itemsPerList: number;
    gradedSlabs: number;
    sealedItems: number;
  };
  capabilities: {
    canSharePublicLinks: boolean;
    hasMultiCurrency: boolean;
    hasGlcAndRetroLegality: boolean;
    hasCsvExport: boolean;
    hasCloudBackups: boolean;
    hasGradedMarketComps: boolean;
    hasPtcglExport: boolean;
    hasPriorityMarketSync: boolean;
  };
  features: string[];
}

export const CENTRAL_ENTITLEMENTS: Record<AccountTier, TierEntitlement> = {
  Starter: {
    id: 'Starter',
    name: 'Starter',
    tagline: 'Laddered deckbuilder (6, 30 & 60 cards) & collection starter',
    popular: false,
    pricing: {
      monthly: 0,
      yearly: 0,
      yearlyDiscountPercent: 0,
    },
    limits: {
      decks: 6,
      cardsPerDeck: 60,
      wishlists: 5,
      itemsPerList: 100,
      gradedSlabs: 25,
      sealedItems: 15,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: false,
      hasGlcAndRetroLegality: false,
      hasCsvExport: false,
      hasCloudBackups: false,
      hasGradedMarketComps: false,
      hasPtcglExport: true,
      hasPriorityMarketSync: false,
    },
    features: [
      'Up to 6 custom decks',
      'Laddered deck sizes: 6-card mini, 30-card half & 60-card standard decks',
      'Max 60 cards per deck cap',
      'Up to 5 binder lists & wishlists',
      'Max 100 items per list',
      'Instant card search across 218 catalogued sets & series',
      'Daily TCGplayer market prices (USD)',
      'Log up to 25 graded slabs & 15 sealed items',
      'Shareable public showcase link',
    ],
  },
  Bunch: {
    id: 'Bunch',
    name: 'Bunch',
    tagline: 'Multi-currency NAV & expanded binder capacity',
    popular: false,
    pricing: {
      monthly: 4,
      yearly: 42,
      yearlyDiscountPercent: 13,
    },
    limits: {
      decks: 15,
      cardsPerDeck: 75,
      wishlists: 15,
      itemsPerList: 300,
      gradedSlabs: 100,
      sealedItems: 50,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasGlcAndRetroLegality: false,
      hasCsvExport: false,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasPtcglExport: true,
      hasPriorityMarketSync: false,
    },
    features: [
      'Up to 15 custom decks',
      'Up to 75 cards per deck (6, 30, 60 + 15 sideboard)',
      'Up to 15 binder lists & wishlists',
      'Max 300 items per list',
      'PSA, BGS & CGC grade and cert logging (up to 100 slabs)',
      'Historical price trends & multi-currency conversion',
      'Encrypted cloud snapshot restore',
    ],
  },
  Stack: {
    id: 'Stack',
    name: 'Stack',
    tagline: 'Public share links, GLC legality & tournament specs',
    popular: false,
    pricing: {
      monthly: 7,
      yearly: 75,
      yearlyDiscountPercent: 11,
    },
    limits: {
      decks: 30,
      cardsPerDeck: 100,
      wishlists: 30,
      itemsPerList: 750,
      gradedSlabs: 300,
      sealedItems: 150,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasGlcAndRetroLegality: true,
      hasCsvExport: false,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasPtcglExport: true,
      hasPriorityMarketSync: false,
    },
    features: [
      'Up to 30 custom decks',
      'Up to 100 cards per deck (full 100-card GLC & Singleton rosters)',
      'Up to 30 binder lists & wishlists',
      'Max 750 items per list',
      'Shareable deck links with dynamic previews',
      'Gym Leader Challenge (GLC) & Retro format legality',
      'Track up to 300 slabs & 150 sealed items',
      'Public Collection Showcase mode',
    ],
  },
  Deck: {
    id: 'Deck',
    name: 'Deck',
    tagline: 'High-volume collector vaults & market comps engine',
    popular: true,
    pricing: {
      monthly: 11,
      yearly: 120,
      yearlyDiscountPercent: 9,
    },
    limits: {
      decks: 60,
      cardsPerDeck: 150,
      wishlists: 60,
      itemsPerList: 1500,
      gradedSlabs: 1000,
      sealedItems: 500,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasGlcAndRetroLegality: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasPtcglExport: true,
      hasPriorityMarketSync: false,
    },
    features: [
      'Up to 60 custom decks',
      'Up to 150 cards per deck (high-capacity mega rosters)',
      'Up to 60 binder lists & wishlists',
      'Max 1,500 items per list',
      'PTCGL 1-click text import & export',
      'Sealed booster box & ETB vault ledger (500 items)',
      'Log up to 1,000 PSA/BGS/CGC graded slabs',
      'Full portfolio & trade ledger CSV export',
    ],
  },
  Collection: {
    id: 'Collection',
    name: 'Collection',
    tagline: 'Complete master collector vault & limitless deckbuilder',
    popular: false,
    pricing: {
      monthly: 14,
      yearly: 150,
      yearlyDiscountPercent: 11,
    },
    limits: {
      decks: Infinity,
      cardsPerDeck: Infinity,
      wishlists: Infinity,
      itemsPerList: Infinity,
      gradedSlabs: Infinity,
      sealedItems: Infinity,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasGlcAndRetroLegality: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasPtcglExport: true,
      hasPriorityMarketSync: true,
    },
    features: [
      'Unlimited custom decks (∞)',
      'Unlimited cards per deck (∞) across all ladder sizes (6, 30, 60, 100, ∞)',
      'Unlimited binder lists & wishlists (∞)',
      'Unlimited items per list (∞)',
      'Unlimited graded slabs & sealed vault products (∞)',
      'Priority sub-second market sync',
      'Advanced subgrade delta analytics',
      'Full automated cloud backups & CSV exports',
    ],
  },
};

export const TIER_PRICES: Record<string, number> = {
  Bunch: 4,
  Stack: 7,
  Deck: 11,
  Collection: 14,
};

export const TIER_PRICES_YEARLY: Record<string, number> = {
  Bunch: 42,
  Stack: 75,
  Deck: 120,
  Collection: 150,
};
