import React, { useState, useMemo } from 'react';
import {
  Grid,
  Table,
  BookOpen,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  Sparkles,
  Eye,
  ListOrdered,
  DollarSign,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import {
  Deck,
  PortfolioCardEntry,
  DisplayCurrency,
  PokemonCard,
  EnergyType,
  CustomList,
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { HolographicCard } from '../components/HolographicCard';

interface CollectionViewProps {
  decks: Deck[];
  allCards: PokemonCard[];
  currency: DisplayCurrency;
  customLists: CustomList[];
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  onSelectDeck: (deckId: string) => void;
  onAddCardToDeck?: (deckId: string, card: PokemonCard) => void;
  onAddCardToList?: (listId: string, cardId: string) => void;
}

export type GroupByOption = 'none' | 'type' | 'rarity' | 'set' | 'deck' | 'supertype';
export type ViewModeOption = 'binder' | 'grid' | 'table';
export type SortOption = 'price-desc' | 'price-asc' | 'name-asc' | 'set-asc' | 'qty-desc';

const ALL_TYPES: EnergyType[] = [
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Fighting',
  'Darkness',
  'Steel',
  'Dragon',
  'Colorless',
];

export const CollectionView: React.FC<CollectionViewProps> = ({
  decks,
  allCards,
  currency,
  customLists,
  onSelectCard,
  onQuickLookCard,
  onSelectDeck,
  onAddCardToDeck,
  onAddCardToList,
}) => {
  // View & Grouping Controls State
  const [viewMode, setViewMode] = useState<ViewModeOption>('grid');
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EnergyType[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('all');
  const [selectedDeckFilter, setSelectedDeckFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-desc');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Binder Page State
  const [binderPage, setBinderPage] = useState(1);

  // Quick Action Dropdown State
  const [activeActionMenuCardId, setActiveActionMenuCardId] = useState<string | null>(null);

  // 1. Gather all portfolio entries with assigned deck metadata
  const collectionEntries: {
    entry: PortfolioCardEntry;
    card: PokemonCard;
    deckName: string;
    deckColor: string;
    deckId: string;
  }[] = useMemo(() => {
    const items: {
      entry: PortfolioCardEntry;
      card: PokemonCard;
      deckName: string;
      deckColor: string;
      deckId: string;
    }[] = [];

    decks.forEach((deck) => {
      deck.entries.forEach((entry) => {
        if (!entry.isSold) {
          items.push({
            entry,
            card: entry.card,
            deckName: deck.name,
            deckColor: deck.colorHex,
            deckId: deck.id,
          });
        }
      });
    });

    return items;
  }, [decks]);

  // Total Collection Metrics
  const totalValuation = useMemo(
    () => collectionEntries.reduce((acc, item) => acc + item.card.prices.raw * item.entry.quantity, 0),
    [collectionEntries]
  );
  const totalQuantity = useMemo(
    () => collectionEntries.reduce((acc, item) => acc + item.entry.quantity, 0),
    [collectionEntries]
  );
  const uniqueCardCount = useMemo(() => collectionEntries.length, [collectionEntries]);

  // 2. Filter & Segregate Cards
  const filteredEntries = useMemo(() => {
    return collectionEntries.filter((item) => {
      const card = item.card;

      // Search Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set.name.toLowerCase().includes(q);
        const matchesNumber = card.number.toLowerCase().includes(q);
        if (!matchesName && !matchesSet && !matchesNumber) return false;
      }

      // Energy Type Filter
      if (selectedTypes.length > 0) {
        const expandedSelectedTypes = selectedTypes.flatMap(t => {
          if (t === 'Electric' || t === 'Lightning') return ['Electric', 'Lightning'];
          if (t === 'Steel' || t === 'Metal') return ['Steel', 'Metal'];
          return [t];
        });
        const hasMatchingType = card.types?.some((t) => expandedSelectedTypes.includes(t as any));
        if (!hasMatchingType) return false;
      }

      // Rarity Filter
      if (selectedRarities.length > 0) {
        if (!card.rarity || !selectedRarities.includes(card.rarity)) return false;
      }

      // Set Filter
      if (selectedSetId !== 'all') {
        if (card.set.id !== selectedSetId) return false;
      }

      // Deck Filter
      if (selectedDeckFilter !== 'all') {
        if (item.deckId !== selectedDeckFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.card.prices.raw - a.card.prices.raw;
      if (sortBy === 'price-asc') return a.card.prices.raw - b.card.prices.raw;
      if (sortBy === 'name-asc') return a.card.name.localeCompare(b.card.name);
      if (sortBy === 'set-asc') return a.card.set.name.localeCompare(b.card.set.name);
      if (sortBy === 'qty-desc') return b.entry.quantity - a.entry.quantity;
      return 0;
    });
  }, [
    collectionEntries,
    searchQuery,
    selectedTypes,
    selectedRarities,
    selectedSetId,
    selectedDeckFilter,
    sortBy,
  ]);

  // Unique Sets for filter dropdown
  const availableSets = useMemo(() => {
    const setMap = new Map<string, string>();
    collectionEntries.forEach((item) => {
      setMap.set(item.card.set.id, item.card.set.name);
    });
    return Array.from(setMap.entries()).map(([id, name]) => ({ id, name }));
  }, [collectionEntries]);

  // Unique Rarities for filter pills
  const availableRarities = useMemo(() => {
    const rarities = new Set<string>();
    collectionEntries.forEach((item) => {
      if (item.card.rarity) rarities.add(item.card.rarity);
    });
    return Array.from(rarities);
  }, [collectionEntries]);

  // 3. Grouping Logic
  const groupedCollection = useMemo(() => {
    if (groupBy === 'none') {
      return [{ groupName: 'All Collection Holdings', items: filteredEntries }];
    }

    const groupsMap = new Map<
      string,
      {
        entry: PortfolioCardEntry;
        card: PokemonCard;
        deckName: string;
        deckColor: string;
        deckId: string;
      }[]
    >();

    filteredEntries.forEach((item) => {
      let key = 'Other';
      if (groupBy === 'type') {
        key = item.card.types?.[0] || 'Trainer/Energy';
      } else if (groupBy === 'rarity') {
        key = item.card.rarity || 'Common';
      } else if (groupBy === 'set') {
        key = item.card.set.name;
      } else if (groupBy === 'deck') {
        key = item.deckName;
      } else if (groupBy === 'supertype') {
        key = item.card.supertype || 'Pokémon';
      }

      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(item);
    });

    return Array.from(groupsMap.entries()).map(([groupName, items]) => ({
      groupName,
      items,
    }));
  }, [filteredEntries, groupBy]);

  // Binder Pagination calculations (9 items per page)
  const itemsPerPage = 9;
  const totalBinderPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const currentBinderItems = useMemo(() => {
    const start = (binderPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, binderPage]);

  const toggleTypeFilter = (t: EnergyType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const toggleRarityFilter = (r: string) => {
    setSelectedRarities((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedRarities([]);
    setSelectedSetId('all');
    setSelectedDeckFilter('all');
    setSortBy('price-desc');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedTypes.length > 0 ||
    selectedRarities.length > 0 ||
    selectedSetId !== 'all' ||
    selectedDeckFilter !== 'all';

  return (
    <div className="space-y-6 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* 1. TOP GLOBAL COLLECTION METRICS & CONTROL BAR */}
      <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 flex items-center justify-center text-[#DC143C]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-[#0F172A]">
                  Global Portfolio Inventory
                </h2>
                <span className="font-mono text-xs font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded">
                  {uniqueCardCount} Unique Entries
                </span>
              </div>
              <p className="font-mono text-xs text-[#64748B] mt-0.5">
                {totalQuantity} total cards across {decks.length} active decks & binders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A]">
              <span className="text-[#64748B]">Total Value: </span>
              <strong className="font-num text-sm text-[#DC143C] font-bold">
                {formatCurrency(totalValuation, currency)}
              </strong>
            </div>
          </div>
        </div>

        {/* CONTROLS ROW: View Mode Switcher, Grouping Dropdown, Filter Panel Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
          {/* Left: View Modes */}
          <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#DC143C] shadow-xs border border-[#E2E8F0] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('binder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all ${
                viewMode === 'binder'
                  ? 'bg-white text-[#DC143C] shadow-xs border border-[#E2E8F0] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3x3 Binder</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#DC143C] shadow-xs border border-[#E2E8F0] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Data Table</span>
            </button>
          </div>

          {/* Center: Grouping Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#64748B]">
              Group Collection By:
            </span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
              className="bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-mono font-bold px-3 py-1.5 rounded-md focus:border-[#DC143C] focus:outline-none shadow-xs"
            >
              <option value="none">No Grouping (Flat View)</option>
              <option value="type">Energy Type</option>
              <option value="rarity">Rarity Tier</option>
              <option value="set">Expansion Set</option>
              <option value="deck">Assigned Deck / Binder</option>
              <option value="supertype">Supertype (Pokémon/Trainer/Energy)</option>
            </select>
          </div>

          {/* Right: Filters & Search Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold rounded-md border transition-all shadow-xs ${
                hasActiveFilters || isFilterPanelOpen
                  ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]'
                  : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#DC143C]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#DC143C]" />
              <span>
                {isFilterPanelOpen ? 'Close Filter Panel' : 'Segregation & Filters'}
              </span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#DC143C]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXPANDABLE SEGREGATION & FILTER PANEL */}
      {isFilterPanelOpen && (
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#DC143C]" />
              <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                Collection Segregation & Filter Engine
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-mono text-xs text-[#DC143C] font-semibold hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#64748B]">
                Search Card Name / Set / #
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Charizard, 151..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                />
              </div>
            </div>

            {/* Set Filter Dropdown */}
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#64748B]">
                Expansion Set
              </label>
              <select
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] p-1.5 rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="all">All Expansion Sets</option>
                {availableSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deck Filter Dropdown */}
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#64748B]">
                Assigned Deck Location
              </label>
              <select
                value={selectedDeckFilter}
                onChange={(e) => setSelectedDeckFilter(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] p-1.5 rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="all">All Decks & Binders</option>
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.entries.length} cards)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Pills */}
          <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
            <span className="font-mono text-xs font-bold text-[#64748B]">
              Filter Energy Types:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleTypeFilter(type)}
                    className={`px-2.5 py-1 font-mono text-xs rounded-md border transition-all ${
                      isSelected
                        ? 'bg-[#DC143C] text-white border-[#DC143C] font-bold shadow-xs'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rarity Pills */}
          {availableRarities.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#64748B]">
                Filter Rarities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableRarities.map((rarity) => {
                  const isSelected = selectedRarities.includes(rarity);
                  return (
                    <button
                      key={rarity}
                      type="button"
                      onClick={() => toggleRarityFilter(rarity)}
                      className={`px-2.5 py-1 font-mono text-xs rounded-md border transition-all ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border-[#0F172A] font-bold shadow-xs'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                      }`}
                    >
                      {rarity}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MAIN CONTENT RENDER (BINDER, GRID, OR TABLE) */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-[#E2E8F0] space-y-3">
          <BookOpen className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <h3 className="font-heading font-bold text-lg text-[#0F172A]">
            No Cards Matching Active Collection Filters
          </h3>
          <p className="font-mono text-xs text-[#64748B] max-w-md mx-auto">
            Try resetting your search query or energy type filters to view all cards in your global inventory.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="neo-btn-primary px-4 py-2 text-xs inline-block"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'binder' ? (
        /* BINDER VIEW (3x3 PAGE LAYOUT WITH PAGINATION) */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-[#E2E8F0]">
            <div className="font-mono text-xs font-bold text-[#0F172A]">
              3x3 Binder View &bull; Page {binderPage} of {totalBinderPages} ({filteredEntries.length} Total Cards)
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                type="button"
                disabled={binderPage <= 1}
                onClick={() => setBinderPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>
              <span className="px-3 py-1.5 bg-[#0F172A] text-white rounded-md font-bold">
                {binderPage} / {totalBinderPages}
              </span>
              <button
                type="button"
                disabled={binderPage >= totalBinderPages}
                onClick={() => setBinderPage((p) => Math.min(totalBinderPages, p + 1))}
                className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex items-center gap-1 font-bold"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3x3 Binder Grid Canvas */}
          <div className="p-6 bg-[#0F172A] rounded-xl border-4 border-[#1E293B] shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentBinderItems.map(({ entry, card, deckName, deckColor, deckId }) => (
                <div key={`${deckId}-${entry.id}`} className="space-y-2 group">
                  <div className="relative">
                    <HolographicCard
                      card={card}
                      rarity={card.rarity}
                      onClick={() => onSelectCard(card)}
                      onQuickLook={() => onQuickLookCard(card)}
                    />
                    {/* Quantity Badge */}
                    <div className="absolute top-2 right-2 bg-[#0F172A]/90 backdrop-blur-sm text-white font-mono text-xs font-bold px-2 py-0.5 rounded border border-white/20">
                      x{entry.quantity}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-md border border-white/10 text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs truncate">
                        {card.name}
                      </span>
                      <span className="font-num font-bold text-xs text-[#FFD700]">
                        {formatCurrency(card.prices.raw, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#CBD5E1]">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: deckColor }} />
                        {deckName}
                      </span>
                      <span>{card.set.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-mono text-xs text-[#64748B]">
                  <th className="p-3">Card</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Set</th>
                  <th className="p-3">Rarity</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Deck Location</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Market Price</th>
                  <th className="p-3 text-right">Total Value</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] font-mono text-xs">
                {filteredEntries.map(({ entry, card, deckName, deckColor, deckId }) => (
                  <tr
                    key={`${deckId}-${entry.id}`}
                    className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => onSelectCard(card)}
                  >
                    <td className="p-3">
                      <img
                        src={card.images.small || 'https://images.pokemontcg.io/cardback.png'}
                        alt={card.name}
                        className="w-8 h-11 object-cover rounded border border-[#E2E8F0] group-hover:scale-105 transition-transform"
                      />
                    </td>
                    <td className="p-3 font-heading font-bold text-[#0F172A] text-sm">
                      {card.name}
                    </td>
                    <td className="p-3 text-[#64748B]">{card.set.name}</td>
                    <td className="p-3">
                      <span className="bg-[#F1F5F9] text-[#0F172A] px-2 py-0.5 rounded font-semibold text-[11px]">
                        {card.rarity || 'Common'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#DC143C] font-bold">
                        {card.types?.join(', ') || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDeck(deckId);
                        }}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#E2E8F0] hover:border-[#DC143C] transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: deckColor }} />
                        <span className="font-semibold">{deckName}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-[#0F172A]">
                      {entry.quantity}
                    </td>
                    <td className="p-3 text-right font-num font-bold text-[#0F172A]">
                      {formatCurrency(card.prices.raw, currency)}
                    </td>
                    <td className="p-3 text-right font-num font-bold text-[#DC143C]">
                      {formatCurrency(card.prices.raw * entry.quantity, currency)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLookCard(card);
                        }}
                        className="p-1.5 hover:bg-[#FFF0F3] hover:text-[#DC143C] text-[#64748B] rounded transition-colors"
                        title="Quick Look"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW (WITH GROUPING SUPPORT) */
        <div className="space-y-8">
          {groupedCollection.map((group) => (
            <div key={group.groupName} className="space-y-4">
              {groupBy !== 'none' && (
                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">
                      {group.groupName}
                    </h3>
                    <span className="font-mono text-xs font-bold bg-[#DC143C] text-white px-2 py-0.5 rounded">
                      {group.items.length} Cards
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#64748B]">
                    Group Valuation:{' '}
                    <strong className="font-num text-[#0F172A] font-bold">
                      {formatCurrency(
                        group.items.reduce((acc, i) => acc + i.card.prices.raw * i.entry.quantity, 0),
                        currency
                      )}
                    </strong>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                {group.items.map(({ entry, card, deckName, deckColor, deckId }) => (
                  <div key={`${deckId}-${entry.id}`} className="group relative">
                    <HolographicCard
                      card={card}
                      currency={currency}
                      quantity={entry.quantity}
                      deckName={deckName}
                      deckColor={deckColor}
                      onClick={() => onSelectCard(card)}
                      onQuickLook={() => onQuickLookCard(card)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
