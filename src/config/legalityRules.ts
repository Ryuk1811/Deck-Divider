/**
 * Play! Pokémon Tournament Legality Engine & Rules
 * Enforces official 2026 Standard & Expanded format regulation marks and reprint verification.
 */

export const STANDARD_LEGAL_MARKS = ['H', 'I', 'J'] as const;
export type StandardLegalMark = typeof STANDARD_LEGAL_MARKS[number];

export const ROTATED_STANDARD_MARKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const STANDARD_FORMAT_METADATA = {
  season: '2026–2027 Season',
  effectiveDate: 'April 10, 2026',
  legalMarksSummary: 'Marks H, I, J and later',
  rotatedMarksSummary: 'Marks A through G rotated out of Standard (Legal in Expanded & GLC)',
  ruleDescription: 'A card printed with Regulation Mark G or earlier remains legal in Standard tournament play if an identical-name, identical-rule card has been reprinted in a Standard-legal expansion bearing Regulation Mark H or later.',
};

/**
 * Verified Reprint Dictionary
 * Maps cards originally printed in G (or earlier) to their verified Standard-legal H+ prints.
 */
export const VERIFIED_STANDARD_REPRINTS: Record<string, { legalMark: string; legalSets: string; currentPrints: string }> = {
  'Buddy-Buddy Poffin': { legalMark: 'H', legalSets: 'TEF', currentPrints: 'TEF 144, PRE 112' },
  'Super Rod': { legalMark: 'H', legalSets: 'PAL, SVI', currentPrints: 'PAL 188, PRE 120' },
  'Arven': { legalMark: 'H', legalSets: 'SVI, OBF', currentPrints: 'SVI 166, OBF 186, PAF 078' },
  'Iono': { legalMark: 'H', legalSets: 'PAL, PAF', currentPrints: 'PAL 185, PAF 080, PRE 115' },
  'Boss\'s Orders': { legalMark: 'H', legalSets: 'PAL', currentPrints: 'PAL 172' },
  'Rare Candy': { legalMark: 'H', legalSets: 'SVI, PAF', currentPrints: 'SVI 191, PAF 089, PRE 118' },
  'Ultra Ball': { legalMark: 'H', legalSets: 'SVI, PAF', currentPrints: 'SVI 196, PAF 091, PRE 122' },
  'Nest Ball': { legalMark: 'H', legalSets: 'SVI, PAF', currentPrints: 'SVI 181, PAF 084, PRE 117' },
  'Counter Catcher': { legalMark: 'H', legalSets: 'PAR', currentPrints: 'PAR 160' },
  'Earthen Vessel': { legalMark: 'H', legalSets: 'PAR', currentPrints: 'PAR 163' },
  'Ancient Booster Energy Capsule': { legalMark: 'H', legalSets: 'PAR', currentPrints: 'PAR 159' },
  'Future Booster Energy Capsule': { legalMark: 'H', legalSets: 'PAR', currentPrints: 'PAR 164' },
  'Techno Radar': { legalMark: 'H', legalSets: 'PAR', currentPrints: 'PAR 180' },
  'Professor\'s Research': { legalMark: 'H', legalSets: 'SVI, PAF', currentPrints: 'SVI 189, PAF 087' },
  'Switch': { legalMark: 'H', legalSets: 'SVI, MEW', currentPrints: 'SVI 194, MEW 160' },
  'Energy Search': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 172' },
  'Energy Retrieval': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 171' },
  'Artazon': { legalMark: 'H', legalSets: 'PAL, PAF', currentPrints: 'PAL 171, PAF 076' },
  'Mesagoza': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 178' },
  'Town Store': { legalMark: 'H', legalSets: 'OBF', currentPrints: 'OBF 196' },
  'Basic Psychic Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 005' },
  'Basic Darkness Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 007' },
  'Basic Water Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 003' },
  'Basic Grass Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 001' },
  'Basic Fire Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 002' },
  'Basic Lightning Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 004' },
  'Basic Fighting Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 006' },
  'Basic Metal Energy': { legalMark: 'H', legalSets: 'SVI', currentPrints: 'SVI 008' },
};

/**
 * Official Banned Cards List
 */
export const BANNED_CARDS_STANDARD: Array<{ name: string; reason: string }> = [
  // Currently no cards banned in the 2026 Standard format
];

