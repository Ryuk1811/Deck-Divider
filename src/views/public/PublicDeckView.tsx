import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Share2, Sparkles, Check } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead } from '../../components/seo/PageHead';
import { getCollectionDeckBySlug } from '../../data/collectionDecks';
import { decodeUrlParamToDeck } from '../../utils/deckUrlEncoder';
import { Deck, DisplayCurrency } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PublicDeckViewProps {
  deckId?: string;
  encodedData?: string;
  onOpenFullApp?: () => void;
  activeCurrency?: DisplayCurrency;
  onCurrencyChange?: (c: DisplayCurrency) => void;
}

export const PublicDeckView: React.FC<PublicDeckViewProps> = ({ deckId, encodedData, activeCurrency = 'USD' }) => {
  const { slugOrId } = useParams<{ slugOrId?: string }>();
  const targetId = slugOrId || deckId;
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    if (encodedData) {
      const decoded = decodeUrlParamToDeck(encodedData);
      if (decoded) {
        setDeck(decoded);
        return;
      }
    }
    if (!targetId) return;
    const curated = getCollectionDeckBySlug(targetId);
    if (curated) {
      setDeck({
        id: curated.id,
        name: curated.name,
        description: curated.description,
        colorHex: curated.colorHex,
        isPublic: true,
        entries: curated.entries.map((e, idx) => ({
          id: `entry-${idx}`,
          cardId: e.cardId,
          quantity: e.quantity,
          condition: 'NM',
          purchasePrice: e.price,
          purchaseCurrency: 'USD',
          purchaseDate: new Date().toISOString().split('T')[0],
          isSold: false,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const dParam = params.get('d') || params.get('r');
    if (dParam) {
      const decoded = decodeUrlParamToDeck(dParam);
      if (decoded) {
        setDeck(decoded);
      }
    }
  }, [targetId, encodedData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PageHead
        title={deck ? `${deck.name} — Curated Collection Deck` : 'Public Collection Deck'}
        description={deck?.description || 'View community collection deck showcase on DECK / divider.'}
        canonicalPath={window.location.pathname}
      />
      <LandingNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#DC143C] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Studio
          </Link>
        </div>

        {deck ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#DC143C]">
                    Collection Deck
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{deck.name}</h1>
                <p className="text-sm text-slate-600 mt-1">{deck.description || 'Curated Pokémon TCG collection deck showcase.'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Deck link copied to clipboard!');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share Deck
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-slate-500 tracking-wider mb-4">
                Deck Entries ({deck.entries.length} items)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {deck.entries.map((entry, idx) => (
                  <div key={entry.id || idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-slate-400 block">#{entry.cardId}</span>
                      <span className="text-sm font-bold text-slate-900">{entry.card?.name || `Card ${entry.cardId}`}</span>
                      <span className="text-xs text-slate-500 block">Qty: {entry.quantity}</span>
                    </div>
                    {entry.purchasePrice > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {formatCurrency(entry.purchasePrice * entry.quantity, activeCurrency)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">Deck Not Found</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              The requested deck could not be loaded or may have been removed. Explore our public directory or start building your own collection decks in the studio.
            </p>
            <Link to="/" className="inline-block px-6 py-3 bg-[#DC143C] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-red-700 transition-colors">
              Go to Studio
            </Link>
          </div>
        )}
      </main>
      <LandingFooter />
    </div>
  );
};
