import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronDown,
  Lock,
} from 'lucide-react';
import {
  Deck,
  PortfolioCardEntry,
  DisplayCurrency,
  PokemonCard,
  EnergyType,
  CustomList,
  AccountTier,
  TIER_LIMITS,
} from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { CardImage } from '../../components/ui/CardImage';
import { DropdownMenu } from '../../components/ui/DropdownMenu';
import { queueCardsForProgressivePrewarm } from '../../utils/progressiveImageLoader';
import { PublicShareLinkBox } from '../../components/ui/PublicShareLinkBox';
import { encodePortfolioToUrl } from '../../utils/portfolioUrlEncoder';
import { getPokemonSpeciesTypes } from '../../data/pokemonSpeciesTypes';
import { MobilePortfolioHub } from '../../components/app/MobilePortfolioHub';
import { ActiveTab } from '../../components/ui/Sidebar';
import { PortfolioSealedEntry } from '../../types';

interface CollectionViewProps {
  decks: Deck[];
  allCards: PokemonCard[];
  currency: DisplayCurrency;
  customLists: CustomList[];
  sealedEntries?: PortfolioSealedEntry[];
  userEmail?: string;
  userId?: string;
  currentTier?: AccountTier;
  onTriggerLimitModal?: (action: 'SHARE_PUBLIC_LINK') => void;
  isPublicProfile?: boolean;
  onTogglePublicProfile?: (isPublic: boolean) => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  onSelectDeck: (deckId: string) => void;
  onAddCardToList?: (listId: string, cardId: string) => void;
  onNavigateToSearch?: () => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
  onLoadShowcase?: () => void;
  onAddSampleDeck?: () => void;
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
  'Ghost',
  'Dragon',
  'Dark',
  'Fairy',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ice',
  'Steel',
  'Normal',
];

const COLLECTION_CHUNK_SIZE = 40;

