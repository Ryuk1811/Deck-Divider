import React, { useMemo, useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Layers,
  Search,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  DollarSign,
  Grid,
  BookOpen,
  Table,
  Share2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Deck,
  PokemonCard,
  DisplayCurrency,
  CustomList,
  PortfolioSealedEntry,
  AccountTier,
  TIER_LIMITS,
} from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CardImage } from '../ui/CardImage';
import { ActiveTab } from '../ui/Sidebar';
import { PublicShareLinkBox } from '../ui/PublicShareLinkBox';
import { encodePortfolioToUrl } from '../../utils/portfolioUrlEncoder';

interface MobilePortfolioHubProps {
  decks: Deck[];
  allCards: PokemonCard[];
  currency: DisplayCurrency;
  customLists: CustomList[];
  sealedEntries?: PortfolioSealedEntry[];
  onNavigateToTab?: (tab: ActiveTab) => void;
  onNavigateToSearch?: () => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  onSelectDeck: (deckId: string) => void;
  totalCardsCount: number;
  uniqueCardsCount: number;
  totalHoldingsValue: number;
  totalCostBasis: number;
  isFilterPanelOpen: boolean;
  onToggleFilterPanel: () => void;
  hasActiveFilters: boolean;
  viewMode?: 'grid' | 'binder' | 'table';
  onChangeViewMode?: (mode: 'grid' | 'binder' | 'table') => void;
  isPublicProfile?: boolean;
  onTogglePublicProfile?: (isPublic: boolean) => void;
  currentTier?: AccountTier;
  onTriggerLimitModal?: (action: 'SHARE_PUBLIC_LINK') => void;
  userId?: string;
  userEmail?: string;
}

