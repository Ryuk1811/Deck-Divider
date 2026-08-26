import React, { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import {
  Search as SearchIcon,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import {
  PokemonCard,
  SearchFilters,
  EnergyType,
  CardRarity,
  CardSet,
  DisplayCurrency,
} from '../types';
import { HolographicCard } from '../components/HolographicCard';
import { searchCards, mapToPokemonCard } from '../lib/searchEngine';
import { queueCardsForProgressivePrewarm } from '../utils/progressiveImageLoader';

interface SearchViewProps {
  sets: CardSet[];
  currency: DisplayCurrency;
  savedFilters: SearchFilters;
  onUpdateFilters: (filters: SearchFilters) => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
}

const ALL_ENERGY_TYPES: EnergyType[] = [
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

const ALL_RARITIES: CardRarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Ultra Rare',
  'Secret Rare',
  'Illustration Rare',
  'Special Illustration Rare',
];

const PAGE_CHUNK_SIZE = 40;

export const SearchView: React.FC<SearchViewProps> = ({
  sets,
  currency,
  savedFilters,
  onUpdateFilters,
  onSelectCard,
  onQuickLookCard,
}) => {
  // Input query state is kept decoupled from heavy filtering to guarantee 0ms typing latency
  const [searchInputText, setSearchInputText] = useState(savedFilters.query || '');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>(savedFilters);
  const activeFiltersRef = useRef(activeFilters);
  activeFiltersRef.current = activeFilters;
  const lastSyncedQueryRef = useRef(savedFilters.query || '');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK_SIZE);
  const [, startTransition] = useTransition();

  // Sync when savedFilters.query changes externally (e.g. navigation or reset)
  useEffect(() => {
    if (savedFilters.query !== undefined && savedFilters.query !== lastSyncedQueryRef.current) {
      lastSyncedQueryRef.current = savedFilters.query;
      setSearchInputText(savedFilters.query);
      setActiveFilters(savedFilters);
    }
  }, [savedFilters.query]);

  // Debounce search query text update into activeFilters and parent state
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((activeFiltersRef.current.query || '') !== searchInputText) {
        const updated = { ...activeFiltersRef.current, query: searchInputText };
        lastSyncedQueryRef.current = searchInputText;
        startTransition(() => {
          setActiveFilters(updated);
          setVisibleCount(PAGE_CHUNK_SIZE);
        });
        onUpdateFilters(updated);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchInputText, onUpdateFilters]);

  // Synchronize non-query filter mutations smoothly
  const updateStructuredFilters = (newF: SearchFilters) => {
    lastSyncedQueryRef.current = newF.query || '';
    startTransition(() => {
      setActiveFilters(newF);
      setVisibleCount(PAGE_CHUNK_SIZE);
    });
    onUpdateFilters(newF);
  };

  const handleToggleType = (type: EnergyType) => {
    const exists = (activeFilters.types || []).includes(type);
    const updated = exists
      ? (activeFilters.types || []).filter((t) => t !== type)
      : [...(activeFilters.types || []), type];
    updateStructuredFilters({ ...activeFilters, types: updated });
  };

  const handleToggleRarity = (rarity: CardRarity) => {
    const exists = (activeFilters.rarities || []).includes(rarity);
    const updated = exists
      ? (activeFilters.rarities || []).filter((r) => r !== rarity)
      : [...(activeFilters.rarities || []), rarity];
    updateStructuredFilters({ ...activeFilters, rarities: updated });
  };

  const handleReset = () => {
    setSearchInputText('');
    const resetF: SearchFilters = {
      query: '',
      types: [],
      rarities: [],
      category: '',
      stage: '',
      regulationMark: '',
      variant: '',
      legality: undefined,
      illustrator: '',
      sortBy: 'price-desc',
    };
    updateStructuredFilters(resetF);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.stage) count++;
    if (activeFilters.variant) count++;
    if (activeFilters.legality) count++;
    if (activeFilters.regulationMark) count++;
    if (activeFilters.artist || activeFilters.illustrator) count++;
    if (activeFilters.types && activeFilters.types.length > 0) count += activeFilters.types.length;
    if (activeFilters.rarities && activeFilters.rarities.length > 0) count += activeFilters.rarities.length;
    if (activeFilters.setId) count++;
    if (activeFilters.hpMin !== undefined || activeFilters.hpMax !== undefined) count++;
    if (activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined) count++;
    return count;
  }, [activeFilters]);

  // Run the search query
  const filteredCards = useMemo(() => {
    const rawResults = searchCards(activeFilters);
    const mapped = rawResults.map(mapToPokemonCard);

    return mapped.sort((a, b) => {
      if (activeFilters.sortBy === 'price-desc') return b.prices.raw - a.prices.raw;
      if (activeFilters.sortBy === 'price-asc') return a.prices.raw - b.prices.raw;
      if (activeFilters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (activeFilters.sortBy === 'hp') return (b.hp || 0) - (a.hp || 0);
      return 0;
    });
  }, [activeFilters]);

  // Paginated window for optimal frame-rate
  const displayedCards = useMemo(() => {
    return filteredCards.slice(0, visibleCount);
  }, [filteredCards, visibleCount]);

  // Progressive background prewarm of currently visible cards
  useEffect(() => {
    if (displayedCards.length > 0) {
      queueCardsForProgressivePrewarm(displayedCards.slice(0, 40), 'high');
    }
  }, [displayedCards]);

  const loadMoreCards = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK_SIZE, filteredCards.length));
  };

  return (
    <div className="app-view-container space-y-6">
      {/* Main Search Input bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 glass-slab shadow-md">
        <div className="flex-1 flex items-center gap-3 px-2">
          <SearchIcon className="w-5 h-5 text-[#DC143C] flex-shrink-0" />
          <input
            type="text"
            value={searchInputText}
            onChange={(e) => setSearchInputText(e.target.value)}
            placeholder="Search Pokémon cards by name, set, or artist..."
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent font-mono text-sm text-[#0F172A] focus:outline-none placeholder:text-[#64748B]"
          />
          {searchInputText && (
            <button
              type="button"
              onClick={() => {
                setSearchInputText('');
                updateStructuredFilters({ ...activeFilters, query: '' });
              }}
              className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className={`h-10 px-4 flex items-center justify-center gap-2 text-xs font-mono font-bold rounded-md border transition-all cursor-pointer select-none ${
            isFilterPanelOpen || activeFilterCount > 0
              ? 'bg-[#0F172A] text-white border-[#0F172A]'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#DC143C]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#DC143C]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#DC143C] text-white rounded-full text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Inline Filter Panel */}
      {isFilterPanelOpen && (
        <div className="p-6 glass-slab space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#DC143C]" />
              <span className="font-heading font-bold text-base text-[#0F172A]">Refine Search Metrics</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category & Stage */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Card Category</label>
              <select
                value={activeFilters.category || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, category: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Categories (Pokémon, Trainer, Energy)</option>
                <option value="Pokemon">Pokémon</option>
                <option value="Trainer">Trainer</option>
                <option value="Energy">Energy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Stage / Form</label>
              <select
                value={activeFilters.stage || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, stage: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Stages</option>
                <option value="Basic">Basic</option>
                <option value="Stage 1">Stage 1</option>
                <option value="Stage 2">Stage 2</option>
                <option value="VMAX">VMAX</option>
                <option value="VSTAR">VSTAR</option>
                <option value="EX">EX / ex</option>
                <option value="MEGA">MEGA</option>
                <option value="Restored">Restored</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Card Printing Variant</label>
              <select
                value={activeFilters.variant || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, variant: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Printings</option>
                <option value="normal">Normal / Standard</option>
                <option value="holo">Holographic (Holo)</option>
                <option value="reverse">Reverse Holo</option>
                <option value="firstEdition">1st Edition</option>
                <option value="wPrerelease">Prerelease Promo</option>
                <option value="secret100">Secret / Ultra</option>
              </select>
            </div>

            {/* Format Legality & Regulation Mark & Illustrator */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Format Legality</label>
              <select
                value={activeFilters.legality || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, legality: (e.target.value as any) || undefined })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Formats</option>
                <option value="standard">Standard Format Legal</option>
                <option value="expanded">Expanded Format Legal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Regulation Mark</label>
              <select
                value={activeFilters.regulationMark || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, regulationMark: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Regulation Marks</option>
                <option value="D">Regulation D</option>
                <option value="E">Regulation E</option>
                <option value="F">Regulation F</option>
                <option value="G">Regulation G</option>
                <option value="H">Regulation H</option>
                <option value="I">Regulation I</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Illustrator / Artist</label>
              <input
                type="text"
                placeholder="Filter by Artist (e.g. Ken Sugimori)"
                value={activeFilters.artist || activeFilters.illustrator || ''}
                onChange={(e) => updateStructuredFilters({ ...activeFilters, artist: e.target.value, illustrator: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              />
            </div>

            {/* Set & Sort */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Expansion Set</label>
              <select
                value={activeFilters.setId || ''}
                onChange={(e) =>
                  updateStructuredFilters({ ...activeFilters, setId: e.target.value || undefined })
                }
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="">All Pokemon Sets</option>
                {sets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.series})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Sort Ordering</label>
              <select
                value={activeFilters.sortBy}
                onChange={(e) =>
                  updateStructuredFilters({ ...activeFilters, sortBy: e.target.value as any })
                }
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-bold text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              >
                <option value="price-desc">Highest Price First</option>
                <option value="price-asc">Lowest Price First</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="hp">Highest HP First</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Price Range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={activeFilters.priceMin ?? ''}
                  onChange={(e) =>
                    updateStructuredFilters({ ...activeFilters, priceMin: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                />
                <span className="text-[#64748B]">-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={activeFilters.priceMax ?? ''}
                  onChange={(e) =>
                    updateStructuredFilters({ ...activeFilters, priceMax: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                />
              </div>
            </div>

            {/* Energy Types Multi-Select */}
            <div className="sm:col-span-2 lg:col-span-3 space-y-2 border-t border-[#E2E8F0] pt-4">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Energy Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {ALL_ENERGY_TYPES.map((type) => {
                  const isSelected = (activeFilters.types || []).includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleType(type)}
                      className={`h-9 px-3 w-full text-xs font-mono font-bold border transition-all rounded-lg flex items-center justify-center text-center truncate cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A]'
                      }`}
                    >
                      <span className="truncate">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rarities Filter */}
            <div className="sm:col-span-2 lg:col-span-3 space-y-2 border-t border-[#E2E8F0] pt-4">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Rarity Tiers</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {ALL_RARITIES.map((rarity) => {
                  const isSelected = (activeFilters.rarities || []).includes(rarity);
                  return (
                    <button
                      key={rarity}
                      type="button"
                      onClick={() => handleToggleRarity(rarity)}
                      className={`h-9 px-3 w-full text-xs font-mono font-bold border transition-all rounded-lg flex items-center justify-center text-center truncate cursor-pointer ${
                        isSelected
                          ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A]'
                      }`}
                    >
                      <span className="truncate">{rarity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {/* Results Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs font-mono text-xs text-[#666666]">
          <span className="font-bold text-[#0F172A]">
            Showing {Math.min(displayedCards.length, filteredCards.length)} of {filteredCards.length} matching cards
          </span>
          <span className="hidden sm:inline">Press Space on any card for Quick Look</span>
        </div>

        {/* Results Card Grid */}
        {displayedCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
            {displayedCards.map((card) => (
              <HolographicCard
                key={card.id}
                card={card}
                currency={currency}
                onClick={() => onSelectCard(card)}
                onQuickLook={() => onQuickLookCard(card)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-slab shadow-sm">
            <p className="font-mono text-sm text-[#64748B]">No Pokémon cards match your current search filters.</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 px-4 py-2 bg-[#0F172A] text-white rounded-lg font-mono text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button for buttery smooth scrolling */}
        {displayedCards.length < filteredCards.length && (
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={loadMoreCards}
              className="px-6 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono text-xs font-bold rounded-xl shadow-xs hover:border-[#DC143C] flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <ChevronDown className="w-4 h-4 text-[#DC143C]" />
              <span>Load More Cards ({filteredCards.length - displayedCards.length} remaining)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
