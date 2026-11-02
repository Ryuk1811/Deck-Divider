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
    itemsPerDeck: number;
    wishlists: number;
    itemsPerList: number;
    gradedSlabs: number;
    sealedItems: number;
  };
  capabilities: {
    canSharePublicLinks: boolean;
    hasMultiCurrency: boolean;
    hasCustomDecks: boolean;
    hasCsvExport: boolean;
    hasCloudBackups: boolean;
    hasGradedMarketComps: boolean;
    hasDeckExport: boolean;
    hasPriorityMarketSync: boolean;
    hasCertLookup?: boolean;
  };
  features: string[];
}

export const CENTRAL_ENTITLEMENTS: Record<AccountTier, TierEntitlement> = {
  Starter: {
    id: 'Starter',
    name: 'Starter',
    tagline: 'Art-style collection studio & personal collection starter',
    popular: false,
    pricing: {
      monthly: 0,
      yearly: 0,
      yearlyDiscountPercent: 0,
    },
    limits: {
      decks: 6,
      itemsPerDeck: 60,
      wishlists: 0,
      itemsPerList: 0,
      gradedSlabs: 0,
      sealedItems: 0,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: false,
      hasCustomDecks: true,
      hasCsvExport: true,
      hasCloudBackups: false,
      hasGradedMarketComps: false,
      hasDeckExport: true,
      hasPriorityMarketSync: false,
      hasCertLookup: false,
    },
    features: [
      'Up to 6 custom display decks (max 60 items per deck)',
      'Condition tracking & art-style foil tags',
      'Instant card search across 218 catalogued sets',
      'Daily market price index (USD)',
      'Public collection showcase link',
      'Full portfolio CSV export',
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
      itemsPerDeck: 100,
      wishlists: 25,
      itemsPerList: 500,
      gradedSlabs: 0,
      sealedItems: 100,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasCustomDecks: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasDeckExport: true,
      hasPriorityMarketSync: false,
      hasCertLookup: false,
    },
    features: [
      'Up to 15 custom display decks (max 100 items per deck)',
      'Up to 25 binder lists & wishlists (500 items per list)',
      'Track up to 100 sealed vault products',
      'Historical price trends & global currency conversion',
      'Encrypted cloud snapshot restore',
    ],
  },
  Stack: {
    id: 'Stack',
    name: 'Stack',
    tagline: 'Slab registry, public share links & premium branding',
    popular: false,
    pricing: {
      monthly: 7,
      yearly: 75,
      yearlyDiscountPercent: 11,
    },
    limits: {
      decks: 30,
      itemsPerDeck: 140,
      wishlists: 50,
      itemsPerList: 1000,
      gradedSlabs: 500,
      sealedItems: 300,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasCustomDecks: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasDeckExport: true,
      hasPriorityMarketSync: false,
      hasCertLookup: false,
    },
    features: [
      'Up to 30 custom display decks (max 140 items per deck)',
      'Up to 50 binder lists & wishlists (1,000 items per list)',
      'Certified slab registry (up to 500 PSA/BGS/CGC slabs)',
      'Shareable display links with premium branding',
      'Track up to 300 sealed items in vault',
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
      itemsPerDeck: 220,
      wishlists: 100,
      itemsPerList: 2500,
      gradedSlabs: 1000,
      sealedItems: 750,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasCustomDecks: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasDeckExport: true,
      hasPriorityMarketSync: false,
      hasCertLookup: false,
    },
    features: [
      'Up to 60 custom display decks (max 220 items per deck)',
      'Up to 100 binder lists & wishlists (2,500 items per deck/list)',
      'Sealed booster box & ETB vault ledger (750 items)',
      'Log up to 1,000 PSA/BGS/CGC graded slabs',
      'Live market comps and auction analysis',
      'Full portfolio & trade ledger CSV import/export',
    ],
  },
  Collection: {
    id: 'Collection',
    name: 'Collection Unlimited',
    tagline: 'Unlimited vaulted capacity, priority market feeds & full API access',
    popular: false,
    pricing: {
      monthly: 19,
      yearly: 199,
      yearlyDiscountPercent: 13,
    },
    limits: {
      decks: Infinity,
      itemsPerDeck: Infinity,
      wishlists: Infinity,
      itemsPerList: Infinity,
      gradedSlabs: Infinity,
      sealedItems: Infinity,
    },
    capabilities: {
      canSharePublicLinks: true,
      hasMultiCurrency: true,
      hasCustomDecks: true,
      hasCsvExport: true,
      hasCloudBackups: true,
      hasGradedMarketComps: true,
      hasDeckExport: true,
      hasPriorityMarketSync: true,
      hasCertLookup: true,
    },
    features: [
      'Unlimited custom display decks & binder lists',
      'Unlimited items per deck & list (Infinity across all vaults)',
      'Unlimited certified slabs & sealed products',
      'Priority price updates & instant market sync',
      'Full CSV collection export & offline backups',
      'Founders Club permanent status badge',
    ],
  },
};
