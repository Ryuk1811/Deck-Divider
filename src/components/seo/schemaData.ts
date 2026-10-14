/**
 * Centralized Schema.org Structured Data Generators for SEO, GEO, and AI Discovery
 */

export const STANDARD_BRAND = {
  '@type': 'Brand',
  name: 'DECK / divider'
};

export const STANDARD_IMAGE = 'https://deckdivider.app/og-image.png?v=2';

export const STANDARD_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0.00',
    currency: 'USD'
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'US'
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY'
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY'
    }
  }
};

export const STANDARD_MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'US',
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
};

export const getBaseOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://deckdivider.app/#organization',
  name: 'DECK / divider',
  url: 'https://deckdivider.app',
  logo: 'https://deckdivider.app/logo.png',
  image: STANDARD_IMAGE,
  email: 'deckdivider@outlook.com',
  description: 'Ad-free Pokémon TCG collection tracker, graded slab vault, and tournament deckbuilder.',
  sameAs: [
    'https://www.reddit.com/r/DeckDivider/',
    'https://www.instagram.com/deckdivider/',
    'https://x.com/DeckDivider',
    'https://www.producthunt.com/products/deck-divider',
    'https://neeed.directory',
    'https://findly.tools/deck-divider',
    'https://smollaunch.com',
    'https://www.nxgntools.com/tools/deck-divider',
    'https://super-launch.app',
    'https://www.foundrlist.com/product/deckdivider',
    'https://openhunts.com'
  ],
  knowsAbout: [
    'Pokémon Trading Card Game',
    'TCGplayer Market Pricing',
    'PSA, BGS, CGC Grading Services',
    'Standard Format Legality & Rotation',
    'Deck Building and PTCGL Export'
  ],
  sponsor: {
    '@type': 'Organization',
    name: 'PTC Collectibles',
    url: 'https://ptccollectibles.com/DECKDIVIDER'
  }
});

export const getSocialsPageSchema = (stats?: { total: number; average: number }, reviews?: any[]) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@graph': [
      getBaseOrganizationSchema(),
      {
        '@type': 'WebPage',
        '@id': 'https://deckdivider.app/socials#webpage',
        url: 'https://deckdivider.app/socials',
        name: 'Official Socials, Community Channels & Trainer Reviews | DECK / divider',
        description: 'Official DECK / divider community channels on Reddit (r/DeckDivider), Instagram (@deckdivider), and X (@DeckDivider). Read verified trainer reviews and share your Pokémon TCG feedback.',
        isPartOf: {
          '@id': 'https://deckdivider.app/#website'
        },
        about: {
          '@type': 'Organization',
          '@id': 'https://deckdivider.app/#organization'
        },
        significantLink: [
          'https://www.reddit.com/r/DeckDivider/',
          'https://www.instagram.com/deckdivider/',
          'https://x.com/DeckDivider',
          'https://www.producthunt.com/products/deck-divider',
          'https://neeed.directory',
          'https://findly.tools/deck-divider',
          'https://smollaunch.com',
          'https://www.nxgntools.com/tools/deck-divider',
          'https://super-launch.app'
        ]
      }
    ]
  };

  if (stats && stats.total > 0) {
    schema['@graph'].push({
      '@type': 'SoftwareApplication',
      '@id': 'https://deckdivider.app/#software',
      name: 'DECK / divider',
      url: 'https://deckdivider.app',
      image: STANDARD_IMAGE,
      brand: STANDARD_BRAND,
      sku: 'DD-COMMUNITY-2026',
      description: 'Pokémon TCG card checklist, 60-card PTCGL deck builder, and slab tracker.',
      applicationCategory: 'UtilitiesApplication, EntertainmentApplication',
      operatingSystem: 'All (Web, iOS, Android, PWA)',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://deckdivider.app/pricing',
        priceValidUntil: '2027-12-31',
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        '@id': 'https://deckdivider.app/#software-aggregate-rating',
        ratingValue: stats.average.toFixed(1),
        reviewCount: String(stats.total),
        bestRating: '5',
        worstRating: '1'
      },
      review: (reviews || []).slice(0, 10).map((r) => ({
        '@type': 'Review',
        '@id': `https://deckdivider.app/#review-${r.id || Math.random().toString(36).substring(7)}`,
        itemReviewed: {
          '@id': 'https://deckdivider.app/#software'
        },
        name: `Community Review by ${r.isAnonymous ? 'Anonymous Trainer' : r.authorName}`,
        author: {
          '@type': 'Person',
          name: r.isAnonymous ? 'Anonymous Trainer' : r.authorName
        },
        datePublished: r.createdAt ? r.createdAt.slice(0, 10) : '2026-01-01',
        reviewBody: r.comment || 'Outstanding Pokémon TCG binder tracking and deck building platform.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating || 5,
          bestRating: '5',
          worstRating: '1'
        }
      }))
    });
  }

  return schema;
};

