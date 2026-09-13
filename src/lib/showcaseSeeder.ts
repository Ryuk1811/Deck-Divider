import { PokemonCard, Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry } from '../types';

/**
 * Mock data detection helpers
 * Strictly used to purge any mock / sample / demo data from authenticated user accounts.
 * Mock data must remain strictly isolated to demo mode only.
 */
export function isMockDeck(deck?: { id?: string; name?: string } | null): boolean {
  if (!deck) return false;
  const id = (deck.id || '').toLowerCase();
  const name = (deck.name || '').toLowerCase();
  return (
    id.startsWith('showcase-') ||
    id.startsWith('starter-') ||
    id.startsWith('sample-') ||
    id.startsWith('demo-') ||
    name === 'charizard ex 151 master deck' ||
    name === 'gardevoir ex championship 60' ||
    name === 'lugia vstar archeops turbo' ||
    name === 'starter sample binder' ||
    name === 'charizard ex / pidgeot ex championship 60' ||
    name === 'grail slabs & modern alternate arts vault' ||
    name === '151 special illustration rare binder complete'
  );
}

export function isMockCardEntry(entry?: { id?: string; card?: { id?: string } } | null): boolean {
  if (!entry) return false;
  const id = (entry.id || '').toLowerCase();
  return (
    id.startsWith('showcase-') ||
    id.startsWith('starter-') ||
    id.startsWith('sample-') ||
    id.startsWith('demo-')
  );
}

export function isMockCustomList(list?: { id?: string; name?: string } | null): boolean {
  if (!list) return false;
  const id = (list.id || '').toLowerCase();
  const name = (list.name || '').toLowerCase();
  return (
    id.startsWith('showcase-') ||
    id.startsWith('starter-') ||
    id.startsWith('sample-') ||
    id.startsWith('demo-') ||
    name === 'psa 10 grails & 151 sirs' ||
    name === 'top tier trades'
  );
}

export function isMockSealedEntry(entry?: { id?: string } | null): boolean {
  if (!entry) return false;
  const id = (entry.id || '').toLowerCase();
  return (
    id.startsWith('showcase-') ||
    id.startsWith('starter-') ||
    id.startsWith('sample-') ||
    id.startsWith('demo-')
  );
}

export function isShowcaseAccount(_email?: string | null): boolean {
  // User accounts never load showcase mock data - strictly demo mode only
  return false;
}

