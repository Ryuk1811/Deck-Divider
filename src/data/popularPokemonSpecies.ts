/**
 * Canonical Featured Pokémon Species for Programmatic SEO Hubs
 * Curated list of the most searched, collected, and iconic Pokémon in TCG history.
 */

export interface PopularSpeciesInfo {
  name: string;
  slug: string;
  dexNumber: number;
  category: string;
  types: string[];
  generation: string;
  searchVolumeTier: 'High' | 'Mega' | 'Ultra';
  description: string;
  keyCards: string[];
  colorHex: string;
}

export const POPULAR_POKEMON_SPECIES: PopularSpeciesInfo[] = [
  {
    name: 'Charizard',
    slug: 'charizard',
    dexNumber: 6,
    category: 'Flame Pokémon',
    types: ['Fire', 'Flying'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'Ultra',
    description: 'The undisputed flagship chase Pokémon of the Trading Card Game. From 1st Edition Base Set shadowless holos to modern Special Illustration Rares, Charizard cards consistently command the highest market premiums in the hobby.',
    keyCards: ['Base Set Holo #4', 'Shining Charizard #107', 'Charizard Gold Star #100', '151 Special Illustration Rare #199', 'Paldean Fates Shiny SAR #234'],
    colorHex: '#EA580C',
  },
  {
    name: 'Pikachu',
    slug: 'pikachu',
    dexNumber: 25,
    category: 'Mouse Pokémon',
    types: ['Electric'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'Ultra',
    description: 'The worldwide mascot of Pokémon with over 200 distinct TCG printings, exclusive Japanese promos, Illustrator grails, and modern Illustration Rares spanning three decades of trading card history.',
    keyCards: ['Illustrator Pikachu', 'Birthday Pikachu Promo', 'Pikachu Gold Star #104', 'Crown Zenith Secret Rare #160', 'Surging Sparks Special Illustration Rare'],
    colorHex: '#EAB308',
  },
  {
    name: 'Mewtwo',
    slug: 'mewtwo',
    dexNumber: 150,
    category: 'Genetic Pokémon',
    types: ['Psychic'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'Mega',
    description: 'The legendary clone Pokémon and icon of competitive play and vintage collecting. Known for legendary cards including Shining Mewtwo, Mewtwo Gold Star, and the iconic "Mewtube" GX Secret Rare from Shining Legends.',
    keyCards: ['Base Set Holo #10', 'Shining Mewtwo #109', 'Mewtwo Gold Star #103', 'Shining Legends "Mewtube" GX #78', 'Pokémon GO VSTAR Alternate Art'],
    colorHex: '#A855F7',
  },
  {
    name: 'Eevee',
    slug: 'eevee',
    dexNumber: 133,
    category: 'Evolution Pokémon',
    types: ['Normal'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'Mega',
    description: 'The beloved evolution Pokémon with eight distinct evolutions ("Eeveelutions"). A massive focal point for master set binders, character art rares, and dedicated character collector communities worldwide.',
    keyCards: ['Eevee Gold Star Promo', 'Twilight Masquerade Illustration Rare #188', 'Prismatic Evolutions Special Illustration Rare', 'Hidden Fates Shiny Vault'],
    colorHex: '#B45309',
  },
  {
    name: 'Umbreon',
    slug: 'umbreon',
    dexNumber: 197,
    category: 'Moonlight Pokémon',
    types: ['Dark'],
    generation: 'Gen 2 (Johto)',
    searchVolumeTier: 'Ultra',
    description: 'The dark-type Eeveelution and centerpiece of modern TCG market growth. Features the legendary Evolving Skies "Moonbreon" Alternate Art VMAX—widely recognized as the defining modern chase card.',
    keyCards: ['Neo Discovery Holo #13', 'Umbreon Gold Star POP Series 5', 'Evolving Skies "Moonbreon" VMAX Alt Art #215', 'Prismatic Evolutions SAR'],
    colorHex: '#1E1B4B',
  },
  {
    name: 'Gengar',
    slug: 'gengar',
    dexNumber: 94,
    category: 'Shadow Pokémon',
    types: ['Ghost', 'Poison'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'Mega',
    description: 'The premier Ghost-type fan favorite with some of the most sought-after vintage holos and modern alternate arts in the entire trading card game, led by the Fusion Strike Gengar VMAX Alt Art.',
    keyCards: ['Fossil Holo #5', 'Sabrina Gengar Gym Challenge', 'Skyridge Holo #H9', 'Gengar & Mimikyu GX Alt Art', 'Fusion Strike Gengar VMAX Alt Art #271'],
    colorHex: '#7E22CE',
  },
  {
    name: 'Rayquaza',
    slug: 'rayquaza',
    dexNumber: 384,
    category: 'Sky High Pokémon',
    types: ['Dragon', 'Flying'],
    generation: 'Gen 3 (Hoenn)',
    searchVolumeTier: 'Mega',
    description: 'The ozone dragon legendary commanding iconic grails from EX Deoxys Gold Star to modern Evolving Skies Alternate Art VMAXes and Crown Zenith Galarian Gallery highlights.',
    keyCards: ['EX Deoxys Gold Star #107', 'Call of Legends Shiny SL10', 'Roaring Skies Mega Rayquaza EX #105', 'Evolving Skies Rayquaza VMAX Alt Art #218'],
    colorHex: '#059669',
  },
  {
    name: 'Lugia',
    slug: 'lugia',
    dexNumber: 249,
    category: 'Diving Pokémon',
    types: ['Psychic', 'Flying'],
    generation: 'Gen 2 (Johto)',
    searchVolumeTier: 'Mega',
    description: 'The legendary bird guardian of the seas and cover star of Neo Genesis. Revered for the vintage 1st Edition Neo Genesis Holo #9 and the modern Silver Tempest Alternate Art V.',
    keyCards: ['Neo Genesis 1st Edition #9', 'EX Unseen Forces Lugia ex #105', 'Plasma Gale Lugia EX #108', 'Silver Tempest Lugia V Alternate Art #186'],
    colorHex: '#3B82F6',
  },
  {
    name: 'Blastoise',
    slug: 'blastoise',
    dexNumber: 9,
    category: 'Shellfish Pokémon',
    types: ['Water'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'High',
    description: 'Original Blue version mascot with a legendary collector following. Known for the iconic Base Set Holo #2 and the stunning 151 Special Illustration Rare featuring deep underwater diving art.',
    keyCards: ['Base Set Holo #2', 'Expedition Holo #4', 'Dark Blastoise 1st Edition', '151 Special Illustration Rare #200'],
    colorHex: '#0284C7',
  },
  {
    name: 'Venusaur',
    slug: 'venusaur',
    dexNumber: 3,
    category: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'High',
    description: 'The original Grass-type starter final evolution. Highlights include the legendary Base Set Holo #15 and the rich jungle-themed 151 Special Illustration Rare.',
    keyCards: ['Base Set Holo #15', 'Expedition Holo #30', 'Erika Venusaur Gym Challenge', '151 Special Illustration Rare #198'],
    colorHex: '#16A34A',
  },
  {
    name: 'Giratina',
    slug: 'giratina',
    dexNumber: 487,
    category: 'Renegade Pokémon',
    types: ['Ghost', 'Dragon'],
    generation: 'Gen 4 (Sinnoh)',
    searchVolumeTier: 'High',
    description: 'Ruler of the Distortion World and owner of one of modern TCG history\'s most breathtaking and expensive alternate arts: the Lost Origin Giratina V Alternate Art #186 by Shinji Kanda.',
    keyCards: ['Platinum Holo #10', 'Lost Origin Giratina V Alternate Art #186', 'Crown Zenith Giratina VSTAR Gold Gallery #GG69'],
    colorHex: '#475569',
  },
  {
    name: 'Mew',
    slug: 'mew',
    dexNumber: 151,
    category: 'New Species Pokémon',
    types: ['Psychic'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'High',
    description: 'The mythical ancestor of all Pokémon with numerous beloved promos, Southern Islands artwork, EX Dragon Frontiers Gold Star, and the ultra-rare Paldean Fates "Bubble Mew" Special Illustration Rare.',
    keyCards: ['Ancient Mew Promo', 'Mew Gold Star #101', 'Fusion Strike Mew VMAX Alt Art #269', 'Paldean Fates "Bubble Mew" ex SAR #232'],
    colorHex: '#EC4899',
  },
  {
    name: 'Dragonite',
    slug: 'dragonite',
    dexNumber: 149,
    category: 'Dragon Pokémon',
    types: ['Dragon', 'Flying'],
    generation: 'Gen 1 (Kanto)',
    searchVolumeTier: 'High',
    description: 'The friendly original pseudo-legendary dragon with celebrated vintage cards like Fossil 1st Edition Holo and the peaceful sleeping Dragonite V Alternate Art from Evolving Skies.',
    keyCards: ['Fossil 1st Edition Holo #4', 'Dark Dragonite Team Rocket', 'Delta Species Dragonite ex', 'Evolving Skies Dragonite V Alt Art #192'],
    colorHex: '#D97706',
  },
  {
    name: 'Mimikyu',
    slug: 'mimikyu',
    dexNumber: 778,
    category: 'Disguise Pokémon',
    types: ['Ghost', 'Fairy'],
    generation: 'Gen 7 (Alola)',
    searchVolumeTier: 'High',
    description: 'The disguise Pokémon with one of the most passionate cult followings in modern Pokémon. Famous for character art rares with Acerola and Special Illustration Rares in Paldean Fates.',
    keyCards: ['Dream League Character Rare', 'Cosmic Eclipse Character Secret Rare', 'Paldean Fates Illustration Rare', 'Gengar & Mimikyu GX Tag Team'],
    colorHex: '#854D0E',
  },
];

export function getSpeciesBySlug(slug: string): PopularSpeciesInfo | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return POPULAR_POKEMON_SPECIES.find((s) => s.slug === clean || s.name.toLowerCase() === clean);
}
