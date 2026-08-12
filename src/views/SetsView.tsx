import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { CardSet, PokemonCard, Deck, DisplayCurrency } from '../types';
import { HolographicCard } from '../components/HolographicCard';
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

  // Fetch all expansions on mount
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

  // Fetch cards for selected set without loops
  useEffect(() => {
    if (!activeSet?.id) return;
    const setId = activeSet.id;

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

  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('All');

  // Filter expansions by series filter & search query
  const filteredExpansions = allExpansions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedSeriesFilter === 'All') return true;
    return s.series.toLowerCase() === selectedSeriesFilter.toLowerCase();
  });

  // Calculate set completion percentage based on owned cards in user's decks
  const ownedCardIds = new Set<string>();
  decks.forEach((deck) => {
    deck.entries.forEach((e) => {
      if (!e.isSold) ownedCardIds.add(e.cardId);
    });
  });

  const ownedInSet = setCards.filter((c) => ownedCardIds.has(c.id)).length;
  const setCompletionPercent =
    setCards.length > 0 ? Math.round((ownedInSet / setCards.length) * 100) : 0;

  return (
    <div className="app-view-container space-y-8 animate-fade-in">
      {/* EXPANSIONS HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#0F172A]">
            Complete TCG Expansion Library
          </h2>
          <p className="font-mono text-xs text-[#64748B]">
            Explore all {allExpansions.length} official Pokémon TCG expansion sets from 1999 to Present.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#DC143C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expansion sets..."
            className="w-full pl-9 pr-4 py-2.5 glass-slab font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] transition-all shadow-xs"
          />
        </div>
      </div>

      {/* SERIES FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {getDynamicSeriesCategories(allExpansions).map((cat) => {
          const isActive = selectedSeriesFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSeriesFilter(cat)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold whitespace-nowrap transition-all border ${
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
      {/* SETS LIST GRID */}
      <div className="scroller-bounding-box h-[440px]">
        <div className="scroller-bounding-box-inner p-3 custom-scrollbar h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpansions.map((s) => {
              const isSelected = s.id === activeSet?.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSetId(s.id)}
                  className={`p-4 space-y-2.5 cursor-pointer transition-all glass-slab ${
                    isSelected
                      ? 'border-[#DC143C] bg-[#FFF0F3]/40 shadow-sm ring-1 ring-[#DC143C]'
                      : 'hover:border-[#CBD5E1] shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {s.logoUrl && (
                        <img
                          src={s.logoUrl}
                          alt={s.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h3 className="font-heading font-bold text-sm text-[#0F172A] line-clamp-1">
                          {s.name}
                        </h3>
                        <p className="font-mono text-[11px] text-[#64748B]">
                          {s.series} {s.releaseDate ? `• ${s.releaseDate}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-mono text-[10px] font-bold">
                      {s.total || s.printedTotal} Cards
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B] pt-1 border-t border-[#F1F5F9]">
                    <span>Set Code: <strong className="text-[#0F172A]">{s.id.toUpperCase()}</strong></span>
                    <span className="font-semibold text-[#DC143C]">Explore Set →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED SET DETAIL CONTENT */}
      {activeSet && (
        <div className="space-y-4">
          {/* Set Detail Header Strip */}
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {activeSet.logoUrl && (
                <img
                  src={activeSet.logoUrl}
                  alt={activeSet.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <span className="font-mono text-xs text-[#64748B]">{activeSet.series} Series</span>
                <h2 className="font-heading font-bold text-2xl text-[#0F172A]">
                  {activeSet.name} Full Set Catalog
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-md bg-[#FFF0F3] border border-[#DC143C] text-[#DC143C] font-bold">
                Completion: {setCompletionPercent}% ({ownedInSet}/{setCards.length || activeSet.total})
              </span>
            </div>
          </div>

          {isLoadingSetCards ? (
            <div className="py-16 text-center glass-slab shadow-xs space-y-3">
              <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin mx-auto" />
              <p className="font-mono text-xs text-[#64748B]">
                Fetching card details for {activeSet.name} from TCG catalog...
              </p>
            </div>
          ) : setCards.length === 0 ? (
            <div className="py-12 text-center glass-slab shadow-xs text-[#64748B] font-mono text-xs">
              No card records found for set {activeSet.name}.
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
              {setCards.map((card) => {
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
                          Unowned
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
