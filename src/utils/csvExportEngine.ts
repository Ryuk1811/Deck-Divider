import { Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry, DisplayCurrency } from '../types';
import { formatCurrency } from './formatters';

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportPortfolioToCsv(params: {
  decks: Deck[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  soldEntries: PortfolioCardEntry[];
  currency: DisplayCurrency;
}): void {
  const { decks, sealedEntries, soldEntries, currency } = params;

  const rows: string[][] = [];

  // Header
  rows.push([
    'Asset Type',
    'Category / Deck',
    'Item Name',
    'Card / Product Number',
    'Set Name',
    'Rarity',
    'Condition',
    'Grading Company',
    'Grade',
    'Cert Number',
    'Quantity',
    'Purchase Price (USD)',
    'Current Market Value (USD)',
    'Purchase Currency',
    'Purchase Date',
    'Status',
    'Sale Price',
    'Sale Date',
    'Notes',
  ]);

  // 1. Deck Cards & Collection Cards
  for (const deck of decks) {
    for (const entry of deck.entries) {
      const card = entry.card;
      const isGraded = Boolean(entry.gradingInfo?.company && entry.gradingInfo?.grade);
      const estMarket = isGraded && card.prices?.psa10Estimate
        ? card.prices.psa10Estimate
        : (card.prices?.raw || 0);

      rows.push([
        isGraded ? 'Graded Slab' : 'Raw Card',
        deck.name,
        card.name || 'Unknown Card',
        card.number || '',
        card.set?.name || '',
        card.rarity || '',
        entry.condition || 'NM',
        entry.gradingInfo?.company || '',
        entry.gradingInfo?.grade || '',
        entry.gradingInfo?.certNumber || '',
        String(entry.quantity || 1),
        (entry.purchasePrice || 0).toFixed(2),
        estMarket.toFixed(2),
        entry.purchaseCurrency || 'USD',
        entry.purchaseDate || '',
        entry.isSold ? 'Sold' : 'Active In Collection',
        entry.salePrice !== undefined ? String(entry.salePrice) : '',
        entry.saleDate || '',
        entry.notes || '',
      ]);
    }
  }

  // 2. Sealed Product Entries
  for (const entry of sealedEntries) {
    rows.push([
      'Sealed Product',
      'Vault',
      entry.product?.name || 'Sealed Item',
      entry.product?.type || 'Sealed Box',
      entry.product?.set?.name || 'Various',
      'N/A',
      entry.condition || 'Factory Sealed',
      '',
      '',
      '',
      String(entry.quantity || 1),
      (entry.purchasePrice || 0).toFixed(2),
      ((entry.product?.marketPrice || entry.purchasePrice || 0) * (entry.quantity || 1)).toFixed(2),
      entry.purchaseCurrency || 'USD',
      entry.purchaseDate || '',
      entry.isSold ? 'Sold' : 'Active In Vault',
      entry.salePrice !== undefined ? String(entry.salePrice) : '',
      entry.saleDate || '',
      entry.notes || '',
    ]);
  }

  // 3. Standalone Sold Entries (if any not in decks)
  for (const sold of soldEntries) {
    // Avoid duplicates if already counted in decks
    const card = sold.card;
    rows.push([
      sold.gradingInfo ? 'Graded Slab (Sold)' : 'Raw Card (Sold)',
      'Sold Archive',
      card.name || 'Card',
      card.number || '',
      card.set?.name || '',
      card.rarity || '',
      sold.condition || 'NM',
      sold.gradingInfo?.company || '',
      sold.gradingInfo?.grade || '',
      sold.gradingInfo?.certNumber || '',
      String(sold.quantity || 1),
      (sold.purchasePrice || 0).toFixed(2),
      (card.prices?.raw || 0).toFixed(2),
      sold.purchaseCurrency || 'USD',
      sold.purchaseDate || '',
      'Sold',
      sold.salePrice !== undefined ? String(sold.salePrice) : '',
      sold.saleDate || '',
      sold.notes || '',
    ]);
  }

  const csvContent = rows
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `deck-divider-portfolio-inventory-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
