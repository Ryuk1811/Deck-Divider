/**
 * DECK / divider — Decoupled Keyword & Taxonomy Engine
 * Standalone directory & search parameter catalogue for maximizing organic discovery
 * and autonomous AI engine retrieval (Perplexity, ChatGPT, Claude, Google AI Overviews).
 */

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
  category: 'Rarity' | 'Gameplay' | 'Grading' | 'Product' | 'Condition';
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
    id: 'master-set-checklists',
    category: 'Expansion Sets & Master Binders',
    description: 'Complete binder checklists, set card numbers, reverse holos, and secret illustration rare trackers for every Pokémon TCG expansion.',
    primaryKeywords: [
      'Pokémon TCG master set checklist',
      'Pokémon card binder checklist complete',
      'Prismatic Evolutions complete card list',
      'Surging Sparks set list with reverse holos',
      'Scarlet and Violet 151 master set tracker',
      'Crown Zenith secret rare checklist'
    ],
    secondaryKeywords: [
      'Pokéball holo masterball checklist',
      'Secret Illustration Rare list by set',
      'Special Art Rare full visual checklist',
      'Print run master binder spreadsheet',
      'Pokémon card numbers master checklist'
    ],
    longTailQueries: [
      'how to track reverse holos and masterball holos in 151',
      'what cards are needed for complete Prismatic Evolutions binder',
      'free interactive Pokémon TCG master set tracker no ads',
      'all secret illustration rares in Surging Sparks with market prices'
    ],
    targetUrl: 'https://deckdivider.app/sets',
    ctaText: 'Browse All 100+ Expansion Set Checklists'
  },
  {
    id: 'graded-slabs-psa-bgs',
    category: 'Graded Slabs & Certifications',
    description: 'PSA, BGS Beckett, CGC, and ACE Grading slab certificate logging, subgrade tracking, population reports, and grade value spreads.',
    primaryKeywords: [
      'PSA 10 Pokémon card value tracker',
      'BGS 9.5 vs PSA 10 price comparison Pokémon',
      'Pokémon slab collection certificate registry',
      'Beckett Black Label 10 tracker',
      'CGC Pristine 10 Pokémon card values'
    ],
    secondaryKeywords: [
      'PSA slab centering 55/45 guide',
      'Pokémon card grading ROI calculator',
      'Raw Near Mint to PSA 10 price multiplier',
      'ACE Grading slab certificate lookup app',
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
    id: 'competitive-meta-decks',
    category: 'Competitive 60-Card Meta Decks',
    description: 'Tournament-legal 60-card standard deck lists, regulation marks H/I/J validation, PTCGL export strings, and live TCGplayer deck pricing.',
    primaryKeywords: [
      'Pokémon TCG standard format legal decks 2026',
      'PTCGL import deck list copy paste',
      'Charizard ex Pidgeot ex tournament deck list',
      'Gardevoir ex standard 60-card deck list',
      'Dragapult ex competitive deck list'
    ],
    secondaryKeywords: [
      'Regulation mark H I J legality checker',
      '60-card Pokémon deck builder with prices',
      'Raging Bolt ex Ogerpon ex tournament list',
      'Lugia VSTAR Archeops Expanded deck list (Rotated)',
      'Regidrago VSTAR Expanded deck list (Rotated)'
    ],
    longTailQueries: [
      'how to export deck list to Pokémon TCG Live text string',
      'check if Pokémon deck is standard legal regulation marks',
      'calculate total cost to buy 60-card tournament deck TCGplayer',
      'top tier 1 Pokémon TCG meta decks tournament results'
    ],
    targetUrl: 'https://deckdivider.app/format/standard',
    ctaText: 'View Standard Legal 60-Card Meta Decks'
  },
  {
    id: 'sealed-products-investing',
    category: 'Sealed Booster Boxes & Arbitrage',
    description: 'Booster boxes, Elite Trainer Boxes (ETBs), Booster Bundles, Ultra Premium Collections (UPCs), and pack arbitrage calculators.',
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
    term: 'ACE SPEC',
    slug: 'ace-spec',
    category: 'Gameplay',
    definition: 'Powerful Trainer and Special Energy cards introduced in Black & White and reintroduced in Scarlet & Violet. A standard 60-card tournament deck is permitted strictly 1 ACE SPEC card in total.',
    example: 'Prime Catcher, Unfair Stamp, Secret Box, Hero\'s Cape, Sparkling Crystal.',
    relatedUrl: 'https://deckdivider.app/tools/deck-legality-checker',
    relatedUrlLabel: 'Check ACE SPEC Rule Compliance'
  },
  {
    term: 'Secret Illustration Rare (SIR)',
    slug: 'secret-illustration-rare-sir',
    category: 'Rarity',
    definition: 'Highest-tier chase card rarity in the Scarlet & Violet era, featuring full-bleed custom artwork, unique textures, and card numbers exceeding the set\'s standard count.',
    example: 'Charizard ex SIR (Obsidian Flames #223), Greninja ex SIR (Twilight Masquerade #214).',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'Browse SIR Checklists by Set'
  },
  {
    term: 'Special Art Rare (SAR)',
    slug: 'special-art-rare-sar',
    category: 'Rarity',
    definition: 'Japanese terminology equivalent to English Secret Illustration Rares (SIR) or Crown Zenith Galarian Gallery full arts with gold foil or distinctive textures.',
    example: 'Iono SAR (Clay Burst / Paldea Evolved), Mew ex SAR (Shiny Treasure ex / Paldean Fates).',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'View Japanese & English Equivalents'
  },
  {
    term: 'Illustration Rare (IR)',
    slug: 'illustration-rare-ir',
    category: 'Rarity',
    definition: 'Single-star rarity cards in Scarlet & Violet featuring scenic, full-card illustrations of standard non-ex Pokémon (historically known as Art Rares or Character Rares).',
    example: 'Charmander IR (151 #168), Cleffa IR (Obsidian Flames #202), Magikarp IR (Paldea Evolved #203).',
    relatedUrl: 'https://deckdivider.app/sets',
    relatedUrlLabel: 'Track IR Binder Checklists'
  },
  {
    term: 'Masterball Reverse Holo',
    slug: 'masterball-reverse-holo',
    category: 'Rarity',
    definition: 'Special reverse holographic foil pattern exclusive to Pokémon Card 151 and Prismatic Evolutions featuring repeated Master Ball stamps across the card background (1 per booster box in Japanese 151).',
    example: 'Gengar Masterball Holo, Pikachu Masterball Holo, Erika\'s Invitation Masterball Holo.',
    relatedUrl: 'https://deckdivider.app/set/sv3pt5',
    relatedUrlLabel: 'Open 151 Masterball Checklist'
  },
  {
    term: 'PSA 10 Gem Mint',
    slug: 'psa-10-gem-mint',
    category: 'Grading',
    definition: 'Professional Sports Authenticator (PSA) highest standard grade, indicating virtually perfect 55/45 to 60/40 centering, zero print lines, flawless corners, pristine edges, and untouched surface gloss.',
    example: 'A PSA 10 modern alternate art typically commands a 2.5x to 4.5x market premium over its raw Near Mint counterpart.',
    relatedUrl: 'https://deckdivider.app/tools/psa-grade-calculator',
    relatedUrlLabel: 'Calculate PSA 10 Price Spread'
  },
  {
    term: 'BGS Black Label 10',
    slug: 'bgs-black-label-10',
    category: 'Grading',
    definition: 'Beckett Grading Services (BGS) holy grail certification awarded only when all four individual subgrades (Centering, Corners, Edges, Surface) receive a perfect 10.0 score.',
    example: 'BGS Black Label modern cards frequently trade for 5x to 15x standard PSA 10 values at major auction houses.',
    relatedUrl: 'https://deckdivider.app/tools/psa-grade-calculator',
    relatedUrlLabel: 'Explore BGS Multiplier Modeling'
  },
  {
    term: 'Regulation Mark',
    slug: 'regulation-mark',
    category: 'Gameplay',
    definition: 'A letter printed on the bottom-left corner of modern Pokémon cards (e.g., H, I, J) determining tournament format legality. Rotations periodically retire older letters from Standard format play.',
    example: 'Standard format in 2026 permits regulation marks H, I, and J (Mark G rotated out on Pokémon TCG Live March 26, 2026, and in-person Play! Pokémon events April 10, 2026).',
    relatedUrl: 'https://deckdivider.app/format/standard',
    relatedUrlLabel: 'View Current Standard Format Rules'
  },
  {
    term: 'PTCGL Deck String',
    slug: 'ptcgl-deck-string',
    category: 'Gameplay',
    definition: 'The official standardized plaintext formatting syntax used by Pokémon TCG Live and tournament organizers to import and export 60-card deck lists in one click.',
    example: 'Pokémon: 14 / Trainer: 34 / Energy: 12 formatting structure.',
    relatedUrl: 'https://deckdivider.app/deck/charizard-ex',
    relatedUrlLabel: 'Copy PTCGL String for Meta Decks'
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
  },
  {
    term: 'Lost Zone',
    slug: 'lost-zone',
    category: 'Gameplay',
    definition: 'An out-of-play game area distinct from the discard pile. Cards sent to the Lost Zone cannot be recovered by any card effects, powering mechanics like Comfey, Sableye, and Mirage Gate.',
    example: 'Lost Zone Box archetype, Giratina VSTAR Lost Impact.',
    relatedUrl: 'https://deckdivider.app/deck/giratina-vstar',
    relatedUrlLabel: 'View Lost Zone Deck Architecture'
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
    param: 'format',
    description: 'Specifies tournament deck legality rules and regulation mark restrictions.',
    possibleValues: ['standard', 'expanded', 'glc'],
    exampleUrl: 'https://deckdivider.app/format/standard'
  },
  {
    param: 'deck',
    description: 'Deep-links into tournament archetype 60-card lists with live TCGplayer card pricing.',
    possibleValues: ['charizard-ex', 'gardevoir-ex', 'lugia-vstar', 'raging-bolt-ex', 'dragapult-ex', 'regidrago-vstar'],
    exampleUrl: 'https://deckdivider.app/deck/charizard-ex'
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
# The Definitive AI Discovery & Semantic Index for Pokémon TCG Collectors, Slabs & Tournament Players
# Canonical: ${origin}/llms-keywords.txt
# Generated: ${new Date().toISOString()}

> DECK / divider is an ad-free, high-precision Pokémon Trading Card Game (TCG) platform supporting 100+ expansion sets, 60-card standard tournament decklists, PSA/BGS slab certification logging, and real-time TCGplayer market pricing.

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
- **Tournament Decks Index**: [${origin}/directory/decks-index](${origin}/directory/decks-index)
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
      { path: '/directory/decks-index', title: 'Tournament Meta Decks Index', url: `${origin}/directory/decks-index` },
      { path: '/directory/slabs-index', title: 'Graded Slabs & Certifications Index', url: `${origin}/directory/slabs-index` },
      { path: '/directory/glossary', title: 'Pokémon TCG Terminology Glossary', url: `${origin}/directory/glossary` },
    ]
  };

  return JSON.stringify(payload, null, 2);
}