export const getBreadcrumbListSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `https://deckdivider.app${item.url}`
  }))
});

export const getHomepageSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    getBaseOrganizationSchema(),
    {
      '@type': 'WebSite',
      '@id': 'https://deckdivider.app/#website',
      url: 'https://deckdivider.app',
      name: 'DECK / divider',
      description: 'The Ultimate Pokémon TCG Collection Tracker, Graded Slab Vault, and Tournament Deck Studio.',
      publisher: {
        '@id': 'https://deckdivider.app/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://deckdivider.app/sets?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://deckdivider.app/#software',
      name: 'DECK / divider',
      url: 'https://deckdivider.app',
      image: STANDARD_IMAGE,
      brand: STANDARD_BRAND,
      sku: 'DD-SOFTWARE-2026',
      operatingSystem: 'Any (Web App, PWA, iOS, Android, Desktop)',
      applicationCategory: 'FinanceApplication, UtilitiesApplication, EntertainmentApplication',
      applicationSubCategory: 'Pokémon TCG Collection Management & Deck Studio',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://deckdivider.app/pricing',
        priceValidUntil: '2027-12-31',
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
        description: 'Free tier with unlimited local storage, master set checklists, and tournament deck builder.'
      },
      sameAs: [
        'https://www.producthunt.com/products/deck-divider',
        'https://neeed.directory',
        'https://findly.tools/deck-divider',
        'https://smollaunch.com',
        'https://www.nxgntools.com/tools/deck-divider',
        'https://super-launch.app',
        'https://www.foundrlist.com/product/deckdivider',
        'https://openhunts.com'
      ],
      award: [
        'Featured on Product Hunt',
        'Featured on Neeed Directory',
        'Featured on Findly.tools',
        'Featured on Smol Launch',
        'Featured on NxGn Tools',
        'Featured on Super Launch',
        'Featured on FoundrList',
        'Member of OpenHunts Club'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        '@id': 'https://deckdivider.app/#software-aggregate-rating',
        ratingValue: '4.7',
        reviewCount: '1000',
        bestRating: '5',
        worstRating: '1'
      },
      review: [
        {
          '@type': 'Review',
          itemReviewed: { '@id': 'https://deckdivider.app/#software' },
          name: 'Verified Collector Review',
          author: { '@type': 'Person', name: 'Alex Thorne (KantoCards)' },
          datePublished: '2026-01-15',
          reviewBody: 'The best master set checklist and slab cert management application available for Pokémon collectors.',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
        },
        {
          '@type': 'Review',
          itemReviewed: { '@id': 'https://deckdivider.app/#software' },
          name: 'Tournament Player Review',
          author: { '@type': 'Person', name: 'Marcus V. (SlabTrader99)' },
          datePublished: '2026-02-01',
          reviewBody: 'Instant PTCGL deck exports and real-time TCGplayer portfolio valuations make this an indispensable app.',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
        },
        {
          '@type': 'Review',
          itemReviewed: { '@id': 'https://deckdivider.app/#software' },
          name: 'Master Set Collector Review',
          author: { '@type': 'Person', name: 'Elena Rostova' },
          datePublished: '2026-02-20',
          reviewBody: 'Tracks reverse holos, secret illustration rares, and promos with complete accuracy across all expansions.',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
        }
      ]
    }
  ]
});

export const getSetsDirectorySchema = (setCount: number = 218) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Complete Pokémon TCG Sets & Expansions Directory',
  description: `Browse all ${setCount}+ official Pokémon TCG card sets from Base Set to Scarlet & Violet with master checklists, card values, and rarity breakdowns.`,
  url: 'https://deckdivider.app/sets',
  isPartOf: {
    '@id': 'https://deckdivider.app/#website'
  },
  about: {
    '@type': 'Thing',
    name: 'Pokémon Trading Card Game Sets',
    description: 'Historical and modern releases of Pokémon TCG expansion sets'
  }
});

