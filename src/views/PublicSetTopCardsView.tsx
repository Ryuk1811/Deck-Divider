import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Layers, Sparkles } from 'lucide-react';
import { CardSet, PokemonCard } from '../types';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HolographicCard } from '../components/HolographicCard';
import { getExpansionsCatalog, getCardsBySetCatalog } from '../lib/dataSyncEngine';
import { updatePageSeo } from '../utils/seo';

export const PublicSetTopCardsView: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  
  const [set, setSet] = useState<CardSet | null>(null);
  const [topCards, setTopCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!setId) return;
    
    setLoading(true);
    Promise.all([
      getExpansionsCatalog(),
      getCardsBySetCatalog(setId)
    ]).then(([sets, fetchedCards]) => {
      const foundSet = sets.find(s => s.id === setId) || null;
      setSet(foundSet);
      
      // Sort by market price descending
      const sorted = [...fetchedCards]
        .filter(c => {
          const price = c.tcgplayer?.price || c.tcgplayer?.trendPrice || 0;
          return price > 0;
        })
        .sort((a, b) => {
          const priceA = a.tcgplayer?.price || a.tcgplayer?.trendPrice || 0;
          const priceB = b.tcgplayer?.price || b.tcgplayer?.trendPrice || 0;
          return priceB - priceA;
        })
        .slice(0, 20); // Top 20 cards
        
      setTopCards(sorted);
      setLoading(false);
    });
  }, [setId]);

  useEffect(() => {
    if (set && topCards.length > 0) {
      updatePageSeo({
        title: `Top 20 Most Expensive Cards in ${set.name} (${set.series}) | DECK / divider`,
        description: `Discover the top chase cards and highest-value pulls from ${set.name} (${set.series}). Live TCGplayer market valuations, rarities, and card numbers.`,
        canonicalPath: `/set/${set.id}/top-cards`,
        ogImage: set.logoUrl || set.symbolUrl || 'https://deckdivider.app/og-image.png',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Top 20 Most Valuable Cards in ${set.name}`,
          description: `Top chase cards from Pokémon TCG ${set.name} (${set.series})`,
          numberOfItems: topCards.length,
          url: `https://deckdivider.app/set/${set.id}/top-cards`,
          itemListElement: topCards.slice(0, 10).map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            url: `https://deckdivider.app/set/${set.id}`,
          })),
        },
      });
    }
  }, [set, topCards]);

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 flex items-center justify-between">
            <Link to={`/set/${setId}`} className="inline-flex items-center text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Full {set?.name || 'Set'} Checklist
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E2E8F0] border-t-[#DC143C]"></div>
            </div>
          ) : !set ? (
            <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md mx-auto shadow-xs">
              <h2 className="text-2xl font-bold text-[#0F172A] font-heading mb-2">Expansion Not Found</h2>
              <p className="text-[#64748B] text-sm">The requested set could not be located in our database.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10 sm:mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-[#DC143C]/10 rounded-full mb-4">
                  <TrendingUp className="w-7 h-7 text-[#DC143C]" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-heading mb-3 tracking-tight">
                  Most Valuable Cards in {set.name}
                </h1>
                <p className="text-[#64748B] text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  The top chase cards and highest-value pulls from the {set.series} expansion, updated with live market data.
                </p>
              </div>

              {topCards.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
                  No pricing data available for this set.
                </div>
              ) : (
                <div className="space-y-4">
                  {topCards.map((card, idx) => {
                    const price = card.tcgplayer?.price || card.tcgplayer?.trendPrice || 0;
                    
                    return (
                      <div key={card.id} className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-sm font-mono font-bold shadow-2xs">
                          #{idx + 1}
                        </div>
                        
                        <div className="w-28 sm:w-32 flex-shrink-0">
                          <div className="aspect-[63/88] rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs">
                             <HolographicCard
                                card={card}
                                className="w-full h-full object-cover"
                              />
                          </div>
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left min-w-0">
                          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] font-heading mb-1">{card.name}</h2>
                          <div className="text-xs text-[#64748B] mb-2 font-mono">
                            {card.number} / {set.printedTotal} • {card.rarity || 'Unknown Rarity'}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-center sm:text-right bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3 min-w-[140px]">
                          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Market Value</div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] font-num">
                            ${price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {topCards.length > 0 && (
                <div className="mt-12 text-center bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-2">Track {set.name} in Your Collection</h3>
                  <p className="text-[#64748B] text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                    Add raw singles, graded slabs, or sealed booster boxes to your DECK / divider vault with real-time portfolio valuation.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to={`/set/${set.id}`}
                      className="px-6 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-mono font-bold text-xs rounded-xl transition-colors border border-[#CBD5E1] shadow-2xs"
                    >
                      View Full {set.name} Checklist
                    </Link>
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-colors shadow-2xs"
                    >
                      Track in DECK / divider Vault
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
