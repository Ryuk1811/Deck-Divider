/**
 * Canonical Rarity & Artwork Classification Directory
 * Defines modern and vintage collector rarity tiers for programmatic SEO hubs.
 */

export interface RarityHubInfo {
  slug: string;
  name: string;
  acronym?: string;
  era: string;
  introductionYear: number;
  description: string;
  pullRateEstimate: string;
  typicalMarketRange: string;
  distinguishingFeatures: string[];
  notableCardExamples: Array<{ name: string; set: string; approxValue: number }>;
  colorHex: string;
}

export const POPULAR_RARITIES: RarityHubInfo[] = [
  {
    slug: 'special-illustration-rare',
    name: 'Special Illustration Rare',
    acronym: 'SAR / SIR',
    era: 'Scarlet & Violet (2023 - Present)',
    introductionYear: 2023,
    description: 'The pinnacle of modern Pokémon card collecting. Featuring breathtaking full-bleed artwork that tells a story across a triple-evolution line, textured holographic foil, and double gold star rarity symbols.',
    pullRateEstimate: 'Approx. 1 in 32 packs (~1 per booster box)',
    typicalMarketRange: '$25 - $250+',
    distinguishingFeatures: [
      'Full-bleed custom artist illustration expanding to the card borders',
      'Intricate microscopic holographic surface texture (fingerprint pattern)',
      'Double gold star rarity symbol (★★) in the lower left corner',
      'Depicts fully-evolved Pokémon ex, Legendary Pokémon, or prominent Supporters'
    ],
    notableCardExamples: [
      { name: 'Charizard ex #199', set: '151', approxValue: 125 },
      { name: 'Mew ex #232', set: 'Paldean Fates', approxValue: 95 },
      { name: 'Carmine #217', set: 'Twilight Masquerade', approxValue: 110 },
      { name: 'Greninja ex #214', set: 'Twilight Masquerade', approxValue: 240 },
    ],
    colorHex: '#D97706',
  },
  {
    slug: 'illustration-rare',
    name: 'Illustration Rare',
    acronym: 'AR / IR',
    era: 'Scarlet & Violet (2023 - Present)',
    introductionYear: 2023,
    description: 'Stunning full-art storybook cards designated by a single gold star symbol. Focuses on regular (non-rule box) Pokémon in their natural habitats or comedic moments.',
    pullRateEstimate: 'Approx. 1 in 12 packs (~3 per booster box)',
    typicalMarketRange: '$5 - $45',
    distinguishingFeatures: [
      'Full-art framing replacing standard borders',
      'Features basic and stage 1 Pokémon without rule boxes',
      'Single gold star rarity symbol (★) in the bottom-left corner',
      'Smooth foil or light shimmer finish without heavy fingerprint texture'
    ],
    notableCardExamples: [
      { name: 'Charmander #168', set: '151', approxValue: 32 },
      { name: 'Squirtle #170', set: '151', approxValue: 28 },
      { name: 'Bulbasaur #166', set: '151', approxValue: 26 },
      { name: 'Eevee #188', set: 'Twilight Masquerade', approxValue: 48 },
    ],
    colorHex: '#2563EB',
  },
  {
    slug: 'secret-rare',
    name: 'Hyper Rare / Gold Secret Rare',
    acronym: 'HR / Gold',
    era: 'Sun & Moon through Modern',
    introductionYear: 2017,
    description: 'Card numbers exceeding the set printed total (e.g. 205/197). Distinguished by shimmering gold foil borders, gold backgrounds, and triple gold star rarity markings.',
    pullRateEstimate: 'Approx. 1 in 54 packs (~1 per 1.5 booster boxes)',
    typicalMarketRange: '$12 - $80',
    distinguishingFeatures: [
      'Glittering gold foil borders and golden etched backdrop',
      'Numbered above the official printed set count',
      'Triple gold star (★★★) in Scarlet & Violet',
      'Includes Gold Items, Stadiums, Energies, and Legendary Pokémon'
    ],
    notableCardExamples: [
      { name: 'Ultra Ball Gold Secret #161', set: 'Sun & Moon Base', approxValue: 65 },
      { name: 'Gholdengo ex Hyper Rare #252', set: 'Paradox Rift', approxValue: 22 },
      { name: 'Pikachu ex Hyper Rare #254', set: 'Surging Sparks', approxValue: 75 },
    ],
    colorHex: '#CA8A04',
  },
  {
    slug: 'trainer-gallery',
    name: 'Trainer Gallery & Galarian Gallery',
    acronym: 'TG / GG',
    era: 'Sword & Shield (2022 - 2023)',
    introductionYear: 2022,
    description: 'A revolutionary subset found in Brilliant Stars, Astral Radiance, Lost Origin, Silver Tempest, and Crown Zenith. Features Pokémon bonding directly with their canonical trainers.',
    pullRateEstimate: 'Approx. 1 in 3 to 1 in 5 packs',
    typicalMarketRange: '$3 - $140',
    distinguishingFeatures: [
      'TG or GG local prefix before the card number',
      'Co-stars iconic trainers (Red, Cynthia, Leon, Acerola, Gloria) alongside Pokémon',
      'Replaces the reverse holo slot in pack openings',
      'Capped by Crown Zenith\'s magnificent 4 Gold Origin Forme Legendaries'
    ],
    notableCardExamples: [
      { name: 'Giratina VSTAR Gold #GG69', set: 'Crown Zenith', approxValue: 135 },
      { name: 'Umbreon VMAX TG23', set: 'Brilliant Stars', approxValue: 35 },
      { name: 'Gengar TG06', set: 'Lost Origin', approxValue: 12 },
    ],
    colorHex: '#7C3AED',
  },
  {
    slug: 'ultra-rare',
    name: 'Ultra Rare (Pokémon ex / Full Art)',
    acronym: 'UR / Full Art',
    era: 'Black & White through Modern',
    introductionYear: 2011,
    description: 'Modern double rare rule-box cards and etched Full Art Trainer and Pokémon cards with textured relief and metallic accents.',
    pullRateEstimate: 'Approx. 1 in 6 packs for regular ex; 1 in 18 for Full Art',
    typicalMarketRange: '$2 - $45',
    distinguishingFeatures: [
      'Distinctive Rule Box with multi-prize knockout penalty',
      'Textured holographic stamping on Full Art prints',
      'Double black star (★★) rarity indicator',
      'Core engine cards for championship tournament gameplay'
    ],
    notableCardExamples: [
      { name: 'Iono Full Art #254', set: 'Paldea Evolved', approxValue: 38 },
      { name: 'Roaring Moon ex Full Art #251', set: 'Paradox Rift', approxValue: 18 },
      { name: 'Professor Sada Vitality #256', set: 'Paradox Rift', approxValue: 14 },
    ],
    colorHex: '#DC143C',
  },
];

export function getRarityBySlug(slug: string): RarityHubInfo | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return POPULAR_RARITIES.find((r) => r.slug === clean);
}
