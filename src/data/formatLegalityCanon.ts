/**
 * Canonical Play! Pokémon Tournament Formats & Legality Rules
 * Single source of truth for DECK / divider
 */

export interface FormatRuleDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  activeMarks: string[];
  rotatedMarks: string[];
  effectiveDate: string;
  ptcglRotationDate: string;
  inPersonRotationDate: string;
  allowedCardPool: string;
  deckConstructionRules: string[];
  reprintRuleNote: string;
}

export const CANONICAL_FORMATS: Record<string, FormatRuleDefinition> = {
  standard: {
    id: 'standard',
    name: 'Standard Format (2026 Season)',
    subtitle: 'Regulation Marks H, I & J',
    description:
      'The premier official tournament format for Play! Pokémon championships and Pokémon TCG Live. The format permits cards bearing Regulation Marks H, I, or J.',
    activeMarks: ['H', 'I', 'J'],
    rotatedMarks: ['G', 'F', 'E', 'D'],
    effectiveDate: 'March 26, 2026',
    ptcglRotationDate: 'March 26, 2026',
    inPersonRotationDate: 'April 10, 2026',
    allowedCardPool:
      'All cards with Regulation Marks H, I, or J (located in the lower-left corner of the card). Regulation Mark G officially rotated out on March 26, 2026 (Pokémon TCG Live) and April 10, 2026 (Play! Pokémon in-person events).',
    deckConstructionRules: [
      'Exactly 60 cards per deck',
      'Maximum 4 copies of any card with the same name (except Basic Energy)',
      'Maximum 1 Radiant Pokémon per deck',
      'Maximum 1 ACE SPEC card per deck',
      'Cards must bear Regulation Mark H, I, or J',
    ],
    reprintRuleNote:
      'Older prints of cards without Regulation Mark H, I, or J are legal ONLY if the card has received an identical-text reprint in a set currently bearing Mark H, I, or J (e.g. Ultra Ball, Boss\'s Orders, Switch, Rare Candy).',
  },
  expanded: {
    id: 'expanded',
    name: 'Expanded Format',
    subtitle: 'Black & White (2011) to Present',
    description:
      'A deep, high-powered tournament format encompassing all cards from the Black & White expansion onwards, subject to official Play! Pokémon banlists.',
    activeMarks: ['All (Black & White onwards)'],
    rotatedMarks: [],
    effectiveDate: 'Ongoing',
    ptcglRotationDate: 'Sun & Moon onwards currently supported on PTCGL',
    inPersonRotationDate: 'Black & White onwards for official sanctioned events',
    allowedCardPool:
      'All cards released from Black & White (April 2011) through modern Scarlet & Violet expansions, minus the official banned list.',
    deckConstructionRules: [
      'Exactly 60 cards per deck',
      'Maximum 4 copies per card name (except Basic Energy)',
      'Subject to official Play! Pokémon Expanded format ban list',
    ],
    reprintRuleNote:
      'Cards from sets prior to Black & White may only be used if they were reprinted in Black & White or later with identical text.',
  },
  glc: {
    id: 'glc',
    name: 'Gym Leader Challenge (GLC)',
    subtitle: 'Singleton Mono-Type Grassroots Format',
    description:
      'A community-driven singleton format engineered by Tricky Gym. Decks must be mono-type and contain no Pokémon with a Rule Box.',
    activeMarks: ['All (Black & White onwards)'],
    rotatedMarks: [],
    effectiveDate: 'Community Standard',
    ptcglRotationDate: 'Casual custom match play',
    inPersonRotationDate: 'Grassroots tournament circuit',
    allowedCardPool:
      'All cards from Black & White (2011) to modern, excluding cards with a Rule Box (ex, V, VMAX, VSTAR, GX, EX, Radiant, Prism Star, ACE SPEC).',
    deckConstructionRules: [
      'Exactly 60 cards per deck',
      'Singleton rule: Exactly 1 copy of each card name (except Basic Energy)',
      'Mono-type: All Pokémon in the deck must share the exact same single energy type',
      'No Rule Box cards allowed anywhere in the deck',
    ],
    reprintRuleNote:
      'Cards must adhere to the official Gym Leader Challenge banlist (e.g. Lysandre\'s Trump Card, Oranguru UPR 114, Forest of Giant Plants).',
  },
};

export const CURRENT_STANDARD_MARKS = CANONICAL_FORMATS.standard.activeMarks;
export const ROTATED_STANDARD_MARKS = CANONICAL_FORMATS.standard.rotatedMarks;
export const STANDARD_ROTATION_SUMMARY =
  '2026 Play! Pokémon Standard format: Regulation Marks H, I, and J legal. Regulation Mark G rotated out on March 26, 2026 (Pokémon TCG Live) and April 10, 2026 (Play! Pokémon in-person championships).';