// 1. Showcase Grail Cards Master Definitions (Used strictly in Demo Mode)
const CHARIZARD_151_RAW: PokemonCard = {
  id: 'sv3pt5-199',
  name: 'Charizard ex',
  supertype: 'Pokémon',
  subtypes: ['Stage 2', 'ex'],
  category: 'Pokémon',
  stage: 'Stage 2',
  hp: 330,
  types: ['Darkness'],
  rarity: 'Special Illustration Rare',
  artist: 'AKIRA EGAWA',
  number: '199/165',
  set: {
    id: 'sv3pt5',
    name: '151',
    series: 'Scarlet & Violet',
    printedTotal: 165,
    total: 207,
    releaseDate: '2023/09/22',
    symbolUrl: 'https://images.pokemontcg.io/sv3pt5/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
  },
  attacks: [
    {
      name: 'Brave Wing',
      cost: ['Fire'],
      damage: '60+',
      text: 'This attack does 100 more damage for each Prize card your opponent has taken.',
    },
    {
      name: 'Explosive Vortex',
      cost: ['Fire', 'Fire', 'Colorless', 'Colorless'],
      damage: '330',
      text: 'Discard 3 Energy from this Pokémon.',
    },
  ],
  weaknesses: [{ type: 'Grass', value: '×2' }],
  prices: {
    raw: 145.5,
    psa10Estimate: 420.0,
    psa9Estimate: 210.0,
    priceHistory: [
      { date: '2026-06-01', price: 118.0 },
      { date: '2026-07-01', price: 132.5 },
      { date: '2026-08-01', price: 145.5 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/sv3pt5/199.png',
    large: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
  },
};

const MOONBREON_VMAX: PokemonCard = {
  id: 'swsh7-215',
  name: 'Umbreon VMAX (Alternate Secret Art)',
  supertype: 'Pokémon',
  subtypes: ['VMAX', 'Single Strike'],
  category: 'Pokémon',
  stage: 'VMAX',
  hp: 310,
  types: ['Darkness'],
  rarity: 'Secret Rare',
  artist: 'KEIICHIRO ITO',
  number: '215/203',
  set: {
    id: 'swsh7',
    name: 'Evolving Skies',
    series: 'Sword & Shield',
    printedTotal: 203,
    total: 237,
    releaseDate: '2021/08/27',
    symbolUrl: 'https://images.pokemontcg.io/swsh7/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
  },
  attacks: [
    {
      name: 'Dark Signal',
      cost: ['Darkness', 'Colorless', 'Colorless'],
      damage: '160',
      text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.',
    },
    {
      name: 'Max Darkness',
      cost: ['Darkness', 'Colorless', 'Colorless'],
      damage: '160',
      text: '',
    },
  ],
  weaknesses: [{ type: 'Grass', value: '×2' }],
  prices: {
    raw: 980.0,
    psa10Estimate: 1450.0,
    psa9Estimate: 1050.0,
    priceHistory: [
      { date: '2026-06-01', price: 790.0 },
      { date: '2026-07-01', price: 890.0 },
      { date: '2026-08-01', price: 980.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/swsh7/215.png',
    large: 'https://images.pokemontcg.io/swsh7/215_hires.png',
  },
};

const GENGAR_VMAX_ALT: PokemonCard = {
  id: 'swsh8-271',
  name: 'Gengar VMAX (Alternate Secret Art)',
  supertype: 'Pokémon',
  subtypes: ['VMAX', 'Single Strike'],
  category: 'Pokémon',
  stage: 'VMAX',
  hp: 320,
  types: ['Darkness'],
  rarity: 'Secret Rare',
  artist: 'sowsow',
  number: '271/264',
  set: {
    id: 'swsh8',
    name: 'Fusion Strike',
    series: 'Sword & Shield',
    printedTotal: 264,
    total: 284,
    releaseDate: '2021/11/12',
    symbolUrl: 'https://images.pokemontcg.io/swsh8/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/swsh8/logo.png',
  },
  attacks: [
    {
      name: 'Fear and Panic',
      cost: ['Darkness', 'Darkness'],
      damage: '60×',
      text: 'This attack does 60 damage for each of your opponent\'s Pokémon V and Pokémon-GX in play.',
    },
    {
      name: 'G-Max Swallow Up',
      cost: ['Darkness', 'Darkness', 'Darkness'],
      damage: '250',
      text: 'During your next turn, this Pokémon can\'t attack.',
    },
  ],
  weaknesses: [{ type: 'Fighting', value: '×2' }],
  prices: {
    raw: 420.0,
    psa10Estimate: 780.0,
    psa9Estimate: 460.0,
    priceHistory: [
      { date: '2026-06-01', price: 340.0 },
      { date: '2026-07-01', price: 385.0 },
      { date: '2026-08-01', price: 420.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/swsh8/271.png',
    large: 'https://images.pokemontcg.io/swsh8/271_hires.png',
  },
};

const GIRATINA_V_ALT: PokemonCard = {
  id: 'swsh11-186',
  name: 'Giratina V (Alternate Full Art)',
  supertype: 'Pokémon',
  subtypes: ['Basic', 'V'],
  category: 'Pokémon',
  stage: 'Basic',
  hp: 220,
  types: ['Dragon'],
  rarity: 'Ultra Rare',
  artist: 'Shinji Kanda',
  number: '186/196',
  set: {
    id: 'swsh11',
    name: 'Lost Origin',
    series: 'Sword & Shield',
    printedTotal: 196,
    total: 217,
    releaseDate: '2022/09/09',
    symbolUrl: 'https://images.pokemontcg.io/swsh11/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/swsh11/logo.png',
  },
  attacks: [
    {
      name: 'Abyss Seeking',
      cost: ['Colorless'],
      damage: '',
      text: 'Look at the top 4 cards of your deck and put 2 of them into your hand. Put the remaining cards in the Lost Zone.',
    },
    {
      name: 'Shred',
      cost: ['Grass', 'Psychic', 'Colorless'],
      damage: '160',
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.',
    },
  ],
  weaknesses: [],
  prices: {
    raw: 440.0,
    psa10Estimate: 850.0,
    psa9Estimate: 470.0,
    priceHistory: [
      { date: '2026-06-01', price: 360.0 },
      { date: '2026-07-01', price: 405.0 },
      { date: '2026-08-01', price: 440.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/swsh11/186.png',
    large: 'https://images.pokemontcg.io/swsh11/186_hires.png',
  },
};

const LUGIA_V_ALT: PokemonCard = {
  id: 'swsh12-186',
  name: 'Lugia V (Alternate Full Art)',
  supertype: 'Pokémon',
  subtypes: ['Basic', 'V'],
  category: 'Pokémon',
  stage: 'Basic',
  hp: 220,
  types: ['Colorless'],
  rarity: 'Ultra Rare',
  artist: 'kawayoo',
  number: '186/195',
  set: {
    id: 'swsh12',
    name: 'Silver Tempest',
    series: 'Sword & Shield',
    printedTotal: 195,
    total: 215,
    releaseDate: '2022/11/11',
    symbolUrl: 'https://images.pokemontcg.io/swsh12/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/swsh12/logo.png',
  },
  attacks: [
    {
      name: 'Read the Wind',
      cost: ['Colorless'],
      damage: '',
      text: 'Discard a card from your hand. If you do, draw 3 cards.',
    },
    {
      name: 'Aero Dive',
      cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      damage: '130',
      text: 'You may discard a Stadium in play.',
    },
  ],
  weaknesses: [{ type: 'Lightning', value: '×2' }],
  prices: {
    raw: 215.0,
    psa10Estimate: 460.0,
    psa9Estimate: 235.0,
    priceHistory: [
      { date: '2026-06-01', price: 180.0 },
      { date: '2026-07-01', price: 198.0 },
      { date: '2026-08-01', price: 215.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/swsh12/186.png',
    large: 'https://images.pokemontcg.io/swsh12/186_hires.png',
  },
};

const BUBBLE_MEW_SIR: PokemonCard = {
  id: 'sv4pt5-232',
  name: 'Mew ex (Special Illustration Rare)',
  supertype: 'Pokémon',
  subtypes: ['Basic', 'ex'],
  category: 'Pokémon',
  stage: 'Basic',
  hp: 180,
  types: ['Psychic'],
  rarity: 'Special Illustration Rare',
  artist: 'USGMEN',
  number: '232/091',
  set: {
    id: 'sv4pt5',
    name: 'Paldean Fates',
    series: 'Scarlet & Violet',
    printedTotal: 91,
    total: 245,
    releaseDate: '2024/01/26',
    symbolUrl: 'https://images.pokemontcg.io/sv4pt5/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/sv4pt5/logo.png',
  },
  attacks: [
    {
      name: 'Restart',
      cost: [],
      damage: '',
      text: 'Once during your turn, you may draw cards until you have 3 cards in your hand.',
    },
    {
      name: 'Genome Hacking',
      cost: ['Colorless', 'Colorless', 'Colorless'],
      damage: '',
      text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.',
    },
  ],
  weaknesses: [{ type: 'Darkness', value: '×2' }],
  prices: {
    raw: 135.0,
    psa10Estimate: 310.0,
    psa9Estimate: 160.0,
    priceHistory: [
      { date: '2026-06-01', price: 95.0 },
      { date: '2026-07-01', price: 115.0 },
      { date: '2026-08-01', price: 135.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/sv4pt5/232.png',
    large: 'https://images.pokemontcg.io/sv4pt5/232_hires.png',
  },
};

const GREY_FELT_HAT_PIKACHU: PokemonCard = {
  id: 'svp-085',
  name: 'Pikachu with Grey Felt Hat (Van Gogh Promo)',
  supertype: 'Pokémon',
  subtypes: ['Basic', 'Promo'],
  category: 'Pokémon',
  stage: 'Basic',
  hp: 60,
  types: ['Lightning'],
  rarity: 'Promo',
  artist: 'Naoyo Kimura',
  number: '085',
  set: {
    id: 'svp',
    name: 'Scarlet & Violet Black Star Promos',
    series: 'Scarlet & Violet',
    printedTotal: 100,
    total: 120,
    releaseDate: '2023/09/28',
    symbolUrl: 'https://images.pokemontcg.io/svp/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/svp/logo.png',
  },
  attacks: [
    {
      name: 'Pika-Portrait',
      cost: ['Colorless'],
      damage: '',
      text: 'Search your deck for an Item card and put it into your hand.',
    },
  ],
  weaknesses: [{ type: 'Fighting', value: '×2' }],
  prices: {
    raw: 245.0,
    psa10Estimate: 490.0,
    psa9Estimate: 260.0,
    priceHistory: [
      { date: '2026-06-01', price: 175.0 },
      { date: '2026-07-01', price: 210.0 },
      { date: '2026-08-01', price: 245.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/svp/085.png',
    large: 'https://images.pokemontcg.io/svp/085_hires.png',
  },
};

const BLASTOISE_151_SIR: PokemonCard = {
  id: 'sv3pt5-200',
  name: 'Blastoise ex (Special Illustration Rare)',
  supertype: 'Pokémon',
  subtypes: ['Stage 2', 'ex'],
  category: 'Pokémon',
  stage: 'Stage 2',
  hp: 330,
  types: ['Water'],
  rarity: 'Special Illustration Rare',
  artist: 'Mitsuhiro Arita',
  number: '200/165',
  set: {
    id: 'sv3pt5',
    name: '151',
    series: 'Scarlet & Violet',
    printedTotal: 165,
    total: 207,
    releaseDate: '2023/09/22',
    symbolUrl: 'https://images.pokemontcg.io/sv3pt5/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
  },
  attacks: [
    {
      name: 'Solid Shell',
      cost: [],
      damage: '',
      text: 'This Pokémon takes 30 less damage from attacks.',
    },
    {
      name: 'Twin Cannons',
      cost: ['Water', 'Water'],
      damage: '140×',
      text: 'Discard up to 2 Basic Water Energy cards from your hand. This attack does 140 damage for each card discarded.',
    },
  ],
  weaknesses: [{ type: 'Lightning', value: '×2' }],
  prices: {
    raw: 68.0,
    psa10Estimate: 180.0,
    psa9Estimate: 85.0,
    priceHistory: [
      { date: '2026-06-01', price: 52.0 },
      { date: '2026-07-01', price: 61.0 },
      { date: '2026-08-01', price: 68.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/sv3pt5/200.png',
    large: 'https://images.pokemontcg.io/sv3pt5/200_hires.png',
  },
};

const VENUSAUR_151_SIR: PokemonCard = {
  id: 'sv3pt5-198',
  name: 'Venusaur ex (Special Illustration Rare)',
  supertype: 'Pokémon',
  subtypes: ['Stage 2', 'ex'],
  category: 'Pokémon',
  stage: 'Stage 2',
  hp: 340,
  types: ['Grass'],
  rarity: 'Special Illustration Rare',
  artist: 'Yuu Nishida',
  number: '198/165',
  set: {
    id: 'sv3pt5',
    name: '151',
    series: 'Scarlet & Violet',
    printedTotal: 165,
    total: 207,
    releaseDate: '2023/09/22',
    symbolUrl: 'https://images.pokemontcg.io/sv3pt5/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
  },
  attacks: [
    {
      name: 'Tranquil Bloom',
      cost: [],
      damage: '',
      text: 'Once during your turn, if this Pokémon is in the Active Spot, you may heal 60 damage from 1 of your Pokémon.',
    },
    {
      name: 'Dangerous Toxwhip',
      cost: ['Grass', 'Grass', 'Colorless'],
      damage: '150',
      text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.',
    },
  ],
  weaknesses: [{ type: 'Fire', value: '×2' }],
  prices: {
    raw: 58.0,
    psa10Estimate: 160.0,
    psa9Estimate: 75.0,
    priceHistory: [
      { date: '2026-06-01', price: 44.0 },
      { date: '2026-07-01', price: 51.0 },
      { date: '2026-08-01', price: 58.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/sv3pt5/198.png',
    large: 'https://images.pokemontcg.io/sv3pt5/198_hires.png',
  },
};

const IONO_PALDEA_SIR: PokemonCard = {
  id: 'sv2-269',
  name: 'Iono (Special Illustration Rare)',
  supertype: 'Trainer',
  subtypes: ['Supporter'],
  category: 'Trainer',
  rarity: 'Special Illustration Rare',
  artist: 'kirisAki',
  number: '269/193',
  set: {
    id: 'sv2',
    name: 'Paldea Evolved',
    series: 'Scarlet & Violet',
    printedTotal: 193,
    total: 279,
    releaseDate: '2023/06/09',
    symbolUrl: 'https://images.pokemontcg.io/sv2/symbol.png',
    logoUrl: 'https://images.pokemontcg.io/sv2/logo.png',
  },
  description: 'Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, each player draws a card for each of their remaining Prize cards.',
  prices: {
    raw: 82.0,
    psa10Estimate: 210.0,
    psa9Estimate: 95.0,
    priceHistory: [
      { date: '2026-06-01', price: 65.0 },
      { date: '2026-07-01', price: 74.0 },
      { date: '2026-08-01', price: 82.0 },
    ],
  },
  images: {
    small: 'https://images.pokemontcg.io/sv2/269.png',
    large: 'https://images.pokemontcg.io/sv2/269_hires.png',
  },
};

// 2. Build Showcase Decks
export function generateShowcaseDecks(ownerUid: string): Deck[] {
  const pidgeotSir: PokemonCard = {
    id: 'sv3-225',
    name: 'Pidgeot ex (Special Illustration Rare)',
    supertype: 'Pokémon',
    subtypes: ['Stage 2', 'ex'],
    category: 'Pokémon',
    stage: 'Stage 2',
    hp: 280,
    types: ['Colorless'],
    rarity: 'Special Illustration Rare',
    artist: 'Jerky',
    number: '225/197',
    set: {
      id: 'sv3',
      name: 'Obsidian Flames',
      series: 'Scarlet & Violet',
      printedTotal: 197,
      total: 230,
      releaseDate: '2023/08/11',
      symbolUrl: 'https://images.pokemontcg.io/sv3/symbol.png',
      logoUrl: 'https://images.pokemontcg.io/sv3/logo.png',
    },
    attacks: [
      {
        name: 'Quick Search',
        cost: [],
        damage: '',
        text: 'Once during your turn, you may search your deck for any 1 card and put it into your hand.',
      },
      {
        name: 'Blustery Wind',
        cost: ['Colorless', 'Colorless'],
        damage: '120',
        text: 'You may discard a Stadium in play.',
      },
    ],
    weaknesses: [{ type: 'Lightning', value: '×2' }],
    prices: {
      raw: 28.0,
      psa10Estimate: 85.0,
      psa9Estimate: 36.0,
      priceHistory: [],
    },
    images: {
      small: 'https://images.pokemontcg.io/sv3/225.png',
      large: 'https://images.pokemontcg.io/sv3/225_hires.png',
    },
  };

  const primeCatcher: PokemonCard = {
    id: 'sv5-157',
    name: 'Prime Catcher (ACE SPEC)',
    supertype: 'Trainer',
    subtypes: ['Item', 'ACE SPEC'],
    category: 'Trainer',
    rarity: 'ACE SPEC Rare',
    artist: 'Toyste Beach',
    number: '157/162',
    set: {
      id: 'sv5',
      name: 'Temporal Forces',
      series: 'Scarlet & Violet',
      printedTotal: 162,
      total: 218,
      releaseDate: '2024/03/22',
      symbolUrl: 'https://images.pokemontcg.io/sv5/symbol.png',
      logoUrl: 'https://images.pokemontcg.io/sv5/logo.png',
    },
    description: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.',
    prices: {
      raw: 24.5,
      psa10Estimate: 70.0,
      psa9Estimate: 30.0,
      priceHistory: [],
    },
    images: {
      small: 'https://images.pokemontcg.io/sv5/157.png',
      large: 'https://images.pokemontcg.io/sv5/157_hires.png',
    },
  };

  const arvenSir: PokemonCard = {
    id: 'sv1-249',
    name: 'Arven (Special Illustration Rare)',
    supertype: 'Trainer',
    subtypes: ['Supporter'],
    category: 'Trainer',
    rarity: 'Special Illustration Rare',
    artist: 'GOSSAN',
    number: '249/198',
    set: {
      id: 'sv1',
      name: 'Scarlet & Violet',
      series: 'Scarlet & Violet',
      printedTotal: 198,
      total: 258,
      releaseDate: '2023/03/31',
      symbolUrl: 'https://images.pokemontcg.io/sv1/symbol.png',
      logoUrl: 'https://images.pokemontcg.io/sv1/logo.png',
    },
    description: 'Search your deck for an Item card and a Pokémon Tool card, reveal them, and put them into your hand.',
    prices: {
      raw: 22.0,
      psa10Estimate: 65.0,
      psa9Estimate: 28.0,
      priceHistory: [],
    },
    images: {
      small: 'https://images.pokemontcg.io/sv1/249.png',
      large: 'https://images.pokemontcg.io/sv1/249_hires.png',
    },
  };

  const deck1Entries: PortfolioCardEntry[] = [
    {
      id: 'showcase-d1-c1',
      ownerId: ownerUid,
      deckId: 'showcase-deck-1',
      cardId: CHARIZARD_151_RAW.id,
      card: CHARIZARD_151_RAW,
      condition: 'NM',
      quantity: 3,
      purchasePrice: 110.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-15',
      notes: 'Main attacker for Championship Tier list',
      isSold: false,
    },
    {
      id: 'showcase-d1-c2',
      ownerId: ownerUid,
      deckId: 'showcase-deck-1',
      cardId: pidgeotSir.id,
      card: pidgeotSir,
      condition: 'NM',
      quantity: 2,
      purchasePrice: 22.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-15',
      notes: 'Quick search consistency engine',
      isSold: false,
    },
    {
      id: 'showcase-d1-c3',
      ownerId: ownerUid,
      deckId: 'showcase-deck-1',
      cardId: primeCatcher.id,
      card: primeCatcher,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 18.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-18',
      notes: 'ACE SPEC gust + pivot utility',
      isSold: false,
    },
    {
      id: 'showcase-d1-c4',
      ownerId: ownerUid,
      deckId: 'showcase-deck-1',
      cardId: arvenSir.id,
      card: arvenSir,
      condition: 'NM',
      quantity: 4,
      purchasePrice: 19.5,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-20',
      notes: 'Full Art staple engine',
      isSold: false,
    },
    {
      id: 'showcase-d1-c5',
      ownerId: ownerUid,
      deckId: 'showcase-deck-1',
      cardId: IONO_PALDEA_SIR.id,
      card: IONO_PALDEA_SIR,
      condition: 'NM',
      quantity: 4,
      purchasePrice: 70.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-22',
      notes: 'Disruption & late game swing',
      isSold: false,
    },
  ];

  const deck2Entries: PortfolioCardEntry[] = [
    {
      id: 'showcase-d2-c1',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: MOONBREON_VMAX.id,
      card: MOONBREON_VMAX,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 650.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-01-10',
      notes: 'Crown jewel of the SWSH Alt Art collection',
      gradingInfo: {
        company: 'BGS',
        grade: '9.5',
        certNumber: '0014892831',
        subgrades: { centering: 10, corners: 9.5, edges: 9.5, surface: 9.5 },
      },
      isSold: false,
    },
    {
      id: 'showcase-d2-c2',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: GENGAR_VMAX_ALT.id,
      card: GENGAR_VMAX_ALT,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 280.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-02-14',
      notes: 'PSA 9 Investment Slab',
      gradingInfo: {
        company: 'PSA',
        grade: '9',
        certNumber: '78291034',
      },
      isSold: false,
    },
    {
      id: 'showcase-d2-c3',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: GIRATINA_V_ALT.id,
      card: GIRATINA_V_ALT,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 320.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-03-01',
      notes: 'CGC 10 Pristine perfect registration',
      gradingInfo: {
        company: 'CGC',
        grade: '10',
        certNumber: '4281903001',
      },
      isSold: false,
    },
    {
      id: 'showcase-d2-c4',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: LUGIA_V_ALT.id,
      card: LUGIA_V_ALT,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 150.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-03-20',
      notes: 'Silver Tempest masterpiece artwork',
      isSold: false,
    },
    {
      id: 'showcase-d2-c5',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: BUBBLE_MEW_SIR.id,
      card: BUBBLE_MEW_SIR,
      condition: 'NM',
      quantity: 2,
      purchasePrice: 85.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-04-05',
      notes: 'Paldean Fates bubble art favorite',
      isSold: false,
    },
    {
      id: 'showcase-d2-c6',
      ownerId: ownerUid,
      deckId: 'showcase-deck-2',
      cardId: GREY_FELT_HAT_PIKACHU.id,
      card: GREY_FELT_HAT_PIKACHU,
      condition: 'NM',
      quantity: 1,
      purchasePrice: 160.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-04-12',
      notes: 'Amsterdam Van Gogh museum promo sealed/cased',
      gradingInfo: {
        company: 'PSA',
        grade: '10',
        certNumber: '89104721',
      },
      isSold: false,
    },
  ];

  const deck3Entries: PortfolioCardEntry[] = [
    {
      id: 'showcase-d3-c1',
      ownerId: ownerUid,
      deckId: 'showcase-deck-3',
      cardId: BLASTOISE_151_SIR.id,
      card: BLASTOISE_151_SIR,
      condition: 'NM',
      quantity: 2,
      purchasePrice: 50.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-01',
      isSold: false,
    },
    {
      id: 'showcase-d3-c2',
      ownerId: ownerUid,
      deckId: 'showcase-deck-3',
      cardId: VENUSAUR_151_SIR.id,
      card: VENUSAUR_151_SIR,
      condition: 'NM',
      quantity: 2,
      purchasePrice: 42.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2026-05-01',
      isSold: false,
    },
  ];

  return [
    {
      id: 'showcase-deck-1',
      ownerId: ownerUid,
      name: 'Charizard ex / Pidgeot ex Championship 60',
      description: 'Standard format competitive powerhouse equipped with Max Rare SIR supporters, ACE SPEC Prime Catcher, and Turbo Dark fire acceleration.',
      colorHex: '#DC143C',
      isPublic: true,
      publicShareCode: 'CHARIZARD-CHAMP-2026',
      entries: deck1Entries,
      createdAt: '2026-05-15T10:00:00.000Z',
      updatedAt: '2026-08-20T14:30:00.000Z',
    },
    {
      id: 'showcase-deck-2',
      ownerId: ownerUid,
      name: 'Grail Slabs & Modern Alternate Arts Vault',
      description: 'High-grade collection centerpiece featuring BGS 9.5 Moonbreon, PSA 10 Grey Felt Hat Pikachu, CGC 10 Giratina V, and Fusion Strike Gengar.',
      colorHex: '#7E22CE',
      isPublic: true,
      publicShareCode: 'GRAIL-SLABS-VAULT-2026',
      entries: deck2Entries,
      createdAt: '2026-01-10T12:00:00.000Z',
      updatedAt: '2026-08-21T09:15:00.000Z',
    },
    {
      id: 'showcase-deck-3',
      ownerId: ownerUid,
      name: 'Kanto 151 Master Starter Showcase',
      description: 'Special Illustration Rare starter trio collection featuring Akira Egawa Charizard, Mitsuhiro Arita Blastoise, and Yuu Nishida Venusaur.',
      colorHex: '#0EA5E9',
      isPublic: true,
      publicShareCode: 'KANTO-151-TRIO',
      entries: deck3Entries,
      createdAt: '2026-05-01T15:00:00.000Z',
      updatedAt: '2026-08-18T18:00:00.000Z',
    },
  ];
}

// 3. Build Showcase Sealed Products
export function generateShowcaseSealed(ownerUid: string): PortfolioSealedEntry[] {
  return [
    {
      id: 'showcase-sealed-1',
      ownerId: ownerUid,
      productId: 'sealed-es-bb',
      product: {
        id: 'sealed-es-bb',
        name: 'Sword & Shield Evolving Skies Booster Box',
        type: 'Booster Box',
        language: 'English',
        set: {
          id: 'swsh7',
          name: 'Evolving Skies',
          series: 'Sword & Shield',
          printedTotal: 203,
          total: 237,
          releaseDate: '2021/08/27',
          symbolUrl: 'https://images.pokemontcg.io/swsh7/symbol.png',
          logoUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
        },
        releaseDate: '2021-08-27',
        msrp: 143.64,
        marketPrice: 685.0,
        imageUrl: 'https://images.pokemontcg.io/swsh7/logo.png',
        packCount: 36,
      },
      quantity: 2,
      purchasePrice: 140.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2021-09-05',
      condition: 'Acrylic Cased',
      notes: 'Factory sealed case pull in 35pt UV magnetic display acrylic',
      isSold: false,
    },
    {
      id: 'showcase-sealed-2',
      ownerId: ownerUid,
      productId: 'sealed-151-upc',
      product: {
        id: 'sealed-151-upc',
        name: 'Scarlet & Violet 151 Ultra-Premium Collection (UPC)',
        type: 'Collection Box',
        language: 'English',
        set: {
          id: 'sv3pt5',
          name: '151',
          series: 'Scarlet & Violet',
          printedTotal: 165,
          total: 207,
          releaseDate: '2023/09/22',
          symbolUrl: 'https://images.pokemontcg.io/sv3pt5/symbol.png',
          logoUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
        },
        releaseDate: '2023-10-06',
        msrp: 119.99,
        marketPrice: 165.0,
        imageUrl: 'https://images.pokemontcg.io/sv3pt5/logo.png',
        packCount: 16,
      },
      quantity: 3,
      purchasePrice: 105.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2023-10-10',
      condition: 'Factory Sealed',
      notes: 'Includes Mew metal promo card untouched in clean shrink',
      isSold: false,
    },
    {
      id: 'showcase-sealed-3',
      ownerId: ownerUid,
      productId: 'sealed-cz-pc-etb',
      product: {
        id: 'sealed-cz-pc-etb',
        name: 'Crown Zenith Pokémon Center Exclusive Elite Trainer Box',
        type: 'Elite Trainer Box',
        language: 'English',
        set: {
          id: 'swsh12pt5',
          name: 'Crown Zenith',
          series: 'Sword & Shield',
          printedTotal: 159,
          total: 230,
          releaseDate: '2023/01/20',
          symbolUrl: 'https://images.pokemontcg.io/swsh12pt5/symbol.png',
          logoUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
        },
        releaseDate: '2023-01-20',
        msrp: 64.99,
        marketPrice: 125.0,
        imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
        packCount: 12,
      },
      quantity: 2,
      purchasePrice: 65.0,
      purchaseCurrency: 'USD',
      purchaseDate: '2023-01-25',
      condition: 'Acrylic Cased',
      notes: 'Pokémon Center exclusive Lucario promo stamped edition',
      isSold: false,
    },
  ];
}

// 4. Build Showcase Custom Lists
export function generateShowcaseCustomLists(ownerUid: string): CustomList[] {
  return [
    {
      id: 'showcase-list-1',
      ownerId: ownerUid,
      name: 'High-Priority Alt Art Wishlist',
      description: 'Chasing pristine raw copies for next PSA grading submission batch.',
      cardIds: ['swsh7-215', 'swsh8-271', 'swsh11-186', 'sv3pt5-199'],
      coverImageUrl: 'https://images.pokemontcg.io/swsh7/215.png',
      createdAt: '2026-03-01T08:00:00.000Z',
    },
    {
      id: 'showcase-list-2',
      ownerId: ownerUid,
      name: 'Local League Trade Binder Inventory',
      description: 'Modern SIR hits available for trade matching TCGPlayer market values.',
      cardIds: ['sv3pt5-200', 'sv3pt5-198', 'sv4pt5-232', 'sv2-269'],
      coverImageUrl: 'https://images.pokemontcg.io/sv3pt5/200.png',
      createdAt: '2026-04-15T11:30:00.000Z',
    },
  ];
}
