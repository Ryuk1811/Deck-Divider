/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AccountTier = 'Starter' | 'Bunch' | 'Stack' | 'Deck' | 'Collection';

export interface TierLimit {
  name: AccountTier;
  priceMonthly: number; // 0, 11, 22, 33, 44
  maxDecks: number; // Infinity for Collection
  maxCardsPerDeck: number; // Infinity for Collection
  maxLists: number; // Infinity for Collection
  maxItemsPerList: number; // Infinity for Collection
  canSharePublicLinks: boolean;
  tagline: string;
}

export const TIER_LIMITS: Record<AccountTier, TierLimit> = {
  Starter: {
    name: 'Starter',
    priceMonthly: 0,
    maxDecks: 4,
    maxCardsPerDeck: 25,
    maxLists: 3,
    maxItemsPerList: 20,
    canSharePublicLinks: false,
    tagline: 'Entry point for casual collectors',
  },
  Bunch: {
    name: 'Bunch',
    priceMonthly: 11,
    maxDecks: 9,
    maxCardsPerDeck: 40,
    maxLists: 8,
    maxItemsPerList: 50,
    canSharePublicLinks: false,
    tagline: 'For your first graded slabs',
  },
  Stack: {
    name: 'Stack',
    priceMonthly: 22,
    maxDecks: 15,
    maxCardsPerDeck: 50,
    maxLists: 15,
    maxItemsPerList: 100,
    canSharePublicLinks: true,
    tagline: 'Unlocks public deck and showcase share links',
  },
  Deck: {
    name: 'Deck',
    priceMonthly: 33,
    maxDecks: 18,
    maxCardsPerDeck: 60,
    maxLists: 25,
    maxItemsPerList: 200,
    canSharePublicLinks: true,
    tagline: 'Full tournament specs',
  },
  Collection: {
    name: 'Collection',
    priceMonthly: 44,
    maxDecks: Infinity,
    maxCardsPerDeck: Infinity,
    maxLists: Infinity,
    maxItemsPerList: Infinity,
    canSharePublicLinks: true,
    tagline: 'Hold your whole collection with zero limits',
  },
};

export type EnergyType =
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Lightning'
  | 'Psychic'
  | 'Fighting'
  | 'Dark'
  | 'Darkness'
  | 'Steel'
  | 'Metal'
  | 'Dragon'
  | 'Colorless'
  | 'Fairy';

export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Rare Holo'
  | 'Ultra Rare'
  | 'Secret Rare'
  | 'Illustration Rare'
  | 'Special Illustration Rare';

export interface CardAttack {
  name: string;
  cost: EnergyType[];
  damage: string;
  text: string;
}

export interface CardWeakness {
  type: EnergyType;
  value: string;
}

export interface CardSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  symbolUrl?: string;
  logoUrl?: string;
}

export interface CardVariants {
  normal?: boolean;
  reverse?: boolean;
  holo?: boolean;
  firstEdition?: boolean;
  wPrerelease?: boolean;
  secret100?: boolean;
  [key: string]: boolean | undefined;
}

export interface CardLegalities {
  standard?: boolean;
  expanded?: boolean;
}

