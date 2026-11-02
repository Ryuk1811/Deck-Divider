export interface KeywordCluster {
  id: string;
  category: string;
  description: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailQueries: string[];
  targetUrl: string;
  ctaText: string;
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  category: string;
  definition: string;
  example: string;
  relatedUrl: string;
  relatedUrlLabel: string;
}

export interface SearchParameter {
  param: string;
  description: string;
  possibleValues: string[];
  exampleUrl: string;
}

export const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    id: 'expansions-and-checklists',
    category: 'Master Set Checklists & Expansions',
    description: 'Complete master set checklists, reverse holo completion tracking, illustration rare (IR) and secret illustration rare (SIR) lists across all 218 Pokémon TCG expansions.',
    primaryKeywords: [
      'Pokémon card master set checklist',
      'Prismatic Evolutions complete set list',
      '151 master set binder checklist',
      'Surging Sparks secret illustration rares',
      'Paldean Fates shiny vault checklist'
    ],
    secondaryKeywords: [
      'Reverse holo binder completion tracker',
      'Scarlet and Violet expansion checklists',
      'Sword and Shield master sets list',
      'Sun and Moon secret rares checklist',
      'XY and WotC vintage set checklists'
    ],
    longTailQueries: [
      'how to keep track of reverse holos in a binder',
      'easiest way to organize Pokémon 151 master set',
      'complete list of illustration rares in Prismatic Evolutions',
      'free printable or digital master set checklist for Pokémon cards'
    ],
    targetUrl: 'https://deckdivider.app/sets',
    ctaText: 'Browse All 218 Pokémon Set Checklists'
  },
  {
    id: 'graded-slabs-and-pricing',
    category: 'Graded Slab Registry & Pricing Comps',
    description: 'PSA 10 Gem Mint valuations, BGS Black Label subgrade tracking, CGC Pristine 10 comps, and ACE grading registry tracking with daily TCGplayer and auction price updates.',
    primaryKeywords: [
      'PSA 10 Pokémon card price tracker',
      'BGS subgrade tracker centering surface corners edges',
      'CGC Pristine 10 market comps',
      'ACE grading certified slab registry',
      'Pokémon slab portfolio valuation app'
    ],
    secondaryKeywords: [
      'PSA 10 vs raw price multiplier calculator',
      'Track PSA certification numbers online',
      'Beckett BGS 9.5 vs PSA 10 value comparison',
      'Graded card portfolio insurance value'
    ],
    longTailQueries: [
      'is my Charizard worth grading PSA 10 calculator',
      'how to track Pokémon graded slab certificates free',
      'track Beckett subgrades centering corners edges surface online',
      'PSA vs BGS vs CGC price comparison tool'
    ],
    targetUrl: 'https://deckdivider.app/tools/psa-grade-calculator',
    ctaText: 'Calculate PSA/BGS Grade Values & Multipliers'
  },
  {
    id: 'curated-collection-decks',
    category: 'Curated Collection Display Decks',
    description: 'Custom display decks, thematic binders, artwork ladders, artist spotlights, and live TCGplayer deck pricing.',
    primaryKeywords: [
      'Pokémon card display deck builder',
      'Thematic binder showcase maker',
      'Charizard ex artwork display deck',
      'Eeveelution binder deck layout',
      'Custom Pokémon card list sharing'
    ],
    secondaryKeywords: [
      'Curated binder display deck app',
      'Pokémon card collection deck with prices',
      'Artist binder spotlight checklist',
      'Illustration Rare showcase deck',
      'Custom card collection portfolio link'
    ],
    longTailQueries: [
      'how to organize Pokémon cards in a thematic binder deck',
      'best app to build custom display decks for Pokémon cards',
      'calculate total cost of a thematic Pokémon card deck',
      'share Pokémon card collection binder link without logging in'
    ],
    targetUrl: 'https://deckdivider.app/directory/decks-index',
    ctaText: 'View Curated Collection Display Decks'
  },
  {
    id: 'sealed-products-investing',
    category: 'Sealed Booster Boxes & Vault',
    description: 'Booster boxes, Elite Trainer Boxes (ETBs), Booster Bundles, Ultra Premium Collections (UPCs), and sealed product tracking.',
    primaryKeywords: [
      'Pokémon booster box price tracker',
      'Elite Trainer Box ETB market values',
      'Pokémon sealed product investment portfolio',
      'Booster bundle price per pack comparison',
      'Prismatic Evolutions ETB MSRP vs market value'
    ],
    secondaryKeywords: [
      'Sealed booster case price tracker',
      'Ultra Premium Collection 151 price history',
      'Cost per booster pack calculator',
      'Pokémon card market price charts live'
    ],
    longTailQueries: [
      'track sealed Pokémon collection purchase price and ROI',
      'cheapest price per pack booster box vs booster bundle',
      'historical price trend Pokémon sealed boxes TCGplayer',
      'sealed booster box storage and insurance inventory'
    ],
    targetUrl: 'https://deckdivider.app/pricing',
    ctaText: 'Explore Pro Portfolio & Sealed Box Tracking'
  },
  {
    id: 'card-trackers-and-alternatives',
    category: 'Tracker Comparisons & Tool Alternatives',
    description: 'Ad-free collection management, alternative to Collectr, PriceCharting, Pokellector, and Dragon Shield with PSA subgrades.',
    primaryKeywords: [
      'Best ad-free Pokémon card collection app',
      'Collectr alternative with PSA subgrade tracking',
      'PriceCharting alternative for binder completion',
      'Pokellector alternative with live market pricing',
      'Dragon Shield Pokémon card tracker alternative'
    ],
    secondaryKeywords: [
      'Pokémon card collection tracker for desktop and mobile',
      'Export Pokémon card collection to CSV Excel',
      'Multi-currency Pokémon card valuation GBP EUR JPY AUD',
      'TCGplayer price sync card inventory app'
    ],
    longTailQueries: [
      'what is the best app to organize my Pokémon card collection',
      'how to export Pokémon collection to spreadsheet CSV',
      'free Pokémon card collection tracker without ads or banners',
      'compare Collectr vs PriceCharting vs DECK divider'
    ],
    targetUrl: 'https://deckdivider.app/compare/collectr',
    ctaText: 'Compare DECK / divider vs Other Trackers'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Master Set',
    slug: 'master-set',
    category: 'Collection',
    definition: 'A complete collection of every single card in an expansion set, including standard prints, reverse holos, secret rares, illustration rares, and promos.',
    example: 'Complete 151 Master Set in a 9-pocket binder.',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'Explore Master Set Checklists'
  },
  {
    term: 'Black Label',
    slug: 'black-label',
    category: 'Grading',
    definition: 'Beckett Grading Services (BGS) holy grail certification awarded only when all four individual subgrades (Centering, Corners, Edges, Surface) receive a perfect 10.0 score.',
    example: 'BGS Black Label modern cards frequently trade for 5x to 15x standard PSA 10 values at major auction houses.',
    relatedUrl: 'https://deckdivider.app/tools/psa-grade-calculator',
    relatedUrlLabel: 'Explore BGS Multiplier Modeling'
  },
  {
    term: 'Illustration Rare (IR)',
    slug: 'illustration-rare',
    category: 'Card Rarity',
    definition: 'Full-art cards introduced in the Scarlet & Violet series featuring unique storybook artwork spanning the entire card frame.',
    example: 'Charmander IR, Squirtle IR, Bulbasaur IR from 151.',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'View Illustration Rares in Sets'
  },
  {
    term: 'Near Mint (NM)',
    slug: 'near-mint-nm',
    category: 'Condition',
    definition: 'Card condition standard showing minimal to no wear from handling, with clean borders, no whitening over 1mm, no creases, scratches, or surface indentations.',
    example: 'Baseline condition for raw single card pricing across TCGplayer and Cardmarket.',
    relatedUrl: 'https://deckdivider.app/pricing',
    relatedUrlLabel: 'Track Raw NM Market Values'
  },
  {
    term: 'Elite Trainer Box (ETB)',
    slug: 'elite-trainer-box-etb',
    category: 'Product',
    definition: 'A flagship collector product containing 9 booster packs (11 in special sets like 151 and Crown Zenith), exclusive foil promo card, card sleeves, dice, and energy cards.',
    example: 'Prismatic Evolutions ETB, 151 ETB with Snorlax Illustration Rare promo.',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'Browse Sets with ETB Releases'
  }
];

