import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  console.log('[SpeciesGenerator] Fetching National Pokedex from Pokédex Everything repository...');
  const res = await fetch('https://raw.githubusercontent.com/Pokedex100-News/pokedexEverything/main/data.json');
  const data = await res.json();

  const speciesMap: Record<string, string[]> = {};

  for (const p of data) {
    if (p.name && p.name.english) {
      const baseName = p.name.english;
      if (p.formData && p.formData.length > 0) {
        for (const f of p.formData) {
          const formName = (f.formName || f.form || '').trim();
          const types = f.type || [];
          if (types.length > 0) {
            // Register base name
            if (!speciesMap[baseName.toLowerCase()]) {
              speciesMap[baseName.toLowerCase()] = types;
            }
            // Register form name (e.g. "Alolan Ninetales", "Galarian Zapdos", "Hisuian Zoroark")
            if (formName && formName.toLowerCase() !== 'default' && formName.toLowerCase() !== baseName.toLowerCase()) {
              speciesMap[formName.toLowerCase()] = types;
              speciesMap[`${formName} ${baseName}`.toLowerCase()] = types;
            }
          }
        }
      }
    }
  }

  // Explicit regional forms, paradox Pokémon, special forms & legendaries
  const manualOverrides: Record<string, string[]> = {
    // Gen 1
    gengar: ['Ghost', 'Poison'],
    haunter: ['Ghost', 'Poison'],
    gastly: ['Ghost', 'Poison'],
    charizard: ['Fire', 'Flying'],
    lugia: ['Psychic', 'Flying'],
    giratina: ['Ghost', 'Dragon'],
    umbreon: ['Dark'],
    espeon: ['Psychic'],
    vaporeon: ['Water'],
    jolteon: ['Electric'],
    flareon: ['Fire'],
    leafeon: ['Grass'],
    glaceon: ['Ice'],
    sylveon: ['Fairy'],
    eevee: ['Normal'],
    mew: ['Psychic'],
    mewtwo: ['Psychic'],
    pikachu: ['Electric'],
    raichu: ['Electric'],
    gyarados: ['Water', 'Flying'],
    magikarp: ['Water'],
    snorlax: ['Normal'],
    dragonite: ['Dragon', 'Flying'],
    dragonair: ['Dragon'],
    dratini: ['Dragon'],
    blastoise: ['Water'],
    venusaur: ['Grass', 'Poison'],
    articuno: ['Ice', 'Flying'],
    zapdos: ['Electric', 'Flying'],
    moltres: ['Fire', 'Flying'],
    arcanine: ['Fire'],
    ninetales: ['Fire'],
    lapras: ['Water', 'Ice'],
    alakazam: ['Psychic'],
    machamp: ['Fighting'],

    // Alolan
    'alolan raichu': ['Electric', 'Psychic'],
    'alolan ninetales': ['Ice', 'Fairy'],
    'alolan vulpix': ['Ice'],
    'alolan marowak': ['Fire', 'Ghost'],
    'alolan exeggutor': ['Grass', 'Dragon'],
    'alolan muk': ['Poison', 'Dark'],
    'alolan grimer': ['Poison', 'Dark'],
    'alolan meowth': ['Dark'],
    'alolan persian': ['Dark'],
    'alolan sandshrew': ['Ice', 'Steel'],
    'alolan sandslash': ['Ice', 'Steel'],

    // Galarian
    'galarian zapdos': ['Fighting', 'Flying'],
    'galarian articuno': ['Psychic', 'Flying'],
    'galarian moltres': ['Dark', 'Flying'],
    'galarian ponyta': ['Psychic'],
    'galarian rapidash': ['Psychic', 'Fairy'],
    'galarian weezing': ['Poison', 'Fairy'],
    'galarian meowth': ['Steel'],
    'galarian perrserker': ['Steel'],
    'galarian slowpoke': ['Psychic'],
    'galarian slowbro': ['Poison', 'Psychic'],
    'galarian slowking': ['Poison', 'Psychic'],
    'galarian darumaka': ['Ice'],
    'galarian darmanitan': ['Ice'],
    'galarian zigzaagon': ['Dark', 'Normal'],
    'galarian linoone': ['Dark', 'Normal'],
    'galarian obstagoon': ['Dark', 'Normal'],
    'galarian corsola': ['Ghost'],
    'galarian cursola': ['Ghost'],

    // Hisuian
    'hisuian zoroark': ['Normal', 'Ghost'],
    'hisuian zorua': ['Normal', 'Ghost'],
    'hisuian typhlosion': ['Fire', 'Ghost'],
    'hisuian arcanine': ['Fire', 'Rock'],
    'hisuian growlithe': ['Fire', 'Rock'],
    'hisuian decidueye': ['Grass', 'Fighting'],
    'hisuian samurott': ['Water', 'Dark'],
    'hisuian lilligant': ['Grass', 'Fighting'],
    'hisuian goodra': ['Steel', 'Dragon'],
    'hisuian sliggoo': ['Steel', 'Dragon'],
    'hisuian braviary': ['Psychic', 'Flying'],
    'hisuian avalugg': ['Ice', 'Rock'],
    'hisuian sneasel': ['Fighting', 'Poison'],
    'hisuian sneasler': ['Fighting', 'Poison'],
    'hisuian voltorb': ['Electric', 'Grass'],
    'hisuian electrode': ['Electric', 'Grass'],
    'hisuian qwilfish': ['Dark', 'Poison'],
    'hisuian overqwil': ['Dark', 'Poison'],

    // Paldean
    'paldean clodsire': ['Poison', 'Ground'],
    'paldean wooper': ['Poison', 'Ground'],
    clodsire: ['Poison', 'Ground'],
    'paldean tauros': ['Fighting'],

    // Paradoxes
    'iron valiant': ['Fairy', 'Fighting'],
    'roaring moon': ['Dragon', 'Dark'],
    'great tusk': ['Ground', 'Fighting'],
    'scream tail': ['Fairy', 'Psychic'],
    'brute bonnet': ['Grass', 'Dark'],
    'flutter mane': ['Ghost', 'Fairy'],
    'slither wing': ['Bug', 'Fighting'],
    'sandy shocks': ['Electric', 'Ground'],
    'iron treads': ['Ground', 'Steel'],
    'iron bundle': ['Ice', 'Water'],
    'iron hands': ['Fighting', 'Electric'],
    'iron jugulis': ['Dark', 'Flying'],
    'iron moth': ['Fire', 'Poison'],
    'iron thorns': ['Rock', 'Electric'],
    'iron leaves': ['Grass', 'Psychic'],
    'iron crown': ['Steel', 'Psychic'],
    'iron boulder': ['Rock', 'Psychic'],
    'walking wake': ['Water', 'Dragon'],
    'gouging fire': ['Fire', 'Dragon'],
    'raging bolt': ['Electric', 'Dragon'],
    koraidon: ['Fighting', 'Dragon'],
    miraidon: ['Electric', 'Dragon'],
    'ting-lu': ['Dark', 'Ground'],
    'chien-pao': ['Dark', 'Ice'],
    'wo-chien': ['Dark', 'Grass'],
    'chi-yu': ['Dark', 'Fire'],
    ogerpon: ['Grass'],
    terapagos: ['Normal'],
    pecharunt: ['Poison', 'Ghost'],
    tinkaton: ['Fairy', 'Steel'],
    tinkatuff: ['Fairy', 'Steel'],
    tinkatink: ['Fairy', 'Steel'],
    mimikyu: ['Ghost', 'Fairy'],
    baxcalibur: ['Dragon', 'Ice'],
    arctibax: ['Dragon', 'Ice'],
    frigibax: ['Dragon', 'Ice'],
    gholdengo: ['Steel', 'Ghost'],
    gimmighoul: ['Ghost'],
    ceruledge: ['Fire', 'Ghost'],
    armarouge: ['Fire', 'Psychic'],
    meowscarada: ['Grass', 'Dark'],
    skeledirge: ['Fire', 'Ghost'],
    quaquaval: ['Water', 'Fighting'],

    // Legendaries & Gen 2-8
    ho_oh: ['Fire', 'Flying'],
    'ho-oh': ['Fire', 'Flying'],
    rayquaza: ['Dragon', 'Flying'],
    kyogre: ['Water'],
    groudon: ['Ground'],
    dialga: ['Steel', 'Dragon'],
    palkia: ['Water', 'Dragon'],
    arceus: ['Normal'],
    reshiram: ['Dragon', 'Fire'],
    zekrom: ['Dragon', 'Electric'],
    kyurem: ['Dragon', 'Ice'],
    xerneas: ['Fairy'],
    yveltal: ['Dark', 'Flying'],
    zygarde: ['Dragon', 'Ground'],
    solgaleo: ['Psychic', 'Steel'],
    lunala: ['Psychic', 'Ghost'],
    necrozma: ['Psychic'],
    zacian: ['Fairy', 'Steel'],
    zamazenta: ['Fighting', 'Steel'],
    eternatus: ['Poison', 'Dragon'],
    urshifu: ['Fighting', 'Dark'],
    calyrex: ['Psychic', 'Grass'],
  };

  Object.assign(speciesMap, manualOverrides);

  const fileContent = `/**
 * Canonical National Pokédex Species Types Directory
 * Auto-generated with complete 1,025+ Pokémon franchise species typings (Gen 1 - Gen 9).
 */

export type PokemonSpeciesType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Steel'
  | 'Fairy'
  | 'Dark';

export const POKEMON_SPECIES_TYPES: Record<string, PokemonSpeciesType[]> = ${JSON.stringify(speciesMap, null, 2)};

/**
 * Resolves authentic National Dex Pokémon species types from any card title,
 * stripping TCG card suffixes (VMAX, ex, GX, VSTAR, etc.), handling Tag Teams,
 * and mapping regional/paradox variants accurately.
 */
export function getPokemonSpeciesTypes(
  cardName: string,
  category?: string,
  rawCardTypes?: string[]
): PokemonSpeciesType[] {
  if (!cardName) return [];

  const lowerCategory = (category || '').toLowerCase();
  if (
    lowerCategory.includes('trainer') ||
    lowerCategory.includes('energy') ||
    lowerCategory.includes('item') ||
    lowerCategory.includes('supporter') ||
    lowerCategory.includes('stadium')
  ) {
    return [];
  }

  // 1. Clean annotations like "(Alternate Art)", "(Special Illustration Rare)", "- Special", etc.
  const cleanName = cardName
    .replace(/\\s*\\([^)]*\\)/g, '')
    .replace(/\\s+-\\s+.*$/, '')
    .trim();

  // 2. Handle Tag Team cards (e.g. "Pikachu & Zekrom GX", "Reshiram & Charizard GX")
  if (cleanName.includes(' & ') || cleanName.includes(' and ')) {
    const parts = cleanName.split(/\\s+(?:&|and)\\s+/);
    const combined: PokemonSpeciesType[] = [];
    for (const part of parts) {
      const partTypes = getPokemonSpeciesTypes(part, category);
      for (const t of partTypes) {
        if (!combined.includes(t)) {
          combined.push(t);
        }
      }
    }
    if (combined.length > 0) return combined;
  }

  // 3. Strip common TCG gameplay suffixes
  const suffixPattern = /\\s+(?:VMAX|VSTAR|V-UNION|V-Union|V|ex|EX|GX|BREAK|LV\\.X|Lv\\.X|Prime|LEGEND|STAR|\\*|SP|FB|GL|C|G|Four|Single Strike|Rapid Strike|Fusion Strike)$/i;
  const stripped = cleanName.replace(suffixPattern, '').trim();

  // 4. Strip common card title prefixes (e.g., "Radiant", "Shining", "Dark", "Light")
  const prefixPattern = /^(?:Radiant|Shining|Dark|Light|Shadow|Mega|M|Origin Forme|Dusk Mane|Dawn Wings|Ultra|Primal|Black|White|Ash-|Rocket's|Team Aqua's|Team Magma's|Brock's|Misty's|Lt\\. Surge's|Erika's|Koga's|Sabrina's|Blaine's|Giovanni's)\\s+/i;
  const baseOnly = stripped.replace(prefixPattern, '').trim();

  // 5. Candidate lookups in order of specificity
  const candidates = [
    stripped.toLowerCase(),
    cleanName.toLowerCase(),
    baseOnly.toLowerCase(),
    stripped.toLowerCase().replace(/[^a-z0-9]/g, ''),
    baseOnly.toLowerCase().replace(/[^a-z0-9]/g, ''),
  ];

  for (const candidate of candidates) {
    if (POKEMON_SPECIES_TYPES[candidate]) {
      return POKEMON_SPECIES_TYPES[candidate];
    }
  }

  // 6. Substring scan if base species name is contained in the card name
  const nameWords = baseOnly.toLowerCase().split(/\\s+/);
  for (const word of nameWords) {
    if (word.length >= 3 && POKEMON_SPECIES_TYPES[word]) {
      return POKEMON_SPECIES_TYPES[word];
    }
  }

  // 7. Fallback to raw card types mapped to 18-type standard
  if (rawCardTypes && rawCardTypes.length > 0) {
    return rawCardTypes.map((t) => {
      if (t === 'Darkness') return 'Dark';
      if (t === 'Lightning') return 'Electric';
      if (t === 'Metal') return 'Steel';
      if (t === 'Colorless') return 'Normal';
      return t as PokemonSpeciesType;
    });
  }

  return ['Normal'];
}
`;

  const outputPath = path.join(process.cwd(), 'src/data/pokemonSpeciesTypes.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`[SpeciesGenerator] Successfully wrote dataset with ${Object.keys(speciesMap).length} species entries to ${outputPath}`);
}

generate().catch(console.error);
