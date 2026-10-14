import type { CommunityReview } from '../types';

/**
 * 1,000+ Realistic, Natural Community Trainer Reviews for DECK / divider
 * Weighted to exactly ~4.72 average rating across 5 categories:
 * - 60-Card Deck Studio & PTCGL Export
 * - Graded Slabs & Cert Vault
 * - Binder Checklists & Master Sets
 * - Live Market Valuation & NAV
 * - UI, Search Speed & Mobile Web
 * 
 * Rating distribution:
 * ~740 x 5-star (74%)
 * ~240 x 4-star (24%)
 * ~20 x 3-star (2%)
 * Exactly calculated mean: 4.72
 */

// 1. Core high-detail anchor reviews
const HIGH_DETAIL_REVIEWS: CommunityReview[] = [
  {
    id: 'rev-anchor-001',
    authorName: 'Alex Thorne (KantoCards)',
    isAnonymous: false,
    rating: 5,
    title: 'Hands down the cleanest PTCGL deck export workflow',
    comment: 'Been playing competitive Pokémon TCG since Sword & Shield format. Most deck builders have bloated ads or broken text formatting when exporting to Pokémon TCG Live. DECK / divider copies standard 60-card lists cleanly without duplicate line errors. Rotation indicators also saved me from bringing outdated format cards to my local league challenge.',
    category: 'Deck Studio & PTCGL',
    userRole: 'Regional Competitor',
    createdAt: '2026-09-18T14:22:10.000Z',
    likesCount: 38,
    isVerified: true
  },
  {
    id: 'rev-anchor-002',
    authorName: 'Marcus V. (SlabTrader99)',
    isAnonymous: false,
    rating: 5,
    title: 'PSA & CGC cert barcode lookup is lightning fast',
    comment: 'Managing over 180 PSA and CGC slabs was a nightmare in Google Sheets. With DECK / divider I can log cert numbers directly and get clean auction price baselines. The portfolio NAV breakdown with profit/loss margins is exactly what high-end collectors needed.',
    category: 'Graded Slabs & Vault',
    userRole: 'Slab Collector & Investor',
    createdAt: '2026-09-17T09:15:33.000Z',
    likesCount: 29,
    isVerified: true
  },
  {
    id: 'rev-anchor-003',
    authorName: 'Elena Rostova',
    isAnonymous: false,
    rating: 4,
    title: 'Incredible master set tracking, please add Japanese sets soon!',
    comment: 'Mastering the 151 and Paldea Evolved sets was made so much easier by the visual binder grid. You can toggle between normal, holo, and illustration rares instantly. Only giving 4 stars because I really hope Japanese classic expansions get integrated in a future update!',
    category: 'Master Sets & Checklists',
    userRole: 'Master Set Collector',
    createdAt: '2026-09-15T18:40:02.000Z',
    likesCount: 21,
    isVerified: true
  },
  {
    id: 'rev-anchor-004',
    authorName: 'Trainer_Red_96',
    isAnonymous: false,
    rating: 5,
    title: 'Real-time TCGplayer market pricing is accurate during trade nights',
    comment: 'At our local game store trade nights everyone pulls out different apps with wildly different price estimates. DECK / divider pulls authentic market lows and certified averages that both sides can agree on. Plus the mobile web layout is buttery smooth.',
    category: 'Live Market & NAV',
    userRole: 'LGS League Leader',
    createdAt: '2026-09-14T21:05:44.000Z',
    likesCount: 19,
    isVerified: true
  },
  {
    id: 'rev-anchor-005',
    authorName: 'Dave "PokéDad" Miller',
    isAnonymous: false,
    rating: 5,
    title: 'Zero spam ads and perfectly organized for my kids and me',
    comment: 'My two sons and I catalog our binder collections together. Other apps are filled with pop-up banner ads that crash mobile browsers. This platform is fast, clean, and respects user privacy. The wish-list export is also great for birthday shopping.',
    category: 'General & UI',
    userRole: 'Casual Collector',
    createdAt: '2026-09-12T11:30:19.000Z',
    likesCount: 14,
    isVerified: true
  },
  {
    id: 'rev-anchor-006',
    authorName: 'Kenji Sato',
    isAnonymous: false,
    rating: 4,
    title: 'Solid proxy sheet printing, grid alignment is spot on',
    comment: 'Printing 60-card test proxies for our tournament testing gauntlet takes seconds. Cards render in standard 2.5x3.5 inch sleeves without weird stretching. Would love a feature to print 9 cards per page with custom cut-lines, but otherwise fantastic tool.',
    category: 'Deck Studio & PTCGL',
    userRole: 'Tournament Gauntlet Tester',
    createdAt: '2026-09-10T16:45:00.000Z',
    likesCount: 16,
    isVerified: true
  },
  {
    id: 'rev-anchor-007',
    authorName: 'Anonymous Trainer',
    isAnonymous: true,
    rating: 3,
    title: 'Great tool, took a minute to find the slab cert search',
    comment: 'The interface is very sleek, but on first visit on a smaller phone screen the slab cert button was tucked inside the vault tab. Once I found it, it worked flawlessly. Hope the mobile bottom nav gets a direct shortcut.',
    category: 'Graded Slabs & Vault',
    userRole: 'Anonymous Member',
    createdAt: '2026-09-08T13:12:45.000Z',
    likesCount: 8,
    isVerified: false
  }
];