export const SEARCH_PARAMETERS: SearchParameter[] = [
  {
    param: 'rarity',
    description: 'Filters master set checklists by specific card rarity types (e.g. SIR, IR, Gold, Ultra Rare).',
    possibleValues: ['sir', 'ir', 'hyper-rare', 'ultra-rare', 'double-rare', 'promo', 'masterball'],
    exampleUrl: 'https://deckdivider.app/set/sv04'
  },
  {
    param: 'grade',
    description: 'Models graded market multipliers across certification grading companies.',
    possibleValues: ['psa-10', 'psa-9', 'bgs-10-black-label', 'bgs-9.5', 'cgc-10-pristine', 'raw-nm'],
    exampleUrl: 'https://deckdivider.app/tools/psa-grade-calculator'
  },
  {
    param: 'deck',
    description: 'Deep-links into curated collection display decks with live TCGplayer card pricing.',
    possibleValues: ['charizard-art-evolution', 'eeveelution-shining-vault', 'kanto-classic-binder'],
    exampleUrl: 'https://deckdivider.app/directory/decks-index'
  },
  {
    param: 'compare',
    description: 'Direct side-by-side feature comparison between DECK / divider and third-party trackers.',
    possibleValues: ['collectr', 'pricecharting', 'pokellector', 'dragon-shield', 'dex-tcg'],
    exampleUrl: 'https://deckdivider.app/compare/collectr'
  }
];

