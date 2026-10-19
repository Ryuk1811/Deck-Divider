export interface ReleaseHighlight {
  category: string;
  items: string[];
}

export interface ReleaseEntry {
  iteration: number;
  version: string;
  date: string;
  badge: string;
  badgeColor: string;
  tag: 'Major' | 'Catalog' | 'Tools' | 'SEO' | 'Tournament' | 'Performance' | 'Security';
  title: string;
  summary: string;
  highlights: ReleaseHighlight[];
  relatedUrls?: { label: string; url: string }[];
}

export const ALL_RELEASES: ReleaseEntry[] = [
  {
    iteration: 59,
    version: 'v1.59',
    date: 'October 2026',
    badge: '59th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Major',
    title: 'Universal Canonical SEO Metadata, Flexible Pay-Per-Period Engine & Dynamic Expansion Provisioning',
    summary: 'The 59th platform iteration introducing a concise canonical title strategy, flexible pay-per-period subscription metadata ($4 Bunch, $7 Stack, $11 Deck, $14 Collection), live UTC data freshness timestamps, site-name alternate search schema (thedeckdivider), and dynamic auto-provisioning for newly logged expansion sets.',
    highlights: [
      {
        category: 'Canonical Titles & Semantic Linking',
        items: [
          'Re-architected homepage and category page titles to prioritize high-intent collector search terms over overloaded brand strings.',
          'Replaced generic action links with semantic contextual anchors across all public templates (Pokémon card database, 2026 Standard legality checker, Pokémon master set checklist, PSA slab tracker, sealed Pokémon product tracker).',
          'Injected Schema.org WebSite alternateName markup (thedeckdivider, The Deck Divider, DeckDivider) for precise SERP brand recognition.'
        ]
      },
      {
        category: 'Flexible Pay-Per-Period Pricing Engine & Metadata',
        items: [
          'Updated platform subscription metadata with flexible monthly and annual pay-per-period identifiers ($4 Bunch, $7 Stack, $11 Deck, $14 Collection, $250 Founder Lifetime).',
          'Synchronized AggregateOffer JSON-LD schemas, Open Graph tags, and microdata to communicate transparent pricing tiers to Google search engines.'
        ]
      },
      {
        category: 'Dynamic Expansion Ingestion & UTC Freshness Engine',
        items: [
          'Upgraded sets metadata to support dynamic auto-provisioning for newly logged expansion sets, promo subsets, and Japanese imports (218+ catalogued sets with continuous ingestion).',
          'Embedded live UTC timestamp indicators (Updated: 05 Oct 2026, 06:00 UTC) across card prices, master set checklists, and format legality checkers.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Pricing Plans', url: '/pricing' },
      { label: 'Expansions Directory', url: '/sets' },
      { label: 'Card Database', url: '/cards' }
    ]
  },
  {
    iteration: 58,
    version: 'v1.58',
    date: 'September 2026',
    badge: '58th Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'SEO',
    title: 'Universal Page Web Mesh, Autonomous Priority Indexing & Full Cross-Directory Architecture',
    summary: 'The landmark 58th platform release establishing a unified internal page web across all public directories, automated XML sub-sitemaps with priority weighting, autonomous IndexNow triggers, and zero-JS bot crawlability for Googlebot and AI crawlers.',
    highlights: [
      {
        category: 'Interlinking & Semantic Page Web',
        items: [
          'Implemented reciprocal public cross-linking mesh on all public pages, connecting card catalogues, expansion checklists, tools, and comparisons.',
          'Added contextual deep-link anchors and breadcrumbs with full Schema.org BreadcrumbList compliance.',
          'Eliminated orphan paths and circular redirects, ensuring all indexable URLs have direct reciprocal links.'
        ]
      },
      {
        category: 'Autonomous Sitemap & Bot Discovery',
        items: [
          'Upgraded sitemap generation into segmented sub-sitemaps (sitemap-cards.xml, sitemap-sets.xml, sitemap-tools.xml, sitemap-formats.xml) with priority indexing up to 1.0.',
          'Configured robots.txt with explicit crawler permissions for modern AI and search engines (Googlebot, Bingbot, Perplexity, ClaudeBot, GPTBot).',
          'Automated real-time sitemap updates on deployment and runtime edge sync with IndexNow automated pings.'
        ]
      },
      {
        category: '58-Iteration Changelog & Historical Registry',
        items: [
          'Consolidated complete platform development history across all 58 iterations in standard v1.XX notation.',
          'Integrated full-text changelog search, category filter tags, and deep-link release anchors.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Public Card Catalogue', url: '/cards' },
      { label: 'Expansions Directory', url: '/expansions' },
      { label: 'XML Sitemap', url: '/sitemap.xml' }
    ]
  },
  {
    iteration: 57,
    version: 'v1.57',
    date: 'September 2026',
    badge: '57th Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Catalog',
    title: 'Public Cards Catalogue Engine & Holographic Modal Scans',
    summary: 'Publicly discoverable card search engine featuring instant keyword filtering, energy type multi-select, rarity filtering, and non-pricing card attribute modals.',
    highlights: [
      {
        category: 'Card Search & Discovery',
        items: [
          'Deployed /cards route with high-performance client-side fuzzy search across card names, attacks, and mechanics.',
          'Added energy type pills, rarity badges, and expansion set filters for intuitive deck building exploration.',
          'Optimized WebP holographic scans with progressive loading and lazy thumbnail pre-warming.'
        ]
      },
      {
        category: 'Clean Attribute View',
        items: [
          'Created public modal view focusing strictly on gameplay attributes, HP, retreat costs, weakness, resistance, and illustrator credits without commercial distraction.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Public Cards Catalogue', url: '/cards' }
    ]
  },
  {
    iteration: 56,
    version: 'v1.56',
    date: 'September 2026',
    badge: '56th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Catalog',
    title: 'Expansions & Master Checklists Unified Hub',
    summary: 'Consolidated redundant expansions navigation into a master checklist directory supporting all Pokémon TCG eras from Scarlet & Violet to vintage Base Set.',
    highlights: [
      {
        category: 'Expansions Architecture',
        items: [
          'Unified /expansions and /expansions/sets into a single canonical directory with era-based filtering.',
          'Embedded interactive set checklists displaying total card counts, release dates, and expansion series emblems.',
          'Synchronized navigation dropdowns and footers to eliminate duplicate links.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Expansions Hub', url: '/expansions' }
    ]
  },
  {
    iteration: 55,
    version: 'v1.55',
    date: 'September 2026',
    badge: '55th Iteration',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tag: 'Tournament',
    title: 'Post-Worlds Standard Format Refinements & Legality Audit',
    summary: 'Mid-season Play! Pokémon championship synchronization: refined rotation validation rules for late-season championship archetypes under the active Marks H, I, and J Standard format (which took effect on-schedule on March 26 for PTCGL and April 10 for in-person play).',
    highlights: [
      {
        category: 'Legality Rules Engine',
        items: [
          'Strict validation of single-card ACE SPEC limits and regulation mark compliance.',
          'Visual legality badges across deck lists and single card inspectors.',
          'Integrated PTCGL export format compliant with 2026 client specifications.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Standard Format Rules', url: '/format/standard' }
    ]
  },
  {
    iteration: 54,
    version: 'v1.54',
    date: 'August 2026',
    badge: '54th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tools',
    title: 'PSA Grade Probability Calculator & Mathematical ROI Engine',
    summary: 'Algorithmic grading calculator determining the expected value (EV) and grade distribution probabilities based on raw centering and surface defects.',
    highlights: [
      {
        category: 'Grading Intelligence',
        items: [
          'Statistical grade distribution curve for PSA 10, PSA 9, and PSA 8 based on card era and population reports.',
          'Fee amortization calculator weighing grading submission tiers against resale premiums.',
          'Instant break-even analysis for grading versus selling raw.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'PSA Calculator', url: '/tools/psa-grade-calculator' }
    ]
  },
  {
    iteration: 53,
    version: 'v1.53',
    date: 'August 2026',
    badge: '53rd Iteration',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    tag: 'Tools',
    title: 'Deck Legality & PTCGL Export Engine',
    summary: 'Instant deck legality validator parsing raw PTCGL decklists into visual card collages with rotation warnings.',
    highlights: [
      {
        category: 'Tournament Deck Verification',
        items: [
          'Two-way PTCGL text import/export with instant card code translation.',
          'Real-time rule checks for 60-card exact minimum, basic energy distribution, and supporter counts.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Deck Legality Checker', url: '/tools/deck-legality-checker' }
    ]
  },
  {
    iteration: 52,
    version: 'v1.52',
    date: 'July 2026',
    badge: '52nd Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'SEO',
    title: 'Competitor Comparison & Alternative Matrix Guides',
    summary: 'High-intent comparison landing pages analyzing DECK/divider against Collectr, PriceCharting, Pokellector, and Dex.',
    highlights: [
      {
        category: 'Commercial Guides',
        items: [
          'Detailed side-by-side matrices comparing offline capabilities, pricing speed, and slab grading features.',
          'Transparent breakdown of collector workflows, data privacy, and zero-ad experiences.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Comparison Hub', url: '/compare' }
    ]
  },
  {
    iteration: 51,
    version: 'v1.51',
    date: 'July 2026',
    badge: '51st Iteration',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    tag: 'SEO',
    title: 'Best-of Buyer Guides & Software Ranking Engine',
    summary: 'Curated resource pages ranking the best Pokémon card trackers, slab scanners, and deck builders in 2026.',
    highlights: [
      {
        category: 'Editorial Guides',
        items: [
          'Published comprehensive reviews of top portfolio software for vintage and modern collectors.',
          'Added criteria scoring for mobile responsiveness, slab support, and portfolio charting.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Best-Of Guides', url: '/best' }
    ]
  },
  {
    iteration: 50,
    version: 'v1.50',
    date: 'June 2026',
    badge: '50th Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'Major',
    title: 'Gym Leader Challenge (GLC) Format & Singleton Validator',
    summary: 'Full official support for the Tricky Gym Gym Leader Challenge format with monotype, singleton, and banlist checks.',
    highlights: [
      {
        category: 'GLC Format Engine',
        items: [
          'Automatic verification of monotype energy distribution and single-copy card rules.',
          'Real-time banlist enforcement for cards like Kyogre (CEL), Lysandre\'s Trump Card, and Forest of Giant Plants.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'GLC Format Guide', url: '/format/glc' }
    ]
  },
  {
    iteration: 49,
    version: 'v1.49',
    date: 'June 2026',
    badge: '49th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Performance',
    title: 'Static Pre-Rendering (SSR) Pipeline & 200.html Fallbacks',
    summary: 'Zero-latency edge pre-rendering generating pre-baked HTML documents for over 100 sets and tournament archetypes.',
    highlights: [
      {
        category: 'Edge Optimization',
        items: [
          'Configured Node.js SSR pipeline generating crawlable HTML at build time.',
          'Eliminated client hydration lag on mobile networks.'
        ]
      }
    ]
  },
  {
    iteration: 48,
    version: 'v1.48',
    date: 'May 2026',
    badge: '48th Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'SEO',
    title: 'Schema.org JSON-LD Structured Data & Social OG Cards',
    summary: 'Integrated WebApplication, ItemList, and BreadcrumbList structured data for rich snippets in Google search results.',
    highlights: [
      {
        category: 'Structured Markup',
        items: [
          'Embedded dynamic JSON-LD tags across all sets, tools, and articles.',
          'Auto-generated dynamic 1200x630 social share cards with live set logos.'
        ]
      }
    ]
  },
  {
    iteration: 47,
    version: 'v1.47',
    date: 'May 2026',
    badge: '47th Iteration',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    tag: 'Catalog',
    title: 'Expanded Format Legacy Checklists & Black & White Series',
    summary: 'Added complete historical database archives for Black & White, XY, and Sun & Moon series cards.',
    highlights: [
      {
        category: 'Legacy Archives',
        items: [
          'Full visual scan coverage for over 50 vintage and modern legacy expansions.',
          'Expanded format banlist engine checking cards back to BW Base.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Expanded Format', url: '/format/expanded' }
    ]
  },
  {
    iteration: 46,
    version: 'v1.46',
    date: 'April 2026',
    badge: '46th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tools',
    title: 'Top Cards Market Value Ranking by Set',
    summary: 'Instant top-card value explorer displaying the most coveted chase cards, alternate arts, and SIRs per expansion.',
    highlights: [
      {
        category: 'Chase Card Explorer',
        items: [
          'Dedicated /set/:id/top-cards views highlighting grail cards.',
          'Live price comparisons between raw, PSA 9, and PSA 10 slabs.'
        ]
      }
    ]
  },
  {
    iteration: 45,
    version: 'v1.45',
    date: 'April 2026',
    badge: '45th Iteration',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    tag: 'Tournament',
    title: '2026 Standard Rotation Launch (Marks H, I, J) & Meta Archetype Tracker',
    summary: 'Enforced the 2026 Standard format rotation on schedule (March 26 on PTCGL, April 10 in-person): Marks H, I, J legal with Mark G transitioned to Expanded. Deployed tournament archetypes and 60-card legality checks.',
    highlights: [
      {
        category: 'Rotation Enforcement & Meta Decks',
        items: [
          'Live rotation checks enforcing Regulation Marks H, I, and J, retiring Mark G to Expanded format.',
          'Indexed major deck archetypes including Gardevoir ex, Charizard ex, and Regidrago VSTAR.',
          'Visual archetype breakdowns showing core cards, flex tech cards, and matchup spreads.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Gardevoir ex Deck', url: '/deck/gardevoir-ex' }
    ]
  },
  {
    iteration: 44,
    version: 'v1.44',
    date: 'March 2026',
    badge: '44th Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'Catalog',
    title: 'Japanese & International Set Name Cross-Reference',
    summary: 'Bilingual set indexing bridging Japanese High Class Packs with Western Pokémon TCG expansion releases.',
    highlights: [
      {
        category: 'International Indexing',
        items: [
          'Cross-referenced Japanese Tera Festival and Super Electric Breaker to Western sets.',
          'Card number mapping between Asian and Western release sequences.'
        ]
      }
    ]
  },
  {
    iteration: 43,
    version: 'v1.43',
    date: 'March 2026',
    badge: '43rd Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Security',
    title: 'Enterprise CSP Hardening & Zero-Telemetry Privacy',
    summary: 'Strictest Content-Security-Policy compliance with zero third-party trackers, zero advertising scripts, and full client sandbox isolation.',
    highlights: [
      {
        category: 'Privacy Standards',
        items: [
          'Removed all external marketing beacons and tracking pixels.',
          'Local cryptographic session handling with zero telemetry leak.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Privacy Policy', url: '/privacy' }
    ]
  },
  {
    iteration: 42,
    version: 'v1.42',
    date: 'February 2026',
    badge: '42nd Iteration',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    tag: 'Tools',
    title: 'Slab Scan Barcode & Cert Number Quick Verification',
    summary: 'Instant verification of PSA, CGC, and Beckett cert numbers with direct links to authentication registry pages.',
    highlights: [
      {
        category: 'Graded Verification',
        items: [
          'One-click verification modal for PSA 8-digit and 10-digit certs.',
          'Subgrade breakdown display for BGS and CGC pristine labels.'
        ]
      }
    ]
  },
  {
    iteration: 41,
    version: 'v1.41',
    date: 'February 2026',
    badge: '41st Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Performance',
    title: 'Progressive Image Loading & WebP Prewarming',
    summary: 'Sub-millisecond card rendering using tiny blur placeholders and progressive WebP stream decoding.',
    highlights: [
      {
        category: 'Rendering Engine',
        items: [
          'Reduced portfolio memory footprint by 64% during rapid card scrolling.',
          'Client-side pre-warm queue for high-priority cards in view.'
        ]
      }
    ]
  },
  {
    iteration: 40,
    version: 'v1.40',
    date: 'January 2026',
    badge: '40th Iteration',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tag: 'Catalog',
    title: 'Scarlet & Violet: Prismatic Evolutions Support',
    summary: 'Complete day-one data ingest for Prismatic Evolutions, Special Illustration Rares, and master set checklists.',
    highlights: [
      {
        category: 'New Expansion',
        items: [
          'Full card scan ingest with correct rarity tags (SIR, Hyper Rare, Ultra Rare).',
          'Eeveelution showcase spotlight and booster bundle probability matrix.'
        ]
      }
    ]
  },
  {
    iteration: 39,
    version: 'v1.39',
    date: 'January 2026',
    badge: '39th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tools',
    title: 'Multi-Currency Real-Time Exchange Engine (USD, EUR, GBP, JPY)',
    summary: 'Live currency switcher supporting 12 global fiat currencies with ECB real-time rate updates.',
    highlights: [
      {
        category: 'Internationalization',
        items: [
          'Instant portfolio recalculation across USD, EUR, GBP, CAD, AUD, and JPY.',
          'Localized number formatting and currency symbol placement.'
        ]
      }
    ]
  },
  {
    iteration: 38,
    version: 'v1.38',
    date: 'December 2025',
    badge: '38th Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Tournament',
    title: 'Surging Sparks Expansion & Pikachu ex Tera Archetype',
    summary: 'Integrated Surging Sparks expansion checklists and competitive Lightning-archetype deck profiles.',
    highlights: [
      {
        category: 'Set Release',
        items: [
          'Added 250+ cards from Surging Sparks with full rarity and artist attribution.',
          'Pikachu ex Stellar Tera deck theorycrafting and card synergy tags.'
        ]
      }
    ]
  },
  {
    iteration: 37,
    version: 'v1.37',
    date: 'December 2025',
    badge: '37th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Performance',
    title: 'Virtual Grid Scrolling for 1,000+ Card Collections',
    summary: 'Engineered virtual windowing list for silky-smooth 60fps scrolling across massive multi-thousand card binders.',
    highlights: [
      {
        category: 'UI Performance',
        items: [
          'DOM node recycling allowing effortless browsing of 5,000+ item collections.',
          'Zero stutter when filtering or sorting large master sets.'
        ]
      }
    ]
  },
  {
    iteration: 36,
    version: 'v1.36',
    date: 'November 2025',
    badge: '36th Iteration',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    tag: 'Catalog',
    title: 'Vintage Wizard of the Coast (WotC) Master Checklists',
    summary: 'Comprehensive high-res archives for Base Set, Jungle, Fossil, Team Rocket, and Neo Genesis 1st Editions.',
    highlights: [
      {
        category: 'Vintage Preservation',
        items: [
          'Shadowless, 1st Edition, and Unlimited variant separation.',
          'Authentic vintage foil scans with accurate galaxy holofoil mapping.'
        ]
      }
    ]
  },
  {
    iteration: 35,
    version: 'v1.35',
    date: 'November 2025',
    badge: '35th Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Tools',
    title: 'Portfolio Profit/Loss & Cost Basis Tracker',
    summary: 'Tax and investment analytics calculating realized gains, unrealized ROI, and purchase cost basis.',
    highlights: [
      {
        category: 'Collector Financials',
        items: [
          'Lot-based cost tracking with purchase date logging.',
          'Downloadable CSV portfolio reports for collector inventory records.'
        ]
      }
    ]
  },
  {
    iteration: 34,
    version: 'v1.34',
    date: 'October 2025',
    badge: '34th Iteration',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    tag: 'Tournament',
    title: 'Stellar Crown Expansion & Terapagos ex Support',
    summary: 'Integrated Stellar Crown expansion cards, Stellar type mechanics, and Area Zero Underdepths synergy engines.',
    highlights: [
      {
        category: 'Mechanics Ingest',
        items: [
          'Engineered support for Rainbow energy attack costs and Tera mechanics.',
          'Terapagos ex / Noctowl bench accelerator deck builder presets.'
        ]
      }
    ]
  },
  {
    iteration: 33,
    version: 'v1.33',
    date: 'October 2025',
    badge: '33rd Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'SEO',
    title: 'Autonomous IndexNow Edge Pings & Instant Bot Notification',
    summary: 'Instant crawler notification engine transmitting HTTP pings to Microsoft Bing and Yandex upon data updates.',
    highlights: [
      {
        category: 'Indexing Velocity',
        items: [
          'Automated key verification endpoint for IndexNow.',
          'Immediate index request triggers for newly released expansion sets.'
        ]
      }
    ]
  },
  {
    iteration: 32,
    version: 'v1.32',
    date: 'September 2025',
    badge: '32nd Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tools',
    title: 'Interactive Centering Ratio Gauge (50/50 to 75/25)',
    summary: 'Visual centering assessment overlay calculating top/bottom and left/right border ratios from card photos.',
    highlights: [
      {
        category: 'Pre-Grade Assessment',
        items: [
          'Dynamic millimeter scale overlay for grading borders.',
          'Automatic qualification flagging for PSA 10 Gem Mint standards (55/45 front).'
        ]
      }
    ]
  },
  {
    iteration: 31,
    version: 'v1.31',
    date: 'September 2025',
    badge: '31st Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Catalog',
    title: 'Shrouded Fable Expansion & Pecharunt ex Night Mechanics',
    summary: 'Special summer expansion set release checklists with Loyal Three synergy deck recommendations.',
    highlights: [
      {
        category: 'Set Ingest',
        items: [
          'Complete scan directory and illustration rare gallery for Shrouded Fable.',
          'Darkness deck build presets featuring Pecharunt ex and Okidogi ex.'
        ]
      }
    ]
  },
  {
    iteration: 30,
    version: 'v1.30',
    date: 'August 2025',
    badge: '30th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Major',
    title: 'Public Portfolio Showcase & Read-Only Sharing Links',
    summary: 'Create custom shareable links for your graded slabs and binder showcases with privacy toggles.',
    highlights: [
      {
        category: 'Community Sharing',
        items: [
          'Vanity URLs for public collector profiles (e.g., /portfolio/:shareId).',
          'Optional price hiding toggles for showcasing rare cards without disclosing monetary value.'
        ]
      }
    ]
  },
  {
    iteration: 29,
    version: 'v1.29',
    date: 'August 2025',
    badge: '29th Iteration',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    tag: 'Performance',
    title: 'Client-Side Offline SQLite / IndexedDB Data Sync',
    summary: 'Full offline search capability caching set catalogues locally for instantaneous query execution without network roundtrips.',
    highlights: [
      {
        category: 'Local Storage',
        items: [
          'Background worker synchronization storing compressed set schemas in browser IndexedDB.',
          'Offline card searches return in under 3 milliseconds.'
        ]
      }
    ]
  },
  {
    iteration: 28,
    version: 'v1.28',
    date: 'July 2025',
    badge: '28th Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Catalog',
    title: 'Twilight Masquerade Expansion & Ogerpon ex Masks',
    summary: 'Added Twilight Masquerade cards with multi-mask Ogerpon ex energy acceleration filters.',
    highlights: [
      {
        category: 'Set Release',
        items: [
          'All 226+ cards indexed with high-res scans and Special Illustration Rares.',
          'Teal Mask Ogerpon ex grass energy acceleration synergy guide.'
        ]
      }
    ]
  },
  {
    iteration: 27,
    version: 'v1.27',
    date: 'July 2025',
    badge: '27th Iteration',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    tag: 'Tools',
    title: 'Portfolio CSV Export & Reporting Engine',
    summary: 'Standardized portfolio data export for insurance schedules, spreadsheets, and inventory backups.',
    highlights: [
      {
        category: 'Data Portability',
        items: [
          'Intelligent column matching parser mapping set codes and card numbers.',
          'Error-tolerant import preview highlighting unmatched items for quick manual resolution.'
        ]
      }
    ]
  },
  {
    iteration: 26,
    version: 'v1.26',
    date: 'June 2025',
    badge: '26th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tournament',
    title: 'Dragapult ex & Regidrago VSTAR Meta Deck Analysis',
    summary: 'In-depth meta tournament deck profiles with damage counter spread counters and deck matchup calculations.',
    highlights: [
      {
        category: 'Archetype Insights',
        items: [
          'Turn-by-turn prize map scenarios and Phantom Dive damage allocation guides.',
          'Sideboard and tech card suggestions for current regional meta.'
        ]
      }
    ]
  },
  {
    iteration: 25,
    version: 'v1.25',
    date: 'June 2025',
    badge: '25th Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'Catalog',
    title: 'Temporal Forces Expansion & Return of ACE SPEC Cards',
    summary: 'Indexed Ancient & Future mechanics alongside iconic ACE SPEC cards (Prime Catcher, Maximum Belt).',
    highlights: [
      {
        category: 'Set Release',
        items: [
          'Dedicated ACE SPEC filter tag with special magenta border styling.',
          'Iron Crown ex and Raging Bolt ex Ancient/Future synergy filters.'
        ]
      }
    ]
  },
  {
    iteration: 24,
    version: 'v1.24',
    date: 'May 2025',
    badge: '24th Iteration',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    tag: 'SEO',
    title: 'Dynamic LLM Discovery Matrix (llms.txt & llms-full.txt)',
    summary: 'Published standardized AI crawler specifications enabling LLMs (Perplexity, ChatGPT, Claude) to query accurate TCG data.',
    highlights: [
      {
        category: 'AI Indexing',
        items: [
          'Generated markdown summaries of all legal formats and expansion sets.',
          'Structured knowledge base optimized for retrieval-augmented generation.'
        ]
      }
    ]
  },
  {
    iteration: 23,
    version: 'v1.23',
    date: 'May 2025',
    badge: '23rd Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Tools',
    title: 'Booster Pack Pull Rate & Expected Value Simulator',
    summary: 'Probabilistic simulation engine calculating expected booster box yields based on community pull rate data.',
    highlights: [
      {
        category: 'Box Math',
        items: [
          'Monte Carlo simulation of 1,000 booster box openings per modern set.',
          'Visual EV breakdown comparing sealed booster box market price to opened singles value.'
        ]
      }
    ]
  },
  {
    iteration: 22,
    version: 'v1.22',
    date: 'April 2025',
    badge: '22nd Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Catalog',
    title: 'Paldean Fates Expansion & Baby Shiny Master Gallery',
    summary: 'Complete checklists for Shiny Treasure ex / Paldean Fates including all Baby Shinies and Charizard ex SIR.',
    highlights: [
      {
        category: 'Shiny Pokemon Filter',
        items: [
          'Filtered views for Shiny Vault cards with distinctive sparkle badge markers.',
          'Complete Mew ex, Gardevoir ex, and Charizard ex SIR scans.'
        ]
      }
    ]
  },
  {
    iteration: 21,
    version: 'v1.21',
    date: 'April 2025',
    badge: '21st Iteration',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tag: 'Major',
    title: 'Interactive 3D Holographic Card Shader Engine',
    summary: 'Custom WebGL / CSS 3D parallax holographic shader simulating authentic cosmic, rainbow, and reverse holofoil sheen.',
    highlights: [
      {
        category: 'Visual Fidelity',
        items: [
          'Gyroscope-assisted tilt on mobile devices and mouse-driven parallax on desktop.',
          'Era-accurate foil patterns from WotC galaxy foils to modern textured Ultra Rares.'
        ]
      }
    ]
  },
  {
    iteration: 20,
    version: 'v1.20',
    date: 'March 2025',
    badge: '20th Iteration',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    tag: 'Tools',
    title: 'Slab Scanner OCR & Machine Vision Label Detection',
    summary: 'Camera-based snapshot scanner automatically detecting PSA and CGC certification labels.',
    highlights: [
      {
        category: 'Computer Vision',
        items: [
          'On-device image cropping and optical character recognition.',
          'Auto-fills grade, set name, and card number within 800ms of capture.'
        ]
      }
    ]
  },
  {
    iteration: 19,
    version: 'v1.19',
    date: 'March 2025',
    badge: '19th Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Catalog',
    title: 'Paradox Rift Expansion & Roaring Moon / Iron Valiant',
    summary: 'Ingested Paradox Rift cards, introducing Ancient & Future classification mechanics.',
    highlights: [
      {
        category: 'Set Release',
        items: [
          '260+ cards catalogued with high-resolution foil layers.',
          'Ancient and Future mechanic filter tags in card search engine.'
        ]
      }
    ]
  },
  {
    iteration: 18,
    version: 'v1.18',
    date: 'February 2025',
    badge: '18th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tournament',
    title: 'Unlimited Format & Retro Format Rules Database',
    summary: 'Documentation and deck builder support for historical formats including 2004, 2010, and Unlimited.',
    highlights: [
      {
        category: 'Retro Gaming',
        items: [
          'Historical rule sets and errata archives for classic eras.',
          'Format filter selecting only cards printed within specific historical windows.'
        ]
      }
    ]
  },
  {
    iteration: 17,
    version: 'v1.17',
    date: 'February 2025',
    badge: '17th Iteration',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    tag: 'Performance',
    title: 'Global CDN Asset Mirroring & 99.9% Cache Hit Ratio',
    summary: 'Distributed edge caching for card image assets reducing server bandwidth and accelerating image delivery.',
    highlights: [
      {
        category: 'Infrastructure',
        items: [
          'Edge caching across 280+ worldwide points of presence.',
          'Zero cold-start image delays for international users.'
        ]
      }
    ]
  },
  {
    iteration: 16,
    version: 'v1.16',
    date: 'January 2025',
    badge: '16th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Catalog',
    title: 'Pokémon 151 Special Set & Master Ball Reverse Holos',
    summary: 'Master checklist and variant separation for the iconic Pokémon 151 special expansion.',
    highlights: [
      {
        category: 'Set Feature',
        items: [
          'Support for Poké Ball and Master Ball reverse holofoil variants.',
          'Special Illustration Rare illustration gallery for original Kanto starters.'
        ]
      }
    ]
  },
  {
    iteration: 15,
    version: 'v1.15',
    date: 'January 2025',
    badge: '15th Iteration',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    tag: 'Tools',
    title: 'Historical Price Charting & eBay Sold Listings Integration',
    summary: 'Historical sales price curves tracking 90-day moving averages and recent verified eBay sales.',
    highlights: [
      {
        category: 'Market Data',
        items: [
          'Interactive SVG price trend graphs for raw vs PSA 10 cards.',
          'Outlier transaction filtering to eliminate fake/unpaid sales.'
        ]
      }
    ]
  },
  {
    iteration: 14,
    version: 'v1.14',
    date: 'December 2024',
    badge: '14th Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Catalog',
    title: 'Obsidian Flames Expansion & Dark Tera Charizard ex',
    summary: 'Added Obsidian Flames cards with Dark Tera typing mechanics and gold hyper rare cards.',
    highlights: [
      {
        category: 'Expansion Update',
        items: [
          'Complete set checklists and visual card cards for Obsidian Flames.',
          'Charizard ex archetype analysis and deck templates.'
        ]
      }
    ]
  },
  {
    iteration: 13,
    version: 'v1.13',
    date: 'December 2024',
    badge: '13th Iteration',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    tag: 'Security',
    title: 'Multi-Factor Authentication & Encrypted Cloud Backup',
    summary: 'Enterprise-grade user account security with optional two-factor authentication and Firestore encryption.',
    highlights: [
      {
        category: 'User Security',
        items: [
          'Added secure Firebase authentication with email/password and OAuth providers.',
          'End-to-end encrypted collection cloud syncing across devices.'
        ]
      }
    ]
  },
  {
    iteration: 12,
    version: 'v1.12',
    date: 'November 2024',
    badge: '12th Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Catalog',
    title: 'Paldea Evolved Expansion & Special Illustration Rares',
    summary: 'Checklists and card scans for Paldea Evolved including Chien-Pao ex, Ting-Lu ex, and Iono Full Art.',
    highlights: [
      {
        category: 'Card Expansion',
        items: [
          'Full visual catalogue for Paldea Evolved with 279 total cards.',
          'Supporter card gallery with high-res illustrator spotlights.'
        ]
      }
    ]
  },
  {
    iteration: 11,
    version: 'v1.11',
    date: 'November 2024',
    badge: '11th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Tools',
    title: 'Visual Deck Builder Canvas & Synergy Heatmap',
    summary: 'Drag-and-drop deck construction workspace with automated energy curve analysis and supporter ratios.',
    highlights: [
      {
        category: 'Deck Studio',
        items: [
          'Interactive 60-card canvas with instant visual slot validation.',
          'Energy curve histogram and starting hand mulligan simulator.'
        ]
      }
    ]
  },
  {
    iteration: 10,
    version: 'v1.10',
    date: 'October 2024',
    badge: '10th Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'Major',
    title: 'Scarlet & Violet Base Set & Silver Border Era Transition',
    summary: 'Inaugural Scarlet & Violet generation update introducing grey/silver card borders and ex mechanics.',
    highlights: [
      {
        category: 'Era Milestone',
        items: [
          'Implemented Scarlet & Violet silver border UI frame styling.',
          'Added double rare and ultra rare ex classification system.'
        ]
      }
    ]
  },
  {
    iteration: 9,
    version: 'v1.09',
    date: 'October 2024',
    badge: '9th Iteration',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    tag: 'Catalog',
    title: 'Crown Zenith Special Set & Galarian Gallery Archive',
    summary: 'Final Sword & Shield celebration set indexing all 70 Galarian Gallery textured art cards.',
    highlights: [
      {
        category: 'Special Set',
        items: [
          'High-resolution Galarian Gallery quad-art showcase (Giratina, Arceus, Dialga, Palkia).',
          'Complete Crown Zenith checklist with booster bundle tracking.'
        ]
      }
    ]
  },
  {
    iteration: 8,
    version: 'v1.08',
    date: 'September 2024',
    badge: '8th Iteration',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    tag: 'Performance',
    title: 'Optimistic UI Updates & Instant Local State Mutation',
    summary: 'Zero-latency inventory actions; adding or removing cards updates collection counts instantly before cloud acknowledgment.',
    highlights: [
      {
        category: 'App Responsiveness',
        items: [
          'Rollback safety mechanism in the event of dropped connections.',
          'Silky smooth collection management on spotty mobile Wi-Fi.'
        ]
      }
    ]
  },
  {
    iteration: 7,
    version: 'v1.07',
    date: 'September 2024',
    badge: '7th Iteration',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tag: 'Tools',
    title: 'Binder Page Simulation (4-Pocket, 9-Pocket, 12-Pocket)',
    summary: 'Virtual binder view displaying your collection in realistic ringless portfolio layouts.',
    highlights: [
      {
        category: 'Display Modes',
        items: [
          'Switch between 4, 9, and 12-pocket virtual binder page layouts.',
          'Custom sorting by set number, pokedex number, rarity, or date acquired.'
        ]
      }
    ]
  },
  {
    iteration: 6,
    version: 'v1.06',
    date: 'August 2024',
    badge: '6th Iteration',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    tag: 'Catalog',
    title: 'Sword & Shield Era Complete Master Checklists (Base to Silver Tempest)',
    summary: 'Complete retrospective ingestion of all 12 main Sword & Shield expansion sets and subsets.',
    highlights: [
      {
        category: 'Era Completion',
        items: [
          'Over 3,500 Sword & Shield cards indexed with trainer galleries.',
          'VMAX, VSTAR, and Radiant Pokémon card subtype tagging.'
        ]
      }
    ]
  },
  {
    iteration: 5,
    version: 'v1.05',
    date: 'August 2024',
    badge: '5th Iteration',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    tag: 'Tools',
    title: 'Bulk Add & Multi-Select Quick Operations',
    summary: 'Select multiple cards simultaneously to batch adjust quantities, mark as graded, or move to trade binders.',
    highlights: [
      {
        category: 'Batch Operations',
        items: [
          'Shift-click selection across card grids.',
          'Bulk tag assignment (For Trade, Personal Collection, At Grading).'
        ]
      }
    ]
  },
  {
    iteration: 4,
    version: 'v1.04',
    date: 'July 2024',
    badge: '4th Iteration',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tag: 'Catalog',
    title: 'Sun & Moon Era Ingest & Tag Team GX Cards',
    summary: 'Archived Sun & Moon series cards, Ultra Beasts, and iconic Tag Team GX alternate art expansions.',
    highlights: [
      {
        category: 'Vintage Update',
        items: [
          'Full checklists for Team Up, Unbroken Bonds, and Cosmic Eclipse.',
          'Tag Team GX dynamic visual indicators and artist details.'
        ]
      }
    ]
  },
  {
    iteration: 3,
    version: 'v1.03',
    date: 'July 2024',
    badge: '3rd Iteration',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    tag: 'Tools',
    title: 'Wishlist & Trade List Segregation',
    summary: 'Separate your collection into Owned, Wishlist, and Trade piles with automatic trade balance calculations.',
    highlights: [
      {
        category: 'Trading Tools',
        items: [
          'Side-by-side trade evaluation comparing value parity.',
          'Direct export of wishlist items to PDF and shareable links.'
        ]
      }
    ]
  },
  {
    iteration: 2,
    version: 'v1.02',
    date: 'June 2024',
    badge: '2nd Iteration',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tag: 'Performance',
    title: 'TCGdex High-Speed API Integration & Schema Unification',
    summary: 'Integrated high-speed TCGdex REST and GraphQL endpoints for millisecond card metadata fetching.',
    highlights: [
      {
        category: 'Data Pipeline',
        items: [
          'Unified multi-provider card data schema for consistent typing and attacks.',
          'Failover cache preventing downtime during third-party API interruptions.'
        ]
      }
    ]
  },
  {
    iteration: 1,
    version: 'v1.01',
    date: 'June 2024',
    badge: '1st Iteration',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    tag: 'Major',
    title: 'Genesis Platform Launch — Clean Pokémon Portfolio Tracking',
    summary: 'The inaugural foundational release of DECK / divider: zero-distraction collection management, high-resolution scans, and modern web UI.',
    highlights: [
      {
        category: 'Core Launch',
        items: [
          'Initial portfolio dashboard with real-time value metrics and collection stats.',
          'Responsive desktop and mobile card browsing with clean typography and zero ads.',
          'Cloud synchronization and local guest storage mode.'
        ]
      }
    ],
    relatedUrls: [
      { label: 'Explore Platform', url: '/' }
    ]
  }
];
