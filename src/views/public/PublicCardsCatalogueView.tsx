import React, { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  PokemonCard,
  SearchFilters,
  EnergyType,
  CardRarity,
  CardSet,
} from '../../types';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { PublicCardDetailModal } from '../../components/modals/PublicCardDetailModal';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { initSearchEngine, searchCards, mapToPokemonCard } from '../../lib/searchEngine';
import { getExpansionsCatalog } from '../../lib/dataSyncEngine';
import { queueCardsForProgressivePrewarm } from '../../utils/progressiveImageLoader';

const ALL_ENERGY_TYPES: EnergyType[] = [
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

export const PublicCardsCatalogueView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sets, setSets] = useState<CardSet[]>([]);
  const [engineReady, setEngineReady] = useState(false);
  const [selectedDetailCard, setSelectedDetailCard] = useState<PokemonCard | null>(null);

  // Search input and structured filters decoupled for 0ms typing latency
  const [searchInputText, setSearchInputText] = useState(searchParams.get('q') || '');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    types: [],
    rarities: [],
    category: searchParams.get('cat') || '',
    stage: '',
    regulationMark: '',
    variant: '',
    legality: (searchParams.get('legality') as 'standard' | 'expanded') || undefined,
    illustrator: '',
    setId: searchParams.get('set') || '',
    sortBy: 'name',
  });

  const activeFiltersRef = useRef(activeFilters);
  activeFiltersRef.current = activeFilters;
  const isUserTypingRef = useRef(false);

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK_SIZE);
  const [, startTransition] = useTransition();

  // Load catalog & engine
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      initSearchEngine(),
      getExpansionsCatalog(),
    ]).then(([_, expansions]) => {
      if (isMounted) {
        setSets(expansions);
        setEngineReady(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce search query text update into activeFilters and URL
  useEffect(() => {
    const timer = setTimeout(() => {
      isUserTypingRef.current = false;
      if ((activeFiltersRef.current.query || '') !== searchInputText) {
        const updated = { ...activeFiltersRef.current, query: searchInputText };
        startTransition(() => {
          setActiveFilters(updated);
          setVisibleCount(PAGE_CHUNK_SIZE);
        });

        const params = new URLSearchParams(searchParams);
        if (searchInputText) params.set('q', searchInputText);
        else params.delete('q');
        setSearchParams(params, { replace: true });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchInputText, searchParams, setSearchParams]);

  const updateStructuredFilters = (newF: SearchFilters) => {
    isUserTypingRef.current = false;
    startTransition(() => {
      setActiveFilters(newF);
      setVisibleCount(PAGE_CHUNK_SIZE);
    });

    const params = new URLSearchParams(searchParams);
    if (newF.query) params.set('q', newF.query);
    else params.delete('q');
    if (newF.setId) params.set('set', newF.setId);
    else params.delete('set');
    if (newF.category) params.set('cat', newF.category);
    else params.delete('cat');
    if (newF.legality) params.set('legality', newF.legality);
    else params.delete('legality');
    setSearchParams(params, { replace: true });
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
      setId: '',
      sortBy: 'name',
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
    return count;
  }, [activeFilters]);

  // Run search query strictly without price data
  const filteredCards = useMemo(() => {
    if (!engineReady) return [];
    const rawResults = searchCards(activeFilters);
    const mapped = rawResults.map(mapToPokemonCard);

    return mapped.sort((a, b) => {
      if (activeFilters.sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (activeFilters.sortBy === 'hp') return (b.hp || 0) - (a.hp || 0);
      if (activeFilters.sortBy === 'number') {
        const numA = parseInt(a.number.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.number.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [engineReady, activeFilters]);

  // Visible window
  const displayedCards = useMemo(() => {
    return filteredCards.slice(0, visibleCount);
  }, [filteredCards, visibleCount]);

  // Progressive background prewarm
  useEffect(() => {
    if (displayedCards.length > 0) {
      queueCardsForProgressivePrewarm(displayedCards.slice(0, 40), 'high');
    }
  }, [displayedCards]);

  const loadMoreCards = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK_SIZE, filteredCards.length));
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title="Pokémon TCG Cards Database & Catalogue — Search All Cards"
        description="Comprehensive public catalogue of Pokémon Trading Card Game cards. Search and filter by name, energy type, rarity, set, HP, and attacks with high-resolution visual scans."
        canonicalPath="/cards"
        keywords={[
          'pokemon card catalogue',
          'pokemon tcg search',
          'pokemon card database',
          'pokemon cards list',
          'search pokemon cards by set',
          'pokemon card attacks and abilities',
          'pokemon card attributes',
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Pokémon TCG Public Card Catalogue',
          description: 'Official catalogue of Pokémon Trading Card Game cards with full gameplay attributes.',
          numberOfItems: filteredCards.length,
          url: 'https://deckdivider.app/cards',
        }}
      />

      <LandingNav
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />

      {/* Main Container Strictly Matching in-app app-view-container and global ui */}
      <main className="flex-grow pt-4 sm:pt-6 pb-20">
        <div className="app-view-container space-y-6">
          <GeoBreadcrumbs
            items={[
              { label: 'Card Database', path: '/cards' },
            ]}
          />

          {/* In-app Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-bold text-[#DC143C] uppercase tracking-wider bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex-shrink-0">
                  CARD DATABASE
                </span>
                <span className="text-[#CBD5E1] font-mono text-sm flex-shrink-0">/</span>
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#0F172A] truncate">
                  Pokémon TCG Cards Catalogue
                </h1>
              </div>
              <p className="font-mono text-xs text-[#64748B]">
                Public card search engine across 148+ expansions. Filter by category, stage, rarity, and tournament legalities.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
              <div className="h-9 px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center gap-2 text-xs font-mono font-bold rounded-md shadow-xs">
                <Sparkles className="w-4 h-4 text-[#DC143C]" />
                <span>{filteredCards.length} Cards Indexed</span>
              </div>
            </div>
          </div>

          {/* Main Search Input bar (Exact In-App Glass Slab) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 glass-slab shadow-md">
            <div className="flex-1 flex items-center gap-3 px-2">
              <SearchIcon className="w-5 h-5 text-[#DC143C] flex-shrink-0" />
              <input
                id="global-card-search-input"
                type="text"
                value={searchInputText}
                onChange={(e) => {
                  isUserTypingRef.current = true;
                  setSearchInputText(e.target.value);
                }}
                placeholder="Search Pokémon cards by name, set, or artist..."
                autoComplete="off"
                spellCheck="false"
                aria-label="Search Pokémon cards by name, set, or artist"
                className="w-full bg-transparent font-mono text-sm text-[#0F172A] focus:outline-none placeholder:text-[#64748B] select-text cursor-text relative z-10"
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
                  ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-2xs'
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

          {/* Expandable Inline Filter Panel (Exact In-App Glass Slab) */}
          {isFilterPanelOpen && (
            <div className="p-6 glass-slab space-y-6 shadow-md animate-fadeIn">
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
                  <label className="block font-mono text-xs font-bold text-[#0F172A]">Expansion / Set</label>
                  <select
                    value={activeFilters.setId || ''}
                    onChange={(e) => updateStructuredFilters({ ...activeFilters, setId: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none truncate"
                  >
                    <option value="">All Official Expansions</option>
                    {sets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.printedTotal || s.total} Cards)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Printing Variant & Format Legality */}
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
                    <option value="J">Regulation J</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold text-[#0F172A]">Illustrator / Artist</label>
                  <input
                    type="text"
                    placeholder="Filter by Artist (e.g. Ken Sugimori)"
                    value={activeFilters.illustrator || ''}
                    onChange={(e) => updateStructuredFilters({ ...activeFilters, illustrator: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block font-mono text-xs font-bold text-[#0F172A]">Sort Cards By</label>
                  <select
                    value={activeFilters.sortBy || 'name'}
                    onChange={(e) => updateStructuredFilters({ ...activeFilters, sortBy: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-md focus:border-[#DC143C] focus:outline-none"
                  >
                    <option value="name">Name (A → Z)</option>
                    <option value="name-desc">Name (Z → A)</option>
                    <option value="hp">Hit Points (Highest First)</option>
                    <option value="number">Card Local Number</option>
                  </select>
                </div>

                {/* Energy Types Filter */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-2 border-t border-[#E2E8F0] pt-4">
                  <label className="block font-mono text-xs font-bold text-[#0F172A]">Energy Types</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ENERGY_TYPES.map((type) => {
                      const isSelected = (activeFilters.types || []).includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleToggleType(type)}
                          className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all rounded-lg flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                              : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A]'
                          }`}
                        >
                          <span>{type}</span>
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
            {/* Results Header Bar (Exact In-App Styling) */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs font-mono text-xs text-[#666666]">
              <span className="font-bold text-[#0F172A]">
                Showing {Math.min(displayedCards.length, filteredCards.length)} of {filteredCards.length} matching cards
              </span>
              <span className="hidden sm:inline">Click any card to inspect full gameplay attributes</span>
            </div>

            {/* Results Card Grid (Exact In-App Styling with radial gradient background) */}
            {!engineReady ? (
              <div className="p-16 text-center glass-slab shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E2E8F0] border-t-[#DC143C] mx-auto mb-3"></div>
                <p className="font-mono text-xs text-[#64748B]">Indexing card database catalog...</p>
              </div>
            ) : displayedCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 p-2.5 sm:p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                {displayedCards.map((card) => (
                  <HolographicCard
                    key={card.id}
                    card={card}
                    showPrice={false}
                    onClick={() => setSelectedDetailCard(card)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center glass-slab shadow-sm">
                <p className="font-mono text-sm text-[#64748B]">No Pokémon cards match your current search filters.</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-3 px-4 py-2 bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Load More Button for smooth paging */}
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
      </main>

      {/* Public Details Popup Modal (Strictly No Prices, No Grades, No Actions) */}
      <PublicCardDetailModal
        card={selectedDetailCard}
        onClose={() => setSelectedDetailCard(null)}
      />

      {/* Universal Page Web Cross-Linking */}
      <PublicInterlinkMesh currentPath="/cards" />

      <LandingFooter />
    </div>
  );
};
