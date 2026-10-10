/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CENTRAL_ENTITLEMENTS } from './config/entitlements';
export type AccountTier = 'Starter' | 'Bunch' | 'Stack' | 'Deck' | 'Collection';

export interface TierLimit {
  name: AccountTier;
  priceMonthly: number; // 0, 4, 7, 11, 14
  maxDecks: number; // Infinity for Collection
  maxCardsPerDeck: number; // Laddered per tier: 60, 75, 100, 150, Infinity for Collection/Lifetime
  maxLists: number; // Infinity for Collection
  maxItemsPerList: number; // Infinity for Collection
  canSharePublicLinks: boolean;
  maxGradedSlabs: number; // Max certified slabs logged
  maxSealedItems: number; // Max sealed items in vault
  hasMultiCurrency: boolean; // Multi-currency display beyond USD
  hasGlcAndRetroLegality: boolean; // GLC & Retro format legality engine
  hasCsvExport: boolean; // Full portfolio & sales CSV export
  hasCloudBackups: boolean; // Encrypted multi-device cloud snapshot restore
  hasGradedMarketComps: boolean; // Live verified PSA/BGS/CGC auction comps
  tagline: string;
  priceYearly: number;
  yearlyDiscountPercent: number;
}

export const TIER_LIMITS: Record<AccountTier, TierLimit> = Object.fromEntries(
  Object.entries(CENTRAL_ENTITLEMENTS).map(([key, t]) => [
    key,
    {
      name: t.id,
      priceMonthly: t.pricing.monthly,
      priceYearly: t.pricing.yearly,
      yearlyDiscountPercent: t.pricing.yearlyDiscountPercent,
      maxDecks: t.limits.decks,
      maxCardsPerDeck: t.limits.cardsPerDeck,
      maxLists: t.limits.wishlists,
      maxItemsPerList: t.limits.itemsPerList,
      canSharePublicLinks: t.capabilities.canSharePublicLinks,
      maxGradedSlabs: t.limits.gradedSlabs,
      maxSealedItems: t.limits.sealedItems,
      hasMultiCurrency: t.capabilities.hasMultiCurrency,
      hasGlcAndRetroLegality: t.capabilities.hasGlcAndRetroLegality,
      hasCsvExport: t.capabilities.hasCsvExport,
      hasCloudBackups: t.capabilities.hasCloudBackups,
      hasGradedMarketComps: t.capabilities.hasGradedMarketComps,
      tagline: t.tagline,
    },
  ])
) as Record<AccountTier, TierLimit>;

export function getTierLimits(tier?: string | null): TierLimit {
  if (!tier || !(tier in TIER_LIMITS)) {
    return TIER_LIMITS.Starter;
  }
  return TIER_LIMITS[tier as AccountTier];
}

export type PokemonSpeciesType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Steel'
  | 'Fairy'
  | 'Dark';

export type EnergyType =
  | PokemonSpeciesType
  | 'Lightning'
  | 'Darkness'
  | 'Metal'
  | 'Colorless';

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
  targetSize?: number; // Target ladder size: 6 (Mini Deck), 30 (Half Deck), 60 (Standard), 100 (GLC), or Infinity/undefined for custom
  deckFormat?: string; // e.g. '6-Card Mini', '30-Card Half', '60-Card Standard', '100-Card GLC', 'Custom / Unlimited'
  entries: PortfolioCardEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface DeckSizeOption {
  size: number;
  label: string;
  badge: string;
  description: string;
  requiredTier?: AccountTier; // Minimum tier required for this ladder format
}

export const DECK_SIZE_LADDER: DeckSizeOption[] = [
  { size: 6, label: '6-Card Mini Deck', badge: '6-Card Mini', description: 'Fast casual & prize rush pocket mini roster' },
  { size: 30, label: '30-Card Half Deck', badge: '30-Card Half', description: 'Learn-to-Play, theme half-deck & sealed starter' },
  { size: 60, label: '60-Card Tournament Deck', badge: '60-Card Standard', description: 'Official Standard / Expanded championship roster' },
  { size: 100, label: '100-Card GLC / Singleton', badge: '100-Card GLC', description: 'Gym Leader Challenge & singleton 100-card roster', requiredTier: 'Stack' },
  { size: Infinity, label: 'Unlimited / Custom Roster', badge: 'Unlimited ∞', description: 'Open format roster without card count restrictions (Collection Tier Only)', requiredTier: 'Collection' },
];

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
  billingStatus: 'active' | 'expiring_soon' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  paymentType?: 'one_time' | 'recurring';
  billingCycle?: 'monthly' | 'yearly' | 'lifetime';
  provider?: 'paypal' | 'system';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  paypalSubscriptionId?: string;
  orderId?: string;
  amountPaid?: number;
  isLifetime?: boolean;
  lifetimeOrderNumber?: number;
  isSuperUser?: boolean;
  updatedAt: string;
  governorNote?: string;
}

export interface LifetimeTierStatus {
  totalSlots: number;
  claimedSlots: number;
  remainingSlots: number;
  isAvailable: boolean;
  priceUsd: number;
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
  sortBy: 'price-desc' | 'price-asc' | 'name' | 'name-desc' | 'set' | 'hp' | 'number';
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

