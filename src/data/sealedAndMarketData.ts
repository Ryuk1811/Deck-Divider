import { SealedProduct, MarketListing } from '../types';
import { normalizeSet } from '../utils/setCategorizer';

// Helper to convert sets from the catalog into realistic sealed products dynamically
export function generateSealedProductsFromSets(sets: any[]): SealedProduct[] {
  const products: SealedProduct[] = [];
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
        imageUrl: set.logoUrl || set.symbolUrl || undefined,
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
      imageUrl: set.logoUrl || undefined,
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
      imageUrl: set.logoUrl || undefined,
      packCount: 6,
      priceHistory: [
        { date: '2026-05-01', price: Number((estBundleMarket * 0.9).toFixed(2)) },
        { date: '2026-08-06', price: estBundleMarket },
      ],
    });
  });

  return products;
}
