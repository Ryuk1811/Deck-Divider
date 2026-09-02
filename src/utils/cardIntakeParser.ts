import { PokemonCard, PortfolioCardEntry, EnergyType } from '../types';
import { searchCards, mapToPokemonCard, getCardById } from '../lib/searchEngine';
import { FALLBACK_CARDS } from '../data/fallbackCards';

export interface ParsedCardResult {
  rawLine: string;
  matchedCard: PokemonCard;
  quantity: number;
  condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
  isGraded: boolean;
  gradingCompany?: 'PSA' | 'BGS' | 'CGC' | 'ACE';
  gradeScore?: number;
  certNumber?: string;
  purchasePrice?: number;
}

/**
 * Parses raw text where each line is a card name, code, or description.
 * Examples:
 *   Charizard ex 199 151
 *   2x Umbreon VMAX 215 (PSA 10) $1120
 *   Pikachu with Grey Felt Hat Promo
 *   Giratina V 186 Lost Origin LP $380
 *   Gengar VMAX CGC 10 Cert# 40918230
 */
export function parseBulkCardText(rawText: string): {
  successList: ParsedCardResult[];
  unmatchedLines: string[];
} {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  const successList: ParsedCardResult[] = [];
  const unmatchedLines: string[] = [];

  for (const line of lines) {
    let clean = line;

    // 1. Extract Quantity (e.g. "2x", "4x", "1 ")
    let quantity = 1;
    const qtyMatch = clean.match(/^(\d+)[xX\s]+/);
    if (qtyMatch) {
      quantity = Math.max(1, parseInt(qtyMatch[1], 10));
      clean = clean.replace(/^(\d+)[xX\s]+/, '').trim();
    }

    // 2. Extract Purchase Price (e.g. "$245.50", "245.50$")
    let purchasePrice: number | undefined;
    const priceMatch = clean.match(/\$([0-9]+(?:\.[0-9]{1,2})?)|([0-9]+(?:\.[0-9]{1,2})?)\$/);
    if (priceMatch) {
      const p = parseFloat(priceMatch[1] || priceMatch[2]);
      if (!isNaN(p) && p > 0) {
        purchasePrice = p;
      }
      clean = clean.replace(/\$([0-9]+(?:\.[0-9]{1,2})?)|([0-9]+(?:\.[0-9]{1,2})?)\$/, '').trim();
    }

    // 3. Extract Grading Info (PSA 10, BGS 9.5, CGC 10, ACE 10)
    let isGraded = false;
    let gradingCompany: 'PSA' | 'BGS' | 'CGC' | 'ACE' | undefined;
    let gradeScore: number | undefined;
    let certNumber: string | undefined;

    const gradeMatch = clean.match(/\b(PSA|BGS|CGC|ACE)\s*([0-9]+(?:\.[0-9])?)\b/i);
    if (gradeMatch) {
      isGraded = true;
      gradingCompany = gradeMatch[1].toUpperCase() as any;
      gradeScore = parseFloat(gradeMatch[2]);
      clean = clean.replace(gradeMatch[0], '').trim();
    }

    // 4. Extract Cert Number (e.g. "Cert# 12345678", "cert 12345678")
    const certMatch = clean.match(/\b(?:cert|cert#|certificate)\s*[:#]?\s*([0-9]{5,10})\b/i);
    if (certMatch) {
      certNumber = certMatch[1];
      clean = clean.replace(certMatch[0], '').trim();
    }

    // 5. Extract Condition (NM, LP, MP, HP, DMG)
    let condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG' = 'NM';
    const condMatch = clean.match(/\b(NM|LP|MP|HP|DMG|Near Mint|Lightly Played|Moderately Played|Heavily Played|Damaged)\b/i);
    if (condMatch) {
      const c = condMatch[1].toUpperCase();
      if (c.includes('NEAR') || c === 'NM') condition = 'NM';
      else if (c.includes('LIGHT') || c === 'LP') condition = 'LP';
      else if (c.includes('MOD') || c === 'MP') condition = 'MP';
      else if (c.includes('HEAV') || c === 'HP') condition = 'HP';
      else if (c.includes('DAM') || c === 'DMG') condition = 'DMG';
      clean = clean.replace(condMatch[0], '').trim();
    }

    // Remove stray parentheses, brackets, commas
    clean = clean.replace(/[()[\]{},]/g, ' ').replace(/\s+/g, ' ').trim();

    if (!clean) {
      unmatchedLines.push(line);
      continue;
    }

    // Perform query matching
    const matched = findBestCardMatch(clean);
    if (matched) {
      successList.push({
        rawLine: line,
        matchedCard: matched,
        quantity,
        condition,
        isGraded,
        gradingCompany,
        gradeScore,
        certNumber,
        purchasePrice: purchasePrice ?? matched.prices.raw,
      });
    } else {
      unmatchedLines.push(line);
    }
  }

  return { successList, unmatchedLines };
}

/**
 * Parses raw CSV string data into cards
 */
export function parseCsvCardData(csvText: string): {
  successList: ParsedCardResult[];
  unmatchedLines: string[];
} {
  const lines = csvText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { successList: [], unmatchedLines: [] };
  }

  // Detect header indices
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const nameIdx = headers.findIndex((h) => h === 'name' || h === 'card' || h === 'card name' || h === 'product name' || h === 'card_name');
  const setIdx = headers.findIndex((h) => h === 'set' || h === 'set name' || h === 'set_name' || h === 'expansion');
  const numberIdx = headers.findIndex((h) => h === 'number' || h === 'card number' || h === 'card_number' || h === 'card #' || h === '#');
  const qtyIdx = headers.findIndex((h) => h === 'quantity' || h === 'qty' || h === 'count');
  const condIdx = headers.findIndex((h) => h === 'condition' || h === 'cond');
  const gradeIdx = headers.findIndex((h) => h === 'grade' || h === 'grading' || h === 'psa/bgs');
  const compIdx = headers.findIndex((h) => h === 'grading company' || h === 'company' || h === 'grader');
  const certIdx = headers.findIndex((h) => h === 'cert' || h === 'cert number' || h === 'cert_number' || h === 'certificate');
  const priceIdx = headers.findIndex((h) => h === 'price' || h === 'purchase price' || h === 'cost' || h === 'buy price' || h === 'market price');

  const dataRows = (nameIdx !== -1 || setIdx !== -1) ? lines.slice(1) : lines;

  const successList: ParsedCardResult[] = [];
  const unmatchedLines: string[] = [];

  for (const row of dataRows) {
    // Basic CSV split respecting quotes
    const cells = splitCsvRow(row);
    if (cells.length === 0) continue;

    let cardName = '';
    let setName = '';
    let cardNumber = '';
    let quantity = 1;
    let condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG' = 'NM';
    let isGraded = false;
    let gradingCompany: 'PSA' | 'BGS' | 'CGC' | 'ACE' | undefined;
    let gradeScore: number | undefined;
    let certNumber: string | undefined;
    let purchasePrice: number | undefined;

    if (nameIdx !== -1 && cells[nameIdx]) {
      cardName = cells[nameIdx].trim();
      if (setIdx !== -1 && cells[setIdx]) setName = cells[setIdx].trim();
      if (numberIdx !== -1 && cells[numberIdx]) cardNumber = cells[numberIdx].trim();
      if (qtyIdx !== -1 && cells[qtyIdx]) quantity = Math.max(1, parseInt(cells[qtyIdx], 10) || 1);
      if (condIdx !== -1 && cells[condIdx]) {
        const c = cells[condIdx].toUpperCase();
        if (c.includes('NEAR') || c === 'NM') condition = 'NM';
        else if (c.includes('LIGHT') || c === 'LP') condition = 'LP';
        else if (c.includes('MOD') || c === 'MP') condition = 'MP';
        else if (c.includes('HEAV') || c === 'HP') condition = 'HP';
        else if (c.includes('DAM') || c === 'DMG') condition = 'DMG';
      }
      if (gradeIdx !== -1 && cells[gradeIdx]) {
        const gStr = cells[gradeIdx].trim();
        const gMatch = gStr.match(/([0-9]+(?:\.[0-9])?)/);
        if (gMatch) {
          isGraded = true;
          gradeScore = parseFloat(gMatch[1]);
        }
      }
      if (compIdx !== -1 && cells[compIdx]) {
        const c = cells[compIdx].toUpperCase().trim();
        if (['PSA', 'BGS', 'CGC', 'ACE'].includes(c)) {
          isGraded = true;
          gradingCompany = c as any;
        }
      }
      if (certIdx !== -1 && cells[certIdx]) {
        certNumber = cells[certIdx].trim();
      }
      if (priceIdx !== -1 && cells[priceIdx]) {
        const p = parseFloat(cells[priceIdx].replace(/[^0-9.]/g, ''));
        if (!isNaN(p) && p > 0) purchasePrice = p;
      }
    } else {
      // Freeform comma-separated line (e.g. "Charizard ex, 151, 199, 1, NM, $185")
      cardName = cells[0] || '';
      setName = cells[1] || '';
      cardNumber = cells[2] || '';
    }

    const searchQuery = [cardName, setName, cardNumber].filter(Boolean).join(' ');
    if (!searchQuery) {
      unmatchedLines.push(row);
      continue;
    }

    const matched = findBestCardMatch(searchQuery);
    if (matched) {
      successList.push({
        rawLine: row,
        matchedCard: matched,
        quantity,
        condition,
        isGraded,
        gradingCompany,
        gradeScore,
        certNumber,
        purchasePrice: purchasePrice ?? matched.prices.raw,
      });
    } else {
      unmatchedLines.push(row);
    }
  }

  return { successList, unmatchedLines };
}

/**
 * Searches local search engine and fallback catalogs to find best card match
 */
export function findBestCardMatch(query: string): PokemonCard | null {
  const cleanQ = query.trim().toLowerCase();

  // Try exact searchCards query
  try {
    const hits = searchCards({ query: cleanQ });
    if (hits.length > 0) {
      return mapToPokemonCard(hits[0]);
    }
  } catch (e) {
    // Non-fatal, fallback to manual scan
  }

  // Manual scan on fallback cards
  const tokens = cleanQ.split(/\s+/);
  let bestCard: PokemonCard | null = null;
  let bestScore = 0;

  for (const raw of FALLBACK_CARDS) {
    const c = mapToPokemonCard(raw);
    const cardText = `${c.name} ${c.set.name} ${c.number}`.toLowerCase();
    let score = 0;

    for (const t of tokens) {
      if (cardText.includes(t)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCard = c;
    }
  }

  if (bestScore > 0 && bestCard) {
    return bestCard;
  }

  return null;
}

function splitCsvRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

export function generateSampleCsvTemplate(): string {
  return `Card Name,Set Name,Card Number,Quantity,Condition,Grade,Grading Company,Cert Number,Purchase Price
Charizard ex,151,199/165,1,NM,10,PSA,83921044,185.00
Umbreon VMAX,Evolving Skies,215/203,1,NM,9.5,BGS,001482910,780.00
Pikachu with Grey Felt Hat,Scarlet & Violet Promos,SVP 085,1,NM,10,PSA,89104421,160.00
Giratina V,Lost Origin,186/196,1,NM,,,380.00
Gengar VMAX,Fusion Strike,271/264,1,NM,10,CGC,40918230,340.00
Lugia V,Silver Tempest,186/195,1,NM,,,190.00
Mew ex (Bubble Mew),Paldean Fates,232/091,1,NM,10,PSA,92837105,95.00
Blastoise ex,151,200/165,1,NM,,,50.00`;
}