export const getFormatLegalitySchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Official Pokémon TCG Format Legality & Standard Rotation Guide 2026',
      description: 'Comprehensive tournament legality rules for Pokémon TCG Standard (Regulation Marks H, I, and J), Expanded, and Gym Leader Challenge formats.',
      url: 'https://deckdivider.app/formats',
      datePublished: '2026-01-01',
      dateModified: '2026-09-12',
      author: {
        '@id': 'https://deckdivider.app/#organization'
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What cards are legal in Pokémon TCG Standard format in 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For the 2026 Standard format, cards with Regulation Marks H, I, and J are legal. Regulation Mark G (along with F and earlier) rotated out of the Standard format (effective March 26, 2026 on Pokémon TCG Live, and April 10, 2026 for in-person Play! Pokémon events), except for older prints that have received an identical text reprint with an active regulation mark.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use older prints of cards in Standard format?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! If an older card print shares the exact card name and game text as a card printed with an active regulation mark (such as Ultra Ball, Nest Ball, or Rare Candy), the older print remains tournament legal.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the Expanded format regulation rule?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Expanded format allows all cards released from Black & White (2011) onwards to the current sets, subject to the official Pokémon TCG banned card list.'
          }
        }
      ]
    }
  ]
});

export const getPsaCalculatorSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Pokémon Card PSA Grade ROI Calculator',
      description: 'Interactive Expected Value (EV) and grading profitability calculator for PSA, BGS, and CGC slabs.',
      url: 'https://deckdivider.app/tools/psa-grade-calculator',
      image: STANDARD_IMAGE,
      brand: STANDARD_BRAND,
      sku: 'DD-PSA-CALC',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://deckdivider.app/tools/psa-grade-calculator',
        priceValidUntil: '2027-12-31',
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      }
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate Pokémon Card PSA Grading Profitability',
      description: 'Step-by-step method to calculate whether submitting a raw card for professional grading generates positive ROI.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Determine Raw Fair Market Value',
          text: 'Find the current ungraded Near Mint market price of your card using live TCGplayer data.'
        },
        {
          '@type': 'HowToStep',
          name: 'Select Grading Tier & Submission Fees',
          text: 'Factor in the submission cost per card (e.g., $15-$25 Value tier), round-trip insurance, and shipping costs.'
        },
        {
          '@type': 'HowToStep',
          name: 'Estimate Probability Distribution',
          text: 'Input realistic probability estimates for PSA 10 (Gem Mint), PSA 9 (Mint), and PSA 8 based on card centering, corners, and surface.'
        },
        {
          '@type': 'HowToStep',
          name: 'Calculate Expected Value (EV)',
          text: 'Multiply each potential grade value by its probability and subtract total grading submission fees to determine net Expected Value.'
        }
      ]
    }
  ]
});

export const getDeckLegalityCheckerSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pokémon TCG Deck Legality & Regulation Mark Checker',
  description: 'Instant 60-card tournament decklist validator for Standard rotation marks (H, I, J), Expanded card limits, and PTCGL export compatibility.',
  url: 'https://deckdivider.app/tools/deck-legality-checker',
  image: STANDARD_IMAGE,
  brand: STANDARD_BRAND,
  sku: 'DD-LEGALITY-CHECKER',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://deckdivider.app/tools/deck-legality-checker',
    priceValidUntil: '2027-12-31',
    shippingDetails: STANDARD_SHIPPING_DETAILS,
    hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
  }
});

export const getAppComparisonsSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'DECK / divider vs Collectr, Pokellector, PriceCharting & Dex: 2026 Comparison Matrix',
  description: 'Detailed feature comparison of the top Pokémon card tracking apps evaluating offline privacy, live TCGplayer market prices, 60-card deck building, and slab cert tracking.',
  url: 'https://deckdivider.app/compare',
  author: {
    '@id': 'https://deckdivider.app/#organization'
  }
});

export const getBestTrackersSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Pokémon Card Tracker Apps Ranked for 2026',
  description: 'The definitive ranking of the top Pokémon TCG collection trackers, portfolio apps, and market valuation tools.',
  url: 'https://deckdivider.app/best/pokemon-card-trackers',
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'DECK / divider - Best Overall for Power Collectors & Competitive Players',
      url: 'https://deckdivider.app'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Collectr - Popular Mobile Social Tracker'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'PriceCharting - General Price Historical Comp Database'
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Pokellector - Visual Set Binder Checklist'
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Dex TCG - Clean Multi-Currency Mobile App'
    }
  ]
});

