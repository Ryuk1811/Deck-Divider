/**
 * DECK / divider - Platform Single Source of Truth
 * Canonical definitions for platform metrics, tiers, security claims, and legal entities.
 * Imported across client views, documentation, and SSR rendering layers.
 */

export const PLATFORM_TRUTH = {
  // Brand & Identity
  brandName: 'DECK / divider',
  tagline: 'Pokémon TCG Collection Tracker, Graded Slab Registry & 60-Card Deckbuilder',
  founder: 'Alex Thorne',
  founderTitle: 'Founder & Lead Architect',
  founderBio: 'Competitive Pokémon TCG player and collector who built DECK / divider to replace ad-bloated spreadsheets with a fast, private operating system.',

  // Quantitative Stats (Single Source of Truth across all pages)
  totalExpansions: 148,
  totalExpansionsLabel: '148+ Master Expansions',
  supportedCurrenciesCount: 15,
  supportedCurrenciesLabel: '15+ World Currencies',
  supportedCurrenciesList: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD', 'SGD', 'HKD', 'BRL', 'MXN'],
  priceRefreshCadence: 'Daily automatic sync from verified TCGplayer market comps',
  
  // Format Legality Constants
  standardRotationDate: 'April 10, 2026',
  standardSeason: '2026–2027 Season',
  standardMarks: ['H', 'I', 'J'] as const,
  standardMarksLabel: 'Regulation Marks H, I, J',
  expandedSeriesRange: 'Black & White (Mark A) through Scarlet & Violet (Mark J)',

  // Pricing & Tier Limits
  tiers: {
    Starter: {
      name: 'Starter',
      priceMonthly: 0,
      priceAnnual: 0,
      maxWishlists: 3,
      wishlistsLabel: '3 Custom Want Lists',
      maxBinderCards: 100,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: false,
      slabCertLogging: false,
      encryptionLabel: 'Google Cloud AES-256 Encryption at Rest',
    },
    Stack: {
      name: 'Stack',
      priceMonthly: 4,
      priceAnnual: 40,
      maxWishlists: 10,
      wishlistsLabel: '10 Custom Want Lists',
      maxBinderCards: 1500,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: false,
      slabCertLogging: true,
      slabCertLabel: 'Full PSA, BGS, CGC & ACE Slab Cert Logging',
      encryptionLabel: 'Google Cloud AES-256 Encryption at Rest',
    },
    Deck: {
      name: 'Deck',
      priceMonthly: 8,
      priceAnnual: 80,
      maxWishlists: Infinity,
      wishlistsLabel: 'Unlimited Custom Want Lists',
      maxBinderCards: 5000,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links',
      csvExport: true,
      csvExportLabel: 'Full CSV & JSON Collection Export Anytime',
      slabCertLogging: true,
      slabCertLabel: 'Full PSA, BGS, CGC & ACE Slab Cert Logging & Subgrades',
      encryptionLabel: 'Google Cloud AES-256 Encryption at Rest',
    },
    Binder: {
      name: 'Binder / Pro',
      priceMonthly: 14,
      priceAnnual: 140,
      maxWishlists: Infinity,
      wishlistsLabel: 'Unlimited Custom Want Lists',
      maxBinderCards: Infinity,
      publicShareLinks: true,
      publicShareLabel: 'Public Portfolio & Deck Share Links + Custom Slugs',
      csvExport: true,
      csvExportLabel: 'Full CSV & JSON Collection Export Anytime',
      slabCertLogging: true,
      slabCertLabel: 'Priority PSA/BGS/CGC Cert Sync & Holographic Rendering',
      encryptionLabel: 'Client-Side AES-GCM 256-Bit Encrypted Vault Snapshots + Cloud AES-256',
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
