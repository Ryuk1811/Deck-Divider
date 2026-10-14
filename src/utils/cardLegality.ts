export interface CardLegalityResult {
  regulationMark: string;
  isStandardLegal: boolean;
  statusLabel: string;
  reprintNote?: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';
}

/**
 * Single source of truth for Pokémon TCG Regulation Mark & Standard format legality
 * Standard format 2026-2027 season (Effective April 10, 2026) permits Regulation Marks H, I, J.
 * Mark G rotated out on April 10, 2026 (Play! Pokémon) / March 26, 2026 (PTCGL).
 * Cards bearing Mark G remain Standard legal if an identical English name and text card exists with Mark H or later.
 */
export function evaluateCardLegality(
  cardName: string,
  cardIdOrSet: string = '',
  supertype: string = ''
): CardLegalityResult {
  const normName = (cardName || '').toLowerCase().trim();
  const normId = (cardIdOrSet || '').toLowerCase().trim();
  const normSuper = (supertype || '').toLowerCase().trim();

  // 1. Basic Energy cards are perpetual and exempt from regulation marks
  if (
    normSuper.includes('energy') &&
    (normName.includes('basic') || normId.startsWith('sv01-09') || normId.includes('sve'))
  ) {
    return {
      regulationMark: 'Basic Energy',
      isStandardLegal: true,
      statusLabel: 'Perpetual Standard Legal',
      reprintNote: 'Basic Energy is exempt from regulation mark rotation',
      badgeColor: 'emerald',
    };
  }

  // 2. Regulation Mark J (sv10 Destined Rivals and future sets)
  if (normId.startsWith('sv10') || normId.includes('destined rivals')) {
    return {
      regulationMark: 'Mark J',
      isStandardLegal: true,
      statusLabel: 'Standard Legal (Mark J)',
      badgeColor: 'emerald',
    };
  }

  // 3. Regulation Mark I (sv09 Journey Together)
  if (normId.startsWith('sv09') || normId.includes('journey together')) {
    return {
      regulationMark: 'Mark I',
      isStandardLegal: true,
      statusLabel: 'Standard Legal (Mark I)',
      badgeColor: 'emerald',
    };
  }

  // 4. Regulation Mark H (sv05, sv06, sv06pt5, sv07, sv08, sv08pt5)
  if (
    normId.startsWith('sv05') ||
    normId.startsWith('sv06') ||
    normId.startsWith('sv07') ||
    normId.startsWith('sv08') ||
    normId.includes('temporal forces') ||
    normId.includes('twilight masquerade') ||
    normId.includes('shrouded fable') ||
    normId.includes('stellar crown') ||
    normId.includes('surging sparks') ||
    normId.includes('prismatic evolutions')
  ) {
    return {
      regulationMark: 'Mark H',
      isStandardLegal: true,
      statusLabel: 'Standard Legal (Mark H)',
      badgeColor: 'emerald',
    };
  }

  // 5. Regulation Mark G with verified H+ reprint
  // These cards originated in Mark G (sv01 - sv04), but possess an official identical-name H+ print
  const knownHReprintCards = [
    'ultra ball',
    'nest ball',
    'rare candy',
    'super rod',
    'counter catcher',
    'earthen vessel',
    'arven',
    'iono',
    "professor's research",
    "boss's orders",
    'bravery charm',
    'switch',
    'energy search',
    'energy retrieval',
    'super energy retrieval',
    'pal pad',
    'pokégear 3.0',
    'judge',
    'jacq',
    'gardevoir ex',
    'kirlia',
    'ralts',
    'drifloon',
    'scream tail',
    'flutter mane',
    'charizard ex',
    'pidgeot ex',
    'pidgey',
    'charmander',
    'charmeleon',
    'miraidon ex',
    'iron hands ex',
    'electric generator',
    'gholdengo ex',
    'gimmighoul',
    'roaring moon ex',
  ];

  const hasHReprint = knownHReprintCards.some(k => normName.includes(k));

  if (
    normId.startsWith('sv01') ||
    normId.startsWith('sv02') ||
    normId.startsWith('sv03') ||
    normId.startsWith('sv04') ||
    normId.includes('scarlet & violet') ||
    normId.includes('paldea evolved') ||
    normId.includes('obsidian flames') ||
    normId.includes('151') ||
    normId.includes('paradox rift') ||
    normId.includes('paldean fates')
  ) {
    if (hasHReprint) {
      return {
        regulationMark: 'Mark G',
        isStandardLegal: true,
        statusLabel: 'Legal via H+ Reprint',
        reprintNote: 'Identical print active in Regulation Mark H (Play! Pokémon rulebook §2.4)',
        badgeColor: 'blue',
      };
    }

    return {
      regulationMark: 'Mark G',
      isStandardLegal: false,
      statusLabel: 'Rotated (Expanded Only)',
      reprintNote: 'Mark G rotated out April 10, 2026; no active H+ reprint',
      badgeColor: 'amber',
    };
  }

  // 6. Rotated vintage eras (Sword & Shield Mark F, E, D and earlier)
  const isMarkF =
    normId.startsWith('swsh10') ||
    normId.startsWith('swsh11') ||
    normId.startsWith('swsh12') ||
    normId.includes('silver tempest') ||
    normId.includes('lost origin') ||
    normId.includes('astral radiance') ||
    normId.includes('brilliant stars') ||
    normId.includes('crown zenith');

  return {
    regulationMark: isMarkF ? 'Mark F' : 'Expanded/Vintage',
    isStandardLegal: false,
    statusLabel: 'Expanded Format (Rotated)',
    reprintNote: 'Rotated from Standard; legal in Expanded & GLC',
    badgeColor: 'rose',
  };
}
