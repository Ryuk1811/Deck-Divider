import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronDown,
  Boxes,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { CardSet, PokemonCard } from '../../types';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { PublicCardDetailModal } from '../../components/modals/PublicCardDetailModal';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import {
  getCardsBySetCatalog,
  getExpansionsCatalog,
  forceRefreshExpansions,
} from '../../lib/dataSyncEngine';
import {
  getDynamicSeriesCategories,
  normalizeSet,
  sortSetsChronologically,
  formatSetReleaseDate,
} from '../../utils/setCategorizer';
import { queueCardsForProgressivePrewarm } from '../../utils/progressiveImageLoader';

const SET_PAGE_SIZE = 40;

export const PublicExpansionsAndSetsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allExpansions, setAllExpansions] = useState<CardSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(searchParams.get('set') || null);
  const [loadedCardsMap, setLoadedCardsMap] = useState<Record<string, PokemonCard[]>>({});
  const [setCards, setSetCards] = useState<PokemonCard[]>([]);
  const [isLoadingSetCards, setIsLoadingSetCards] = useState(false);
  const [isRefreshingCatalog, setIsRefreshingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardSearchQuery, setCardSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(SET_PAGE_SIZE);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('All');
  const [selectedDetailCard, setSelectedDetailCard] = useState<PokemonCard | null>(null);

  // Fetch all expansions on mount
  useEffect(() => {
    getExpansionsCatalog()
      .then((expansions) => {
        const formatted: CardSet[] = sortSetsChronologically(expansions.map(normalizeSet));
        setAllExpansions(formatted);
        if (formatted.length > 0) {
          const querySet = searchParams.get('set');
          const initialSet = formatted.find((s) => s.id === querySet) || formatted[0];
          setSelectedSetId(initialSet.id);
        }
      })
      .catch((err) => {
        console.warn('PublicExpansionsAndSetsView getExpansionsCatalog warning:', err);
      });
  }, [searchParams]);

  const handleManualRefresh = async () => {
    setIsRefreshingCatalog(true);
    try {
      const refreshed = await forceRefreshExpansions();
      if (refreshed && refreshed.length > 0) {
        const formatted = sortSetsChronologically(refreshed.map(normalizeSet));
        setAllExpansions(formatted);
      }
    } catch (e) {
      console.error('Failed to manually refresh expansions:', e);
    } finally {
      setIsRefreshingCatalog(false);
    }
  };

  const activeSet = allExpansions.find((s) => s.id === selectedSetId) || allExpansions[0];

  // Fetch cards for selected expansion
  useEffect(() => {
    if (!activeSet?.id) return;
    const setId = activeSet.id;
    setVisibleCount(SET_PAGE_SIZE);
    setCardSearchQuery('');

    if (loadedCardsMap[setId]) {
      setSetCards(loadedCardsMap[setId]);
      return;
    }

    setIsLoadingSetCards(true);
    getCardsBySetCatalog(setId)
      .then((fetchedCards) => {
        const sorted = [...fetchedCards].sort((a, b) => {
          const numA = parseInt(a.number.replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(b.number.replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        });
        setLoadedCardsMap((prev) => ({ ...prev, [setId]: sorted }));
        setSetCards(sorted);
      })
      .catch((err) => {
        console.error(`Error loading cards for set ${setId}:`, err);
      })
      .finally(() => {
        setIsLoadingSetCards(false);
      });
  }, [activeSet?.id, loadedCardsMap]);

  // Filter cards within active set
  const filteredSetCards = useMemo(() => {
    if (!cardSearchQuery.trim()) return setCards;
    const q = cardSearchQuery.toLowerCase();
    return setCards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.number.includes(q) ||
        (c.rarity && c.rarity.toLowerCase().includes(q))
    );
  }, [setCards, cardSearchQuery]);

  const displayedSetCards = useMemo(() => {
    return filteredSetCards.slice(0, visibleCount);
  }, [filteredSetCards, visibleCount]);

  // Progressive background prewarm
  useEffect(() => {
    if (displayedSetCards.length > 0) {
      queueCardsForProgressivePrewarm(displayedSetCards.slice(0, 40), 'high');
    }
  }, [displayedSetCards]);

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

  const handleSelectSet = (setId: string) => {
    setSelectedSetId(setId);
    const params = new URLSearchParams(searchParams);
    params.set('set', setId);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title="Pokémon TCG Expansions & Sets Directory — Complete Master Checklists"
        description="Comprehensive directory of official Pokémon Trading Card Game expansions and sets. Browse all series eras from Scarlet & Violet to Vintage, filter expansions, and view card checklists."
        canonicalPath="/expansions"
        keywords={[
          'pokemon tcg expansions',
          'pokemon card sets',
          'pokemon expansions directory',
          'pokemon sets checklist',
          'scarlet and violet booster boxes',
          'sword and shield card list',
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Pokémon TCG Expansions & Sets Library',
          description: 'Official library and checklists of Pokémon Trading Card Game expansions.',
          url: 'https://deckdivider.app/expansions',
        }}
      />

      <LandingNav
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />

      {/* Main Container Strictly Matching in-app app-view-container */}
      <main className="flex-grow pt-4 sm:pt-6 pb-20">
        <div className="app-view-container space-y-8">
          <GeoBreadcrumbs
            items={[
              { label: 'Expansions & Sets', path: '/expansions' },
            ]}
          />

          {/* EXPANSIONS HEADER & SEARCH BAR (Strict In-App SetsView Styling) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-mono text-[11px] font-bold text-[#DC143C] uppercase tracking-wider bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex-shrink-0">
                  EXPANSIONS & SETS
                </span>
                <span className="text-[#CBD5E1] font-mono text-sm flex-shrink-0">/</span>
                <h1 className="font-heading font-bold text-2xl text-[#0F172A] truncate">
                  Complete TCG Expansion Library
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Sync Live
                </span>
              </div>
              <p className="font-mono text-xs text-[#64748B]">
                Explore {allExpansions.length} official Pokémon TCG expansion sets from 1999 to 30th Celebrations & beyond.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-grow md:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#DC143C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search expansion sets (e.g. 151, Paldea)..."
                  className="w-full pl-9 pr-4 py-2.5 glass-slab font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] transition-all shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshingCatalog}
                title="Check for newly released sets and cards"
                className="p-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#DC143C] text-[#475569] hover:text-[#DC143C] rounded-lg transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshingCatalog ? 'animate-spin text-[#DC143C]' : ''}`} />
              </button>

              <Link
                to="/cards"
                className="px-3.5 py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#DC143C] text-[#0F172A] rounded-lg font-mono text-xs font-bold transition-all shadow-xs hidden sm:flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>All Cards</span>
              </Link>
            </div>
          </div>

          {/* SERIES FILTER PILLS (Exact In-App Series Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {getDynamicSeriesCategories(allExpansions).map((cat) => {
              const isActive = selectedSeriesFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedSeriesFilter(cat)}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* SETS SELECTOR GRID (Strict In-App Scroller Bounding Box) */}
          <div className="scroller-bounding-box h-[360px]">
            <div className="scroller-bounding-box-inner p-3 custom-scrollbar h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredExpansions.map((s) => {
                  const isSelected = s.id === activeSet?.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSet(s.id)}
                      className={`p-4 space-y-2.5 cursor-pointer transition-all glass-slab ${
                        isSelected
                          ? 'border-[#DC143C] bg-[#FFF0F3]/40 shadow-sm ring-1 ring-[#DC143C]'
                          : 'hover:border-[#CBD5E1] shadow-xs hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {s.logoUrl && (
                            <img
                              src={s.logoUrl}
                              alt={s.name}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 object-contain flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <h3 className="font-heading font-bold text-sm text-[#0F172A] line-clamp-1">
                              {s.name}
                            </h3>
                            <p className="font-mono text-[11px] text-[#64748B] truncate">
                              {s.series} {s.releaseDate ? `• ${formatSetReleaseDate(s.releaseDate)}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-mono text-[10px] font-bold flex-shrink-0">
                          {s.total || s.printedTotal} Cards
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACTIVE EXPANSION CHECKLIST SECTION (Combined View under selected set) */}
          {activeSet && (
            <div className="space-y-6 pt-2">
              {/* Active Expansion Banner */}
              <div className="p-5 sm:p-6 glass-slab flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {activeSet.logoUrl && (
                    <div className="w-24 h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={activeSet.logoUrl}
                        alt={activeSet.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#0F172A] truncate">
                        {activeSet.name}
                      </h2>
                      {activeSet.symbolUrl && (
                        <img
                          src={activeSet.symbolUrl}
                          alt=""
                          className="w-5 h-5 object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B]">
                      <span>{activeSet.series} Era</span>
                      <span>•</span>
                      <span>{formatSetReleaseDate(activeSet.releaseDate)}</span>
                      <span>•</span>
                      <span className="text-[#0F172A] font-bold">{activeSet.printedTotal || activeSet.total} Cards Checklist</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
                  <div className="relative flex-grow md:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={cardSearchQuery}
                      onChange={(e) => setCardSearchQuery(e.target.value)}
                      placeholder={`Filter in ${activeSet.name}...`}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>
                  <Link
                    to={`/set/${activeSet.id}/top-cards`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] font-mono text-xs font-bold rounded-lg hover:bg-[#DC143C] hover:text-white transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Top Chase</span>
                  </Link>
                  <Link
                    to={`/set/${activeSet.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs font-bold rounded-lg hover:border-[#DC143C] transition-colors cursor-pointer"
                  >
                    <span>Full Page</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                  </Link>
                </div>
              </div>

              {/* Set Cards Grid */}
              {isLoadingSetCards ? (
                <div className="p-16 text-center glass-slab shadow-sm">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E2E8F0] border-t-[#DC143C] mx-auto mb-3"></div>
                  <p className="font-mono text-xs text-[#64748B]">Loading {activeSet.name} card checklist...</p>
                </div>
              ) : displayedSetCards.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 p-2.5 sm:p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                    {displayedSetCards.map((card) => (
                      <HolographicCard
                        key={card.id}
                        card={card}
                        showPrice={false}
                        onClick={() => setSelectedDetailCard(card)}
                      />
                    ))}
                  </div>

                  {displayedSetCards.length < filteredSetCards.length && (
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + SET_PAGE_SIZE)}
                        className="px-6 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono text-xs font-bold rounded-xl shadow-xs hover:border-[#DC143C] flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <ChevronDown className="w-4 h-4 text-[#DC143C]" />
                        <span>Load More Cards ({filteredSetCards.length - displayedSetCards.length} remaining)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center glass-slab shadow-sm">
                  <p className="font-mono text-sm text-[#64748B]">No cards in {activeSet.name} match your search filter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Public Detail Modal (Attributes Only, Strictly No Prices/Grades) */}
      <PublicCardDetailModal
        card={selectedDetailCard}
        onClose={() => setSelectedDetailCard(null)}
      />

      {/* Universal Page Web Cross-Linking */}
      <PublicInterlinkMesh currentPath="/expansions" />

      <LandingFooter />
    </div>
  );
};