export const BANNED_CARDS_EXPANDED: Array<{ name: string; print: string; reason: string }> = [
  { name: 'Archeops', print: 'Silver Tempest 147/195', reason: 'Unfair energy acceleration combo via Primal Turbo' },
  { name: 'Arceus & Dialga & Palkia-GX', print: 'Cosmic Eclipse 156/236', reason: 'Altered Creation GX distorts prize card pacing' },
  { name: 'Delinquent', print: 'BREAKpoint 98/122', reason: 'Unbalanced turn-1 hand disruption' },
  { name: 'Forest of Giant Plants', print: 'Ancient Origins 74/98', reason: 'Turn-1 Grass evolution engine degeneracy' },
  { name: 'Ghetsis', print: 'Plasma Freeze 101/116', reason: 'Unfair first-turn Item lock' },
  { name: 'Hex Maniac', print: 'Ancient Origins 75/98', reason: 'Universal Ability suppression' },
  { name: 'Island Challenge Amulet', print: 'Cosmic Eclipse 194/236', reason: 'Jirachi prize manipulation loops' },
  { name: 'Jesse & James', print: 'Hidden Fates 58/68', reason: 'Severe hand destruction combo with Weezing' },
  { name: 'Lt. Surge\'s Strategy', print: 'Unbroken Bonds 178/214', reason: 'Multi-Supporter turn chains' },
  { name: 'Lysandre\'s Trump Card', print: 'Phantom Forces 99/119', reason: 'Infinite deck recycling and stall loops' },
  { name: 'Marshadow', print: 'Shining Legends 45/73', reason: 'Let\'s Loose hand disruption' },
  { name: 'Milotic', print: 'Flashfire 23/106', reason: 'Energy Grace self-knockout disruption loops' },
  { name: 'Mismagius', print: 'Unbroken Bonds 78/214', reason: 'Dusk Stone prize manipulation loops' },
  { name: 'Oranguru', print: 'Ultra Prism 114/156', reason: 'Resource Management infinite recycle engine' },
  { name: 'Puzzle of Time', print: 'BREAKpoint 109/122', reason: 'Infinite Item retrieval loops' },
  { name: 'Red Card', print: 'XY 124/146', reason: 'Hand size reduction on turn 1' },
  { name: 'Reset Stamp', print: 'Unified Minds 206/236', reason: 'Late-game non-interactive hand lock' },
  { name: 'Scoop Up Net', print: 'Rebel Clash 165/192', reason: 'Unchecked Ability recycling' },
  { name: 'Shaymin-EX', print: 'Roaring Skies 77/108', reason: 'Set Up infinite draw loops' },
  { name: 'Team Flare Grunt', print: 'Generations 73/83', reason: 'Energy suppression engine' },
  { name: 'Unown (Damage)', print: 'Lost Thunder 90/214', reason: 'Alternate win condition combo' },
  { name: 'Unown (Farewell)', print: 'Lost Thunder 91/214', reason: 'Deck thinning degeneracy' },
  { name: 'Wally', print: 'Roaring Skies 94/108', reason: 'Turn 1 Trevenant Item lock evolution' },
];

/**
 * Determine card legality status for Standard
 */
export function verifyCardStandardLegality(cardName: string, printedMark?: string): {
  isStandardLegal: boolean;
  legalViaReprint: boolean;
  effectiveMark: string;
  reprintNote?: string;
} {
  const cleanName = cardName.trim();
  const mark = (printedMark || '').toUpperCase();

  // 1. If card has H, I, J directly, it is Standard Legal
  if (mark === 'H' || mark === 'I' || mark === 'J') {
    return {
      isStandardLegal: true,
      legalViaReprint: false,
      effectiveMark: mark,
    };
  }

  // 2. Check reprint dictionary
  const reprint = VERIFIED_STANDARD_REPRINTS[cleanName];
  if (reprint) {
    return {
      isStandardLegal: true,
      legalViaReprint: true,
      effectiveMark: reprint.legalMark,
      reprintNote: `Legal in Standard via ${reprint.legalSets} reprint (Mark ${reprint.legalMark})`,
    };
  }

  // 3. Otherwise rotated from Standard
  return {
    isStandardLegal: false,
    legalViaReprint: false,
    effectiveMark: mark || 'Rotated',
    reprintNote: 'Rotated out of Standard (Legal in Expanded & GLC)',
  };
}
