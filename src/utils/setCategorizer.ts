import { CardSet } from '../types';

/**
 * Known default canonical series list for high-end collector classification.
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
  'E-Card Series',
  'Neo Series',
  'Gym Series',
  'Base Series',
  'POP Series',
  'Pokémon TCG Pocket',
  'Mega Evolution Series',
  'Promos & Special',
];

/**
 * Standard series priority weights (lower = newer/higher priority).
 */
const KNOWN_SERIES_WEIGHTS: Record<string, number> = {
  'Scarlet & Violet': 10,
  'Mega Evolution Series': 15,
  'Pokémon TCG Pocket': 18,
  'Sword & Shield': 20,
  'Sun & Moon': 30,
  'XY Series': 40,
  'Black & White': 50,
  'HeartGold & SoulSilver': 60,
  'Diamond & Pearl': 70,
  'EX Series': 80,
  'E-Card Series': 85,
  'Neo Series': 90,
  'Gym Series': 100,
  'Base Series': 110,
  'POP Series': 120,
  'Promos & Special': 130,
};

/**
 * Ensures any asset image URL from TCGdex or PokemonTCG is fully qualified with .png.
 */
export function formatSetAssetUrl(url?: string): string {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('assets.tcgdex.net') && !trimmed.match(/\.(png|webp|jpg|jpeg|svg)$/i)) {
      return `${trimmed}.png`;
    }
    return trimmed;
  }

  return `https://assets.tcgdex.net/univ/${trimmed}.png`;
}

/**
 * Normalizes any set's series into canonical collector eras.
 */
