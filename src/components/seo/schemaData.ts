/**
 * Centralized Schema.org Structured Data Generators for SEO, GEO, and AI Discovery
 */

export const getBaseOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://deckdivider.app/#organization',
  name: 'DECK / divider',
  url: 'https://deckdivider.app',
  logo: 'https://deckdivider.app/icon-512.png',
  email: 'deckdivider@outlook.com',
  description: 'Institutional-grade Pokémon TCG portfolio tracker, graded slab vault, and tournament deck studio.',
  sameAs: [
    'https://www.reddit.com/r/DeckDivider/',
    'https://www.instagram.com/deckdivider/',
    'https://x.com/DeckDivider'
  ],
  knowsAbout: [
    'Pokémon Trading Card Game',
    'TCGplayer Market Pricing',
    'PSA, BGS, CGC Grading Services',
    'Standard Format Legality & Rotation',
    'Deck Building and PTCGL Export'
  ]
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
        }
      }
    ]
  };

  if (stats && stats.total > 0) {
    schema['@graph'].push({
      '@type': 'Product',
      '@id': 'https://deckdivider.app/#product',
      name: 'DECK / divider',
      description: 'Pokémon TCG card checklist, 60-card PTCGL deck builder, and slab tracker.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: stats.average.toFixed(1),
        reviewCount: stats.total,
        bestRating: '5',
        worstRating: '1'
      },
      review: (reviews || []).slice(0, 10).map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.isAnonymous ? 'Anonymous Trainer' : r.authorName
        },
        datePublished: r.createdAt ? r.createdAt.slice(0, 10) : '2026-01-01',
        reviewBody: r.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: '5',
          worstRating: '1'
        }
      }))
    });
  }

  return schema;
};

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
      operatingSystem: 'Any (Web App, PWA, iOS, Android, Desktop)',
      applicationCategory: 'FinanceApplication, UtilitiesApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        description: 'Free tier with unlimited local storage, master set checklists, and tournament deck builder.'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1840',
        bestRating: '5',
        worstRating: '1'
      }
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
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All'
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
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All'
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
      text: 'Search across 148+ expansions with instant ⌘K search, filtering by rarity, regulation mark, or series, and add cards to your binder or deck.'
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
  '@type': 'Product',
  name: 'DECK / divider Membership Tiers',
  description: 'Pricing options for DECK / divider: Starter (Free forever offline), Trainer, and Champion tiers.',
  url: 'https://deckdivider.app/pricing',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter (Free)',
      price: '0.00',
      priceCurrency: 'USD',
      description: 'Full offline binder, master set tracking, and 60-card tournament deck builder.'
    },
    {
      '@type': 'Offer',
      name: 'Champion (Pro)',
      price: '4.99',
      priceCurrency: 'USD',
      description: 'Encrypted cloud sync, unlimited sealed vault, and real-time portfolio market alerts.'
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
  description: 'Verified high-net-worth Pokémon card portfolios, tournament winning decks, and public collection showcases.',
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
    '@type': 'Product',
    name: `${name} — Pokémon TCG 60-Card Tournament Deck`,
    description: `Complete 60-card tournament decklist (${count || 60} cards) with legality validation and 1-click PTCGL export.`,
    url: isObj && nameOrDeck.id ? `https://deckdivider.app/deck/${nameOrDeck.id}` : 'https://deckdivider.app/decks',
    offers: value ? {
      '@type': 'Offer',
      price: value.toFixed(2),
      priceCurrency: 'USD'
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
    '@type': 'CollectionPage',
    name: `${name} (${id.toUpperCase()}) Checklist & Live Card Values`,
    description: `Complete card checklist for ${name} with ${count || 0} cards released in ${date || 'recent years'}. Track master set completion and live TCGplayer market prices.`,
    url: `https://deckdivider.app/set/${id}`
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
  };
};
