import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Layers } from 'lucide-react';
import { CardSet, PokemonCard } from '../types';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HolographicCard } from '../components/HolographicCard';
import { getExpansionsCatalog, getCardsBySetCatalog } from '../lib/dataSyncEngine';

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
      const canonicalUrl = `https://deckdivider.app/set/${set.id}/top-cards`;
      document.title = `Top 20 Most Expensive Cards in ${set.name} | DECK / divider`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Discover the most valuable and best cards to pull from ${set.name} (${set.series}). Live TCGplayer market prices and collector statistics.`);
      }
    }
  }, [set, topCards]);

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
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          
          <div className="mb-6 flex items-center justify-between">
            <Link to={`/set/${setId}`} className="inline-flex items-center text-sm text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Full {set?.name || 'Set'} Checklist
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
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-[#38BDF8]/10 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-[#38BDF8]" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Most Valuable Cards in {set.name}
                </h1>
                <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
                  The top chase cards and highest-value pulls from the {set.series} expansion, updated with live market data.
                </p>
              </div>

              {topCards.length === 0 ? (
                <div className="text-center py-20 text-[#64748B]">
                  No pricing data available for this set.
                </div>
              ) : (
                <div className="space-y-4">
                  {topCards.map((card, idx) => {
                    const price = card.tcgplayer?.price || card.tcgplayer?.trendPrice || 0;
                    
                    return (
                      <div key={card.id} className="bg-[#111827] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 transition-colors">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E293B] text-xl font-bold text-[#94A3B8]">
                          #{idx + 1}
                        </div>
                        
                        <div className="w-32 flex-shrink-0">
                          <div className="aspect-[63/88] rounded-lg overflow-hidden bg-[#1E293B]">
                             <HolographicCard
                                card={card}
                                className="w-full h-full object-cover"
                              />
                          </div>
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="text-xl font-bold text-white mb-1">{card.name}</h2>
                          <div className="text-sm text-[#64748B] mb-2 font-mono">
                            {card.number} / {set.printedTotal} • {card.rarity || 'Unknown Rarity'}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-center sm:text-right">
                          <div className="text-sm text-[#94A3B8] mb-1">Market Value</div>
                          <div className="text-3xl font-bold text-[#10B981]">
                            ${price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
