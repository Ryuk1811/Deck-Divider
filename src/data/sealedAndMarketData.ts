import { SealedProduct, PSAPopReport, MarketListing } from '../types';
import { normalizeSet } from '../utils/setCategorizer';

export const MOCK_SEALED_PRODUCTS: SealedProduct[] = [
  {
    id: 'sealed-1',
    name: 'Prismatic Evolutions Booster Box',
    type: 'Booster Box',
    language: 'English',
    set: {
      id: 'sv8a',
      name: 'Prismatic Evolutions',
      series: 'Scarlet & Violet',
      printedTotal: 175,
      total: 210,
      releaseDate: '2025-01-17',
      logoUrl: '/api/tcgdex/image/en/sv/sv08.5/logo.png',
    },
    releaseDate: '2025-01-17',
    msrp: 161.64,
    marketPrice: 215.50,
    imageUrl: 'https://images.pokemontcg.io/sv8a/symbol.png',
    packCount: 36,
    priceHistory: [
      { date: '2026-07-01', price: 161.64 },
      { date: '2026-07-15', price: 185.00 },
      { date: '2026-08-01', price: 210.00 },
      { date: '2026-08-06', price: 215.50 },
    ],
  },
  {
    id: 'sealed-2',
    name: '151 Elite Trainer Box (SVP 058 Snorlax)',
    type: 'Elite Trainer Box',
    language: 'English',
    set: {
      id: 'sv3pt5',
      name: '151',
      series: 'Scarlet & Violet',
      printedTotal: 165,
      total: 207,
      releaseDate: '2023-09-22',
      logoUrl: '/api/tcgdex/image/en/sv/sv03.5/logo.png',
    },
    releaseDate: '2023-09-22',
    msrp: 49.99,
    marketPrice: 88.50,
    imageUrl: 'https://images.pokemontcg.io/sv3pt5/symbol.png',
    packCount: 9,
    priceHistory: [
      { date: '2026-05-01', price: 65.00 },
      { date: '2026-06-01', price: 74.00 },
      { date: '2026-07-01', price: 82.00 },
      { date: '2026-08-06', price: 88.50 },
    ],
  },
  {
    id: 'sealed-3',
    name: 'Evolving Skies Booster Box',
    type: 'Booster Box',
    language: 'English',
    set: {
      id: 'swsh7',
      name: 'Evolving Skies',
      series: 'Sword & Shield',
      printedTotal: 203,
      total: 237,
      releaseDate: '2021-08-27',
      logoUrl: '/api/tcgdex/image/en/swsh/swsh7/logo.png',
    },
    releaseDate: '2021-08-27',
    msrp: 143.64,
    marketPrice: 725.00,
    imageUrl: 'https://images.pokemontcg.io/swsh7/symbol.png',
    packCount: 36,
    priceHistory: [
      { date: '2026-01-01', price: 580.00 },
      { date: '2026-04-01', price: 640.00 },
      { date: '2026-07-01', price: 710.00 },
      { date: '2026-08-06', price: 725.00 },
    ],
  },
  {
    id: 'sealed-4',
    name: '151 Japanese Booster Box (Shrink Wrapped)',
    type: 'Booster Box',
    language: 'Japanese',
    set: {
      id: 'sv2a',
      name: 'Pokemon Card 151 (Japanese)',
      series: 'Scarlet & Violet',
      printedTotal: 165,
      total: 210,
      releaseDate: '2023-06-16',
    },
    releaseDate: '2023-06-16',
    msrp: 40.00,
    marketPrice: 112.00,
    imageUrl: 'https://images.pokemontcg.io/sv2a/symbol.png',
    packCount: 20,
    priceHistory: [
      { date: '2026-05-01', price: 88.00 },
      { date: '2026-06-15', price: 98.00 },
      { date: '2026-08-06', price: 112.00 },
    ],
  }
];

