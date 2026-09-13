import {
  DisplayCurrency,
  CURRENCY_SYMBOLS,
  CURRENCY_RATES,
  EnergyType,
  CardRarity,
} from '../types';

export function setLiveExchangeRates(rates: Record<string, number>): void {
  if (rates && typeof rates === 'object') {
    Object.assign(CURRENCY_RATES, rates);
  }
}

export function getCurrencySymbol(targetCurrency: DisplayCurrency = 'USD'): string {
  const code = (targetCurrency || 'USD').toUpperCase();
  return CURRENCY_SYMBOLS[code] ?? `${code} `;
}

export function getCurrencyRate(targetCurrency: DisplayCurrency = 'USD'): number {
  const code = (targetCurrency || 'USD').toUpperCase();
  return CURRENCY_RATES[code] ?? 1.0;
}

export function convertUSDToCurrency(amountInUSD: number, targetCurrency: DisplayCurrency = 'USD'): number {
  const rate = getCurrencyRate(targetCurrency);
  const converted = amountInUSD * rate;
  return Number(converted.toFixed(2));
}

export function convertCurrencyToUSD(amountInTargetCurrency: number, targetCurrency: DisplayCurrency = 'USD'): number {
  const rate = getCurrencyRate(targetCurrency);
  if (!rate || rate === 0) return amountInTargetCurrency;
  return Number((amountInTargetCurrency / rate).toFixed(2));
}

export function formatCurrency(
  amountInUSD: number,
  targetCurrency: DisplayCurrency = 'USD'
): string {
  const safeAmount = typeof amountInUSD === 'number' && !isNaN(amountInUSD) ? amountInUSD : 0;
  const code = (targetCurrency || 'USD').toUpperCase();
  const rate = CURRENCY_RATES[code] ?? 1.0;
  const converted = safeAmount * rate;
  const symbol = CURRENCY_SYMBOLS[code] ?? `${code} `;

  if (code === 'JPY' || code === 'KRW') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export const ENERGY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  // 18 National Dex Pokémon Species Types
  Normal: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#CBD5E1]' },
  Fire: { bg: 'bg-[#FFF0F3]', text: 'text-[#DC143C]', border: 'border-[#DC143C]' },
  Water: { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#2563EB]' },
  Grass: { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#16A34A]' },
  Electric: { bg: 'bg-[#FEFCE8]', text: 'text-[#D97706]', border: 'border-[#D97706]' },
  Ice: { bg: 'bg-[#ECFEFF]', text: 'text-[#0284C7]', border: 'border-[#38BDF8]' },
  Fighting: { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#C2410C]' },
  Poison: { bg: 'bg-[#FAF5FF]', text: 'text-[#9333EA]', border: 'border-[#C084FC]' },
  Ground: { bg: 'bg-[#FEFCE8]', text: 'text-[#854D0E]', border: 'border-[#EAB308]' },
  Flying: { bg: 'bg-[#F0F9FF]', text: 'text-[#0284C7]', border: 'border-[#7DD3FC]' },
  Psychic: { bg: 'bg-[#FDF2F8]', text: 'text-[#C026D3]', border: 'border-[#E879F9]' },
  Bug: { bg: 'bg-[#F7FEE7]', text: 'text-[#65A30D]', border: 'border-[#84CC16]' },
  Rock: { bg: 'bg-[#F5F5F4]', text: 'text-[#78716C]', border: 'border-[#A8A29E]' },
  Ghost: { bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]', border: 'border-[#8B5CF6]' },
  Dragon: { bg: 'bg-[#EEF2FF]', text: 'text-[#4338CA]', border: 'border-[#6366F1]' },
  Steel: { bg: 'bg-[#F1F5F9]', text: 'text-[#334155]', border: 'border-[#94A3B8]' },
  Fairy: { bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]', border: 'border-[#FB7185]' },
  Dark: { bg: 'bg-[#F3F4F6]', text: 'text-[#1F2937]', border: 'border-[#1F2937]' },

  // TCG Energy Compatibility
  Lightning: { bg: 'bg-[#FEFCE8]', text: 'text-[#D97706]', border: 'border-[#D97706]' },
  Darkness: { bg: 'bg-[#F3F4F6]', text: 'text-[#1F2937]', border: 'border-[#1F2937]' },
  Metal: { bg: 'bg-[#F1F5F9]', text: 'text-[#334155]', border: 'border-[#94A3B8]' },
  Colorless: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#CBD5E1]' },
};

export function formatEnergyType(type?: string): string {
  if (!type) return '';
  return type;
}

export const RARITY_BADGE_STYLE: Record<CardRarity, { label: string; style: string }> = {
  Common: { label: '● Common', style: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' },
  Uncommon: { label: '◆ Uncommon', style: 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0]' },
  Rare: { label: '★ Rare', style: 'bg-[#F1F5F9] text-[#0F172A] border-[#CBD5E1]' },
  'Rare Holo': { label: '★ Holo', style: 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]/30' },
  'Ultra Rare': { label: 'UR', style: 'bg-[#0F172A] text-[#FFFFFF] border-[#0F172A]' },
  'Secret Rare': { label: 'SR', style: 'bg-[#FEF08A] text-[#854D0E] border-[#CA8A04]/40' },
  'Illustration Rare': { label: 'IR', style: 'bg-[#E0E7FF] text-[#3730A3] border-[#4338CA]/40' },
  'Special Illustration Rare': {
    label: 'SIR',
    style: 'bg-gradient-to-r from-[#FFF0F3] via-[#FEF08A] to-[#E0E7FF] text-[#0F172A] border-[#CBD5E1]',
  },
};
