import { SealedProduct, MarketListing } from '../types';
import { normalizeSet, sortSetsChronologically } from '../utils/setCategorizer';

/**
 * Helper to dynamically convert sets from the official catalog into realistic sealed products.
 * Catalogs every official expansion: Booster Boxes, Elite Trainer Boxes, Booster Bundles,
 * Ultra-Premium Collections (UPC), and Special Collection Tins.
 */
export function generateSealedProductsFromSets(sets: any[]): SealedProduct[] {
  const products: SealedProduct[] = [];
  if (!sets || sets.length === 0) return products;

  // Sort sets newest first (chronological descending)
  const normalizedSets = sets.map(normalizeSet);
  const sortedSets = sortSetsChronologically(normalizedSets).reverse();

  sortedSets.forEach((set) => {
    const isSpecialSet =
      set.name.includes('151') ||
      set.name.includes('Prismatic') ||
      set.name.includes('Crown Zenith') ||
      set.name.includes('Paldean Fates') ||
      set.name.includes('Shining') ||
      set.name.includes('Celebrations') ||
      set.name.includes('Hidden Fates') ||
      set.name.includes('Champion');

    const setYear = set.releaseDate ? parseInt(set.releaseDate.substring(0, 4), 10) : 2024;
    const ageYears = Math.max(0, 2026 - setYear);

    // 1. Standard Booster Box (for non-special main sets with at least 60 cards)
    if (!isSpecialSet && set.total >= 60) {
      const isModern = set.series.includes('Scarlet');
      const baseMsrp = isModern ? 161.64 : 143.64;
      // Vintage/older sets appreciate steadily
      const multiplier = 1 + ageYears * 0.26 + (set.printedTotal > 200 ? 0.15 : 0);
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

    // 2. Elite Trainer Box (ETB) - Standard (9 packs) or Special Set (11 packs)
    // Most expansions from Sun & Moon through Scarlet & Violet have ETBs
    if (set.series.includes('Scarlet') || set.series.includes('Sword') || set.series.includes('Sun')) {
      const etbMsrp = isSpecialSet ? 54.99 : 49.99;
      const etbMultiplier = 1 + ageYears * 0.20 + (isSpecialSet ? 0.35 : 0);
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
    }

    // 3. Booster Bundle (6 Packs) - Modern Scarlet & Violet & late Sword & Shield sets
    if (set.series.includes('Scarlet') || set.name.includes('Lost Origin') || set.name.includes('Silver Tempest')) {
      const bundleMsrp = 26.94;
      const estBundleMarket = Number((bundleMsrp * (1 + ageYears * 0.15)).toFixed(2));
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
    }

    // 4. Ultra-Premium Collection (UPC) for special milestone releases
    if (isSpecialSet || set.name.includes('151') || set.name.includes('Celebrations')) {
      const upcMsrp = 119.99;
      const estUpcMarket = Number((upcMsrp * (1 + ageYears * 0.32 + 0.25)).toFixed(2));
      products.push({
        id: `sealed-upc-${set.id}`,
        name: `${set.name} Ultra-Premium Collection`,
        type: 'Collection Box',
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
        msrp: upcMsrp,
        marketPrice: estUpcMarket,
        imageUrl: set.logoUrl || undefined,
        packCount: 16,
        priceHistory: [
          { date: '2026-05-01', price: Number((estUpcMarket * 0.92).toFixed(2)) },
          { date: '2026-08-06', price: estUpcMarket },
        ],
      });
    }
  });

  return products;
}
