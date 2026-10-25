/**
 * DECK / divider - Platform Single Source of Truth
 * Canonical definitions for platform metrics, tiers, security claims, and legal entities.
 * Imported across client views, documentation, and SSR rendering layers.
 */

export const PLATFORM_TRUTH = {
  // Brand & Identity
  brandName: 'DECK / divider — Pokémon TCG Studio',
  shortBrandName: 'DECK / divider',
  tagline: 'Pokémon TCG Collection Tracker, Graded Slab Registry & 60-Card Deckbuilder',
  founder: 'Alex Thorne',
  founderTitle: 'Founder & Lead Architect',
  founderBio: 'Competitive Pokémon TCG player and collector who built DECK / divider to replace ad-bloated spreadsheets with a fast, private operating system.',

  // Quantitative Stats (Single Source of Truth across all pages)
  totalExpansions: 218,
  totalExpansionsLabel: '218 catalogued sets & series',
  mainlineExpansions: 148,
  mainlineExpansionsLabel: '148+ Master Expansions',
  totalCardsIndexed: '18,400+',
  totalCardsLabel: '18,400+ card records in full database',
  supportedCurrenciesCount: 20,
  supportedCurrenciesLabel: '20+ Global Currencies',
  supportedCurrenciesList: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD', 'SGD', 'HKD', 'BRL', 'MXN', 'INR', 'CNY', 'KRW', 'PLN', 'TRY'],
  priceRefreshCadence: 'Daily automatic sync from verified public market sales',
  
  // Format Legality Constants
  standardRotationDate: 'April 10, 2026',
  standardSeason: '2026–2027 Season',
  standardMarks: ['H', 'I', 'J'] as const,
  standardMarksLabel: 'Regulation Marks H, I, J',
  expandedSeriesRange: 'Black & White through modern Scarlet & Violet expansions',

  // Pricing & Tier Limits (Synchronized with CENTRAL_ENTITLEMENTS & PayPal)
  tiers: {
    Starter: {
      name: 'Starter',
      priceMonthly: 0,
      priceAnnual: 0,
      maxDecks: 6,
      maxWishlists: 5,
      wishlistsLabel: '5 Custom Want Lists',
      maxBinderCards: 100,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: false,
      slabCertLogging: 25,
      slabCertLabel: 'Log up to 25 graded slabs',
      encryptionLabel: 'Local-First IndexedDB Browser Vault',
    },
    Bunch: {
      name: 'Bunch',
      priceMonthly: 4,
      priceAnnual: 42,
      maxDecks: 15,
      maxWishlists: 15,
      wishlistsLabel: '15 Custom Want Lists',
      maxBinderCards: 300,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: false,
      slabCertLogging: 100,
      slabCertLabel: 'Log up to 100 graded slabs',
      encryptionLabel: 'Encrypted Multi-Device Cloud Sync',
    },
    Stack: {
      name: 'Stack',
      priceMonthly: 7,
      priceAnnual: 72,
      maxDecks: 30,
      maxWishlists: 30,
      wishlistsLabel: '30 Custom Want Lists',
      maxBinderCards: 1000,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: true,
      slabCertLogging: 250,
      slabCertLabel: 'Log up to 250 graded slabs',
      encryptionLabel: 'Encrypted Multi-Device Cloud Sync',
    },
    Deck: {
      name: 'Deck',
      priceMonthly: 11,
      priceAnnual: 110,
      maxDecks: 50,
      maxWishlists: 100,
      wishlistsLabel: '100 Custom Want Lists',
      maxBinderCards: 5000,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: true,
      csvExportLabel: 'Full CSV & JSON Collection Export Anytime',
      slabCertLogging: 1000,
      slabCertLabel: 'Full PSA, BGS, CGC & ACE Slab Cert Logging & Subgrades',
      encryptionLabel: 'Encrypted Multi-Device Cloud Sync',
    },
    Collection: {
      name: 'Collection / Pro',
      priceMonthly: 14,
      priceAnnual: 140,
      maxDecks: Infinity,
      maxWishlists: Infinity,
      wishlistsLabel: 'Unlimited Custom Want Lists',
      maxBinderCards: Infinity,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links + Custom Slugs',
      csvExport: true,
      csvExportLabel: 'Full CSV & JSON Collection Export Anytime',
      slabCertLogging: Infinity,
      slabCertLabel: 'Unlimited Priority PSA/BGS/CGC Cert Sync & Subgrades',
      encryptionLabel: 'Client-Side AES-GCM 256-Bit Encrypted Vault + Cloud Backup',
    },
    Lifetime: {
      name: 'Master Lifetime',
      priceOneTime: 149,
      maxDecks: Infinity,
      maxWishlists: Infinity,
      wishlistsLabel: 'Unlimited Custom Want Lists',
      maxBinderCards: Infinity,
      publicShareLinks: true,
      publicShareLabel: 'Permanent VIP Showcase Links + Custom Slugs',
      csvExport: true,
      csvExportLabel: 'Full CSV & JSON Collection Export Anytime',
      slabCertLogging: Infinity,
      slabCertLabel: 'Permanent Unlimited Slab Cert Sync & All 4 Subgrades',
      encryptionLabel: 'Permanent Encrypted Vault + Priority Cloud Sync',
    },
  },

  // Security & Encryption Framework (Three-Pillar Truth)
  security: {
    inTransit: 'Enforced TLS 1.3 / HTTPS encryption across all client-server communications.',
    atRestCloud: 'Enterprise AES-256 encryption at rest managed by Google Cloud and Firebase infrastructure across all account tiers.',
    clientSideVaults: 'Optional client-side AES-GCM 256-bit passphrase encryption for Pro offline vault snapshot backups. Passphrases are processed exclusively via browser Web Crypto API and are never transmitted to, stored on, or recoverable by DECK / divider servers.',
  },

  // Legal Entity & Contact Information
  legal: {
    controllerName: 'DECK / divider Ltd.',
    registeredAddress: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom',
    privacyEmail: 'privacy@deckdivider.app',
    supportEmail: 'support@deckdivider.app',
    termsLastUpdated: 'October 12, 2026',
    privacyLastUpdated: 'October 12, 2026',
    minimumAge: 13,
    refundPolicy: '14-day full refund policy for initial subscription payments upon written email request.',
    cancellationPolicy: 'Subscriptions may be canceled at any time via Account Settings or PayPal Dashboard, maintaining access until the end of the current billing period.',
  },

  // Third-Party Processors
  processors: [
    { name: 'Google LLC / Firebase', purpose: 'Authentication, Firestore Database, and Cloud Infrastructure', jurisdiction: 'United States', privacyUrl: 'https://firebase.google.com/support/privacy' },
    { name: 'Cloudflare, Inc.', purpose: 'DNS routing, DDoS mitigation, and Edge Content Delivery', jurisdiction: 'United States', privacyUrl: 'https://www.cloudflare.com/privacypolicy/' },
    { name: 'PayPal Holdings, Inc.', purpose: 'Secure payment gateway and subscription billing execution', jurisdiction: 'United States', privacyUrl: 'https://www.paypal.com/webapps/mpp/ua/privacy-full' },
  ],
} as const;