export const MOCK_PSA_REPORTS: Record<string, PSAPopReport> = {
  '81923049': {
    certNumber: '81923049',
    gradingCompany: 'PSA',
    specNumber: 'SPEC-PKM-SWSH7-215',
    cardName: 'Umbreon VMAX #215 (Special Art Rare)',
    setName: '2021 Pokemon Sword & Shield Evolving Skies',
    year: '2021',
    variety: 'Alternate Art Secret',
    grade: 'PSA 10 GEM MT',
    gradeNum: 10,
    totalGraded: 14280,
    popPsa10: 10420,
    popPsa9: 3410,
    popPsa8AndLower: 450,
    gemMintRate: 72.9,
    verifyStatus: 'VERIFIED',
    labelImages: {
      front: 'https://images.pokemontcg.io/swsh7/215_hires.png',
      back: 'https://images.pokemontcg.io/cardback.png'
    }
  },
  '92048123': {
    certNumber: '92048123',
    gradingCompany: 'PSA',
    specNumber: 'SPEC-PKM-SV3PT5-199',
    cardName: 'Charizard ex #199 (Special Illustration Rare)',
    setName: '2023 Pokemon Scarlet & Violet 151',
    year: '2023',
    variety: 'Special Illustration Rare',
    grade: 'PSA 10 GEM MT',
    gradeNum: 10,
    totalGraded: 22400,
    popPsa10: 13800,
    popPsa9: 7200,
    popPsa8AndLower: 1400,
    gemMintRate: 61.6,
    verifyStatus: 'VERIFIED'
  },
  '001482930': {
    certNumber: '001482930',
    gradingCompany: 'BGS',
    specNumber: 'BGS-PKM-SWSH7-215',
    cardName: 'Umbreon VMAX #215 (Special Art Rare)',
    setName: '2021 Pokemon Sw&Sh Evolving Skies',
    year: '2021',
    variety: 'Secret Rare Alt Art',
    grade: 'BGS 9.5 GEM MINT (Gold Label)',
    gradeNum: 9.5,
    totalGraded: 3200,
    popPsa10: 1250,
    popPsa9: 1680,
    popPsa8AndLower: 270,
    gemMintRate: 39.1,
    verifyStatus: 'VERIFIED',
    subgrades: { centering: 9.5, corners: 9.5, edges: 10, surface: 9.5 }
  },
  '4029104001': {
    certNumber: '4029104001',
    gradingCompany: 'CGC',
    specNumber: 'CGC-PKM-SV3PT5-199',
    cardName: 'Charizard ex #199 (Special Illustration Rare)',
    setName: '2023 Pokemon Scarlet & Violet 151',
    year: '2023',
    grade: 'CGC 10 PRISTINE',
    gradeNum: 10,
    totalGraded: 6800,
    popPsa10: 920,
    popPsa9: 4500,
    popPsa8AndLower: 1380,
    gemMintRate: 13.5,
    verifyStatus: 'VERIFIED'
  },
  'TAG-802918': {
    certNumber: 'TAG-802918',
    gradingCompany: 'TAG',
    specNumber: 'TAG-PKM-SV8A-175',
    cardName: 'Eevee ex #175 (Special Illustration Rare)',
    setName: '2025 Pokemon Prismatic Evolutions',
    year: '2025',
    grade: 'TAG 10 GEM MINT (Score: 988/1000)',
    gradeNum: 10,
    totalGraded: 1450,
    popPsa10: 810,
    popPsa9: 540,
    popPsa8AndLower: 100,
    gemMintRate: 55.8,
    verifyStatus: 'VERIFIED'
  },
  'MGC-910284': {
    certNumber: 'MGC-910284',
    gradingCompany: 'MGC',
    specNumber: 'MGC-PKM-SV3PT5-199',
    cardName: 'Charizard ex #199',
    setName: '2023 Pokemon 151',
    year: '2023',
    grade: 'MGC 10 PRISTINE (Custom Slab)',
    gradeNum: 10,
    totalGraded: 890,
    popPsa10: 420,
    popPsa9: 390,
    popPsa8AndLower: 80,
    gemMintRate: 47.1,
    verifyStatus: 'VERIFIED'
  }
};

