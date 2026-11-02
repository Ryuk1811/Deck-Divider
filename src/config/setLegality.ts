export interface SetEraInfo {
  setId: string;
  name: string;
  series: string;
  regulationMark: string;
  eraDescription: string;
  isModernEra: boolean;
  standardSeason?: string;
  formats?: string[];
}

export const SET_ERA_MAP: Record<string, {
  regulationMark: string;
  isModernEra: boolean;
  eraDescription: string;
}> = {
  // Scarlet & Violet Mark J
  'sv10': { regulationMark: 'Regulation Mark J', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },

  // Scarlet & Violet Mark I
  'sv9': { regulationMark: 'Regulation Mark I', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  
  // Scarlet & Violet Mark H
  'sv8pt5': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  'sv8': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  'sv7': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  'sv6pt5': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  'sv6': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },
  'sv5': { regulationMark: 'Regulation Mark H', isModernEra: true, eraDescription: 'Modern Scarlet & Violet Era' },

  // Scarlet & Violet Mark G
  'sv4pt5': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },
  'sv4': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },
  'sv3pt5': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },
  'sv3': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },
  'sv2': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },
  'sv1': { regulationMark: 'Regulation Mark G', isModernEra: true, eraDescription: 'Early Scarlet & Violet Era' },

  // Sword & Shield Mark F & earlier
  'swsh12pt5': { regulationMark: 'Regulation Mark F', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh12': { regulationMark: 'Regulation Mark F', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh11': { regulationMark: 'Regulation Mark F', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh10': { regulationMark: 'Regulation Mark F', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh9': { regulationMark: 'Regulation Mark F', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh8': { regulationMark: 'Regulation Mark E', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh7': { regulationMark: 'Regulation Mark E', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh6': { regulationMark: 'Regulation Mark E', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh5': { regulationMark: 'Regulation Mark E', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh4': { regulationMark: 'Regulation Mark D', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh3': { regulationMark: 'Regulation Mark D', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh2': { regulationMark: 'Regulation Mark D', isModernEra: false, eraDescription: 'Sword & Shield Era' },
  'swsh1': { regulationMark: 'Regulation Mark D', isModernEra: false, eraDescription: 'Sword & Shield Era' },
};

export function getSetEraInfo(setId: string, seriesName?: string): {
  regulationMark: string;
  isModernEra: boolean;
  eraDescription: string;
  badgeColor: string;
  badgeTextColor: string;
  badgeBorderColor: string;
} {
  const rawId = (setId || '').toLowerCase().trim();
  const normalizedId = rawId.replace(/^([a-z]+)0+(\d+)/, '$1$2');
  const known = SET_ERA_MAP[normalizedId] || SET_ERA_MAP[rawId];
  if (known) {
    return {
      regulationMark: known.regulationMark,
      isModernEra: known.isModernEra,
      eraDescription: known.eraDescription,
      badgeColor: known.isModernEra ? '#F0FDF4' : '#F8FAFC',
      badgeTextColor: known.isModernEra ? '#15803D' : '#475569',
      badgeBorderColor: known.isModernEra ? '#BBF7D0' : '#E2E8F0',
    };
  }

  // Fallback heuristics for vintage or other modern expansions
  const s = (seriesName || '').toLowerCase();
  if (s.includes('sword') || s.includes('shield')) {
    return {
      regulationMark: 'Regulation Mark D/E/F',
      isModernEra: false,
      eraDescription: 'Sword & Shield Era',
      badgeColor: '#F8FAFC',
      badgeTextColor: '#475569',
      badgeBorderColor: '#E2E8F0',
    };
  }

  if (s.includes('sun') || s.includes('moon') || s.includes('xy') || s.includes('black') || s.includes('white')) {
    return {
      regulationMark: 'Pre-Regulation Era',
      isModernEra: false,
      eraDescription: 'Mid-Era Collection',
      badgeColor: '#EFF6FF',
      badgeTextColor: '#1D4ED8',
      badgeBorderColor: '#BFDBFE',
    };
  }

  if (s.includes('base') || s.includes('neo') || s.includes('e-card') || s.includes('ex') || s.includes('diamond') || s.includes('platinum') || s.includes('heartgold')) {
    return {
      regulationMark: 'Vintage Era',
      isModernEra: false,
      eraDescription: 'Vintage Heritage Era',
      badgeColor: '#F8FAFC',
      badgeTextColor: '#475569',
      badgeBorderColor: '#E2E8F0',
    };
  }

  // Modern Scarlet & Violet default
  if (s.includes('scarlet') || s.includes('violet')) {
    return {
      regulationMark: 'Scarlet & Violet Era',
      isModernEra: true,
      eraDescription: 'Modern Collection Era',
      badgeColor: '#F0FDF4',
      badgeTextColor: '#15803D',
      badgeBorderColor: '#BBF7D0',
    };
  }

  return {
    regulationMark: 'Collection Era',
    isModernEra: false,
    eraDescription: 'General TCG Era',
    badgeColor: '#F8FAFC',
    badgeTextColor: '#475569',
    badgeBorderColor: '#E2E8F0',
  };
}