// Helper seeds to construct 1,000 realistic, organic-sounding reviews
const TRAINER_FIRST_NAMES = [
  'Lucas', 'Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella',
  'Oliver', 'Mia', 'Aiden', 'Harper', 'Elijah', 'Evelyn', 'James', 'Amelia', 'Benjamin', 'Abigail',
  'Sebastian', 'Emily', 'Jack', 'Charlotte', 'Henry', 'Ella', 'Owen', 'Scarlett', 'Wyatt', 'Grace',
  'Julian', 'Chloe', 'Levi', 'Camila', 'David', 'Penelope', 'John', 'Riley', 'Samuel', 'Layla',
  'Mateo', 'Nora', 'Daniel', 'Lily', 'Leo', 'Zoey', 'Gabriel', 'Hannah', 'Carter', 'Stella',
  'Dylan', 'Aurora', 'Anthony', 'Natalie', 'Jaxon', 'Emilia', 'Ezra', 'Maya', 'Joshua', 'Audrey',
  'Christopher', 'Bella', 'Andrew', 'Nova', 'Theodore', 'Genesis', 'Caleb', 'Skylar', 'Ryan', 'Lucy',
  'Asher', 'Paisley', 'Nathan', 'Everly', 'Thomas', 'Anna', 'Leo', 'Caroline', 'Isaiah', 'Nova',
  'Charles', 'Genesis', 'Josiah', 'Emilia', 'Hudson', 'Kennedy', 'Christian', 'Samantha', 'Hunter', 'Maya'
];

const TRAINER_HANDLES = [
  'PokéMaster', 'TCG_Pilot', 'BinderKing', 'CharizardFan', 'SlabHunter', 'MetaGrinder', 'CardNinja', 'GymLeader',
  'Mint10Chaser', 'VaultKeeper', 'PaldeaGrinder', 'StarlightCards', 'RareHolo', 'ApexTrainer', 'AeroCards',
  'PrismTCG', 'ZenithPulls', 'ShadowlessGamer', 'LugiaLover', 'MewtwoOps', 'EeveeCollector', 'CrownZenithBro',
  'TCG_Strategy', 'PikaPower', 'UltraBallHero', 'PremierCollector', 'TopCutGamer', 'DeckLab', 'SlabSquad'
];

const ROLES_POOL = [
  'Verified Trainer', 'Regional Competitor', 'Master Set Collector', 'Slab Collector & Investor',
  'LGS League Leader', 'Casual Collector', 'Tournament Gauntlet Tester', 'PokéParent & Collector',
  'Vintage WotC Collector', 'Competitive Deck Builder', 'Card Grading Enthusiast'
];

const CATEGORIES_POOL = [
  'Deck Studio & PTCGL',
  'Graded Slabs & Vault',
  'Master Sets & Checklists',
  'Live Market & NAV',
  'General & UI'
];

interface TemplateReview {
  category: string;
  rating: number;
  titles: string[];
  comments: string[];
}

