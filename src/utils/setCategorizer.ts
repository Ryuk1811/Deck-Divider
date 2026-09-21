import { CardSet } from '../types';

/**
 * Known default canonical series list for fallback ordering.
 */
export const DEFAULT_SERIES_CATEGORIES = [
  'All',
  '30th Celebrations',
  'Mega Evolution Series',
  'Legends: Z-A',
  'Pokémon TCG Pocket',
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
  '30th Celebrations': 2,
  '30th Celebration': 2,
  'Mega Evolution Series': 4,
  'Legends: Z-A': 6,
  'Pokémon TCG Pocket': 8,
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
  if (lower.includes('30th') || lower.includes('30th celebration') || lower.includes('30th anniversary')) return '30th Celebrations';
  if (lower.includes('mega') || lower.startsWith('me')) return 'Mega Evolution Series';
  if (lower.includes('pocket') || lower === 'tcgp' || lower === 'b1' || lower === 'b2') return 'Pokémon TCG Pocket';
  if (lower.includes('legends: z-a') || lower.includes('legends z-a') || lower === 'za' || lower === 'laz') return 'Legends: Z-A';
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

  // 0. 30th Anniversary & Celebrations sets (Latest!)
  if (
    idLower === '30th' ||
    idLower === '30th-c' ||
    idLower.startsWith('30th') ||
    nameLower.includes('30th celebration') ||
    nameLower.includes('30th classic') ||
    nameLower.includes('30th anniversary')
  ) {
    return '30th Celebrations';
  }

  // Mega Evolution Series
  if (
    idLower.startsWith('me0') ||
    idLower.startsWith('me') ||
    nameLower.includes('mega evolution') ||
    nameLower.includes('phantasmal flames') ||
    nameLower.includes('ascended heroes') ||
    nameLower.includes('perfect order') ||
    nameLower.includes('chaos rising') ||
    nameLower.includes('pitch black')
  ) {
    return 'Mega Evolution Series';
  }

  // Pokémon TCG Pocket
  if (
    idLower.startsWith('b1') ||
    idLower.startsWith('b2') ||
    idLower.startsWith('tcgp') ||
    nameLower.includes('genetic apex') ||
    nameLower.includes('mythical island') ||
    nameLower.includes('space-time smackdown') ||
    nameLower.includes('triumphant light')
  ) {
    return 'Pokémon TCG Pocket';
  }

  // Legends: Z-A
  if (
    idLower.startsWith('za') ||
    idLower.startsWith('laz') ||
    nameLower.includes('legends: z-a') ||
    nameLower.includes('legends za')
  ) {
    return 'Legends: Z-A';
  }

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

  // Known set name cleanups for base sets and new expansions
  if (id === '30th') return '30th Celebration';
  if (id === '30th-c') return '30th Classic Collection';
  if (id === 'me01') return 'Mega Evolution';
  if (id === 'me02') return 'Phantasmal Flames';
  if (id === 'me02.5') return 'Ascended Heroes';
  if (id === 'me03') return 'Perfect Order';
  if (id === 'me04') return 'Chaos Rising';
  if (id === 'me05') return 'Pitch Black';
  if (id === 'b1') return 'Genetic Apex';
  if (id === 'b1a') return 'Mythical Island';
  if (id === 'b2') return 'Space-Time Smackdown';
  if (id === 'b2a') return 'Triumphant Light';
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
 * Known canonical release dates for major sets (used when API omits releaseDate)
 */
export const KNOWN_SET_RELEASE_DATES: Record<string, string> = {
  // 30th Anniversary & Celebrations
  '30th': '2026-02-27',
  '30th-c': '2026-02-27',
  // Mega Evolution Series
  'me01': '2025-09-19',
  'me02': '2025-11-14',
  'me02.5': '2026-01-23',
  'me03': '2026-03-27',
  'me04': '2026-05-22',
  'me05': '2026-07-24',
  // Pokémon TCG Pocket
  'b1': '2024-10-30',
  'b1a': '2024-12-16',
  'b2': '2025-01-30',
  'b2a': '2025-02-28',
  // Scarlet & Violet
  'sv01': '2023-03-31',
  'sv02': '2023-06-09',
  'sv03': '2023-08-11',
  'sv03.5': '2023-09-22',
  'sv3pt5': '2023-09-22',
  'sv04': '2023-11-03',
  'sv04.5': '2024-01-26',
  'sv4pt5': '2024-01-26',
  'sv05': '2024-03-22',
  'sv06': '2024-05-24',
  'sv06.5': '2024-08-02',
  'sv6pt5': '2024-08-02',
  'sv07': '2024-09-13',
  'sv08': '2024-11-08',
  'sv08.5': '2025-01-17',
  'sv8pt5': '2025-01-17',
  'sv09': '2025-03-28',
  'sv10': '2025-05-23',
  'sv10.5w': '2025-07-18',
  'sv10.5b': '2025-07-18',
  // Sword & Shield
  'swsh1': '2020-02-07',
  'swsh2': '2020-05-01',
  'swsh3': '2020-08-14',
  'swsh3.5': '2020-09-25',
  'swsh3pt5': '2020-09-25',
  'swsh4': '2020-11-13',
  'swsh4.5': '2021-02-19',
  'swsh4pt5': '2021-02-19',
  'swsh5': '2021-03-19',
  'swsh6': '2021-06-18',
  'swsh7': '2021-08-27',
  'cel25': '2021-10-08',
  'swsh8': '2021-11-12',
  'swsh9': '2022-02-25',
  'swsh10': '2022-05-27',
  'swsh10.5': '2022-07-01',
  'swsh10pt5': '2022-07-01',
  'swsh11': '2022-09-09',
  'swsh12': '2022-11-11',
  'swsh12.5': '2023-01-20',
  'swsh12pt5': '2023-01-20',
  // Sun & Moon
  'sm1': '2017-02-03',
  'sm2': '2017-05-05',
  'sm3': '2017-08-04',
  'sm3.5': '2017-10-06',
  'sm3pt5': '2017-10-06',
  'sm4': '2017-11-03',
  'sm5': '2018-02-02',
  'sm6': '2018-05-04',
  'sm7': '2018-08-03',
  'sm7.5': '2018-09-07',
  'sm7pt5': '2018-09-07',
  'sm8': '2018-11-02',
  'sm9': '2019-02-01',
  'det': '2019-03-29',
  'sm10': '2019-05-03',
  'sm11': '2019-08-02',
  'sm11.5': '2019-08-23',
  'sm11pt5': '2019-08-23',
  'sm12': '2019-11-01',
  // XY
  'xy1': '2014-02-05',
  'xy2': '2014-05-07',
  'xy3': '2014-08-13',
  'xy4': '2014-11-05',
  'xy5': '2015-02-04',
  'dc1': '2015-03-25',
  'xy6': '2015-05-06',
  'xy7': '2015-08-12',
  'xy8': '2015-11-04',
  'xy9': '2016-02-03',
  'gen': '2016-02-22',
  'g1': '2016-02-22',
  'xy10': '2016-05-02',
  'xy11': '2016-08-03',
  'xy12': '2016-11-02',
  // Black & White
  'bw1': '2011-04-25',
  'bw2': '2011-08-31',
  'bw3': '2011-11-16',
  'bw4': '2012-02-08',
  'bw5': '2012-05-09',
  'bw6': '2012-08-15',
  'dv1': '2012-10-05',
  'bw7': '2012-11-07',
  'bw8': '2013-02-06',
  'bw9': '2013-05-08',
  'bw10': '2013-08-14',
  'bw11': '2013-11-06',
  // HeartGold & SoulSilver
  'hgss1': '2010-02-10',
  'hgss2': '2010-05-12',
  'hgss3': '2010-08-18',
  'hgss4': '2010-11-03',
  'col1': '2011-02-09',
  // Diamond & Pearl / Platinum
  'dp1': '2007-05-23',
  'dp2': '2007-08-22',
  'dp3': '2007-11-07',
  'dp4': '2008-02-13',
  'dp5': '2008-05-21',
  'dp6': '2008-08-20',
  'dp7': '2008-11-05',
  'pl1': '2009-02-11',
  'pl2': '2009-05-16',
  'pl3': '2009-08-19',
  'pl4': '2009-11-04',
  // EX Series
  'ex1': '2003-06-18',
  'ex2': '2003-09-18',
  'ex3': '2003-11-24',
  'ex4': '2004-03-15',
  'ex5': '2004-06-14',
  'ex6': '2004-08-30',
  'ex7': '2004-11-01',
  'ex8': '2005-02-14',
  'ex9': '2005-05-09',
  'ex10': '2005-08-22',
  'ex11': '2005-10-31',
  'ex12': '2006-02-13',
  'ex13': '2006-05-03',
  'ex14': '2006-08-30',
  'ex15': '2006-11-08',
  'ex16': '2007-02-14',
  // Neo Series
  'neo1': '2000-12-16',
  'neo2': '2001-06-01',
  'neo3': '2001-09-21',
  'neo4': '2002-02-28',
  // Base Series
  'base1': '1999-01-09',
  'base2': '1999-06-16',
  'base3': '1999-10-10',
  'base4': '2000-02-24',
  'base5': '2000-04-24',
  'gym1': '2000-08-14',
  'gym2': '2000-10-16',
};

/**
 * Calculates a precise introduction order weight within an expansion series.
 * Lower weight = introduced earlier in the expansion (first set = 1).
 */
export function getSetOrderWeight(set: any): number {
  const id = String(set.id || '').toLowerCase().trim();

  // Known hardcoded sequence weights (ensures 1st set introduced in expansion is #1)
  const knownSeq: Record<string, number> = {
    // 30th Celebrations
    '30th': 1, '30th-c': 2,
    // Mega Evolution
    'me01': 1, 'me02': 2, 'me02.5': 3, 'me03': 4, 'me04': 5, 'me05': 6,
    // Pokémon TCG Pocket
    'b1': 1, 'b1a': 2, 'b2': 3, 'b2a': 4,
    // Base
    'base1': 1, 'base2': 2, 'base3': 3, 'base4': 4, 'base5': 5, 'gym1': 6, 'gym2': 7, 'basep': 990,
    // Neo
    'neo1': 1, 'neo2': 2, 'neo3': 3, 'neo4': 4,
    // Legendary Collection
    'lc': 1,
    // E-Card
    'ecard1': 1, 'ecard2': 2, 'ecard3': 3,
    // EX
    'ex1': 1, 'ex2': 2, 'ex3': 3, 'ex4': 4, 'ex5': 5, 'ex6': 6, 'ex7': 7, 'ex8': 8,
    'ex9': 9, 'ex10': 10, 'ex11': 11, 'ex12': 12, 'ex13': 13, 'ex14': 14, 'ex15': 15, 'ex16': 16,
    // DP / Platinum
    'dp1': 1, 'dp2': 2, 'dp3': 3, 'dp4': 4, 'dp5': 5, 'dp6': 6, 'dp7': 7,
    'pl1': 8, 'pl2': 9, 'pl3': 10, 'pl4': 11,
    // HGSS
    'hgss1': 1, 'hgss2': 2, 'hgss3': 3, 'hgss4': 4, 'col1': 5,
    // Black & White
    'bw1': 1, 'bw2': 2, 'bw3': 3, 'bw4': 4, 'bw5': 5, 'bw6': 6, 'dv1': 6.5,
    'bw7': 7, 'bw8': 8, 'bw9': 9, 'bw10': 10, 'bw11': 11,
    // XY
    'xy1': 1, 'xy2': 2, 'xy3': 3, 'xy4': 4, 'xy5': 5, 'dc1': 5.5,
    'xy6': 6, 'xy7': 7, 'xy8': 8, 'xy9': 9, 'gen': 9.5, 'g1': 9.5,
    'xy10': 10, 'xy11': 11, 'xy12': 12,
    // Sun & Moon
    'sm1': 1, 'sm2': 2, 'sm3': 3, 'sm3.5': 3.5, 'sm3pt5': 3.5,
    'sm4': 4, 'sm5': 5, 'sm6': 6, 'sm7': 7, 'sm7.5': 7.5, 'sm7pt5': 7.5,
    'sm8': 8, 'sm9': 9, 'det': 9.2, 'sm10': 10, 'sm11': 11, 'sm11.5': 11.5, 'sm11pt5': 11.5,
    'sma': 11.6, 'sm12': 12,
    // Sword & Shield
    'swsh1': 1, 'swsh2': 2, 'swsh3': 3, 'swsh3.5': 3.5, 'swsh3pt5': 3.5,
    'swsh4': 4, 'swsh4.5': 4.5, 'swsh4pt5': 4.5, 'swsh4.5sv': 4.6,
    'swsh5': 5, 'swsh6': 6, 'swsh7': 7, 'cel25': 7.5, 'cel25cc': 7.6,
    'swsh8': 8, 'swsh9': 9, 'swsh9tg': 9.1, 'swsh10': 10, 'swsh10tg': 10.1,
    'swsh10.5': 10.5, 'swsh10pt5': 10.5, 'swsh11': 11, 'swsh11tg': 11.1,
    'swsh12': 12, 'swsh12tg': 12.1, 'swsh12.5': 12.5, 'swsh12pt5': 12.5, 'swsh12.5gg': 12.6,
    // Scarlet & Violet
    'sv01': 1, 'sv1': 1, 'sv02': 2, 'sv2': 2, 'sv03': 3, 'sv3': 3,
    'sv03.5': 3.5, 'sv3.5': 3.5, 'sv3pt5': 3.5,
    'sv04': 4, 'sv4': 4, 'sv04.5': 4.5, 'sv4.5': 4.5, 'sv4pt5': 4.5,
    'sv05': 5, 'sv5': 5, 'sv06': 6, 'sv6': 6,
    'sv06.5': 6.5, 'sv6.5': 6.5, 'sv6pt5': 6.5,
    'sv07': 7, 'sv7': 7, 'sv08': 8, 'sv8': 8,
    'sv08.5': 8.5, 'sv8.5': 8.5, 'sv8pt5': 8.5,
    'sv09': 9, 'sv9': 9, 'sv10': 10, 'sv10.5w': 10.5, 'sv10.5b': 10.6,
  };

  if (knownSeq[id] !== undefined) return knownSeq[id];

  // Promos & special auxiliary sets go to the end
  if (id.endsWith('p') || id.includes('promo') || id === 'sve' || id === 'mfb') {
    return 900;
  }

  // Generic parser for standard numeric prefixes (e.g. sv08, swsh12, xy03, me01)
  const match = id.match(/^[a-z]+0*(\d+)(?:\.(\d+))?/i);
  if (match) {
    const main = parseInt(match[1], 10);
    const sub = match[2] ? parseFloat('0.' + match[2]) : 0;
    return main + sub;
  }

  // Fallback to release date comparison if known
  const relDate = KNOWN_SET_RELEASE_DATES[id] || set.releaseDate;
  if (relDate) {
    const ts = new Date(relDate).getTime();
    if (!isNaN(ts)) return ts / 100000000;
  }

  return 100;
}

/**
 * Fully normalizes a set object to standard CardSet type with canonical series & name.
 */
export function normalizeSet(set: any): CardSet {
  const series = normalizeSeries(set);
  const name = normalizeSetName(set);

  const cardCountOfficial = set.cardCount?.official || set.printedTotal || set.total || 100;
  const cardCountTotal = set.cardCount?.total || set.total || cardCountOfficial;

  const idClean = String(set.id || 'unknown').toLowerCase();

  // 1. Symbol URL - TCGdex provides png/webp, pokemontcg.io provides standard symbols
  let symbolUrl = '';
  if (set.symbolUrl) {
    symbolUrl = set.symbolUrl;
  } else if (set.symbol) {
    const rawSym = String(set.symbol);
    symbolUrl = rawSym.endsWith('.png') || rawSym.endsWith('.webp') ? rawSym : `${rawSym}.png`;
  }
  if (symbolUrl && symbolUrl.includes('/univ/')) {
    symbolUrl = symbolUrl.replace('/univ/', '/en/');
  }
  if (!symbolUrl && set.id) {
    symbolUrl = `https://images.pokemontcg.io/${idClean}/symbol.png`;
  }

  // 2. Logo URL - TCGdex reliably hosts webp for all expansion logos
  let logoUrl = '';
  if (set.logoUrl) {
    logoUrl = set.logoUrl;
  } else if (set.logo) {
    const rawLogo = String(set.logo);
    logoUrl = rawLogo.endsWith('.webp') || rawLogo.endsWith('.png') ? rawLogo : `${rawLogo}.webp`;
  }
  if (logoUrl && logoUrl.includes('/univ/')) {
    logoUrl = logoUrl.replace('/univ/', '/en/');
  }
  if (!logoUrl && symbolUrl) {
    logoUrl = symbolUrl;
  }

  // 3. Accurate Release Date lookup
  let releaseDate = set.releaseDate;
  if (!releaseDate || releaseDate === '2024-01-01') {
    releaseDate = KNOWN_SET_RELEASE_DATES[idClean] || set.releaseDate || '2024-01-01';
  }

  return {
    id: String(set.id || 'unknown'),
    name,
    series,
    printedTotal: cardCountOfficial,
    total: cardCountTotal,
    releaseDate,
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
 * Sorts array of sets chronologically.
 * Primary: Newest series first (Scarlet & Violet, then Sword & Shield, etc.).
 * Secondary: Within each expansion series, orders by which set was INTRODUCED FIRST (1st set introduced appears first).
 */
export function sortSetsChronologically(sets: CardSet[]): CardSet[] {
  return [...sets].sort((a, b) => {
    const seriesWeightA = getSeriesWeight(a.series, sets);
    const seriesWeightB = getSeriesWeight(b.series, sets);

    if (seriesWeightA !== seriesWeightB) {
      return seriesWeightA - seriesWeightB;
    }

    // Secondary sort: order by introduction sequence within expansion (oldest/first introduced first)
    const orderA = getSetOrderWeight(a);
    const orderB = getSetOrderWeight(b);
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const dateA = a.releaseDate || '1990-01-01';
    const dateB = b.releaseDate || '1990-01-01';
    return dateA.localeCompare(dateB);
  });
}
