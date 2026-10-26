import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Sparkles,
  ChevronRight,
  PieChart,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Boxes,
} from 'lucide-react';
import {
  Deck,
  PortfolioCardEntry,
  DisplayCurrency,
  RecentActivityItem,
  PokemonCard,
  CustomList,
  PortfolioSealedEntry,
  CardSet,
} from '../../types';
import { CardImage } from '../../components/ui/CardImage';
import { formatCurrency, formatPercent, formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface MetricsViewProps {
  decks: Deck[];
  soldEntries: PortfolioCardEntry[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  liveSets: CardSet[];
  currency: DisplayCurrency;
  recentActivities: RecentActivityItem[];
  allCards: PokemonCard[];
  onSelectDeck: (deckId: string) => void;
  onSelectCard: (card: PokemonCard) => void;
  onNavigateToDecks: () => void;
}

export const MetricsView: React.FC<MetricsViewProps> = ({
  decks,
  soldEntries,
  customLists,
  sealedEntries,
  liveSets,
  currency,
  recentActivities,
  allCards,
  onSelectDeck,
  onSelectCard,
  onNavigateToDecks,
}) => {
  const [breakdownTab, setBreakdownTab] = useState<'type' | 'rarity' | 'set'>('type');

  // 1. Calculate Core Portfolio Financial Figures
  let totalHoldingsValue = 0;
  let totalCostBasis = 0;
  let totalCardsCount = 0;

  const typeValueMap: Record<string, { value: number; count: number }> = {};
  const rarityValueMap: Record<string, { value: number; count: number }> = {};
  const setValueMap: Record<string, { value: number; count: number; name: string }> = {};

  decks.forEach((deck) => {
    (deck.entries || []).forEach((entry) => {
      if (!entry.isSold) {
        const rawUnitPrice = Number(entry.card?.prices?.raw) || 0;
        let effectiveUnitPrice = rawUnitPrice;

        // Apply Slab Multiplier if Graded
        if (entry.gradingInfo?.grade) {
          const g = parseFloat(String(entry.gradingInfo.grade)) || 10;
          const mult = g >= 10 ? 3.2 : g >= 9.5 ? 2.4 : g >= 9 ? 1.6 : g >= 8 ? 1.2 : 1.1;
          effectiveUnitPrice = rawUnitPrice > 0 ? rawUnitPrice * mult : (Number(entry.purchasePrice) || 10) * mult;
        } else if (effectiveUnitPrice === 0 && entry.purchasePrice) {
          effectiveUnitPrice = Number(entry.purchasePrice) || 0;
        }

        const qty = Number(entry.quantity) || 1;
        const val = Number((effectiveUnitPrice * qty).toFixed(2)) || 0;
        const cost = Number(((Number(entry.purchasePrice) || 0) * qty).toFixed(2)) || 0;

        totalHoldingsValue += val;
        totalCostBasis += cost;
        totalCardsCount += qty;

        // Breakdown by Primary Energy Type
        const primaryType = entry.card?.types?.[0] || 'Trainer/Energy';
        if (!typeValueMap[primaryType]) {
          typeValueMap[primaryType] = { value: 0, count: 0 };
        }
        typeValueMap[primaryType].value += val;
        typeValueMap[primaryType].count += qty;

        // Breakdown by Rarity
        const rarity = entry.card?.rarity || 'Common';
        if (!rarityValueMap[rarity]) {
          rarityValueMap[rarity] = { value: 0, count: 0 };
        }
        rarityValueMap[rarity].value += val;
        rarityValueMap[rarity].count += qty;

        // Breakdown by Set
        const setId = entry.card?.set?.id || 'unknown';
        const setName = entry.card?.set?.name || 'Unknown Expansion';
        if (!setValueMap[setId]) {
          setValueMap[setId] = { value: 0, count: 0, name: setName };
        }
        setValueMap[setId].value += val;
        setValueMap[setId].count += qty;
      }
    });
  });

  const unrealizedGainLoss = totalHoldingsValue - totalCostBasis;
  const unrealizedGainPercent =
    totalCostBasis > 0 ? ((unrealizedGainLoss / totalCostBasis) * 100) : 0;

  // Realized Profit from Sold Cards
  let totalRealizedProfit = 0;
  (soldEntries || []).forEach((entry) => {
    if (entry.isSold && entry.salePrice !== undefined) {
      const qty = Number(entry.quantity) || 1;
      const cost = (Number(entry.purchasePrice) || 0) * qty;
      const sale = (Number(entry.salePrice) || 0) * qty;
      totalRealizedProfit += sale - cost;
    }
  });

  // Calculate Extra Metrics
  let totalSealedValue = 0;
  let totalSealedItems = 0;
  (sealedEntries || []).forEach((entry) => {
    if (!entry.isSold) {
      const qty = Number(entry.quantity) || 1;
      const mkt = Number(entry.product?.marketPrice) || 0;
      totalSealedValue += mkt * qty;
      totalSealedItems += qty;
    }
  });
  
  const listsCount = customLists.length;
  const cardsInLists = customLists.reduce((acc, list) => acc + list.cardIds.length, 0);
  const uniqueSetsCount = liveSets.length;

  // Generated Value Over Time Data (Simulated based on total holding value)
  const chartData = [
    { date: 'Jun 01', value: totalHoldingsValue * 0.88 },
    { date: 'Jun 10', value: totalHoldingsValue * 0.92 },
    { date: 'Jun 20', value: totalHoldingsValue * 0.91 },
    { date: 'Jul 01', value: totalHoldingsValue * 0.96 },
    { date: 'Jul 15', value: totalHoldingsValue * 0.98 },
    { date: 'Jul 31', value: totalHoldingsValue },
  ];

  // Top Price Movers
  const topMovers = [...allCards]
    .sort((a, b) => b.prices.raw - a.prices.raw)
    .slice(0, 4);

  // Sorted Breakdown Arrays
  const typeBreakdownList = Object.entries(typeValueMap)
    .map(([type, data]) => ({
      label: type,
      value: data.value,
      count: data.count,
      percent: totalHoldingsValue > 0 ? (data.value / totalHoldingsValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const rarityBreakdownList = Object.entries(rarityValueMap)
    .map(([rarity, data]) => ({
      label: rarity,
      value: data.value,
      count: data.count,
      percent: totalHoldingsValue > 0 ? (data.value / totalHoldingsValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const setBreakdownList = Object.values(setValueMap)
    .map((data) => ({
      label: data.name,
      value: data.value,
      count: data.count,
      percent: totalHoldingsValue > 0 ? (data.value / totalHoldingsValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const currentBreakdown =
    breakdownTab === 'type'
      ? typeBreakdownList
      : breakdownTab === 'rarity'
      ? rarityBreakdownList
      : setBreakdownList;

  return (
    <div className="app-view-container space-y-8 animate-fade-in">
      {/* 4-STAT FIGURES ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Figure 1: Current Holdings Value */}
        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Holdings Value</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-num font-bold text-2xl text-[#0F172A]">
            {formatCurrency(totalHoldingsValue, currency)}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            {totalCardsCount} cards across {decks.length} active decks
          </p>
        </div>

        {/* Figure 2: Cost Basis */}
        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Cost Basis</span>
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="font-num font-bold text-2xl text-[#0F172A]">
            {formatCurrency(totalCostBasis, currency)}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            Total acquisition expenditure
          </p>
        </div>

        {/* Figure 3: Unrealized Gain/Loss */}
        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Unrealized P&L</span>
            <div
              className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                unrealizedGainLoss >= 0
                  ? 'bg-[#F0FDF4] border-[#16A34A]/30 text-[#16A34A]'
                  : 'bg-[#FEF2F2] border-[#FF4500]/30 text-[#FF4500]'
              }`}
            >
              {unrealizedGainLoss >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <div
            className={`font-num font-bold text-2xl ${
              unrealizedGainLoss >= 0 ? 'text-[#16A34A]' : 'text-[#FF4500]'
            }`}
          >
            {formatCurrency(unrealizedGainLoss, currency)}
          </div>
          <p className="font-mono text-[10px] font-semibold text-[#64748B]">
            {formatPercent(unrealizedGainPercent)} net return on investment
          </p>
        </div>

        {/* Figure 4: Realized Profit */}
        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Realized Profit</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFFBEB] border border-[#FFD700]/50 text-[#854D0E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#CA8A04]" />
            </div>
          </div>
          <div
            className={`font-num font-bold text-2xl ${
              totalRealizedProfit >= 0 ? 'text-[#16A34A]' : 'text-[#FF4500]'
            }`}
          >
            {formatCurrency(totalRealizedProfit, currency)}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            From {soldEntries.length} completed card sales
          </p>
        </div>
      </div>

      {/* SECOND 4-STAT FIGURES ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Sealed Vault Value</span>
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="font-num font-bold text-2xl text-[#0F172A]">
            {formatCurrency(totalSealedValue, currency)}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            Across {totalSealedItems} tracked items
          </p>
        </div>

        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Custom Lists</span>
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-num font-bold text-2xl text-[#0F172A]">
            {listsCount}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            Tracking {cardsInLists} unique cards
          </p>
        </div>

        <div className="kpi-card p-5 space-y-2 glass-slab shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#64748B]">Live Sets Index</span>
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-num font-bold text-2xl text-[#0F172A]">
            {uniqueSetsCount}
          </div>
          <p className="font-mono text-[10px] text-[#64748B]">
            Available for analysis
          </p>
        </div>
      </div>

      {/* CHART & VALUE BREAKDOWN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Value Over Time Chart */}
        <div className="lg:col-span-7 p-6 space-y-4 glass-slab shadow-md">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0F172A]">
                Valuation Index Trajectory
              </h3>
              <p className="font-mono text-xs text-[#64748B]">
                30-day cumulative holdings market trend
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#DC143C] bg-[#FFF0F3] px-2.5 py-1 border border-[#DC143C]/30 rounded-md">
              Real-time Market Index
            </span>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValMetrics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC143C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#DC143C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} fontFamily="IBM Plex Mono" />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  fontFamily="JetBrains Mono"
                  tickFormatter={(v) => formatCompactCurrency(Number(v) || 0, currency)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-[#0F172A] text-white border border-[#0F172A] shadow-lg font-mono text-xs space-y-1 rounded-md">
                          <div className="text-[#94A3B8]">{payload[0].payload.date}</div>
                          <div className="font-num font-bold text-sm text-[#FFD700]">
                            {formatCurrency(payload[0].value as number, currency)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#DC143C"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValMetrics)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Value Distribution Breakdown Card */}
        <div className="lg:col-span-5 p-6 space-y-4 glass-slab shadow-md">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0F172A]">
                Holdings Allocation
              </h3>
              <p className="font-mono text-xs text-[#64748B]">Value distribution</p>
            </div>

            {/* Breakdown Switcher */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-md">
              <button
                type="button"
                onClick={() => setBreakdownTab('type')}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded ${
                  breakdownTab === 'type'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Type
              </button>
              <button
                type="button"
                onClick={() => setBreakdownTab('rarity')}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded ${
                  breakdownTab === 'rarity'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Rarity
              </button>
              <button
                type="button"
                onClick={() => setBreakdownTab('set')}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded ${
                  breakdownTab === 'set'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Set
              </button>
            </div>
          </div>

          <div className="scroller-bounding-box h-[250px]">
            <div className="scroller-bounding-box-inner p-3 custom-scrollbar h-full space-y-3">
              {currentBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-[#0F172A]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B] font-num">
                        {formatCurrency(item.value, currency)}
                      </span>
                      <span className="font-bold text-[#DC143C] font-num">
                        {item.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#DC143C] to-[#B01030] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(2, item.percent))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY LOG & MOVERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Audit Log */}
        <div className="lg:col-span-6 p-6 space-y-4 glass-slab shadow-md">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="font-heading font-bold text-base text-[#0F172A]">
              Transaction & Audit Log
            </h3>
            <span className="font-mono text-[10px] text-[#64748B]">Historical Events</span>
          </div>

          <div className="scroller-bounding-box h-[270px]">
            <div className="scroller-bounding-box-inner p-3 custom-scrollbar h-full space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {act.cardImage && act.cardImage.length > 0 ? (
                      <div className="w-8 h-10 border border-[#E2E8F0] rounded-md overflow-hidden shrink-0">
                        <CardImage
                          src={act.cardImage}
                          alt={act.title}
                          cardName={act.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-xs rounded-md">
                        <Activity className="w-4 h-4 text-[#DC143C]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-heading font-semibold text-xs text-[#0F172A] truncate">
                        {act.title}
                      </div>
                      <div className="font-mono text-[10px] text-[#64748B] truncate">
                        {act.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Movers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-4 py-3 glass-slab shadow-md">
            <h3 className="font-heading font-bold text-base text-[#0F172A]">
              Highest Value Market Cards
            </h3>
            <span className="font-mono text-xs text-[#64748B]">Valuation Index</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topMovers.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="p-3 glass-slab flex items-center gap-3 cursor-pointer hover:border-[#DC143C] transition-all group shadow-md"
              >
                <div className="w-10 h-14 border border-[#E2E8F0] shadow-xs group-hover:scale-105 transition-transform rounded-md overflow-hidden shrink-0">
                  <CardImage
                    src={card.images.small}
                    alt={card.name}
                    cardName={card.name}
                    cardNumber={card.number}
                    setId={card.set?.id}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-xs text-[#0F172A] truncate">
                    {card.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#64748B]">
                    {card.set.name}
                  </div>
                  <div className="font-num font-bold text-xs text-[#16A34A] mt-1">
                    {formatCurrency(card.prices.raw, currency)} (+6.8%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DECKS VALUATION SUMMARY SHORTCUTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-3 glass-slab shadow-md">
          <h3 className="font-heading font-bold text-base text-[#0F172A]">
            Deck Valuation Summaries
          </h3>
          <button
            type="button"
            onClick={onNavigateToDecks}
            className="font-mono text-xs font-bold text-[#DC143C] flex items-center gap-1 hover:underline"
          >
            <span>Deck Command</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const cardCount = deck.entries.reduce((acc, e) => acc + e.quantity, 0);
            const deckVal = deck.entries.reduce(
              (acc, e) => acc + e.card.prices.raw * e.quantity,
              0
            );

            return (
              <div
                key={deck.id}
                onClick={() => onSelectDeck(deck.id)}
                className="p-4 space-y-3 glass-slab cursor-pointer hover:border-[#DC143C] transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: deck.colorHex }}
                    />
                    <h4 className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-[#DC143C] transition-colors">
                      {deck.name}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] font-mono text-xs">
                  <span className="text-[#64748B]">{cardCount} cards</span>
                  <span className="font-num font-bold text-[#0F172A]">
                    {formatCurrency(deckVal, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