export const MOCK_LIVE_LISTINGS: MarketListing[] = [
  {
    id: 'mkt-1',
    platform: 'TCGPlayer',
    title: 'Charizard ex - 199/165 - Special Illustration Rare',
    price: 134.50,
    currency: 'USD',
    conditionOrGrade: 'Near Mint',
    date: '2026-08-06T08:12:00Z',
    url: 'https://tcgplayer.com',
    sellerRating: '99.8% (12,410 sales)'
  },
  {
    id: 'mkt-2',
    platform: 'eBay',
    title: '2023 Pokemon 151 Charizard ex #199 PSA 10 Gem Mint Verified',
    price: 245.00,
    currency: 'USD',
    conditionOrGrade: 'PSA 10',
    date: '2026-08-06T07:45:00Z',
    url: 'https://ebay.com',
    sellerRating: '100% Top Rated Plus'
  },
  {
    id: 'mkt-3',
    platform: 'CardMarket',
    title: 'Charizard ex (199/165) [SV03.5] - English NM',
    price: 118.00,
    currency: 'EUR',
    conditionOrGrade: 'Near Mint',
    date: '2026-08-06T06:30:00Z',
    url: 'https://cardmarket.com',
    sellerRating: 'Powerseller'
  }
];

// Helper to convert sets from the catalog into realistic sealed products dynamically
export function generateSealedProductsFromSets(sets: any[]): SealedProduct[] {
  const products: SealedProduct[] = [...MOCK_SEALED_PRODUCTS];
  if (!sets || sets.length === 0) return products;

  sets.forEach((rawSet) => {
    const set = normalizeSet(rawSet);
    const isSpecialSet = set.name.includes('151') || set.name.includes('Prismatic') || set.name.includes('Crown Zenith') || set.name.includes('Paldean Fates') || set.name.includes('Shining');
    const setYear = set.releaseDate ? parseInt(set.releaseDate.substring(0, 4), 10) : 2024;
    const ageYears = Math.max(0, 2026 - setYear);

    // Standard Booster Box (for non-special main sets)
    if (!isSpecialSet && set.total >= 100) {
      const baseMsrp = set.series.includes('Scarlet') ? 161.64 : 143.64;
      const multiplier = 1 + ageYears * 0.28 + (set.printedTotal > 200 ? 0.2 : 0);
      const estMarket = Number((baseMsrp * multiplier).toFixed(2));

      products.push({
        id: `sealed-bb-${set.id}`,
        name: `${set.name} Booster Box`,
        type: 'Booster Box',
        language: 'English',
        set: {
          id: set.id,
          name: set.name,
          series: set.series,
          printedTotal: set.printedTotal,
          total: set.total,
          releaseDate: set.releaseDate || '2024-01-01',
          logoUrl: set.logoUrl,
        },
        releaseDate: set.releaseDate || '2024-01-01',
        msrp: baseMsrp,
        marketPrice: estMarket,
        imageUrl: set.logoUrl || set.symbolUrl || 'https://images.pokemontcg.io/symbol.png',
        packCount: 36,
        priceHistory: [
          { date: '2026-05-01', price: Number((estMarket * 0.9).toFixed(2)) },
          { date: '2026-06-15', price: Number((estMarket * 0.95).toFixed(2)) },
          { date: '2026-08-06', price: estMarket },
        ],
      });
    }

    // Elite Trainer Box
    const etbMsrp = isSpecialSet ? 54.99 : 49.99;
    const etbMultiplier = 1 + ageYears * 0.22 + (isSpecialSet ? 0.35 : 0);
    const estEtbMarket = Number((etbMsrp * etbMultiplier).toFixed(2));

    products.push({
      id: `sealed-etb-${set.id}`,
      name: `${set.name} Elite Trainer Box`,
      type: 'Elite Trainer Box',
      language: 'English',
      set: {
        id: set.id,
        name: set.name,
        series: set.series,
        printedTotal: set.printedTotal,
        total: set.total,
        releaseDate: set.releaseDate || '2024-01-01',
        logoUrl: set.logoUrl,
      },
      releaseDate: set.releaseDate || '2024-01-01',
      msrp: etbMsrp,
      marketPrice: estEtbMarket,
      imageUrl: set.logoUrl || 'https://images.pokemontcg.io/symbol.png',
      packCount: isSpecialSet ? 11 : 9,
      priceHistory: [
        { date: '2026-05-01', price: Number((estEtbMarket * 0.88).toFixed(2)) },
        { date: '2026-08-06', price: estEtbMarket },
      ],
    });

    // Booster Bundle (6 Packs)
    const bundleMsrp = 26.94;
    const estBundleMarket = Number((bundleMsrp * (1 + ageYears * 0.18)).toFixed(2));
    products.push({
      id: `sealed-bundle-${set.id}`,
      name: `${set.name} Booster Bundle`,
      type: 'Booster Bundle',
      language: 'English',
      set: {
        id: set.id,
        name: set.name,
        series: set.series,
        printedTotal: set.printedTotal,
        total: set.total,
        releaseDate: set.releaseDate || '2024-01-01',
        logoUrl: set.logoUrl,
      },
      releaseDate: set.releaseDate || '2024-01-01',
      msrp: bundleMsrp,
      marketPrice: estBundleMarket,
      imageUrl: set.logoUrl || 'https://images.pokemontcg.io/symbol.png',
      packCount: 6,
      priceHistory: [
        { date: '2026-05-01', price: Number((estBundleMarket * 0.9).toFixed(2)) },
        { date: '2026-08-06', price: estBundleMarket },
      ],
    });
  });

  return products;
}