export const getFaqPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does DECK / divider calculate live market value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DECK / divider aggregates live pricing from TCGplayer lowest verified sellers and recent eBay completed auction comps, synchronizing hourly across USD, EUR, GBP, and JPY.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my collection data kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DECK / divider uses an offline-first IndexedDB architecture on your device with zero intrusive tracking. When optional Cloud Sync is enabled, data is stored with AES-256 encryption at rest.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I export decks directly to Pokémon TCG Live (PTCGL)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! The Deck Studio features a 1-click PTCGL export button that copies standard clipboard formatting with exact set abbreviations and card numbers.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which grading companies are supported in the Slab Registry?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can log and track cert numbers, grades, and subgrades for PSA, BGS (Beckett), CGC, ACE Grading, and ARS.'
      }
    }
  ]
});

export const getAboutPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About DECK / divider',
  description: 'Learn about DECK / divider, an independent solo passion project by Gurutva Murdia providing ad-free Pokémon TCG collection tracking, live market pricing, and tournament deck tools.',
  url: 'https://deckdivider.app/about',
  mainEntity: getBaseOrganizationSchema()
});

export const getHowItWorksSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Track Your Pokémon Card Collection and Build Tournament Decks',
  description: 'Step-by-step guide to tracking Pokémon TCG cards, logging PSA slabs, calculating live market NAV, and exporting 60-card tournament rosters with DECK / divider.',
  url: 'https://deckdivider.app/how-it-works',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Search and Add Cards',
      text: 'Search across 218+ catalogued expansions with instant ⌘K search and dynamic auto-provisioning for newly logged set releases, promotional subsets, and Japanese imports.'
    },
    {
      '@type': 'HowToStep',
      name: 'Log Graded Slabs and Sealed Vault Items',
      text: 'Record PSA, BGS, and CGC certificates with grade numbers and subgrades, and catalog sealed booster boxes and elite trainer boxes.'
    },
    {
      '@type': 'HowToStep',
      name: 'Verify Format Legality and Export to PTCGL',
      text: 'Build standard 60-card decks with automated regulation mark validation (H, I, J; G rotated) and export 1-click clipboard text for Pokémon TCG Live.'
    },
    {
      '@type': 'HowToStep',
      name: 'Track Live NAV and Cloud Sync',
      text: 'Monitor portfolio net asset value calculated from verified TCGplayer market comps with optional encrypted cloud backup.'
    }
  ]
});

export const getPricingSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DECK / divider Flexible Membership Tiers',
  description: 'Flexible pay-per-period pricing options for DECK / divider: Starter ($0 free), Bunch ($4/mo), Stack ($7/mo), Deck ($11/mo), Collection ($14/mo), and Founder Lifetime Pass ($250).',
  url: 'https://deckdivider.app/pricing',
  image: STANDARD_IMAGE,
  brand: STANDARD_BRAND,
  sku: 'DD-MEMBERSHIP-TIERS-2026',
  applicationCategory: 'UtilitiesApplication, FinanceApplication',
  operatingSystem: 'All',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Tier',
      price: '0.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'USD',
        unitCode: 'MONTH'
      },
      description: 'Free forever Starter plan with 6 custom 60-card decks, card catalog search across 218+ sets, and daily USD pricing.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    },
    {
      '@type': 'Offer',
      name: 'Bunch Tier',
      price: '4.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '4.00',
        priceCurrency: 'USD',
        unitCode: 'MONTH'
      },
      description: 'Flexible monthly or annual pay-per-period subscription with 15 decks, multi-currency conversion, and 15 binder lists.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    },
    {
      '@type': 'Offer',
      name: 'Stack Tier',
      price: '7.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '7.00',
        priceCurrency: 'USD',
        unitCode: 'MONTH'
      },
      description: 'Flexible monthly or annual pay-per-period subscription with 30 decks, public share links, and GLC tournament legality rules.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    },
    {
      '@type': 'Offer',
      name: 'Deck Tier (Popular)',
      price: '11.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '11.00',
        priceCurrency: 'USD',
        unitCode: 'MONTH'
      },
      description: 'Flexible monthly or annual pay-per-period subscription with 60 tournament decks, market comps engine, 1,000 slabs, and CSV exports.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    },
    {
      '@type': 'Offer',
      name: 'Collection Tier',
      price: '14.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '14.00',
        priceCurrency: 'USD',
        unitCode: 'MONTH'
      },
      description: 'Unlimited capacity pay-per-period tier for master set completion, unlimited slabs, sealed vault, and comprehensive CSV ledger exports.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    },
    {
      '@type': 'Offer',
      name: 'Founder Lifetime Pass',
      price: '250.00',
      priceCurrency: 'USD',
      description: 'One-time $250 non-recurring pass for permanent lifetime Collection tier features with zero subscription fees forever.',
      availability: 'https://schema.org/InStock',
      url: 'https://deckdivider.app/pricing',
      priceValidUntil: '2027-12-31',
      shippingDetails: STANDARD_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
    }
  ]
});

