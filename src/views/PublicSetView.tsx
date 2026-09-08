import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Layers, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { CardSet, PokemonCard } from '../types';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HolographicCard } from '../components/HolographicCard';
import { getExpansionsCatalog, getCardsBySetCatalog } from '../lib/dataSyncEngine';
import { updatePageSeo } from '../utils/seo';

const PAGE_SIZE = 60;

export const PublicSetView: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [set, setSet] = useState<CardSet | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1', 10) || 1;

  const setCurrentPage = (newPage: number | ((p: number) => number)) => {
    const finalPage = typeof newPage === 'function' ? newPage(currentPage) : newPage;
    const params = new URLSearchParams(searchParams);
    params.set('page', finalPage.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    if (!setId) return;
    
    setLoading(true);
    Promise.all([
      getExpansionsCatalog(),
      getCardsBySetCatalog(setId)
    ]).then(([sets, fetchedCards]) => {
      const foundSet = sets.find(s => s.id === setId) || null;
      setSet(foundSet);
      
      const sorted = [...fetchedCards].sort((a, b) => {
        const numA = parseInt(a.number.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.number.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      setCards(sorted);
      setLoading(false);
    });
  }, [setId]);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.number.includes(q) ||
      (c.rarity && c.rarity.toLowerCase().includes(q))
    );
  }, [cards, searchQuery]);

  const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);
  const paginatedCards = filteredCards.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (set && cards.length > 0) {
      updatePageSeo({
        title: `${set.name} (${set.series}) Set Checklist | Page ${currentPage}`,
        description: `Complete ${set.name} (${set.series}) card checklist, live TCGplayer market prices, and collector tracker. Page ${currentPage}.`,
        canonicalPath: `/set/${set.id}`,
        ogImage: set.logoUrl || set.symbolUrl || 'https://deckdivider.app/og-image.png',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${set.name} Card Checklist`,
          description: `Full Pokémon card checklist for ${set.name} (${set.series})`,
          numberOfItems: set.total || cards.length,
          url: `https://deckdivider.app/set/${set.id}`,
        },
      });
    }
  }, [set, cards, currentPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-white">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="mb-6">
            <Link to="/sets" className="inline-flex items-center text-sm text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Expansions
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8]"></div>
            </div>
          ) : !set ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">Expansion Not Found</h2>
              <p className="text-[#94A3B8]">The requested set could not be located in our database.</p>
            </div>
          ) : (
            <>
              {/* Set Header */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {set.logoUrl && (
                  <div className="w-48 h-24 flex-shrink-0 bg-[#0B0F19] rounded-xl border border-[#334155] p-4 flex items-center justify-center">
                    <img src={set.logoUrl} alt={`${set.name} logo`} className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{set.name}</h1>
                    {set.symbolUrl && (
                      <img src={set.symbolUrl} alt="Symbol" className="w-8 h-8 object-contain" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#94A3B8]">
                    <span className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1 rounded-full text-[#E2E8F0]">
                      <Layers className="w-4 h-4" />
                      {set.series} Series
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1 rounded-full text-[#E2E8F0]">
                      <Calendar className="w-4 h-4" />
                      {set.releaseDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1 rounded-full text-[#E2E8F0]">
                      {set.printedTotal} Cards (Total: {set.total})
                    </span>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search cards in this expansion..."
                    className="w-full bg-[#111827] border border-[#334155] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-colors"
                  />
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#334155] bg-[#111827] text-[#94A3B8] disabled:opacity-50 hover:bg-[#1E293B] hover:text-white transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-[#94A3B8]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#334155] bg-[#111827] text-[#94A3B8] disabled:opacity-50 hover:bg-[#1E293B] hover:text-white transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Grid */}
              {paginatedCards.length === 0 ? (
                <div className="text-center py-20 text-[#64748B]">
                  No cards match your search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {paginatedCards.map((card) => (
                    <div key={card.id} className="flex flex-col group">
                      <div className="relative aspect-[63/88] rounded-xl overflow-hidden bg-[#1E293B] border border-[#334155] group-hover:border-[#38BDF8] transition-colors shadow-sm shadow-black/20">
                        <HolographicCard
                          card={card}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-xs text-[#64748B] font-mono mb-1">
                          {card.number} / {set.printedTotal}
                        </div>
                        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1 group-hover:text-[#38BDF8] transition-colors" title={card.name}>
                          {card.name}
                        </h3>
                        {(card.tcgplayer?.price || card.tcgplayer?.trendPrice) ? (
                          <div className="text-xs text-[#10B981] mt-1 font-medium">
                            ${(card.tcgplayer.price || card.tcgplayer.trendPrice || 0).toFixed(2)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#334155] bg-[#111827] text-[#94A3B8] disabled:opacity-50 hover:bg-[#1E293B] hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-[#38BDF8] text-white border border-[#38BDF8]'
                              : 'bg-[#111827] border border-[#334155] text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#334155] bg-[#111827] text-[#94A3B8] disabled:opacity-50 hover:bg-[#1E293B] hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
