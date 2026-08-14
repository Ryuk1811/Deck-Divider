import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Search,
  Loader2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { CardSet, PokemonCard, Deck, DisplayCurrency } from '../types';
import { HolographicCard } from '../components/HolographicCard';
import { SetLogoBadge } from '../components/SetLogoBadge';
import { getCardsBySetCatalog, getExpansionsCatalog } from '../lib/dataSyncEngine';
import { getDynamicSeriesCategories, normalizeSet, sortSetsChronologically } from '../utils/setCategorizer';

interface SetsViewProps {
  sets: CardSet[];
  cards: PokemonCard[];
  decks: Deck[];
  currency: DisplayCurrency;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
}

export const SetsView: React.FC<SetsViewProps> = ({
  sets: propSets,
  cards: propCards,
  decks,
  currency,
  onSelectCard,
  onQuickLookCard,
}) => {
  const [allExpansions, setAllExpansions] = useState<CardSet[]>(
    propSets.length > 0 ? sortSetsChronologically(propSets.map(normalizeSet)) : []
  );
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [loadedCardsMap, setLoadedCardsMap] = useState<Record<string, PokemonCard[]>>({});
  const [setCards, setSetCards] = useState<PokemonCard[]>([]);
  const [isLoadingSetCards, setIsLoadingSetCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardSearchQuery, setCardSearchQuery] = useState('');
  const [cardSortBy, setCardSortBy] = useState<'number' | 'price-desc' | 'price-asc' | 'name' | 'rarity'>('number');
  const [viewMode, setViewMode] = useState<'grid' | 'binder'>('grid');
  const [binderPageIndex, setBinderPageIndex] = useState(0);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('All');

  // Fetch all expansions from live TCGdex / PokemonTCG API catalog on mount
  useEffect(() => {
    getExpansionsCatalog().then((expansions) => {
      const formatted: CardSet[] = sortSetsChronologically(expansions.map(normalizeSet));
      setAllExpansions(formatted);
      if (formatted.length > 0 && !selectedSetId) {
        setSelectedSetId(formatted[0].id);
      }
    });
  }, []);

  const activeSet = allExpansions.find((s) => s.id === selectedSetId) || allExpansions[0];

  // Fetch cards for the selected set
  useEffect(() => {
    if (!activeSet?.id) return;
    const setId = activeSet.id;
    setBinderPageIndex(0);
    setCardSearchQuery('');

    if (loadedCardsMap[setId]) {
      setSetCards(loadedCardsMap[setId]);
      return;
    }

    setIsLoadingSetCards(true);
    getCardsBySetCatalog(setId)
      .then((fetchedCards) => {
        setLoadedCardsMap((prev) => ({ ...prev, [setId]: fetchedCards }));
        setSetCards(fetchedCards);
      })
      .catch((err) => {
        console.error(`Error loading cards for set ${setId}:`, err);
      })
      .finally(() => {
        setIsLoadingSetCards(false);
      });
  }, [activeSet?.id]);

  // Dynamic Series list from available expansions
  const seriesCategories = useMemo(() => {
    return getDynamicSeriesCategories(allExpansions);
  }, [allExpansions]);

  // Filter expansions by series filter & search query
  const filteredExpansions = useMemo(() => {
    return allExpansions.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedSeriesFilter === 'All') return true;
      return s.series.toLowerCase() === selectedSeriesFilter.toLowerCase();
    });
  }, [allExpansions, searchQuery, selectedSeriesFilter]);

  // Calculate set completion percentage based on owned cards in user's decks
  const ownedCardIds = useMemo(() => {
    const ids = new Set<string>();
    decks.forEach((deck) => {
      deck.entries.forEach((e) => {
        if (!e.isSold) ids.add(e.cardId);
      });
    });
    return ids;
  }, [decks]);

  const ownedInSet = setCards.filter((c) => ownedCardIds.has(c.id)).length;
  const setCompletionPercent =
    setCards.length > 0 ? Math.round((ownedInSet / setCards.length) * 100) : 0;

  // Filter and sort cards within active set
  const filteredSetCards = useMemo(() => {
    let result = [...setCards];

    if (cardSearchQuery.trim()) {
      const q = cardSearchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.number.toLowerCase().includes(q) ||
          (c.artist && c.artist.toLowerCase().includes(q)) ||
          (c.rarity && c.rarity.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (cardSortBy === 'price-desc') return (b.prices?.raw || 0) - (a.prices?.raw || 0);
      if (cardSortBy === 'price-asc') return (a.prices?.raw || 0) - (b.prices?.raw || 0);
      if (cardSortBy === 'name') return a.name.localeCompare(b.name);
      if (cardSortBy === 'rarity') return (b.rarity || '').localeCompare(a.rarity || '');
      // Default: sort by card number numeric
      const numA = parseInt(a.number.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.number.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    return result;
  }, [setCards, cardSearchQuery, cardSortBy]);

  // Binder 9-pocket pagination
  const CARDS_PER_BINDER_PAGE = 9;
  const totalBinderPages = Math.ceil(filteredSetCards.length / CARDS_PER_BINDER_PAGE) || 1;
  const currentBinderCards = filteredSetCards.slice(
    binderPageIndex * CARDS_PER_BINDER_PAGE,
    (binderPageIndex + 1) * CARDS_PER_BINDER_PAGE
  );

  return (
    <div className="app-view-container space-y-6 animate-fade-in pb-12">
      {/* EXPANSIONS HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#EBEBEB] pb-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
            Official Expansions
          </h1>
          <p className="font-mono text-xs text-[#666666] mt-1">
            Browse complete set catalogs, track master set completion, and inspect card checklists.
          </p>
        </div>

        {/* Set Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sets by name or code..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#EBEBEB] font-mono text-xs text-[#111111] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* SERIES FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {seriesCategories.map((series) => {
          const isSelected = selectedSeriesFilter === series;
          return (
            <button
              key={series}
              type="button"
              onClick={() => setSelectedSeriesFilter(series)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'bg-white text-[#666666] border border-[#EBEBEB] hover:border-[#DC143C] hover:text-[#111111]'
              }`}
            >
              {series}
            </button>
          );
        })}
      </div>

      {/* INTERNAL SCROLLABLE EXPANSIONS PANEL */}
      <div className="p-4 sm:p-5 bg-white border border-[#EBEBEB] rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-[#666666] pb-2 border-b border-[#EBEBEB]">
          <span>
            Showing <strong className="text-[#111111] font-mono">{filteredExpansions.length}</strong> expansions
          </span>
          <span className="hidden sm:inline">Scroll within panel to view all sets</span>
        </div>

        {/* Scrollable Container with max height */}
        <div className="max-h-72 sm:max-h-80 md:max-h-96 overflow-y-auto pr-1.5 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredExpansions.map((s) => {
              const isSelected = s.id === activeSet?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSetId(s.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FFF0F3] border-[#DC143C] ring-2 ring-[#DC143C]/20 shadow-xs'
                      : 'bg-[#F9F9F9] border-[#EBEBEB] hover:border-[#DC143C] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <SetLogoBadge
                      setId={s.id}
                      setName={s.name}
                      series={s.series}
                      logoUrl={s.logoUrl}
                      symbolUrl={s.symbolUrl}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#666666] block truncate">
                        {s.series}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#111111] truncate leading-tight mt-0.5">
                        {s.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px] text-[#666666] pt-2 border-t border-[#EBEBEB]/80 w-full">
                    <span className="font-bold text-[#111111] bg-[#EBEBEB]/50 px-2 py-0.5 rounded text-[10px]">
                      {s.id.toUpperCase()}
                    </span>
                    <span className="font-mono text-[#666666]">
                      {s.total || s.printedTotal} Cards
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED SET DETAIL & CATALOG SECTION */}
      {activeSet && (
        <div className="space-y-6 pt-2">
          {/* Active Set Banner */}
          <div className="p-6 bg-white border border-[#EBEBEB] rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <SetLogoBadge
                setId={activeSet.id}
                setName={activeSet.name}
                series={activeSet.series}
                logoUrl={activeSet.logoUrl}
                symbolUrl={activeSet.symbolUrl}
                size="hero"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded border border-[#DC143C]/20">
                    {activeSet.series}
                  </span>
                  <span className="font-mono text-xs text-[#666666]">
                    Released {activeSet.releaseDate || 'Official Set'}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] mt-1">
                  {activeSet.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* View Switcher: Grid vs 9-Pocket Binder */}
              <div className="flex items-center gap-1 p-1 bg-[#F9F9F9] rounded-lg border border-[#EBEBEB]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#111111] shadow-2xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('binder')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'binder'
                      ? 'bg-[#111111] text-white shadow-2xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>9-Pocket Binder</span>
                </button>
              </div>

              {/* Set Completion Counter */}
              <div className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                <span>
                  Completion: {setCompletionPercent}% ({ownedInSet}/{setCards.length || activeSet.total})
                </span>
              </div>
            </div>
          </div>

          {/* Cards Search & Sort Filter Bar inside Set */}
          <div className="p-4 bg-white border border-[#EBEBEB] rounded-xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cardSearchQuery}
                onChange={(e) => setCardSearchQuery(e.target.value)}
                placeholder={`Search inside ${activeSet.name}...`}
                className="w-full pl-9 pr-4 py-1.5 bg-[#F9F9F9] border border-[#EBEBEB] font-mono text-xs text-[#111111] rounded-lg focus:outline-none focus:border-[#DC143C]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="font-mono text-xs text-[#666666] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={cardSortBy}
                onChange={(e) => setCardSortBy(e.target.value as any)}
                className="p-1.5 bg-[#F9F9F9] border border-[#EBEBEB] font-mono text-xs font-bold text-[#111111] rounded-lg focus:outline-none focus:border-[#DC143C]"
              >
                <option value="number">Card Number (#)</option>
                <option value="price-desc">Highest Price First</option>
                <option value="price-asc">Lowest Price First</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="rarity">Rarity Tier</option>
              </select>
            </div>
          </div>

          {/* CARDS DISPLAY AREA */}
          {isLoadingSetCards ? (
            <div className="py-20 text-center bg-white border border-[#EBEBEB] rounded-2xl shadow-2xs space-y-3">
              <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin mx-auto" />
              <p className="font-mono text-xs text-[#666666]">
                Fetching cards for {activeSet.name} from official TCG catalog...
              </p>
            </div>
          ) : filteredSetCards.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#EBEBEB] rounded-2xl shadow-2xs text-[#666666] font-mono text-xs">
              No matching cards found in {activeSet.name}.
            </div>
          ) : viewMode === 'binder' ? (
            /* 9-POCKET BINDER VIEW */
            <div className="space-y-4">
              {/* Binder Pagination Bar */}
              <div className="p-4 bg-white border border-[#EBEBEB] rounded-xl shadow-2xs flex items-center justify-between font-mono text-xs">
                <button
                  type="button"
                  disabled={binderPageIndex === 0}
                  onClick={() => setBinderPageIndex((p) => Math.max(0, p - 1))}
                  className="px-3.5 py-1.5 bg-[#F9F9F9] border border-[#EBEBEB] rounded-lg hover:border-[#DC143C] disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </button>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#DC143C]" />
                  <span className="font-bold text-[#111111]">
                    Binder Page {binderPageIndex + 1} of {totalBinderPages}
                  </span>
                  <span className="text-[#666666] hidden sm:inline">
                    (Cards #{binderPageIndex * 9 + 1} - {Math.min(filteredSetCards.length, (binderPageIndex + 1) * 9)})
                  </span>
                </div>

                <button
                  type="button"
                  disabled={binderPageIndex >= totalBinderPages - 1}
                  onClick={() => setBinderPageIndex((p) => Math.min(totalBinderPages - 1, p + 1))}
                  className="px-3.5 py-1.5 bg-[#F9F9F9] border border-[#EBEBEB] rounded-lg hover:border-[#DC143C] disabled:opacity-40 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3x3 Physical Binder Sleeve Album */}
              <div className="p-6 rounded-2xl bg-[#0F172A] border-4 border-[#0F172A] shadow-2xl">
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {currentBinderCards.map((card) => {
                    const isOwned = ownedCardIds.has(card.id);
                    return (
                      <div
                        key={card.id}
                        className={`relative aspect-[0.718] rounded-xl p-2 flex flex-col justify-between transition-all duration-200 ${
                          isOwned
                            ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg'
                            : 'bg-black/30 backdrop-blur-xs border border-white/10'
                        }`}
                      >
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <HolographicCard
                            card={card}
                            currency={currency}
                            onClick={() => onSelectCard(card)}
                            onQuickLook={() => onQuickLookCard(card)}
                          />
                        </div>

                        {/* Owned / Unowned Pocket Badge */}
                        <div className="absolute top-3 left-3 pointer-events-none z-10">
                          {isOwned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16A34A] text-white font-mono text-[9px] font-bold shadow-md">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Owned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F172A]/90 text-white/90 font-mono text-[9px] font-bold shadow-md">
                              #{card.number} Unowned
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD EXPANSIVE GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB]">
              {filteredSetCards.map((card) => {
                const isOwned = ownedCardIds.has(card.id);
                return (
                  <div key={card.id} className="relative group">
                    <HolographicCard
                      card={card}
                      currency={currency}
                      onClick={() => onSelectCard(card)}
                      onQuickLook={() => onQuickLookCard(card)}
                    />

                    <div className="absolute top-2 left-2 pointer-events-none z-10">
                      {isOwned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16A34A] text-white font-mono text-[9px] font-bold shadow-md">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Owned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F172A]/90 text-white font-mono text-[9px] font-bold shadow-md">
                          #{card.number} Unowned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