const TEMPLATES: TemplateReview[] = [
  // 1. Deck Studio & PTCGL (5-star & 4-star)
  {
    category: 'Deck Studio & PTCGL',
    rating: 5,
    titles: [
      'Export to PTCGL works on the first try every time',
      'The rotation countdown marker saved my tournament list',
      'Best 60-card simulator with instant card lookup',
      'Flawless export formatting without syntax errors',
      'Standard format card legality filter is a game changer',
      'Super easy to tweak energy curves and trainer counts',
      'No more broken clipboard exports in Pokémon TCG Live'
    ],
    comments: [
      'Building tournament deck rosters on mobile used to be frustrating. DECK / divider makes searching, adjusting quantities, and testing match legality completely seamless.',
      'I build 3 to 4 decks a week for league play. The standard legality indicators and one-tap PTCGL text generator save so much time before tournament registration.',
      'Love the breakdown of Pokémon, Trainer, and Energy counts. The visual card art makes it very easy to double-check alternate art variants.',
      'Exporting directly into Pokémon TCG Live worked without a single missing card error. The deck price estimation is also super helpful for budget testing.',
      'Cleanest deck builder on the web. No invasive ads, fast typeahead card search, and perfect clipboard format export.'
    ]
  },
  {
    category: 'Deck Studio & PTCGL',
    rating: 4,
    titles: [
      'Great deck builder, would love custom sleeves preview',
      'Super smooth PTCGL export, hoping for Expanded format soon',
      'Very clean deck tester, waiting for prize card tracker',
      'Fast card search, minor suggestion for side-by-side card comparisons'
    ],
    comments: [
      'The deck builder is exceptionally fast and the legality tags are spot-on. Would be awesome if there was a built-in prize card simulation tool, but overall top tier.',
      'Exports to PTCGL with zero issues. Looking forward to expanded format filters and Japanese promo listings in upcoming versions.',
      'Really polished tool for theory-crafting 60-card lists. The proxy printing was surprisingly crisp on standard cardstock.'
    ]
  },

  // 2. Graded Slabs & Vault
  {
    category: 'Graded Slabs & Vault',
    rating: 5,
    titles: [
      'PSA and CGC slab tracking done right',
      'Finally an app that tracks certified slab values accurately',
      'The portfolio NAV calculation is clean and transparent',
      'Barcode and cert lookup saves hours of cataloging',
      'Great for tracking population reports and auction comps'
    ],
    comments: [
      'Logged over 80 PSA slabs in under 15 minutes. The valuation engine matches authentic verified sales without inflated numbers.',
      'Being able to separate my raw binder cards from my graded slab vault makes keeping track of my collection net worth effortless.',
      'The cert lookup feature pulled accurate grades and set names immediately. Highly recommended for any serious graded card investor.',
      'Sleek dark mode, fast search, and the verified embed badges look awesome on my collection showcase page.'
    ]
  },
  {
    category: 'Graded Slabs & Vault',
    rating: 4,
    titles: [
      'Solid slab tracker, hope BGS sub-grades get added',
      'Very clean vault overview, waiting for bulk CSV import',
      'Accurate price benchmarks for PSA 9 and 10s'
    ],
    comments: [
      'Great platform for tracking PSA 10 slabs. It would be great to see subgrades for BGS slabs detailed on the card card, but the overall vault NAV is top notch.',
      'Clean interface and fast valuation updates. A bulk CSV upload feature would make initial onboarding even faster.'
    ]
  },

  // 3. Master Sets & Checklists
  {
    category: 'Master Sets & Checklists',
    rating: 5,
    titles: [
      'Best visual binder grid for completing master sets',
      '151 and Paldea Evolved tracking is so satisfying',
      'Illustration rare and secret rare checklist layout is perfect',
      'Tracks normal, reverse holo, and master set progress flawlessly',
      'The chase card price hierarchy is spot on'
    ],
    comments: [
      'Completing master sets used to require messy paper checklists. The 9-pocket binder grid layout here feels just like flipping through a physical ultra-pro binder.',
      'Love the percentage completion circle for modern sets like Twilight Masquerade and Surging Sparks. Keeps me motivated to find missing reverse holos.',
      'High-resolution card scans and clear indicators for regular holos vs secret illustration rares make master set tracking effortless.',
      'The set directory with top 20 most expensive chase cards is the first thing I check before buying a booster box.'
    ]
  },
  {
    category: 'Master Sets & Checklists',
    rating: 4,
    titles: [
      'Great checklist, would love vintage promo sets',
      'Love the binder view, minor wish for custom binder labels',
      'Smooth tracking, looking forward to classic e-series cards'
    ],
    comments: [
      'The binder view is brilliant. Can easily see which card numbers are missing from the set. Hoping vintage black-star promos get added next.',
      'Super intuitive checklist. The search filters for secret rares and special art rares work like a charm.'
    ]
  },

  // 4. Live Market & NAV
  {
    category: 'Live Market & NAV',
    rating: 5,
    titles: [
      'Live TCGplayer market prices make trade nights fair and fast',
      'Accurate market pricing without the lag of other apps',
      'Historical price charts and profit/loss margins are great',
      'Saved me from bad trades at my local card shop',
      'Reliable price baselines for raw and graded cards'
    ],
    comments: [
      'During LGS trade nights we always pull up DECK / divider because the market low and market mid values are reliable and transparent.',
      'The portfolio total value updates in real time based on active market trends. Really helps track whether modern sets are holding value.',
      'Very clear distinction between raw card values and certified slab auction averages. Gives a true picture of collection worth.'
    ]
  },
  {
    category: 'Live Market & NAV',
    rating: 4,
    titles: [
      'Accurate prices, would love multi-currency Euro / GBP switcher',
      'Solid valuation engine, great for quick trade checks',
      'Fast pricing data, looking forward to portfolio gain/loss charts'
    ],
    comments: [
      'Pricing is fast and matches TCGplayer market trends very closely. A quick currency toggle for international trades is great.',
      'Very solid market tracking. The clean layout makes checking card values during trades fast and drama-free.'
    ]
  },

  // 5. General, UI & Speed
  {
    category: 'General & UI',
    rating: 5,
    titles: [
      'Zero ads, snappy UI, and works great on mobile Safari & Chrome',
      'Lightweight web app that loads faster than native apps',
      'Incredible design aesthetics, feels like a professional collector studio',
      'Offline-friendly and respects data privacy',
      'The search bar finds any Pokémon card in under 50 milliseconds'
    ],
    comments: [
      'Most card tracking apps are cluttered with noisy banner ads that eat up phone battery. DECK / divider is clean, minimal, and blazing fast.',
      'The typography, dark/light contrast, and subtle animations make cataloging cards feel like a premium experience.',
      'Saved the app to my home screen as a PWA and it opens instantly even in convention halls with weak signal.'
    ]
  },
  {
    category: 'General & UI',
    rating: 3,
    titles: [
      'Great app, takes a few minutes to learn all shortcuts',
      'Solid tool, wish the mobile filter menu was slightly larger',
      'Very clean design, took me a moment to find export button'
    ],
    comments: [
      'There are so many features packed into this app that it took me a few minutes to discover the proxy print menu. Once you get the hang of it, it is very powerful.',
      'Very sleek interface. On smaller phone screens some buttons are compact, but performance is unmatched.'
    ]
  }
];

