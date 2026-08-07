import { CardSet } from '../types';

/**
 * Known default canonical series list for fallback ordering.
 */
export const DEFAULT_SERIES_CATEGORIES = [
  'All',
  'Scarlet & Violet',
  'Sword & Shield',
  'Sun & Moon',
  'XY Series',
  'Black & White',
  'HeartGold & SoulSilver',
  'Diamond & Pearl',
  'EX Series',
  'Neo Series',
  'Gym Series',
  'Base Series',
  'POP Series',
  "McDonald's Collection",
  'Promos & Special',
];

/**
 * Standard known series priority weights (lower = newer/higher priority).
 */
const KNOWN_SERIES_WEIGHTS: Record<string, number> = {
  'Scarlet & Violet': 10,
  'Sword & Shield': 20,
  'Sun & Moon': 30,
  'XY Series': 40,
  'Black & White': 50,
  'HeartGold & SoulSilver': 60,
  'Diamond & Pearl': 70,
  'EX Series': 80,
  'Neo Series': 90,
  'Gym Series': 100,
  'Base Series': 110,
  'POP Series': 120,
  "McDonald's Collection": 130,
  'Promos & Special': 140,
};

/**
 * Helper to clean up raw series string from APIs into human-friendly format.
 */
function cleanSeriesString(rawSeries: string): string {
  if (!rawSeries) return '';
  let s = rawSeries.trim();

  const lower = s.toLowerCase();
  if (lower === 'unknown' || lower === 'pokémon tcg' || lower === 'pokemon tcg' || lower === 'tcg' || lower === 'sets') {
    return '';
  }

  // Canonical remapping for known variants from APIs
  if (lower.includes('scarlet') || lower.includes('violet') || lower === 'sv') return 'Scarlet & Violet';
  if (lower.includes('sword') || lower.includes('shield') || lower === 'swsh') return 'Sword & Shield';
  if (lower.includes('sun') || lower.includes('moon') || lower === 'sm') return 'Sun & Moon';
  if (lower === 'xy' || lower.includes('xy series')) return 'XY Series';
  if (lower.includes('black') || lower.includes('white') || lower === 'bw') return 'Black & White';
  if (lower.includes('heartgold') || lower.includes('soulsilver') || lower === 'hgss') return 'HeartGold & SoulSilver';
  if (lower.includes('diamond') || lower.includes('pearl') || lower.includes('platinum') || lower === 'dp' || lower === 'pl') return 'Diamond & Pearl';
  if (lower.startsWith('ex') || lower.includes('ex series')) return 'EX Series';
  if (lower.startsWith('neo') || lower.includes('neo series')) return 'Neo Series';
  if (lower.startsWith('gym') || lower.includes('gym series')) return 'Gym Series';
  if (lower.includes('base') || lower.includes('original') || lower === 'base series') return 'Base Series';
  if (lower.includes('pop') || lower === 'pop series') return 'POP Series';
  if (lower.includes('mcdonald')) return "McDonald's Collection";

  // Capitalize title case for new/unrecognised series (e.g. "legends: z-a" -> "Legends: Z-A")
  return s.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Normalizes any set's series into canonical or dynamically detected Series/Eras.
 * Future-proofed for unannounced and newly introduced sets and expansions!
 */
export function normalizeSeries(set: any): string {
  if (!set) return 'Promos & Special';

  const idLower = String(set.id || '').toLowerCase();
  const nameLower = String(set.name || '').toLowerCase();

  // 1. Check if the set object explicitly brings a valid series field from the API
  const rawApiSeries =
    typeof set.series === 'string'
      ? set.series
      : set.serie?.name || set.serie?.id || set.serie || set.expansion?.series || '';

  const cleanedApiSeries = cleanSeriesString(String(rawApiSeries));
  if (cleanedApiSeries) {
    return cleanedApiSeries;
  }

  // 2. Pattern match by set name keywords
  if (nameLower.includes('mcdonald') || idLower.includes('mcd')) {
    return "McDonald's Collection";
  }

  // Scarlet & Violet era sets
  if (
    idLower.startsWith('sv') ||
    nameLower.includes('scarlet') ||
    nameLower.includes('paldea') ||
    nameLower.includes('obsidian') ||
    nameLower.includes('paradox') ||
    nameLower.includes('temporal') ||
    nameLower.includes('twilight') ||
    nameLower.includes('shrouded') ||
    nameLower.includes('stellar') ||
    nameLower.includes('surging') ||
    nameLower.includes('prismatic') ||
    nameLower.includes('151') ||
    nameLower.includes('destinies') ||
    nameLower.includes('journey')
  ) {
    return 'Scarlet & Violet';
  }

  // Sword & Shield era sets
  if (
    idLower.startsWith('swsh') ||
    nameLower.includes('sword & shield') ||
    nameLower.includes('sword and shield') ||
    nameLower.includes('rebel clash') ||
    nameLower.includes('darkness ablaze') ||
    nameLower.includes('vivid voltage') ||
    nameLower.includes('shining fates') ||
    nameLower.includes('battle styles') ||
    nameLower.includes('chilling reign') ||
    nameLower.includes('evolving skies') ||
    nameLower.includes('fusion strike') ||
    nameLower.includes('brilliant stars') ||
    nameLower.includes('astral radiance') ||
    nameLower.includes('lost origin') ||
    nameLower.includes('silver tempest') ||
    nameLower.includes('crown zenith')
  ) {
    return 'Sword & Shield';
  }

  // Sun & Moon era sets
  if (
    idLower.startsWith('sm') ||
    nameLower.includes('sun & moon') ||
    nameLower.includes('ultra prism') ||
    nameLower.includes('forbidden light') ||
    nameLower.includes('celestial storm') ||
    nameLower.includes('lost thunder') ||
    nameLower.includes('team up') ||
    nameLower.includes('unbroken bonds') ||
    nameLower.includes('unified minds') ||
    nameLower.includes('cosmic eclipse') ||
    nameLower.includes('hidden fates') ||
    nameLower.includes('shining legends')
  ) {
    return 'Sun & Moon';
  }

  // XY Series
  if (
    idLower.startsWith('xy') ||
    nameLower.includes('flashfire') ||
    nameLower.includes('furious fists') ||
    nameLower.includes('phantom forces') ||
    nameLower.includes('primal clash') ||
    nameLower.includes('roaring skies') ||
    nameLower.includes('ancient origins') ||
    nameLower.includes('breakthrough') ||
    nameLower.includes('breakpoint') ||
    nameLower.includes('fates collide') ||
    nameLower.includes('steam siege') ||
    nameLower.includes('evolutions') ||
    nameLower.includes('generations')
  ) {
    return 'XY Series';
  }

  // Black & White
  if (
    idLower.startsWith('bw') ||
    nameLower.includes('emerging powers') ||
    nameLower.includes('noble victories') ||
    nameLower.includes('next destinies') ||
    nameLower.includes('dark explorers') ||
    nameLower.includes('dragons exalted') ||
    nameLower.includes('boundaries crossed') ||
    nameLower.includes('plasma storm') ||
    nameLower.includes('plasma freeze') ||
    nameLower.includes('plasma blast') ||
    nameLower.includes('legendary treasures')
  ) {
    return 'Black & White';
  }

  // HeartGold & SoulSilver
  if (
    idLower.startsWith('hgss') ||
    idLower.startsWith('col') ||
    nameLower.includes('heartgold') ||
    nameLower.includes('soulsilver') ||
    nameLower.includes('unleashed') ||
    nameLower.includes('undaunted') ||
    nameLower.includes('triumphant') ||
    nameLower.includes('call of legends')
  ) {
    return 'HeartGold & SoulSilver';
  }

  // Diamond & Pearl / Platinum
  if (
    idLower.startsWith('dp') ||
    idLower.startsWith('pl') ||
    nameLower.includes('diamond & pearl') ||
    nameLower.includes('mysterious treasures') ||
    nameLower.includes('secret wonders') ||
    nameLower.includes('great encounters') ||
    nameLower.includes('majestic dawn') ||
    nameLower.includes('legends awakened') ||
    nameLower.includes('stormfront') ||
    nameLower.includes('platinum') ||
    nameLower.includes('rising rivals') ||
    nameLower.includes('supreme victors') ||
    nameLower.includes('arceus')
  ) {
    return 'Diamond & Pearl';
  }

  // EX Series
  if (
    idLower.startsWith('ex') ||
    nameLower.includes('ruby & sapphire') ||
    nameLower.includes('sandstorm') ||
    nameLower.includes('firered') ||
    nameLower.includes('leafgreen') ||
    nameLower.includes('emerald') ||
    nameLower.includes('unseen forces') ||
    nameLower.includes('delta species') ||
    nameLower.includes('power keepers')
  ) {
    return 'EX Series';
  }

  // Neo Series
  if (idLower.startsWith('neo') || nameLower.includes('neo genesis') || nameLower.includes('neo discovery')) {
    return 'Neo Series';
  }

  // Gym Series
  if (idLower.startsWith('gym') || nameLower.includes('gym heroes') || nameLower.includes('gym challenge')) {
    return 'Gym Series';
  }

  // Base Series
  if (
    idLower.startsWith('base') ||
    idLower === 'bs2' ||
    idLower === 'jungle' ||
    idLower === 'fossil' ||
    idLower === 'rocket' ||
    nameLower.includes('base set') ||
    nameLower.includes('jungle') ||
    nameLower.includes('fossil') ||
    nameLower.includes('team rocket')
  ) {
    return 'Base Series';
  }

  // POP Series
  if (idLower.startsWith('pop') || nameLower.includes('pop series')) {
    return 'POP Series';
  }

  // 3. Dynamic Inference for Brand New / Unannounced Set Prefixes (e.g. za01 -> Legends: Z-A, me01 -> Mega Series, etc.)
  const prefixMatch = idLower.match(/^([a-z]{2,5})\d+/);
  if (prefixMatch) {
    const prefix = prefixMatch[1].toUpperCase();
    if (prefix === 'ZA' || prefix === 'LAZ') return 'Legends: Z-A';
    if (prefix === 'ME') return 'Mega Evolution Series';
    if (prefix === 'POCKET' || prefix === 'TCP') return 'Pokémon TCG Pocket';
    // Dynamic series fallback derived from ID prefix (e.g., "AZ Series")
    return `${prefix} Series`;
  }

  // 4. Release Year Fallback for future brand new sets
  const releaseYear = set.releaseDate ? parseInt(String(set.releaseDate).substring(0, 4), 10) : 0;
  if (releaseYear >= 2026) {
    return `2026+ Expansions`;
  }

  // Default fallback
  return 'Promos & Special';
}

/**
 * Ensures set name is clean, human-readable, and clear.
 */
export function normalizeSetName(set: any): string {
  if (!set) return 'Unknown Set';

  const id = String(set.id || '').toLowerCase();
  const rawName = String(set.name || '').trim();

  // Known set name cleanups for base sets
  if (id === 'sv1' || id === 'sv01') return 'Scarlet & Violet Base';
  if (id === 'swsh1' || id === 'swsh01') return 'Sword & Shield Base';
  if (id === 'sm1' || id === 'sm01') return 'Sun & Moon Base';
  if (id === 'xy1' || id === 'xy01') return 'XY Base Set';
  if (id === 'bw1' || id === 'bw01') return 'Black & White Base';
  if (id === 'dp1' || id === 'dp01') return 'Diamond & Pearl Base';
  if (id === 'ex1') return 'EX Ruby & Sapphire';
  if (id === 'base1') return 'Base Set';
  if (id === 'base2') return 'Jungle';
  if (id === 'base3') return 'Fossil';
  if (id === 'base4' || id === 'bs2') return 'Base Set 2';
  if (id === 'base5') return 'Team Rocket';
  if (id === 'gym1') return 'Gym Heroes';
  if (id === 'gym2') return 'Gym Challenge';
  if (id === 'neo1') return 'Neo Genesis';
  if (id === 'neo2') return 'Neo Discovery';
  if (id === 'neo3') return 'Neo Revelation';
  if (id === 'neo4') return 'Neo Destiny';
  if (id === 'sv3pt5' || id === 'sv03.5' || id === 'sv3.5') return '151';
  if (id === 'swsh12pt5' || id === 'swsh12.5') return 'Crown Zenith';
  if (id === 'swsh10pt5' || id === 'swsh10.5') return 'Pokémon GO';
  if (id === 'swsh4pt5' || id === 'swsh4.5') return 'Shining Fates';
  if (id === 'swsh3pt5' || id === 'swsh3.5') return 'Champion\'s Path';

  if (!rawName || rawName.toLowerCase() === 'unknown set' || rawName.toLowerCase() === 'unknown') {
    return `Set ${set.id?.toUpperCase() || ''}`;
  }

  // Clean double spaces or weird punctuation in brand new set names
  return rawName.replace(/\s+/g, ' ');
}

/**
 * Fully normalizes a set object to standard CardSet type with canonical series & name.
 */
export function normalizeSet(set: any): CardSet {
  const series = normalizeSeries(set);
  const name = normalizeSetName(set);

  const cardCountOfficial = set.cardCount?.official || set.printedTotal || set.total || 100;
  const cardCountTotal = set.cardCount?.total || set.total || cardCountOfficial;

  let symbolUrl =
    set.symbolUrl ||
    (set.symbol ? (set.symbol.endsWith('.png') || set.symbol.endsWith('.webp') ? set.symbol : `${set.symbol}.png`) : '');
  let logoUrl =
    set.logoUrl ||
    (set.logo ? (set.logo.endsWith('.png') || set.logo.endsWith('.webp') ? set.logo : `${set.logo}.png`) : '');

  if (!symbolUrl) symbolUrl = 'https://images.pokemontcg.io/symbol.png';
  if (!logoUrl) logoUrl = symbolUrl;

  return {
    id: String(set.id || 'unknown'),
    name,
    series,
    printedTotal: cardCountOfficial,
    total: cardCountTotal,
    releaseDate: set.releaseDate || '2024-01-01',
    symbolUrl,
    logoUrl,
  };
}

/**
 * Gets the release weight/rank of a series (lower = newer).
 * Automatically calculates dynamic release dates for new/unrecognised series!
 */
export function getSeriesWeight(seriesName: string, sets: CardSet[] = []): number {
  if (KNOWN_SERIES_WEIGHTS[seriesName] !== undefined) {
    return KNOWN_SERIES_WEIGHTS[seriesName];
  }

  // Find max release date among sets in this series
  const seriesSets = sets.filter((s) => s.series === seriesName);
  if (seriesSets.length > 0) {
    const maxYear = Math.max(
      ...seriesSets.map((s) => (s.releaseDate ? parseInt(s.releaseDate.substring(0, 4), 10) : 2020))
    );
    // If released in 2026 or later, rank higher than Scarlet & Violet (weight < 10)
    return Math.max(0, 2030 - maxYear);
  }

  return 999;
}

/**
 * Dynamically builds the series category list for UI filter pills.
 * Combines standard categories and any brand new series dynamically discovered from incoming sets.
 */
export function getDynamicSeriesCategories(expansions: CardSet[]): string[] {
  const seriesSet = new Set<string>();

  // Collect all series present in current expansions
  expansions.forEach((e) => {
    if (e.series) seriesSet.add(e.series);
  });

  // Ensure default known categories are included
  DEFAULT_SERIES_CATEGORIES.forEach((cat) => {
    if (cat !== 'All') seriesSet.add(cat);
  });

  const uniqueList = Array.from(seriesSet);

  // Sort series dynamically by newest release date first
  uniqueList.sort((a, b) => {
    const weightA = getSeriesWeight(a, expansions);
    const weightB = getSeriesWeight(b, expansions);
    return weightA - weightB;
  });

  return ['All', ...uniqueList];
}

/**
 * Sorts array of sets chronologically (Newest series & release dates first).
 * Completely future-proof for any new expansion block!
 */
export function sortSetsChronologically(sets: CardSet[]): CardSet[] {
  return [...sets].sort((a, b) => {
    const weightA = getSeriesWeight(a.series, sets);
    const weightB = getSeriesWeight(b.series, sets);

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    // Secondary sort: release date descending (newest first)
    const dateA = a.releaseDate || '1990-01-01';
    const dateB = b.releaseDate || '1990-01-01';
    return dateB.localeCompare(dateA);
  });
}
