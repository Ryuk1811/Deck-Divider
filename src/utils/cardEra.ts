export interface CardEraResult {
  eraLabel: string;
  classification: 'Modern' | 'Mid-Era' | 'Vintage' | 'Classic';
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';
  description?: string;
}

/**
 * Single source of truth for Pokémon TCG Era classification
 * Focuses on historical periods rather than competitive tournament legality.
 */
export function evaluateCardEra(
  cardName: string,
  cardIdOrSet: string = '',
  supertype: string = ''
): CardEraResult {
  const normName = (cardName || '').toLowerCase().trim();
  const normId = (cardIdOrSet || '').toLowerCase().trim();
  const normSuper = (supertype || '').toLowerCase().trim();

  // 1. Basic Energy
  if (
    normSuper.includes('energy') &&
    (normName.includes('basic') || normId.startsWith('sv01-09') || normId.includes('sve'))
  ) {
    return {
      eraLabel: 'Perpetual Classic',
      classification: 'Classic',
      description: 'Essential energy used across all historical eras',
      badgeColor: 'slate',
    };
  }

  // 2. Modern Era (Scarlet & Violet onwards)
  if (normId.startsWith('sv') || normId.includes('scarlet') || normId.includes('151')) {
    return {
      eraLabel: 'Modern Era',
      classification: 'Modern',
      description: 'Current generation Scarlet & Violet series',
      badgeColor: 'emerald',
    };
  }

  // 3. Mid-Era (Sword & Shield, Sun & Moon)
  if (
    normId.startsWith('swsh') ||
    normId.startsWith('sm') ||
    normId.includes('sword') ||
    normId.includes('shield') ||
    normId.includes('sun') ||
    normId.includes('moon')
  ) {
    return {
      eraLabel: 'Mid-Era',
      classification: 'Mid-Era',
      description: 'Sword & Shield and Sun & Moon historical periods',
      badgeColor: 'blue',
    };
  }

  // 4. Vintage Era (XY, Black & White, HGSS, Platinum)
  if (
    normId.startsWith('xy') ||
    normId.startsWith('bw') ||
    normId.startsWith('hgss') ||
    normId.startsWith('pl') ||
    normId.includes('black') ||
    normId.includes('white')
  ) {
    return {
      eraLabel: 'Vintage Era',
      classification: 'Vintage',
      description: 'Historical expansions from XY through Black & White',
      badgeColor: 'amber',
    };
  }

  // 5. Classic Era (Base Set, Neo, e-Card, EX, DP)
  return {
    eraLabel: 'Classic Era',
    classification: 'Classic',
    description: 'The foundation periods of the Pokémon TCG',
    badgeColor: 'rose',
  };
}
