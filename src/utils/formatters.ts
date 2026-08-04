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

export function formatCurrency(
  amountInUSD: number,
  targetCurrency: DisplayCurrency = 'USD'
): string {
  const code = (targetCurrency || 'USD').toUpperCase();
  const rate = CURRENCY_RATES[code] ?? 1.0;
  const converted = amountInUSD * rate;
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

export const ENERGY_COLORS: Record<EnergyType, { bg: string; text: string; border: string }> = {
  Fire: { bg: 'bg-[#FFF0F3]', text: 'text-[#DC143C]', border: 'border-[#DC143C]' },
  Water: { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#2563EB]' },
  Grass: { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#16A34A]' },
  Electric: { bg: 'bg-[#FEFCE8]', text: 'text-[#D97706]', border: 'border-[#D97706]' },
  Lightning: { bg: 'bg-[#FEFCE8]', text: 'text-[#D97706]', border: 'border-[#D97706]' },
  Psychic: { bg: 'bg-[#FAF5FF]', text: 'text-[#9333EA]', border: 'border-[#9333EA]' },
  Fighting: { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#C2410C]' },
  Darkness: { bg: 'bg-[#F3F4F6]', text: 'text-[#1F2937]', border: 'border-[#1F2937]' },
  Steel: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#475569]' },
  Metal: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#475569]' },
  Dragon: { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', border: 'border-[#B91C1C]' },
  Colorless: { bg: 'bg-[#F9F9F9]', text: 'text-[#4B5563]', border: 'border-[#9CA3AF]' },
  Fairy: { bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]', border: 'border-[#DB2777]' },
};

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