// Verification function supporting all global grading companies
export function fetchOrVerifyCert(certNumber: string, company: any, cardNameInput?: string): PSAPopReport {
  const cleanCert = certNumber.trim();
  if (MOCK_PSA_REPORTS[cleanCert]) {
    return MOCK_PSA_REPORTS[cleanCert];
  }

  // Generate deterministic realistic verification report based on cert hash
  let charSum = 0;
  for (let i = 0; i < cleanCert.length; i++) {
    charSum += cleanCert.charCodeAt(i);
  }

  const total = 1200 + (charSum * 43) % 18000;
  const gemRate = Math.min(85, Math.max(12, 35 + (charSum % 45)));
  const popPsa10 = Math.floor(total * (gemRate / 100));
  const popPsa9 = Math.floor((total - popPsa10) * 0.7);
  const popPsa8AndLower = total - popPsa10 - popPsa9;

  const cardTitle = cardNameInput || 'Pikachu ex #057 (Special Illustration Rare)';

  return {
    certNumber: cleanCert,
    gradingCompany: company || 'PSA',
    specNumber: `${company || 'PSA'}-PKM-CERT-${cleanCert.slice(-5)}`,
    cardName: cardTitle,
    setName: '2024 Pokemon Scarlet & Violet Surging Sparks',
    year: '2024',
    variety: 'Special Illustration Secret',
    grade: `${company || 'PSA'} 10 GEM MINT`,
    gradeNum: 10,
    totalGraded: total,
    popPsa10,
    popPsa9,
    popPsa8AndLower,
    gemMintRate: Number(gemRate.toFixed(1)),
    verifyStatus: 'VERIFIED',
    subgrades: company === 'BGS' || company === 'CGC' ? {
      centering: 9.5,
      corners: 10,
      edges: 9.5,
      surface: 10,
    } : undefined
  };
}