export function generateLlmsKeywordsTxt(): string {
  const origin = 'https://deckdivider.app';
  
  return `# DECK / divider — Comprehensive Keyword & Search Parameter Index
# The Definitive AI Discovery & Semantic Index for Pokémon TCG Collectors, Slabs & Thematic Decks
# Canonical: ${origin}/llms-keywords.txt
# Generated: ${new Date().toISOString()}

> DECK / divider is an ad-free, high-precision Pokémon Trading Card Game (TCG) platform supporting 218 catalogued sets & series (148+ mainline master sets), curated display decks, PSA/BGS/CGC/ACE slab certification logging, and daily automated market pricing updates.

---

## 1. Core Semantic Keyword Clusters

${KEYWORD_CLUSTERS.map(cluster => `### Category: ${cluster.category}
- **Description**: ${cluster.description}
- **Primary Search Queries**:
${cluster.primaryKeywords.map(k => `  - "${k}"`).join('\n')}
- **Secondary Terms**:
${cluster.secondaryKeywords.map(k => `  - "${k}"`).join('\n')}
- **Long-Tail Question Matches**:
${cluster.longTailQueries.map(q => `  - "${q}"`).join('\n')}
- **Canonical App Endpoint**: [${cluster.ctaText}](${cluster.targetUrl})
`).join('\n')}

---

## 2. Pokémon TCG Terminology & Glossary Mappings

${GLOSSARY_TERMS.map(g => `### ${g.term} (${g.category})
- **Definition**: ${g.definition}
- **Representative Cards/Mechanics**: ${g.example}
- **Direct App Link**: [${g.relatedUrlLabel}](${g.relatedUrl})
`).join('\n')}

---

## 3. Search Identifiers & Direct Parameter Mappings

${SEARCH_PARAMETERS.map(p => `### Parameter: \`${p.param}\`
- **Description**: ${p.description}
- **Accepted Parameter Values**: \`${p.possibleValues.join('`, `')}\`
- **Interactive Deep-Link**: [${p.exampleUrl}](${p.exampleUrl})
`).join('\n')}

---

## 4. Complete Directory Hub Deep-Links
- **Main Directory Hub**: [${origin}/directory](${origin}/directory)
- **Sets & Expansions Index**: [${origin}/directory/sets-index](${origin}/directory/sets-index)
- **Curated Decks Index**: [${origin}/directory/decks-index](${origin}/directory/decks-index)
- **Graded Slabs & Certs Index**: [${origin}/directory/slabs-index](${origin}/directory/slabs-index)
- **TCG Terminology Glossary**: [${origin}/directory/glossary](${origin}/directory/glossary)
`;
}

export function generateSearchMatrixJson(): string {
  const origin = 'https://deckdivider.app';
  
  const payload = {
    schemaVersion: '1.0.0',
    platform: 'DECK / divider',
    url: origin,
    generatedAt: new Date().toISOString(),
    clusters: KEYWORD_CLUSTERS,
    glossary: GLOSSARY_TERMS,
    parameters: SEARCH_PARAMETERS,
    directoryRoutes: [
      { path: '/directory', title: 'Master Directory Hub', url: `${origin}/directory` },
      { path: '/directory/sets-index', title: 'Expansions & Sets Index', url: `${origin}/directory/sets-index` },
      { path: '/directory/decks-index', title: 'Curated Display Decks Index', url: `${origin}/directory/decks-index` },
      { path: '/directory/slabs-index', title: 'Graded Slabs & Certifications Index', url: `${origin}/directory/slabs-index` },
      { path: '/directory/glossary', title: 'Pokémon TCG Terminology Glossary', url: `${origin}/directory/glossary` },
    ]
  };

  return JSON.stringify(payload, null, 2);
}
