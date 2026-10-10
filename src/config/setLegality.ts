export interface SetLegalityInfo {
  setId: string;
  name: string;
  series: string;
  regulationMark: string;
  tournamentLegality: string;
  isStandardLegal: boolean;
  standardSeason: string;
  formats: string[];
}

export const SET_LEGALITY_MAP: Record<string, {
  regulationMark: string;
  isStandardLegal: boolean;
  tournamentLegality: string;
}> = {
  // Scarlet & Violet Mark J (Standard Legal 2026)
  'sv10': { regulationMark: 'Regulation Mark J', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },

  // Scarlet & Violet Mark I (Standard Legal 2026)
  'sv9': { regulationMark: 'Regulation Mark I', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  
  // Scarlet & Violet Mark H (Standard Legal 2026)
  'sv8pt5': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  'sv8': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  'sv7': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  'sv6pt5': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  'sv6': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },
  'sv5': { regulationMark: 'Regulation Mark H', isStandardLegal: true, tournamentLegality: 'Standard Legal (2026 Season: Marks H, I, J)' },

  // Scarlet & Violet Mark G (Rotated out of Standard in 2026 Season; Legal in Expanded & GLC)
  'sv4pt5': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },
  'sv4': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },
  'sv3pt5': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },
  'sv3': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },
  'sv2': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },
  'sv1': { regulationMark: 'Regulation Mark G', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard (2026: Marks H, I, J); Legal in Expanded & GLC' },

  // Sword & Shield Mark F & earlier (Rotated out of Standard; Legal in Expanded & GLC)
  'swsh12pt5': { regulationMark: 'Regulation Mark F', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh12': { regulationMark: 'Regulation Mark F', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh11': { regulationMark: 'Regulation Mark F', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh10': { regulationMark: 'Regulation Mark F', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh9': { regulationMark: 'Regulation Mark F', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh8': { regulationMark: 'Regulation Mark E', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh7': { regulationMark: 'Regulation Mark E', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh6': { regulationMark: 'Regulation Mark E', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh5': { regulationMark: 'Regulation Mark E', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh4': { regulationMark: 'Regulation Mark D', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh3': { regulationMark: 'Regulation Mark D', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh2': { regulationMark: 'Regulation Mark D', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
  'swsh1': { regulationMark: 'Regulation Mark D', isStandardLegal: false, tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC' },
};

export function getSetLegality(setId: string, seriesName?: string): {
  regulationMark: string;
  isStandardLegal: boolean;
  tournamentLegality: string;
  badgeColor: string;
  badgeTextColor: string;
  badgeBorderColor: string;
} {
  const rawId = (setId || '').toLowerCase().trim();
  const normalizedId = rawId.replace(/^([a-z]+)0+(\d+)/, '$1$2');
  const known = SET_LEGALITY_MAP[normalizedId] || SET_LEGALITY_MAP[rawId];
  if (known) {
    return {
      regulationMark: known.regulationMark,
      isStandardLegal: known.isStandardLegal,
      tournamentLegality: known.tournamentLegality,
      badgeColor: known.isStandardLegal ? '#F0FDF4' : '#FEF2F2',
      badgeTextColor: known.isStandardLegal ? '#15803D' : '#DC2626',
      badgeBorderColor: known.isStandardLegal ? '#BBF7D0' : '#FECDD3',
    };
  }

  // Fallback heuristics for vintage or other modern expansions
  const s = (seriesName || '').toLowerCase();
  if (s.includes('sword') || s.includes('shield')) {
    return {
      regulationMark: 'Regulation Mark D/E/F',
      isStandardLegal: false,
      tournamentLegality: 'Rotated Out of Standard; Legal in Expanded & GLC',
      badgeColor: '#FEF2F2',
      badgeTextColor: '#DC2626',
      badgeBorderColor: '#FECDD3',
    };
  }

  if (s.includes('sun') || s.includes('moon') || s.includes('xy') || s.includes('black') || s.includes('white')) {
    return {
      regulationMark: 'Pre-Regulation Era',
      isStandardLegal: false,
      tournamentLegality: 'Expanded Format & GLC Legal',
      badgeColor: '#EFF6FF',
      badgeTextColor: '#1D4ED8',
      badgeBorderColor: '#BFDBFE',
    };
  }

  if (s.includes('base') || s.includes('neo') || s.includes('e-card') || s.includes('ex') || s.includes('diamond') || s.includes('platinum') || s.includes('heartgold')) {
    return {
      regulationMark: 'Vintage Era',
      isStandardLegal: false,
      tournamentLegality: 'Unlimited / Casual Play Only',
      badgeColor: '#F8FAFC',
      badgeTextColor: '#475569',
      badgeBorderColor: '#E2E8F0',
    };
  }

  // Modern Scarlet & Violet default
  if (s.includes('scarlet') || s.includes('violet')) {
    return {
      regulationMark: 'Scarlet & Violet Era',
      isStandardLegal: false,
      tournamentLegality: 'Standard (Marks H, I, J) or Expanded (Mark G)',
      badgeColor: '#F0FDF4',
      badgeTextColor: '#15803D',
      badgeBorderColor: '#BBF7D0',
    };
  }

  return {
    regulationMark: 'Play! Pokémon',
    isStandardLegal: false,
    tournamentLegality: 'Standard 2026: Marks H, I, J Legal',
    badgeColor: '#F8FAFC',
    badgeTextColor: '#475569',
    badgeBorderColor: '#E2E8F0',
  };
}
