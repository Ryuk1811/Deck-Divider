import React, { useState, useEffect, useMemo } from 'react';
import {
  Search as SearchIcon,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
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
import { DropdownMenu } from '../components/DropdownMenu';
import { searchCards, mapToPokemonCard } from '../lib/searchEngine';

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

export const SearchView: React.FC<SearchViewProps> = ({
  sets,
  currency,
  savedFilters,
  onUpdateFilters,
  onSelectCard,
  onQuickLookCard,
}) => {
  const [filters, setFilters] = useState<SearchFilters>(savedFilters);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sync state changes upward so search state survives navigation
  const updateLocalFilters = (newF: SearchFilters) => {
    setFilters(newF);
    onUpdateFilters(newF);
  };

  const handleToggleType = (type: EnergyType) => {
    const exists = (filters.types || []).includes(type);
    const updated = exists
      ? (filters.types || []).filter((t) => t !== type)
      : [...(filters.types || []), type];
    updateLocalFilters({ ...filters, types: updated });
  };

  const handleToggleRarity = (rarity: CardRarity) => {
    const exists = (filters.rarities || []).includes(rarity);
    const updated = exists
      ? (filters.rarities || []).filter((r) => r !== rarity)
      : [...(filters.rarities || []), rarity];
    updateLocalFilters({ ...filters, rarities: updated });
  };

  const handleReset = () => {
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
    updateLocalFilters(resetF);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.stage) count++;
    if (filters.variant) count++;
    if (filters.legality) count++;
    if (filters.regulationMark) count++;
    if (filters.artist || filters.illustrator) count++;
    if (filters.types.length > 0) count += filters.types.length;
    if (filters.rarities.length > 0) count += filters.rarities.length;
    if (filters.setId) count++;
    if (filters.hpMin !== undefined || filters.hpMax !== undefined) count++;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    return count;
  }, [filters]);

  // Run the actual local search engine query!
  const filteredCards = useMemo(() => {
    const rawResults = searchCards(filters);
    const mapped = rawResults.map(mapToPokemonCard);

    return mapped.sort((a, b) => {
      if (filters.sortBy === 'price-desc') return b.prices.raw - a.prices.raw;
      if (filters.sortBy === 'price-asc') return a.prices.raw - b.prices.raw;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'hp') return (b.hp || 0) - (a.hp || 0);
      return 0;
    });
  }, [filters]);

  return (
    <div className="app-view-container space-y-6 animate-fade-in">
      {/* Main Search Input bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 glass-slab shadow-md">
        <div className="flex-1 flex items-center gap-3 px-2">
          <SearchIcon className="w-5 h-5 text-[#DC143C] flex-shrink-0" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateLocalFilters({ ...filters, query: e.target.value })}
            placeholder="Search Pokemon cards by name, set, or artist..."
            className="w-full bg-transparent font-mono text-sm text-[#0F172A] focus:outline-none placeholder:text-[#64748B]"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => updateLocalFilters({ ...filters, query: '' })}
              className="p-1 text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className={`h-10 px-4 flex items-center justify-center gap-2 text-xs font-mono font-bold rounded-md border transition-all cursor-pointer ${
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
        <div className="p-6 glass-slab space-y-6 animate-fade-in shadow-md">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#DC143C]" />
              <span className="font-heading font-bold text-base text-[#0F172A]">Refine Search Metrics</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1.5"
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
                value={filters.category || ''}
                onChange={(e) => updateLocalFilters({ ...filters, category: e.target.value })}
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
                value={filters.stage || ''}
                onChange={(e) => updateLocalFilters({ ...filters, stage: e.target.value })}
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
                value={filters.variant || ''}
                onChange={(e) => updateLocalFilters({ ...filters, variant: e.target.value })}
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
                value={filters.legality || ''}
                onChange={(e) => updateLocalFilters({ ...filters, legality: (e.target.value as any) || undefined })}
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
                value={filters.regulationMark || ''}
                onChange={(e) => updateLocalFilters({ ...filters, regulationMark: e.target.value })}
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
                value={filters.artist || filters.illustrator || ''}
                onChange={(e) => updateLocalFilters({ ...filters, artist: e.target.value, illustrator: e.target.value })}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
              />
            </div>

            {/* Set & Sort */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold text-[#0F172A]">Expansion Set</label>
              <select
                value={filters.setId || ''}
                onChange={(e) =>
                  updateLocalFilters({ ...filters, setId: e.target.value || undefined })
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
                value={filters.sortBy}
                onChange={(e) =>
                  updateLocalFilters({ ...filters, sortBy: e.target.value as any })
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
                  value={filters.priceMin ?? ''}
                  onChange={(e) =>
                    updateLocalFilters({ ...filters, priceMin: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                />
                <span className="text-[#64748B]">-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceMax ?? ''}
                  onChange={(e) =>
                    updateLocalFilters({ ...filters, priceMax: e.target.value ? Number(e.target.value) : undefined })
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
                  const isSelected = filters.types.includes(type);
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
                  const isSelected = filters.rarities.includes(rarity);
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

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
        <span>Showing {filteredCards.length} matching card records</span>
        <span>Press Space on any card for Quick Look</span>
      </div>

      {/* Results Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <HolographicCard
            key={card.id}
            card={card}
            currency={currency}
            onClick={() => onSelectCard(card)}
            onQuickLook={() => onQuickLookCard(card)}
          />
        ))}
      </div>
    </div>
  );
};
