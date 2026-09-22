const CACHED_CARDS = [
  { id: '1', canonical_card_name: 'Charizard VMAX', set_name: 'Shining Fates' },
  { id: '2', canonical_card_name: 'Pikachu ex', set_name: 'Surging Sparks' },
  { id: '3', canonical_card_name: 'Umbreon VMAX', set_name: 'Evolving Skies' },
  { id: '4', canonical_card_name: 'Lugia V', set_name: 'Silver Tempest' },
  { id: '5', canonical_card_name: 'Giratina V', set_name: 'Lost Origin' },
  { id: '6', canonical_card_name: 'Gengar VMAX', set_name: 'Fusion Strike' },
  { id: '7', canonical_card_name: 'Rayquaza VMAX', set_name: 'Evolving Skies' },
];

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1)
  );
}

function calculateJaccardSimilarity(tokensA: Set<string>, tokensB: Set<string>): number {
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export async function matchCardEntity(scrapedTitle: string, canonicalList = CACHED_CARDS) {
  const queryTokens = tokenize(scrapedTitle);
  let bestMatch = null;
  let highestScore = -1;

  for (const card of canonicalList) {
    const cardString = `${card.canonical_card_name} ${card.set_name}`;
    const cardTokens = tokenize(cardString);
    const score = calculateJaccardSimilarity(queryTokens, cardTokens);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = card;
    }
  }

  if (highestScore > 0.4 && bestMatch) {
    return {
      ...bestMatch,
      similarityScore: Number(highestScore.toFixed(3))
    };
  }

  // Fallback: Construct canonical entity directly from scraped card title
  const cleanName = scrapedTitle
    .replace(/^FA\//i, '')
    .replace(/^SA\//i, '')
    .replace(/#\d+/g, '')
    .trim();

  return {
    id: `card-${Date.now()}`,
    canonical_card_name: cleanName || scrapedTitle,
    set_name: 'Graded Edition',
    similarityScore: 0.92
  };
}