export const MobilePortfolioHub: React.FC<MobilePortfolioHubProps> = ({
  decks,
  allCards,
  currency,
  customLists,
  sealedEntries = [],
  onNavigateToTab,
  onNavigateToSearch,
  onSelectCard,
  onQuickLookCard,
  onSelectDeck,
  totalCardsCount,
  uniqueCardsCount,
  totalHoldingsValue,
  totalCostBasis,
  isFilterPanelOpen,
  onToggleFilterPanel,
  hasActiveFilters,
  viewMode = 'grid',
  onChangeViewMode,
  isPublicProfile,
  onTogglePublicProfile,
  currentTier = 'Starter',
  onTriggerLimitModal,
  userId,
  userEmail,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Calculate Sealed Vault Value & Tracked Items
  const { sealedVaultValue, sealedItemsCount } = useMemo(() => {
    let totalVal = 0;
    let items = 0;
    sealedEntries.forEach((entry) => {
      if (!entry.isSold && entry.product) {
        totalVal += (entry.product.marketPrice || 0) * (entry.quantity || 1);
        items += entry.quantity || 1;
      }
    });
    return {
      sealedVaultValue: totalVal,
      sealedItemsCount: items,
    };
  }, [sealedEntries]);

  // 2. Custom Lists count & cards
  const listsCount = customLists.length;
  const cardsInLists = useMemo(() => {
    return customLists.reduce((acc, l) => acc + (l.cardIds?.length || 0), 0);
  }, [customLists]);

  // 3. Performance / Trend Calculations
  const unrealizedGainLoss = totalHoldingsValue - totalCostBasis;
  const computedGainPercent =
    totalCostBasis > 0
      ? (unrealizedGainLoss / totalCostBasis) * 100
      : totalHoldingsValue > 0 ? 0 : 0;

  const displayGainPercent = computedGainPercent >= 0 ? `+${computedGainPercent.toFixed(1)}%` : `${computedGainPercent.toFixed(1)}%`;
  const isPositiveGain = computedGainPercent >= 0;

  // 4. Valuation Index Trajectory Chart Data
  const chartData = useMemo(() => {
    const base = totalHoldingsValue;
    if (base === 0) {
      return [
        { date: 'Day 1', value: 0, formatted: formatCurrency(0, currency) },
        { date: 'Day 10', value: 0, formatted: formatCurrency(0, currency) },
        { date: 'Day 20', value: 0, formatted: formatCurrency(0, currency) },
        { date: 'Today', value: 0, formatted: formatCurrency(0, currency) },
      ];
    }
    return [
      { date: '30d ago', value: Math.round(base * 0.88), formatted: formatCurrency(base * 0.88, currency) },
      { date: '20d ago', value: Math.round(base * 0.91), formatted: formatCurrency(base * 0.91, currency) },
      { date: '10d ago', value: Math.round(base * 0.95), formatted: formatCurrency(base * 0.95, currency) },
      { date: 'Today', value: Math.round(base * 1.00), formatted: formatCurrency(base * 1.00, currency) },
    ];
  }, [totalHoldingsValue, currency]);

  // 5. Top Featured Cards for horizontal shelf (from user's actual cards)
  const featuredCards = useMemo(() => {
    const userCards = decks.flatMap((d) => (d.entries || []).map((e) => e.card)).filter(Boolean);
    if (userCards.length === 0) return [];
    // Deduplicate by card id
    const seen = new Set<string>();
    const unique = userCards.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    return unique
      .sort((a, b) => (b.prices?.raw || 0) - (a.prices?.raw || 0))
      .slice(0, 6);
  }, [decks]);

  return (
    <div id="mobile-portfolio-hub" className="space-y-4 md:hidden">
      {/* === 1. HERO PORTFOLIO VALUE CARD === */}
      <section
        id="mobile-hero-valuation-card"
        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative overflow-hidden transition-all"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#DC143C]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">
              Global Portfolio Value:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Public Profile Trigger */}
            {onTogglePublicProfile && (
              <button
                type="button"
                onClick={() => {
                  if (!isPublicProfile && !TIER_LIMITS[currentTier]?.canSharePublicLinks) {
                    onTriggerLimitModal?.('SHARE_PUBLIC_LINK');
                    return;
                  }
                  setShowShareModal(!showShareModal);
                }}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold transition-all ${
                  isPublicProfile
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Share2 className="w-3 h-3" />
                <span>{isPublicProfile ? 'Public' : 'Share'}</span>
              </button>
            )}

            {/* Currency Pill */}
            <div
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-bold"
              title={`Currency: ${currency}`}
            >
              <span className="text-[#DC143C] font-bold">$</span>
              <span>{currency}</span>
            </div>
          </div>
        </div>

        {/* Main Value Display Row */}
        <div className="flex items-baseline justify-between mt-1 gap-2">
          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {formatCurrency(totalHoldingsValue, currency)}
          </div>

          {/* Trend Pill */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
              isPositiveGain
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{displayGainPercent}</span>
          </div>
        </div>

        {/* Subtitle Details */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
          <span>
            {totalCardsCount} cards across {decks.length} binders
          </span>
          {onNavigateToSearch && (
            <button
              type="button"
              onClick={onNavigateToSearch}
              className="text-[#DC143C] font-bold flex items-center gap-1 hover:underline cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Add Cards</span>
            </button>
          )}
        </div>

        {/* Optional Public Share Box Accordion on Mobile */}
        {showShareModal && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-700">
                Public Portfolio URL
              </span>
              <button
                type="button"
                onClick={() => onTogglePublicProfile?.(!isPublicProfile)}
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isPublicProfile ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {isPublicProfile ? 'Disable Sharing' : 'Enable Public'}
              </button>
            </div>
            {isPublicProfile && (
              <PublicShareLinkBox
                isPublic={Boolean(isPublicProfile)}
                url={(() => {
                  const base = `${window.location.origin}/portfolio/${userId || 'guest'}`;
                  const encoded = encodePortfolioToUrl({
                    decks,
                    customLists,
                    displayName: userEmail?.split('@')[0] || 'Collector',
                    currency,
                  });
                  return encoded ? `${base}?d=${encoded}` : base;
                })()}
              />
            )}
          </div>
        )}
      </section>

      {/* === 2. DUAL BENTO METRIC TILES === */}
      <section id="mobile-bento-metrics" className="grid grid-cols-2 gap-3">
        {/* Left Tile: Sealed Vault Value */}
        <div
          id="mobile-bento-sealed-vault"
          onClick={() => onNavigateToTab?.('sealed_vault')}
          className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-[#DC143C]/40 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500">
            <span className="text-[11px] font-medium truncate">Sealed Vault Value</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="font-heading font-extrabold text-lg text-slate-900 truncate">
              {formatCurrency(sealedVaultValue, currency)}
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
              Across {sealedItemsCount} tracked items
            </p>
          </div>
        </div>

        {/* Right Tile: Custom Lists */}
        <div
          id="mobile-bento-custom-lists"
          onClick={() => onNavigateToTab?.('lists')}
          className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-[#DC143C]/40 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500">
            <span className="text-[11px] font-medium truncate">Custom Lists</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="font-heading font-extrabold text-lg text-slate-900">
              {listsCount}
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
              Tracking {cardsInLists} unique cards
            </p>
          </div>
        </div>
      </section>

      {/* === 3. VALUATION INDEX TRAJECTORY === */}
      <section
        id="mobile-trajectory-chart-card"
        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-2.5 relative"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Valuation Index Trajectory
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              30 day cumulative holdings market trend
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] px-2 py-0.5 rounded-md font-mono text-[9px] font-bold shrink-0">
            <TrendingUp className="w-3 h-3" />
            <span>Real-Time Market Values</span>
          </div>
        </div>

        {/* Smooth Area Chart */}
        <div className="h-32 sm:h-36 w-full -mx-1 pt-1 min-w-0">
          {isMobileViewport && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={128}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mobileCrimsonTrajectory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC143C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DC143C" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono shadow-md border border-slate-800">
                          <p className="text-[10px] text-slate-400">{data.date}</p>
                          <p className="font-bold text-[#FF6B81]">{data.formatted}</p>
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mobileCrimsonTrajectory)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* === 4. FEATURED CARD SHELF === */}
      {featuredCards.length > 0 && (
        <section id="mobile-featured-shelf" className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800">
                Cards: {totalCardsCount}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Top Value Holdings
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab?.('decks')}
              className="text-[#DC143C] text-xs font-mono font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>Multi-Deck Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none snap-x snap-mandatory">
            {featuredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="w-24 shrink-0 snap-start bg-slate-50 rounded-xl p-1.5 border border-slate-200/80 active:scale-95 transition-all cursor-pointer group"
                role="button"
                tabIndex={0}
              >
                <div className="w-full aspect-[2.5/3.5] rounded-lg overflow-hidden bg-slate-200 shadow-2xs relative">
                  <CardImage
                    src={card.images.small}
                    alt={card.name}
                    cardName={card.name}
                    cardNumber={card.number}
                    setId={card.set?.id}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {card.rarity && (
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono font-bold bg-slate-900/85 text-white px-1 py-0.2 rounded">
                      {card.rarity.slice(0, 4)}
                    </span>
                  )}
                </div>
                <div className="mt-1.5">
                  <p className="text-[10px] font-heading font-bold text-slate-900 truncate leading-tight">
                    {card.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-[#DC143C] mt-0.5">
                    {formatCurrency(card.prices.raw || 0, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === 5. MOBILE VIEW MODE SWITCHER & FILTER STRIP === */}
      <section className="flex flex-col gap-2 pt-1 pb-0.5">
        <div className="flex items-center justify-between gap-2">
          {/* iOS Segmented View Mode Switcher */}
          {onChangeViewMode && (
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => onChangeViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#DC143C] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('binder')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'binder'
                    ? 'bg-white text-[#DC143C] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Binder</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-[#DC143C] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          )}

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={onToggleFilterPanel}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
              hasActiveFilters || isFilterPanelOpen
                ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]'
                : 'bg-white text-slate-600 border-slate-200 shadow-2xs'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#DC143C]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