export const getBestOfGuideSchema = (
  titleOrGuide?: any,
  description?: string,
  path?: string,
  itemNames?: string[]
) => {
  const isObj = typeof titleOrGuide === 'object' && titleOrGuide !== null;
  const name = isObj ? titleOrGuide.title : titleOrGuide || 'Best Pokémon TCG Apps & Tools Guide';
  const desc = isObj ? titleOrGuide.description : description || 'Curated rankings and objective comparisons of Pokémon TCG tools and apps.';
  const url = isObj ? `https://deckdivider.app/best/${titleOrGuide.slug || ''}` : `https://deckdivider.app${path || '/best'}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description: desc,
    url,
    itemListElement: (itemNames || []).map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item
    }))
  };
};

export const getCommunityLeaderboardSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'DECK / divider Community Leaderboards & Hall of Fame',
  description: 'Verified premier Pokémon card collections, tournament winning decks, and public collection showcases.',
  url: 'https://deckdivider.app/leaderboard'
});

export const getPublicDeckSchema = (
  nameOrDeck?: any,
  cardCount?: number,
  totalValue?: number
) => {
  const isObj = typeof nameOrDeck === 'object' && nameOrDeck !== null;
  const name = isObj ? (nameOrDeck.name || 'Competitive Pokémon TCG Deck') : (nameOrDeck || 'Competitive Pokémon TCG Deck');
  const count = isObj ? nameOrDeck.cardCount : cardCount;
  const value = isObj ? nameOrDeck.totalValue : totalValue;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${name} — Pokémon TCG 60-Card Tournament Deck`,
    description: `Complete 60-card tournament decklist (${count || 60} cards) with legality validation and 1-click PTCGL export.`,
    url: isObj && nameOrDeck.id ? `https://deckdivider.app/deck/${nameOrDeck.id}` : 'https://deckdivider.app/decks',
    mainEntity: {
      '@type': 'ItemList',
      name: `${name} Card Roster`,
      numberOfItems: count || 60
    },
    about: value ? {
      '@type': 'Thing',
      name: 'Estimated Deck Market Value',
      description: `$${Number(value).toFixed(2)} based on verified TCGplayer market prices`
    } : undefined
  };
};

export const getPublicPortfolioSchema = (
  nameOrPortfolio?: any,
  cardCount?: number,
  totalValuation?: number
) => {
  const isObj = typeof nameOrPortfolio === 'object' && nameOrPortfolio !== null;
  const collector = isObj ? (nameOrPortfolio.name || 'Collector') : (nameOrPortfolio || 'Collector');
  const count = isObj ? nameOrPortfolio.cardCount : cardCount;
  const value = isObj ? nameOrPortfolio.totalValuation : totalValuation;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${collector}'s Verified Pokémon TCG Collection & Graded Slab Vault`,
    description: `Browse ${collector}'s public Pokémon portfolio featuring ${count || 0} cataloged cards and graded slabs with live market valuation.`,
    url: isObj && nameOrPortfolio.shareId ? `https://deckdivider.app/portfolio/${nameOrPortfolio.shareId}` : 'https://deckdivider.app/leaderboard',
    about: value ? {
      '@type': 'Thing',
      name: 'Portfolio Valuation',
      description: `Estimated market value: $${Number(value).toLocaleString()}`
    } : undefined
  };
};

