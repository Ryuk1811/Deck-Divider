export interface RawFallbackCard {
  id: string;
  localId: string;
  name: string;
  hp?: number;
  types?: string[];
  rarity?: string;
  illustrator?: string;
  image?: string;
  category?: string;
  stage?: string;
  regulationMark?: string;
  legal?: {
    standard?: boolean;
    expanded?: boolean;
  };
  variants?: {
    normal?: boolean;
    reverse?: boolean;
    holo?: boolean;
    firstEdition?: boolean;
    wPrerelease?: boolean;
    secret100?: boolean;
  };
  set?: {
    id: string;
    name: string;
    symbol?: string;
    logo?: string;
  };
}

export const FALLBACK_CARDS: RawFallbackCard[] = [
  {
    id: 'sv3pt5-199',
    localId: '199',
    name: 'Charizard ex',
    hp: 330,
    types: ['Fire', 'Dark'],
    rarity: 'Special Illustration Rare',
    illustrator: 'AKIRA EGAWA',
    image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv3pt5', name: '151' }
  },
  {
    id: 'sv3pt5-151',
    localId: '151',
    name: 'Mew ex',
    hp: 180,
    types: ['Psychic'],
    rarity: 'Ultra Rare',
    illustrator: 'USGMEN',
    image: 'https://images.pokemontcg.io/sv3pt5/151_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv3pt5', name: '151' }
  },
  {
    id: 'sv3pt5-025',
    localId: '025',
    name: 'Pikachu',
    hp: 60,
    types: ['Lightning'],
    rarity: 'Illustration Rare',
    illustrator: 'Hiroyuki Yamamoto',
    image: 'https://images.pokemontcg.io/sv3pt5/25_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true, reverse: true },
    set: { id: 'sv3pt5', name: '151' }
  },
  {
    id: 'sv4-182',
    localId: '182',
    name: 'Roaring Moon ex',
    hp: 230,
    types: ['Dark'],
    rarity: 'Special Illustration Rare',
    illustrator: 'ryoma uratsuka',
    image: 'https://images.pokemontcg.io/sv4/182_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv4', name: 'Paradox Rift' }
  },
  {
    id: 'sv4-251',
    localId: '251',
    name: 'Iron Valiant ex',
    hp: 220,
    types: ['Psychic'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Teeziro',
    image: 'https://images.pokemontcg.io/sv4/251_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv4', name: 'Paradox Rift' }
  },
  {
    id: 'sv1-086',
    localId: '086',
    name: 'Gardevoir ex',
    hp: 310,
    types: ['Psychic'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Jiro Sasumo',
    image: 'https://images.pokemontcg.io/sv1/86_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv1', name: 'Scarlet & Violet' }
  },
  {
    id: 'sv1-185',
    localId: '185',
    name: "Professor's Research",
    rarity: 'Ultra Rare',
    illustrator: 'kirisAki',
    image: 'https://images.pokemontcg.io/sv1/185_hires.png',
    category: 'Trainer',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv1', name: 'Scarlet & Violet' }
  },
  {
    id: 'sv2-185',
    localId: '185',
    name: 'Iono',
    rarity: 'Special Illustration Rare',
    illustrator: 'kirisAki',
    image: 'https://images.pokemontcg.io/sv2/185_hires.png',
    category: 'Trainer',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv2', name: 'Paldea Evolved' }
  },
  {
    id: 'sv2-269',
    localId: '269',
    name: 'Chien-Pao ex',
    hp: 220,
    types: ['Water'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Shinji Kanda',
    image: 'https://images.pokemontcg.io/sv2/269_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv2', name: 'Paldea Evolved' }
  },
  {
    id: 'swsh12-186',
    localId: '186',
    name: 'Lugia V',
    hp: 220,
    types: ['Colorless'],
    rarity: 'Alternate Art',
    illustrator: 'kawayoo',
    image: 'https://images.pokemontcg.io/swsh12/186_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'F',
    legal: { standard: false, expanded: true },
    variants: { holo: true },
    set: { id: 'swsh12', name: 'Silver Tempest' }
  },
  {
    id: 'swsh11-177',
    localId: '177',
    name: 'Giratina V',
    hp: 220,
    types: ['Dragon'],
    rarity: 'Alternate Art',
    illustrator: 'Shinji Kanda',
    image: 'https://images.pokemontcg.io/swsh11/177_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'F',
    legal: { standard: false, expanded: true },
    variants: { holo: true },
    set: { id: 'swsh11', name: 'Lost Origin' }
  },
  {
    id: 'base1-4',
    localId: '4',
    name: 'Charizard',
    hp: 120,
    types: ['Fire'],
    rarity: 'Rare Holo',
    illustrator: 'Mitsuhiro Arita',
    image: 'https://images.pokemontcg.io/base1/4_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    legal: { standard: false, expanded: false },
    variants: { holo: true, firstEdition: true },
    set: { id: 'base1', name: 'Base Set' }
  },
  {
    id: 'base1-15',
    localId: '15',
    name: 'Venusaur',
    hp: 100,
    types: ['Grass'],
    rarity: 'Rare Holo',
    illustrator: 'Mitsuhiro Arita',
    image: 'https://images.pokemontcg.io/base1/15_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    legal: { standard: false, expanded: false },
    variants: { holo: true, firstEdition: true },
    set: { id: 'base1', name: 'Base Set' }
  },
  {
    id: 'base1-2',
    localId: '2',
    name: 'Blastoise',
    hp: 100,
    types: ['Water'],
    rarity: 'Rare Holo',
    illustrator: 'Ken Sugimori',
    image: 'https://images.pokemontcg.io/base1/2_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    legal: { standard: false, expanded: false },
    variants: { holo: true, firstEdition: true },
    set: { id: 'base1', name: 'Base Set' }
  },
  {
    id: 'swsh7-215',
    localId: '215',
    name: 'Umbreon VMAX',
    hp: 310,
    types: ['Dark'],
    rarity: 'Alternate Art',
    illustrator: 'KEIICHIRO ITO',
    image: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    category: 'Pokémon',
    stage: 'VMAX',
    regulationMark: 'E',
    legal: { standard: false, expanded: true },
    variants: { holo: true, secret100: true },
    set: { id: 'swsh7', name: 'Evolving Skies' }
  },
  {
    id: 'swsh8-271',
    localId: '271',
    name: 'Gengar VMAX',
    hp: 320,
    types: ['Dark'],
    rarity: 'Alternate Art',
    illustrator: 'sowsow',
    image: 'https://images.pokemontcg.io/swsh8/271_hires.png',
    category: 'Pokémon',
    stage: 'VMAX',
    regulationMark: 'E',
    legal: { standard: false, expanded: true },
    variants: { holo: true, secret100: true },
    set: { id: 'swsh8', name: 'Fusion Strike' }
  },
  {
    id: 'sv4pt5-232',
    localId: '232',
    name: 'Mew ex',
    hp: 180,
    types: ['Psychic'],
    rarity: 'Special Illustration Rare',
    illustrator: 'USGMEN',
    image: 'https://images.pokemontcg.io/sv4pt5/232_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv4pt5', name: 'Paldean Fates' }
  },
  {
    id: 'svp-085',
    localId: '085',
    name: 'Pikachu with Grey Felt Hat',
    hp: 60,
    types: ['Lightning'],
    rarity: 'Promo',
    illustrator: 'Naoyo Kimura',
    image: 'https://images.pokemontcg.io/svp/085_hires.png',
    category: 'Pokémon',
    stage: 'Basic',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'svp', name: 'Scarlet & Violet Promos' }
  },
  {
    id: 'sv3pt5-200',
    localId: '200',
    name: 'Blastoise ex',
    hp: 330,
    types: ['Water'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Mitsuhiro Arita',
    image: 'https://images.pokemontcg.io/sv3pt5/200_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv3pt5', name: '151' }
  },
  {
    id: 'sv3pt5-198',
    localId: '198',
    name: 'Venusaur ex',
    hp: 340,
    types: ['Grass'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Yuu Nishida',
    image: 'https://images.pokemontcg.io/sv3pt5/198_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv3pt5', name: '151' }
  },
  {
    id: 'sv3-225',
    localId: '225',
    name: 'Pidgeot ex',
    hp: 280,
    types: ['Colorless'],
    rarity: 'Special Illustration Rare',
    illustrator: 'Jerky',
    image: 'https://images.pokemontcg.io/sv3/225_hires.png',
    category: 'Pokémon',
    stage: 'Stage 2',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv3', name: 'Obsidian Flames' }
  },
  {
    id: 'sv5-157',
    localId: '157',
    name: 'Prime Catcher',
    rarity: 'ACE SPEC Rare',
    illustrator: 'Toyste Beach',
    image: 'https://images.pokemontcg.io/sv5/157_hires.png',
    category: 'Trainer',
    regulationMark: 'H',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv5', name: 'Temporal Forces' }
  },
  {
    id: 'sv1-249',
    localId: '249',
    name: 'Arven',
    rarity: 'Special Illustration Rare',
    illustrator: 'GOSSAN',
    image: 'https://images.pokemontcg.io/sv1/249_hires.png',
    category: 'Trainer',
    regulationMark: 'G',
    legal: { standard: true, expanded: true },
    variants: { holo: true },
    set: { id: 'sv1', name: 'Scarlet & Violet' }
  }
];