export interface CardMarketLink {
  url?: string;
  updatedAt?: string;
  price?: number;
  lowPrice?: number;
  trendPrice?: number;
  avgSellPrice?: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface PokemonCard {
  id: string;
  name: string;
  supertype: 'Pokémon' | 'Trainer' | 'Energy' | string;
  subtypes: string[];
  category?: string;
  stage?: string;
  hp?: number;
  types?: EnergyType[];
  attacks?: CardAttack[];
  weaknesses?: CardWeakness[];
  resistances?: CardWeakness[];
  retreatCost?: EnergyType[];
  rarity: CardRarity | string;
  set: CardSet;
  artist: string;
  number: string;
  flavorText?: string;
  description?: string;
  dexId?: number[];
  regulationMark?: string;
  legalities?: CardLegalities;
  variants?: CardVariants;
  cardmarket?: CardMarketLink;
  tcgplayer?: CardMarketLink;
  prices: {
    raw: number;
    psa10Estimate: number;
    psa9Estimate: number;
    priceHistory: PricePoint[];
  };
  images: {
    small: string;
    large: string;
  };
}

export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'Damaged';
export type DisplayCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'INR'
  | 'SGD'
  | 'HKD'
  | 'NZD'
  | 'BRL'
  | 'CNY'
  | 'KRW'
  | 'MXN'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'PLN'
  | 'TRY'
  | (string & {});

export type GradingCompany =
  | 'PSA'
  | 'BGS'
  | 'CGC'
  | 'TAG'
  | 'MGC'
  | 'ACE'
  | 'SGC'
  | 'ARS'
  | 'PGG'
  | 'Other';

export interface GradingInfo {
  company: GradingCompany;
  grade: string;
  certNumber: string;
  subgrades?: {
    centering?: number;
    corners?: number;
    edges?: number;
    surface?: number;
  };
}

export interface MarketListing {
  id: string;
  platform: 'TCGPlayer' | 'eBay' | 'CardMarket' | 'PWCC' | 'Goldin';
  title: string;
  price: number;
  currency: DisplayCurrency;
  conditionOrGrade: string;
  date: string;
  url: string;
  sellerRating?: string;
}

export interface SealedProduct {
  id: string;
  name: string;
  type: 'Booster Box' | 'Elite Trainer Box' | 'Booster Bundle' | 'Collection Box' | 'Tin' | 'Blister Pack' | 'Case' | 'Packs';
  language: 'English' | 'Japanese' | 'Traditional Chinese' | 'Korean' | 'German' | 'French' | string;
  set: CardSet;
  releaseDate: string;
  msrp: number;
  marketPrice: number;
  imageUrl: string;
  packCount: number;
  priceHistory?: PricePoint[];
}

export interface PortfolioSealedEntry {
  id: string;
  ownerId?: string;
  productId: string;
  product: SealedProduct;
  quantity: number;
  purchasePrice: number; // USD
  purchaseCurrency: DisplayCurrency;
  purchaseDate: string;
  condition: 'Factory Sealed' | 'Minor Tear' | 'Acrylic Cased' | 'Damaged Box';
  notes?: string;
  isSold: boolean;
  salePrice?: number;
  saleCurrency?: DisplayCurrency;
  saleDate?: string;
}

export interface PortfolioCardEntry {
  id: string;
  ownerId?: string; // Firebase Owner UID
  deckId?: string; // Associated Deck ID
  cardId: string;
  card: PokemonCard;
  condition: CardCondition;
  quantity: number;
  purchasePrice: number;
  purchaseCurrency: DisplayCurrency;
  purchaseDate: string;
  notes?: string;
  gradingInfo?: GradingInfo;
  isSold: boolean;
  salePrice?: number;
  saleCurrency?: DisplayCurrency;
  saleDate?: string;
  salePlatform?: string;
}

export interface Deck {
  id: string;
  ownerId?: string; // Firebase Owner UID
  name: string;
  description: string;
  colorHex: string;
  isPublic: boolean;
  publicShareCode?: string;
  entries: PortfolioCardEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomList {
  id: string;
  ownerId?: string; // Firebase Owner UID
  name: string;
  description: string;
  cardIds: string[];
  coverImageUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string; // auth.uid
  displayName: string;
  email: string;
  avatar: string;
  displayCurrency: DisplayCurrency;
  isSuperUser?: boolean;
  role?: string;
  isPublicProfile?: boolean;
  publicProfileShareCode?: string;
  createdAt: string;
}

export interface SharedPortfolioSnapshot {
  version: number;
  userId: string;
  updatedAt: string;
  profile: {
    displayName?: string;
    email?: string;
    tier: AccountTier;
    currency: DisplayCurrency;
    isPublicProfile?: boolean;
    publicProfileShareCode?: string;
  };
  decks: Deck[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  soldEntries: PortfolioCardEntry[];
  recentActivities: RecentActivityItem[];
}

export interface SubscriptionRecord {
  id: string; // auth.uid
  tierName: AccountTier;
  effectiveTier?: AccountTier;
  billingStatus: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  paymentType?: 'one_time' | 'recurring';
  provider?: 'paypal' | 'system';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  paypalSubscriptionId?: string;
  isSuperUser?: boolean;
  updatedAt: string;
  governorNote?: string;
}

export interface SearchFilters {
  query: string;
  types: EnergyType[];
  supertype?: string;
  category?: string;
  stage?: string;
  hpMin?: number;
  hpMax?: number;
  rarities: (CardRarity | string)[];
  setId?: string;
  series?: string;
  artist?: string;
  illustrator?: string;
  regulationMark?: string;
  variant?: string;
  legality?: 'standard' | 'expanded';
  priceMin?: number;
  priceMax?: number;
  sortBy: 'price-desc' | 'price-asc' | 'name' | 'set' | 'hp';
}

export interface RecentActivityItem {
  id: string;
  type: 'ADDED' | 'SOLD' | 'DECK_CREATED' | 'LIST_CREATED' | 'GRADED';
  title: string;
  subtitle: string;
  timestamp: string;
  amount?: number;
  currency?: DisplayCurrency;
  cardImage?: string;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  CHF: 'CHF ',
  INR: '₹',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  BRL: 'R$',
  CNY: '¥',
  KRW: '₩',
  MXN: 'MX$',
  SEK: 'kr ',
  NOK: 'kr ',
  DKK: 'kr ',
  PLN: 'zł ',
  TRY: '₺',
};

export const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
  CAD: 1.38,
  AUD: 1.52,
  CHF: 0.89,
  INR: 83.5,
  SGD: 1.35,
  HKD: 7.82,
  NZD: 1.65,
  BRL: 5.65,
  CNY: 7.25,
  KRW: 1380.0,
  MXN: 18.5,
  SEK: 10.6,
  NOK: 10.8,
  DKK: 6.85,
  PLN: 3.95,
  TRY: 33.0,
};

export type ReviewCategory = 
  | 'General & UI'
  | 'Master Set Checklist'
  | 'Deck Builder & PTCGL'
  | 'Graded Slabs & Pricing'
  | 'Sealed Vault'
  | 'Feature Request';

export interface CommunityReview {
  id: string;
  authorName: string;
  isAnonymous: boolean;
  userId?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  category: ReviewCategory | string;
  userRole?: string;
  createdAt: string;
  likesCount?: number;
  isVerified?: boolean;
}

export interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  category: 'Community' | 'Updates' | 'Video' | 'Code' | 'Photos';
  description: string;
  memberCount?: string;
  status: 'Official' | 'Active' | 'Coming Soon';
  accentColor: string;
  iconName: string;
}