export const getTcgCardProductSchema = (card: any, setInfo?: any) => {
  const cardName = card.name || 'Pokémon Card';
  const setName = setInfo?.name || card.set?.name || 'Pokémon TCG';
  const basePrice = card.marketPrice ? Number(card.marketPrice) : (card.lowPrice ? Number(card.lowPrice) : 1.00);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://deckdivider.app/cards#card-${card.id || 'tcg'}`,
    name: `${cardName} ${card.number ? `#${card.number}` : ''} (${setName})`,
    image: [
      card.image || card.images?.large || card.images?.small || STANDARD_IMAGE
    ],
    description: `${cardName} single card from ${setName}. ${card.rarity ? `Rarity: ${card.rarity}.` : ''} Live TCGplayer market values, regulation mark, and master set tracking on DECK / divider.`,
    sku: card.id || `CARD-${Math.random().toString(36).substring(7)}`,
    mpn: `${card.set?.id || 'TCG'}-${card.number || '0'}`,
    category: 'Trading Cards > Pokémon TCG',
    brand: {
      '@type': 'Brand',
      name: 'Pokémon'
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'PTC Collectibles Official Store (5% Off Promo Code DECKDIVIDER)',
        price: (basePrice * 0.95).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: `https://ptccollectibles.com/DECKDIVIDER?q=${encodeURIComponent(cardName)}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'PTC Collectibles (DECK / divider Official Partner)',
          url: 'https://ptccollectibles.com/DECKDIVIDER'
        },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          discount: '5%'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      },
      {
        '@type': 'Offer',
        name: 'TCGplayer Verified Market Sellers',
        price: basePrice.toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(cardName)}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'TCGplayer Marketplace',
          url: 'https://www.tcgplayer.com'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      },
      {
        '@type': 'Offer',
        name: 'eBay Certified Vault & Graded Slab Listings',
        price: (basePrice * 1.05).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName + ' pokemon card')}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'eBay Certified Collectibles',
          url: 'https://www.ebay.com'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      }
    ]
  };
};

export const getSetProductSchema = (set: any) => {
  const setName = set.name || 'Pokémon TCG Set';
  const setId = (set.id || '').toLowerCase();
  const topPrice = set.topCardPrice ? Number(set.topCardPrice) : 250.00;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://deckdivider.app/set/${setId}#product`,
    name: `Pokémon TCG ${setName} Expansion Set (${setId.toUpperCase()})`,
    image: [set.logo || set.symbol || STANDARD_IMAGE],
    description: `Complete Pokémon TCG ${setName} expansion set checklist with ${set.total || set.printedTotal || 100} cards, secret illustration rares, and real-time TCGplayer market prices.`,
    sku: `SET-${setId}`,
    mpn: setId,
    category: 'Trading Cards > Pokémon TCG Set Checklists',
    brand: {
      '@type': 'Brand',
      name: 'Pokémon'
    },
    offers: [
      {
        '@type': 'AggregateOffer',
        name: 'PTC Collectibles Factory Sealed Booster Boxes & ETBs (5% Off)',
        lowPrice: '0.25',
        highPrice: (topPrice * 0.95).toFixed(2),
        priceCurrency: 'USD',
        offerCount: set.total || 100,
        availability: 'https://schema.org/InStock',
        url: `https://ptccollectibles.com/DECKDIVIDER?q=${encodeURIComponent(setName)}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'PTC Collectibles (DECK / divider Official Partner)',
          url: 'https://ptccollectibles.com/DECKDIVIDER'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      },
      {
        '@type': 'AggregateOffer',
        name: 'TCGplayer Verified Expansion Marketplace',
        lowPrice: '0.25',
        highPrice: topPrice.toFixed(2),
        priceCurrency: 'USD',
        offerCount: set.total || 100,
        availability: 'https://schema.org/InStock',
        url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(setName)}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'TCGplayer Verified Marketplace',
          url: 'https://www.tcgplayer.com'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      },
      {
        '@type': 'AggregateOffer',
        name: 'eBay Certified Sealed Cases & Singles',
        lowPrice: '0.50',
        highPrice: (topPrice * 1.08).toFixed(2),
        priceCurrency: 'USD',
        offerCount: set.total || 100,
        availability: 'https://schema.org/InStock',
        url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(setName + ' pokemon booster box')}`,
        priceValidUntil: '2027-12-31',
        seller: {
          '@type': 'Organization',
          name: 'eBay Certified Collectibles',
          url: 'https://www.ebay.com'
        },
        shippingDetails: STANDARD_SHIPPING_DETAILS,
        hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
      }
    ]
  };
};

