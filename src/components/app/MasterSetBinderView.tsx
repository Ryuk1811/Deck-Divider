import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  Plus,
  Crown,
  Eye,
  Zap,
  Grid3X3,
  Grid2X2,
  Share2,
} from 'lucide-react';
import { PokemonCard, CardSet, DisplayCurrency, AccountTier, TIER_LIMITS } from '../../types';
import { CardImage } from '../ui/CardImage';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface MasterSetBinderViewProps {
  sets: CardSet[];
  allCards: PokemonCard[];
  userDecksCardsMap: Record<string, number>; // cardId -> owned count
  currency: DisplayCurrency;
  currentTier: AccountTier;
  onSelectCard: (card: PokemonCard) => void;
  onTriggerUpgradeModal: (action: string) => void;
  onNavigateToSearch: (query?: string) => void;
}

type BinderLayout = '3x3' | '4x4';
type BinderTheme = 'matte_black' | 'pokeball_crimson' | 'masterball_purple' | 'gold_charizard';

export const MasterSetBinderView: React.FC<MasterSetBinderViewProps> = ({
  sets,
  allCards,
  userDecksCardsMap,
  currency,
  currentTier,
  onSelectCard,
  onTriggerUpgradeModal,
  onNavigateToSearch,
}) => {
  const [selectedSetId, setSelectedSetId] = useState<string>(sets[0]?.id || 'sv3pt5');
  const [layout, setLayout] = useState<BinderLayout>('3x3');
  const [theme, setTheme] = useState<BinderTheme>('matte_black');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'owned' | 'missing'>('all');
  const [showGapModal, setShowGapModal] = useState<boolean>(false);

  const isPro = currentTier !== 'Starter';
  const slotsPerPage = layout === '3x3' ? 9 : 12;

  const currentSet = useMemo(() => {
    return sets.find((s) => s.id === selectedSetId) || sets[0];
  }, [sets, selectedSetId]);

  // Filter cards belonging to selected set
  const setCards = useMemo(() => {
    return allCards.filter(
      (c) => c.set?.id === selectedSetId || c.id.startsWith(`${selectedSetId}-`)
    );
  }, [allCards, selectedSetId]);

  // Calculate set collection metrics
  const { totalSetCards, ownedCardsCount, missingCardsCount, completionPercent, missingCards } =
    useMemo(() => {
      const total = setCards.length || 165;
      let owned = 0;
      const missing: PokemonCard[] = [];

      setCards.forEach((c) => {
        const qty = userDecksCardsMap[c.id] || 0;
        if (qty > 0) {
          owned += 1;
        } else {
          missing.push(c);
        }
      });

      const pct = Math.round((owned / Math.max(1, total)) * 100);
      return {
        totalSetCards: total,
        ownedCardsCount: owned,
        missingCardsCount: missing.length,
        completionPercent: pct,
        missingCards: missing,
      };
    }, [setCards, userDecksCardsMap]);

  // Apply display filter
  const displayedSetCards = useMemo(() => {
    if (filterMode === 'owned') {
      return setCards.filter((c) => (userDecksCardsMap[c.id] || 0) > 0);
    }
    if (filterMode === 'missing') {
      return setCards.filter((c) => !(userDecksCardsMap[c.id] || 0));
    }
    return setCards;
  }, [setCards, filterMode, userDecksCardsMap]);

  const totalPages = Math.ceil(Math.max(1, displayedSetCards.length) / slotsPerPage);
  const pageCards = useMemo(() => {
    const start = (currentPage - 1) * slotsPerPage;
    return displayedSetCards.slice(start, start + slotsPerPage);
  }, [displayedSetCards, currentPage, slotsPerPage]);

  const handleLayoutChange = (newLayout: BinderLayout) => {
    if (newLayout === '4x4' && !isPro) {
      onTriggerUpgradeModal('12_POCKET_BINDER');
      return;
    }
    setLayout(newLayout);
    setCurrentPage(1);
  };

  const handleThemeChange = (newTheme: BinderTheme) => {
    if ((newTheme === 'gold_charizard' || newTheme === 'masterball_purple') && !isPro) {
      onTriggerUpgradeModal('PREMIUM_BINDER_THEME');
      return;
    }
    setTheme(newTheme);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'pokeball_crimson':
        return 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#881337] border-[#DC143C]/40';
      case 'masterball_purple':
        return 'bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#581C87] border-[#A855F7]/40';
      case 'gold_charizard':
        return 'bg-gradient-to-br from-[#2E1065] via-[#0F172A] to-[#78350F] border-[#EAB308]/40';
      default:
        return 'bg-[#0F172A] border-[#334155]';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER & SET SELECTOR */}
      <div className="glass-slab p-6 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#DC143C] bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pokédex Master Set Engine</span>
            </span>
            <span className="font-mono text-xs text-[#64748B]">
              Virtual 9-Pocket & 12-Pocket Binder Showcase
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-[#0F172A]">
            {currentSet?.name || 'Expansion Master Set'} Binder
          </h2>
          <p className="font-mono text-xs text-[#64748B]">
            Interactive digital binder sleeves with holographic foil simulation and set completion radar.
          </p>
        </div>

        {/* Expansion Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSetId}
            onChange={(e) => {
              setSelectedSetId(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2.5 bg-white border border-[#E2E8F0] font-heading font-bold text-sm text-[#0F172A] rounded-lg shadow-xs focus:outline-none focus:border-[#DC143C]"
          >
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowGapModal(true)}
            className="neo-btn-primary py-2 px-3.5 text-xs flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Missing Card Radar ({missingCardsCount})</span>
          </button>
        </div>
      </div>

      {/* METRICS & BINDER TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Set Completion Progress Bar */}
        <div className="md:col-span-6 glass-slab p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#64748B] font-bold">Set Completion Rate</span>
            <span className="font-bold font-num text-[#DC143C] text-sm">
              {ownedCardsCount} / {totalSetCards} Cards ({completionPercent}%)
            </span>
          </div>

          <div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#DC143C] via-[#FF4500] to-[#FFD700] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${Math.max(3, completionPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
            <span>Regular: {ownedCardsCount} slotted</span>
            <span>Missing: {missingCardsCount} cards</span>
            <span>Mastery: {completionPercent === 100 ? '👑 Master Set Complete' : 'In Progress'}</span>
          </div>
        </div>

        {/* Binder Controls & Customization */}
        <div className="md:col-span-6 glass-slab p-5 shadow-md flex items-center justify-between gap-4 flex-wrap">
          {/* Layout Switcher */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#64748B] block font-semibold">
              Pocket Layout
            </span>
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-lg">
              <button
                type="button"
                onClick={() => handleLayoutChange('3x3')}
                className={`px-3 py-1 font-mono text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                  layout === '3x3' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>3x3 (9-Pocket)</span>
              </button>

              <button
                type="button"
                onClick={() => handleLayoutChange('4x4')}
                className={`px-3 py-1 font-mono text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                  layout === '4x4'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
                <span>4x4 (12-Pocket)</span>
                {!isPro && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#64748B] block font-semibold">
              Binder Theme
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleThemeChange('matte_black')}
                className={`w-6 h-6 rounded-full bg-slate-900 border-2 transition-transform ${
                  theme === 'matte_black' ? 'border-[#DC143C] scale-110 shadow-xs' : 'border-slate-300'
                }`}
                title="Matte Black Pro"
              />
              <button
                type="button"
                onClick={() => handleThemeChange('pokeball_crimson')}
                className={`w-6 h-6 rounded-full bg-red-600 border-2 transition-transform ${
                  theme === 'pokeball_crimson' ? 'border-[#DC143C] scale-110 shadow-xs' : 'border-slate-300'
                }`}
                title="Pokéball Crimson"
              />
              <button
                type="button"
                onClick={() => handleThemeChange('masterball_purple')}
                className={`w-6 h-6 rounded-full bg-purple-700 border-2 transition-transform relative ${
                  theme === 'masterball_purple' ? 'border-[#DC143C] scale-110 shadow-xs' : 'border-slate-300'
                }`}
                title="Master Ball Purple (Pro)"
              >
                {!isPro && <Lock className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" />}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('gold_charizard')}
                className={`w-6 h-6 rounded-full bg-amber-500 border-2 transition-transform relative ${
                  theme === 'gold_charizard' ? 'border-[#DC143C] scale-110 shadow-xs' : 'border-slate-300'
                }`}
                title="Gold Charizard Edition (Pro)"
              >
                {!isPro && <Lock className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" />}
              </button>
            </div>
          </div>

          {/* Filter Switcher */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#64748B] block font-semibold">
              Filter View
            </span>
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-lg font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => { setFilterMode('all'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded ${filterMode === 'all' ? 'bg-[#DC143C] text-white' : 'text-[#64748B]'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => { setFilterMode('owned'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded ${filterMode === 'owned' ? 'bg-[#DC143C] text-white' : 'text-[#64748B]'}`}
              >
                Owned ({ownedCardsCount})
              </button>
              <button
                type="button"
                onClick={() => { setFilterMode('missing'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded ${filterMode === 'missing' ? 'bg-[#DC143C] text-white' : 'text-[#64748B]'}`}
              >
                Missing ({missingCardsCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIRTUAL BINDER ALBUM CANVAS */}
      <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl transition-all duration-300 relative overflow-hidden ${getThemeStyles()}`}>
        {/* Binder Spine Decor */}
        <div className="absolute top-0 bottom-0 left-1/2 w-4 -ml-2 bg-gradient-to-r from-black/60 via-slate-800/80 to-black/60 z-20 shadow-xl hidden md:block" />

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 text-white font-mono text-xs z-10 relative border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FFD700]">Page {currentPage} of {totalPages}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">{currentSet?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="font-num font-bold">{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Binder Pocket Grid */}
        <div className={`grid gap-4 sm:gap-6 relative z-10 ${
          layout === '3x3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}>
          {pageCards.map((card) => {
            const isOwned = (userDecksCardsMap[card.id] || 0) > 0;
            const ownedQty = userDecksCardsMap[card.id] || 0;

            return (
              <div
                key={card.id}
                onClick={() => onSelectCard(card)}
                className={`relative group p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isOwned
                    ? 'bg-slate-900/80 border-slate-700/80 hover:border-[#DC143C] shadow-lg hover:shadow-2xl hover:-translate-y-1'
                    : 'bg-black/50 border-slate-800/80 hover:border-slate-600 opacity-75'
                }`}
              >
                {/* Ultra-Pro Style Sleeve Frame */}
                <div className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                  {isOwned ? (
                    <div className="w-full h-full relative group">
                      <CardImage
                        src={card.images.small || card.images.large}
                        alt={card.name}
                        cardName={card.name}
                        cardNumber={card.number}
                        setId={card.set?.id}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Interactive Holographic Foil Shimmer Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Qty Badge */}
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md border border-emerald-400/30">
                        x{ownedQty}
                      </div>
                    </div>
                  ) : (
                    /* Missing Card Silhouette Slot */
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center space-y-2 bg-gradient-to-b from-slate-900 to-black">
                      <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                        <BookOpen className="w-6 h-6 opacity-40" />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-400 block truncate max-w-full">
                        #{card.number} {card.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#DC143C] bg-[#FFF0F3]/10 px-2 py-0.5 rounded border border-[#DC143C]/20">
                        Missing Slot
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Label Footer */}
                <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-white">
                  <span className="truncate font-semibold max-w-[120px]" title={card.name}>
                    {card.name}
                  </span>
                  <span className="font-num text-slate-400">
                    {formatCurrency(card.prices.raw, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Page Footer Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10 text-white font-mono text-xs z-10 relative">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="neo-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <span className="text-slate-400">
            Showing slots { (currentPage - 1) * slotsPerPage + 1 } – { Math.min(displayedSetCards.length, currentPage * slotsPerPage) } of { displayedSetCards.length }
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="neo-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MISSING CARD GAP CHECKLIST MODAL */}
      {showGapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                  Missing Card Gap Radar ({currentSet?.name})
                </h3>
                <p className="font-mono text-xs text-[#64748B]">
                  {missingCards.length} cards remaining to complete this expansion.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGapModal(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
              {missingCards.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-heading font-bold text-base text-[#0F172A]">
                    Master Set Complete!
                  </h4>
                  <p className="font-mono text-xs text-[#64748B]">
                    You own every catalogued card in {currentSet?.name}!
                  </p>
                </div>
              ) : (
                missingCards.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#DC143C] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded overflow-hidden border border-[#E2E8F0] shrink-0">
                        <CardImage src={c.images.small} alt={c.name} cardName={c.name} />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-xs text-[#0F172A]">
                          #{c.number} {c.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#64748B]">
                          {c.rarity || 'Common'} • Market {formatCurrency(c.prices.raw, currency)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowGapModal(false);
                        onNavigateToSearch(c.name);
                      }}
                      className="px-3 py-1.5 neo-btn-primary text-xs flex items-center gap-1"
                    >
                      <span>Search Comps</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