export const CollectionView: React.FC<CollectionViewProps> = ({
  decks,
  allCards,
  currency,
  customLists,
  sealedEntries = [],
  userEmail,
  userId,
  currentTier = 'Starter',
  onTriggerLimitModal,
  isPublicProfile,
  onTogglePublicProfile,
  onSelectCard,
  onQuickLookCard,
  onSelectDeck,
  onAddCardToList,
  onNavigateToSearch,
  onNavigateToTab,
  onLoadShowcase,
  onAddSampleDeck,
}) => {
  const isSuperUser = userEmail?.toLowerCase() === 'gurutvamurdia@gmail.com';

  // View & Grouping Controls State
  const [viewMode, setViewMode] = useState<ViewModeOption>('grid');
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  
  // Instant input state vs debounced search filter
  const [searchInputText, setSearchInputText] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [selectedTypes, setSelectedTypes] = useState<EnergyType[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('all');
  const [selectedDeckFilter, setSelectedDeckFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-desc');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(COLLECTION_CHUNK_SIZE);

  // Binder Page State
  const [binderPage, setBinderPage] = useState(1);

  // Debounce collection search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchInputText);
      setVisibleCardCount(COLLECTION_CHUNK_SIZE);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInputText]);

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
  const totalCostBasis = useMemo(
    () =>
      collectionEntries.reduce(
        (acc, item) =>
          acc +
          (item.entry.purchasePrice && item.entry.purchasePrice > 0
            ? item.entry.purchasePrice
            : item.card.prices.raw * 0.74) *
            item.entry.quantity,
        0
      ),
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
      if (debouncedSearchQuery.trim() !== '') {
        const q = debouncedSearchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesSet = card.set.name.toLowerCase().includes(q);
        const matchesNumber = card.number.toLowerCase().includes(q);
        if (!matchesName && !matchesSet && !matchesNumber) return false;
      }

      // Species / Energy Type Filter
      if (selectedTypes.length > 0) {
        const isTrainerOrEnergy = card.category && ['trainer', 'energy', 'item', 'supporter', 'stadium'].some((c: string) => card.category?.toLowerCase().includes(c));
        const speciesTypes = isTrainerOrEnergy
          ? (card.types || [])
          : getPokemonSpeciesTypes(card.name, card.category, card.types);
        const allCardTypes = [...(speciesTypes || []), ...(card.types || [])];
        
        const hasMatchingType = allCardTypes.some((t) =>
          selectedTypes.some((st) => {
            if (st.toLowerCase() === t.toLowerCase()) return true;
            if (st === 'Electric' && t === 'Lightning') return true;
            if (st === 'Dark' && t === 'Darkness') return true;
            if (st === 'Steel' && t === 'Metal') return true;
            if (st === 'Normal' && t === 'Colorless') return true;
            return false;
          })
        );
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
    debouncedSearchQuery,
    selectedTypes,
    selectedRarities,
    selectedSetId,
    selectedDeckFilter,
    sortBy,
  ]);

  // Progressive background prewarm of filtered collection cards
  useEffect(() => {
    if (filteredEntries.length > 0) {
      queueCardsForProgressivePrewarm(
        filteredEntries.slice(0, 40).map((i) => i.card),
        'high'
      );
    }
  }, [filteredEntries]);

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
        const isTrainerOrEnergy = item.card.category && ['trainer', 'energy', 'item', 'supporter', 'stadium'].some((c: string) => item.card.category?.toLowerCase().includes(c));
        const speciesTypes = isTrainerOrEnergy ? item.card.types : getPokemonSpeciesTypes(item.card.name, item.card.category, item.card.types);
        key = speciesTypes?.[0] || item.card.types?.[0] || 'Trainer/Energy';
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

  // Binder View Paging: 9 cards per page (3x3 grid)
  const BINDER_PAGE_SIZE = 9;
  const totalBinderPages = Math.max(1, Math.ceil(filteredEntries.length / BINDER_PAGE_SIZE));
  const currentBinderCards = useMemo(() => {
    const start = (binderPage - 1) * BINDER_PAGE_SIZE;
    return filteredEntries.slice(start, start + BINDER_PAGE_SIZE);
  }, [filteredEntries, binderPage]);

  const toggleTypeFilter = (t: EnergyType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setVisibleCardCount(COLLECTION_CHUNK_SIZE);
  };

  const toggleRarityFilter = (r: string) => {
    setSelectedRarities((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
    setVisibleCardCount(COLLECTION_CHUNK_SIZE);
  };

  const clearAllFilters = () => {
    setSearchInputText('');
    setDebouncedSearchQuery('');
    setSelectedTypes([]);
    setSelectedRarities([]);
    setSelectedSetId('all');
    setSelectedDeckFilter('all');
    setSortBy('price-desc');
    setVisibleCardCount(COLLECTION_CHUNK_SIZE);
  };

  const hasActiveFilters =
    searchInputText !== '' ||
    selectedTypes.length > 0 ||
    selectedRarities.length > 0 ||
    selectedSetId !== 'all' ||
    selectedDeckFilter !== 'all';

  return (
    <div className="app-view-container space-y-4 sm:space-y-6">
      {/* 0. MOBILE-NATIVE PORTFOLIO HUB (Matches Mobile App Mockup, strictly hidden on desktop md:hidden) */}
      <MobilePortfolioHub
        decks={decks}
        allCards={allCards}
        currency={currency}
        customLists={customLists}
        sealedEntries={sealedEntries}
        onNavigateToTab={onNavigateToTab}
        onNavigateToSearch={onNavigateToSearch}
        onSelectCard={onSelectCard}
        onQuickLookCard={onQuickLookCard}
        onSelectDeck={onSelectDeck}
        totalCardsCount={totalQuantity}
        uniqueCardsCount={uniqueCardCount}
        totalHoldingsValue={totalValuation}
        totalCostBasis={totalCostBasis}
        isFilterPanelOpen={isFilterPanelOpen}
        onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        isPublicProfile={isPublicProfile}
        onTogglePublicProfile={onTogglePublicProfile}
        currentTier={currentTier}
        onTriggerLimitModal={onTriggerLimitModal}
        userId={userId}
        userEmail={userEmail}
      />

      {/* 1. TOP GLOBAL COLLECTION METRICS & CONTROL BAR (Preserved 100% for Desktop, hidden on mobile) */}
      <div className="hidden md:block p-3 sm:p-4 md:p-5 glass-slab shadow-md space-y-4">
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            {onNavigateToSearch && (
              <button
                type="button"
                onClick={onNavigateToSearch}
                className="h-9 px-4 bg-[#DC143C] text-white hover:bg-[#B01030] flex items-center justify-center gap-1.5 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Add Cards to Portfolio</span>
              </button>
            )}

            {onTogglePublicProfile && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#64748B]">
                    {isPublicProfile ? 'Showcase Public' : 'Make Public'}
                  </span>
                  {!TIER_LIMITS[currentTier]?.canSharePublicLinks && (
                    <span 
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200"
                      title="Public portfolio sharing is available on Stack Tier ($22/mo) and above"
                    >
                      <Lock className="w-2.5 h-2.5" /> Stack
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPublicProfile && !TIER_LIMITS[currentTier]?.canSharePublicLinks) {
                      onTriggerLimitModal?.('SHARE_PUBLIC_LINK');
                      return;
                    }
                    onTogglePublicProfile(!isPublicProfile);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 ${
                    isPublicProfile ? 'bg-[#16A34A]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Public Showcase"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublicProfile ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

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

            {/* Bubble Menus */}
            <DropdownMenu align="right" triggerLabel="View Mode" triggerIcon={<Grid className="w-3.5 h-3.5 text-[#DC143C]" />}>
              <div className="flex flex-col p-2 space-y-1">
                {[
                  { id: 'grid', label: 'Grid View', icon: Grid },
                  { id: 'binder', label: '3x3 Binder', icon: BookOpen },
                  { id: 'table', label: 'Data Table', icon: Table },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-mono rounded-md text-left transition-all cursor-pointer ${
                      viewMode === mode.id ? 'bg-[#DC143C] text-white font-bold' : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                ))}
              </div>
            </DropdownMenu>

            <DropdownMenu align="right" triggerLabel="Group By" triggerIcon={<Layers className="w-3.5 h-3.5 text-[#DC143C]" />}>
              <div className="flex flex-col p-2 space-y-1">
                {[
                  { id: 'none', label: 'No Grouping' },
                  { id: 'type', label: 'Energy Type' },
                  { id: 'rarity', label: 'Rarity Tier' },
                  { id: 'set', label: 'Expansion Set' },
                  { id: 'deck', label: 'Assigned Deck' },
                  { id: 'supertype', label: 'Supertype' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGroupBy(g.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-mono rounded-md text-left transition-all cursor-pointer ${
                      groupBy === g.id ? 'bg-[#DC143C] text-white font-bold' : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </DropdownMenu>

            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-md border transition-all shadow-xs cursor-pointer ${
                hasActiveFilters || isFilterPanelOpen
                  ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#DC143C]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXPANDABLE SEGREGATION & FILTER PANEL */}
      {isFilterPanelOpen && (
        <div className="p-3 sm:p-4 md:p-5 glass-slab shadow-md space-y-4">
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
                className="font-mono text-xs text-[#DC143C] font-semibold hover:underline cursor-pointer"
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
                  value={searchInputText}
                  onChange={(e) => setSearchInputText(e.target.value)}
                  placeholder="e.g. Charizard, 151..."
                  autoComplete="off"
                  spellCheck="false"
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
                onChange={(e) => {
                  setSelectedSetId(e.target.value);
                  setVisibleCardCount(COLLECTION_CHUNK_SIZE);
                }}
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
                onChange={(e) => {
                  setSelectedDeckFilter(e.target.value);
                  setVisibleCardCount(COLLECTION_CHUNK_SIZE);
                }}
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
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <span className="font-mono text-xs font-bold text-[#64748B]">
              Energy Types
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTypeFilter(t)}
                  className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                    selectedTypes.includes(t)
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Rarities */}
          {availableRarities.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#64748B]">
                Rarity Classes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableRarities.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRarityFilter(r)}
                    className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                      selectedRarities.includes(r)
                        ? 'bg-[#DC143C] text-white border-[#DC143C]'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort By Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
            <span className="font-mono text-xs font-bold text-[#64748B]">
              Sort Order
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] p-1.5 rounded-md focus:border-[#DC143C] focus:outline-none"
            >
              <option value="price-desc">Highest Value ($)</option>
              <option value="price-asc">Lowest Value ($)</option>
              <option value="name-asc">Card Name (A-Z)</option>
              <option value="set-asc">Expansion Set</option>
              <option value="qty-desc">Holdings Quantity</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC VIEW DISPLAY (BINDER / TABLE / GRID) */}
      {collectionEntries.length === 0 ? (
        <div className="p-8 sm:p-12 text-center glass-slab shadow-sm space-y-6 rounded-2xl border border-[#E2E8F0]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center mx-auto text-[#DC143C] shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F172A]">
              Portfolio Collection is Ready
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#64748B] leading-relaxed">
              No cards are currently assigned to your decks or binders. Search the Pokémon card catalog to add singles, slabs, or build new tournament decks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onNavigateToSearch && (
              <button
                type="button"
                onClick={onNavigateToSearch}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Card Catalog</span>
              </button>
            )}
            {onLoadShowcase && (
              <button
                type="button"
                onClick={onLoadShowcase}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs cursor-pointer border border-[#E2E8F0]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Load Sample Collection</span>
              </button>
            )}
          </div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center glass-slab shadow-sm space-y-3 rounded-2xl border border-[#E2E8F0]">
          <p className="font-mono text-sm text-[#64748B]">
            No card holdings match your active search or filters.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg font-mono text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : viewMode === 'binder' ? (
        /* 3x3 BINDER VIEW WITH SMOOTH PAGING */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xs font-mono text-xs text-[#64748B]">
            <span>
              Binder Page <strong>{binderPage}</strong> of <strong>{totalBinderPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={binderPage === 1}
                onClick={() => setBinderPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#E2E8F0] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#0F172A]" />
              </button>
              <button
                type="button"
                disabled={binderPage === totalBinderPages}
                onClick={() => setBinderPage((p) => Math.min(totalBinderPages, p + 1))}
                className="p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#E2E8F0] disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E2E8F0]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {currentBinderCards.map(({ entry, card, deckName, deckColor, deckId }) => (
                <div key={`${deckId}-${entry.id}`} className="relative group">
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
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="glass-slab shadow-md overflow-hidden">
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
                      <div className="w-8 h-11 border border-[#E2E8F0] rounded overflow-hidden group-hover:scale-105 transition-transform">
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
                        {card.types?.map((t) => t).join(', ') || 'N/A'}
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
                        className="p-1.5 hover:bg-[#FFF0F3] hover:text-[#DC143C] text-[#64748B] rounded transition-colors cursor-pointer"
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
        /* GRID VIEW (WITH GROUPING & CHUNKED SMOOTH SCROLLING) */
        <div className="space-y-8">
          {groupedCollection.map((group) => {
            const displayItems = groupBy === 'none' ? group.items.slice(0, visibleCardCount) : group.items;
            return (
              <div key={group.groupName} className="space-y-4">
                {groupBy !== 'none' && (
                  <div className="flex items-center justify-between px-4 py-2.5 glass-slab shadow-sm">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-[#0F172A]">
                        {group.groupName}
                      </h3>
                      <span className="font-mono text-xs font-bold bg-[#DC143C] text-white px-2 py-0.5 rounded">
                        {group.items.length} Cards
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 p-2.5 sm:p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                  {displayItems.map(({ entry, card, deckName, deckColor, deckId }) => (
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

                {groupBy === 'none' && visibleCardCount < group.items.length && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCardCount((prev) => Math.min(prev + COLLECTION_CHUNK_SIZE, group.items.length))}
                      className="px-6 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono text-xs font-bold rounded-xl shadow-xs hover:border-[#DC143C] flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <ChevronDown className="w-4 h-4 text-[#DC143C]" />
                      <span>Load More Cards ({group.items.length - visibleCardCount} remaining)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