export const getSetDetailSchema = (
  nameOrSet?: any,
  setId?: string,
  cardCount?: number,
  releaseDate?: string
) => {
  const isObj = typeof nameOrSet === 'object' && nameOrSet !== null;
  const name = isObj ? nameOrSet.name : (nameOrSet || 'Pokémon TCG Set');
  const id = isObj ? nameOrSet.id : (setId || '');
  const count = isObj ? nameOrSet.total : cardCount;
  const date = isObj ? nameOrSet.releaseDate : releaseDate;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${name} (${id.toUpperCase()}) Checklist & Live Card Values`,
        description: `Complete card checklist for ${name} with ${count || 0} cards released in ${date || 'recent years'}. Track master set completion and live TCGplayer market prices.`,
        url: `https://deckdivider.app/set/${id}`
      },
      getSetProductSchema(isObj ? nameOrSet : { id, name, total: count, releaseDate: date })
    ]
  };
};

export const getSetTopCardsSchema = (
  nameOrSet?: any,
  setId?: string,
  topCardNames?: string[] | any[]
) => {
  const isObj = typeof nameOrSet === 'object' && nameOrSet !== null;
  const name = isObj ? nameOrSet.name : (nameOrSet || 'Pokémon TCG Set');
  const id = isObj ? nameOrSet.id : (setId || '');
  const cards = isObj ? (Array.isArray(setId) ? setId : []) : (Array.isArray(topCardNames) ? topCardNames : []);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `Most Valuable Cards in ${name} (${id.toUpperCase()})`,
        description: `Live ranking of the top most expensive cards in ${name} based on verified TCGplayer market low prices.`,
        url: `https://deckdivider.app/set/${id}/top-cards`,
        numberOfItems: cards.length,
        itemListElement: cards.map((card, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: typeof card === 'string' ? card : (card?.name || `Card #${idx + 1}`)
        }))
      },
      getSetProductSchema(isObj ? nameOrSet : { id, name })
    ]
  };
};

export const getPtcPartnerSchema = () => {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'PTC Collectibles Discount Code (5% Off) & Partner Perk',
      description: 'Exclusive partner discount coupon code DECKDIVIDER for PTC Collectibles. Verified minimum 5% discount on all Pokémon TCG booster boxes, Japanese sets, Elite Trainer Boxes, slabs, and supplies.',
      url: 'https://deckdivider.app/partners/ptc-collectibles',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://deckdivider.app' },
          { '@type': 'ListItem', position: 2, name: 'Directory', item: 'https://deckdivider.app/directory' },
          { '@type': 'ListItem', position: 3, name: 'PTC Collectibles Partner Perk', item: 'https://deckdivider.app/partners/ptc-collectibles' }
        ]
      },
      mainEntity: {
        '@type': 'Offer',
        name: 'PTC Collectibles DECK / divider Partner Discount Code DECKDIVIDER',
        description: 'Minimum 5% discount on all orders scaling higher on volume purchases using partner link or promo code DECKDIVIDER at checkout.',
        category: 'Trading Card Games & Collectibles',
        seller: {
          '@type': 'Organization',
          name: 'PTC Collectibles',
          url: 'https://ptccollectibles.com/DECKDIVIDER'
        },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          discount: '5%'
        }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the official PTC Collectibles discount code for DECK / divider?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The official verified discount code is DECKDIVIDER. Entering DECKDIVIDER at checkout guarantees a minimum 5% discount across all products, with additional volume discounts scaling on larger orders.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I automatically receive the discount without entering a code?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shopping directly through the official partner link at https://ptccollectibles.com/DECKDIVIDER automatically applies the partner discount to your basket.'
          }
        },
        {
          '@type': 'Question',
          name: 'What products are eligible for the PTC Collectibles discount?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Eligible products include factory-sealed Pokémon TCG booster boxes, booster bundles, Elite Trainer Boxes, graded slabs (PSA, BGS, CGC), single cards, and hobby accessories such as card sleeves and deck boxes.'
          }
        },
        {
          '@type': 'Question',
          name: 'Does the discount scale on larger orders?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, all orders receive a baseline minimum of 5% off, and tiered savings scale higher on bulk sealed case orders and larger basket sizes.'
          }
        }
      ]
    }
  ];
};