export function normalizeSeries(set: any): string {
  if (!set) return 'Promos & Special';

  const idLower = String(set.id || '').toLowerCase();
  const nameLower = String(set.name || '').toLowerCase();

  // 1. Explicit series name checks from API
  const rawApiSeries =
    typeof set.series === 'string'
      ? set.series
      : set.serie?.name || set.serie?.id || set.serie || set.expansion?.series || '';

  const sLower = String(rawApiSeries).toLowerCase();
  if (sLower.includes('scarlet') || sLower.includes('violet') || sLower === 'sv') return 'Scarlet & Violet';
  if (sLower.includes('sword') || sLower.includes('shield') || sLower === 'swsh') return 'Sword & Shield';
  if (sLower.includes('sun') || sLower.includes('moon') || sLower === 'sm') return 'Sun & Moon';
  if (sLower === 'xy' || sLower.includes('xy series')) return 'XY Series';
  if (sLower.includes('black') || sLower.includes('white') || sLower === 'bw') return 'Black & White';
  if (sLower.includes('heartgold') || sLower.includes('soulsilver') || sLower === 'hgss') return 'HeartGold & SoulSilver';
  if (sLower.includes('diamond') || sLower.includes('pearl') || sLower.includes('platinum') || sLower === 'dp' || sLower === 'pl') return 'Diamond & Pearl';
  if (sLower.startsWith('ex') || sLower.includes('ex series')) return 'EX Series';
  if (sLower.includes('ecard') || sLower.includes('e-card')) return 'E-Card Series';
  if (sLower.startsWith('neo') || sLower.includes('neo series')) return 'Neo Series';
  if (sLower.startsWith('gym') || sLower.includes('gym series')) return 'Gym Series';
  if (sLower.includes('base') || sLower.includes('original') || sLower === 'base series') return 'Base Series';
  if (sLower.includes('pop') || sLower === 'pop series') return 'POP Series';
  if (sLower.includes('pocket')) return 'Pokémon TCG Pocket';
  if (sLower.includes('mega')) return 'Mega Evolution Series';

  // 2. Specific Set ID Mappings
  // Pokémon TCG Pocket Sets
  if (
    idLower.match(/^a[1-9]/) ||
    idLower.match(/^b[1-9]/) ||
    idLower === 'p-a' ||
    nameLower.includes('genetic apex') ||
    nameLower.includes('mythical island') ||
    nameLower.includes('space-time smackdown') ||
    nameLower.includes('triumphant light') ||
    nameLower.includes('shining revelry') ||
    nameLower.includes('celestial guardians') ||
    nameLower.includes('mega rising') ||
    nameLower.includes('crimson blaze') ||
    nameLower.includes('fantastical parade')
  ) {
    return 'Pokémon TCG Pocket';
  }

  // Mega Evolution Sets
  if (idLower.startsWith('me') || idLower.startsWith('mep') || idLower.startsWith('mee') || nameLower.includes('mega evolution')) {
    return 'Mega Evolution Series';
  }

  // Scarlet & Violet
  if (
    idLower.startsWith('sv') ||
    idLower === 'sve' ||
    idLower === 'svp' ||
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
    nameLower.includes('destined') ||
    nameLower.includes('journey together') ||
    nameLower.includes('white flare') ||
    nameLower.includes('black bolt')
  ) {
    return 'Scarlet & Violet';
  }

  // Sword & Shield
  if (
    idLower.startsWith('swsh') ||
    idLower === 'swshp' ||
    idLower.startsWith('cel25') ||
    idLower === 'cpa' ||
    idLower === 'shf' ||
    idLower === 'pgo' ||
    idLower === 'crz' ||
    idLower.includes('fut') ||
    nameLower.includes('sword & shield') ||
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
    nameLower.includes('crown zenith') ||
    nameLower.includes('celebrations')
  ) {
    return 'Sword & Shield';
  }

  // Sun & Moon
  if (
    idLower.startsWith('sm') ||
    idLower === 'smp' ||
    idLower === 'det1' ||
    idLower === 'sma' ||
    idLower === 'shlg' ||
    idLower === 'hif' ||
    nameLower.includes('sun & moon') ||
    nameLower.includes('guardians rising') ||
    nameLower.includes('burning shadows') ||
    nameLower.includes('crimson invasion') ||
    nameLower.includes('ultra prism') ||
    nameLower.includes('forbidden light') ||
    nameLower.includes('celestial storm') ||
    nameLower.includes('dragon majesty') ||
    nameLower.includes('lost thunder') ||
    nameLower.includes('team up') ||
    nameLower.includes('detective pikachu') ||
    nameLower.includes('unbroken bonds') ||
    nameLower.includes('unified minds') ||
    nameLower.includes('hidden fates') ||
    nameLower.includes('cosmic eclipse') ||
    nameLower.includes('shining legends')
  ) {
    return 'Sun & Moon';
  }

  // XY Series
  if (
    idLower.startsWith('xy') ||
    idLower === 'xyp' ||
    idLower === 'xya' ||
    idLower === 'dc1' ||
    idLower === 'g1' ||
    idLower === 'rc' ||
    idLower.startsWith('tk-xy') ||
    nameLower.includes('kalos') ||
    nameLower.includes('flashfire') ||
    nameLower.includes('furious fists') ||
    nameLower.includes('phantom forces') ||
    nameLower.includes('primal clash') ||
    nameLower.includes('double crisis') ||
    nameLower.includes('roaring skies') ||
    nameLower.includes('ancient origins') ||
    nameLower.includes('breakthrough') ||
    nameLower.includes('breakpoint') ||
    nameLower.includes('generations') ||
    nameLower.includes('fates collide') ||
    nameLower.includes('steam siege') ||
    nameLower.includes('evolutions')
  ) {
    return 'XY Series';
  }

  // Black & White
  if (
    idLower.startsWith('bw') ||
    idLower === 'bwp' ||
    idLower === 'dv1' ||
    idLower.startsWith('tk-bw') ||
    nameLower.includes('black & white') ||
    nameLower.includes('emerging powers') ||
    nameLower.includes('noble victories') ||
    nameLower.includes('next destinies') ||
    nameLower.includes('dark explorers') ||
    nameLower.includes('dragons exalted') ||
    nameLower.includes('dragon vault') ||
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
    idLower === 'hgssp' ||
    idLower === 'col1' ||
    idLower.startsWith('tk-hs') ||
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
    idLower.startsWith('dpp') ||
    idLower.startsWith('pl') ||
    idLower === 'ru1' ||
    idLower.startsWith('tk-dp') ||
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
    nameLower.includes('arceus') ||
    nameLower.includes('pokémon rumble') ||
    nameLower.includes('pokemon rumble')
  ) {
    return 'Diamond & Pearl';
  }

  // EX Series
  if (
    idLower.startsWith('ex') ||
    idLower.startsWith('exp') ||
    idLower.startsWith('tk-ex') ||
    nameLower.includes('ruby & sapphire') ||
    nameLower.includes('sandstorm') ||
    nameLower.includes('dragon') ||
    nameLower.includes('team magma') ||
    nameLower.includes('hidden legends') ||
    nameLower.includes('firered') ||
    nameLower.includes('leafgreen') ||
    nameLower.includes('team rocket returns') ||
    nameLower.includes('deoxys') ||
    nameLower.includes('emerald') ||
    nameLower.includes('unseen forces') ||
    nameLower.includes('delta species') ||
    nameLower.includes('legend maker') ||
    nameLower.includes('holon phantoms') ||
    nameLower.includes('crystal guardians') ||
    nameLower.includes('dragon frontiers') ||
    nameLower.includes('power keepers')
  ) {
    return 'EX Series';
  }

  // E-Card Series
  if (
    idLower.startsWith('ecard') ||
    idLower === 'expedition' ||
    idLower === 'aquapolis' ||
    idLower === 'skyridge' ||
    nameLower.includes('expedition') ||
    nameLower.includes('aquapolis') ||
    nameLower.includes('skyridge')
  ) {
    return 'E-Card Series';
  }

  // Neo Series
  if (
    idLower.startsWith('neo') ||
    idLower === 'si1' ||
    nameLower.includes('neo genesis') ||
    nameLower.includes('neo discovery') ||
    nameLower.includes('neo revelation') ||
    nameLower.includes('neo destiny') ||
    nameLower.includes('southern islands')
  ) {
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

  // Promos & Special / Trainer Kits
  if (
    idLower.includes('mcd') ||
    idLower.includes('promo') ||
    idLower.includes('misc') ||
    idLower.includes('tk') ||
    idLower.includes('mfb') ||
    nameLower.includes('mcdonald') ||
    nameLower.includes('promo') ||
    nameLower.includes('trainer kit') ||
    nameLower.includes('first battle')
  ) {
    return 'Promos & Special';
  }

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
  if (id === 'ecard1') return 'Expedition Base Set';
  if (id === 'ecard2') return 'Aquapolis';
  if (id === 'ecard3') return 'Skyridge';
  if (id === 'sv3pt5' || id === 'sv03.5' || id === 'sv3.5') return '151';
  if (id === 'swsh12pt5' || id === 'swsh12.5') return 'Crown Zenith';
  if (id === 'swsh10pt5' || id === 'swsh10.5') return 'Pokémon GO';
  if (id === 'swsh4pt5' || id === 'swsh4.5') return 'Shining Fates';
  if (id === 'swsh3pt5' || id === 'swsh3.5') return 'Champion\'s Path';
  if (id === 'cel25') return 'Celebrations';
  if (id === 'cel25cc') return 'Celebrations Classic Collection';
  if (id === 'dc1') return 'Double Crisis';
  if (id === 'det1') return 'Detective Pikachu';
  if (id === 'ru1') return 'Pokémon Rumble';
  if (id === 'si1') return 'Southern Islands';

  if (!rawName || rawName.toLowerCase() === 'unknown set' || rawName.toLowerCase() === 'unknown') {
    return `Set ${set.id?.toUpperCase() || ''}`;
  }

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

  const rawSymbol = set.symbolUrl || set.images?.symbol || (typeof set.symbol === 'string' ? set.symbol : '');
  const rawLogo = set.logoUrl || set.images?.logo || (typeof set.logo === 'string' ? set.logo : '');

  const symbolUrl = formatSetAssetUrl(rawSymbol);
  const logoUrl = formatSetAssetUrl(rawLogo);

  return {
    id: String(set.id || 'unknown'),
    name,
    series,
    printedTotal: cardCountOfficial,
    total: cardCountTotal,
    releaseDate: set.releaseDate || '2024-01-01',
    symbolUrl: symbolUrl || undefined,
    logoUrl: logoUrl || symbolUrl || undefined,
  };
}

/**
 * Gets the release weight/rank of a series (lower = newer).
 */
export function getSeriesWeight(seriesName: string, sets: CardSet[] = []): number {
  if (KNOWN_SERIES_WEIGHTS[seriesName] !== undefined) {
    return KNOWN_SERIES_WEIGHTS[seriesName];
  }

  const seriesSets = sets.filter((s) => s.series === seriesName);
  if (seriesSets.length > 0) {
    const maxYear = Math.max(
      ...seriesSets.map((s) => (s.releaseDate ? parseInt(s.releaseDate.substring(0, 4), 10) : 2020))
    );
    return Math.max(0, 2030 - maxYear);
  }

  return 999;
}

/**
 * Dynamically builds the series category list for UI filter pills.
 */
export function getDynamicSeriesCategories(expansions: CardSet[]): string[] {
  const seriesSet = new Set<string>();

  expansions.forEach((e) => {
    if (e.series) seriesSet.add(e.series);
  });

  DEFAULT_SERIES_CATEGORIES.forEach((cat) => {
    if (cat !== 'All') seriesSet.add(cat);
  });

  const uniqueList = Array.from(seriesSet);

  uniqueList.sort((a, b) => {
    const weightA = getSeriesWeight(a, expansions);
    const weightB = getSeriesWeight(b, expansions);
    return weightA - weightB;
  });

  return ['All', ...uniqueList];
}

/**
 * Sorts sets chronologically with newest first.
 */
export function sortSetsChronologically(sets: CardSet[]): CardSet[] {
  return [...sets].sort((a, b) => {
    const weightA = getSeriesWeight(a.series, sets);
    const weightB = getSeriesWeight(b.series, sets);
    if (weightA !== weightB) return weightA - weightB;

    const dateA = a.releaseDate || '2000-01-01';
    const dateB = b.releaseDate || '2000-01-01';
    return dateB.localeCompare(dateA);
  });
}