/**
 * Generates the full 1,000+ realistic reviews dataset
 * Strict mathematical distribution:
 * ~74% 5-Star (740)
 * ~24% 4-Star (240)
 * ~2% 3-Star (20)
 * Total: 1,000 Reviews | Average: 4.72 Stars
 */
export function generateFullCommunityReviews(count: number = 1000): CommunityReview[] {
  const reviews: CommunityReview[] = [...HIGH_DETAIL_REVIEWS];
  const target5Stars = Math.round(count * 0.74);
  const target4Stars = Math.round(count * 0.24);
  const target3Stars = count - target5Stars - target4Stars; // exactly 20 for count=1000

  // Tracking how many generated per star tier
  let count5 = reviews.filter(r => r.rating === 5).length;
  let count4 = reviews.filter(r => r.rating === 4).length;
  let count3 = reviews.filter(r => r.rating === 3).length;

  const baseTimestamp = new Date('2026-09-20T20:00:00.000Z').getTime();
  const dayInMs = 24 * 60 * 60 * 1000;

  let index = reviews.length + 1;

  while (reviews.length < count) {
    let chosenRating = 5;
    if (count5 < target5Stars) {
      chosenRating = 5;
      count5++;
    } else if (count4 < target4Stars) {
      chosenRating = 4;
      count4++;
    } else {
      chosenRating = 3;
      count3++;
    }

    const availableTemplates = TEMPLATES.filter(t => t.rating === chosenRating);
    const tmpl = availableTemplates[index % availableTemplates.length];

    const title = tmpl.titles[index % tmpl.titles.length];
    const commentBase = tmpl.comments[index % tmpl.comments.length];

    const isAnon = index % 14 === 0;
    const authorName = isAnon
      ? 'Anonymous Trainer'
      : `${TRAINER_FIRST_NAMES[index % TRAINER_FIRST_NAMES.length]} (${TRAINER_HANDLES[index % TRAINER_HANDLES.length]})`;

    const userRole = isAnon ? 'Anonymous Member' : ROLES_POOL[index % ROLES_POOL.length];
    const category = tmpl.category;

    // Spread timestamps across past 180 days naturally
    const timeOffsetDays = (index * 0.17) % 180;
    const createdAt = new Date(baseTimestamp - timeOffsetDays * dayInMs - (index * 137000)).toISOString();

    const likesCount = (index % 11 === 0) ? Math.floor((index % 25) + 3) : Math.floor((index % 8));

    reviews.push({
      id: `rev-gen-${String(index).padStart(4, '0')}`,
      authorName,
      isAnonymous: isAnon,
      rating: chosenRating,
      title,
      comment: commentBase,
      category,
      userRole,
      createdAt,
      likesCount,
      isVerified: !isAnon
    });

    index++;
  }

  return reviews;
}

export const SEED_COMMUNITY_REVIEWS = generateFullCommunityReviews(1000);
